/* eslint-disable @next/next/no-img-element */
'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BellRing, ChevronRight, Gift, Package, ShoppingBag } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { EmptyState, ErrorState, OrderStatusPill, PageHeader, Panel } from '@/Components/ui/kit';
import { Stagger, StaggerItem } from '@/Components/motion';
import { formatDate, formatNaira } from '@/lib/format';
import { handleImageError, productImageUrl } from '@/lib/images';
import { ORDER_TIMELINE } from '@/lib/constants';
import { canConfirm, canPay, customerReward, itemProduct, orderId, type CustomerOrder } from '@/Components/orders/order-helpers';
import { cn } from '@/lib/utils';

const TABS = [
    { key: 'all', label: 'All', match: () => true },
    { key: 'active', label: 'Active', match: (o: CustomerOrder) => ['pending', 'processing', 'assigned', 'in_transit', 'delivered'].includes(o.status) },
    { key: 'completed', label: 'Completed', match: (o: CustomerOrder) => o.status === 'completed' },
    { key: 'cancelled', label: 'Cancelled', match: (o: CustomerOrder) => ['cancelled', 'rejected'].includes(o.status) },
] as const;

function ProgressBar({ status }: { status: string }) {
    const step = ORDER_TIMELINE.indexOf(status as (typeof ORDER_TIMELINE)[number]);
    if (step < 0) return null;
    const pct = (step / (ORDER_TIMELINE.length - 1)) * 100;
    return (
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <motion.div className="h-full rounded-full bg-gradient-brand" initial={{ width: 0 }} animate={{ width: `${Math.max(pct, 6)}%` }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} />
        </div>
    );
}

function OrderCard({ order }: { order: CustomerOrder }) {
    const id = orderId(order);
    const reward = customerReward(order);
    const products = order.items.map(itemProduct);
    const units = order.items.reduce((s, i) => s + i.quantity, 0);

    return (
        <Link href={`/account/orders/${id}`} className="group block">
            <Panel className="p-4 transition-[box-shadow,border-color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:border-brand-500/30 group-hover:shadow-lift sm:p-5">
                <div className="flex items-start gap-4">
                    <div className="flex -space-x-3">
                        {products.slice(0, 3).map((p, i) => (
                            <img key={i} src={productImageUrl(p)} alt="" onError={handleImageError} className="size-14 rounded-2xl border-2 border-card object-cover shadow-sm" />
                        ))}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <p className="font-bold">{order.orderNumber}</p>
                            <OrderStatusPill status={order.status} />
                        </div>
                        <p className="mt-0.5 truncate text-sm text-muted-foreground">
                            {products[0]?.name || 'Order'}{order.items.length > 1 ? ` + ${order.items.length - 1} more` : ''} · {units} units · {formatDate(order.createdAt)}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="font-extrabold tabular-nums">{formatNaira(order.totalAmount)}</p>
                        <ChevronRight className="ml-auto mt-1 size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </div>
                </div>

                <div className="mt-4"><ProgressBar status={order.status} /></div>

                {(canPay(order) || canConfirm(order) || (order.status === 'completed' && reward > 0)) && (
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-muted/60 px-4 py-3 text-sm">
                        {canPay(order) && <><span className="text-muted-foreground">Payment needed to send this order for delivery</span><span className="font-semibold text-primary">Pay now →</span></>}
                        {canConfirm(order) && <><span className="text-muted-foreground">Received it? Confirm to get <span className="font-semibold text-foreground">{formatNaira(reward)}</span></span><span className="font-semibold text-primary">Confirm →</span></>}
                        {order.status === 'completed' && reward > 0 && <span className="flex items-center gap-2 font-medium text-success"><Gift className="size-4" /> {formatNaira(reward)} reward paid to your wallet</span>}
                    </div>
                )}
            </Panel>
        </Link>
    );
}

export default function OrdersPage() {
    const { data, isLoading, isError, refetch } = useOrders();
    const [tab, setTab] = useState<(typeof TABS)[number]['key']>('all');

    const orders: CustomerOrder[] = useMemo(() => data?.data || [], [data]);
    const filtered = orders.filter(TABS.find((t) => t.key === tab)!.match);
    const needsAction = orders.filter((o) => canConfirm(o) || canPay(o));

    return (
        <div>
            <PageHeader title="My orders" description="Track deliveries, confirm receipt and collect your rewards." />

            {needsAction.length > 0 && (
                <Panel className="animate-fade-in mb-6 flex items-center gap-4 border-brand-500/30 bg-accent/50 p-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-white"><BellRing className="size-5" /></span>
                    <p className="text-sm">
                        <span className="font-semibold">{needsAction.length} order{needsAction.length > 1 ? 's' : ''} need{needsAction.length === 1 ? 's' : ''} your attention.</span>{' '}
                        <span className="text-muted-foreground">Pay for pending orders or confirm deliveries to receive your rewards.</span>
                    </p>
                </Panel>
            )}

            <div className="-mx-4 mb-5 overflow-x-auto px-4 no-scrollbar sm:mx-0 sm:px-0">
                <div className="inline-flex gap-1 rounded-2xl bg-muted p-1">
                    {TABS.map((t) => {
                        const count = orders.filter(t.match).length;
                        const active = tab === t.key;
                        return (
                            <button key={t.key} onClick={() => setTab(t.key)} className={cn('relative rounded-xl px-4 py-2 text-sm font-semibold transition-colors', active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground')}>
                                {active && <motion.span layoutId="orders-tab" className="absolute inset-0 rounded-xl bg-card shadow-soft" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
                                <span className="relative">{t.label}{count > 0 && <span className="ml-1.5 text-xs text-muted-foreground">{count}</span>}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {isError ? (
                <ErrorState description="We couldn't load your orders." onRetry={() => refetch()} />
            ) : isLoading ? (
                <div className="space-y-3">{[0, 1, 2].map((i) => <div key={i} className="skeleton-shimmer h-36 rounded-3xl" />)}</div>
            ) : orders.length === 0 ? (
                <Panel>
                    <EmptyState icon={Package} title="No orders yet" description="When you place an order, you can track its delivery here." action={{ label: 'Start shopping', href: '/products' }} />
                </Panel>
            ) : filtered.length === 0 ? (
                <Panel><EmptyState icon={ShoppingBag} title="Nothing here" description="No orders match this filter." /></Panel>
            ) : (
                <Stagger key={tab} immediate className="space-y-3" stagger={0.05}>
                    {filtered.map((order) => (
                        <StaggerItem key={orderId(order)}><OrderCard order={order} /></StaggerItem>
                    ))}
                </Stagger>
            )}

            {orders.length > 0 && (
                <Link href="/products" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                    Order again <ArrowRight className="size-4" />
                </Link>
            )}
        </div>
    );
}
