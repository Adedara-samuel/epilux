/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { MessageSquareText, Star, Trash2 } from 'lucide-react';
import { productsAPI } from '@/services/products';
import { getErrorMessage } from '@/services/base';
import { Button } from '@/Components/ui/button';
import {
    AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/Components/ui/alert-dialog';
import { EmptyState, ErrorState, PageHeader, Panel, Pill } from '@/Components/ui/kit';
import { Stagger, StaggerItem } from '@/Components/motion';
import { formatDate } from '@/lib/format';
import { handleImageError, productImageUrl } from '@/lib/images';

type MyReview = {
    _id: string;
    rating: number;
    comment: string;
    isApproved: boolean;
    createdAt: string;
    product?: { _id: string; name?: string; images?: { url: string; isPrimary?: boolean }[] } | null;
};

function Stars({ value }: { value: number }) {
    return (
        <span className="flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map((n) => <Star key={n} className={n <= value ? 'size-4 fill-amber-400 text-amber-400' : 'size-4 text-muted-foreground/30'} />)}
        </span>
    );
}

export default function MyReviewsPage() {
    const queryClient = useQueryClient();
    const { data, isLoading, isError, refetch } = useQuery({ queryKey: ['user', 'reviews'], queryFn: productsAPI.getMyReviews });
    const [toDelete, setToDelete] = useState<MyReview | null>(null);

    const remove = useMutation({
        mutationFn: (r: MyReview) => productsAPI.deleteProductReview(r.product?._id || '', r._id),
        onSuccess: (_d, r) => {
            toast.success('Review deleted');
            queryClient.invalidateQueries({ queryKey: ['user', 'reviews'] });
            if (r.product?._id) queryClient.invalidateQueries({ queryKey: ['product', 'reviews', r.product._id] });
            setToDelete(null);
        },
        onError: (err) => toast.error(getErrorMessage(err, 'Could not delete the review')),
    });

    const reviews: MyReview[] = data?.data || [];

    return (
        <div className="max-w-4xl">
            <PageHeader title="My reviews" description="Reviews you've written. New reviews appear on the product once approved." />

            {isLoading ? (
                <div className="space-y-3">{[0, 1, 2].map((i) => <div key={i} className="skeleton-shimmer h-28 rounded-3xl" />)}</div>
            ) : isError ? (
                <Panel><ErrorState onRetry={() => refetch()} /></Panel>
            ) : reviews.length === 0 ? (
                <Panel>
                    <EmptyState icon={MessageSquareText} title="No reviews yet" description="After you receive an order, share what you think on the product page." action={{ label: 'Browse products', href: '/products' }} />
                </Panel>
            ) : (
                <Stagger immediate className="space-y-3">
                    {reviews.map((r) => (
                        <StaggerItem key={r._id}>
                            <Panel className="flex gap-4 p-4 sm:p-5">
                                <Link href={r.product?._id ? `/products/${r.product._id}` : '/products'} className="shrink-0">
                                    <img src={productImageUrl(r.product || {})} onError={handleImageError} alt={r.product?.name || 'Product'} className="size-16 rounded-2xl bg-muted object-cover sm:size-20" />
                                </Link>
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <Link href={r.product?._id ? `/products/${r.product._id}` : '/products'} className="block truncate font-bold hover:text-primary">
                                                {r.product?.name || 'Product no longer available'}
                                            </Link>
                                            <div className="mt-1 flex flex-wrap items-center gap-2">
                                                <Stars value={r.rating} />
                                                <span className="text-xs text-muted-foreground">{formatDate(r.createdAt)}</span>
                                            </div>
                                        </div>
                                        <Pill tone={r.isApproved ? 'success' : 'warning'} dot>{r.isApproved ? 'Published' : 'Awaiting approval'}</Pill>
                                    </div>
                                    <p className="mt-2 text-sm text-foreground/85">{r.comment}</p>
                                    {r.product?._id && (
                                        <Button variant="ghost" size="sm" className="-ml-3 mt-1 text-muted-foreground hover:text-destructive" onClick={() => setToDelete(r)}>
                                            <Trash2 /> Delete
                                        </Button>
                                    )}
                                </div>
                            </Panel>
                        </StaggerItem>
                    ))}
                </Stagger>
            )}

            <AlertDialog open={!!toDelete} onOpenChange={(open) => !open && setToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this review?</AlertDialogTitle>
                        <AlertDialogDescription>Your review of {toDelete?.product?.name || 'this product'} will be removed. You can write a new one later.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Keep it</AlertDialogCancel>
                        <Button variant="destructive" loading={remove.isPending} onClick={() => toDelete && remove.mutate(toDelete)}>Delete review</Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
