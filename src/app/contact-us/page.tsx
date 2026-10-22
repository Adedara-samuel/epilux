'use client';

import Link from 'next/link';
import { Clock, Headphones, Mail, MessageCircle, Package } from 'lucide-react';
import SiteShell, { PageHero } from '@/Components/site/site-shell';
import { InquiryForm } from '@/Components/site/inquiry-form';
import { Button } from '@/Components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/Components/ui/accordion';
import { Panel, PanelHeader } from '@/Components/ui/kit';
import { Reveal } from '@/Components/motion';
import { formatNaira } from '@/lib/format';
import { MIN_ORDER_QUANTITY } from '@/lib/constants';
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from '@/services/delivery';

const WHATSAPP = 'https://wa.me/2349136274739?text=Hello%20Epilux%2C%20I%20have%20a%20question';

const CHANNELS = [
    { icon: MessageCircle, title: 'WhatsApp', text: 'The quickest way to reach us', action: { label: 'Chat on WhatsApp', href: WHATSAPP, external: true } },
    { icon: Mail, title: 'Email', text: 'epiluxcompany@gmail.com', action: { label: 'Send an email', href: 'mailto:epiluxcompany@gmail.com', external: true } },
    { icon: Package, title: 'Question about an order?', text: 'Sign in and message us from your account. We’ll see the order details.', action: { label: 'Message from my account', href: '/account/contact', external: false } },
];

const FAQS = [
    { q: 'How much is delivery?', a: `Delivery costs ${formatNaira(DELIVERY_FEE)} and is free on orders of ${formatNaira(FREE_DELIVERY_THRESHOLD)} or more.` },
    { q: 'Is there a minimum order?', a: `Yes: at least ${MIN_ORDER_QUANTITY} units of each product per order.` },
    { q: 'How can I pay?', a: 'Pay online by card, bank transfer or USSD through Flutterwave, or with your Epilux wallet balance.' },
    { q: 'Who delivers my order?', a: 'Once you pay, a local Epilux marketer is assigned and brings your order to you. Their phone number appears on your order page.' },
    { q: 'How do rewards and referrals work?', a: 'Every order earns a reward when you confirm delivery. Friends who join with your invite link share their reward with you: they keep 60% and you receive 40%.' },
];

export default function ContactUsPage() {
    return (
        <SiteShell>
            <PageHero eyebrow="Contact" title="We’re here to help" description="Questions about ordering, delivery, payments or rewards? Send us a message and our team will get back to you." />

            <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
                    <Reveal>
                        <Panel>
                            <PanelHeader title="Send us a message" description="We usually reply within one working day." />
                            <div className="p-5 sm:p-6">
                                <InquiryForm
                                    inquiryType="general"
                                    subjectField
                                    extraFields={[{ key: 'topic', label: 'Topic', type: 'select', options: ['Ordering', 'Delivery', 'Payment', 'Wallet or rewards', 'Business or bulk order', 'Something else'] }]}
                                />
                            </div>
                        </Panel>
                    </Reveal>

                    <div className="space-y-4">
                        {CHANNELS.map(({ icon: Icon, title, text, action }) => (
                            <Reveal key={title}>
                                <Panel className="p-5">
                                    <div className="flex items-start gap-3">
                                        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-accent text-primary"><Icon className="size-5" /></span>
                                        <div className="min-w-0">
                                            <p className="font-bold">{title}</p>
                                            <p className="break-words text-sm text-muted-foreground">{text}</p>
                                            <Button asChild variant="outline" size="sm" className="mt-3">
                                                {action.external
                                                    ? <a href={action.href} target={action.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">{action.label}</a>
                                                    : <Link href={action.href}>{action.label}</Link>}
                                            </Button>
                                        </div>
                                    </div>
                                </Panel>
                            </Reveal>
                        ))}
                        <Reveal>
                            <p className="flex items-center gap-2 px-1 text-sm text-muted-foreground"><Clock className="size-4" /> Replies within one working day</p>
                        </Reveal>
                    </div>
                </div>
            </section>

            <section className="border-t border-border/60 bg-muted/40 py-14">
                <div className="mx-auto max-w-3xl px-4 sm:px-6">
                    <Reveal className="text-center">
                        <h2 className="text-3xl font-extrabold tracking-tight">Common questions</h2>
                        <p className="mt-2 text-muted-foreground">Signed in? The <Link href="/account/help" className="font-semibold text-primary hover:underline">help centre</Link> has more answers.</p>
                    </Reveal>
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
                    <p className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground"><Headphones className="size-4" /> Still stuck? WhatsApp us and we’ll sort it out.</p>
                </div>
            </section>
        </SiteShell>
    );
}
