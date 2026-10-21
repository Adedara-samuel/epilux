/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import { ArrowRight, Loader2, ShieldCheck, ShoppingBag, ShoppingCart, Trash2, Truck } from 'lucide-react';
import { useCartSummary, useClearCart, useRemoveFromCart, useUpdateCartItem } from '@/hooks/useCart';
import { getErrorMessage } from '@/services/base';
import { FREE_DELIVERY_THRESHOLD } from '@/services/delivery';
import { Button } from '@/Components/ui/button';
import { EmptyState, ErrorState, PageHeader, Panel, QuantityStepper } from '@/Components/ui/kit';
import { formatNaira } from '@/lib/format';
import { handleImageError, resolveImageUrl } from '@/lib/images';
import { MIN_ORDER_QUANTITY } from '@/lib/constants';
import { CheckoutSteps } from '@/Components/orders/checkout-steps';
import { Progress } from '@/Components/ui/progress';

export default function CartPage() {
    const router = useRouter();
    const { lines, subtotal, itemCount, deliveryFee, total, isLoading, isError, refetch } = useCartSummary();
    const updateItem = useUpdateCartItem();
    const removeItem = useRemoveFromCart();
    const clearCart = useClearCart();

    const toFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
    const progress = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);
    const busyId = (updateItem.isPending && updateItem.variables?.itemId) || (removeItem.isPending && removeItem.variables) || null;

    const changeQty = (productId: string, quantity: number) => {
        updateItem.mutate({ itemId: productId, quantity }, {
            onError: (err) => toast.error(getErrorMessage(err, 'Could not update quantity')),
        });
    };

    const remove = (productId: string, name: string) => {
        removeItem.mutate(productId, {
            onSuccess: () => toast.success(`${name} removed from your cart`),
            onError: (err) => toast.error(getErrorMessage(err, 'Could not remove item')),
        });
    };

    if (isError) {
        return <ErrorState description="We couldn't load your cart." onRetry={() => refetch()} />;
    }

    if (isLoading) {
        return (
            <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
                <div className="space-y-3">{[0, 1, 2].map((i) => <div key={i} className="skeleton-shimmer h-32 rounded-3xl" />)}</div>
                <div className="skeleton-shimmer h-80 rounded-3xl" />
            </div>
        );
    }

    if (lines.length === 0) {
        return (
            <Panel className="mx-auto max-w-xl">
                <EmptyState
                    icon={ShoppingCart}
                    title="Your cart is empty"
                    description="Add some fresh water to get started. Delivery is free on orders from ₦10,000."
                    action={{ label: 'Browse products', href: '/products' }}
                />
            </Panel>
        );
    }

    return (
        <div>
            <CheckoutSteps current={0} />
            <PageHeader
                title="Your cart"
                description={`${itemCount} ${itemCount === 1 ? 'unit' : 'units'} across ${lines.length} ${lines.length === 1 ? 'product' : 'products'}`}
                actions={
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => clearCart.mutate(undefined, { onSuccess: () => toast.success('Cart cleared') })}
                        loading={clearCart.isPending}
                    >
                        <Trash2 /> Clear cart
                    </Button>
                }
            />

            <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
                <div className="space-y-3">
                    {/* Free delivery progress */}
                    <Panel className="animate-fade-in p-4">
                        <div className="flex items-center gap-3">
                            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-primary"><Truck className="size-5" /></span>
                            <p className="text-sm">
                                {toFreeDelivery > 0
                                    ? <>Add <span className="font-bold">{formatNaira(toFreeDelivery)}</span> more for <span className="font-bold text-primary">free delivery</span></>
                                    : <span className="font-semibold text-success">You&apos;ve unlocked free delivery 🎉</span>}
                            </p>
                        </div>
                        <Progress value={progress} className="mt-3" aria-label="Progress towards free delivery" />
                    </Panel>

                    <AnimatePresence initial={false}>
                        {lines.map((line) => {
                            const minQty = Math.min(MIN_ORDER_QUANTITY, Math.max(1, line.stock || line.quantity));
                            const busy = busyId === line.productId;
                            return (
                                <motion.div
                                    key={line.productId}
                                    layout
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -40, height: 0, marginTop: 0 }}
                                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <Panel className="flex gap-4 p-3 sm:p-4">
                                        <Link href={`/products/${line.productId}`} className="size-24 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-50 to-sky-50 sm:size-28">
                                            <img src={resolveImageUrl(line.image)} alt={line.name} onError={handleImageError} className="h-full w-full object-cover" />
                                        </Link>
                                        <div className="flex min-w-0 flex-1 flex-col">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <Link href={`/products/${line.productId}`} className="line-clamp-2 font-bold leading-snug hover:text-primary">{line.name}</Link>
                                                    <p className="mt-0.5 text-sm text-muted-foreground">{formatNaira(line.price)} each</p>
                                                </div>
                                                <button
                                                    onClick={() => remove(line.productId, line.name)}
                                                    className="grid size-9 shrink-0 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                                                    aria-label={`Remove ${line.name}`}
                                                    disabled={busy}
                                                >
                                                    <Trash2 className="size-4" />
                                                </button>
                                            </div>
                                            <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-3">
                                                <div className="flex items-center gap-2">
                                                    <QuantityStepper
                                                        value={line.quantity}
                                                        onChange={(q) => changeQty(line.productId, q)}
                                                        min={minQty}
                                                        max={Math.max(line.stock, line.quantity)}
                                                        size="sm"
                                                        disabled={busy}
                                                    />
                                                    {busy && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
                                                </div>
                                                <p className="text-lg font-extrabold tabular-nums">{formatNaira(line.lineTotal)}</p>
                                            </div>
                                            {line.stock > 0 && line.stock < 20 && <p className="mt-1.5 text-xs font-medium text-amber-600">Only {line.stock} left in stock</p>}
                                        </div>
                                    </Panel>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>

                    <Link href="/products" className="inline-flex items-center gap-1.5 pt-1 text-sm font-semibold text-primary hover:underline">
                        <ShoppingBag className="size-4" /> Continue shopping
                    </Link>
                </div>

                {/* Summary */}
                <Panel className="animate-fade-in p-5 sm:p-6 lg:sticky lg:top-24" style={{ animationDelay: '80ms' }}>
                    <h2 className="text-lg font-bold">Order summary</h2>
                    <dl className="mt-5 space-y-3 text-sm">
                        <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd className="font-semibold tabular-nums">{formatNaira(subtotal)}</dd></div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">Delivery</dt>
                            <dd className="font-semibold tabular-nums">{deliveryFee === 0 ? <span className="text-success">Free</span> : formatNaira(deliveryFee)}</dd>
                        </div>
                        <div className="flex items-center justify-between border-t border-border/70 pt-4">
                            <dt className="text-base font-bold">Total</dt>
                            <dd className="text-2xl font-extrabold tracking-tight tabular-nums">{formatNaira(total)}</dd>
                        </div>
                    </dl>
                    <Button variant="brand" size="xl" className="group mt-6 w-full rounded-xl" onClick={() => router.push('/checkout')} disabled={updateItem.isPending || removeItem.isPending}>
                        Checkout <ArrowRight className="transition-transform group-hover:translate-x-1" />
                    </Button>
                    <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                        <ShieldCheck className="size-3.5" /> Secure payment with Flutterwave
                    </p>
                </Panel>
            </div>
        </div>
    );
}
