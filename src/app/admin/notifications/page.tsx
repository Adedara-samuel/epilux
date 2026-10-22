'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle2, Globe, Inbox, Mail, MessageSquare, Phone, Send } from 'lucide-react';
import { useAdminInbox, useContactMessages, useReplyToMessage, useSetContactStatus, useSetMessageRead } from '@/hooks/useAdmin';
import type { AdminMessage, ContactMessage } from '@/services/admin';
import { getErrorMessage } from '@/services/base';
import { Button } from '@/Components/ui/button';
import { Textarea } from '@/Components/ui/textarea';
import { Tabs, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { EmptyState, ErrorState, PageHeader, Panel, Pill } from '@/Components/ui/kit';
import { cn } from '@/lib/utils';
import { formatDateTime, fullName, timeAgo } from '@/lib/format';

const CONTACT_TONE = { new: 'warning', read: 'info', resolved: 'success' } as const;

function CustomerThread({ m, onBack }: { m: AdminMessage; onBack: () => void }) {
    const reply = useReplyToMessage();
    const [text, setText] = useState('');
    useEffect(() => setText(''), [m._id]);

    const send = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim().length < 2) return toast.error('Write a reply first');
        reply.mutate({ id: m._id, message: text.trim() }, {
            onSuccess: () => { toast.success('Reply sent. The customer will see it in their inbox.'); setText(''); },
            onError: (err) => toast.error(getErrorMessage(err, 'Could not send the reply')),
        });
    };

    return (
        <div className="flex h-full flex-col">
            <div className="flex items-start gap-3 border-b border-border/60 px-5 py-4 sm:px-6">
                <Button variant="ghost" size="icon-sm" className="-ml-2 lg:hidden" onClick={onBack} aria-label="Back"><ArrowLeft /></Button>
                <div className="min-w-0 flex-1">
                    <h2 className="font-bold">{m.subject || 'No subject'}</h2>
                    <p className="mt-0.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span>{fullName(m.sender) || 'Customer'}</span>
                        {m.sender?.email && <a href={`mailto:${m.sender.email}`} className="flex items-center gap-1 hover:text-primary"><Mail className="size-3" />{m.sender.email}</a>}
                        {m.sender?.profile?.phone && <a href={`tel:${m.sender.profile.phone}`} className="flex items-center gap-1 hover:text-primary"><Phone className="size-3" />{m.sender.profile.phone}</a>}
                    </p>
                </div>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5 sm:px-6">
                <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-muted px-4 py-3">
                    <p className="whitespace-pre-wrap text-sm">{m.content}</p>
                    <p className="mt-1.5 text-[11px] text-muted-foreground">{formatDateTime(m.createdAt)}</p>
                </div>
                {m.replies.map((r) => (
                    <div key={r._id} className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-primary px-4 py-3 text-primary-foreground">
                        <p className="whitespace-pre-wrap text-sm">{r.content}</p>
                        <p className="mt-1.5 text-[11px] opacity-80">{fullName(r.sender) || 'Epilux'} · {formatDateTime(r.createdAt)}</p>
                    </div>
                ))}
            </div>
            <form onSubmit={send} className="flex items-end gap-2 border-t border-border/60 px-5 py-4 sm:px-6">
                <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={2} maxLength={2000} placeholder="Write a reply…" className="min-h-0 flex-1 resize-none rounded-xl"
                    onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) send(e); }} aria-label="Reply" />
                <Button type="submit" loading={reply.isPending} aria-label="Send reply"><Send /> <span className="hidden sm:inline">Send</span></Button>
            </form>
        </div>
    );
}

function ContactDetail({ c, onBack }: { c: ContactMessage; onBack: () => void }) {
    const setStatus = useSetContactStatus();
    const update = (status: ContactMessage['status']) => setStatus.mutate({ id: c._id, status }, {
        onSuccess: () => toast.success(status === 'resolved' ? 'Marked as resolved' : 'Updated'),
        onError: (err) => toast.error(getErrorMessage(err, 'Could not update the message')),
    });
    const mailto = `mailto:${c.email}?subject=${encodeURIComponent(`Re: ${c.subject || 'Your message to Epilux'}`)}`;

    return (
        <div className="flex h-full flex-col">
            <div className="flex items-start gap-3 border-b border-border/60 px-5 py-4 sm:px-6">
                <Button variant="ghost" size="icon-sm" className="-ml-2 lg:hidden" onClick={onBack} aria-label="Back"><ArrowLeft /></Button>
                <div className="min-w-0 flex-1">
                    <h2 className="font-bold">{c.subject || c.inquiryType || 'Website enquiry'}</h2>
                    <p className="mt-0.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span>{c.name}</span>
                        <a href={`mailto:${c.email}`} className="flex items-center gap-1 hover:text-primary"><Mail className="size-3" />{c.email}</a>
                        {c.phone && <a href={`tel:${c.phone}`} className="flex items-center gap-1 hover:text-primary"><Phone className="size-3" />{c.phone}</a>}
                    </p>
                </div>
                <Pill tone={CONTACT_TONE[c.status]} dot>{c.status}</Pill>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
                {c.inquiryType && <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{c.inquiryType}</p>}
                <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{c.message}</p>
                <p className="mt-4 text-xs text-muted-foreground">Received {formatDateTime(c.createdAt)}</p>
            </div>
            <div className="flex flex-wrap gap-2 border-t border-border/60 px-5 py-4 sm:px-6">
                <Button asChild><a href={mailto} onClick={() => c.status === 'new' && update('read')}><Mail /> Reply by email</a></Button>
                {c.status !== 'resolved'
                    ? <Button variant="outline" onClick={() => update('resolved')} loading={setStatus.isPending}><CheckCircle2 /> Mark resolved</Button>
                    : <Button variant="ghost" onClick={() => update('read')} loading={setStatus.isPending}>Reopen</Button>}
            </div>
        </div>
    );
}

export default function AdminMessagesPage() {
    const [tab, setTab] = useState<'customers' | 'website'>('customers');
    const [openId, setOpenId] = useState<string | null>(null);
    const inbox = useAdminInbox();
    const contact = useContactMessages();
    const markRead = useSetMessageRead();
    const setContactStatus = useSetContactStatus();

    useEffect(() => setOpenId(null), [tab]);

    const messages = inbox.data?.messages || [];
    const contacts = useMemo(() => contact.data || [], [contact.data]);
    const newContacts = contacts.filter((c) => c.status === 'new').length;
    const query = tab === 'customers' ? inbox : contact;
    const openMessage = messages.find((m) => m._id === openId) || null;
    const openContact = contacts.find((c) => c._id === openId) || null;
    const isOpen = tab === 'customers' ? !!openMessage : !!openContact;

    const open = (id: string) => {
        setOpenId(id);
        if (tab === 'customers') {
            const m = messages.find((x) => x._id === id);
            if (m && !m.isRead) markRead.mutate({ id, isRead: true });
        } else {
            const c = contacts.find((x) => x._id === id);
            if (c?.status === 'new') setContactStatus.mutate({ id, status: 'read' });
        }
    };

    const rows = tab === 'customers'
        ? messages.map((m) => ({ id: m._id, name: fullName(m.sender) || 'Customer', subject: m.subject || 'No subject', preview: m.content, at: m.createdAt, unread: !m.isRead, replied: m.replies.length > 0 }))
        : contacts.map((c) => ({ id: c._id, name: c.name, subject: c.subject || c.inquiryType || 'Website enquiry', preview: c.message, at: c.createdAt, unread: c.status === 'new', replied: c.status === 'resolved' }));

    return (
        <div>
            <PageHeader title="Messages" description="Questions from customers in the app and from the website contact form." />

            <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="mb-4">
                <TabsList className="grid w-full grid-cols-2 sm:inline-flex sm:w-fit">
                    <TabsTrigger value="customers"><MessageSquare /> Customers{!!inbox.data?.unread && <span className="ml-1 rounded-full bg-primary px-1.5 text-[11px] font-bold text-primary-foreground">{inbox.data.unread}</span>}</TabsTrigger>
                    <TabsTrigger value="website"><Globe /> Contact form{!!newContacts && <span className="ml-1 rounded-full bg-primary px-1.5 text-[11px] font-bold text-primary-foreground">{newContacts}</span>}</TabsTrigger>
                </TabsList>
            </Tabs>

            <Panel className="overflow-hidden">
                <div className="grid min-h-[32rem] lg:grid-cols-[minmax(0,380px)_1fr]">
                    <div className={cn('flex flex-col border-border/60 lg:border-r', isOpen && 'hidden lg:flex')}>
                        {query.isLoading ? (
                            <div className="space-y-2 p-3">{[0, 1, 2, 3].map((i) => <div key={i} className="skeleton-shimmer h-16 rounded-xl" />)}</div>
                        ) : query.isError ? (
                            <ErrorState onRetry={() => query.refetch()} />
                        ) : rows.length === 0 ? (
                            <EmptyState icon={Inbox} title="No messages yet" description={tab === 'customers' ? 'Messages customers send from the app appear here.' : 'Messages from the website contact form appear here.'} />
                        ) : (
                            <ul className="flex-1 divide-y divide-border/50 overflow-y-auto">
                                {rows.map((r) => (
                                    <li key={r.id}>
                                        <button onClick={() => open(r.id)} className={cn('flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/60', openId === r.id && 'bg-accent/60')}>
                                            <span className={cn('mt-2 size-2 shrink-0 rounded-full', r.unread ? 'bg-primary' : 'bg-transparent')} aria-label={r.unread ? 'Unread' : undefined} />
                                            <span className="min-w-0 flex-1">
                                                <span className="flex items-center gap-2">
                                                    <span className={cn('truncate text-sm', r.unread ? 'font-bold' : 'font-semibold')}>{r.name}</span>
                                                    <span className="ml-auto shrink-0 text-xs text-muted-foreground">{timeAgo(r.at)}</span>
                                                </span>
                                                <span className={cn('block truncate text-sm', r.unread ? 'font-semibold' : 'text-foreground/80')}>{r.subject}</span>
                                                <span className="flex items-center gap-2">
                                                    <span className="block min-w-0 flex-1 truncate text-xs text-muted-foreground">{r.preview}</span>
                                                    {r.replied && <span className="shrink-0 text-[11px] font-medium text-emerald-600">{tab === 'customers' ? 'Replied' : 'Resolved'}</span>}
                                                </span>
                                            </span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className={cn('flex-col', isOpen ? 'flex' : 'hidden lg:flex')}>
                        {openMessage && tab === 'customers' ? (
                            <CustomerThread m={openMessage} onBack={() => setOpenId(null)} />
                        ) : openContact && tab === 'website' ? (
                            <ContactDetail c={openContact} onBack={() => setOpenId(null)} />
                        ) : (
                            <div className="flex flex-1 items-center justify-center">
                                <EmptyState icon={MessageSquare} title="Select a message" description="Choose a message on the left to read and reply." />
                            </div>
                        )}
                    </div>
                </div>
            </Panel>
        </div>
    );
}
