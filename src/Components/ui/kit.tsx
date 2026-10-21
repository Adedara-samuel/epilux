'use client';

import Link from 'next/link';
import { AlertTriangle, Minus, Plus, RefreshCw } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { ORDER_STATUS_META } from '@/lib/constants';

// ---------------------------------------------------------------------------
// Page header
// ---------------------------------------------------------------------------

export function PageHeader({
    title,
    description,
    eyebrow,
    actions,
    className,
}: {
    title: React.ReactNode;
    description?: React.ReactNode;
    eyebrow?: React.ReactNode;
    actions?: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn('animate-fade-in mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between', className)}>
            <div className="min-w-0">
                {eyebrow && <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>}
                <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h1>
                {description && <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground sm:text-base">{description}</p>}
            </div>
            {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Surfaces
// ---------------------------------------------------------------------------

export function Panel({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn('rounded-3xl border border-border/70 bg-card shadow-soft', className)} {...props}>
            {children}
        </div>
    );
}

export function PanelHeader({ title, description, action, className }: { title: React.ReactNode; description?: React.ReactNode; action?: React.ReactNode; className?: string }) {
    return (
        <div className={cn('flex items-start justify-between gap-4 border-b border-border/60 px-5 py-4 sm:px-6', className)}>
            <div className="min-w-0">
                <h2 className="text-base font-bold tracking-tight sm:text-lg">{title}</h2>
                {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
            </div>
            {action}
        </div>
    );
}

// ---------------------------------------------------------------------------
// States
// ---------------------------------------------------------------------------

export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    className,
}: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description?: string;
    action?: { label: string; href?: string; onClick?: () => void };
    className?: string;
}) {
    const reduce = useReducedMotion();
    return (
        <div className={cn('animate-fade-in flex flex-col items-center justify-center px-6 py-14 text-center', className)}>
            <motion.span
                className="relative grid size-20 place-items-center rounded-3xl bg-accent text-primary"
                animate={reduce ? undefined : { y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
                <span className="absolute inset-0 rounded-3xl bg-primary/10 animate-ripple" aria-hidden />
                <Icon className="relative size-9" />
            </motion.span>
            <h3 className="mt-6 text-lg font-bold">{title}</h3>
            {description && <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{description}</p>}
            {action && (
                action.href ? (
                    <Button asChild className="mt-6"><Link href={action.href}>{action.label}</Link></Button>
                ) : (
                    <Button className="mt-6" onClick={action.onClick}>{action.label}</Button>
                )
            )}
        </div>
    );
}

export function ErrorState({ title = 'Something went wrong', description = 'We could not load this right now.', onRetry, className }: { title?: string; description?: string; onRetry?: () => void; className?: string }) {
    return (
        <div className={cn('animate-fade-in flex flex-col items-center justify-center px-6 py-12 text-center', className)}>
            <span className="grid size-16 place-items-center rounded-2xl bg-destructive/10 text-destructive">
                <AlertTriangle className="size-7" />
            </span>
            <h3 className="mt-5 text-lg font-bold">{title}</h3>
            <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{description}</p>
            {onRetry && (
                <Button variant="outline" className="mt-5" onClick={onRetry}>
                    <RefreshCw /> Try again
                </Button>
            )}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Badges
// ---------------------------------------------------------------------------

const toneClasses = {
    neutral: 'bg-muted text-muted-foreground ring-border',
    info: 'bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-500/30',
    brand: 'bg-accent text-accent-foreground ring-brand-100',
    warning: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30',
    success: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30',
    danger: 'bg-red-50 text-red-700 ring-red-200 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/30',
} as const;

export type Tone = keyof typeof toneClasses;

export function Pill({ tone = 'neutral', children, className, dot = false }: { tone?: Tone; children: React.ReactNode; className?: string; dot?: boolean }) {
    return (
        <span className={cn('inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset', toneClasses[tone], className)}>
            {dot && <span className="size-1.5 rounded-full bg-current" />}
            {children}
        </span>
    );
}

export function OrderStatusPill({ status, className }: { status: string; className?: string }) {
    const meta = ORDER_STATUS_META[status] || { label: status, tone: 'neutral' as const };
    return <Pill tone={meta.tone} dot className={className}>{meta.label}</Pill>;
}

// ---------------------------------------------------------------------------
// Quantity stepper
// ---------------------------------------------------------------------------

export function QuantityStepper({
    value,
    onChange,
    min = 1,
    max = 9999,
    disabled = false,
    size = 'md',
}: {
    value: number;
    onChange: (next: number) => void;
    min?: number;
    max?: number;
    disabled?: boolean;
    size?: 'sm' | 'md';
}) {
    const btn = size === 'sm' ? 'size-8' : 'size-10';
    return (
        <div className={cn('inline-flex items-center rounded-xl border border-border bg-card shadow-xs', disabled && 'opacity-60')}>
            <button
                type="button"
                className={cn(btn, 'grid place-items-center rounded-l-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40')}
                onClick={() => onChange(Math.max(min, value - 1))}
                disabled={disabled || value <= min}
                aria-label="Decrease quantity"
            >
                <Minus className="size-4" />
            </button>
            <input
                type="number"
                inputMode="numeric"
                value={value}
                min={min}
                max={max}
                disabled={disabled}
                onChange={(e) => {
                    const next = parseInt(e.target.value, 10);
                    if (!Number.isNaN(next)) onChange(Math.min(max, Math.max(min, next)));
                }}
                className={cn('w-12 border-x border-border bg-transparent text-center font-semibold tabular-nums outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none', size === 'sm' ? 'h-8 text-sm' : 'h-10')}
                aria-label="Quantity"
            />
            <button
                type="button"
                className={cn(btn, 'grid place-items-center rounded-r-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40')}
                onClick={() => onChange(Math.min(max, value + 1))}
                disabled={disabled || value >= max}
                aria-label="Increase quantity"
            >
                <Plus className="size-4" />
            </button>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Stat tile
// ---------------------------------------------------------------------------

export function StatTile({
    label,
    value,
    icon: Icon,
    hint,
    tone = 'brand',
    className,
}: {
    label: string;
    value: React.ReactNode;
    icon: React.ComponentType<{ className?: string }>;
    hint?: React.ReactNode;
    tone?: 'brand' | 'success' | 'warning' | 'danger' | 'info';
    className?: string;
}) {
    const iconTone = {
        brand: 'bg-accent text-primary',
        success: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10',
        warning: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10',
        danger: 'bg-red-50 text-red-600 dark:bg-red-500/10',
        info: 'bg-sky-50 text-sky-600 dark:bg-sky-500/10',
    }[tone];
    return (
        <Panel className={cn('p-5', className)}>
            <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
                <span className={cn('grid size-10 place-items-center rounded-xl', iconTone)}>
                    <Icon className="size-5" />
                </span>
            </div>
            <p className="mt-2 text-2xl font-extrabold tracking-tight tabular-nums sm:text-[1.7rem]">{value}</p>
            {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </Panel>
    );
}
