/* eslint-disable @next/next/no-img-element */
'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import {
    ArrowLeft, Check, ChevronLeft, ChevronRight, Gift, Loader2, MessageSquare, PackageX,
    ShieldCheck, ShoppingBag, ShoppingCart, Star, Truck,
} from 'lucide-react';
import { useAddProductReview, useProduct, useProductReviews } from '@/hooks/useProducts';
import { useAddToCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { getErrorMessage } from '@/services/base';
import { Button } from '@/Components/ui/button';
import { Textarea } from '@/Components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { EmptyState, Panel, Pill, QuantityStepper } from '@/Components/ui/kit';
import { Reveal } from '@/Components/motion';
import { formatDate, formatNaira, initials } from '@/lib/format';
import { handleImageError, resolveImageUrl } from '@/lib/images';
import { MIN_ORDER_QUANTITY } from '@/lib/constants';
import { FREE_DELIVERY_THRESHOLD } from '@/services/delivery';
import { cn } from '@/lib/utils';

type ProductImage = { url: string; isPrimary?: boolean; altText?: string };
type Review = { _id: string; rating: number; comment: string; createdAt: string; user?: { firstName?: string; lastName?: string } };

function Stars({ value, size = 'size-4' }: { value: number; size?: string }) {
    return (
        <span className="inline-flex items-center gap-0.5" aria-label={`${value.toFixed(1)} out of 5`}>
            {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className={cn(size, i <= Math.round(value) ? 'fill-amber-400 text-amber-400' : 'text-border')} />
            ))}
        </span>
    );
}

function Gallery({ images, name }: { images: ProductImage[]; name: string }) {
    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const list = images.length ? images : [{ url: '' }];
    const go = (next: number) => {
        setDirection(next > index ? 1 : -1);
        setIndex((next + list.length) % list.length);
    };

    return (
        <div className="space-y-3">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-border/70 bg-gradient-to-br from-brand-50 via-white to-sky-50 shadow-soft sm:aspect-square">
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                    <motion.img
                        key={index}
                        src={resolveImageUrl(list[index])}
                        alt={list[index].altText || name}
                        onError={handleImageError}
                        className="absolute inset-0 h-full w-full cursor-grab object-cover active:cursor-grabbing"
                        custom={direction}
                        initial={{ opacity: 0, x: direction * 60 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: direction * -60 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        drag={list.length > 1 ? 'x' : false}
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.2}
                        onDragEnd={(_, info) => {
                            if (info.offset.x < -60) go(index + 1);
                            if (info.offset.x > 60) go(index - 1);
                        }}
                    />
                </AnimatePresence>
                {list.length > 1 && (
                    <>
                        <button onClick={() => go(index - 1)} className="absolute left-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow-md backdrop-blur hover:bg-white" aria-label="Previous image">
                            <ChevronLeft className="size-5" />
                        </button>
                        <button onClick={() => go(index + 1)} className="absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow-md backdrop-blur hover:bg-white" aria-label="Next image">
                            <ChevronRight className="size-5" />
                        </button>
                        <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
                            {list.map((_, i) => (
                                <span key={i} className={cn('h-1.5 rounded-full bg-white/90 shadow transition-all duration-300', i === index ? 'w-6' : 'w-1.5 opacity-60')} />
                            ))}
                        </div>
                    </>
                )}
            </div>
            {list.length > 1 && (
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {list.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => go(i)}
                            className={cn('size-18 shrink-0 overflow-hidden rounded-2xl border-2 transition-all', i === index ? 'border-primary shadow-brand' : 'border-transparent opacity-70 hover:opacity-100')}
                            aria-label={`Show image ${i + 1}`}
                        >
                            <img src={resolveImageUrl(img)} alt="" onError={handleImageError} className="h-full w-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

function ReviewDialog({ open, onOpenChange, productId }: { open: boolean; onOpenChange: (v: boolean) => void; productId: string }) {
    const [rating, setRating] = useState(5);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const addReview = useAddProductReview();

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (comment.trim().length < 3) {
            toast.error('Please write a few words about the product');
            return;
        }
        addReview.mutate({ productId, reviewData: { rating, comment: comment.trim() } }, {
            onSuccess: () => {
                toast.success('Thanks! Your review will appear once it has been approved.');
                setComment('');
                setRating(5);
                onOpenChange(false);
            },
            onError: (err) => toast.error(getErrorMessage(err, 'Could not submit your review')),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md rounded-3xl">
                <DialogHeader>
                    <DialogTitle>Write a review</DialogTitle>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <p className="mb-2 text-sm font-semibold">Your rating</p>
                        <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <motion.button
                                    key={star}
                                    type="button"
                                    whileTap={{ scale: 0.85 }}
                                    whileHover={{ scale: 1.15 }}
                                    onMouseEnter={() => setHover(star)}
                                    onClick={() => setRating(star)}
                                    aria-label={`${star} star${star > 1 ? 's' : ''}`}
                                >
                                    <Star className={cn('size-8 transition-colors', star <= (hover || rating) ? 'fill-amber-400 text-amber-400' : 'text-border')} />
                                </motion.button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="review-comment" className="mb-2 block text-sm font-semibold">Your review</label>
                        <Textarea id="review-comment" value={comment} onChange={(e) => setComment(e.target.value)} rows={4} maxLength={1000} placeholder="How was the taste, packaging and delivery?" className="rounded-xl" />
                    </div>
                    <div className="flex gap-2">
                        <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" className="flex-1" loading={addReview.isPending}>Submit review</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default function ProductDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { user } = useAuth();
    const { data, isLoading, isError } = useProduct(id);
    const { data: reviewsData } = useProductReviews(id);
    const addToCart = useAddToCart();
    const [reviewOpen, setReviewOpen] = useState(false);
    const [added, setAdded] = useState(false);

    const product = data?.product || data?.data;
    const stock = Number(product?.stock) || 0;
    const minQty = Math.min(MIN_ORDER_QUANTITY, Math.max(1, stock || 1));
    const [quantity, setQuantity] = useState(MIN_ORDER_QUANTITY);
    const qty = Math.min(Math.max(quantity, minQty), Math.max(stock, minQty));

    const reviews: Review[] = useMemo(() => reviewsData?.data || reviewsData?.reviews || [], [reviewsData]);
    const rating = product?.averageRating || (reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0);
    const images: ProductImage[] = useMemo(() => {
        const list: ProductImage[] = product?.images || [];
        return [...list].sort((a, b) => Number(!!b.isPrimary) - Number(!!a.isPrimary));
    }, [product]);

    const add = (thenCheckout = false) => {
        addToCart.mutate({ productId: id, quantity: qty }, {
            onSuccess: () => {
                setAdded(true);
                setTimeout(() => setAdded(false), 1800);
                if (thenCheckout) router.push('/cart');
                else toast.success(`${qty} × ${product?.name} added to your cart`, { action: { label: 'View cart', onClick: () => router.push('/cart') } });
            },
            onError: (err) => toast.error(getErrorMessage(err, 'Could not add to cart')),
        });
    };

    if (isLoading) {
        return (
            <div className="grid gap-8 lg:grid-cols-2">
                <div className="skeleton-shimmer aspect-square rounded-[1.75rem]" />
                <div className="space-y-4">
                    <div className="skeleton-shimmer h-5 w-24 rounded-md" />
                    <div className="skeleton-shimmer h-10 w-3/4 rounded-lg" />
                    <div className="skeleton-shimmer h-8 w-40 rounded-lg" />
                    <div className="skeleton-shimmer h-24 w-full rounded-xl" />
                    <div className="skeleton-shimmer h-12 w-full rounded-xl" />
                </div>
            </div>
        );
    }

    if (isError || !product) {
        return (
            <EmptyState
                icon={PackageX}
                title="Product not available"
                description="This product may have been removed or is no longer on sale."
                action={{ label: 'Back to shop', href: '/products' }}
            />
        );
    }

    const available = stock > 0;

    return (
        <div className="pb-24 lg:pb-0">
            <Link href="/products" className="animate-fade-in mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
                <ArrowLeft className="size-4" /> Back to shop
            </Link>

            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                <Reveal immediate>
                    <Gallery images={images} name={product.name} />
                </Reveal>

                <div className="animate-fade-in space-y-6" style={{ animationDelay: '80ms' }}>
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            {product.category && <Pill tone="brand" className="capitalize">{product.category}</Pill>}
                            {available ? (
                                <Pill tone={stock < 20 ? 'warning' : 'success'} dot>{stock < 20 ? `Only ${stock} left` : 'In stock'}</Pill>
                            ) : (
                                <Pill tone="danger" dot>Out of stock</Pill>
                            )}
                        </div>
                        <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">{product.name}</h1>
                        <a href="#reviews" className="mt-2 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                            <Stars value={rating} />
                            {reviews.length ? <span>{rating.toFixed(1)} · {reviews.length} review{reviews.length > 1 ? 's' : ''}</span> : <span>No reviews yet</span>}
                        </a>
                    </div>

                    <div className="flex items-end gap-3">
                        <p className="text-4xl font-extrabold tracking-tight tabular-nums">{formatNaira(product.price)}</p>
                        <p className="pb-1.5 text-sm text-muted-foreground">per unit</p>
                    </div>

                    {product.description && <p className="leading-relaxed text-muted-foreground">{product.description}</p>}

                    {available && (
                        <Panel className="space-y-4 p-5">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-semibold">Quantity</p>
                                    <p className="text-xs text-muted-foreground">Minimum order {minQty} units</p>
                                </div>
                                <QuantityStepper value={qty} onChange={setQuantity} min={minQty} max={stock} />
                            </div>
                            <div className="flex items-center justify-between border-t border-border/60 pt-4">
                                <span className="text-sm text-muted-foreground">Total</span>
                                <motion.span key={qty} initial={{ scale: 0.9, opacity: 0.5 }} animate={{ scale: 1, opacity: 1 }} className="text-xl font-extrabold tabular-nums">
                                    {formatNaira(product.price * qty)}
                                </motion.span>
                            </div>
                            <div className="hidden gap-3 sm:flex">
                                <Button size="lg" variant="outline" className="flex-1" onClick={() => add(false)} disabled={addToCart.isPending}>
                                    {added ? <><Check /> Added</> : <><ShoppingCart /> Add to cart</>}
                                </Button>
                                <Button size="lg" variant="brand" className="flex-1" onClick={() => add(true)} loading={addToCart.isPending}>
                                    <ShoppingBag /> Buy now
                                </Button>
                            </div>
                        </Panel>
                    )}

                    <div className="grid gap-3 sm:grid-cols-3">
                        {[
                            { icon: Truck, title: 'Doorstep delivery', text: `Free from ${formatNaira(FREE_DELIVERY_THRESHOLD)}` },
                            { icon: Gift, title: 'Earn rewards', text: 'Paid when you confirm delivery' },
                            { icon: ShieldCheck, title: 'Secure checkout', text: 'Protected by Flutterwave' },
                        ].map(({ icon: Icon, title, text }) => (
                            <div key={title} className="rounded-2xl border border-border/70 bg-card p-4">
                                <Icon className="size-5 text-primary" />
                                <p className="mt-2 text-sm font-semibold">{title}</p>
                                <p className="text-xs text-muted-foreground">{text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Reviews */}
            <section id="reviews" className="mt-14 scroll-mt-24">
                <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-extrabold tracking-tight">Customer reviews</h2>
                        <p className="text-sm text-muted-foreground">{reviews.length ? `${rating.toFixed(1)} out of 5 from ${reviews.length} review${reviews.length > 1 ? 's' : ''}` : 'Be the first to share your experience'}</p>
                    </div>
                    {user && <Button variant="outline" onClick={() => setReviewOpen(true)}><MessageSquare /> Write a review</Button>}
                </div>
                {reviews.length === 0 ? (
                    <Panel className="p-2">
                        <EmptyState icon={Star} title="No reviews yet" description="Tried this product? Your review helps other customers." />
                    </Panel>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {reviews.map((review, i) => (
                            <Reveal key={review._id} delay={Math.min(i, 6) * 0.05}>
                                <Panel className="h-full p-5">
                                    <div className="flex items-center gap-3">
                                        <span className="grid size-10 place-items-center rounded-full bg-gradient-brand text-sm font-bold text-white">
                                            {initials(review.user?.firstName, review.user?.lastName)}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-semibold">{[review.user?.firstName, review.user?.lastName?.charAt(0)].filter(Boolean).join(' ') || 'Customer'}{review.user?.lastName ? '.' : ''}</p>
                                            <p className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</p>
                                        </div>
                                        <Stars value={review.rating} size="size-3.5" />
                                    </div>
                                    <p className="mt-3 text-sm leading-relaxed text-foreground/85">{review.comment}</p>
                                </Panel>
                            </Reveal>
                        ))}
                    </div>
                )}
            </section>

            {/* Sticky mobile purchase bar (sits above the bottom navigation) */}
            {available && (
                <div className="glass fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-20 border-t border-border/70 px-4 py-3 sm:hidden">
                    <div className="flex items-center gap-3">
                        <div className="min-w-0">
                            <p className="text-xs text-muted-foreground">{qty} × {formatNaira(product.price)}</p>
                            <p className="font-extrabold tabular-nums">{formatNaira(product.price * qty)}</p>
                        </div>
                        <Button variant="outline" size="icon" className="ml-auto shrink-0" onClick={() => add(false)} disabled={addToCart.isPending} aria-label="Add to cart">
                            {addToCart.isPending ? <Loader2 className="animate-spin" /> : added ? <Check /> : <ShoppingCart />}
                        </Button>
                        <Button variant="brand" className="shrink-0" onClick={() => add(true)} disabled={addToCart.isPending}>
                            Buy now
                        </Button>
                    </div>
                </div>
            )}

            <ReviewDialog open={reviewOpen} onOpenChange={setReviewOpen} productId={id} />
        </div>
    );
}
