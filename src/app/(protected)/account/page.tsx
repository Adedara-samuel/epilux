'use client';

import Link from 'next/link';
import { ChevronRight, Gift, Headphones, Inbox, LogOut, MapPin, MessageSquare, Package, Settings, Star, Users, Wallet } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useOrders } from '@/hooks/useOrders';
import { useWalletBalance } from '@/hooks/useWallet';
import { Button } from '@/Components/ui/button';
import { OrderStatusPill, Panel, PanelHeader, StatTile } from '@/Components/ui/kit';
import { Stagger, StaggerItem } from '@/Components/motion';
import { formatDate, formatNaira, fullName, initials } from '@/lib/format';
import { orderId, type CustomerOrder } from '@/Components/orders/order-helpers';

const LINKS = [
    { href: '/account/orders', icon: Package, title: 'My orders', text: 'Track and confirm deliveries' },
    { href: '/products/wallet', icon: Wallet, title: 'Wallet', text: 'Balance, rewards and withdrawals' },
    { href: '/products/referrals', icon: Users, title: 'Refer & earn', text: 'Invite friends, earn 40%' },
    { href: '/settings?tab=address', icon: MapPin, title: 'Delivery address', text: 'Where we deliver your water' },
    { href: '/account/inbox', icon: Inbox, title: 'Inbox', text: 'Replies from the Epilux team' },
    { href: '/account/reviews', icon: Star, title: 'My reviews', text: 'Products you have rated' },
    { href: '/account/contact', icon: MessageSquare, title: 'Contact us', text: 'Send us a message' },
    { href: '/account/help', icon: Headphones, title: 'Help centre', text: 'Answers to common questions' },
    { href: '/settings', icon: Settings, title: 'Settings', text: 'Profile, password and security' },
];

export default function AccountPage() {
    const { user, logout } = useAuth();
    const { data: ordersData, isLoading: ordersLoading } = useOrders();
    const { data: wallet } = useWalletBalance();

    const orders: CustomerOrder[] = ordersData?.data || [];
    const active = orders.filter((o) => ['pending', 'processing', 'assigned', 'in_transit', 'delivered'].includes(o.status)).length;

    return (
        <div>
            {/* Profile */}
            <Panel className="animate-fade-in mb-6 overflow-hidden">
                <div className="aurora h-24 sm:h-28" />
                <div className="flex flex-col gap-4 px-5 pb-5 sm:flex-row sm:items-end sm:px-6 sm:pb-6">
                    <span className="-mt-10 grid size-20 shrink-0 place-items-center rounded-3xl bg-gradient-brand text-2xl font-extrabold text-white shadow-lift ring-4 ring-card">
                        {initials(user?.firstName, user?.lastName, user?.email)}
                    </span>
                    <div className="min-w-0 flex-1">
                        <h1 className="truncate text-2xl font-extrabold tracking-tight">{fullName(user)}</h1>
                        <p className="truncate text-sm text-muted-foreground">{user?.email}{user?.profile?.phone ? ` · ${user.profile.phone}` : ''}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline"><Link href="/settings"><Settings /> Edit profile</Link></Button>
                        <Button variant="ghost" className="text-muted-foreground hover:text-destructive" onClick={() => logout()}><LogOut /> Sign out</Button>
                    </div>
                </div>
            </Panel>

            <Stagger immediate className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StaggerItem><StatTile label="Orders" value={ordersLoading ? '…' : orders.length} icon={Package} /></StaggerItem>
                <StaggerItem><StatTile label="In progress" value={ordersLoading ? '…' : active} icon={Package} tone="info" /></StaggerItem>
                <StaggerItem><StatTile label="Wallet" value={formatNaira(wallet?.availableBalance)} icon={Wallet} tone="success" /></StaggerItem>
                <StaggerItem><StatTile label="Rewards earned" value={formatNaira(wallet?.totalEarned)} icon={Gift} tone="warning" /></StaggerItem>
            </Stagger>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
                <Panel>
                    <PanelHeader title="Your account" />
                    <Stagger className="grid sm:grid-cols-2">
                        {LINKS.map(({ href, icon: Icon, title, text }) => (
                            <StaggerItem key={href}>
                                <Link href={href} className="group flex items-center gap-4 border-b border-border/50 px-5 py-4 transition-colors hover:bg-muted/50 sm:px-6 sm:odd:border-r">
                                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent text-primary transition-transform group-hover:scale-105"><Icon className="size-5" /></span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block font-semibold">{title}</span>
                                        <span className="block truncate text-sm text-muted-foreground">{text}</span>
                                    </span>
                                    <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                                </Link>
                            </StaggerItem>
                        ))}
                    </Stagger>
                </Panel>

                <Panel>
                    <PanelHeader title="Recent orders" action={<Link href="/account/orders" className="text-sm font-semibold text-primary hover:underline">View all</Link>} />
                    {ordersLoading ? (
                        <div className="space-y-3 p-5">{[0, 1, 2].map((i) => <div key={i} className="skeleton-shimmer h-12 rounded-xl" />)}</div>
                    ) : orders.length === 0 ? (
                        <div className="p-6 text-center">
                            <p className="text-sm text-muted-foreground">You haven&apos;t placed an order yet.</p>
                            <Button asChild className="mt-4"><Link href="/products">Start shopping</Link></Button>
                        </div>
                    ) : (
                        <ul className="divide-y divide-border/60">
                            {orders.slice(0, 4).map((o) => (
                                <li key={orderId(o)}>
                                    <Link href={`/account/orders/${orderId(o)}`} className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/50 sm:px-6">
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-semibold">{o.orderNumber}</p>
                                            <p className="text-xs text-muted-foreground">{formatDate(o.createdAt)} · {formatNaira(o.totalAmount)}</p>
                                        </div>
                                        <OrderStatusPill status={o.status} />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </Panel>
            </div>
        </div>
    );
}
