'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, CreditCard, MapPin, PartyPopper, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
    { label: 'Cart', icon: ShoppingCart, href: '/cart' },
    { label: 'Delivery', icon: MapPin, href: '/checkout' },
    { label: 'Payment', icon: CreditCard },
    { label: 'Done', icon: PartyPopper },
];

/** Progress indicator for the purchase flow. `current` is 0-based. */
export function CheckoutSteps({ current }: { current: number }) {
    return (
        <nav aria-label="Checkout progress" className="animate-fade-in mb-6">
            <ol className="flex items-center">
                {STEPS.map((step, i) => {
                    const done = i < current;
                    const active = i === current;
                    const Icon = step.icon;
                    const content = (
                        <span className="flex items-center gap-2">
                            <span
                                className={cn(
                                    'relative grid size-9 place-items-center rounded-full border-2 transition-colors duration-300',
                                    done && 'border-primary bg-primary text-white',
                                    active && 'border-primary bg-accent text-primary',
                                    !done && !active && 'border-border bg-card text-muted-foreground'
                                )}
                            >
                                {done ? <Check className="size-4" /> : <Icon className="size-4" />}
                                {active && <span className="absolute inset-0 animate-ripple rounded-full bg-primary/20" />}
                            </span>
                            <span className={cn('hidden text-sm font-semibold sm:inline', active || done ? 'text-foreground' : 'text-muted-foreground')}>{step.label}</span>
                        </span>
                    );
                    return (
                        <li key={step.label} className={cn('flex items-center', i < STEPS.length - 1 && 'flex-1')} aria-current={active ? 'step' : undefined}>
                            {done && step.href ? <Link href={step.href} className="rounded-full">{content}</Link> : content}
                            {i < STEPS.length - 1 && (
                                <span className="mx-2 h-0.5 flex-1 overflow-hidden rounded-full bg-border sm:mx-4">
                                    <motion.span className="block h-full bg-primary" initial={{ width: 0 }} animate={{ width: done ? '100%' : '0%' }} transition={{ duration: 0.5, ease: 'easeOut' }} />
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
