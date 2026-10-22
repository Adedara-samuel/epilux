'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Inbox, MessageSquare, PenSquare } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useMarkMessageAsRead, useMessages } from '@/hooks/useSupport';
import { Button } from '@/Components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { EmptyState, ErrorState, PageHeader, Panel, Pill } from '@/Components/ui/kit';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/format';

type Person = { _id: string; firstName?: string; lastName?: string };
type Message = {
    _id: string;
    subject?: string;
    content: string;
    isRead: boolean;
    isAdminReply: boolean;
    createdAt: string;
    sender?: Person | null;
    recipient?: Person | null;
};

const timeLabel = (iso: string) => {
    const d = new Date(iso);
    return d.toDateString() === new Date().toDateString()
        ? d.toLocaleTimeString('en-NG', { hour: 'numeric', minute: '2-digit' })
        : formatDate(iso);
};

export default function InboxPage() {
    const { user } = useAuth();
    const { data, isLoading, isError, refetch } = useMessages({ limit: 50 });
    const markRead = useMarkMessageAsRead();
    const [filter, setFilter] = useState<'all' | 'replies' | 'sent'>('all');
    const [openId, setOpenId] = useState<string | null>(null);

    const messages: Message[] = useMemo(() => data?.data?.messages || [], [data]);
    const myId = user?._id || user?.id;
    const isIncoming = (m: Message) => m.isAdminReply || (m.recipient?._id === myId && m.sender?._id !== myId);
    const unread = messages.filter((m) => isIncoming(m) && !m.isRead).length;

    const shown = messages.filter((m) => filter === 'all' || (filter === 'replies' ? isIncoming(m) : !isIncoming(m)));
    const open = messages.find((m) => m._id === openId) || null;

    const openMessage = (m: Message) => {
        setOpenId(m._id);
        if (isIncoming(m) && !m.isRead) markRead.mutate(m._id);
    };

    return (
        <div className="max-w-5xl">
            <PageHeader
                title="Inbox"
                description={unread ? `You have ${unread} unread repl${unread === 1 ? 'y' : 'ies'}.` : 'Messages you send us and our replies.'}
                actions={<Button asChild><Link href="/account/contact"><PenSquare /> New message</Link></Button>}
            />

            <Panel className="overflow-hidden">
                <div className="grid min-h-[28rem] lg:grid-cols-[minmax(0,360px)_1fr]">
                    {/* List */}
                    <div className={cn('flex flex-col border-border/60 lg:border-r', open && 'hidden lg:flex')}>
                        <div className="border-b border-border/60 p-3">
                            <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
                                <TabsList className="w-full">
                                    <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                                    <TabsTrigger value="replies" className="flex-1">Replies{unread > 0 && <span className="ml-1 rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">{unread}</span>}</TabsTrigger>
                                    <TabsTrigger value="sent" className="flex-1">Sent</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>

                        {isLoading ? (
                            <div className="space-y-2 p-3">{[0, 1, 2, 3].map((i) => <div key={i} className="skeleton-shimmer h-16 rounded-xl" />)}</div>
                        ) : isError ? (
                            <ErrorState onRetry={() => refetch()} />
                        ) : shown.length === 0 ? (
                            <EmptyState icon={Inbox} title={filter === 'sent' ? 'Nothing sent yet' : 'No messages yet'} description="When you contact us, the conversation shows up here." action={{ label: 'Contact us', href: '/account/contact' }} />
                        ) : (
                            <ul className="flex-1 divide-y divide-border/50 overflow-y-auto">
                                {shown.map((m) => {
                                    const incoming = isIncoming(m);
                                    const isUnread = incoming && !m.isRead;
                                    return (
                                        <li key={m._id}>
                                            <button
                                                onClick={() => openMessage(m)}
                                                className={cn('flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/60', openId === m._id && 'bg-accent/60')}
                                            >
                                                <span className={cn('grid size-10 shrink-0 place-items-center rounded-full text-sm font-bold', incoming ? 'bg-gradient-brand text-white' : 'bg-muted text-muted-foreground')}>
                                                    {incoming ? 'E' : 'Y'}
                                                </span>
                                                <span className="min-w-0 flex-1">
                                                    <span className="flex items-center gap-2">
                                                        <span className={cn('truncate text-sm', isUnread ? 'font-bold' : 'font-semibold')}>{incoming ? 'Epilux support' : 'You'}</span>
                                                        <span className="ml-auto shrink-0 text-xs text-muted-foreground">{timeLabel(m.createdAt)}</span>
                                                    </span>
                                                    <span className={cn('block truncate text-sm', isUnread ? 'font-semibold text-foreground' : 'text-foreground/80')}>{m.subject || 'No subject'}</span>
                                                    <span className="block truncate text-xs text-muted-foreground">{m.content}</span>
                                                </span>
                                                {isUnread && <span className="mt-2 size-2 shrink-0 rounded-full bg-primary" aria-label="Unread" />}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>

                    {/* Reader */}
                    <div className={cn('flex-col', open ? 'flex' : 'hidden lg:flex')}>
                        <AnimatePresence mode="wait">
                            {open ? (
                                <motion.article key={open._id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="flex flex-1 flex-col">
                                    <div className="flex items-start gap-3 border-b border-border/60 px-5 py-4 sm:px-6">
                                        <Button variant="ghost" size="icon-sm" className="-ml-2 lg:hidden" onClick={() => setOpenId(null)} aria-label="Back to messages"><ArrowLeft /></Button>
                                        <div className="min-w-0 flex-1">
                                            <h2 className="text-lg font-bold">{open.subject || 'No subject'}</h2>
                                            <p className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                                {isIncoming(open) ? 'From Epilux support' : 'Sent by you'} · {new Date(open.createdAt).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })}
                                                {isIncoming(open) ? <Pill tone="brand">Reply</Pill> : <Pill tone={open.isRead ? 'success' : 'neutral'}>{open.isRead ? 'Seen by our team' : 'Delivered'}</Pill>}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex-1 whitespace-pre-wrap px-5 py-5 text-[15px] leading-relaxed sm:px-6">{open.content}</div>
                                    <div className="border-t border-border/60 px-5 py-4 sm:px-6">
                                        <Button asChild variant="outline"><Link href="/account/contact"><MessageSquare /> Send a follow-up</Link></Button>
                                    </div>
                                </motion.article>
                            ) : (
                                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-1 items-center justify-center">
                                    <EmptyState icon={MessageSquare} title="Select a message" description="Choose a message on the left to read it." />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </Panel>
        </div>
    );
}
