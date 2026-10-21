/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
    ChevronDown, Droplets, Eye, EyeOff, LayoutDashboard, LogOut, Menu, Package, Search,
    Settings, ShoppingBag, ShoppingCart, Truck, User, Users, Wallet, X, Headphones,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useCategories } from '@/hooks/useProducts';
import { useWalletBalance } from '@/hooks/useWallet';
import { AnimatedPage } from '@/Components/PageTransition';
import { cn } from '@/lib/utils';
import { formatNaira, fullName, initials } from '@/lib/format';

type NavItem = { label: string; href: string; icon: React.ComponentType<{ className?: string }>; match?: (path: string) => boolean };

const primaryNav: NavItem[] = [
    { label: 'Shop', href: '/products', icon: ShoppingBag, match: (p) => p === '/products' || /^\/products\/[a-f0-9]{24}/.test(p) },
    { label: 'My orders', href: '/account/orders', icon: Package, match: (p) => p.startsWith('/account/orders') },
    { label: 'Wallet', href: '/products/wallet', icon: Wallet, match: (p) => p.startsWith('/products/wallet') },
    { label: 'Referrals', href: '/products/referrals', icon: Users, match: (p) => p.startsWith('/products/referrals') },
];

const accountNav: NavItem[] = [
    { label: 'Account', href: '/account', icon: User, match: (p) => p === '/account' },
    { label: 'Delivery', href: '/account/delivery', icon: Truck },
    { label: 'Help & support', href: '/account/help', icon: Headphones },
    { label: 'Settings', href: '/settings', icon: Settings },
];

const bottomNav: NavItem[] = [
    { label: 'Shop', href: '/products', icon: ShoppingBag, match: primaryNav[0].match },
    { label: 'Orders', href: '/account/orders', icon: Package, match: primaryNav[1].match },
    { label: 'Cart', href: '/cart', icon: ShoppingCart },
    { label: 'Wallet', href: '/products/wallet', icon: Wallet, match: primaryNav[2].match },
    { label: 'Account', href: '/account', icon: User, match: (p) => p === '/account' || p.startsWith('/settings') },
];

const isActive = (item: NavItem, pathname: string) => (item.match ? item.match(pathname) : pathname === item.href || pathname.startsWith(`${item.href}/`));

const categoryLabel = (c: string) => c.charAt(0).toUpperCase() + c.slice(1).replace(/[-_]/g, ' ');

function useCartCount() {
    const { data } = useCart();
    const items = (data as { data?: { items?: { quantity: number }[] } } | undefined)?.data?.items || [];
    return items.reduce((sum, item) => sum + (item.quantity || 0), 0);
}

function Logo({ compact = false }: { compact?: boolean }) {
    return (
        <Link href="/products" className="group flex items-center gap-2.5">
            <span className="grid size-10 place-items-center rounded-xl bg-white shadow-soft ring-1 ring-border/70 transition-transform duration-300 group-hover:scale-105">
                <img src="/images/logo.png" alt="Epilux" className="size-8 object-contain" />
            </span>
            {!compact && (
                <span className="leading-tight">
                    <span className="block font-display text-lg font-bold tracking-tight">Epilux</span>
                    <span className="block text-[11px] font-medium text-muted-foreground">Premium water</span>
                </span>
            )}
        </Link>
    );
}

function NavLink({ item, active, onClick }: { item: NavItem; active: boolean; onClick?: () => void }) {
    const Icon = item.icon;
    return (
        <Link
            href={item.href}
            onClick={onClick}
            className={cn(
                'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                active ? 'text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
        >
            {active && (
                <motion.span
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl bg-accent"
                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                />
            )}
            <Icon className="relative size-[18px]" />
            <span className="relative">{item.label}</span>
        </Link>
    );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { user, logout } = useAuth();
    const { data: categoriesData } = useCategories();
    const categories: string[] = (categoriesData as { categories?: string[] } | undefined)?.categories || [];
    const activeCategory = pathname === '/products' ? searchParams.get('category') : null;

    return (
        <div className="flex h-full flex-col">
            <div className="flex h-16 items-center px-5">
                <Logo />
            </div>

            <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-6 pt-2 no-scrollbar">
                <div className="space-y-1">
                    {primaryNav.map((item) => (
                        <NavLink key={item.href} item={item} active={isActive(item, pathname) && !activeCategory} onClick={onNavigate} />
                    ))}
                </div>

                {categories.length > 0 && (
                    <div>
                        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">Categories</p>
                        <div className="space-y-1">
                            {categories.map((category) => {
                                const active = activeCategory === category;
                                return (
                                    <Link
                                        key={category}
                                        href={`/products?category=${encodeURIComponent(category)}`}
                                        onClick={onNavigate}
                                        className={cn(
                                            'flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors',
                                            active ? 'bg-accent font-semibold text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                        )}
                                    >
                                        <Droplets className="size-4" />
                                        {categoryLabel(category)}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div>
                    <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">Account</p>
                    <div className="space-y-1">
                        {accountNav.map((item) => (
                            <NavLink key={item.href} item={item} active={isActive(item, pathname)} onClick={onNavigate} />
                        ))}
                        {user?.role === 'admin' && (
                            <NavLink item={{ label: 'Admin dashboard', href: '/admin/dashboard', icon: LayoutDashboard }} active={false} onClick={onNavigate} />
                        )}
                        {user?.role === 'marketer' && (
                            <NavLink item={{ label: 'My deliveries', href: '/marketer', icon: Truck }} active={pathname.startsWith('/marketer')} onClick={onNavigate} />
                        )}
                    </div>
                </div>
            </nav>

            {user && (
                <div className="border-t border-border/70 p-3">
                    <button
                        onClick={() => logout()}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                        <LogOut className="size-[18px]" />
                        Sign out
                    </button>
                </div>
            )}
        </div>
    );
}

function WalletChip() {
    const { data, isLoading } = useWalletBalance();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        try {
            setVisible(localStorage.getItem('epilux:showBalance') === '1');
        } catch { /* storage unavailable */ }
    }, []);

    const toggle = () => {
        setVisible((v) => {
            try { localStorage.setItem('epilux:showBalance', v ? '0' : '1'); } catch { /* ignore */ }
            return !v;
        });
    };

    return (
        <div className="hidden items-center gap-1 rounded-xl border border-border/70 bg-card py-1 pl-3 pr-1 shadow-xs sm:flex">
            <Link href="/products/wallet" className="flex items-center gap-2">
                <Wallet className="size-4 text-success" />
                <span className="min-w-16 text-sm font-semibold tabular-nums">
                    {isLoading ? '…' : visible ? formatNaira(data?.availableBalance) : '₦ ••••'}
                </span>
            </Link>
            <button onClick={toggle} className="grid size-7 place-items-center rounded-lg text-muted-foreground hover:bg-muted" aria-label={visible ? 'Hide balance' : 'Show balance'}>
                {visible ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
            </button>
        </div>
    );
}

function UserMenu() {
    const { user, logout } = useAuth();

    if (!user) {
        return (
            <Button asChild size="sm"><Link href="/login">Sign in</Link></Button>
        );
    }

    const links = [
        { href: '/account', label: 'My account', icon: User },
        { href: '/account/orders', label: 'My orders', icon: Package },
        { href: '/products/wallet', label: 'Wallet', icon: Wallet },
        { href: '/settings', label: 'Settings', icon: Settings },
        ...(user.role === 'admin' ? [{ href: '/admin/dashboard', label: 'Admin dashboard', icon: LayoutDashboard }] : []),
        ...(user.role === 'marketer' ? [{ href: '/marketer', label: 'My deliveries', icon: Truck }] : []),
    ];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="group flex items-center gap-2 rounded-xl p-1 pr-2 outline-none transition-colors hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/40" aria-label="Account menu">
                    <span className="grid size-9 place-items-center rounded-lg bg-gradient-brand text-sm font-bold text-white">
                        {initials(user.firstName, user.lastName, user.email)}
                    </span>
                    <ChevronDown className="hidden size-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180 md:block" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8} className="w-64 rounded-2xl p-2">
                <DropdownMenuLabel className="px-3 py-2">
                    <p className="truncate font-semibold">{fullName(user)}</p>
                    <p className="truncate text-xs font-normal text-muted-foreground">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {links.map(({ href, label, icon: Icon }) => (
                    <DropdownMenuItem key={href} asChild className="cursor-pointer gap-3 rounded-lg px-3 py-2">
                        <Link href={href}><Icon className="size-4 text-muted-foreground" />{label}</Link>
                    </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" className="cursor-pointer gap-3 rounded-lg px-3 py-2" onSelect={() => logout()}>
                    <LogOut className="size-4" /> Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function SearchBox({ autoFocus = false, onSubmitted }: { autoFocus?: boolean; onSubmitted?: () => void }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [query, setQuery] = useState(pathname === '/products' ? searchParams.get('search') || '' : '');

    useEffect(() => {
        if (pathname === '/products') setQuery(searchParams.get('search') || '');
    }, [pathname, searchParams]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (query.trim()) params.set('search', query.trim());
        const category = pathname === '/products' ? searchParams.get('category') : null;
        if (category) params.set('category', category);
        router.push(`/products${params.toString() ? `?${params}` : ''}`);
        onSubmitted?.();
    };

    return (
        <form onSubmit={submit} role="search" className="relative w-full">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
                type="search"
                value={query}
                autoFocus={autoFocus}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search sachet, bottled water…"
                aria-label="Search products"
                className="h-10 w-full rounded-xl border border-border/70 bg-muted/60 pl-10 pr-3 text-sm outline-none transition-[border-color,box-shadow,background-color] placeholder:text-muted-foreground/80 focus:border-ring focus:bg-card focus:ring-4 focus:ring-ring/15"
            />
        </form>
    );
}

function TopBar({ onOpenMenu }: { onOpenMenu: () => void }) {
    const cartCount = useCartCount();
    const { user } = useAuth();
    const [searchOpen, setSearchOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 4);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header className={cn('sticky top-0 z-30 transition-shadow duration-300', scrolled ? 'glass shadow-soft' : 'bg-background/80 backdrop-blur')}>
            <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
                <button onClick={onOpenMenu} className="grid size-10 place-items-center rounded-xl hover:bg-muted lg:hidden" aria-label="Open menu">
                    <Menu className="size-5" />
                </button>
                <div className="lg:hidden">
                    <Logo compact />
                </div>

                <div className="hidden max-w-xl flex-1 md:block">
                    <Suspense fallback={null}>
                        <SearchBox />
                    </Suspense>
                </div>

                <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
                    <button onClick={() => setSearchOpen(true)} className="grid size-10 place-items-center rounded-xl hover:bg-muted md:hidden" aria-label="Search">
                        <Search className="size-5" />
                    </button>
                    {user && <WalletChip />}
                    <Link href="/cart" className="relative grid size-10 place-items-center rounded-xl hover:bg-muted" aria-label={`Cart, ${cartCount} items`}>
                        <ShoppingCart className="size-5" />
                        <AnimatePresence>
                            {cartCount > 0 && (
                                <motion.span
                                    key={cartCount}
                                    initial={{ scale: 0.4, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.4, opacity: 0 }}
                                    transition={{ type: 'spring', stiffness: 600, damping: 22 }}
                                    className="absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-gradient-sun px-1 text-[11px] font-bold text-white shadow"
                                >
                                    {cartCount > 99 ? '99+' : cartCount}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Link>
                    <UserMenu />
                </div>
            </div>

            <AnimatePresence>
                {searchOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-border/60 md:hidden"
                    >
                        <div className="flex items-center gap-2 px-4 py-3">
                            <Suspense fallback={null}>
                                <SearchBox autoFocus onSubmitted={() => setSearchOpen(false)} />
                            </Suspense>
                            <button onClick={() => setSearchOpen(false)} className="grid size-10 shrink-0 place-items-center rounded-xl hover:bg-muted" aria-label="Close search">
                                <X className="size-5" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

function BottomNav() {
    const pathname = usePathname();
    const cartCount = useCartCount();
    return (
        <nav className="glass fixed inset-x-0 bottom-0 z-30 border-t border-border/70 pb-[env(safe-area-inset-bottom)] lg:hidden" aria-label="Main">
            <div className="mx-auto grid max-w-md grid-cols-5">
                {bottomNav.map((item) => {
                    const active = isActive(item, pathname);
                    const Icon = item.icon;
                    return (
                        <Link key={item.href} href={item.href} className="relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium">
                            {active && <motion.span layoutId="bottom-active" className="absolute inset-x-4 top-0 h-0.5 rounded-full bg-primary" />}
                            <span className="relative">
                                <Icon className={cn('size-5 transition-colors', active ? 'text-primary' : 'text-muted-foreground')} />
                                {item.href === '/cart' && cartCount > 0 && (
                                    <span className="absolute -right-2 -top-1.5 grid min-w-4 place-items-center rounded-full bg-gradient-sun px-1 text-[10px] font-bold text-white">
                                        {cartCount}
                                    </span>
                                )}
                            </span>
                            <span className={active ? 'text-primary' : 'text-muted-foreground'}>{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

/**
 * Layout for signed-in shopper pages: persistent sidebar on desktop, drawer +
 * bottom navigation on mobile.
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => setDrawerOpen(false), [pathname]);

    return (
        <div className="min-h-dvh bg-background">
            {/* Desktop sidebar */}
            <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-sidebar-border bg-sidebar lg:block">
                <Suspense fallback={null}>
                    <SidebarContent />
                </Suspense>
            </aside>

            {/* Mobile drawer (shadcn Sheet: focus trap, Esc to close, scroll lock) */}
            <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
                <SheetContent side="left" className="bg-sidebar p-0 lg:hidden">
                    <SheetTitle className="sr-only">Menu</SheetTitle>
                    <Suspense fallback={null}>
                        <SidebarContent onNavigate={() => setDrawerOpen(false)} />
                    </Suspense>
                </SheetContent>
            </Sheet>

            <div className="lg:pl-64">
                <TopBar onOpenMenu={() => setDrawerOpen(true)} />
                <main className="mx-auto w-full max-w-7xl px-4 pb-28 pt-4 sm:px-6 lg:px-8 lg:pb-12 lg:pt-6">
                    <AnimatedPage>{children}</AnimatedPage>
                </main>
            </div>

            <BottomNav />
        </div>
    );
}
