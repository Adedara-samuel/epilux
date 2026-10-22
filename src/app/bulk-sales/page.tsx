/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Building2, CalendarDays, GraduationCap, MessagesSquare, PartyPopper, Store, Truck, Wallet } from 'lucide-react';
import SiteShell, { PageHero } from '@/Components/site/site-shell';
import { InquiryForm } from '@/Components/site/inquiry-form';
import { productsAPI } from '@/services/products';
import { Button } from '@/Components/ui/button';
import { Panel, PanelHeader } from '@/Components/ui/kit';
import { Reveal, Stagger, StaggerItem } from '@/Components/motion';
import { formatNaira } from '@/lib/format';
import { handleImageError, productImageUrl } from '@/lib/images';
import { FREE_DELIVERY_THRESHOLD } from '@/services/delivery';

type Product = { _id: string; name: string; price: number; category?: string; images?: { url: string; isPrimary?: boolean }[]; primaryImage?: string | null };

const USES = [
    { icon: Building2, title: 'Offices', text: 'Keep the team supplied week after week.' },
    { icon: PartyPopper, title: 'Events', text: 'Weddings, parties, conferences and church programmes.' },
    { icon: GraduationCap, title: 'Schools', text: 'Clean drinking water for pupils and staff.' },
    { icon: Store, title: 'Shops & kiosks', text: 'Stock Epilux water for your customers.' },
];

const STEPS = [
    { icon: MessagesSquare, title: 'Tell us what you need', text: 'Quantity, how often, and where it should go.' },
    { icon: CalendarDays, title: 'We agree the details', text: 'Our team confirms pricing and delivery dates with you.' },
    { icon: Truck, title: 'We deliver', text: 'Your order arrives on the agreed day, every time.' },
];

function LivePrices() {
    const { data, isLoading } = useQuery({ queryKey: ['products', 'bulk'], queryFn: () => productsAPI.getProducts({ limit: 12 }) });
    const products: Product[] = ((data as { products?: Product[] } | undefined)?.products || []).slice(0, 6);
    if (!isLoading && products.length === 0) return null;
    return (
        <Panel className="overflow-hidden">
            <PanelHeader title="Current prices" description="Standard per-unit prices. Volume pricing is agreed with our team." />
            <ul className="divide-y divide-border/60">
                {isLoading
                    ? [0, 1, 2].map((i) => <li key={i} className="p-4"><div className="skeleton-shimmer h-10 rounded-xl" /></li>)
                    : products.map((p) => (
                        <li key={p._id} className="flex items-center gap-3 px-5 py-3 sm:px-6">
                            <img src={productImageUrl(p)} onError={handleImageError} alt="" className="size-11 rounded-xl bg-muted object-contain p-1" />
                            <span className="min-w-0 flex-1">
                                <span className="block truncate font-semibold">{p.name}</span>
                                {p.category && <span className="block text-xs capitalize text-muted-foreground">{p.category}</span>}
                            </span>
                            <span className="font-bold tabular-nums">{formatNaira(p.price)}</span>
                        </li>
                    ))}
            </ul>
        </Panel>
    );
}

export default function BulkSalesPage() {
    return (
        <SiteShell>
            <PageHero
                eyebrow="Bulk orders"
                title={<>Water for your <span className="bg-gradient-to-r from-brand-600 to-sky-500 bg-clip-text text-transparent">business or event</span></>}
                description="Order large quantities for your office, shop, school or event, as a one-off or on a regular schedule."
            >
                <Button asChild size="xl" variant="brand" className="rounded-2xl"><a href="#enquire">Get a quote <ArrowRight /></a></Button>
                <Button asChild size="xl" variant="outline" className="rounded-2xl"><Link href="/products">Order online now</Link></Button>
            </PageHero>

            <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                <Stagger className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {USES.map(({ icon: Icon, title, text }) => (
                        <StaggerItem key={title}>
                            <Panel className="h-full p-5">
                                <span className="grid size-11 place-items-center rounded-2xl bg-accent text-primary"><Icon className="size-5" /></span>
                                <p className="mt-4 font-bold">{title}</p>
                                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                            </Panel>
                        </StaggerItem>
                    ))}
                </Stagger>
            </section>

            <section className="border-y border-border/60 bg-muted/40 py-14">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Reveal><h2 className="text-center text-3xl font-extrabold tracking-tight">How bulk orders work</h2></Reveal>
                    <Stagger className="mt-10 grid gap-4 md:grid-cols-3">
                        {STEPS.map(({ icon: Icon, title, text }, i) => (
                            <StaggerItem key={title}>
                                <Panel className="flex h-full flex-row items-start gap-4 p-5">
                                    <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-brand text-white shadow-lift"><Icon className="size-5" /></span>
                                    <span>
                                        <span className="text-xs font-bold text-muted-foreground">STEP {i + 1}</span>
                                        <span className="block font-bold">{title}</span>
                                        <span className="block text-sm text-muted-foreground">{text}</span>
                                    </span>
                                </Panel>
                            </StaggerItem>
                        ))}
                    </Stagger>
                </div>
            </section>

            <section id="enquire" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-14 sm:px-6 lg:px-8">
                <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
                    <Reveal>
                        <Panel>
                            <PanelHeader title="Request a quote" description="Tell us what you need and we’ll come back with pricing and delivery dates." />
                            <div className="p-5 sm:p-6">
                                <InquiryForm
                                    inquiryType="bulk"
                                    subject="Bulk order enquiry"
                                    extraFields={[
                                        { key: 'organisation', label: 'Business or event name', type: 'text' },
                                        { key: 'quantity', label: 'Roughly how many units', type: 'text', placeholder: 'e.g. 200 bags of sachet water', required: true },
                                        { key: 'frequency', label: 'How often', type: 'select', options: ['One-off', 'For an event', 'Weekly', 'Every two weeks', 'Monthly'], required: true },
                                        { key: 'area', label: 'Delivery area', type: 'text', placeholder: 'e.g. Ikeja, Lagos', required: true },
                                    ]}
                                    messageLabel="Anything else we should know?"
                                    messagePlaceholder="Delivery date, product preference, access instructions…"
                                    submitLabel="Request a quote"
                                    successTitle="Thanks, we’ll be in touch"
                                    successText="Our team will contact you with pricing and delivery options, usually within one working day."
                                />
                            </div>
                        </Panel>
                    </Reveal>
                    <div className="space-y-4">
                        <Reveal><LivePrices /></Reveal>
                        <Reveal>
                            <Panel className="p-5">
                                <p className="flex items-center gap-2 font-bold"><Wallet className="size-4 text-primary" /> Earn while you stock up</p>
                                <p className="mt-1 text-sm text-muted-foreground">Bulk orders placed through your Epilux account earn rewards like any other order, and delivery is free from {formatNaira(FREE_DELIVERY_THRESHOLD)}.</p>
                            </Panel>
                        </Reveal>
                    </div>
                </div>
            </section>
        </SiteShell>
    );
}
