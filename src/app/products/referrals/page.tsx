'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Check, Copy, Gift, MessageCircle, Share2, ShoppingBag, UserPlus, Users, Wallet } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAffiliateReferrals } from '@/hooks/useAffiliate';
import { Button } from '@/Components/ui/button';
import { EmptyState, PageHeader, Panel, Pill, StatTile } from '@/Components/ui/kit';
import { Stagger, StaggerItem } from '@/Components/motion';
import { formatDate, formatNaira } from '@/lib/format';

type Referral = { id: string; name: string; joinDate: string; isActive: boolean; earned: number; orders: number };

const steps = [
    { icon: Share2, title: 'Share your link', text: 'Send your invite link to friends and family.' },
    { icon: UserPlus, title: 'They sign up and order', text: 'Your referral is applied automatically when they register.' },
    { icon: Gift, title: 'You both earn', text: 'When they confirm a delivery, they keep 60% of the reward and you get 40%.' },
];

export default function ReferralsPage() {
    const { user } = useAuth();
    const { data, isLoading } = useAffiliateReferrals();
    const [origin, setOrigin] = useState('');
    const [copied, setCopied] = useState<'code' | 'link' | null>(null);

    useEffect(() => setOrigin(window.location.origin), []);

    const code: string = user?.referralCode || '';
    const link = code && origin ? `${origin}/register?ref=${code}` : '';
    const referrals: Referral[] = (data as { data?: Referral[] } | undefined)?.data || [];
    const summary = (data as { summary?: { total: number; active: number; totalEarned: number } } | undefined)?.summary;

    const copy = async (value: string, what: 'code' | 'link') => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(what);
            toast.success(what === 'link' ? 'Invite link copied' : 'Referral code copied');
            setTimeout(() => setCopied(null), 1800);
        } catch {
            toast.error('Could not copy. Please copy it manually.');
        }
    };

    const share = async () => {
        const text = `Order fresh water from Epilux and earn rewards on every delivery. Join with my link: ${link}`;
        if (navigator.share) {
            try { await navigator.share({ title: 'Join me on Epilux', text, url: link }); } catch { /* cancelled */ }
        } else {
            copy(link, 'link');
        }
    };

    const whatsapp = `https://wa.me/?text=${encodeURIComponent(`Order fresh water from Epilux and earn rewards on every delivery. Join with my link: ${link}`)}`;

    return (
        <div>
            <PageHeader title="Refer & earn" description="Invite friends to Epilux and earn every time they confirm a delivery." />

            <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
                <section className="aurora relative overflow-hidden rounded-[1.75rem] p-6 text-white shadow-lift sm:p-8">
                    <span aria-hidden className="aurora-blob three !opacity-40" />
                    <div className="relative">
                        <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold ring-1 ring-white/20"><Gift className="size-3.5 text-amber-200" /> 40% of your friends&apos; rewards</p>
                        <h2 className="mt-4 text-2xl font-extrabold text-white sm:text-3xl">Share your invite link</h2>
                        <p className="mt-1 text-sm text-white/75">Anyone who signs up with it is linked to you automatically.</p>

                        <div className="mt-6 flex items-center gap-2 rounded-2xl bg-white/10 p-2 ring-1 ring-white/20 backdrop-blur">
                            <p className="min-w-0 flex-1 truncate px-2 font-mono text-sm text-white/90">{link || 'Loading your link…'}</p>
                            <Button size="sm" onClick={() => copy(link, 'link')} disabled={!link} className="shrink-0 bg-white text-brand-700 hover:bg-white/90">
                                {copied === 'link' ? <Check /> : <Copy />} {copied === 'link' ? 'Copied' : 'Copy'}
                            </Button>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            <Button asChild size="sm" className="bg-[#25D366] text-white hover:bg-[#1ebe5b]">
                                <a href={whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle /> WhatsApp</a>
                            </Button>
                            <Button size="sm" variant="ghost" onClick={share} disabled={!link} className="text-white ring-1 ring-white/25 hover:bg-white/10 hover:text-white">
                                <Share2 /> More options
                            </Button>
                            {code && (
                                <button onClick={() => copy(code, 'code')} className="ml-auto flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm text-white/80 hover:bg-white/10">
                                    Code <span className="font-mono font-bold tracking-wider text-white">{code}</span>
                                    {copied === 'code' ? <Check className="size-4" /> : <Copy className="size-4" />}
                                </button>
                            )}
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
                    <StatTile label="Friends joined" value={isLoading ? '…' : summary?.total ?? referrals.length} icon={Users} />
                    <StatTile label="Earned from referrals" value={isLoading ? '…' : formatNaira(summary?.totalEarned)} icon={Wallet} tone="success" />
                </div>
            </div>

            <Stagger className="mt-6 grid gap-4 sm:grid-cols-3">
                {steps.map(({ icon: Icon, title, text }, i) => (
                    <StaggerItem key={title}>
                        <Panel className="h-full p-5">
                            <div className="flex items-center gap-3">
                                <span className="grid size-10 place-items-center rounded-xl bg-accent text-primary"><Icon className="size-5" /></span>
                                <span className="text-xs font-bold text-muted-foreground">STEP {i + 1}</span>
                            </div>
                            <p className="mt-3 font-bold">{title}</p>
                            <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                        </Panel>
                    </StaggerItem>
                ))}
            </Stagger>

            <Panel className="mt-6">
                <div className="border-b border-border/60 px-5 py-4 sm:px-6">
                    <h2 className="text-lg font-bold">Your friends</h2>
                </div>
                {isLoading ? (
                    <div className="space-y-3 p-5">{[0, 1, 2].map((i) => <div key={i} className="skeleton-shimmer h-14 rounded-2xl" />)}</div>
                ) : referrals.length === 0 ? (
                    <EmptyState icon={UserPlus} title="No friends yet" description="Share your link. When friends join and order, they'll show up here." />
                ) : (
                    <ul className="divide-y divide-border/60">
                        {referrals.map((r, i) => (
                            <motion.li key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i, 10) * 0.03 }} className="flex items-center gap-4 px-5 py-4 sm:px-6">
                                <span className="grid size-11 place-items-center rounded-full bg-gradient-brand font-bold text-white">{r.name.charAt(0)}</span>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-semibold">{r.name}</p>
                                    <p className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                        Joined {formatDate(r.joinDate)}
                                        <Pill tone={r.isActive ? 'success' : 'neutral'} dot>{r.isActive ? 'Active' : 'Inactive'}</Pill>
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold tabular-nums text-emerald-600">{formatNaira(r.earned)}</p>
                                    <p className="flex items-center justify-end gap-1 text-xs text-muted-foreground"><ShoppingBag className="size-3" /> {r.orders} order{r.orders === 1 ? '' : 's'}</p>
                                </div>
                            </motion.li>
                        ))}
                    </ul>
                )}
            </Panel>
        </div>
    );
}
