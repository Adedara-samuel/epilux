/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ArrowLeft, CreditCard, Lock, MapPin, ShieldCheck, ShoppingCart, Wallet } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCartSummary, useClearCart } from '@/hooks/useCart';
import { useCreateOrder, useInitializePayment } from '@/hooks/usePayment';
import { useUserAddresses } from '@/hooks/useUser';
import { useWalletBalance } from '@/hooks/useWallet';
import { userAPI } from '@/services/user';
import { getErrorMessage } from '@/services/base';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { EmptyState, PageHeader, Panel } from '@/Components/ui/kit';
import { formatNaira, fullName } from '@/lib/format';
import { handleImageError, resolveImageUrl } from '@/lib/images';
import { cn } from '@/lib/utils';

const NIGERIAN_STATES = [
    'Abia', 'Abuja (FCT)', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi',
    'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa',
    'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
];

type PaymentChoice = 'flutterwave' | 'wallet';

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
    return <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold">{children}</label>;
}

export default function CheckoutPage() {
    const router = useRouter();
    const { user } = useAuth();
    const { lines, subtotal, deliveryFee, total, isLoading: cartLoading } = useCartSummary();
    const { data: addressData } = useUserAddresses();
    const { data: wallet } = useWalletBalance();
    const createOrder = useCreateOrder();
    const initPayment = useInitializePayment();
    const clearCart = useClearCart();

    const saved = addressData?.addresses?.[0];
    const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: '', state: 'Lagos', landmark: '', instructions: '' });
    const [saveAddress, setSaveAddress] = useState(true);
    const [payment, setPayment] = useState<PaymentChoice>('flutterwave');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);
    const [prefilled, setPrefilled] = useState(false);

    // Prefill once from the profile and saved address
    useEffect(() => {
        if (prefilled || !user) return;
        setForm((f) => ({
            ...f,
            name: fullName(user),
            email: user.email || '',
            phone: user.profile?.phone || '',
            address: saved?.street || f.address,
            city: saved?.city || f.city,
            state: saved?.state || f.state,
        }));
        if (saved || user) setPrefilled(true);
    }, [user, saved, prefilled]);

    const walletBalance = Number(wallet?.availableBalance) || 0;
    const walletCovers = walletBalance >= total && total > 0;

    const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm((f) => ({ ...f, [key]: e.target.value }));
        if (errors[key]) setErrors((er) => ({ ...er, [key]: '' }));
    };

    const validate = () => {
        const e: Record<string, string> = {};
        if (form.name.trim().length < 2) e.name = 'Enter the name for this delivery';
        if (!/^(\+?234|0)[789][01]\d{8}$/.test(form.phone.replace(/\s/g, ''))) e.phone = 'Enter a valid phone number for the marketer to call';
        if (form.address.trim().length < 5) e.address = 'Enter your street address';
        if (form.city.trim().length < 2) e.city = 'Enter your city or area';
        if (!form.state) e.state = 'Choose your state';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const placeOrder = async () => {
        if (!validate()) {
            toast.error('Please check your delivery details');
            document.getElementById('delivery')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }
        if (payment === 'wallet' && !walletCovers) {
            toast.error('Your wallet balance does not cover this order');
            return;
        }

        setSubmitting(true);
        try {
            // Keep the profile current so marketers can reach the customer
            const phone = form.phone.replace(/\s/g, '');
            if (phone !== (user?.profile?.phone || '')) {
                userAPI.updateProfile({ phone }).catch(() => {});
            }
            if (saveAddress) {
                userAPI.addAddress({ street: form.address.trim(), city: form.city.trim(), state: form.state, country: 'Nigeria' }).catch(() => {});
            }

            const instructions = [form.instructions.trim(), `Contact: ${form.name.trim()} ${phone}`].filter(Boolean).join(' · ');
            const order = await createOrder.mutateAsync({
                items: lines.map((l) => ({ product: l.productId, quantity: l.quantity })),
                shippingAddress: {
                    address: form.address.trim(),
                    city: form.city.trim(),
                    state: form.state,
                    country: 'Nigeria',
                    landmark: form.landmark.trim() || undefined,
                    deliveryInstructions: instructions,
                },
                paymentMethod: payment === 'wallet' ? 'wallet' : 'flutterwave',
            });
            const orderId: string = order?.data?.orderId;

            if (payment === 'wallet') {
                await clearCart.mutateAsync().catch(() => {});
                toast.success('Order placed and paid from your wallet!');
                router.push(`/account/orders/${orderId}?placed=1`);
                return;
            }

            try {
                const init = await initPayment.mutateAsync({ orderId, customer: { email: form.email || user?.email, phone, name: form.name.trim() } });
                const url = init?.data?.paymentUrl || init?.data?.link;
                if (!url) throw new Error('No payment link returned');
                window.location.href = url;
            } catch (err) {
                // The order exists; let the customer pay for it from their orders
                toast.error(getErrorMessage(err, 'We could not open the payment page. You can pay from your orders.'));
                router.push(`/account/orders/${orderId}`);
            }
        } catch (err) {
            toast.error(getErrorMessage(err, 'Could not place your order. Please try again.'));
            setSubmitting(false);
        }
    };

    const summary = useMemo(() => lines.slice(0, 6), [lines]);

    if (cartLoading) {
        return (
            <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
                <div className="skeleton-shimmer h-[520px] rounded-3xl" />
                <div className="skeleton-shimmer h-96 rounded-3xl" />
            </div>
        );
    }

    if (lines.length === 0) {
        return (
            <Panel className="mx-auto max-w-xl">
                <EmptyState icon={ShoppingCart} title="Your cart is empty" description="Add products to your cart before checking out." action={{ label: 'Browse products', href: '/products' }} />
            </Panel>
        );
    }

    const inputClass = (key: string) => cn('h-12 rounded-xl', errors[key] && 'border-destructive focus-visible:ring-destructive/20');

    return (
        <div className="pb-24 lg:pb-0">
            <Link href="/cart" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
                <ArrowLeft className="size-4" /> Back to cart
            </Link>
            <PageHeader title="Checkout" description="Confirm where we should deliver and how you'd like to pay." />

            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:items-start">
                <div className="space-y-6">
                    {/* Delivery */}
                    <Panel id="delivery" className="animate-fade-in scroll-mt-24 p-5 sm:p-7">
                        <div className="mb-6 flex items-center gap-3">
                            <span className="grid size-10 place-items-center rounded-xl bg-accent text-primary"><MapPin className="size-5" /></span>
                            <div>
                                <h2 className="text-lg font-bold">Delivery details</h2>
                                <p className="text-sm text-muted-foreground">Your marketer will use these to reach you.</p>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <FieldLabel htmlFor="name">Full name</FieldLabel>
                                <Input id="name" autoComplete="name" value={form.name} onChange={set('name')} className={inputClass('name')} />
                                {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
                            </div>
                            <div>
                                <FieldLabel htmlFor="phone">Phone number</FieldLabel>
                                <Input id="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="0803 123 4567" value={form.phone} onChange={set('phone')} className={inputClass('phone')} />
                                {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
                            </div>
                            <div className="sm:col-span-2">
                                <FieldLabel htmlFor="address">Street address</FieldLabel>
                                <Input id="address" autoComplete="street-address" placeholder="House number and street" value={form.address} onChange={set('address')} className={inputClass('address')} />
                                {errors.address && <p className="mt-1 text-xs text-destructive">{errors.address}</p>}
                            </div>
                            <div>
                                <FieldLabel htmlFor="city">City / area</FieldLabel>
                                <Input id="city" autoComplete="address-level2" placeholder="e.g. Ikeja" value={form.city} onChange={set('city')} className={inputClass('city')} />
                                {errors.city && <p className="mt-1 text-xs text-destructive">{errors.city}</p>}
                            </div>
                            <div>
                                <FieldLabel htmlFor="state">State</FieldLabel>
                                <select id="state" value={form.state} onChange={set('state')} className="h-12 w-full rounded-xl border border-input bg-card px-3.5 text-sm shadow-xs outline-none focus:border-ring focus:ring-4 focus:ring-ring/20">
                                    {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="sm:col-span-2">
                                <FieldLabel htmlFor="landmark">Nearest landmark <span className="font-normal text-muted-foreground">(optional)</span></FieldLabel>
                                <Input id="landmark" placeholder="e.g. Opposite the filling station" value={form.landmark} onChange={set('landmark')} className="h-12 rounded-xl" />
                            </div>
                            <div className="sm:col-span-2">
                                <FieldLabel htmlFor="instructions">Delivery instructions <span className="font-normal text-muted-foreground">(optional)</span></FieldLabel>
                                <Textarea id="instructions" rows={2} maxLength={300} placeholder="Gate code, best time to deliver…" value={form.instructions} onChange={set('instructions')} className="rounded-xl" />
                            </div>
                        </div>

                        <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm">
                            <input type="checkbox" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} className="size-4 rounded accent-[var(--primary)]" />
                            Save this address for next time
                        </label>
                    </Panel>

                    {/* Payment */}
                    <Panel className="animate-fade-in p-5 sm:p-7" style={{ animationDelay: '60ms' }}>
                        <div className="mb-6 flex items-center gap-3">
                            <span className="grid size-10 place-items-center rounded-xl bg-accent text-primary"><CreditCard className="size-5" /></span>
                            <div>
                                <h2 className="text-lg font-bold">Payment</h2>
                                <p className="text-sm text-muted-foreground">Choose how you&apos;d like to pay.</p>
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Payment method">
                            {([
                                { value: 'flutterwave', icon: CreditCard, title: 'Card, transfer or USSD', text: 'Pay securely with Flutterwave', disabled: false },
                                { value: 'wallet', icon: Wallet, title: 'Wallet balance', text: walletCovers ? `${formatNaira(walletBalance)} available` : `${formatNaira(walletBalance)} available · not enough`, disabled: !walletCovers },
                            ] as const).map((option) => {
                                const active = payment === option.value;
                                const Icon = option.icon;
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        role="radio"
                                        aria-checked={active}
                                        disabled={option.disabled}
                                        onClick={() => setPayment(option.value)}
                                        className={cn(
                                            'relative flex items-start gap-3 rounded-2xl border-2 p-4 text-left transition-[border-color,background-color,box-shadow] duration-200 disabled:cursor-not-allowed disabled:opacity-55',
                                            active ? 'border-primary bg-accent/60 shadow-brand' : 'border-border hover:border-brand-500/40'
                                        )}
                                    >
                                        <span className={cn('grid size-10 shrink-0 place-items-center rounded-xl', active ? 'bg-primary text-white' : 'bg-muted text-muted-foreground')}>
                                            <Icon className="size-5" />
                                        </span>
                                        <span>
                                            <span className="block font-semibold">{option.title}</span>
                                            <span className="block text-sm text-muted-foreground">{option.text}</span>
                                        </span>
                                        <span className={cn('absolute right-4 top-4 grid size-5 place-items-center rounded-full border-2', active ? 'border-primary' : 'border-border')}>
                                            {active && <motion.span layoutId="pay-dot" className="size-2.5 rounded-full bg-primary" />}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </Panel>
                </div>

                {/* Summary */}
                <Panel className="animate-fade-in p-5 sm:p-6 lg:sticky lg:top-24" style={{ animationDelay: '100ms' }}>
                    <h2 className="text-lg font-bold">Order summary</h2>
                    <ul className="mt-4 space-y-3">
                        {summary.map((line) => (
                            <li key={line.productId} className="flex items-center gap-3">
                                <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                                    <img src={resolveImageUrl(line.image)} alt="" onError={handleImageError} className="h-full w-full object-cover" />
                                    <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-bold text-white">{line.quantity}</span>
                                </span>
                                <span className="min-w-0 flex-1 truncate text-sm font-medium">{line.name}</span>
                                <span className="text-sm font-semibold tabular-nums">{formatNaira(line.lineTotal)}</span>
                            </li>
                        ))}
                        {lines.length > summary.length && <li className="text-xs text-muted-foreground">+ {lines.length - summary.length} more</li>}
                    </ul>
                    <dl className="mt-5 space-y-3 border-t border-border/70 pt-5 text-sm">
                        <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd className="font-semibold tabular-nums">{formatNaira(subtotal)}</dd></div>
                        <div className="flex justify-between"><dt className="text-muted-foreground">Delivery</dt><dd className="font-semibold tabular-nums">{deliveryFee === 0 ? <span className="text-success">Free</span> : formatNaira(deliveryFee)}</dd></div>
                        <div className="flex items-center justify-between border-t border-border/70 pt-4">
                            <dt className="text-base font-bold">Total to pay</dt>
                            <dd className="text-2xl font-extrabold tracking-tight tabular-nums">{formatNaira(total)}</dd>
                        </div>
                    </dl>
                    <Button variant="brand" size="xl" className="mt-6 hidden w-full rounded-xl lg:flex" onClick={placeOrder} loading={submitting}>
                        <Lock /> {payment === 'wallet' ? `Pay ${formatNaira(total)} from wallet` : `Pay ${formatNaira(total)}`}
                    </Button>
                    <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
                        <ShieldCheck className="size-3.5 shrink-0" /> Your reward is paid into your wallet when you confirm delivery.
                    </p>
                </Panel>
            </div>

            {/* Mobile pay bar above the bottom navigation */}
            <div className="glass fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-20 border-t border-border/70 px-4 py-3 lg:hidden">
                <Button variant="brand" size="lg" className="w-full rounded-xl" onClick={placeOrder} loading={submitting}>
                    <Lock /> {payment === 'wallet' ? `Pay ${formatNaira(total)} from wallet` : `Pay ${formatNaira(total)}`}
                </Button>
            </div>
        </div>
    );
}
