/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Droplets, ShieldCheck, Truck, Wallet } from 'lucide-react';
import { Reveal, Stagger, StaggerItem } from '@/Components/motion';

const highlights = [
    { icon: Truck, title: 'Doorstep delivery', text: 'A dedicated marketer brings every order to you.' },
    { icon: Wallet, title: 'Earn on every order', text: 'Get a share of each purchase paid into your wallet.' },
    { icon: ShieldCheck, title: 'Secure payments', text: 'Pay safely by card, transfer or USSD with Flutterwave.' },
];

/** Split-screen frame shared by the sign-in, sign-up and password pages. */
export function AuthShell({
    title,
    subtitle,
    children,
    footer,
}: {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
}) {
    const reduce = useReducedMotion();

    return (
        <div className="relative grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
            {/* Brand panel */}
            <aside className="relative hidden overflow-hidden bg-gradient-brand text-white lg:flex lg:flex-col lg:justify-between lg:p-12">
                <img src="/images/auth-bg.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-overlay" />
                {/* Soft animated water bubbles */}
                {!reduce && [0, 1, 2, 3].map((i) => (
                    <motion.span
                        key={i}
                        aria-hidden
                        className="absolute rounded-full bg-white/10 blur-[1px]"
                        style={{ width: 80 + i * 40, height: 80 + i * 40, left: `${10 + i * 22}%`, bottom: -120 }}
                        animate={{ y: [0, -760], opacity: [0, 0.6, 0] }}
                        transition={{ duration: 14 + i * 3, repeat: Infinity, delay: i * 2.5, ease: 'easeOut' }}
                    />
                ))}

                <Link href="/" className="relative z-10 flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-2xl bg-white shadow-lg">
                        <img src="/images/logo.png" alt="Epilux" className="size-9 object-contain" />
                    </span>
                    <span className="text-xl font-bold tracking-tight">Epilux Water</span>
                </Link>

                <div className="relative z-10 max-w-md">
                    <Reveal immediate delay={0.1}>
                        <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-medium backdrop-blur">
                            <Droplets className="size-4" /> Pure. Fresh. Delivered.
                        </p>
                        <h2 className="text-4xl font-extrabold leading-tight text-white xl:text-5xl">
                            Premium water, delivered to your door.
                        </h2>
                    </Reveal>
                    <Stagger immediate delay={0.3} className="mt-10 space-y-4">
                        {highlights.map(({ icon: Icon, title, text }) => (
                            <StaggerItem key={title} className="flex items-start gap-4 rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/15">
                                    <Icon className="size-5" />
                                </span>
                                <div>
                                    <p className="font-semibold text-white">{title}</p>
                                    <p className="text-sm text-white/80">{text}</p>
                                </div>
                            </StaggerItem>
                        ))}
                    </Stagger>
                </div>

                <p className="relative z-10 text-sm text-white/70">© {new Date().getFullYear()} Epilux Water. All rights reserved.</p>
            </aside>

            {/* Form panel */}
            <main className="relative flex items-center justify-center bg-mesh px-5 py-10 sm:px-8">
                <div className="w-full max-w-md">
                    <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
                        <img src="/images/logo.png" alt="Epilux" className="size-10 object-contain" />
                        <span className="text-lg font-bold tracking-tight">Epilux Water</span>
                    </Link>

                    <Reveal immediate>
                        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
                        {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
                    </Reveal>

                    <Reveal immediate delay={0.08} className="mt-8 rounded-2xl border border-border/70 bg-card p-6 shadow-lift sm:p-8">
                        {children}
                    </Reveal>

                    {footer && (
                        <Reveal immediate delay={0.16} className="mt-6 text-center text-sm text-muted-foreground">
                            {footer}
                        </Reveal>
                    )}
                </div>
            </main>
        </div>
    );
}

/** Labelled form field with an optional icon and error message. */
export function Field({
    label,
    htmlFor,
    error,
    hint,
    action,
    children,
}: {
    label: string;
    htmlFor: string;
    error?: string;
    hint?: string;
    action?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between">
                <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">{label}</label>
                {action}
            </div>
            {children}
            {error ? (
                <p className="animate-fade-in text-xs font-medium text-destructive" role="alert">{error}</p>
            ) : hint ? (
                <p className="text-xs text-muted-foreground">{hint}</p>
            ) : null}
        </div>
    );
}
