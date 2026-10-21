'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
    ArrowDownLeft, ArrowUpRight, CalendarClock, Eye, EyeOff, Gift, Lock, ReceiptText, RotateCcw, ShoppingBag, Wallet as WalletIcon,
} from 'lucide-react';
import { useRequestWithdrawal, useWalletBalance, useWalletTransactions, useWithdrawalWindow } from '@/hooks/useWallet';
import { getErrorMessage } from '@/services/base';
import type { WalletTransaction } from '@/services/wallet';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { EmptyState, ErrorState, PageHeader, Panel, Pill } from '@/Components/ui/kit';
import { BankPicker } from '@/Components/wallet/bank-picker';
import { CountUp } from '@/Components/motion';
import { formatDateTime, formatNaira } from '@/lib/format';
import { cn } from '@/lib/utils';

const TX_META: Record<WalletTransaction['type'], { label: string; icon: React.ComponentType<{ className?: string }>; tone: string }> = {
    commission: { label: 'Reward', icon: Gift, tone: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10' },
    credit: { label: 'Credit', icon: ArrowDownLeft, tone: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10' },
    refund: { label: 'Refund', icon: RotateCcw, tone: 'bg-sky-50 text-sky-600 dark:bg-sky-500/10' },
    debit: { label: 'Payment', icon: ShoppingBag, tone: 'bg-muted text-muted-foreground' },
    withdrawal: { label: 'Withdrawal', icon: ArrowUpRight, tone: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10' },
};

function useCountdown(target: string | null | undefined) {
    const [now, setNow] = useState(() => Date.now());
    useEffect(() => {
        if (!target) return;
        const t = setInterval(() => setNow(Date.now()), 30_000);
        return () => clearInterval(t);
    }, [target]);
    if (!target) return null;
    const diff = Math.max(0, new Date(target).getTime() - now);
    return { days: Math.floor(diff / 86_400_000), hours: Math.floor((diff % 86_400_000) / 3_600_000), minutes: Math.floor((diff % 3_600_000) / 60_000) };
}

function WithdrawDialog({ open, onOpenChange, available }: { open: boolean; onOpenChange: (v: boolean) => void; available: number }) {
    const withdraw = useRequestWithdrawal();
    const [amount, setAmount] = useState('');
    const [bank, setBank] = useState<{ name: string; code?: string } | null>(null);
    const [accountNumber, setAccountNumber] = useState('');
    const [accountName, setAccountName] = useState('');
    const [error, setError] = useState('');

    const value = Number(amount) || 0;

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!(value > 0)) return setError('Enter the amount you want to withdraw');
        if (value > available) return setError(`You can withdraw up to ${formatNaira(available)}`);
        if (!bank) return setError('Choose your bank');
        if (!/^\d{10}$/.test(accountNumber)) return setError('Account number must be 10 digits');
        if (accountName.trim().length < 3) return setError('Enter the name on the account');

        withdraw.mutate({ amount: value, bankName: bank.name, bankCode: bank.code, accountNumber, accountName: accountName.trim() }, {
            onSuccess: () => {
                toast.success(`Withdrawal of ${formatNaira(value)} requested. You'll be paid once it's approved.`);
                setAmount(''); setAccountNumber(''); setAccountName('');
                onOpenChange(false);
            },
            onError: (err) => setError(getErrorMessage(err, 'Could not request withdrawal')),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md rounded-3xl">
                <DialogHeader>
                    <DialogTitle>Withdraw to your bank</DialogTitle>
                    <DialogDescription>Available: <span className="font-semibold text-foreground">{formatNaira(available)}</span></DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4">
                    {error && <p className="animate-shake rounded-xl bg-destructive/5 p-3 text-sm text-destructive" role="alert">{error}</p>}
                    <div className="space-y-1.5">
                        <Label htmlFor="wd-amount">Amount</Label>
                        <div className="relative">
                            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 font-semibold text-muted-foreground">₦</span>
                            <Input id="wd-amount" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ''))} placeholder="0" className="h-12 rounded-xl pl-8 pr-16 text-lg font-semibold tabular-nums" />
                            <button type="button" onClick={() => setAmount(String(available))} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-accent px-2.5 py-1 text-xs font-bold text-accent-foreground hover:bg-brand-100">Max</button>
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="wd-bank">Bank</Label>
                        <BankPicker id="wd-bank" value={bank} onChange={setBank} />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="wd-acct">Account number</Label>
                            <Input id="wd-acct" inputMode="numeric" maxLength={10} value={accountNumber} onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))} placeholder="0123456789" className="h-12 rounded-xl tracking-wider tabular-nums" />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="wd-name">Account name</Label>
                            <Input id="wd-name" value={accountName} onChange={(e) => setAccountName(e.target.value)} placeholder="As it appears at the bank" className="h-12 rounded-xl" />
                        </div>
                    </div>
                    <Button type="submit" variant="brand" size="lg" className="w-full rounded-xl" loading={withdraw.isPending}>
                        Request {value > 0 ? formatNaira(value) : 'withdrawal'}
                    </Button>
                    <p className="text-center text-xs text-muted-foreground">Funds are held while an admin reviews and pays your request.</p>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default function WalletPage() {
    const { data: wallet, isLoading, isError, refetch } = useWalletBalance();
    const { data: txData, isLoading: txLoading } = useWalletTransactions();
    const { data: payoutWindow } = useWithdrawalWindow();
    const [showBalance, setShowBalance] = useState(true);
    const [withdrawOpen, setWithdrawOpen] = useState(false);
    const [filter, setFilter] = useState<'all' | 'in' | 'out'>('all');

    useEffect(() => {
        try { setShowBalance(localStorage.getItem('epilux:showBalance') !== '0'); } catch { /* ignore */ }
    }, []);
    const toggleBalance = () => setShowBalance((v) => {
        try { localStorage.setItem('epilux:showBalance', v ? '0' : '1'); } catch { /* ignore */ }
        return !v;
    });

    const countdown = useCountdown(payoutWindow?.isOpen ? payoutWindow?.closesAt : payoutWindow?.nextOpensAt);
    const transactions: WalletTransaction[] = useMemo(() => txData?.data || [], [txData]);
    const shown = transactions.filter((t) => filter === 'all' || (filter === 'in' ? t.amount > 0 : t.amount < 0));

    const available = Number(wallet?.availableBalance) || 0;
    const locked = Number(wallet?.lockedAmount) || 0;

    if (isError) return <ErrorState description="We couldn't load your wallet." onRetry={() => refetch()} />;

    return (
        <div>
            <PageHeader title="Wallet" description="Rewards from your orders and referrals are paid here." />

            <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                {/* Balance */}
                <section className="aurora relative overflow-hidden rounded-[1.75rem] p-6 text-white shadow-lift sm:p-8">
                    <span aria-hidden className="aurora-blob one !h-72 !w-72 !opacity-40" />
                    <div className="relative">
                        <div className="flex items-center justify-between">
                            <p className="flex items-center gap-2 text-sm font-medium text-white/75"><WalletIcon className="size-4" /> Available balance</p>
                            <button onClick={toggleBalance} className="grid size-9 place-items-center rounded-xl bg-white/10 ring-1 ring-white/20 hover:bg-white/15" aria-label={showBalance ? 'Hide balance' : 'Show balance'}>
                                {showBalance ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            </button>
                        </div>
                        <p className="mt-3 text-4xl font-extrabold tracking-tight tabular-nums sm:text-5xl">
                            {isLoading ? <span className="inline-block h-12 w-48 animate-pulse rounded-xl bg-white/15" /> : showBalance ? <CountUp value={available} format={(n) => formatNaira(n)} /> : '₦ ••••••'}
                        </p>
                        <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
                            {[
                                { label: 'Total earned', value: wallet?.totalEarned },
                                { label: 'On hold', value: locked },
                                { label: 'Withdrawn', value: wallet?.totalWithdrawn },
                            ].map((s) => (
                                <div key={s.label} className="rounded-2xl bg-white/10 p-3 ring-1 ring-white/15">
                                    <p className="text-xs text-white/65">{s.label}</p>
                                    <p className="mt-0.5 truncate font-bold tabular-nums">{showBalance ? formatNaira(s.value) : '••••'}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 flex flex-wrap gap-2">
                            <Button
                                onClick={() => setWithdrawOpen(true)}
                                disabled={!payoutWindow?.isOpen || available <= 0}
                                className="bg-white text-brand-700 shadow-lg hover:bg-white/90"
                            >
                                <ArrowUpRight /> Withdraw
                            </Button>
                            <Button asChild variant="ghost" className="text-white ring-1 ring-white/25 hover:bg-white/10 hover:text-white">
                                <Link href="/products/referrals"><Gift /> Earn more</Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Withdrawal window */}
                <Panel className="flex flex-col p-6">
                    <div className="flex items-center gap-3">
                        <span className={cn('grid size-11 place-items-center rounded-xl', payoutWindow?.isOpen ? 'bg-emerald-50 text-emerald-600' : 'bg-accent text-primary')}>
                            {payoutWindow?.isOpen ? <CalendarClock className="size-5" /> : <Lock className="size-5" />}
                        </span>
                        <div>
                            <p className="font-bold">{payoutWindow?.isOpen ? 'Withdrawals are open' : 'Withdrawals are closed'}</p>
                            <p className="text-sm text-muted-foreground">
                                Payout window: the {payoutWindow?.startDay ?? 26}th to {payoutWindow?.endDay ?? 30}th of every month
                            </p>
                        </div>
                    </div>
                    {countdown && (
                        <div className="mt-6">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{payoutWindow?.isOpen ? 'Closes in' : 'Opens in'}</p>
                            <div className="mt-2 grid grid-cols-3 gap-2">
                                {[
                                    { v: countdown.days, l: 'days' },
                                    { v: countdown.hours, l: 'hours' },
                                    { v: countdown.minutes, l: 'mins' },
                                ].map((c) => (
                                    <div key={c.l} className="rounded-2xl bg-muted/70 p-3 text-center">
                                        <motion.p key={c.v} initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-2xl font-extrabold tabular-nums">{c.v}</motion.p>
                                        <p className="text-xs text-muted-foreground">{c.l}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <p className="mt-auto pt-6 text-xs text-muted-foreground">
                        Rewards are added the moment you confirm a delivery. You can also pay for orders with your balance at checkout.
                    </p>
                </Panel>
            </div>

            {/* History */}
            <Panel className="mt-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-5 py-4 sm:px-6">
                    <h2 className="text-lg font-bold">History</h2>
                    <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
                        <TabsList className="h-10">
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="in">Money in</TabsTrigger>
                            <TabsTrigger value="out">Money out</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
                {txLoading ? (
                    <div className="space-y-3 p-5">{[0, 1, 2, 3].map((i) => <div key={i} className="skeleton-shimmer h-14 rounded-2xl" />)}</div>
                ) : shown.length === 0 ? (
                    <EmptyState icon={ReceiptText} title="No transactions yet" description="Confirm a delivered order to receive your first reward." action={{ label: 'Shop now', href: '/products' }} />
                ) : (
                    <ul className="divide-y divide-border/60">
                        {shown.map((tx, i) => {
                            const meta = TX_META[tx.type] || TX_META.credit;
                            const Icon = meta.icon;
                            const positive = tx.amount > 0;
                            return (
                                <motion.li
                                    key={tx._id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: Math.min(i, 10) * 0.03 }}
                                    className="flex items-center gap-4 px-5 py-4 sm:px-6"
                                >
                                    <span className={cn('grid size-11 shrink-0 place-items-center rounded-xl', meta.tone)}><Icon className="size-5" /></span>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-semibold">{tx.description || meta.label}</p>
                                        <p className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                            {formatDateTime(tx.createdAt)}
                                            {tx.type === 'withdrawal' && (
                                                <Pill tone={tx.status === 'completed' ? 'success' : tx.status === 'pending' ? 'warning' : 'danger'}>
                                                    {tx.status === 'completed' ? 'Paid' : tx.status === 'pending' ? 'Awaiting approval' : 'Rejected · refunded'}
                                                </Pill>
                                            )}
                                        </p>
                                    </div>
                                    <p className={cn('font-bold tabular-nums', positive ? 'text-emerald-600' : 'text-foreground')}>
                                        {positive ? '+' : '−'}{formatNaira(Math.abs(tx.amount))}
                                    </p>
                                </motion.li>
                            );
                        })}
                    </ul>
                )}
            </Panel>

            <WithdrawDialog open={withdrawOpen} onOpenChange={setWithdrawOpen} available={available} />
        </div>
    );
}
