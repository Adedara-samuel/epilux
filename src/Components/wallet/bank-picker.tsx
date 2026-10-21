'use client';

import { useMemo, useState } from 'react';
import { Check, ChevronsUpDown, Landmark, Search } from 'lucide-react';
import { useNigerianBanks } from '@/hooks/useBanks';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { cn } from '@/lib/utils';

/** Searchable bank selector (shadcn Popover + ScrollArea). */
export function BankPicker({ value, onChange, id }: { value: { name: string; code?: string } | null; onChange: (bank: { name: string; code: string }) => void; id?: string }) {
    const { data: banks = [], isLoading } = useNigerianBanks();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return q ? banks.filter((b) => b.name.toLowerCase().includes(q)) : banks;
    }, [banks, query]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    id={id}
                    type="button"
                    role="combobox"
                    aria-expanded={open}
                    className="flex h-12 w-full items-center gap-3 rounded-xl border border-input bg-card px-3.5 text-left text-sm shadow-xs outline-none transition-[border-color,box-shadow] hover:border-brand-500/40 focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20"
                >
                    <Landmark className="size-[18px] shrink-0 text-muted-foreground" />
                    <span className={cn('flex-1 truncate', !value && 'text-muted-foreground')}>{value?.name || 'Choose your bank'}</span>
                    <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
                </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-2">
                <div className="relative mb-2">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        autoFocus
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search banks…"
                        className="h-10 w-full rounded-lg border border-input bg-muted/50 pl-9 pr-3 text-sm outline-none focus:border-ring focus:bg-card"
                    />
                </div>
                <ScrollArea className="h-64">
                    {isLoading ? (
                        <p className="p-3 text-sm text-muted-foreground">Loading banks…</p>
                    ) : filtered.length === 0 ? (
                        <p className="p-3 text-sm text-muted-foreground">No bank matches “{query}”.</p>
                    ) : (
                        <ul role="listbox" className="pr-2">
                            {filtered.map((bank) => {
                                const selected = value?.code === bank.code || value?.name === bank.name;
                                return (
                                    <li key={`${bank.code}-${bank.name}`}>
                                        <button
                                            type="button"
                                            role="option"
                                            aria-selected={selected}
                                            onClick={() => {
                                                onChange({ name: bank.name, code: bank.code });
                                                setOpen(false);
                                                setQuery('');
                                            }}
                                            className={cn('flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-accent', selected && 'font-semibold text-primary')}
                                        >
                                            <span className="flex-1 truncate">{bank.name}</span>
                                            {selected && <Check className="size-4" />}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}
