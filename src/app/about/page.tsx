'use client';

import Link from 'next/link';
import { ArrowRight, Award, Droplets, Globe, Heart, Shield, Target, Users } from 'lucide-react';
import SiteShell, { PageHero } from '@/Components/site/site-shell';
import { Button } from '@/Components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Panel } from '@/Components/ui/kit';
import { Reveal, Stagger, StaggerItem } from '@/Components/motion';
import { initials } from '@/lib/format';

// Company figures supplied by Epilux. Keep these up to date.
const STATS = [
    { number: '50,000+', label: 'Happy customers', icon: Users },
    { number: '5+', label: 'Years of experience', icon: Award },
    { number: '10', label: 'Cities served', icon: Globe },
];

const VALUES = [
    { icon: Shield, title: 'Quality first', description: 'We maintain the highest standards in water purification and packaging to ensure every drop meets our premium quality criteria.' },
    { icon: Heart, title: 'Customer care', description: 'Our customers are at the heart of everything we do. We strive to provide exceptional service and build lasting relationships.' },
    { icon: Target, title: 'Innovation', description: 'We continuously invest in new technologies and processes to improve our products and services for a better customer experience.' },
    { icon: Users, title: 'Community', description: 'We believe in giving back to the communities we serve through social responsibility initiatives and partnerships.' },
];

const MILESTONES = [
    { year: '2019', title: 'Company founded', description: 'Epilux Water was established with a vision to provide premium quality drinking water to Nigerian households and businesses.' },
    { year: '2020', title: 'First production facility', description: 'Opened our water purification and bottling facility in Lagos, equipped with advanced filtration technology.' },
    { year: '2021', title: 'Rewards programme launch', description: 'Introduced rewards and referrals, creating income opportunities for our customers.' },
    { year: '2022', title: 'Nationwide expansion', description: 'Extended our delivery network to major cities across Nigeria, making premium water more accessible.' },
    { year: '2023', title: 'Quality certifications', description: 'Achieved quality certifications and expanded our product line with new premium offerings.' },
    { year: '2024', title: 'Innovation & growth', description: 'Launched regular deliveries and bulk ordering, improving convenience for homes and businesses.' },
];

const TEAM = [
    { name: 'Ezeama Ugochukwu', role: 'Founder & CEO', bio: 'Visionary leader with 15+ years in the water industry, passionate about providing clean water solutions.' },
    { name: 'Nwabenu Udoka', role: 'Operations Director', bio: 'Expert in supply chain management and quality control, ensuring our products meet the highest standards.' },
];

export default function AboutPage() {
    return (
        <SiteShell>
            <PageHero
                eyebrow="About Epilux"
                title={<>Premium water for <span className="bg-gradient-to-r from-brand-600 to-sky-500 bg-clip-text text-transparent">healthier living</span></>}
                description="We deliver quality drinking water to Nigerian homes and businesses, and share the value with the customers who choose us."
            />

            {/* Stats */}
            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <Stagger className="grid grid-cols-3 gap-3 sm:gap-5">
                    {STATS.map(({ number, label, icon: Icon }) => (
                        <StaggerItem key={label}>
                            <Panel className="h-full p-4 text-center sm:p-6">
                                <span className="mx-auto grid size-10 place-items-center rounded-2xl bg-accent text-primary sm:size-12"><Icon className="size-5 sm:size-6" /></span>
                                <p className="mt-3 font-display text-2xl font-extrabold sm:text-4xl">{number}</p>
                                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{label}</p>
                            </Panel>
                        </StaggerItem>
                    ))}
                </Stagger>
            </section>

            {/* Mission & values */}
            <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
                <Tabs defaultValue="mission">
                    <div className="flex justify-center">
                        <TabsList>
                            <TabsTrigger value="mission">Our mission</TabsTrigger>
                            <TabsTrigger value="values">Our values</TabsTrigger>
                        </TabsList>
                    </div>
                    <TabsContent value="mission" className="mt-6">
                        <Panel className="p-6 text-center sm:p-10">
                            <Droplets className="mx-auto size-12 text-primary" />
                            <h2 className="mt-4 text-2xl font-extrabold sm:text-3xl">Our mission</h2>
                            <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
                                At Epilux Water, our mission is to provide every Nigerian with access to premium quality drinking water that promotes health,
                                convenience and sustainable living. We are committed to the highest standards of water purification while creating economic
                                opportunities through our rewards and referral programme.
                            </p>
                            <div className="mt-8 grid gap-6 text-left sm:grid-cols-3 sm:text-center">
                                {[
                                    { t: 'Quality assurance', d: 'Rigorous testing and purification ensure every bottle meets our standards.' },
                                    { t: 'Customer satisfaction', d: 'Convenient delivery and service that exceeds expectations.' },
                                    { t: 'Community impact', d: 'Income opportunities for customers and local marketers.' },
                                ].map((x) => (
                                    <div key={x.t}><p className="font-semibold">{x.t}</p><p className="mt-1 text-sm text-muted-foreground">{x.d}</p></div>
                                ))}
                            </div>
                        </Panel>
                    </TabsContent>
                    <TabsContent value="values" className="mt-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                            {VALUES.map(({ icon: Icon, title, description }) => (
                                <Panel key={title} className="flex flex-row items-start gap-4 p-5">
                                    <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-accent text-primary"><Icon className="size-5" /></span>
                                    <span><span className="block font-bold">{title}</span><span className="mt-1 block text-sm text-muted-foreground">{description}</span></span>
                                </Panel>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </section>

            {/* Journey */}
            <section className="border-y border-border/60 bg-muted/40 py-16">
                <div className="mx-auto max-w-3xl px-4 sm:px-6">
                    <Reveal className="text-center">
                        <h2 className="text-3xl font-extrabold tracking-tight">Our journey</h2>
                        <p className="mt-2 text-muted-foreground">How Epilux has grown since 2019.</p>
                    </Reveal>
                    <ol className="relative mt-10 space-y-6 border-l-2 border-primary/20 pl-8">
                        {MILESTONES.map((m) => (
                            <Reveal key={m.year}>
                                <li className="relative">
                                    <span className="absolute -left-[2.6rem] top-5 size-4 rounded-full border-4 border-background bg-primary" />
                                    <Panel className="p-5">
                                        <span className="rounded-lg bg-accent px-2 py-0.5 text-xs font-bold text-primary">{m.year}</span>
                                        <p className="mt-2 font-bold">{m.title}</p>
                                        <p className="mt-1 text-sm text-muted-foreground">{m.description}</p>
                                    </Panel>
                                </li>
                            </Reveal>
                        ))}
                    </ol>
                </div>
            </section>

            {/* Team */}
            <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
                <Reveal className="text-center">
                    <h2 className="text-3xl font-extrabold tracking-tight">Leadership</h2>
                    <p className="mt-2 text-muted-foreground">The people behind Epilux Water.</p>
                </Reveal>
                <Stagger className="mt-10 grid gap-5 sm:grid-cols-2">
                    {TEAM.map((m) => {
                        const [first, ...rest] = m.name.split(' ');
                        return (
                            <StaggerItem key={m.name}>
                                <Panel className="h-full p-6 text-center">
                                    <span className="mx-auto grid size-20 place-items-center rounded-3xl bg-gradient-brand text-2xl font-extrabold text-white shadow-lift">{initials(first, rest.join(' '))}</span>
                                    <p className="mt-4 text-lg font-bold">{m.name}</p>
                                    <p className="font-medium text-primary">{m.role}</p>
                                    <p className="mt-2 text-sm text-muted-foreground">{m.bio}</p>
                                </Panel>
                            </StaggerItem>
                        );
                    })}
                </Stagger>
            </section>

            {/* CTA */}
            <section className="px-4 pb-16 sm:px-6 lg:px-8">
                <Reveal className="aurora relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] px-6 py-12 text-center text-white sm:px-12">
                    <span aria-hidden className="aurora-blob one" />
                    <div className="relative">
                        <h2 className="text-3xl font-extrabold text-white">Join the Epilux family</h2>
                        <p className="mx-auto mt-3 max-w-xl text-white/80">Order premium water for your home or business, and earn on every order, and on your friends’ orders too.</p>
                        <div className="mt-7 flex flex-wrap justify-center gap-3">
                            <Button asChild size="lg" className="bg-white text-brand-700 hover:bg-white/90"><Link href="/products">Shop our water <ArrowRight /></Link></Button>
                            <Button asChild size="lg" variant="ghost" className="text-white ring-1 ring-white/30 hover:bg-white/10 hover:text-white"><Link href="/affiliate-reg">Refer & earn</Link></Button>
                        </div>
                    </div>
                </Reveal>
            </section>
        </SiteShell>
    );
}
