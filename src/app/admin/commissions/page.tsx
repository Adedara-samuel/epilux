'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BadgePercent, ChevronLeft, ChevronRight, Settings, Users, Wallet } from 'lucide-react';
import { useCommissionRecords, useCommissionSettings } from '@/hooks/useAdmin';
import { Button } from '@/Components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { EmptyState, ErrorState, PageHeader, Panel, PanelHeader, Pill, StatTile } from '@/Components/ui/kit';
import { Stagger, StaggerItem } from '@/Components/motion';
import { formatDate, formatNaira, fullName } from '@/lib/format';

const PAGE_SIZE = 25;
const STATUS_TONE = { paid: 'success', approved: 'info', pending: 'warning', cancelled: 'danger' } as const;

export default function AdminCommissionsPage() {
    const [page, setPage] = useState(1);
    const { data: settings } = useCommissionSettings();
    const { data, isLoading, isError, refetch } = useCommissionRecords({ page, limit: PAGE_SIZE });
    const records = data?.records || [];
    const summary = data?.summary as { totalAmount?: number; paidAmount?: number; totalCount?: number } | undefined;
    const pages = Math.max(1, Math.ceil((data?.total || 0) / PAGE_SIZE));

    return (
        <div>
            <PageHeader
                title="Commissions"
                description="Referral rewards paid to customers who invited friends."
                actions={<Button asChild variant="outline"><Link href="/admin/settings"><Settings /> Reward settings</Link></Button>}
            />

            <Stagger immediate className="grid gap-4 sm:grid-cols-3">
                <StaggerItem><StatTile label="Current reward rate" value={settings ? `${settings.commissionRate}%` : '…'} icon={BadgePercent} hint="Of the goods total, paid on delivery" /></StaggerItem>
                <StaggerItem><StatTile label="Paid to referrers" value={summary ? formatNaira(summary.paidAmount) : '…'} icon={Wallet} tone="success" hint="Their 40% share of friends' rewards" /></StaggerItem>
                <StaggerItem><StatTile label="Referral payouts" value={summary?.totalCount ?? '…'} icon={Users} tone="info" /></StaggerItem>
            </Stagger>

            <Panel className="mt-6 overflow-hidden">
                <PanelHeader title="Referral payouts" description="Created automatically when a referred customer confirms a delivery." />
                {isLoading ? (
                    <div className="space-y-2 p-5">{[0, 1, 2].map((i) => <div key={i} className="skeleton-shimmer h-12 rounded-xl" />)}</div>
                ) : isError ? (
                    <ErrorState onRetry={() => refetch()} />
                ) : records.length === 0 ? (
                    <EmptyState icon={Users} title="No referral payouts yet" description="When a referred customer confirms a delivery, their referrer's 40% share shows up here." />
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="pl-5 sm:pl-6">Referrer</TableHead>
                                <TableHead className="hidden md:table-cell">Referred friend</TableHead>
                                <TableHead className="hidden sm:table-cell">Order</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead className="pr-5 text-right sm:pr-6">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {records.map((r) => (
                                <TableRow key={r._id}>
                                    <TableCell className="pl-5 sm:pl-6">
                                        <p className="font-semibold">{fullName(r.affiliate) || '—'}</p>
                                        <p className="text-xs text-muted-foreground">{formatDate(r.createdAt)}</p>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">{fullName(r.referredUser) || '—'}</TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        {r.order ? <Link href={`/admin/orders?open=${r.order._id}`} className="font-medium text-primary hover:underline">{r.order.orderNumber}</Link> : '—'}
                                    </TableCell>
                                    <TableCell className="font-semibold tabular-nums">{formatNaira(r.amount)}</TableCell>
                                    <TableCell className="pr-5 text-right capitalize sm:pr-6"><Pill tone={STATUS_TONE[r.status] || 'neutral'}>{r.status}</Pill></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
                {pages > 1 && (
                    <div className="flex items-center justify-between border-t border-border/60 px-5 py-3 text-sm sm:px-6">
                        <span className="text-muted-foreground">Page {page} of {pages}</span>
                        <div className="flex gap-2">
                            <Button variant="outline" size="icon-sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} aria-label="Previous page"><ChevronLeft /></Button>
                            <Button variant="outline" size="icon-sm" onClick={() => setPage((p) => p + 1)} disabled={page >= pages} aria-label="Next page"><ChevronRight /></Button>
                        </div>
                    </div>
                )}
            </Panel>
        </div>
    );
}
