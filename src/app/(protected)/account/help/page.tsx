'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { CreditCard, Gift, Headphones, MessageSquare, Package, Search, Truck, Wallet } from 'lucide-react';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/Components/ui/accordion';
import { EmptyState, PageHeader, Panel, PanelHeader } from '@/Components/ui/kit';
import { Stagger, StaggerItem } from '@/Components/motion';
import { formatNaira } from '@/lib/format';
import { MIN_ORDER_QUANTITY } from '@/lib/constants';
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from '@/services/delivery';

type Faq = { q: string; a: string };

const SECTIONS: { id: string; title: string; icon: React.ComponentType<{ className?: string }>; faqs: Faq[] }[] = [
    {
        id: 'ordering', title: 'Ordering', icon: Package, faqs: [
            { q: 'Is there a minimum order?', a: `Yes. Each product is ordered in packs of at least ${MIN_ORDER_QUANTITY} units so deliveries stay affordable.` },
            { q: 'Can I cancel an order?', a: 'You can cancel an order while it is still awaiting payment. Once it has been paid, contact us and we will help.' },
            { q: 'How do I track my order?', a: 'Open My orders and tap the order. You will see each step, from payment to delivery, and your marketer\'s phone number once one is assigned.' },
        ],
    },
    {
        id: 'delivery', title: 'Delivery', icon: Truck, faqs: [
            { q: 'How much is delivery?', a: `Delivery costs ${formatNaira(DELIVERY_FEE)}. It's free on orders of ${formatNaira(FREE_DELIVERY_THRESHOLD)} or more.` },
            { q: 'Who delivers my order?', a: 'After payment, your order is automatically assigned to an Epilux marketer near you who brings it to your door.' },
            { q: 'What happens when my order arrives?', a: 'Your marketer marks it as delivered, then you confirm receipt in the app. Confirming completes the order and releases your reward.' },
        ],
    },
    {
        id: 'payments', title: 'Payments', icon: CreditCard, faqs: [
            { q: 'How can I pay?', a: 'Pay securely by card, bank transfer or USSD through Flutterwave, or use your Epilux wallet balance.' },
            { q: 'My payment went through but the order still says awaiting payment', a: 'This usually clears within a few minutes. If it doesn\'t, send us a message with your order number and we\'ll check it right away.' },
        ],
    },
    {
        id: 'rewards', title: 'Wallet & rewards', icon: Wallet, faqs: [
            { q: 'How do I earn rewards?', a: 'A share of every order you buy is paid into your wallet once you confirm delivery.' },
            { q: 'When can I withdraw?', a: 'Withdrawals open from the 26th to the 30th of each month. Add your bank details in the wallet and request a payout during that window.' },
            { q: 'Can I pay with my wallet balance?', a: 'Yes. Choose Wallet at checkout if your balance covers the order total.' },
        ],
    },
    {
        id: 'referrals', title: 'Referrals', icon: Gift, faqs: [
            { q: 'How does Refer & earn work?', a: 'Share your invite link. When a friend joins with it and confirms a delivery, the reward is shared: your friend keeps 60% and you receive 40%.' },
            { q: 'Is there a limit to how many friends I can invite?', a: 'No. Every friend who joins with your link earns you a share on each of their orders.' },
        ],
    },
];

export default function HelpPage() {
    const [query, setQuery] = useState('');

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return SECTIONS;
        return SECTIONS
            .map((s) => ({ ...s, faqs: s.faqs.filter((f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)) }))
            .filter((s) => s.faqs.length > 0);
    }, [query]);

    return (
        <div className="max-w-4xl">
            <PageHeader title="Help centre" description="Quick answers about ordering, delivery, payments and rewards." />

            <div className="relative mb-6">
                <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search for a question" className="h-12 rounded-2xl pl-12" aria-label="Search help" />
            </div>

            {results.length === 0 ? (
                <Panel>
                    <EmptyState icon={Search} title="No answers found" description="Try other words, or send us a message and we'll get back to you." action={{ label: 'Contact us', href: '/account/contact' }} />
                </Panel>
            ) : (
                <Stagger immediate className="space-y-4">
                    {results.map(({ id, title, icon: Icon, faqs }) => (
                        <StaggerItem key={id}>
                            <Panel>
                                <PanelHeader title={<span className="flex items-center gap-2.5"><span className="grid size-8 place-items-center rounded-lg bg-accent text-primary"><Icon className="size-4" /></span>{title}</span>} />
                                <Accordion type="single" collapsible className="px-5 sm:px-6">
                                    {faqs.map((f) => (
                                        <AccordionItem key={f.q} value={f.q}>
                                            <AccordionTrigger>{f.q}</AccordionTrigger>
                                            <AccordionContent>{f.a}</AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </Panel>
                        </StaggerItem>
                    ))}
                </Stagger>
            )}

            <Panel className="mt-6 flex flex-col items-start gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-brand text-white"><Headphones className="size-6" /></span>
                <div className="flex-1">
                    <p className="font-bold">Still need help?</p>
                    <p className="text-sm text-muted-foreground">Send us a message. Replies arrive in your inbox.</p>
                </div>
                <Button asChild><Link href="/account/contact"><MessageSquare /> Contact us</Link></Button>
            </Panel>
        </div>
    );
}
