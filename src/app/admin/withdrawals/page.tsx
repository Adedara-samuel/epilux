'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Banknote, Check, CheckCircle2, Clock, Copy, Landmark, Mail, Phone, XCircle } from 'lucide-react';
import { useAdminWithdrawals, useUpdateWithdrawal } from '@/hooks/useAdmin';
import type { AdminWithdrawal } from '@/services/admin';
import { getErrorMessage } from '@/services/base';
import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Tabs, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import {
    AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/Components/ui/alert-dialog';
import { EmptyState, ErrorState, PageHeader, Panel, Pill, StatTile } from '@/Components/ui/kit';
import { Stagger, StaggerItem } from '@/Components/motion';
import { formatDateTime, formatNaira, fullName, timeAgo } from '@/lib/format';

const TABS = [
    { value: 'pending', label: 'To pay' },
    { value: 'paid', label: 'Paid' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'all', label: 'All' },
] as const;

const STATUS_PILL = {
    pending: { tone: 'warning', label: 'Waiting' },
    paid: { tone: 'success', label: 'Paid' },
    rejected: { tone: 'danger', label: 'Rejected' },
} as const;

function CopyValue({ value, label }: { value?: string; label: string }) {
    const [copied, setCopied] = useState(false);
    if (!value) return <span className="text-muted-foreground">—</span>;
    return (
        <button
            type="button"
            onClick={async () => {
                try { await navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { toast.error('Could not copy'); }
            }}
            className="group inline-flex items-center gap-1.5 rounded-lg font-mono font-semibold tracking-wide hover:text-primary"
            aria-label={`Copy ${label}`}
        >
            {value}
            {copied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5 text-muted-foreground opacity-60 group-hover:opacity-100" />}
        </button>
    );
}

function WithdrawalCard({ w, onAction }: { w: AdminWithdrawal; onAction: (w: AdminWithdrawal, action: 'paid' | 'rejected') => void }) {
    const pill = STATUS_PILL[w.status] || STATUS_PILL.pending;
    return (
        <Panel className="overflow-hidden">
            <div className="grid gap-4 p-5 md:grid-cols-[1fr_1.2fr_auto] md:items-center">
                <div className="min-w-0">
                    <p className="text-2xl font-extrabold tabular-nums">{formatNaira(w.amount)}</p>
                    <p className="mt-0.5 font-semibold">{fullName(w.user) || 'Unknown customer'}</p>
                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        {w.user?.email && <span className="flex items-center gap-1"><Mail className="size-3" />{w.user.email}</span>}
                        {w.user?.phone && <a href={`tel:${w.user.phone}`} className="flex items-center gap-1 hover:text-primary"><Phone className="size-3" />{w.user.phone}</a>}
                    </div>
                </div>

                <div className="rounded-2xl bg-muted/50 p-4 text-sm">
                    <p className="flex items-center gap-2 font-semibold"><Landmark className="size-4 text-muted-foreground" />{w.bankName || 'Bank not given'}</p>
                    <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
                        <dt className="text-muted-foreground">Account</dt>
                        <dd><CopyValue value={w.accountNumber} label="account number" /></dd>
                        <dt className="text-muted-foreground">Name</dt>
                        <dd className="truncate font-medium">{w.accountName || '—'}</dd>
                    </dl>
                </div>

                <div className="flex flex-row items-center justify-between gap-3 md:flex-col md:items-end">
                    <Pill tone={pill.tone} dot>{pill.label}</Pill>
                    <p className="text-xs text-muted-foreground" title={formatDateTime(w.requestedAt)}>Requested {timeAgo(w.requestedAt)}</p>
                </div>
            </div>

            {w.status === 'pending' ? (
                <div className="flex flex-col-reverse gap-2 border-t border-border/60 bg-muted/30 px-5 py-3 sm:flex-row sm:items-center sm:justify-end">
                    <Button variant="ghost" className="text-muted-foreground hover:text-destructive" onClick={() => onAction(w, 'rejected')}><XCircle /> Reject</Button>
                    <Button variant="success" onClick={() => onAction(w, 'paid')}><CheckCircle2 /> Mark as paid</Button>
                </div>
            ) : (w.adminNote || w.processedAt) && (
                <div className="border-t border-border/60 bg-muted/30 px-5 py-3 text-xs text-muted-foreground">
                    {w.processedAt && <>Processed {formatDateTime(w.processedAt)}</>}{w.adminNote && <> · {w.adminNote}</>}
                </div>
            )}
        </Panel>
    );
}

export default function AdminWithdrawalsPage() {
    const [tab, setTab] = useState<(typeof TABS)[number]['value']>('pending');
    const { data, isLoading, isError, refetch } = useAdminWithdrawals(tab === 'all' ? undefined : tab);
    const update = useUpdateWithdrawal();
    const [pending, setPending] = useState<{ w: AdminWithdrawal; action: 'paid' | 'rejected' } | null>(null);
    const [note, setNote] = useState('');

    const summary = data?.summary;
    const list = data?.withdrawals || [];

    const confirm = () => {
        if (!pending) return;
        if (pending.action === 'rejected' && note.trim().length < 3) return toast.error('Tell the customer why it was rejected');
        update.mutate({ id: pending.w._id, status: pending.action, note: note.trim() || undefined }, {
            onSuccess: (res) => { toast.success(res.message); setPending(null); setNote(''); },
            onError: (err) => toast.error(getErrorMessage(err, 'Could not update the withdrawal')),
        });
    };

    return (
        <div>
            <PageHeader title="Withdrawals" description="Pay out customer wallet balances to their bank accounts." />

            <Stagger immediate className="grid gap-4 sm:grid-cols-3">
                <StaggerItem><StatTile label="Waiting to be paid" value={summary ? formatNaira(summary.pending?.amount) : '…'} icon={Clock} tone="warning" hint={`${summary?.pending?.count ?? 0} requests`} /></StaggerItem>
                <StaggerItem><StatTile label="Paid out" value={summary ? formatNaira(summary.paid?.amount) : '…'} icon={Banknote} tone="success" hint={`${summary?.paid?.count ?? 0} payouts`} /></StaggerItem>
                <StaggerItem><StatTile label="Rejected" value={summary ? formatNaira(summary.rejected?.amount) : '…'} icon={XCircle} tone="danger" hint={`${summary?.rejected?.count ?? 0} returned to wallets`} /></StaggerItem>
            </Stagger>

            <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="mt-6">
                <TabsList className="grid w-full grid-cols-4 sm:inline-flex sm:w-fit">
                    {TABS.map((t) => (
                        <TabsTrigger key={t.value} value={t.value}>
                            {t.label}
                            {t.value === 'pending' && !!summary?.pending?.count && <span className="ml-1 rounded-full bg-primary/10 px-1.5 text-[11px] font-bold text-primary">{summary.pending.count}</span>}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            <div className="mt-4">
                {isLoading ? (
                    <div className="space-y-3">{[0, 1].map((i) => <div key={i} className="skeleton-shimmer h-40 rounded-3xl" />)}</div>
                ) : isError ? (
                    <Panel><ErrorState onRetry={() => refetch()} /></Panel>
                ) : list.length === 0 ? (
                    <Panel><EmptyState icon={Banknote} title={tab === 'pending' ? 'Nothing to pay right now' : 'No withdrawals here'} description={tab === 'pending' ? 'Customers can request withdrawals during the monthly withdrawal window.' : undefined} /></Panel>
                ) : (
                    <Stagger immediate className="space-y-3">
                        {list.map((w) => <StaggerItem key={w._id}><WithdrawalCard w={w} onAction={(x, action) => { setNote(''); setPending({ w: x, action }); }} /></StaggerItem>)}
                    </Stagger>
                )}
            </div>

            <AlertDialog open={!!pending} onOpenChange={(o) => !o && !update.isPending && setPending(null)}>
                <AlertDialogContent>
                    {pending && (
                        <>
                            <AlertDialogHeader>
                                <AlertDialogTitle>{pending.action === 'paid' ? `Mark ${formatNaira(pending.w.amount)} as paid?` : 'Reject this withdrawal?'}</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {pending.action === 'paid'
                                        ? `Only do this after you've sent the money to ${pending.w.accountName || 'the customer'} (${pending.w.bankName || 'bank'} ${pending.w.accountNumber || ''}).`
                                        : `${formatNaira(pending.w.amount)} goes back into ${fullName(pending.w.user) || 'the customer'}'s wallet so they can try again.`}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="space-y-1.5">
                                <Label htmlFor="withdrawal-note">{pending.action === 'paid' ? 'Transfer reference (optional)' : 'Reason'}</Label>
                                <Textarea id="withdrawal-note" rows={2} value={note} onChange={(e) => setNote(e.target.value)} maxLength={300} className="rounded-xl"
                                    placeholder={pending.action === 'paid' ? 'e.g. bank transfer reference' : 'e.g. The account name does not match'} />
                            </div>
                            <AlertDialogFooter>
                                <AlertDialogCancel disabled={update.isPending}>Back</AlertDialogCancel>
                                <Button variant={pending.action === 'paid' ? 'success' : 'destructive'} onClick={confirm} loading={update.isPending}>
                                    {pending.action === 'paid' ? "Yes, I've paid" : 'Reject and refund'}
                                </Button>
                            </AlertDialogFooter>
                        </>
                    )}
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
