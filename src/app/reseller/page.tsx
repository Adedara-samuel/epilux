'use client';

import { ArrowRight, BadgeCheck, Gift, Handshake, Truck } from 'lucide-react';
import SiteShell, { PageHero } from '@/Components/site/site-shell';
import { InquiryForm } from '@/Components/site/inquiry-form';
import { Button } from '@/Components/ui/button';
import { Panel, PanelHeader } from '@/Components/ui/kit';
import { Reveal, Stagger, StaggerItem } from '@/Components/motion';

const BENEFITS = [
    { icon: Truck, title: 'Delivered to your shop', text: 'Restock without leaving your business. We bring it to you.' },
    { icon: BadgeCheck, title: 'A brand customers trust', text: 'Sell premium Epilux sachet and bottled water.' },
    { icon: Gift, title: 'Rewards on your orders', text: 'Restock orders through your account earn rewards like any other order.' },
    { icon: Handshake, title: 'A team behind you', text: 'Talk to us about pricing, stock levels and delivery schedules.' },
];

const STEPS = ['Apply with the form below', 'We call you to agree pricing and supply', 'Order and restock whenever you need'];

export default function ResellerPage() {
    return (
        <SiteShell>
            <PageHero
                eyebrow="Resell Epilux"
                title={<>Stock Epilux water in <span className="bg-gradient-to-r from-brand-600 to-sky-500 bg-clip-text text-transparent">your business</span></>}
                description="Supermarkets, kiosks, distributors and event vendors: become an Epilux reseller and get reliable supply delivered to your door."
            >
                <Button asChild size="xl" variant="brand" className="rounded-2xl"><a href="#apply">Apply now <ArrowRight /></a></Button>
            </PageHero>

            <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {BENEFITS.map(({ icon: Icon, title, text }) => (
                        <StaggerItem key={title}>
                            <Panel className="h-full p-6">
                                <span className="grid size-12 place-items-center rounded-2xl bg-accent text-primary"><Icon className="size-6" /></span>
                                <p className="mt-4 text-lg font-bold">{title}</p>
                                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                            </Panel>
                        </StaggerItem>
                    ))}
                </Stagger>
            </section>

            <section id="apply" className="scroll-mt-20 border-t border-border/60 bg-muted/40 py-14">
                <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-6 px-4 sm:px-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start lg:px-8">
                    <Reveal>
                        <h2 className="text-3xl font-extrabold tracking-tight">How it works</h2>
                        <ol className="mt-6 space-y-4">
                            {STEPS.map((s, i) => (
                                <li key={s} className="flex items-center gap-3">
                                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-brand text-sm font-bold text-white">{i + 1}</span>
                                    <span className="font-medium">{s}</span>
                                </li>
                            ))}
                        </ol>
                        <p className="mt-6 text-sm text-muted-foreground">Reseller pricing depends on your volume and location, and is agreed directly with our team.</p>
                    </Reveal>
                    <Reveal>
                        <Panel>
                            <PanelHeader title="Reseller application" description="It takes about a minute." />
                            <div className="p-5 sm:p-6">
                                <InquiryForm
                                    inquiryType="reseller"
                                    subject="Reseller application"
                                    extraFields={[
                                        { key: 'business', label: 'Business name', type: 'text', required: true },
                                        { key: 'type', label: 'Type of business', type: 'select', options: ['Supermarket or shop', 'Kiosk', 'Distributor', 'Event vendor', 'Other'], required: true },
                                        { key: 'location', label: 'Business location', type: 'text', placeholder: 'e.g. Surulere, Lagos', required: true },
                                        { key: 'volume', label: 'Expected monthly volume', type: 'select', options: ['Under 100 units', '100–500 units', '500–1,000 units', 'Over 1,000 units'] },
                                    ]}
                                    messageLabel="Tell us about your business"
                                    messagePlaceholder="What you sell now, opening hours, how you'd like to receive deliveries…"
                                    submitLabel="Submit application"
                                    successTitle="Application received"
                                    successText="Thanks for applying. Our team will call you to talk about pricing and supply."
                                />
                            </div>
                        </Panel>
                    </Reveal>
                </div>
            </section>
        </SiteShell>
    );
}
