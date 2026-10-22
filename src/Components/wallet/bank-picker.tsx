'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Check, ChevronsUpDown, Landmark, Search } from 'lucide-react';
import { useNigerianBanks } from '@/hooks/useBanks';
import { cn } from '@/lib/utils';

// Shown first when nothing is typed, in this order
const POPULAR = ['Access Bank', 'First Bank', 'Guaranty Trust', 'GTBank', 'Kuda', 'Moniepoint', 'OPay', 'PalmPay', 'United Bank for Africa', 'Zenith Bank'];
const MAX_RESULTS = 80;

/**
 * Searchable bank selector. The list opens inline (not in a pop-up), so it
 * works inside dialogs, whose focus trap blocks pop-ups rendered outside them.
 */
export function BankPicker({ value, onChange, id }: { value: { name: string; code?: string } | null; onChange: (bank: { name: string; code: string }) => void; id?: string }) {
    const { data: banks = [], isLoading } = useNigerianBanks();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [active, setActive] = useState(0);
    const listboxId = `${useId()}-banks`;
    const searchRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) {
            const popular = POPULAR.map((p) => banks.find((b) => b.name.toLowerCase().startsWith(p.toLowerCase()))).filter((b): b is NonNullable<typeof b> => !!b);
            const rest = banks.filter((b) => !popular.includes(b));
            return [...new Set([...popular, ...rest])].slice(0, MAX_RESULTS);
        }
        // Names starting with the search come first, then names containing it
        const starts = banks.filter((b) => b.name.toLowerCase().startsWith(q));
        const contains = banks.filter((b) => !b.name.toLowerCase().startsWith(q) && b.name.toLowerCase().includes(q));
        return [...starts, ...contains].slice(0, MAX_RESULTS);
    }, [banks, query]);

    useEffect(() => { setActive(0); }, [query, open]);
    useEffect(() => { if (open) searchRef.current?.focus(); }, [open]);
    useEffect(() => {
        listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' });
    }, [active]);

    const choose = (bank: { name: string; code: string }) => {
        onChange(bank);
        setOpen(false);
        setQuery('');
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(i + 1, results.length - 1)); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
        else if (e.key === 'Enter') { e.preventDefault(); if (results[active]) choose(results[active]); }
        else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); setOpen(false); }
    };

    return (
        <div className="space-y-2">
            <button
                id={id}
                type="button"
                role="combobox"
                aria-expanded={open}
                aria-controls={listboxId}
                aria-haspopup="listbox"
                onClick={() => setOpen((o) => !o)}
                className={cn(
                    'flex h-12 w-full items-center gap-3 rounded-xl border border-input bg-card px-3.5 text-left text-sm shadow-xs outline-none transition-[border-color,box-shadow] hover:border-brand-500/40 focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20',
                    open && 'border-ring ring-4 ring-ring/15'
                )}
            >
                <Landmark className="size-[18px] shrink-0 text-muted-foreground" />
                <span className={cn('flex-1 truncate', !value && 'text-muted-foreground')}>{value?.name || 'Choose your bank'}</span>
                <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
            </button>

            {open && (
                <div className="animate-fade-in rounded-xl border border-border bg-card p-2 shadow-soft">
                    <div className="relative mb-2">
                        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            ref={searchRef}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={onKeyDown}
                            placeholder={`Search ${banks.length || ''} banks…`.replace('  ', ' ')}
                            aria-label="Search banks"
                            aria-controls={listboxId}
                            aria-activedescendant={results[active] ? `${listboxId}-${active}` : undefined}
                            className="h-10 w-full rounded-lg border border-input bg-muted/50 pl-9 pr-3 text-sm outline-none focus:border-ring focus:bg-card"
                        />
                    </div>
                    <div className="max-h-60 overflow-y-auto overscroll-contain">
                        {isLoading ? (
                            <p className="p-3 text-sm text-muted-foreground">Loading banks…</p>
                        ) : results.length === 0 ? (
                            <p className="p-3 text-sm text-muted-foreground">No bank matches “{query}”.</p>
                        ) : (
                            <ul ref={listRef} id={listboxId} role="listbox" aria-label="Banks">
                                {!query && <li role="presentation" className="px-3 pb-1 pt-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Popular banks first</li>}
                                {results.map((bank, index) => {
                                    const selected = value?.code === bank.code;
                                    return (
                                        <li
                                            key={bank.code}
                                            id={`${listboxId}-${index}`}
                                            data-index={index}
                                            role="option"
                                            aria-selected={selected}
                                            onMouseEnter={() => setActive(index)}
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={() => choose(bank)}
                                            className={cn(
                                                'flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm',
                                                index === active && 'bg-muted',
                                                selected && 'font-semibold text-primary'
                                            )}
                                        >
                                            <span className="flex-1 truncate">{bank.name}</span>
                                            {selected && <Check className="size-4 shrink-0" />}
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                    {results.length === MAX_RESULTS && <p className="px-3 pt-2 text-xs text-muted-foreground">Keep typing to narrow the list.</p>}
                </div>
            )}
        </div>
    );
}
