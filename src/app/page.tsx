/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
    ArrowRight, BadgeCheck, Building2, CheckCircle2, CreditCard, Droplets, Gift, PackageCheck, ShieldCheck, ShoppingBag, Sparkles, Truck, UserPlus, Wallet,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { productsAPI } from '@/services/products';
import { homePathForRole } from '@/lib/auth-session';
import SiteHeader from '@/Components/site/site-header';
import SiteFooter from '@/Components/site/site-footer';
import { Button } from '@/Components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/Components/ui/accordion';
import { Panel } from '@/Components/ui/kit';
import { Reveal, Stagger, StaggerItem } from '@/Components/motion';
import { formatNaira } from '@/lib/format';
import { handleImageError, productImageUrl } from '@/lib/images';
import { MIN_ORDER_QUANTITY } from '@/lib/constants';
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from '@/services/delivery';

type Product = { _id: string; name: string; price: number; category?: string; stock?: number; images?: { url: string; isPrimary?: boolean }[]; primaryImage?: string | null };

const STEPS = [
    { icon: ShoppingBag, title: 'Choose your water', text: `Sachet or bottled, from ${MIN_ORDER_QUANTITY} units up.` },
    { icon: CreditCard, title: 'Pay securely', text: 'Card, transfer or USSD with Flutterwave, or use your wallet.' },
    { icon: Truck, title: 'We deliver', text: 'A local Epilux marketer brings it to your door.' },
    { icon: Wallet, title: 'Confirm and earn', text: 'Confirm delivery and your reward lands in your wallet instantly.' },
];

const FAQS = [
    { q: 'How much does delivery cost?', a: `Delivery is ${formatNaira(DELIVERY_FEE)}, and free on orders of ${formatNaira(FREE_DELIVERY_THRESHOLD)} or more.` },
    { q: 'How do rewards work?', a: 'Every order earns a reward on the goods you buy. It goes into your Epilux wallet the moment you confirm your delivery, and you can withdraw it to your bank during the monthly withdrawal window.' },
    { q: 'Do I need to sign up to refer friends?', a: 'No extra sign-up. Every customer has an invite link. When friends who joined with it confirm a delivery, you receive 40% of their reward and they keep 60%.' },
    { q: 'Can I order for my business or an event?', a: 'Yes. Order as many units as you need, or contact us about bulk orders and regular supply.' },
];

function HeroVisual() {
    return (
        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            {/* soft halo */}
            <div aria-hidden className="absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-sky-300/40 via-brand-400/25 to-transparent blur-2xl" />
            <div className="animate-fade-in-scale relative overflow-hidden rounded-[2.25rem] shadow-lift ring-1 ring-black/5" style={{ animationDelay: '120ms' }}>
                <img src="/images/hero-image.jpeg" alt="Fresh water being poured into a glass" className="aspect-[4/3.4] w-full object-cover" />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-brand-900/35 via-transparent to-transparent" />
            </div>

            {/* floating cards */}
            <div className="animate-fade-in absolute -left-3 top-8 sm:-left-8" style={{ animationDelay: '380ms' }}>
                <div className="animate-float glass flex items-center gap-3 rounded-2xl px-4 py-3 shadow-lift">
                    <span className="grid size-10 place-items-center rounded-xl bg-emerald-500 text-white"><PackageCheck className="size-5" /></span>
                    <span className="leading-tight"><span className="block text-sm font-bold">Delivered</span><span className="block text-xs text-muted-foreground">20 sachet bags · Yaba</span></span>
                </div>
            </div>
            <div className="animate-fade-in absolute -right-2 bottom-24 sm:-right-6" style={{ animationDelay: '520ms' }}>
                <div className="animate-float glass flex items-center gap-3 rounded-2xl px-4 py-3 shadow-lift" style={{ animationDelay: '1.5s' }}>
                    <span className="grid size-10 place-items-center rounded-xl bg-gradient-sun text-white"><Wallet className="size-5" /></span>
                    <span className="leading-tight"><span className="block text-sm font-bold text-emerald-600">Reward added</span><span className="block text-xs text-muted-foreground">to your wallet</span></span>
                </div>
            </div>
            <div className="animate-fade-in absolute bottom-6 left-6" style={{ animationDelay: '660ms' }}>
                <div className="animate-float glass flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold shadow-soft" style={{ animationDelay: '3s' }}>
                    <UserPlus className="size-4 text-primary" /> Tolu joined with your link
                </div>
            </div>
        </div>
    );
}

function FeaturedProducts() {
    const { data, isLoading } = useQuery({ queryKey: ['products', 'landing'], queryFn: () => productsAPI.getProducts({ limit: 6 }) });
    const products: Product[] = ((data as { products?: Product[]; data?: Product[] } | undefined)?.products
        || (data as { data?: Product[] } | undefined)?.data || []).slice(0, 3);

    if (!isLoading && products.length === 0) return null;

    return (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wider text-primary">Our water</p>
                    <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Pure. Fresh. Ready to order.</h2>
                </div>
                <Button asChild variant="outline"><Link href="/products">See everything <ArrowRight /></Link></Button>
            </Reveal>
            <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {isLoading
                    ? [0, 1, 2].map((i) => <div key={i} className="skeleton-shimmer h-96 rounded-3xl" />)
                    : products.map((p) => (
                        <StaggerItem key={p._id}>
                            <Link href={`/products/${p._id}`} className="group block h-full">
                                <Panel className="h-full overflow-hidden transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-lift">
                                    <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-b from-sky-50 to-white dark:from-sky-950/30 dark:to-transparent">
                                        <img src={productImageUrl(p)} onError={handleImageError} alt={p.name} className="size-full object-contain p-6 transition-transform duration-700 group-hover:scale-105" />
                                        {p.category && <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold capitalize text-brand-700 shadow-soft">{p.category}</span>}
                                    </div>
                                    <div className="flex items-end justify-between gap-3 p-5">
                                        <div className="min-w-0">
                                            <h3 className="truncate text-lg font-bold">{p.name}</h3>
                                            <p className="text-sm text-muted-foreground">From {MIN_ORDER_QUANTITY} units</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-extrabold tabular-nums">{formatNaira(p.price)}</p>
                                            <p className="text-xs text-muted-foreground">per unit</p>
                                        </div>
                                    </div>
                                </Panel>
                            </Link>
                        </StaggerItem>
                    ))}
            </Stagger>
        </section>
    );
}

export default function HomePage() {
    const { user } = useAuth();
    const primary = user ? { href: homePathForRole(user.role), label: user.role === 'admin' ? 'Go to admin' : user.role === 'marketer' ? 'My deliveries' : 'Order water' } : { href: '/register', label: 'Start ordering' };

    return (
        <div className="min-h-dvh bg-background">
            <SiteHeader />

            <main>
                {/* Hero */}
                <section className="relative overflow-hidden">
                    <div aria-hidden className="pointer-events-none absolute inset-0">
                        <div className="absolute -top-40 right-[-10%] size-[38rem] rounded-full bg-sky-200/50 blur-3xl dark:bg-sky-500/10" />
                        <div className="absolute -bottom-40 left-[-10%] size-[30rem] rounded-full bg-brand-200/40 blur-3xl dark:bg-brand-500/10" />
                    </div>
                    <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pb-20 pt-10 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:px-8 lg:pb-28 lg:pt-16">
                        <div>
                            <p className="animate-fade-in inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/80 px-3 py-1.5 text-sm font-medium shadow-soft backdrop-blur">
                                <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex size-2 rounded-full bg-emerald-500" /></span>
                                Doorstep delivery, rewards on every order
                            </p>
                            <h1 className="animate-fade-in mt-6 font-display text-[2.6rem] font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-[4.25rem]" style={{ animationDelay: '80ms' }}>
                                Pure water,<br />
                                <span className="bg-gradient-to-r from-brand-600 via-sky-500 to-cyan-400 bg-clip-text text-transparent">delivered</span> to your door.
                            </h1>
                            <p className="animate-fade-in mt-6 max-w-xl text-lg text-muted-foreground" style={{ animationDelay: '160ms' }}>
                                Order sachet and bottled water in a few taps. A local marketer delivers it, and every order you confirm puts money back in your wallet.
                            </p>
                            <div className="animate-fade-in mt-8 flex flex-wrap gap-3" style={{ animationDelay: '240ms' }}>
                                <Button asChild size="xl" variant="brand" className="rounded-2xl"><Link href={primary.href}>{primary.label} <ArrowRight /></Link></Button>
                                <Button asChild size="xl" variant="outline" className="rounded-2xl"><Link href="#how-it-works">How it works</Link></Button>
                            </div>
                            <ul className="animate-fade-in mt-10 grid max-w-xl gap-3 text-sm sm:grid-cols-3" style={{ animationDelay: '320ms' }}>
                                {[
                                    { icon: ShieldCheck, text: 'Secure payments' },
                                    { icon: Truck, text: 'Local delivery' },
                                    { icon: Gift, text: 'Earn as you buy' },
                                ].map(({ icon: Icon, text }) => (
                                    <li key={text} className="flex items-center gap-2 font-medium text-foreground/80"><Icon className="size-4 text-primary" />{text}</li>
                                ))}
                            </ul>
                        </div>
                        <HeroVisual />
                    </div>
                </section>

                {/* Facts strip */}
                <section className="border-y border-border/60 bg-card/60">
                    <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
                        {[
                            { value: formatNaira(DELIVERY_FEE), label: 'Flat delivery fee' },
                            { value: `${formatNaira(FREE_DELIVERY_THRESHOLD)}+`, label: 'Orders delivered free' },
                            { value: '60 / 40', label: 'Referral reward split' },
                            { value: 'Instant', label: 'Rewards on confirmation' },
                        ].map((f) => (
                            <Reveal key={f.label}>
                                <p className="font-display text-2xl font-extrabold tabular-nums sm:text-3xl">{f.value}</p>
                                <p className="mt-1 text-sm text-muted-foreground">{f.label}</p>
                            </Reveal>
                        ))}
                    </div>
                </section>

                <FeaturedProducts />

                {/* How it works */}
                <section id="how-it-works" className="scroll-mt-20 bg-muted/40 py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <Reveal className="mx-auto max-w-2xl text-center">
                            <p className="text-sm font-semibold uppercase tracking-wider text-primary">How it works</p>
                            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">From order to doorstep in four steps</h2>
                        </Reveal>
                        <Stagger className="relative mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            <div aria-hidden className="absolute left-[12%] right-[12%] top-10 hidden h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent lg:block" />
                            {STEPS.map(({ icon: Icon, title, text }, i) => (
                                <StaggerItem key={title}>
                                    <Panel className="relative h-full p-6 text-center">
                                        <span className="relative mx-auto grid size-14 place-items-center rounded-2xl bg-gradient-brand text-white shadow-lift">
                                            <Icon className="size-6" />
                                            <span className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-card text-xs font-bold text-primary ring-2 ring-primary/20">{i + 1}</span>
                                        </span>
                                        <h3 className="mt-5 text-lg font-bold">{title}</h3>
                                        <p className="mt-1.5 text-sm text-muted-foreground">{text}</p>
                                    </Panel>
                                </StaggerItem>
                            ))}
                        </Stagger>
                    </div>
                </section>

                {/* Rewards */}
                <section className="px-4 py-20 sm:px-6 lg:px-8">
                    <div className="aurora relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] px-6 py-14 text-white sm:px-12 lg:py-20">
                        <span aria-hidden className="aurora-blob one" />
                        <span aria-hidden className="aurora-blob three" />
                        <div className="relative grid gap-12 lg:grid-cols-2 lg:items-center">
                            <Reveal>
                                <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium ring-1 ring-white/20"><Sparkles className="size-4 text-amber-200" /> Rewards</p>
                                <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">Water that pays you back.</h2>
                                <p className="mt-4 max-w-lg text-lg text-white/80">Every order earns a reward. Share your invite link and you also earn 40% of the reward on every order your friends confirm. They keep 60%, and they can invite friends of their own.</p>
                                <ul className="mt-8 space-y-3">
                                    {['A reward on every order you confirm', '40% of your friends’ rewards, on every order they make', 'Invite as many people as you like', 'Withdraw to your bank every month'].map((t) => (
                                        <li key={t} className="flex items-start gap-3 text-white/90"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-300" />{t}</li>
                                    ))}
                                </ul>
                                <div className="mt-9 flex flex-wrap gap-3">
                                    <Button asChild size="xl" className="rounded-2xl bg-white text-brand-700 hover:bg-white/90"><Link href="/affiliate-reg">Refer & earn <ArrowRight /></Link></Button>
                                </div>
                            </Reveal>

                            <Reveal direction="left">
                                <div className="mx-auto max-w-sm rounded-[2rem] bg-white/10 p-3 ring-1 ring-white/20 backdrop-blur">
                                    <div className="rounded-[1.6rem] bg-card p-6 text-foreground shadow-lift">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-semibold text-muted-foreground">Your wallet</p>
                                            <BadgeCheck className="size-5 text-emerald-500" />
                                        </div>
                                        <p className="mt-2 font-display text-4xl font-extrabold">Rewards</p>
                                        <p className="text-sm text-muted-foreground">credited the moment you confirm</p>
                                        <div className="mt-6 space-y-3">
                                            {[
                                                { who: 'Your order', note: 'Delivery confirmed', share: '100%', tone: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' },
                                                { who: 'Friend’s order', note: 'They joined with your link', share: '40%', tone: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' },
                                            ].map((r) => (
                                                <div key={r.who} className="flex items-center gap-3 rounded-2xl border border-border/70 p-3">
                                                    <span className="grid size-10 place-items-center rounded-xl bg-accent text-primary"><Droplets className="size-5" /></span>
                                                    <span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{r.who}</span><span className="block truncate text-xs text-muted-foreground">{r.note}</span></span>
                                                    <span className={`rounded-lg px-2 py-1 text-xs font-bold ${r.tone}`}>{r.share}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </section>

                {/* Business */}
                <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
                    <div className="grid gap-5 lg:grid-cols-2">
                        <Reveal>
                            <Panel className="group relative h-full overflow-hidden p-8">
                                <img src="/images/Hydration.jpeg" alt="" className="absolute inset-0 size-full object-cover opacity-20 transition-transform duration-700 group-hover:scale-105 dark:opacity-10" />
                                <div className="relative">
                                    <span className="grid size-12 place-items-center rounded-2xl bg-accent text-primary"><Building2 className="size-6" /></span>
                                    <h3 className="mt-5 text-2xl font-extrabold">Water for your business or event</h3>
                                    <p className="mt-2 max-w-md text-muted-foreground">Offices, shops, schools and events: order in bulk and get it delivered.</p>
                                    <Button asChild variant="outline" className="mt-6 bg-card/80"><Link href="/bulk-sales">Bulk orders <ArrowRight /></Link></Button>
                                </div>
                            </Panel>
                        </Reveal>
                        <Reveal>
                            <Panel className="h-full p-8">
                                <h3 className="text-2xl font-extrabold">Questions</h3>
                                <Accordion type="single" collapsible className="mt-3">
                                    {FAQS.map((f) => (
                                        <AccordionItem key={f.q} value={f.q}>
                                            <AccordionTrigger>{f.q}</AccordionTrigger>
                                            <AccordionContent>{f.a}</AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </Panel>
                        </Reveal>
                    </div>
                </section>

                {/* Final call to action */}
                <section className="border-t border-border/60 bg-gradient-to-b from-sky-50/80 to-background dark:from-sky-950/20">
                    <Reveal className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
                        <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl">Stay hydrated. Get rewarded.</h2>
                        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">Create your free account in under a minute and place your first order today.</p>
                        <div className="mt-8 flex flex-wrap justify-center gap-3">
                            <Button asChild size="xl" variant="brand" className="rounded-2xl"><Link href={primary.href}>{primary.label} <ArrowRight /></Link></Button>
                            {!user && <Button asChild size="xl" variant="ghost" className="rounded-2xl"><Link href="/login">Sign in</Link></Button>}
                        </div>
                    </Reveal>
                </section>
            </main>

            <SiteFooter />
        </div>
    );
}
