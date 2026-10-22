/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Loader2, ShoppingCart, Star } from 'lucide-react';
import { toast } from 'sonner';
import { useAddToCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { getErrorMessage } from '@/services/base';
import { formatNaira } from '@/lib/format';
import { handleImageError, productImageUrl } from '@/lib/images';
import { MIN_ORDER_QUANTITY } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { QuantityStepper } from '@/Components/ui/kit';
import type { Product } from '@/types/product';

type CardProduct = Product & {
    _id?: string;
    averageRating?: number;
    numOfReviews?: number;
    rating?: number;
    ratingCount?: number;
};

const stockInfo = (stock: number) => {
    if (stock <= 0) return { label: 'Out of stock', className: 'bg-muted text-muted-foreground' };
    if (stock < 20) return { label: `Only ${stock} left`, className: 'bg-amber-500 text-white' };
    return { label: 'In stock', className: 'bg-emerald-500 text-white' };
};

export default function ProductCard({ product }: { product: CardProduct }) {
    const { token } = useAuth();
    const addToCart = useAddToCart();
    const productId = String(product._id || product.id || '');
    const minQty = Math.min(MIN_ORDER_QUANTITY, Math.max(1, product.stock || 1));
    const [quantity, setQuantity] = useState(minQty);
    const [justAdded, setJustAdded] = useState(false);

    const stock = Number(product.stock) || 0;
    const available = stock > 0;
    const badge = stockInfo(stock);
    const rating = product.averageRating || product.rating || 0;
    const reviewCount = product.numOfReviews || product.ratingCount || 0;
    const href = `/products/${productId}`;

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!token) {
            window.location.href = `/login?redirect=${encodeURIComponent(href)}`;
            return;
        }
        addToCart.mutate({ productId, quantity }, {
            onSuccess: () => {
                setJustAdded(true);
                toast.success(`${quantity} × ${product.name} added to your cart`);
                setTimeout(() => setJustAdded(false), 1800);
            },
            onError: (err) => toast.error(getErrorMessage(err, 'Could not add to cart')),
        });
    };

    return (
        <article
            className={cn(
                'group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/70 bg-card shadow-soft transition-[box-shadow,transform,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-brand-500/30 hover:shadow-lift',
                !available && 'opacity-75'
            )}
        >
            <Link href={href} className="relative block aspect-[4/3.6] overflow-hidden bg-gradient-to-br from-brand-50 via-white to-sky-50">
                <img
                    src={productImageUrl(product)}
                    alt={product.name}
                    loading="lazy"
                    onError={handleImageError}
                    className={cn('h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]', !available && 'grayscale')}
                />
                <span className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className={cn('absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold shadow-sm', badge.className)}>{badge.label}</span>
                {product.category && (
                    <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold capitalize text-foreground shadow-sm backdrop-blur">
                        {product.category}
                    </span>
                )}
            </Link>

            <div className="flex flex-1 flex-col p-4 sm:p-5">
                <Link href={href} className="block">
                    <h3 className="line-clamp-2 text-[15px] font-bold leading-snug tracking-tight transition-colors group-hover:text-primary sm:text-base">
                        {product.name}
                    </h3>
                </Link>

                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    {reviewCount > 0 ? (
                        <>
                            <Star className="size-3.5 fill-amber-400 text-amber-400" />
                            <span className="font-semibold text-foreground">{rating.toFixed(1)}</span>
                            <span>({reviewCount})</span>
                        </>
                    ) : (
                        <span>New</span>
                    )}
                </div>

                <div className="mt-3 flex items-end justify-between gap-2">
                    <div>
                        <p className="text-xl font-extrabold tracking-tight tabular-nums">{formatNaira(product.price)}</p>
                        <p className="text-[11px] text-muted-foreground">per unit</p>
                    </div>
                </div>

                <div className="mt-auto pt-4">
                    {available ? (
                        <div className="flex items-center gap-2">
                            <QuantityStepper value={quantity} onChange={setQuantity} min={minQty} max={stock} size="sm" />
                            <button
                                onClick={handleAdd}
                                disabled={addToCart.isPending}
                                className={cn(
                                    'relative flex h-8 flex-1 items-center justify-center gap-1.5 overflow-hidden rounded-xl text-sm font-semibold text-white shadow-sm transition-[background-color,box-shadow,transform] duration-200 active:scale-[0.97] disabled:opacity-80',
                                    justAdded ? 'bg-success' : 'bg-primary hover:bg-brand-700 hover:shadow-brand'
                                )}
                                aria-label={`Add ${product.name} to cart`}
                            >
                                <AnimatePresence mode="wait" initial={false}>
                                    {addToCart.isPending ? (
                                        <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                            <Loader2 className="size-4 animate-spin" />
                                        </motion.span>
                                    ) : justAdded ? (
                                        <motion.span key="done" className="flex items-center gap-1.5" initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }}>
                                            <Check className="size-4" /> Added
                                        </motion.span>
                                    ) : (
                                        <motion.span key="add" className="flex items-center gap-1.5" initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }}>
                                            <ShoppingCart className="size-4" /> Add
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </button>
                        </div>
                    ) : (
                        <div className="flex h-8 items-center justify-center rounded-xl bg-muted text-sm font-semibold text-muted-foreground">
                            Out of stock
                        </div>
                    )}
                    {available && <p className="mt-2 text-[11px] text-muted-foreground">Total {formatNaira(product.price * quantity)} · min. {minQty}</p>}
                </div>
            </div>
        </article>
    );
}

export function ProductCardSkeleton() {
    return (
        <div className="overflow-hidden rounded-3xl border border-border/70 bg-card">
            <div className="skeleton-shimmer aspect-[4/3.6]" />
            <div className="space-y-3 p-5">
                <div className="skeleton-shimmer h-4 w-4/5 rounded-md" />
                <div className="skeleton-shimmer h-3 w-1/3 rounded-md" />
                <div className="skeleton-shimmer h-6 w-1/2 rounded-md" />
                <div className="flex gap-2 pt-2">
                    <div className="skeleton-shimmer h-8 w-28 rounded-xl" />
                    <div className="skeleton-shimmer h-8 flex-1 rounded-xl" />
                </div>
            </div>
        </div>
    );
}
