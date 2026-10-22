'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, Gift, Repeat, Share2, ShoppingBag, UserPlus, Wallet } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import SiteHeader from '@/Components/site/site-header';
import Footer from '@/Components/site/site-footer';
import { Button } from '@/Components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/Components/ui/accordion';
import { Panel } from '@/Components/ui/kit';
import { Reveal, Stagger, StaggerItem } from '@/Components/motion';

const STEPS = [
    { icon: Share2, title: 'Share your link', text: 'Every Epilux account has its own invite link. Send it on WhatsApp, Instagram or anywhere your friends are.' },
    { icon: UserPlus, title: 'Friends sign up and order', text: 'Anyone who registers with your link is connected to you for good.' },
    { icon: Wallet, title: 'You both earn', text: 'Each time they confirm a delivery, the reward on that order is shared: they keep 60% and you get 40%, straight into your wallet.' },
];

const PERKS = [
    { icon: ShoppingBag, title: 'You earn on your own orders too', text: 'Every customer gets a reward on their own purchases. Referring friends adds a second way to earn.' },
    { icon: Repeat, title: 'Every order, not just the first', text: 'You earn on every order your friends place, for as long as they keep ordering.' },
    { icon: Gift, title: 'No sign-up fee, no targets', text: "There's nothing to join and nothing to sell. Order water you need, share your link, and earn." },
];

const FAQS = [
    { q: 'Do I need a special account to refer people?', a: 'No. Every Epilux customer can refer friends from the Refer & earn page in their account.' },
    { q: 'When do I get paid?', a: 'The moment your friend confirms that their order was delivered, your share is added to your wallet.' },
    { q: 'How do I withdraw?', a: 'Add your bank details in your wallet and request a withdrawal during the monthly withdrawal window (shown in the app).' },
    { q: 'Does my friend lose anything?', a: "No. Your friend still earns their own reward on every order. The referral share comes from that order's reward: they keep 60% and you receive 40%." },
    { q: 'How many people can I invite?', a: "As many as you like. Your friends can share their own links too: you earn on the people you invite, and they earn on the people they invite. It doesn't matter whether you joined with someone's link or on your own." },
];

export default function ReferAndEarnPage() {
    const { user } = useAuth();
    const cta = user ? { href: '/products/referrals', label: 'Get my invite link' } : { href: '/register', label: 'Create a free account' };

    return (
        <div className="min-h-dvh bg-background">
            <SiteHeader />

            <section className="aurora relative overflow-hidden text-white">
                <span aria-hidden className="aurora-blob one" />
                <span aria-hidden className="aurora-blob two" />
                <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
                    <p className="animate-fade-in inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium ring-1 ring-white/20"><Gift className="size-4 text-amber-200" /> Refer & earn</p>
                    <h1 className="animate-fade-in mt-5 max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl" style={{ animationDelay: '80ms' }}>
                        Invite friends. <span className="text-gradient-light">Earn on every order they make.</span>
                    </h1>
                    <p className="animate-fade-in mt-5 max-w-xl text-lg text-white/80" style={{ animationDelay: '140ms' }}>
                        Every Epilux customer is part of the programme. Share your link, and when friends you invite confirm a delivery, 40% of their reward goes into your wallet.
                    </p>
                    <div className="animate-fade-in mt-8 flex flex-wrap gap-3" style={{ animationDelay: '200ms' }}>
                        <Button asChild size="xl" className="bg-white text-brand-700 hover:bg-white/90"><Link href={cta.href}>{cta.label} <ArrowRight /></Link></Button>
                        {!user && <Button asChild size="xl" variant="ghost" className="text-white ring-1 ring-white/30 hover:bg-white/10 hover:text-white"><Link href="/login">I already have an account</Link></Button>}
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <Reveal><h2 className="text-center text-3xl font-extrabold tracking-tight">How it works</h2></Reveal>
                <Stagger className="mt-10 grid gap-4 md:grid-cols-3">
                    {STEPS.map(({ icon: Icon, title, text }, i) => (
                        <StaggerItem key={title}>
                            <Panel className="h-full p-6">
                                <div className="flex items-center gap-3">
                                    <span className="grid size-12 place-items-center rounded-2xl bg-accent text-primary"><Icon className="size-6" /></span>
                                    <span className="text-sm font-bold text-muted-foreground">STEP {i + 1}</span>
                                </div>
                                <h3 className="mt-4 text-lg font-bold">{title}</h3>
                                <p className="mt-1.5 text-muted-foreground">{text}</p>
                            </Panel>
                        </StaggerItem>
                    ))}
                </Stagger>
            </section>

            <section className="bg-muted/40 py-16">
                <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
                    <Reveal>
                        <h2 className="text-3xl font-extrabold tracking-tight">A simple 60 / 40 split</h2>
                        <p className="mt-3 text-muted-foreground">When a friend you referred confirms a delivery, the reward on that order is shared between you.</p>
                        <ul className="mt-6 space-y-3">
                            {PERKS.map(({ icon: Icon, title, text }) => (
                                <li key={title} className="flex gap-3">
                                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-card text-primary shadow-soft"><Icon className="size-5" /></span>
                                    <span><span className="block font-semibold">{title}</span><span className="block text-sm text-muted-foreground">{text}</span></span>
                                </li>
                            ))}
                        </ul>
                    </Reveal>
                    <Reveal>
                        <Panel className="p-6 sm:p-8">
                            <p className="text-sm font-semibold text-muted-foreground">Each confirmed order from a friend you referred</p>
                            <div className="mt-5 space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm font-semibold"><span>Your friend keeps</span><span>60%</span></div>
                                    <div className="mt-2 h-3 overflow-hidden rounded-full bg-muted"><div className="h-full w-[60%] rounded-full bg-gradient-brand" /></div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm font-semibold"><span>You receive</span><span>40%</span></div>
                                    <div className="mt-2 h-3 overflow-hidden rounded-full bg-muted"><div className="h-full w-[40%] rounded-full bg-gradient-sun" /></div>
                                </div>
                            </div>
                            <p className="mt-6 flex items-start gap-2 text-sm text-muted-foreground"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" /> Paid into your Epilux wallet automatically. Withdraw to your bank during the monthly withdrawal window.</p>
                        </Panel>
                    </Reveal>
                </div>
            </section>

            <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
                <Reveal><h2 className="text-center text-3xl font-extrabold tracking-tight">Questions</h2></Reveal>
                <Panel className="mt-8 px-5 sm:px-6">
                    <Accordion type="single" collapsible>
                        {FAQS.map((f) => (
                            <AccordionItem key={f.q} value={f.q}>
                                <AccordionTrigger>{f.q}</AccordionTrigger>
                                <AccordionContent>{f.a}</AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </Panel>
                <div className="mt-10 text-center">
                    <Button asChild size="xl"><Link href={cta.href}>{cta.label} <ArrowRight /></Link></Button>
                </div>
            </section>

            <Footer />
        </div>
    );
}
