'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertTriangle, ArrowRight, Banknote, Boxes, CheckCircle2, Clock, Package, RefreshCw, Truck, UserPlus, Users, Wallet } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAdminStats } from '@/hooks/useAdmin';
import type { AdminOrder, AdminPerson } from '@/services/admin';
import { Button } from '@/Components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { ErrorState, OrderStatusPill, PageHeader, Panel, PanelHeader, Pill, StatTile } from '@/Components/ui/kit';
import { Stagger, StaggerItem } from '@/Components/motion';
import { cn } from '@/lib/utils';
import { formatNaira, fullName, timeAgo } from '@/lib/format';

const greeting = () => {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
};

const customerOf = (o: AdminOrder) => {
    const c = (typeof o.userId === 'object' && o.userId) || (typeof o.buyer === 'object' && o.buyer) || null;
    return c as AdminPerson | null;
};

function ActionCard({ href, icon: Icon, title, value, hint, tone, urgent }: {
    href: string; icon: React.ComponentType<{ className?: string }>; title: string; value: React.ReactNode; hint: string;
    tone: 'brand' | 'warning' | 'info' | 'success'; urgent?: boolean;
}) {
    const tones = {
        brand: 'bg-accent text-primary',
        warning: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10',
        info: 'bg-sky-50 text-sky-600 dark:bg-sky-500/10',
        success: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10',
    };
    return (
        <Link href={href} className="group block h-full">
            <Panel className={cn('h-full p-4 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-lift sm:p-5', urgent && 'ring-2 ring-amber-400/60')}>
                <div className="flex items-start justify-between gap-3">
                    <span className={cn('grid size-9 place-items-center rounded-xl sm:size-11 sm:rounded-2xl', tones[tone])}><Icon className="size-4 sm:size-5" /></span>
                    <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </div>
                <p className="mt-3 text-xl font-extrabold tabular-nums sm:mt-4 sm:text-2xl">{value}</p>
                <p className="mt-0.5 text-sm font-semibold sm:text-base">{title}</p>
                <p className="mt-1 hidden text-xs text-muted-foreground sm:block">{hint}</p>
            </Panel>
        </Link>
    );
}

export default function AdminDashboardPage() {
    const { user } = useAuth();
    const router = useRouter();
    const { data, isLoading, isError, refetch, isFetching } = useAdminStats();
    const o = data?.overview;
    const roles = o?.usersByRole || {};
    const customers = (roles.user || 0) + (roles.affiliate || 0);

    return (
        <div>
            <PageHeader
                eyebrow={new Date().toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long' })}
                title={`${greeting()}, ${user?.firstName || 'admin'}`}
                description="Here's what needs your attention today."
                actions={<Button variant="outline" onClick={() => refetch()} loading={isFetching && !isLoading}><RefreshCw /> Refresh</Button>}
            />

            {isError ? (
                <Panel><ErrorState description="We couldn't load the dashboard. Check your connection and try again." onRetry={() => refetch()} /></Panel>
            ) : (
                <>
                    {/* Needs action */}
                    <Stagger immediate className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
                        <StaggerItem>
                            <ActionCard href="/admin/orders?view=unassigned" icon={AlertTriangle} tone="warning" urgent={!!o?.unassignedPaidOrders}
                                title="Need a marketer" value={isLoading ? '…' : o?.unassignedPaidOrders}
                                hint="Paid orders no marketer has yet" />
                        </StaggerItem>
                        <StaggerItem>
                            <ActionCard href="/admin/withdrawals" icon={Banknote} tone="brand" urgent={!!o?.pendingWithdrawals.count}
                                title="Withdrawals to pay" value={isLoading ? '…' : formatNaira(o?.pendingWithdrawals.amount)}
                                hint={`${o?.pendingWithdrawals.count ?? 0} request${o?.pendingWithdrawals.count === 1 ? '' : 's'} waiting`} />
                        </StaggerItem>
                        <StaggerItem>
                            <ActionCard href="/admin/orders?view=delivery" icon={Truck} tone="info"
                                title="Out for delivery" value={isLoading ? '…' : o?.inDelivery}
                                hint="Assigned or on the way" />
                        </StaggerItem>
                        <StaggerItem>
                            <ActionCard href="/admin/orders?view=delivered" icon={Clock} tone="success"
                                title="Awaiting confirmation" value={isLoading ? '…' : o?.awaitingConfirmation}
                                hint="Delivered; the customer hasn't confirmed yet" />
                        </StaggerItem>
                    </Stagger>

                    {/* Business */}
                    <Stagger className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
                        <StaggerItem><StatTile label="Money received" value={isLoading ? '…' : formatNaira(o?.paidRevenue)} icon={Wallet} tone="success" hint={`${o?.paidOrders ?? 0} paid orders`} /></StaggerItem>
                        <StaggerItem><StatTile label="Completed sales" value={isLoading ? '…' : formatNaira(o?.totalRevenue)} icon={CheckCircle2} hint={`${formatNaira(o?.monthlyRevenue)} this month`} /></StaggerItem>
                        <StaggerItem><StatTile label="Customers" value={isLoading ? '…' : customers} icon={Users} tone="info" hint={`${o?.activeAffiliates ?? 0} have referred friends · ${roles.marketer || 0} marketers`} /></StaggerItem>
                        <StaggerItem><StatTile label="Low stock" value={isLoading ? '…' : o?.lowStockProducts} icon={Boxes} tone={o?.lowStockProducts ? 'danger' : 'brand'} hint={`of ${o?.totalProducts ?? 0} products (under 10 left)`} /></StaggerItem>
                    </Stagger>

                    <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
                        <Panel className="overflow-hidden">
                            <PanelHeader title="Latest orders" action={<Link href="/admin/orders" className="text-sm font-semibold text-primary hover:underline">All orders</Link>} />
                            {isLoading ? (
                                <div className="space-y-2 p-5">{[0, 1, 2, 3].map((i) => <div key={i} className="skeleton-shimmer h-10 rounded-xl" />)}</div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="pl-5 sm:pl-6">Order</TableHead>
                                            <TableHead className="hidden sm:table-cell">Customer</TableHead>
                                            <TableHead>Total</TableHead>
                                            <TableHead className="pr-5 text-right sm:pr-6">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {(data?.recent.activity || []).map((order) => (
                                            <TableRow key={order._id} className="cursor-pointer" onClick={() => router.push(`/admin/orders?open=${order._id}`)}>
                                                <TableCell className="pl-5 sm:pl-6">
                                                    <p className="font-semibold">{order.orderNumber}</p>
                                                    <p className="text-xs text-muted-foreground">{timeAgo(order.createdAt)}</p>
                                                </TableCell>
                                                <TableCell className="hidden sm:table-cell">{fullName(customerOf(order)) || '—'}</TableCell>
                                                <TableCell className="tabular-nums">
                                                    {formatNaira(order.totalAmount)}
                                                    {!order.isPaid && order.status === 'pending' && <span className="block text-xs text-muted-foreground">Unpaid</span>}
                                                </TableCell>
                                                <TableCell className="pr-5 text-right sm:pr-6"><OrderStatusPill status={order.status} /></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </Panel>

                        <Panel>
                            <PanelHeader title="New sign-ups" action={<Link href="/admin/users" className="text-sm font-semibold text-primary hover:underline">All users</Link>} />
                            {isLoading ? (
                                <div className="space-y-2 p-5">{[0, 1, 2].map((i) => <div key={i} className="skeleton-shimmer h-12 rounded-xl" />)}</div>
                            ) : (
                                <ul className="divide-y divide-border/60">
                                    {(data?.recent.users || []).map((u) => (
                                        <li key={u._id} className="flex items-center gap-3 px-5 py-3 sm:px-6">
                                            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent text-primary"><UserPlus className="size-4" /></span>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-semibold">{fullName(u)}</p>
                                                <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                                            </div>
                                            <div className="text-right">
                                                <Pill tone={u.role === 'marketer' ? 'brand' : u.role === 'admin' ? 'danger' : 'neutral'}>{u.role}</Pill>
                                                <p className="mt-1 text-[11px] text-muted-foreground">{timeAgo(u.createdAt)}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Panel>
                    </div>

                    <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                        <Package className="size-3.5" /> {o?.totalOrders ?? 0} orders in total · {o?.pendingOrders ?? 0} awaiting payment
                    </p>
                </>
            )}
        </div>
    );
}
