'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Mail, Phone, Truck, UserPlus } from 'lucide-react';
import { useAdminMarketers, useAdminOrders } from '@/hooks/useAdmin';
import type { AdminPerson } from '@/services/admin';
import { AddUserDialog } from '@/Components/admin/add-user-dialog';
import { Button } from '@/Components/ui/button';
import { EmptyState, ErrorState, PageHeader, Panel, Pill, StatTile } from '@/Components/ui/kit';
import { Stagger, StaggerItem } from '@/Components/motion';
import { formatDate, fullName, initials } from '@/lib/format';

const idOf = (p: AdminPerson | string | null | undefined) => (p && typeof p === 'object' ? p._id : p || '');

export default function AdminMarketersPage() {
    const { data: marketers = [], isLoading, isError, refetch } = useAdminMarketers();
    // Live workload from the orders themselves (the stored counters can drift on old data)
    const { data: active } = useAdminOrders({ status: 'assigned,in_transit,delivered', limit: 200 });
    const { data: waiting } = useAdminOrders({ unassigned: 'true', limit: 1 });
    const [adding, setAdding] = useState(false);

    const workload = useMemo(() => {
        const map = new Map<string, { delivering: number; awaiting: number }>();
        (active?.orders || []).forEach((o) => {
            const id = idOf(o.marketer);
            if (!id) return;
            const row = map.get(id) || { delivering: 0, awaiting: 0 };
            if (o.status === 'delivered') row.awaiting += 1; else row.delivering += 1;
            map.set(id, row);
        });
        return map;
    }, [active]);

    const available = marketers.filter((m) => !m.suspended && m.isActive !== false).length;
    const delivering = [...workload.values()].reduce((n, w) => n + w.delivering, 0);

    return (
        <div>
            <PageHeader title="Marketers" description="Paid orders go automatically to the available marketer with the fewest active deliveries." actions={<Button onClick={() => setAdding(true)}><UserPlus /> Add marketer</Button>} />

            <Stagger immediate className="grid gap-4 sm:grid-cols-3">
                <StaggerItem><StatTile label="Available marketers" value={isLoading ? '…' : `${available} of ${marketers.length}`} icon={Truck} /></StaggerItem>
                <StaggerItem><StatTile label="Deliveries in progress" value={active ? delivering : '…'} icon={Truck} tone="info" /></StaggerItem>
                <StaggerItem>
                    <Link href="/admin/orders?view=unassigned" className="block">
                        <StatTile label="Paid orders waiting" value={waiting ? waiting.total : '…'} icon={CheckCircle2} tone={waiting?.total ? 'warning' : 'success'} hint={waiting?.total ? 'Open orders to assign them' : 'Every paid order has a marketer'} />
                    </Link>
                </StaggerItem>
            </Stagger>

            <div className="mt-6">
                {isLoading ? (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{[0, 1, 2].map((i) => <div key={i} className="skeleton-shimmer h-48 rounded-3xl" />)}</div>
                ) : isError ? (
                    <Panel><ErrorState onRetry={() => refetch()} /></Panel>
                ) : marketers.length === 0 ? (
                    <Panel><EmptyState icon={Truck} title="No marketers yet" description="Paid orders can't be delivered until you add at least one marketer." action={{ label: 'Add a marketer', onClick: () => setAdding(true) }} /></Panel>
                ) : (
                    <Stagger immediate className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {marketers.map((m) => {
                            const w = workload.get(m._id) || { delivering: 0, awaiting: 0 };
                            const off = m.suspended || m.isActive === false;
                            return (
                                <StaggerItem key={m._id}>
                                    <Panel className={`h-full p-5 ${off ? 'opacity-70' : ''}`}>
                                        <div className="flex items-start gap-3">
                                            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-brand font-bold text-white">{initials(m.firstName, m.lastName, m.email)}</span>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate font-bold">{fullName(m)}</p>
                                                <p className="text-xs text-muted-foreground">Since {formatDate(m.createdAt)}</p>
                                            </div>
                                            <Pill tone={off ? 'danger' : w.delivering ? 'info' : 'success'} dot>{off ? 'Suspended' : w.delivering ? 'Busy' : 'Available'}</Pill>
                                        </div>

                                        <dl className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-muted/50 p-3 text-center">
                                            <div><dt className="text-[11px] text-muted-foreground">Delivering</dt><dd className="text-lg font-extrabold tabular-nums">{w.delivering}</dd></div>
                                            <div><dt className="text-[11px] text-muted-foreground">Awaiting</dt><dd className="text-lg font-extrabold tabular-nums">{w.awaiting}</dd></div>
                                            <div><dt className="text-[11px] text-muted-foreground">Completed</dt><dd className="text-lg font-extrabold tabular-nums">{m.completedOrdersCount || 0}</dd></div>
                                        </dl>

                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {m.profile?.phone ? (
                                                <Button asChild size="sm" variant="outline"><a href={`tel:${m.profile.phone}`}><Phone /> {m.profile.phone}</a></Button>
                                            ) : (
                                                <span className="text-xs text-amber-600">No phone number on file</span>
                                            )}
                                            {m.email && <Button asChild size="sm" variant="ghost"><a href={`mailto:${m.email}`}><Mail /> Email</a></Button>}
                                        </div>
                                    </Panel>
                                </StaggerItem>
                            );
                        })}
                    </Stagger>
                )}
            </div>

            <p className="mt-6 text-xs text-muted-foreground">To suspend a marketer or change their role, use <Link href="/admin/users?role=marketer" className="font-semibold text-primary hover:underline">Users</Link>.</p>

            <AddUserDialog open={adding} onOpenChange={setAdding} defaultRole="marketer" />
        </div>
    );
}
