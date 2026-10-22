/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { ArrowRight, Gift } from 'lucide-react';
import { useLiveOffers } from '@/hooks/useOffers';
import SiteShell, { PageHero } from '@/Components/site/site-shell';
import { EmptyState, Panel, Pill } from '@/Components/ui/kit';
import { Stagger, StaggerItem } from '@/Components/motion';
import { formatNaira } from '@/lib/format';
import { handleImageError, resolveImageUrl } from '@/lib/images';

export default function OffersPage() {
    const { data: offers = [], isLoading } = useLiveOffers();

    return (
        <SiteShell>
            <PageHero eyebrow="Offers" title="Current offers" description="Bundles and seasonal deals on Epilux water." />
            <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                {isLoading ? (
                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{[0, 1, 2].map((i) => <div key={i} className="skeleton-shimmer h-80 rounded-3xl" />)}</div>
                ) : offers.length === 0 ? (
                    <Panel className="mx-auto max-w-xl"><EmptyState icon={Gift} title="No offers right now" description="Check back soon. In the meantime, every order still earns you a reward." action={{ label: 'Shop water', href: '/products' }} /></Panel>
                ) : (
                    <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {offers.map((o) => (
                            <StaggerItem key={o._id}>
                                <Link href={`/offers/${o.slug}`} className="group block h-full">
                                    <Panel className="h-full overflow-hidden transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-lift">
                                        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                                            <img src={resolveImageUrl(o.image?.url || o.product?.images?.[0]?.url || '/images/hero-image.jpeg')} onError={handleImageError} alt="" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                            {o.badge && <Pill tone="warning" className="absolute left-4 top-4 shadow-soft">{o.badge}</Pill>}
                                        </div>
                                        <div className="p-5">
                                            <h2 className="text-lg font-bold">{o.title}</h2>
                                            {o.subtitle && <p className="text-sm text-muted-foreground">{o.subtitle}</p>}
                                            <div className="mt-4 flex items-end justify-between">
                                                <span>
                                                    <span className="text-2xl font-extrabold tabular-nums">{formatNaira(o.bundlePrice)}</span>
                                                    {o.savings > 0 && <span className="ml-2 text-sm text-muted-foreground line-through tabular-nums">{formatNaira(o.regularBundlePrice)}</span>}
                                                </span>
                                                <ArrowRight className="size-5 text-primary transition-transform group-hover:translate-x-1" />
                                            </div>
                                        </div>
                                    </Panel>
                                </Link>
                            </StaggerItem>
                        ))}
                    </Stagger>
                )}
            </section>
        </SiteShell>
    );
}
