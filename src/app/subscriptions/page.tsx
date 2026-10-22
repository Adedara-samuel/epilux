'use client';

import Link from 'next/link';
import { ArrowRight, CalendarClock, PhoneCall, Repeat, ShoppingBag } from 'lucide-react';
import SiteShell, { PageHero } from '@/Components/site/site-shell';
import { InquiryForm } from '@/Components/site/inquiry-form';
import { Button } from '@/Components/ui/button';
import { Panel, PanelHeader } from '@/Components/ui/kit';
import { Reveal, Stagger, StaggerItem } from '@/Components/motion';

// Recurring deliveries are arranged with the team; there is no automatic
// subscription billing, so this page collects requests instead of selling plans.
const POINTS = [
    { icon: Repeat, title: 'Set it once', text: 'Choose what you need and how often. We plan the deliveries around you.' },
    { icon: CalendarClock, title: 'On your schedule', text: 'Weekly, every two weeks or monthly, on the day that suits you.' },
    { icon: PhoneCall, title: 'Easy to change', text: 'Need more, less or a pause? Just message us.' },
];

export default function RegularDeliveryPage() {
    return (
        <SiteShell>
            <PageHero
                eyebrow="Regular delivery"
                title={<>Never run out of <span className="bg-gradient-to-r from-brand-600 to-sky-500 bg-clip-text text-transparent">water</span></>}
                description="Set up a regular delivery for your home or business and we’ll bring your water on schedule."
            >
                <Button asChild size="xl" variant="brand" className="rounded-2xl"><a href="#request">Set up regular delivery <ArrowRight /></a></Button>
                <Button asChild size="xl" variant="outline" className="rounded-2xl"><Link href="/products"><ShoppingBag /> One-off order</Link></Button>
            </PageHero>

            <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                <Stagger className="grid gap-4 md:grid-cols-3">
                    {POINTS.map(({ icon: Icon, title, text }) => (
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

            <section id="request" className="scroll-mt-20 border-t border-border/60 bg-muted/40 py-14">
                <div className="mx-auto max-w-3xl px-4 sm:px-6">
                    <Reveal>
                        <Panel>
                            <PanelHeader title="Request a regular delivery" description="We’ll confirm the schedule and price with you before the first delivery." />
                            <div className="p-5 sm:p-6">
                                <InquiryForm
                                    inquiryType="subscription"
                                    subject="Regular delivery request"
                                    extraFields={[
                                        { key: 'what', label: 'What would you like', type: 'text', placeholder: 'e.g. 10 bags of sachet water', required: true },
                                        { key: 'frequency', label: 'How often', type: 'select', options: ['Weekly', 'Every two weeks', 'Monthly'], required: true },
                                        { key: 'area', label: 'Delivery area', type: 'text', placeholder: 'e.g. Lekki, Lagos', required: true },
                                        { key: 'day', label: 'Preferred day', type: 'select', options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Any day'] },
                                    ]}
                                    messageLabel="Anything else?"
                                    messagePlaceholder="Delivery address details, best time to call…"
                                    submitLabel="Send request"
                                    successTitle="Request received"
                                    successText="We’ll contact you to confirm your schedule and price before the first delivery."
                                />
                            </div>
                        </Panel>
                    </Reveal>
                </div>
            </section>
        </SiteShell>
    );
}
