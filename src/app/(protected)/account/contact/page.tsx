'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { CheckCircle2, Clock, Inbox, Mail, MessageSquare, Phone, Send } from 'lucide-react';
import { useSendMessage } from '@/hooks/useSupport';
import { useOrders } from '@/hooks/useOrders';
import { getErrorMessage } from '@/services/base';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { PageHeader, Panel, PanelHeader } from '@/Components/ui/kit';
import { orderId, type CustomerOrder } from '@/Components/orders/order-helpers';

const TOPICS = ['Order or delivery', 'Payment', 'Wallet or withdrawal', 'Referrals', 'Account', 'Something else'];
const NO_ORDER = 'none';

function ContactContent() {
    const searchParams = useSearchParams();
    const send = useSendMessage();
    const { data: ordersData } = useOrders();
    const orders: CustomerOrder[] = ordersData?.data || [];

    const [topic, setTopic] = useState(searchParams.get('order') ? TOPICS[0] : '');
    const [order, setOrder] = useState(searchParams.get('order') || NO_ORDER);
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [sent, setSent] = useState(false);

    const selectedOrder = orders.find((o) => orderId(o) === order);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic) return toast.error('Please choose a topic');
        if (subject.trim().length < 3) return toast.error('Please add a short subject');
        if (message.trim().length < 10) return toast.error('Please tell us a bit more (at least 10 characters)');

        const prefix = selectedOrder ? `[${topic} · ${selectedOrder.orderNumber}]` : `[${topic}]`;
        send.mutate({ subject: `${prefix} ${subject.trim()}`, message: message.trim() }, {
            onSuccess: () => { setSent(true); setSubject(''); setMessage(''); },
            onError: (err) => toast.error(getErrorMessage(err, 'Could not send your message')),
        });
    };

    return (
        <div className="max-w-5xl">
            <PageHeader title="Contact us" description="Questions about an order, payment or your wallet? We're here to help." />

            <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
                <Panel>
                    {sent ? (
                        <div className="animate-fade-in-scale flex flex-col items-center px-6 py-14 text-center">
                            <span className="grid size-16 place-items-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10"><CheckCircle2 className="size-8" /></span>
                            <h2 className="mt-5 text-xl font-bold">Message sent</h2>
                            <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">Thanks for reaching out. Our team usually replies within a day, and you&apos;ll find the reply in your inbox.</p>
                            <div className="mt-6 flex flex-wrap justify-center gap-2">
                                <Button asChild><Link href="/account/inbox"><Inbox /> Go to inbox</Link></Button>
                                <Button variant="outline" onClick={() => setSent(false)}>Send another</Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <PanelHeader title="Send a message" />
                            <form onSubmit={submit} className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
                                <div className="space-y-1.5">
                                    <Label htmlFor="topic">Topic</Label>
                                    <Select value={topic} onValueChange={setTopic}>
                                        <SelectTrigger id="topic" className="h-12"><SelectValue placeholder="Choose a topic" /></SelectTrigger>
                                        <SelectContent>{TOPICS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="order">Related order (optional)</Label>
                                    <Select value={order} onValueChange={setOrder}>
                                        <SelectTrigger id="order" className="h-12"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={NO_ORDER}>No specific order</SelectItem>
                                            {orders.slice(0, 20).map((o) => <SelectItem key={orderId(o)} value={orderId(o)}>{o.orderNumber}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5 sm:col-span-2">
                                    <Label htmlFor="subject">Subject</Label>
                                    <Input id="subject" className="h-12 rounded-xl" value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={120} placeholder="What do you need help with?" />
                                </div>
                                <div className="space-y-1.5 sm:col-span-2">
                                    <Label htmlFor="message">Message</Label>
                                    <Textarea id="message" rows={6} className="rounded-xl" value={message} onChange={(e) => setMessage(e.target.value)} maxLength={2000} placeholder="Tell us what happened and how we can help." />
                                    <p className="text-right text-xs text-muted-foreground tabular-nums">{message.length}/2000</p>
                                </div>
                                <div className="sm:col-span-2"><Button type="submit" loading={send.isPending}><Send /> Send message</Button></div>
                            </form>
                        </>
                    )}
                </Panel>

                <div className="space-y-4">
                    <Panel className="p-5">
                        <p className="font-bold">Other ways to reach us</p>
                        <ul className="mt-4 space-y-4 text-sm">
                            <li className="flex items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent text-primary"><Mail className="size-4" /></span><span><span className="block font-semibold">Email</span><a href="mailto:epiluxcompany@gmail.com" className="break-all text-muted-foreground hover:text-primary">epiluxcompany@gmail.com</a></span></li>
                            <li className="flex items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent text-primary"><Phone className="size-4" /></span><span><span className="block font-semibold">Your marketer</span><span className="text-muted-foreground">For a delivery in progress, call the number on your order page.</span></span></li>
                            <li className="flex items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent text-primary"><Clock className="size-4" /></span><span><span className="block font-semibold">Response time</span><span className="text-muted-foreground">Usually within 24 hours</span></span></li>
                        </ul>
                    </Panel>
                    <Panel className="p-5">
                        <p className="flex items-center gap-2 font-bold"><MessageSquare className="size-4 text-primary" /> Quick answers</p>
                        <p className="mt-1 text-sm text-muted-foreground">Many questions are answered in the help centre.</p>
                        <Button asChild variant="outline" size="sm" className="mt-4"><Link href="/account/help">Browse help</Link></Button>
                    </Panel>
                </div>
            </div>
        </div>
    );
}

export default function ContactPage() {
    return (
        <Suspense fallback={null}>
            <ContactContent />
        </Suspense>
    );
}
