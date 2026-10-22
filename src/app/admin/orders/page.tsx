/* eslint-disable @next/next/no-img-element */
'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { AlertTriangle, ChevronLeft, ChevronRight, Mail, MapPin, Package, Phone, Search, Shuffle, Truck, UserCheck } from 'lucide-react';
import {
    useAdminMarketers, useAdminOrder, useAdminOrders, useAssignOrder, useUpdateAdminOrderStatus,
} from '@/hooks/useAdmin';
import type { AdminOrder, AdminPerson, OrdersQuery } from '@/services/admin';
import { getErrorMessage } from '@/services/base';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Tabs, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/Components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import {
    AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/Components/ui/alert-dialog';
import { EmptyState, ErrorState, OrderStatusPill, PageHeader, Panel, Pill } from '@/Components/ui/kit';
import { formatDateTime, formatNaira, fullName, timeAgo } from '@/lib/format';
import { handleImageError, productImageUrl } from '@/lib/images';
import { useDebounce } from '@/hooks/useDebounce';

const VIEWS: Record<string, { label: string; query: OrdersQuery }> = {
    all: { label: 'All', query: {} },
    unassigned: { label: 'Need a marketer', query: { unassigned: 'true' } },
    unpaid: { label: 'Awaiting payment', query: { status: 'pending', paid: 'false' } },
    delivery: { label: 'In delivery', query: { status: 'assigned,in_transit' } },
    delivered: { label: 'Awaiting confirmation', query: { status: 'delivered' } },
    completed: { label: 'Completed', query: { status: 'completed' } },
    cancelled: { label: 'Cancelled', query: { status: 'cancelled,rejected' } },
};
const PAGE_SIZE = 25;

const person = (p: AdminPerson | string | null | undefined) => (p && typeof p === 'object' ? p : null);

// Customer-facing labels treat "processing" as "Paid"; some old orders reached
// processing without being paid, so say so plainly here
function AdminStatusPill({ order }: { order: AdminOrder }) {
    if (order.status === 'processing' && !order.isPaid) return <Pill tone="warning" dot>Unpaid · processing</Pill>;
    return <OrderStatusPill status={order.status} />;
}
const customerOf = (o: AdminOrder) => person(o.userId) || person(o.buyer);
const paymentLabel = (m?: string) => ({ wallet: 'Wallet', flutterwave: 'Flutterwave', card: 'Card', bank_transfer: 'Bank transfer', cash_on_delivery: 'Cash on delivery' }[m || ''] || m || '—');

type Action = { status: string; title: string; description: string; confirm: string; tone: 'default' | 'destructive' | 'success'; note?: boolean };

function actionsFor(o: AdminOrder): Action[] {
    const list: Action[] = [];
    if (o.isPaid && ['assigned', 'in_transit'].includes(o.status)) {
        list.push({ status: 'delivered', title: 'Mark as delivered?', description: "Use this if the marketer delivered but couldn't update the app. The customer will be asked to confirm.", confirm: 'Mark delivered', tone: 'default', note: true });
    }
    if (o.isPaid && o.status === 'delivered') {
        list.push({ status: 'completed', title: 'Complete this order?', description: "Use this when the customer has confirmed by phone. Their reward is paid into their wallet straight away.", confirm: 'Complete and pay reward', tone: 'success', note: true });
    }
    if (['pending', 'processing', 'assigned', 'in_transit'].includes(o.status)) {
        list.push({
            status: 'cancelled',
            title: 'Cancel this order?',
            description: o.isPaid
                ? o.paymentMethod === 'wallet'
                    ? 'The stock is put back and the wallet payment is refunded to the customer.'
                    : 'The stock is put back. This was paid online, so refund the customer through Flutterwave as well.'
                : 'The stock is put back. The customer has not paid.',
            confirm: 'Cancel order', tone: 'destructive', note: true,
        });
    }
    return list;
}

function OrderDetail({ id, onClose }: { id: string; onClose: () => void }) {
    const { data: order, isLoading, isError, refetch } = useAdminOrder(id);
    const { data: marketers = [] } = useAdminMarketers();
    const assign = useAssignOrder();
    const updateStatus = useUpdateAdminOrderStatus();
    const [marketerId, setMarketerId] = useState('');
    const [pending, setPending] = useState<Action | null>(null);
    const [note, setNote] = useState('');

    const available = marketers.filter((m) => !m.suspended && m.isActive !== false);
    const currentMarketer = order ? person(order.marketer) : null;
    const customer = order ? customerOf(order) : null;
    const canAssign = !!order && order.isPaid && ['pending', 'processing', 'assigned', 'in_transit'].includes(order.status);

    const doAssign = (auto: boolean) => {
        if (!order) return;
        if (!auto && !marketerId) return toast.error('Choose a marketer first');
        assign.mutate({ id: order._id, marketerId: auto ? undefined : marketerId }, {
            onSuccess: (res) => { toast.success(res.message || 'Order assigned'); setMarketerId(''); refetch(); },
            onError: (err) => toast.error(getErrorMessage(err, 'Could not assign the order')),
        });
    };

    const doStatus = () => {
        if (!order || !pending) return;
        updateStatus.mutate({ id: order._id, status: pending.status, note: note.trim() || undefined }, {
            onSuccess: (res) => { toast.success(res.message || 'Order updated'); setPending(null); setNote(''); refetch(); },
            onError: (err) => toast.error(getErrorMessage(err, 'Could not update the order')),
        });
    };

    if (isLoading) return <div className="space-y-3 p-6"><SheetTitle className="sr-only">Loading order</SheetTitle>{[0, 1, 2, 3].map((i) => <div key={i} className="skeleton-shimmer h-20 rounded-2xl" />)}</div>;
    if (isError || !order) return <><SheetTitle className="sr-only">Order</SheetTitle><ErrorState onRetry={() => refetch()} /></>;

    const actions = actionsFor(order);
    const history = [...(order.statusHistory || [])].reverse();

    return (
        <div className="flex h-full flex-col">
            <SheetHeader className="border-b border-border/60 py-4 pl-5 pr-14 sm:pl-6">
                <div className="flex flex-wrap items-center gap-2">
                    <SheetTitle className="text-lg">{order.orderNumber}</SheetTitle>
                    <AdminStatusPill order={order} />
                    <Pill tone={order.isPaid ? 'success' : 'warning'}>{order.isPaid ? 'Paid' : 'Unpaid'}</Pill>
                </div>
                <SheetDescription>Placed {formatDateTime(order.createdAt)}</SheetDescription>
            </SheetHeader>

            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
                {/* Customer */}
                <section>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Customer</h3>
                    <p className="mt-2 font-semibold">{fullName(customer) || 'Unknown'}</p>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        {customer?.email && <a href={`mailto:${customer.email}`} className="flex items-center gap-1.5 hover:text-primary"><Mail className="size-3.5" />{customer.email}</a>}
                        {customer?.profile?.phone && <a href={`tel:${customer.profile.phone}`} className="flex items-center gap-1.5 hover:text-primary"><Phone className="size-3.5" />{customer.profile.phone}</a>}
                    </div>
                    {order.shippingAddress && (
                        <div className="mt-3 flex items-start gap-2 rounded-2xl bg-muted/50 p-3 text-sm">
                            <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                            <div className="min-w-0">
                                <p>{[order.shippingAddress.address, order.shippingAddress.city, order.shippingAddress.state].filter(Boolean).join(', ')}</p>
                                {order.shippingAddress.landmark && <p className="text-muted-foreground">Landmark: {order.shippingAddress.landmark}</p>}
                                {order.shippingAddress.deliveryInstructions && <p className="text-muted-foreground">{order.shippingAddress.deliveryInstructions}</p>}
                            </div>
                        </div>
                    )}
                </section>

                {/* Delivery */}
                <section>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Delivery</h3>
                    {currentMarketer ? (
                        <div className="mt-2 flex items-center gap-3">
                            <span className="grid size-10 place-items-center rounded-xl bg-accent text-primary"><Truck className="size-5" /></span>
                            <div className="min-w-0 flex-1">
                                <p className="font-semibold">{fullName(currentMarketer)}</p>
                                <p className="text-xs text-muted-foreground">{currentMarketer.profile?.phone || currentMarketer.email}{order.assignedAt ? ` · assigned ${timeAgo(order.assignedAt)}` : ''}</p>
                            </div>
                            {currentMarketer.profile?.phone && <Button asChild size="icon-sm" variant="outline"><a href={`tel:${currentMarketer.profile.phone}`} aria-label="Call marketer"><Phone /></a></Button>}
                        </div>
                    ) : (
                        <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                            {order.isPaid ? <><AlertTriangle className="size-4 text-amber-500" /> No marketer yet</> : 'Assigned automatically once the customer pays'}
                        </p>
                    )}

                    {canAssign && (
                        <div className="mt-3 space-y-2 rounded-2xl border border-border/70 p-3">
                            <Label htmlFor="assign-marketer" className="text-xs">{currentMarketer ? 'Reassign to' : 'Assign to'}</Label>
                            <div className="flex flex-col gap-2 sm:flex-row">
                                <Select value={marketerId} onValueChange={setMarketerId}>
                                    <SelectTrigger id="assign-marketer" className="h-10 flex-1"><SelectValue placeholder={available.length ? 'Choose a marketer' : 'No marketers available'} /></SelectTrigger>
                                    <SelectContent>
                                        {available.map((m) => (
                                            <SelectItem key={m._id} value={m._id} disabled={currentMarketer?._id === m._id}>
                                                {fullName(m)} · {m.assignedOrdersCount || 0} active
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button onClick={() => doAssign(false)} loading={assign.isPending && !!marketerId} disabled={!marketerId}><UserCheck /> Assign</Button>
                            </div>
                            <Button variant="ghost" size="sm" className="-ml-2 text-muted-foreground" onClick={() => doAssign(true)} disabled={assign.isPending}>
                                <Shuffle /> Pick the least busy marketer for me
                            </Button>
                        </div>
                    )}
                </section>

                {/* Items */}
                <section>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Items</h3>
                    <ul className="mt-2 divide-y divide-border/60 rounded-2xl border border-border/70">
                        {order.items.map((item, i) => {
                            const product = typeof item.product === 'object' ? item.product : null;
                            return (
                                <li key={i} className="flex items-center gap-3 p-3 text-sm">
                                    <img src={productImageUrl(product || {})} onError={handleImageError} alt="" className="size-10 rounded-lg bg-muted object-cover" />
                                    <span className="min-w-0 flex-1 truncate">{product?.name || 'Product removed'}</span>
                                    <span className="text-muted-foreground tabular-nums">{item.quantity} × {formatNaira(item.price)}</span>
                                </li>
                            );
                        })}
                    </ul>
                    <dl className="mt-3 space-y-1.5 text-sm">
                        <div className="flex justify-between"><dt className="text-muted-foreground">Goods</dt><dd className="tabular-nums">{formatNaira(order.subtotal || order.items.reduce((s, i) => s + i.price * i.quantity, 0))}</dd></div>
                        <div className="flex justify-between"><dt className="text-muted-foreground">Delivery</dt><dd className="tabular-nums">{order.deliveryFee ? formatNaira(order.deliveryFee) : 'Free'}</dd></div>
                        <div className="flex justify-between font-bold"><dt>Total</dt><dd className="tabular-nums">{formatNaira(order.totalAmount)}</dd></div>
                        <div className="flex justify-between"><dt className="text-muted-foreground">Payment</dt><dd>{paymentLabel(order.paymentMethod)}{order.paidAt ? ` · ${formatDateTime(order.paidAt)}` : ''}</dd></div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">Customer reward</dt>
                            <dd>{order.commissionReleased ? <span className="font-semibold text-emerald-600">Paid</span> : `${order.commissionRate || 0}% on delivery`}</dd>
                        </div>
                    </dl>
                </section>

                {/* Timeline */}
                {history.length > 0 && (
                    <section>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">History</h3>
                        <ol className="mt-3 space-y-3 border-l-2 border-border/70 pl-4">
                            {history.map((h, i) => (
                                <li key={i} className="relative text-sm">
                                    <span className="absolute -left-[1.4rem] top-1 size-2.5 rounded-full bg-primary ring-4 ring-card" />
                                    <p className="font-medium capitalize">{h.status.replace('_', ' ')}</p>
                                    {h.note && <p className="text-muted-foreground">{h.note}</p>}
                                    {(h.changedAt || h.timestamp) && <p className="text-xs text-muted-foreground">{formatDateTime(h.changedAt || h.timestamp)}</p>}
                                </li>
                            ))}
                        </ol>
                    </section>
                )}
            </div>

            {actions.length > 0 && (
                <div className="flex flex-wrap gap-2 border-t border-border/60 bg-muted/30 px-5 py-4 sm:px-6">
                    {actions.map((a) => (
                        <Button key={a.status} variant={a.tone === 'destructive' ? 'ghost' : a.tone === 'success' ? 'success' : 'outline'}
                            className={a.tone === 'destructive' ? 'text-muted-foreground hover:text-destructive sm:mr-auto' : ''}
                            onClick={() => { setNote(''); setPending(a); }}>
                            {a.confirm}
                        </Button>
                    ))}
                    <Button variant="ghost" className="ml-auto sm:hidden" onClick={onClose}>Close</Button>
                </div>
            )}

            <AlertDialog open={!!pending} onOpenChange={(o) => !o && !updateStatus.isPending && setPending(null)}>
                <AlertDialogContent>
                    {pending && (
                        <>
                            <AlertDialogHeader>
                                <AlertDialogTitle>{pending.title}</AlertDialogTitle>
                                <AlertDialogDescription>{order.orderNumber} · {pending.description}</AlertDialogDescription>
                            </AlertDialogHeader>
                            {pending.note && (
                                <div className="space-y-1.5">
                                    <Label htmlFor="status-note">Note (optional)</Label>
                                    <Textarea id="status-note" rows={2} value={note} onChange={(e) => setNote(e.target.value)} maxLength={300} className="rounded-xl" placeholder="Shown in the order history" />
                                </div>
                            )}
                            <AlertDialogFooter>
                                <AlertDialogCancel disabled={updateStatus.isPending}>Back</AlertDialogCancel>
                                <Button variant={pending.tone === 'destructive' ? 'destructive' : pending.tone === 'success' ? 'success' : 'default'} onClick={doStatus} loading={updateStatus.isPending}>{pending.confirm}</Button>
                            </AlertDialogFooter>
                        </>
                    )}
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

function OrdersContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const view = VIEWS[searchParams.get('view') || ''] ? (searchParams.get('view') as string) : 'all';
    const openId = searchParams.get('open');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const debounced = useDebounce(search.trim(), 350);

    const setParam = (key: string, value: string | null) => {
        const next = new URLSearchParams(searchParams.toString());
        if (value) next.set(key, value); else next.delete(key);
        router.replace(`${pathname}${next.toString() ? `?${next}` : ''}`, { scroll: false });
    };

    useEffect(() => setPage(1), [view, debounced]);

    const query = useMemo<OrdersQuery>(() => ({ ...VIEWS[view].query, search: debounced || undefined, page, limit: PAGE_SIZE }), [view, debounced, page]);
    const { data, isLoading, isError, refetch, isFetching } = useAdminOrders(query);
    const orders = data?.orders || [];

    return (
        <div>
            <PageHeader title="Orders" description="Assign marketers, follow deliveries and resolve problems." />

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="-mx-4 overflow-x-auto px-4 no-scrollbar lg:mx-0 lg:px-0">
                    <Tabs value={view} onValueChange={(v) => setParam('view', v === 'all' ? null : v)}>
                        <TabsList>
                            {Object.entries(VIEWS).map(([key, v]) => <TabsTrigger key={key} value={key}>{v.label}</TabsTrigger>)}
                        </TabsList>
                    </Tabs>
                </div>
                <div className="relative lg:w-72">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Order number, address or area" className="h-10 rounded-xl pl-10" aria-label="Search orders" />
                </div>
            </div>

            <Panel className="mt-4 overflow-hidden">
                {isLoading ? (
                    <div className="space-y-2 p-5">{[0, 1, 2, 3, 4].map((i) => <div key={i} className="skeleton-shimmer h-12 rounded-xl" />)}</div>
                ) : isError ? (
                    <ErrorState onRetry={() => refetch()} />
                ) : orders.length === 0 ? (
                    <EmptyState icon={Package} title={debounced ? 'No matching orders' : view === 'unassigned' ? 'Every paid order has a marketer' : 'No orders here'} description={debounced ? 'Try a different search.' : undefined} />
                ) : (
                    <Table className={isFetching ? 'opacity-70 transition-opacity' : 'transition-opacity'}>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="pl-5 sm:pl-6">Order</TableHead>
                                <TableHead className="hidden md:table-cell">Customer</TableHead>
                                <TableHead className="hidden lg:table-cell">Area</TableHead>
                                <TableHead className="hidden sm:table-cell">Marketer</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead className="pr-5 text-right sm:pr-6">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((o) => {
                                const m = person(o.marketer);
                                return (
                                    <TableRow key={o._id} className="cursor-pointer" data-state={openId === o._id ? 'selected' : undefined} onClick={() => setParam('open', o._id)}>
                                        <TableCell className="pl-5 sm:pl-6">
                                            <p className="font-semibold">{o.orderNumber}</p>
                                            <p className="text-xs text-muted-foreground">{timeAgo(o.createdAt)}</p>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">{fullName(customerOf(o)) || '—'}</TableCell>
                                        <TableCell className="hidden max-w-48 truncate lg:table-cell">{[o.shippingAddress?.city, o.shippingAddress?.state].filter(Boolean).join(', ') || '—'}</TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            {m ? fullName(m) : o.isPaid && ['pending', 'processing'].includes(o.status) ? <Pill tone="warning" dot>Needs one</Pill> : <span className="text-muted-foreground">—</span>}
                                        </TableCell>
                                        <TableCell className="tabular-nums">
                                            {formatNaira(o.totalAmount)}
                                            <span className={`block text-xs ${o.isPaid ? 'text-emerald-600' : 'text-muted-foreground'}`}>{o.isPaid ? 'Paid' : 'Unpaid'}</span>
                                        </TableCell>
                                        <TableCell className="pr-5 text-right sm:pr-6"><AdminStatusPill order={o} /></TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                )}

                {data && data.pages > 1 && (
                    <div className="flex items-center justify-between border-t border-border/60 px-5 py-3 text-sm sm:px-6">
                        <span className="text-muted-foreground">Page {data.page} of {data.pages} · {data.total} orders</span>
                        <div className="flex gap-2">
                            <Button variant="outline" size="icon-sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} aria-label="Previous page"><ChevronLeft /></Button>
                            <Button variant="outline" size="icon-sm" onClick={() => setPage((p) => p + 1)} disabled={page >= data.pages} aria-label="Next page"><ChevronRight /></Button>
                        </div>
                    </div>
                )}
            </Panel>

            <Sheet open={!!openId} onOpenChange={(o) => !o && setParam('open', null)}>
                <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-xl">
                    {openId && <OrderDetail id={openId} onClose={() => setParam('open', null)} />}
                </SheetContent>
            </Sheet>
        </div>
    );
}

export default function AdminOrdersPage() {
    return (
        <Suspense fallback={null}>
            <OrdersContent />
        </Suspense>
    );
}
