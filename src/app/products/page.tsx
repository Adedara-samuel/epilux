'use client';

import { Suspense, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Gift, PackageSearch, ShieldCheck, Sparkles, Truck, Wallet, X } from 'lucide-react';
import { useCategories, useProducts } from '@/hooks/useProducts';
import { useAuth } from '@/hooks/useAuth';
import { useWalletBalance } from '@/hooks/useWallet';
import ProductGrid from '@/Components/products/product-grid';
import { EmptyState, ErrorState } from '@/Components/ui/kit';
import { Reveal } from '@/Components/motion';
import { formatNaira } from '@/lib/format';
import { FREE_DELIVERY_THRESHOLD } from '@/services/delivery';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/product';

const SORTS = [
    { value: 'newest', label: 'Newest' },
    { value: 'price-asc', label: 'Price: low to high' },
    { value: 'price-desc', label: 'Price: high to low' },
    { value: 'name', label: 'Name A–Z' },
] as const;

const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
};

const label = (c: string) => c.charAt(0).toUpperCase() + c.slice(1).replace(/[-_]/g, ' ');

function ShopHero() {
    const { user } = useAuth();
    const { data: wallet } = useWalletBalance();

    return (
        <section className="aurora relative mb-6 overflow-hidden rounded-[1.75rem] px-5 py-7 text-white shadow-lift sm:px-8 sm:py-9">
            <span aria-hidden className="aurora-blob one !h-80 !w-80 !opacity-40" />
            <span aria-hidden className="aurora-blob three !opacity-30" />
            <div className="relative grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-center">
                <div className="animate-fade-in">
                    <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 ring-1 ring-white/20 backdrop-blur">
                        <Sparkles className="size-3.5 text-amber-200" /> Earn rewards on every delivered order
                    </p>
                    <h1 className="mt-4 text-[1.7rem] font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
                        {greeting()}{user?.firstName ? `, ${user.firstName}` : ''} 👋
                    </h1>
                    <p className="mt-2 max-w-lg text-sm text-white/75 sm:text-base">
                        Fresh, safe drinking water delivered by a dedicated marketer. Free delivery on orders from {formatNaira(FREE_DELIVERY_THRESHOLD)}.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                        <a href="#catalogue" className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-brand-700 shadow-lg shadow-black/10 transition-transform hover:-translate-y-0.5">
                            Shop now <ArrowRight className="size-4" />
                        </a>
                        <Link href="/products/referrals" className="inline-flex h-10 items-center gap-2 rounded-xl bg-white/10 px-4 text-sm font-semibold text-white ring-1 ring-white/25 backdrop-blur transition-colors hover:bg-white/15">
                            <Gift className="size-4" /> Invite & earn
                        </Link>
                    </div>
                </div>

                <div className="animate-fade-in grid grid-cols-2 gap-3" style={{ animationDelay: '120ms' }}>
                    <Link href="/products/wallet" className="group rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur transition-colors hover:bg-white/15">
                        <span className="grid size-9 place-items-center rounded-xl bg-emerald-400/20 text-emerald-200"><Wallet className="size-5" /></span>
                        <p className="mt-3 text-xs text-white/70">Wallet balance</p>
                        <p className="text-lg font-extrabold tabular-nums text-white">{formatNaira(wallet?.availableBalance)}</p>
                    </Link>
                    <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur">
                        <span className="grid size-9 place-items-center rounded-xl bg-sky-300/20 text-sky-100"><Truck className="size-5" /></span>
                        <p className="mt-3 text-xs text-white/70">Delivery</p>
                        <p className="text-lg font-extrabold text-white">To your door</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

function ShopContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';
    const sort = (searchParams.get('sort') || 'newest') as (typeof SORTS)[number]['value'];

    const { data, isLoading, isError, refetch } = useProducts({ category: category || undefined, search: search || undefined });
    const { data: categoriesData } = useCategories();
    const categories: string[] = (categoriesData as { categories?: string[] } | undefined)?.categories || [];

    const setParam = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) params.set(key, value); else params.delete(key);
        router.replace(`${pathname}${params.toString() ? `?${params}` : ''}`, { scroll: false });
    };

    const products = useMemo(() => {
        const list: (Product & { createdAt?: string })[] = (data?.products || []).map((p: Product & { _id?: string }) => ({ ...p, id: p.id || p._id }));
        const sorted = [...list];
        if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price);
        if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price);
        if (sort === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name));
        // Keep in-stock items first
        return sorted.sort((a, b) => Number(b.stock > 0) - Number(a.stock > 0));
    }, [data, sort]);

    const chips = ['', ...categories];

    return (
        <>
            <ShopHero />

            <section id="catalogue" className="scroll-mt-24">
                <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">
                            {search ? <>Results for “{search}”</> : category ? `${label(category)} water` : 'All products'}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {isLoading ? 'Loading…' : `${products.length} ${products.length === 1 ? 'product' : 'products'}`}
                        </p>
                    </div>
                    <label className="flex items-center gap-2 text-sm text-muted-foreground">
                        Sort
                        <select
                            value={sort}
                            onChange={(e) => setParam('sort', e.target.value === 'newest' ? null : e.target.value)}
                            className="h-10 rounded-xl border border-border bg-card px-3 text-sm font-medium text-foreground shadow-xs outline-none focus:border-ring focus:ring-4 focus:ring-ring/15"
                        >
                            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                    </label>
                </div>

                {/* Category chips */}
                <div className="-mx-4 mb-6 overflow-x-auto px-4 no-scrollbar sm:mx-0 sm:px-0">
                    <div className="flex w-max gap-2">
                        {chips.map((c) => {
                            const active = c === category;
                            return (
                                <button
                                    key={c || 'all'}
                                    onClick={() => setParam('category', c || null)}
                                    className={cn('relative h-10 rounded-full px-4 text-sm font-semibold transition-colors', active ? 'text-white' : 'bg-card text-muted-foreground ring-1 ring-border hover:text-foreground')}
                                >
                                    {active && <motion.span layoutId="category-chip" className="absolute inset-0 rounded-full bg-primary shadow-brand" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
                                    <span className="relative">{c ? label(c) : 'All'}</span>
                                </button>
                            );
                        })}
                        {search && (
                            <button onClick={() => setParam('search', null)} className="flex h-10 items-center gap-1.5 rounded-full bg-accent px-4 text-sm font-semibold text-accent-foreground">
                                “{search}” <X className="size-4" />
                            </button>
                        )}
                    </div>
                </div>

                {isError ? (
                    <ErrorState description="We couldn't load products. Check your connection and try again." onRetry={() => refetch()} />
                ) : isLoading ? (
                    <ProductGrid products={[]} loading />
                ) : products.length === 0 ? (
                    <EmptyState
                        icon={PackageSearch}
                        title="No products found"
                        description={search ? 'Try a different search term or browse all products.' : 'Nothing in this category yet. Check back soon.'}
                        action={{ label: 'View all products', onClick: () => router.replace(pathname) }}
                    />
                ) : (
                    <ProductGrid products={products} />
                )}
            </section>

            <Reveal className="mt-12 grid gap-3 sm:grid-cols-3">
                {[
                    { icon: Truck, title: 'Free delivery', text: `On orders from ${formatNaira(FREE_DELIVERY_THRESHOLD)}` },
                    { icon: ShieldCheck, title: 'Quality guaranteed', text: 'Treated, sealed and safe to drink' },
                    { icon: Wallet, title: 'Rewards in your wallet', text: 'Paid when you confirm delivery' },
                ].map(({ icon: Icon, title, text }) => (
                    <div key={title} className="flex items-center gap-4 rounded-2xl border border-border/70 bg-card p-4 shadow-soft">
                        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent text-primary"><Icon className="size-5" /></span>
                        <div>
                            <p className="font-semibold">{title}</p>
                            <p className="text-sm text-muted-foreground">{text}</p>
                        </div>
                    </div>
                ))}
            </Reveal>
        </>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<ProductGrid products={[]} loading />}>
            <ShopContent />
        </Suspense>
    );
}
