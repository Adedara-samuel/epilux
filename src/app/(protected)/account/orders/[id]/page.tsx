/* eslint-disable @next/next/no-img-element */
'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import {
    ArrowLeft, Check, CheckCircle2, Clock, CreditCard, Gift, MapPin, PackageCheck, PackageX, Phone,
    Star, Truck, User, Wallet, XCircle,
} from 'lucide-react';
import { useCancelOrder, useConfirmOrderReceipt, useOrder, useRateMarketer } from '@/hooks/useOrders';
import { getErrorMessage } from '@/services/base';
import { Button } from '@/Components/ui/button';
import { Textarea } from '@/Components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import {
    AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/Components/ui/alert-dialog';
import { EmptyState, OrderStatusPill, Panel, PanelHeader } from '@/Components/ui/kit';
import { formatDateTime, formatNaira } from '@/lib/format';
import { handleImageError, productImageUrl } from '@/lib/images';
import { ORDER_STATUS_META } from '@/lib/constants';
import { canCancel, canConfirm, canPay, customerReward, itemProduct, type CustomerOrder } from '@/Components/orders/order-helpers';
import { cn } from '@/lib/utils';

const STEPS = [
    { status: 'pending', label: 'Order placed', icon: Clock },
    { status: 'processing', label: 'Payment confirmed', icon: CreditCard },
    { status: 'assigned', label: 'Marketer assigned', icon: User },
    { status: 'in_transit', label: 'Out for delivery', icon: Truck },
    { status: 'delivered', label: 'Delivered', icon: PackageCheck },
    { status: 'completed', label: 'Confirmed & rewarded', icon: Gift },
];

function Timeline({ order }: { order: CustomerOrder }) {
    const current = STEPS.findIndex((s) => s.status === order.status);
    const cancelled = ['cancelled', 'rejected'].includes(order.status);
    const timeFor = (status: string) => {
        const entry = [...(order.statusHistory || [])].reverse().find((h) => h.status === status);
        if (entry) return entry.changedAt;
        if (status === 'pending') return order.createdAt;
        if (status === 'processing') return order.paidAt;
        if (status === 'assigned') return order.assignedAt;
        if (status === 'in_transit') return order.inTransitAt;
        if (status === 'delivered') return order.deliveredAt;
        if (status === 'completed') return order.completedAt;
        return undefined;
    };

    if (cancelled) {
        return (
            <div className="flex items-center gap-3 rounded-2xl bg-destructive/5 p-4 text-sm">
                <XCircle className="size-5 shrink-0 text-destructive" />
                <span>This order was {order.status}{order.cancelledAt ? ` on ${formatDateTime(order.cancelledAt)}` : ''}. Any reserved stock has been released.</span>
            </div>
        );
    }

    return (
        <ol className="relative space-y-0">
            {STEPS.map((step, i) => {
                const done = i <= current;
                const active = i === current;
                const Icon = step.icon;
                const at = done ? timeFor(step.status) : undefined;
                return (
                    <li key={step.status} className="relative flex gap-4 pb-6 last:pb-0">
                        {i < STEPS.length - 1 && (
                            <span className="absolute left-5 top-10 h-[calc(100%-2.5rem)] w-0.5 overflow-hidden bg-border">
                                <motion.span
                                    className="block w-full bg-primary"
                                    initial={{ height: 0 }}
                                    animate={{ height: i < current ? '100%' : 0 }}
                                    transition={{ duration: 0.5, delay: i * 0.12, ease: 'easeOut' }}
                                />
                            </span>
                        )}
                        <motion.span
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: i * 0.08, type: 'spring', stiffness: 400, damping: 24 }}
                            className={cn(
                                'relative z-10 grid size-10 shrink-0 place-items-center rounded-full border-2 transition-colors',
                                done ? 'border-primary bg-primary text-white' : 'border-border bg-card text-muted-foreground',
                                active && 'ring-4 ring-primary/20'
                            )}
                        >
                            {done && !active ? <Check className="size-5" /> : <Icon className="size-5" />}
                            {active && order.status !== 'completed' && <span className="absolute inset-0 animate-ripple rounded-full bg-primary/30" />}
                        </motion.span>
                        <div className="pt-1.5">
                            <p className={cn('font-semibold', !done && 'text-muted-foreground')}>{step.label}</p>
                            {at ? <p className="text-xs text-muted-foreground">{formatDateTime(at)}</p> : active ? <p className="text-xs text-muted-foreground">{ORDER_STATUS_META[step.status]?.description}</p> : null}
                        </div>
                    </li>
                );
            })}
        </ol>
    );
}

function RateDeliveryDialog({ open, onOpenChange, orderId }: { open: boolean; onOpenChange: (v: boolean) => void; orderId: string }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const rate = useRateMarketer();
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md rounded-3xl">
                <DialogHeader><DialogTitle>Rate your delivery</DialogTitle></DialogHeader>
                <div className="flex justify-center gap-1 py-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <motion.button key={s} whileTap={{ scale: 0.85 }} whileHover={{ scale: 1.15 }} onClick={() => setRating(s)} aria-label={`${s} stars`}>
                            <Star className={cn('size-9', s <= rating ? 'fill-amber-400 text-amber-400' : 'text-border')} />
                        </motion.button>
                    ))}
                </div>
                <Textarea rows={3} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="How was the delivery?" className="rounded-xl" />
                <Button
                    className="w-full"
                    loading={rate.isPending}
                    onClick={() => rate.mutate({ orderId, rating, review: comment.trim() || undefined }, {
                        onSuccess: () => { toast.success('Thanks for rating your delivery!'); onOpenChange(false); },
                        onError: (err) => toast.error(getErrorMessage(err, 'Could not submit rating')),
                    })}
                >
                    Submit rating
                </Button>
            </DialogContent>
        </Dialog>
    );
}

function OrderDetail() {
    const { id } = useParams<{ id: string }>();
    const searchParams = useSearchParams();
    const justPlaced = searchParams.get('placed') === '1';
    const { data, isLoading, isError } = useOrder(id);
    const confirm = useConfirmOrderReceipt();
    const cancel = useCancelOrder();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [cancelOpen, setCancelOpen] = useState(false);
    const [rateOpen, setRateOpen] = useState(false);
    const [paidOut, setPaidOut] = useState<number | null>(null);

    const order: CustomerOrder | undefined = data?.data;

    if (isLoading) {
        return (
            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                <div className="skeleton-shimmer h-[520px] rounded-3xl" />
                <div className="skeleton-shimmer h-80 rounded-3xl" />
            </div>
        );
    }

    if (isError || !order) {
        return <EmptyState icon={PackageX} title="Order not found" description="This order doesn't exist or isn't on your account." action={{ label: 'My orders', href: '/account/orders' }} />;
    }

    const reward = customerReward(order);
    const marketer = typeof order.marketer === 'object' && order.marketer ? order.marketer : null;
    const marketerPhone = marketer?.profile?.phone;

    const doConfirm = () => {
        confirm.mutate(id, {
            onSuccess: (res) => {
                const amount = Number(res?.earnings?.yourShare) || 0;
                setConfirmOpen(false);
                setPaidOut(amount);
                toast.success(res?.message || 'Delivery confirmed');
            },
            onError: (err) => toast.error(getErrorMessage(err, 'Could not confirm delivery')),
        });
    };

    const doCancel = () => {
        cancel.mutate(id, {
            onSuccess: () => { setCancelOpen(false); toast.success('Order cancelled'); },
            onError: (err) => toast.error(getErrorMessage(err, 'Could not cancel this order')),
        });
    };

    return (
        <div>
            <Link href="/account/orders" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
                <ArrowLeft className="size-4" /> All orders
            </Link>

            {justPlaced && order.isPaid && (
                <Panel className="animate-fade-in mb-6 flex items-center gap-4 border-success/30 bg-success/5 p-4">
                    <CheckCircle2 className="size-6 shrink-0 text-success" />
                    <p className="text-sm"><span className="font-semibold">Order placed!</span> We&apos;re assigning a marketer to deliver it.</p>
                </Panel>
            )}

            <AnimatePresence>
                {paidOut !== null && (
                    <motion.div initial={{ opacity: 0, y: -10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} className="mb-6">
                        <div className="aurora relative overflow-hidden rounded-3xl p-6 text-white">
                            <div className="relative flex items-center gap-4">
                                <motion.span initial={{ rotate: -20, scale: 0.5 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 12 }} className="grid size-14 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/25">
                                    <Gift className="size-7" />
                                </motion.span>
                                <div>
                                    <p className="text-lg font-extrabold text-white">{paidOut > 0 ? `${formatNaira(paidOut)} added to your wallet!` : 'Delivery confirmed!'}</p>
                                    <p className="text-sm text-white/75">Thanks for confirming. Withdrawals open on the monthly payout window.</p>
                                </div>
                                <Button asChild variant="secondary" className="ml-auto hidden sm:inline-flex"><Link href="/products/wallet"><Wallet /> Wallet</Link></Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                <div>
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{order.orderNumber}</h1>
                        <OrderStatusPill status={order.status} />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">Placed {formatDateTime(order.createdAt)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {canPay(order) && <Button asChild variant="brand"><Link href={`/payment/${id}`}><CreditCard /> Pay {formatNaira(order.totalAmount)}</Link></Button>}
                    {canConfirm(order) && <Button variant="success" onClick={() => setConfirmOpen(true)}><PackageCheck /> I&apos;ve received my order</Button>}
                    {order.status === 'completed' && marketer && <Button variant="outline" onClick={() => setRateOpen(true)}><Star /> Rate delivery</Button>}
                    {canCancel(order) && <Button variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => setCancelOpen(true)}>Cancel order</Button>}
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
                <div className="space-y-6">
                    <Panel>
                        <PanelHeader title="Delivery progress" description={ORDER_STATUS_META[order.status]?.description} />
                        <div className="p-5 sm:p-6"><Timeline order={order} /></div>
                    </Panel>

                    <Panel>
                        <PanelHeader title="Items" description={`${order.items.reduce((s, i) => s + i.quantity, 0)} units`} />
                        <ul className="divide-y divide-border/60">
                            {order.items.map((item, i) => {
                                const product = itemProduct(item);
                                return (
                                    <li key={i} className="flex items-center gap-4 px-5 py-4 sm:px-6">
                                        <img src={productImageUrl(product)} alt="" onError={handleImageError} className="size-16 rounded-2xl object-cover" />
                                        <div className="min-w-0 flex-1">
                                            {product?._id ? <Link href={`/products/${product._id}`} className="line-clamp-1 font-semibold hover:text-primary">{product.name}</Link> : <p className="font-semibold">{product?.name || 'Product no longer available'}</p>}
                                            <p className="text-sm text-muted-foreground">{item.quantity} × {formatNaira(item.price)}</p>
                                        </div>
                                        <p className="font-bold tabular-nums">{formatNaira(item.price * item.quantity)}</p>
                                    </li>
                                );
                            })}
                        </ul>
                        <dl className="space-y-2 border-t border-border/60 px-5 py-4 text-sm sm:px-6">
                            <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd className="tabular-nums">{formatNaira(order.subtotal ?? order.totalAmount - (order.deliveryFee || 0))}</dd></div>
                            <div className="flex justify-between"><dt className="text-muted-foreground">Delivery</dt><dd className="tabular-nums">{order.deliveryFee ? formatNaira(order.deliveryFee) : 'Free'}</dd></div>
                            <div className="flex justify-between text-base font-bold"><dt>Total</dt><dd className="tabular-nums">{formatNaira(order.totalAmount)}</dd></div>
                        </dl>
                    </Panel>
                </div>

                <div className="space-y-6">
                    {reward > 0 && !['cancelled', 'rejected'].includes(order.status) && (
                        <Panel className="overflow-hidden">
                            <div className="bg-gradient-sun p-5 text-white">
                                <Gift className="size-6" />
                                <p className="mt-3 text-sm font-medium text-white/90">{order.commissionReleased ? 'Reward paid' : 'Your reward'}</p>
                                <p className="text-3xl font-extrabold tabular-nums">{formatNaira(reward)}</p>
                                <p className="mt-1 text-xs text-white/85">
                                    {order.commissionReleased ? 'Credited to your wallet.' : 'Paid into your wallet when you confirm delivery.'}
                                </p>
                            </div>
                        </Panel>
                    )}

                    <Panel className="p-5 sm:p-6">
                        <h2 className="font-bold">Your marketer</h2>
                        {marketer ? (
                            <div className="mt-4 flex items-center gap-3">
                                <span className="grid size-12 place-items-center rounded-2xl bg-gradient-brand font-bold text-white">
                                    {(marketer.firstName || 'M').charAt(0)}{(marketer.lastName || '').charAt(0)}
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-semibold">{[marketer.firstName, marketer.lastName].filter(Boolean).join(' ') || 'Epilux marketer'}</p>
                                    <p className="text-xs text-muted-foreground">Delivering your order</p>
                                </div>
                                {marketerPhone && (
                                    <Button asChild size="icon" variant="soft" aria-label="Call marketer"><a href={`tel:${marketerPhone}`}><Phone /></a></Button>
                                )}
                            </div>
                        ) : (
                            <p className="mt-2 text-sm text-muted-foreground">{order.isPaid ? 'A marketer will be assigned shortly.' : 'A marketer is assigned once payment is confirmed.'}</p>
                        )}
                    </Panel>

                    <Panel className="p-5 sm:p-6">
                        <h2 className="flex items-center gap-2 font-bold"><MapPin className="size-4 text-primary" /> Delivery address</h2>
                        <p className="mt-3 text-sm">{order.shippingAddress?.address}</p>
                        <p className="text-sm text-muted-foreground">{[order.shippingAddress?.city, order.shippingAddress?.state].filter(Boolean).join(', ')}</p>
                        {order.shippingAddress?.landmark && <p className="mt-1 text-xs text-muted-foreground">Landmark: {order.shippingAddress.landmark}</p>}
                        {order.shippingAddress?.deliveryInstructions && <p className="mt-2 rounded-xl bg-muted/60 p-3 text-xs text-muted-foreground">{order.shippingAddress.deliveryInstructions}</p>}
                    </Panel>

                    <Panel className="p-5 sm:p-6">
                        <h2 className="font-bold">Payment</h2>
                        <div className="mt-3 flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{order.paymentMethod === 'wallet' ? 'Wallet' : 'Card / transfer / USSD'}</span>
                            {order.isPaid ? <span className="font-semibold text-success">Paid{order.paidAt ? ` · ${formatDateTime(order.paidAt)}` : ''}</span> : <span className="font-semibold text-amber-600">Not paid</span>}
                        </div>
                    </Panel>
                </div>
            </div>

            {/* Confirm delivery */}
            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm you received this order?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Only confirm once you have all the items. This completes the order
                            {reward > 0 ? <> and pays <span className="font-semibold text-foreground">{formatNaira(reward)}</span> into your wallet</> : null}.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Not yet</AlertDialogCancel>
                        {/* A plain Button so the dialog stays open while the request runs */}
                        <Button variant="success" onClick={doConfirm} loading={confirm.isPending}><Check /> Yes, I received it</Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Cancel */}
            <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cancel this order?</AlertDialogTitle>
                        <AlertDialogDescription>The order will be cancelled and the items released. This can&apos;t be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Keep order</AlertDialogCancel>
                        <Button variant="destructive" onClick={doCancel} loading={cancel.isPending}>Cancel order</Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <RateDeliveryDialog open={rateOpen} onOpenChange={setRateOpen} orderId={id} />
        </div>
    );
}

export default function OrderDetailPage() {
    return (
        <Suspense fallback={null}>
            <OrderDetail />
        </Suspense>
    );
}
