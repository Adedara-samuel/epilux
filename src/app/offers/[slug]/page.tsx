/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowRight, CalendarClock, Check, Gift, PackageCheck, ShieldCheck, Tag, Truck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useOffer } from '@/hooks/useOffers';
import SiteShell from '@/Components/site/site-shell';
import { Button } from '@/Components/ui/button';
import { EmptyState, Panel, Pill, QuantityStepper } from '@/Components/ui/kit';
import { Reveal } from '@/Components/motion';
import { formatDate, formatNaira } from '@/lib/format';
import { handleImageError, resolveImageUrl } from '@/lib/images';
import { FREE_DELIVERY_THRESHOLD } from '@/services/delivery';

const MAX_BUNDLES = 50;

export default function OfferPage() {
    const { slug } = useParams<{ slug: string }>();
    const router = useRouter();
    const { user } = useAuth();
    const { data: offer, isLoading, isError } = useOffer(slug);
    const [bundles, setBundles] = useState(1);

    if (isLoading) {
        return (
            <SiteShell>
                <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
                    <div className="skeleton-shimmer h-[28rem] rounded-[2rem]" />
                    <div className="skeleton-shimmer h-[28rem] rounded-[2rem]" />
                </div>
            </SiteShell>
        );
    }

    if (isError || !offer) {
        return (
            <SiteShell>
                <div className="mx-auto max-w-xl px-4 py-20">
                    <Panel><EmptyState icon={Gift} title="Offer not found" description="This offer may have ended. Take a look at our water instead." action={{ label: 'Shop water', href: '/products' }} /></Panel>
                </div>
            </SiteShell>
        );
    }

    const image = offer.image?.url || offer.product?.images?.find((i) => i.isPrimary)?.url || offer.product?.images?.[0]?.url || '/images/hero-image.jpeg';
    const canOrder = offer.isLive && !!offer.product?.inStock;
    const orderHref = `/checkout?offer=${encodeURIComponent(offer.slug)}&bundles=${bundles}`;
    const order = () => router.push(user ? orderHref : `/login?redirect=${encodeURIComponent(orderHref)}`);
    const units = offer.bundleSize * bundles;

    return (
        <SiteShell>
            <section className="relative overflow-hidden">
                <div aria-hidden className="pointer-events-none absolute inset-0">
                    <div className="absolute -top-40 right-[-10%] size-[36rem] rounded-full bg-sky-200/50 blur-3xl dark:bg-sky-500/10" />
                    <div className="absolute bottom-[-12rem] left-[-10%] size-[28rem] rounded-full bg-amber-200/40 blur-3xl dark:bg-amber-500/10" />
                </div>
                <div className="relative mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8 lg:py-20">
                    <div>
                        <div className="animate-fade-in flex flex-wrap items-center gap-2">
                            {offer.badge && <Pill tone="warning"><Tag className="size-3.5" /> {offer.badge}</Pill>}
                            {!offer.isLive && <Pill tone={offer.status === 'scheduled' ? 'info' : 'neutral'}>{offer.status === 'scheduled' ? `Starts ${formatDate(offer.startsAt)}` : offer.status === 'off' ? 'Not live (admin preview)' : 'This offer has ended'}</Pill>}
                        </div>
                        <h1 className="animate-fade-in mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl" style={{ animationDelay: '60ms' }}>{offer.title}</h1>
                        {offer.subtitle && <p className="animate-fade-in mt-4 text-xl font-semibold text-primary" style={{ animationDelay: '100ms' }}>{offer.subtitle}</p>}
                        {offer.description && <p className="animate-fade-in mt-4 max-w-xl whitespace-pre-line text-lg text-muted-foreground" style={{ animationDelay: '140ms' }}>{offer.description}</p>}

                        {/* Price */}
                        <Panel className="animate-fade-in mt-8 p-6" style={{ animationDelay: '180ms' }}>
                            <div className="flex flex-wrap items-end justify-between gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">{offer.bundleSize} × {offer.product?.name || 'item'}</p>
                                    <div className="mt-1 flex flex-wrap items-baseline gap-3">
                                        <span className="font-display text-4xl font-extrabold tabular-nums">{formatNaira(offer.bundlePrice)}</span>
                                        {offer.savings > 0 && offer.regularBundlePrice && <span className="text-lg text-muted-foreground line-through tabular-nums">{formatNaira(offer.regularBundlePrice)}</span>}
                                    </div>
                                    <p className="mt-1 text-sm text-muted-foreground">{formatNaira(offer.unitPrice)} per unit</p>
                                </div>
                                {offer.savings > 0 && (
                                    <span className="rounded-2xl bg-emerald-50 px-4 py-2 text-center text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                                        <span className="block text-xs font-semibold">You save</span>
                                        <span className="block text-lg font-extrabold tabular-nums">{formatNaira(offer.savings)}</span>
                                    </span>
                                )}
                            </div>

                            {canOrder ? (
                                <div className="mt-6 flex flex-col gap-3 border-t border-border/60 pt-6 sm:flex-row sm:items-center">
                                    <div className="flex items-center justify-between gap-3 sm:justify-start">
                                        <span className="text-sm font-medium">Bundles</span>
                                        <QuantityStepper value={bundles} onChange={setBundles} min={1} max={MAX_BUNDLES} />
                                    </div>
                                    <Button size="xl" variant="brand" className="flex-1 rounded-2xl" onClick={order}>
                                        Order {units} units · {formatNaira(offer.bundlePrice * bundles)} <ArrowRight />
                                    </Button>
                                </div>
                            ) : (
                                <div className="mt-6 border-t border-border/60 pt-6">
                                    <p className="text-sm text-muted-foreground">{offer.isLive ? 'This offer is out of stock right now.' : offer.status === 'scheduled' ? 'Ordering opens when the offer starts.' : 'This offer can no longer be ordered.'}</p>
                                    <Button asChild variant="outline" className="mt-3"><Link href="/products">Shop all water</Link></Button>
                                </div>
                            )}
                        </Panel>

                        <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                            <li className="flex items-center gap-1.5"><Truck className="size-4 text-primary" /> Delivered by a local marketer</li>
                            <li className="flex items-center gap-1.5"><ShieldCheck className="size-4 text-primary" /> Secure payment</li>
                            <li className="flex items-center gap-1.5"><Gift className="size-4 text-primary" /> Earns rewards</li>
                        </ul>
                    </div>

                    <div className="animate-fade-in-scale relative" style={{ animationDelay: '120ms' }}>
                        <div aria-hidden className="absolute -inset-5 rounded-[3rem] bg-gradient-to-br from-sky-300/40 via-brand-400/20 to-amber-300/30 blur-2xl" />
                        <div className="relative overflow-hidden rounded-[2rem] bg-card shadow-lift ring-1 ring-black/5">
                            <img src={resolveImageUrl(image)} onError={handleImageError} alt={offer.title} className="aspect-[4/3.3] w-full object-cover" />
                        </div>
                        {offer.savings > 0 && offer.savingsPercent > 0 && (
                            <span className="animate-float absolute -right-2 -top-3 grid size-24 place-items-center rounded-full bg-gradient-sun text-center font-extrabold leading-tight text-white shadow-lift sm:-right-4">
                                <span><span className="block text-2xl">{offer.savingsPercent}%</span><span className="block text-xs">off</span></span>
                            </span>
                        )}
                    </div>
                </div>
            </section>

            {(offer.features.length > 0 || offer.terms || offer.endsAt) && (
                <section className="border-t border-border/60 bg-muted/40 py-14">
                    <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-6 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:px-8">
                        {offer.features.length > 0 && (
                            <Reveal>
                                <Panel className="h-full p-6 sm:p-8">
                                    <h2 className="flex items-center gap-2 text-2xl font-extrabold"><PackageCheck className="size-6 text-primary" /> What you get</h2>
                                    <ul className="mt-5 space-y-3">
                                        {offer.features.map((f) => (
                                            <li key={f} className="flex items-start gap-3"><span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10"><Check className="size-4" /></span>{f}</li>
                                        ))}
                                    </ul>
                                </Panel>
                            </Reveal>
                        )}
                        <Reveal>
                            <Panel className="h-full p-6 sm:p-8">
                                <h2 className="flex items-center gap-2 text-lg font-bold"><CalendarClock className="size-5 text-primary" /> Offer details</h2>
                                <dl className="mt-4 space-y-2 text-sm">
                                    {offer.startsAt && <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Starts</dt><dd>{formatDate(offer.startsAt)}</dd></div>}
                                    {offer.endsAt && <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Ends</dt><dd>{formatDate(offer.endsAt)}</dd></div>}
                                    <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Delivery</dt><dd>Free on orders from {formatNaira(FREE_DELIVERY_THRESHOLD)}</dd></div>
                                </dl>
                                {offer.terms && <p className="mt-4 whitespace-pre-line text-sm text-muted-foreground">{offer.terms}</p>}
                            </Panel>
                        </Reveal>
                    </div>
                </section>
            )}
        </SiteShell>
    );
}
