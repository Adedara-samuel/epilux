/* eslint-disable @next/next/no-img-element */
// app/products/[id]/page.tsx
'use client'; // Convert to client component

import { notFound, useParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { useCartStore } from '@/app/context/cart-context';
import { Button } from '@/Components/ui/button';
import { useProduct, useProductReviews, useAddProductReview, useProductRatings, useProductRatingSummary, useUserRatings } from '@/hooks/useProducts';
import { useAuth } from '@/hooks/useAuth';
import { useAddToCart } from '@/hooks/useCart';
import { Star, MessageSquare, ThumbsUp, ShoppingCart, Plus, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Textarea } from '@/Components/ui/textarea';
import { Label } from '@/Components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';

export default function ProductDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [quantity, setQuantity] = useState<number>(1);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [reviewTitle, setReviewTitle] = useState('');
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    const addToCart = useCartStore((s) => s.addToCart);
    const { user } = useAuth();
    const addToCartAPI = useAddToCart();

    // Use API to fetch product
    const { data: productData, isLoading, error } = useProduct(id);
    const { data: reviewsData, isLoading: reviewsLoading } = useProductReviews(id);
    const { data: ratingsData } = useProductRatings(id);
    const { data: ratingSummaryData } = useProductRatingSummary(id);
    const { data: userRatingsData } = useUserRatings();
    const addReviewMutation = useAddProductReview();

    const product = productData?.data || productData?.product;
    const reviews = reviewsData?.reviews || [];
    const averageRating = reviewsData?.averageRating || 0;

    // Handle loading and error states
    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-2xl font-bold text-gray-700">Loading Product...</h1>
            </div>
        );
    }

    if (error || !product) {
        notFound(); // Renders Next.js not-found page if product isn't found
    }

    const handleAddToCart = async () => {
        try {
            // Add to local store for immediate UI feedback
            addToCart({
                id: product.id || product._id,
                name: product.name,
                price: product.price,
                image: product.images?.[0]?.absoluteUrl || `http://your-server.com${product.images?.[0]?.url}` || product.image || '/images/placeholder.jpg'
            }, quantity);

            // Also add to API if user is logged in
            if (user?.token) {
                await addToCartAPI.mutateAsync({
                    productId: product.id || product._id,
                    quantity,
                    image: product.images?.[0]?.absoluteUrl || `http://your-server.com${product.images?.[0]?.url}` || product.image || '/images/placeholder.jpg',
                    name: product.name,
                    price: product.price
                });
            }

            toast.success(`${quantity} ${product.name}${quantity > 1 ? 's' : ''} added to cart!`);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to add item to cart');
        }
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reviewComment.trim()) {
            toast.error('Please enter a review comment');
            return;
        }

        setIsSubmittingReview(true);
        try {
            await addReviewMutation.mutateAsync({
                productId: id,
                reviewData: {
                    rating: reviewRating,
                    comment: reviewComment,
                    title: reviewTitle || undefined,
                }
            });

            toast.success('Review added successfully!');
            setReviewComment('');
            setReviewTitle('');
            setReviewRating(5);
            setShowReviewForm(false);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to add review');
        } finally {
            setIsSubmittingReview(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-8 rounded-lg shadow-xl">
                <div className="space-y-4">
                    {product.images && product.images.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {product.images.map((image: any, index: number) => (
                                <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                                    <img
                                        src={image.url}
                                        alt={image.alt || product.name}
                                        className="w-full h-full object-cover"
                                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                    />
                                    {image.isPrimary && (
                                        <Badge className="absolute top-2 left-2 bg-blue-600">Primary</Badge>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="relative h-96 lg:h-[500px] rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                            <img
                                src={product.image || '/images/placeholder.jpg'}
                                alt={product.name}
                                className="object-contain"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                            />
                        </div>
                    )}
                </div>

                <div>
                    <h1 className="text-4xl font-extrabold text-blue-800 mb-3">{product.name}</h1>
                    {product.category && (
                        <p className="text-lg text-gray-500 mb-4">Category: {product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
                    )}

                    {product.tags && product.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {product.tags.map((tag: string) => (
                                <span
                                    key={tag}
                                    className="px-3 py-1 text-sm font-medium rounded-full bg-blue-500/10 text-blue-600 border border-blue-200"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-3xl font-bold text-blue-700">
                            ₦{product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && (
                            <span className="text-xl text-gray-500 line-through">
                                ₦{product.originalPrice.toLocaleString()}
                            </span>
                        )}
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>

                    <div className="mb-6 bg-green-50 p-3 rounded-md border border-green-200">
                        <h3 className="font-semibold text-green-700 mb-1">Affiliate Commission:</h3>
                        <p className="text-green-800 font-bold text-lg">
                            ₦{product.affiliateCommission.toLocaleString()} per unit
                        </p>
                    </div>

                    <div className="flex items-end gap-4 mb-8">
                        <div className="w-32">
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                                Quantity
                            </label>
                            <select
                                id="quantity"
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value))}
                                className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                            >
                                {[...Array(product.stock > 10 ? 10 : product.stock)].map((_, i) => ( // Limit to 10 or stock if less
                                    <option key={i + 1} value={i + 1}>
                                        {i + 1}
                                    </option>
                                ))}
                            </select>
                            {product.stock <= 10 && product.stock > 0 && (
                                <p className="text-sm text-yellow-600 mt-1">Only {product.stock} left in stock!</p>
                            )}
                            {product.stock === 0 && (
                                <p className="text-sm text-red-600 mt-1">Out of stock</p>
                            )}
                        </div>

                        <Button
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-lg transition-colors"
                            onClick={handleAddToCart}
                            disabled={product.stock === 0} // Disable if out of stock
                        >
                            Add to Cart
                        </Button>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <h3 className="font-semibold text-xl text-gray-800 mb-3">Product Specifications</h3>
                        <ul className="text-base text-gray-700 space-y-2">
                            <li><strong className="font-medium">SKU:</strong> {product.id.toUpperCase()}</li>
                            <li><strong className="font-medium">Category:</strong> {product.category.charAt(0).toUpperCase() + product.category.slice(1)}</li>
                            <li><strong className="font-medium">Availability:</strong> {product.stock > 0 ? `${product.stock} units in stock` : 'Out of Stock'}</li>
                            <li><strong className="font-medium">Delivery:</strong> Free delivery on orders above ₦10,000</li>
                        </ul>
                    </div>

                    {/* Reviews Section */}
                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <MessageSquare className="w-6 h-6 text-blue-600" />
                                <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
                                {reviews.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-5 h-5 ${i < Math.round(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-lg font-semibold text-gray-900">{averageRating.toFixed(1)}</span>
                                        <span className="text-gray-600">({reviews.length} reviews)</span>
                                    </div>
                                )}
                            </div>
                            {user && (
                                <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
                                    <DialogTrigger asChild>
                                        <Button className="bg-blue-600 hover:bg-blue-700">
                                            <Star className="w-4 h-4 mr-2" />
                                            Write a Review
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-md">
                                        <DialogHeader>
                                            <DialogTitle className="flex items-center gap-2">
                                                <Star className="w-5 h-5 text-yellow-400" />
                                                Write a Review
                                            </DialogTitle>
                                        </DialogHeader>
                                        <form onSubmit={handleSubmitReview} className="space-y-4">
                                            <div>
                                                <Label className="text-sm font-medium">Rating</Label>
                                                <div className="flex gap-1 mt-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            key={star}
                                                            type="button"
                                                            onClick={() => setReviewRating(star)}
                                                            className="focus:outline-none"
                                                        >
                                                            <Star
                                                                className={`w-6 h-6 ${star <= reviewRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                                            />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <Label htmlFor="review-title" className="text-sm font-medium">Review Title (Optional)</Label>
                                                <input
                                                    id="review-title"
                                                    type="text"
                                                    value={reviewTitle}
                                                    onChange={(e) => setReviewTitle(e.target.value)}
                                                    placeholder="Summarize your review"
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mt-1"
                                                    maxLength={100}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="review-comment" className="text-sm font-medium">Your Review</Label>
                                                <Textarea
                                                    id="review-comment"
                                                    value={reviewComment}
                                                    onChange={(e) => setReviewComment(e.target.value)}
                                                    placeholder="Share your experience with this product..."
                                                    className="w-full text-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500 mt-1"
                                                    rows={4}
                                                    required
                                                />
                                            </div>
                                            <div className="flex gap-3 pt-4">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => setShowReviewForm(false)}
                                                    className="flex-1"
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    disabled={isSubmittingReview || !reviewComment.trim()}
                                                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                                                >
                                                    {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                                                </Button>
                                            </div>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>

                        {/* Reviews List */}
                        {reviewsLoading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading reviews...</p>
                            </div>
                        ) : reviews.length > 0 ? (
                            <div className="space-y-4">
                                {reviews.map((review: any, index: number) => (
                                    <Card key={index} className="bg-gray-50 border-gray-200">
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="flex">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-900">{review.user?.firstName || 'Anonymous'}</span>
                                                        <span className="text-xs text-gray-500">
                                                            {new Date(review.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    {review.title && (
                                                        <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
                                                    )}
                                                    <p className="text-gray-700">{review.comment}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Card className="bg-gray-50 border-gray-200">
                                <CardContent className="p-8 text-center">
                                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
                                    <p className="text-gray-600 mb-4">Be the first to review this product!</p>
                                    {!user && (
                                        <p className="text-sm text-blue-600">Login to write a review</p>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}