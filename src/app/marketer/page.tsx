/* eslint-disable @next/next/no-img-element */
'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import {
    CheckCircle2, Clock, MapPin, MessageSquareText, Navigation, PackageCheck, Phone, RefreshCw, Search, ShieldAlert, Truck, Undo2, Wallet,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useMarketerOrders, useMarketerStats, useUpdateOrderStatus } from '@/hooks/useMarketer';
import { getErrorMessage } from '@/services/base';
import type { MarketerAction, Order } from '@/services/marketer';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Tabs, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import {
    AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/Components/ui/alert-dialog';
import { EmptyState, ErrorState, OrderStatusPill, PageHeader, Panel, Pill, StatTile } from '@/Components/ui/kit';
import { Stagger, StaggerItem } from '@/Components/motion';
import { formatNaira, timeAgo } from '@/lib/format';
import { handleImageError, resolveImageUrl } from '@/lib/images';

const TABS = {
    todo: { label: 'To deliver', short: 'To deliver', statuses: ['assigned', 'in_transit'] },
    awaiting: { label: 'Awaiting customer', short: 'Waiting', statuses: ['delivered'] },
    done: { label: 'Completed', short: 'Done', statuses: ['completed'] },
} as const;
type TabKey = keyof typeof TABS;

const ACTION_COPY: Record<MarketerAction, { title: string; description: string; confirm: string; success: string; noteLabel: string; notePlaceholder: string; noteRequired?: boolean }> = {
    in_transit: {
        title: 'Start this delivery?',
        description: 'The customer will see that their order is on the way.',
        confirm: 'Start delivery',
        success: 'Delivery started',
        noteLabel: 'Note (optional)',
        notePlaceholder: 'e.g. Leaving the depot now',
    },
    delivered: {
        title: 'Mark as delivered?',
        description: 'Only do this once the customer has the goods. They will be asked to confirm receipt.',
        confirm: 'Yes, delivered',
        success: 'Marked as delivered. Waiting for the customer to confirm.',
        noteLabel: 'Delivery note (optional)',
        notePlaceholder: 'e.g. Handed to the customer at the gate',
    },
    declined: {
        title: 'Decline this order?',
        description: "It will be passed to another marketer. Use this only if you can't make the delivery.",
        confirm: 'Decline order',
        success: 'Order declined and passed on',
        noteLabel: 'Reason',
        notePlaceholder: "e.g. Too far from my area, or I'm unavailable today",
        noteRequired: true,
    },
};

const mapsUrl = (o: Order) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([o.shippingAddress?.address, o.shippingAddress?.city, o.shippingAddress?.state, 'Nigeria'].filter(Boolean).join(', '))}`;

// Checkout stores "… · Contact: Name 0803…" in the instructions; use that phone if the profile has none
const contactPhone = (o: Order) => o.customer.phone || o.shippingAddress?.deliveryInstructions?.match(/(\+?234|0)[789][01]\d{8}/)?.[0] || '';

function DeliveryOrderCard({ order, onAction }: { order: Order; onAction: (order: Order, action: MarketerAction) => void }) {
    const phone = contactPhone(order);
    const units = order.items.reduce((n, i) => n + i.quantity, 0);
    const addr = order.shippingAddress;

    return (
        <Panel className="overflow-hidden">
            <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5">
                <div className="min-w-0">
                    <p className="font-bold">{order.orderNumber}</p>
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Clock className="size-3.5" /> Assigned {timeAgo(order.assignedAt || order.createdAt)}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {order.isPaid && <Pill tone="success">Paid{order.paymentMethod === 'wallet' ? ' · wallet' : ''}</Pill>}
                    <OrderStatusPill status={order.status} />
                </div>
            </div>

            <div className="grid gap-4 p-5 md:grid-cols-[1.2fr_1fr]">
                {/* Where and who */}
                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent text-primary"><MapPin className="size-4" /></span>
                        <div className="min-w-0 text-sm">
                            <p className="font-semibold">{addr?.address || 'No address given'}</p>
                            <p className="text-muted-foreground">{[addr?.city, addr?.state].filter(Boolean).join(', ')}</p>
                            {addr?.landmark && <p className="mt-1 text-muted-foreground">Landmark: {addr.landmark}</p>}
                        </div>
                    </div>
                    {addr?.deliveryInstructions && (
                        <div className="flex items-start gap-3">
                            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10"><MessageSquareText className="size-4" /></span>
                            <p className="min-w-0 text-sm text-muted-foreground">{addr.deliveryInstructions}</p>
                        </div>
                    )}
                    <div className="flex flex-wrap gap-2 pt-1">
                        {phone && <Button asChild size="sm" variant="outline"><a href={`tel:${phone}`}><Phone /> Call {order.customer.name.split(' ')[0] || 'customer'}</a></Button>}
                        <Button asChild size="sm" variant="outline"><a href={mapsUrl(order)} target="_blank" rel="noopener noreferrer"><Navigation /> Directions</a></Button>
                    </div>
                </div>

                {/* What */}
                <div className="rounded-2xl bg-muted/50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{units} unit{units === 1 ? '' : 's'} for {order.customer.name || 'the customer'}</p>
                    <ul className="mt-3 space-y-2">
                        {order.items.map((item, i) => (
                            <li key={`${item.productId}-${i}`} className="flex items-center gap-3 text-sm">
                                <img src={resolveImageUrl(item.image)} onError={handleImageError} alt="" className="size-9 rounded-lg bg-card object-cover" />
                                <span className="min-w-0 flex-1 truncate">{item.name}</span>
                                <span className="font-semibold tabular-nums">×{item.quantity}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-3 flex justify-between border-t border-border/60 pt-3 text-sm">
                        <span className="text-muted-foreground">Order total</span>
                        <span className="font-bold tabular-nums">{formatNaira(order.totalAmount)}</span>
                    </div>
                </div>
            </div>

            {(order.status === 'assigned' || order.status === 'in_transit') && (
                <div className="flex flex-col-reverse gap-2 border-t border-border/60 bg-muted/30 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive" onClick={() => onAction(order, 'declined')}>
                        <Undo2 /> Can&apos;t deliver
                    </Button>
                    <div className="flex flex-col gap-2 sm:flex-row">
                        {order.status === 'assigned' && (
                            <Button variant="outline" onClick={() => onAction(order, 'in_transit')}><Truck /> Start delivery</Button>
                        )}
                        <Button variant="success" onClick={() => onAction(order, 'delivered')}><PackageCheck /> Mark delivered</Button>
                    </div>
                </div>
            )}
            {order.status === 'delivered' && (
                <div className="flex items-center gap-2 border-t border-border/60 bg-muted/30 px-5 py-3 text-sm text-muted-foreground">
                    <Clock className="size-4" /> Delivered {timeAgo(order.deliveredAt)}. Waiting for the customer to confirm.
                </div>
            )}
            {order.status === 'completed' && (
                <div className="flex items-center gap-2 border-t border-border/60 bg-emerald-50/60 px-5 py-3 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                    <CheckCircle2 className="size-4" /> Confirmed by the customer {timeAgo(order.completedAt)}
                </div>
            )}
        </Panel>
    );
}

export default function MarketerPage() {
    const { user, initializing } = useAuth();
    const isMarketer = user?.role === 'marketer' || user?.role === 'admin';
    const { data: orders = [], isLoading, isError, refetch, isFetching } = useMarketerOrders({ limit: 100 }, isMarketer);
    const { data: stats } = useMarketerStats(isMarketer);
    const update = useUpdateOrderStatus();

    const [tab, setTab] = useState<TabKey>('todo');
    const [search, setSearch] = useState('');
    const [pending, setPending] = useState<{ order: Order; action: MarketerAction } | null>(null);
    const [note, setNote] = useState('');

    const counts = useMemo(() => {
        const c = { todo: 0, awaiting: 0, done: 0 } as Record<TabKey, number>;
        orders.forEach((o) => (Object.keys(TABS) as TabKey[]).forEach((k) => { if ((TABS[k].statuses as readonly string[]).includes(o.status)) c[k] += 1; }));
        return c;
    }, [orders]);

    const shown = useMemo(() => {
        const q = search.trim().toLowerCase();
        return orders
            .filter((o) => (TABS[tab].statuses as readonly string[]).includes(o.status))
            .filter((o) => !q || [o.orderNumber, o.customer.name, o.shippingAddress?.address, o.shippingAddress?.city].some((v) => v?.toLowerCase().includes(q)));
    }, [orders, tab, search]);

    const openAction = (order: Order, action: MarketerAction) => { setNote(''); setPending({ order, action }); };

    const confirmAction = () => {
        if (!pending) return;
        const copy = ACTION_COPY[pending.action];
        if (copy.noteRequired && note.trim().length < 3) return toast.error('Please give a short reason');
        update.mutate({ id: pending.order._id, status: pending.action, note: note.trim() || undefined }, {
            onSuccess: (res) => { toast.success(res?.message || copy.success); setPending(null); },
            onError: (err) => toast.error(getErrorMessage(err, 'Could not update the order')),
        });
    };

    if (!initializing && user && !isMarketer) {
        return (
            <Panel className="mx-auto max-w-xl">
                <EmptyState icon={ShieldAlert} title="Marketers only" description="This page is for Epilux marketers. If you deliver for us, ask an admin to set up your marketer account." action={{ label: 'Back to shop', href: '/products' }} />
            </Panel>
        );
    }

    const copy = pending ? ACTION_COPY[pending.action] : null;

    return (
        <div>
            <PageHeader
                eyebrow="Marketer"
                title={`Hi ${user?.firstName || 'there'}, here are your deliveries`}
                description="New orders are assigned to you automatically after the customer pays."
                actions={<Button variant="outline" onClick={() => refetch()} loading={isFetching && !isLoading}><RefreshCw /> Refresh</Button>}
            />

            {/* Phones: one compact row so the orders stay near the top */}
            <div className="animate-fade-in grid grid-cols-3 divide-x divide-border/60 rounded-2xl border bg-card py-3 text-center shadow-soft sm:hidden">
                {[
                    { label: 'To deliver', value: stats ? stats.pending + stats.inTransit : '…', tone: 'text-primary' },
                    { label: 'Waiting', value: stats?.delivered ?? '…', tone: 'text-amber-600' },
                    { label: 'Done', value: stats?.completed ?? '…', tone: 'text-emerald-600' },
                ].map((s) => (
                    <div key={s.label}>
                        <p className={`text-xl font-extrabold tabular-nums ${s.tone}`}>{s.value}</p>
                        <p className="text-xs text-muted-foreground">{s.label}</p>
                    </div>
                ))}
            </div>

            <Stagger immediate className="hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-4">
                <StaggerItem><StatTile label="To deliver" value={stats ? stats.pending + stats.inTransit : '…'} icon={Truck} hint={stats ? `${stats.inTransit} on the way` : undefined} /></StaggerItem>
                <StaggerItem><StatTile label="Awaiting customer" value={stats?.delivered ?? '…'} icon={Clock} tone="warning" /></StaggerItem>
                <StaggerItem><StatTile label="Completed" value={stats?.completed ?? '…'} icon={CheckCircle2} tone="success" /></StaggerItem>
                <StaggerItem><StatTile label="All time" value={stats?.totalOrders ?? '…'} icon={Wallet} tone="info" /></StaggerItem>
            </Stagger>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)}>
                    <TabsList className="grid w-full grid-cols-3 sm:inline-flex sm:w-fit">
                        {(Object.keys(TABS) as TabKey[]).map((k) => (
                            <TabsTrigger key={k} value={k}>
                                <span className="sm:hidden">{TABS[k].short}</span>
                                <span className="hidden sm:inline">{TABS[k].label}</span>
                                {counts[k] > 0 && <span className="ml-1 rounded-full bg-primary/10 px-1.5 text-[11px] font-bold text-primary tabular-nums">{counts[k]}</span>}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
                <div className="relative sm:w-72">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search order, name or area" className="h-10 rounded-xl pl-10" aria-label="Search deliveries" />
                </div>
            </div>

            <div className="mt-4">
                {isLoading || initializing ? (
                    <div className="space-y-3">{[0, 1].map((i) => <div key={i} className="skeleton-shimmer h-64 rounded-3xl" />)}</div>
                ) : isError ? (
                    <Panel><ErrorState onRetry={() => refetch()} /></Panel>
                ) : shown.length === 0 ? (
                    <Panel>
                        <EmptyState
                            icon={tab === 'todo' ? Truck : tab === 'awaiting' ? Clock : CheckCircle2}
                            title={search ? 'No matching orders' : tab === 'todo' ? "You're all caught up" : tab === 'awaiting' ? 'Nothing waiting' : 'No completed deliveries yet'}
                            description={search ? 'Try a different search.' : tab === 'todo' ? "New orders will appear here as soon as they're assigned to you." : undefined}
                        />
                    </Panel>
                ) : (
                    <Stagger immediate className="space-y-4">
                        <AnimatePresence initial={false}>
                            {shown.map((o) => (
                                <motion.div key={o._id} layout exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}>
                                    <StaggerItem><DeliveryOrderCard order={o} onAction={openAction} /></StaggerItem>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </Stagger>
                )}
            </div>

            <p className="mt-8 text-center text-xs text-muted-foreground">
                Need help with a delivery? <Link href="/account/contact" className="font-semibold text-primary hover:underline">Contact the Epilux team</Link>
            </p>

            <AlertDialog open={!!pending} onOpenChange={(open) => !open && !update.isPending && setPending(null)}>
                <AlertDialogContent>
                    {copy && pending && (
                        <>
                            <AlertDialogHeader>
                                <AlertDialogTitle>{copy.title}</AlertDialogTitle>
                                <AlertDialogDescription>{pending.order.orderNumber} · {copy.description}</AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="space-y-1.5">
                                <Label htmlFor="action-note">{copy.noteLabel}</Label>
                                <Textarea id="action-note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder={copy.notePlaceholder} maxLength={300} className="rounded-xl" />
                            </div>
                            <AlertDialogFooter>
                                <AlertDialogCancel disabled={update.isPending}>Cancel</AlertDialogCancel>
                                <Button variant={pending.action === 'declined' ? 'destructive' : pending.action === 'delivered' ? 'success' : 'default'} onClick={confirmAction} loading={update.isPending}>
                                    {copy.confirm}
                                </Button>
                            </AlertDialogFooter>
                        </>
                    )}
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
