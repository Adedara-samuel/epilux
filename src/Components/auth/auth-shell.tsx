/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { Droplets, ShieldCheck, Truck, Wallet } from 'lucide-react';

const highlights = [
    { icon: Truck, title: 'Doorstep delivery', text: 'A dedicated marketer brings every order to you.' },
    { icon: Wallet, title: 'Earn on every order', text: 'A share of each purchase is paid into your wallet.' },
    { icon: ShieldCheck, title: 'Secure payments', text: 'Card, transfer or USSD, protected by Flutterwave.' },
];

// Fixed positions so server and client render the same markup
const droplets = [
    { left: '8%', size: 14, duration: 16, delay: 0 },
    { left: '22%', size: 8, duration: 12, delay: 4 },
    { left: '37%', size: 18, duration: 20, delay: 2 },
    { left: '55%', size: 10, duration: 14, delay: 7 },
    { left: '68%', size: 16, duration: 18, delay: 1 },
    { left: '84%', size: 9, duration: 13, delay: 5 },
    { left: '93%', size: 12, duration: 17, delay: 9 },
];

/**
 * Full-bleed aurora frame shared by the sign-in, sign-up and password pages.
 * Entrance animations are CSS-only so the form is visible even before
 * JavaScript loads.
 */
export function AuthShell({
    title,
    subtitle,
    children,
    footer,
    wide = false,
    fit = false,
}: {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    wide?: boolean;
    /** Compact layout locked to the viewport (no page scroll) on screens at least 640px tall. */
    fit?: boolean;
}) {
    return (
        <div className={fit ? 'aurora min-h-dvh text-white [@media(min-height:640px)]:h-dvh' : 'aurora min-h-dvh text-white'}>
            <span aria-hidden className="aurora-blob one" />
            <span aria-hidden className="aurora-blob two" />
            <span aria-hidden className="aurora-blob three" />
            {droplets.map((d, i) => (
                <span
                    key={i}
                    aria-hidden
                    className="droplet"
                    style={{ left: d.left, width: d.size, height: d.size, animationDuration: `${d.duration}s`, animationDelay: `${d.delay}s` }}
                />
            ))}

            <div className={`mx-auto grid min-h-dvh max-w-7xl grid-cols-[minmax(0,1fr)] content-center items-center px-4 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:content-normal lg:gap-16 lg:px-12 ${fit ? 'h-full gap-5 py-5' : 'gap-8 py-8'}`}>
                {/* Brand story */}
                <section className="flex flex-col">
                    <Link href="/" className="animate-fade-in inline-flex w-fit items-center gap-3">
                        <span className="grid size-12 place-items-center rounded-2xl bg-white shadow-lg shadow-black/20 ring-1 ring-white/40">
                            <img src="/images/logo.png" alt="Epilux" className="size-10 object-contain" />
                        </span>
                        <span className="text-xl font-bold tracking-tight text-white">Epilux Water</span>
                    </Link>

                    <div className={`hidden max-w-xl lg:block ${fit ? 'mt-10' : 'mt-14'}`}>
                        <p className="animate-fade-in inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-sm font-medium text-white/90 backdrop-blur" style={{ animationDelay: '80ms' }}>
                            <Droplets className="size-4 text-sky-200" /> Pure. Fresh. Delivered.
                        </p>
                        <h2 className="animate-fade-in mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight xl:text-6xl" style={{ animationDelay: '140ms' }}>
                            <span className="text-gradient-light">Premium water,</span>
                            <br />
                            <span className="text-white">delivered to your door.</span>
                        </h2>
                        <p className="animate-fade-in mt-5 max-w-md text-lg text-white/75" style={{ animationDelay: '200ms' }}>
                            Order sachet and bottled water in seconds, track every delivery, and earn rewards each time you buy.
                        </p>

                        <ul className={fit ? 'mt-8 space-y-3 [@media(max-height:820px)]:hidden' : 'mt-10 space-y-3'}>
                            {highlights.map(({ icon: Icon, title, text }, i) => (
                                <li
                                    key={title}
                                    className="animate-fade-in group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm transition-colors duration-300 hover:bg-white/[0.1]"
                                    style={{ animationDelay: `${280 + i * 80}ms` }}
                                >
                                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-white/25 to-white/5 ring-1 ring-white/20 transition-transform duration-300 group-hover:scale-110">
                                        <Icon className="size-5 text-white" />
                                    </span>
                                    <div>
                                        <p className="font-semibold text-white">{title}</p>
                                        <p className="text-sm text-white/70">{text}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* Form */}
                <section className={wide ? 'w-full max-w-xl justify-self-center lg:justify-self-end' : 'w-full max-w-md justify-self-center lg:justify-self-end'}>
                    <div className={`animate-fade-in-scale glass-card rounded-3xl p-6 text-foreground ${fit ? 'sm:p-8' : 'sm:p-9'}`} style={{ animationDelay: '120ms' }}>
                        <h1 className="text-[1.75rem] font-extrabold leading-tight tracking-tight sm:text-3xl">{title}</h1>
                        {subtitle && <p className="mt-2 text-[15px] text-muted-foreground">{subtitle}</p>}
                        <div className={fit ? 'mt-5' : 'mt-7'}>{children}</div>
                    </div>

                    {footer && (
                        <div className={`animate-fade-in text-center text-sm text-white/80 ${fit ? 'mt-4' : 'mt-6'}`} style={{ animationDelay: '220ms' }}>
                            {footer}
                        </div>
                    )}

                    {!fit && <p className="mt-8 text-center text-xs text-white/50 lg:hidden">© {new Date().getFullYear()} Epilux Water</p>}
                </section>
            </div>
        </div>
    );
}

/** Labelled form field with an optional error or hint. */
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
                <label htmlFor={htmlFor} className="text-sm font-semibold text-foreground/90">{label}</label>
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

/** Text input with a leading icon, sized for auth forms. */
export function IconInputWrapper({ icon: Icon, children }: { icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
    return (
        <div className="group relative">
            <Icon className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
            {children}
        </div>
    );
}
