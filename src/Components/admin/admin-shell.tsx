/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    BadgePercent, Banknote, ExternalLink, LayoutDashboard, LogOut, Menu, MessageSquare, Package, ShieldAlert, ShoppingBag, Truck, Users,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTitle } from '@/Components/ui/sheet';
import { Button } from '@/Components/ui/button';
import { AnimatedPage } from '@/Components/PageTransition';
import { EmptyState, Panel } from '@/Components/ui/kit';
import { useAuth } from '@/hooks/useAuth';
import { useAdminInbox, useAdminStats, useContactMessages } from '@/hooks/useAdmin';
import { cn } from '@/lib/utils';
import { fullName, initials } from '@/lib/format';

type Item = { label: string; href: string; icon: React.ComponentType<{ className?: string }>; badge?: number };

function useAdminBadges() {
    const { data: stats } = useAdminStats();
    const { data: inbox } = useAdminInbox();
    const { data: contact } = useContactMessages();
    return {
        orders: stats?.overview.unassignedPaidOrders || 0,
        withdrawals: stats?.overview.pendingWithdrawals.count || 0,
        messages: (inbox?.unread || 0) + (contact || []).filter((c) => c.status === 'new').length,
    };
}

function useNav(): Item[] {
    const badges = useAdminBadges();
    return [
        { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Orders', href: '/admin/orders', icon: Package, badge: badges.orders },
        { label: 'Withdrawals', href: '/admin/withdrawals', icon: Banknote, badge: badges.withdrawals },
        { label: 'Products', href: '/admin/products', icon: ShoppingBag },
        { label: 'Users', href: '/admin/users', icon: Users },
        { label: 'Marketers', href: '/admin/marketers', icon: Truck },
        { label: 'Commissions', href: '/admin/commissions', icon: BadgePercent },
        { label: 'Messages', href: '/admin/notifications', icon: MessageSquare, badge: badges.messages },
    ];
}

const isActive = (href: string, pathname: string) => pathname === href || pathname.startsWith(`${href}/`);

function Badge({ count, className }: { count?: number; className?: string }) {
    if (!count) return null;
    return (
        <span className={cn('grid min-w-5 place-items-center rounded-full bg-primary px-1.5 text-[11px] font-bold leading-5 text-primary-foreground tabular-nums', className)}>
            {count > 99 ? '99+' : count}
        </span>
    );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
    const pathname = usePathname();
    const nav = useNav();
    const { user, logout } = useAuth();

    return (
        <div className="flex h-full flex-col">
            <div className="flex h-16 items-center gap-2.5 px-5">
                <span className="grid size-10 place-items-center rounded-xl bg-white shadow-soft ring-1 ring-border/70">
                    <img src="/images/logo.png" alt="Epilux" className="size-8 object-contain" />
                </span>
                <span className="leading-tight">
                    <span className="block font-display text-lg font-bold tracking-tight">Epilux</span>
                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-primary">Admin</span>
                </span>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-6 pt-2 no-scrollbar" aria-label="Admin">
                {nav.map(({ label, href, icon: Icon, badge }) => {
                    const active = isActive(href, pathname);
                    return (
                        <Link
                            key={href}
                            href={href}
                            onClick={onNavigate}
                            className={cn('group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors', active ? 'text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}
                        >
                            {active && <motion.span layoutId="admin-active" className="absolute inset-0 rounded-xl bg-accent" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
                            <Icon className="relative size-[18px]" />
                            <span className="relative flex-1">{label}</span>
                            <Badge count={badge} className="relative" />
                        </Link>
                    );
                })}

                <div className="pt-4">
                    <Link href="/products" onClick={onNavigate} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                        <ExternalLink className="size-[18px]" /> View shop
                    </Link>
                </div>
            </nav>

            {user && (
                <div className="border-t border-border/70 p-3">
                    <div className="flex items-center gap-3 px-2 py-2">
                        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-gradient-brand text-sm font-bold text-white">{initials(user.firstName, user.lastName, user.email)}</span>
                        <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold">{fullName(user)}</span>
                            <span className="block truncate text-xs text-muted-foreground">{user.email}</span>
                        </span>
                        <Button variant="ghost" size="icon-sm" onClick={() => logout()} aria-label="Sign out" className="text-muted-foreground hover:text-destructive"><LogOut /></Button>
                    </div>
                </div>
            )}
        </div>
    );
}

function BottomNav({ onOpenMenu }: { onOpenMenu: () => void }) {
    const pathname = usePathname();
    const nav = useNav();
    const items = [nav[0], nav[1], nav[2], nav[7]];
    return (
        <nav className="glass fixed inset-x-0 bottom-0 z-30 border-t border-border/70 pb-[env(safe-area-inset-bottom)] lg:hidden" aria-label="Admin shortcuts">
            <div className="mx-auto grid max-w-md grid-cols-5">
                {items.map(({ label, href, icon: Icon, badge }) => {
                    const active = isActive(href, pathname);
                    return (
                        <Link key={href} href={href} className="relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium">
                            {active && <motion.span layoutId="admin-bottom-active" className="absolute inset-x-4 top-0 h-0.5 rounded-full bg-primary" />}
                            <span className="relative">
                                <Icon className={cn('size-5', active ? 'text-primary' : 'text-muted-foreground')} />
                                <Badge count={badge} className="absolute -right-3 -top-2 min-w-4 px-1 text-[10px] leading-4" />
                            </span>
                            <span className={active ? 'text-primary' : 'text-muted-foreground'}>{label}</span>
                        </Link>
                    );
                })}
                <button onClick={onOpenMenu} className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground">
                    <Menu className="size-5" /> More
                </button>
            </div>
        </nav>
    );
}

/** Admin-only frame: persistent sidebar on desktop, drawer + bottom bar on mobile. */
export default function AdminShell({ children }: { children: React.ReactNode }) {
    const { user, initializing } = useAuth();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => setDrawerOpen(false), [pathname]);

    if (!initializing && user && user.role !== 'admin') {
        return (
            <div className="grid min-h-dvh place-items-center bg-background p-4">
                <Panel className="w-full max-w-md">
                    <EmptyState icon={ShieldAlert} title="Admins only" description="You don't have access to the admin area." action={{ label: 'Back to shop', href: '/products' }} />
                </Panel>
            </div>
        );
    }

    return (
        <div className="min-h-dvh bg-background">
            <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-sidebar-border bg-sidebar lg:block">
                {user?.role === 'admin' && <SidebarContent />}
            </aside>

            <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
                <SheetContent side="left" className="bg-sidebar p-0 lg:hidden">
                    <SheetTitle className="sr-only">Admin menu</SheetTitle>
                    {user?.role === 'admin' && <SidebarContent onNavigate={() => setDrawerOpen(false)} />}
                </SheetContent>
            </Sheet>

            <div className="lg:pl-64">
                <header className="glass sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/60 px-4 lg:hidden">
                    <button onClick={() => setDrawerOpen(true)} className="grid size-10 place-items-center rounded-xl hover:bg-muted" aria-label="Open menu"><Menu className="size-5" /></button>
                    <span className="font-display text-base font-bold">Epilux <span className="text-primary">Admin</span></span>
                </header>
                <main className="mx-auto w-full max-w-7xl px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:pb-12 lg:pt-8">
                    {initializing || !user ? (
                        <div className="space-y-4">{[0, 1, 2].map((i) => <div key={i} className="skeleton-shimmer h-28 rounded-3xl" />)}</div>
                    ) : (
                        <AnimatedPage>{children}</AnimatedPage>
                    )}
                </main>
            </div>

            {user?.role === 'admin' && <BottomNav onOpenMenu={() => setDrawerOpen(true)} />}
        </div>
    );
}
