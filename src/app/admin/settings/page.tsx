'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { CalendarDays, Info, Percent, Save } from 'lucide-react';
import { useCommissionSettings, useUpdateCommissionSettings } from '@/hooks/useAdmin';
import { getErrorMessage } from '@/services/base';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Checkbox } from '@/Components/ui/checkbox';
import { ErrorState, PageHeader, Panel, PanelHeader } from '@/Components/ui/kit';
import { formatDateTime, formatNaira } from '@/lib/format';

const ROLES = [
    { value: 'user', label: 'Customers' },
    { value: 'marketer', label: 'Marketers' },
    { value: 'admin', label: 'Admins' },
];
const EXAMPLE_GOODS = 10000;
const round = (n: number) => Math.round(n * 100) / 100;

export default function AdminSettingsPage() {
    const { data, isLoading, isError, refetch } = useCommissionSettings();
    const save = useUpdateCommissionSettings();
    const [rate, setRate] = useState('');
    const [excluded, setExcluded] = useState<string[]>([]);
    const [startDay, setStartDay] = useState('26');
    const [endDay, setEndDay] = useState('30');

    useEffect(() => {
        if (!data) return;
        setRate(String(data.commissionRate ?? ''));
        setExcluded(data.excludedRoles || []);
        setStartDay(String(data.withdrawalWindow?.startDay ?? 26));
        setEndDay(String(data.withdrawalWindow?.endDay ?? 30));
    }, [data]);

    const numericRate = Number(rate);
    const example = useMemo(() => {
        const total = Number.isFinite(numericRate) ? round((EXAMPLE_GOODS * numericRate) / 100) : 0;
        const referrer = round(total * 0.4);
        return { total, referrer, buyer: round(total - referrer) };
    }, [numericRate]);

    const dirty = !!data && (
        Number(rate) !== data.commissionRate ||
        [...excluded].sort().join() !== [...(data.excludedRoles || [])].sort().join() ||
        Number(startDay) !== (data.withdrawalWindow?.startDay ?? 26) ||
        Number(endDay) !== (data.withdrawalWindow?.endDay ?? 30)
    );

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const s = Number(startDay);
        const end = Number(endDay);
        if (!Number.isFinite(numericRate) || numericRate < 0 || numericRate > 100) return toast.error('The reward rate must be between 0 and 100%');
        if (![s, end].every((d) => Number.isInteger(d) && d >= 1 && d <= 31)) return toast.error('Withdrawal days must be between 1 and 31');
        if (s > end) return toast.error("The first withdrawal day can't be after the last one");
        save.mutate({ rate: numericRate, excludedRoles: excluded, startDay: s, endDay: end }, {
            onSuccess: () => toast.success('Settings saved. New orders use the new rate.'),
            onError: (err) => toast.error(getErrorMessage(err, 'Could not save settings')),
        });
    };

    if (isError) return <Panel><ErrorState onRetry={() => refetch()} /></Panel>;

    return (
        <form onSubmit={submit} className="max-w-4xl">
            <PageHeader
                title="Settings"
                description="Rewards and payouts for customers."
                actions={<Button type="submit" loading={save.isPending} disabled={!dirty || isLoading}><Save /> Save changes</Button>}
            />

            <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
                <div className="space-y-6">
                    <Panel>
                        <PanelHeader title="Shopping reward" description="The share of the goods total (not delivery) paid into the buyer's wallet when they confirm delivery." />
                        <div className="space-y-5 p-5 sm:p-6">
                            <div className="max-w-xs space-y-1.5">
                                <Label htmlFor="rate">Reward rate</Label>
                                <div className="relative">
                                    <Input id="rate" inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} className="h-12 rounded-xl pr-10 text-lg font-semibold" disabled={isLoading} />
                                    <Percent className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                </div>
                                <p className="text-xs text-muted-foreground">Each order keeps the rate it was placed with.</p>
                            </div>

                            <fieldset>
                                <legend className="text-sm font-semibold">Who doesn&apos;t earn rewards</legend>
                                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                                    {ROLES.map((r) => (
                                        <label key={r.value} className="flex items-center gap-3 rounded-xl border border-border/70 px-3 py-2.5 text-sm has-[:checked]:border-primary/40 has-[:checked]:bg-accent/50">
                                            <Checkbox checked={excluded.includes(r.value)} disabled={isLoading}
                                                onCheckedChange={(v) => setExcluded((list) => (v ? [...new Set([...list, r.value])] : list.filter((x) => x !== r.value)))} />
                                            {r.label}
                                        </label>
                                    ))}
                                </div>
                            </fieldset>
                        </div>
                    </Panel>

                    <Panel>
                        <PanelHeader title="Withdrawal window" description="Days of the month when customers can ask to withdraw their wallet balance." />
                        <div className="grid max-w-md grid-cols-2 gap-4 p-5 sm:p-6">
                            <div className="space-y-1.5"><Label htmlFor="start">From day</Label><Input id="start" inputMode="numeric" value={startDay} onChange={(e) => setStartDay(e.target.value)} className="h-11 rounded-xl" disabled={isLoading} /></div>
                            <div className="space-y-1.5"><Label htmlFor="end">To day</Label><Input id="end" inputMode="numeric" value={endDay} onChange={(e) => setEndDay(e.target.value)} className="h-11 rounded-xl" disabled={isLoading} /></div>
                            <p className="col-span-2 flex items-start gap-2 text-xs text-muted-foreground"><CalendarDays className="mt-0.5 size-3.5 shrink-0" /> In months without day {endDay || '…'}, the window closes at the end of the month.</p>
                        </div>
                    </Panel>
                </div>

                <Panel className="p-5 lg:sticky lg:top-6">
                    <p className="flex items-center gap-2 text-sm font-semibold"><Info className="size-4 text-primary" /> Example</p>
                    <p className="mt-1 text-sm text-muted-foreground">On an order with {formatNaira(EXAMPLE_GOODS)} of goods at {Number.isFinite(numericRate) ? numericRate : 0}%:</p>
                    <dl className="mt-4 space-y-3 text-sm">
                        <div className="flex justify-between"><dt className="text-muted-foreground">Buyer gets</dt><dd className="font-bold tabular-nums text-emerald-600">{formatNaira(example.total)}</dd></div>
                        <div className="border-t border-border/60 pt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">If they were referred</div>
                        <div className="flex justify-between"><dt className="text-muted-foreground">Buyer (60%)</dt><dd className="font-semibold tabular-nums">{formatNaira(example.buyer)}</dd></div>
                        <div className="flex justify-between"><dt className="text-muted-foreground">Referrer (40%)</dt><dd className="font-semibold tabular-nums">{formatNaira(example.referrer)}</dd></div>
                    </dl>
                    {data?.updatedAt && <p className="mt-5 text-xs text-muted-foreground">Last changed {formatDateTime(data.updatedAt)}</p>}
                </Panel>
            </div>
        </form>
    );
}
