/* eslint-disable @next/next/no-img-element */
// components/products/product-card.tsx
'use client';
import { ShoppingCart, Plus, Minus, Eye, Star, Info, MessageSquare, ThumbsUp } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Product } from '@/types/product';
// Import the necessary hooks
import { useProductReviews, useAddProductReview } from '@/hooks/useProducts';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { useCartStore } from '@/stores/cart-store';
import { useAddToCart } from '@/hooks/useCart';
import { API_BASE_URL } from '@/services/base';

// REMOVED: const API_BASE_URL = 'https://epilux-backend.vercel.app'; // No longer needed, as the service handles the base URL

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const [quantity, setQuantity] = useState(5);
    const [showDetails, setShowDetails] = useState(false);
    const [showReviews, setShowReviews] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [reviewTitle, setReviewTitle] = useState('');
    // REMOVED: const [isSubmittingReview, setIsSubmittingReview] = useState(false); // Handled by mutation hook

    const { user, token } = useAuth();
    const productId = product.id || product._id || '';
    const { data: reviewsData, isLoading: reviewsLoading } = useProductReviews(productId);
    
    // Initialize the mutation hook
    const addReviewMutation = useAddProductReview(); 
    
    const addToCartStore = useCartStore((state) => state.addToCart);
    const addToCartAPI = useAddToCart();

    const reviews = reviewsData?.reviews || [];
    const averageRating = reviewsData?.averageRating || 0;
    
    // Use the mutation hook's status for submission state
    const isSubmittingReview = addReviewMutation.isPending;

    if (!product) {
        return <div className="bg-white rounded-lg shadow p-4">Product not available</div>;
    }

    // Construct the redirect URL for the products page
    const loginLinkHref = user ? `/products` : `/login?redirect=${encodeURIComponent('/products')}`;

    const handleQuantityChange = (change: number) => {
        const newQuantity = Math.max(5, quantity + change);
        setQuantity(newQuantity);
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'sachet': return '💧';
            case 'bottled': return '🥤';
            case 'dispenser': return '🏢';
            case 'bulk': return '📦';
            case 'accessories': return '🔧';
            default: return '🛍️';
        }
    };

    const getStockStatus = (stock: number) => {
        if (stock === 0) return { text: 'Out of Stock', color: 'bg-gray-100 text-gray-800', available: false };
        if (stock > 50) return { text: 'In Stock', color: 'bg-green-100 text-green-800', available: true };
        if (stock > 10) return { text: 'Low Stock', color: 'bg-yellow-100 text-yellow-800', available: true };
        return { text: 'Limited', color: 'bg-red-100 text-red-800', available: true };
    };

    const stockStatus = getStockStatus(product.stock);

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            toast.error('You must be logged in to submit a review.');
            return;
        }

        if (!reviewComment.trim()) {
            toast.error('Please enter a review comment');
            return;
        }

        try {
            // FIX: Use the mutation hook to submit the review.
            // This is the correct pattern to use React Query service functions.
            await addReviewMutation.mutateAsync({
                productId: productId,
                reviewData: {
                    rating: reviewRating,
                    comment: reviewComment,
                    title: reviewTitle || undefined,
                },
            });

            toast.success('Review added successfully! The review list will update shortly.');
            // Reset form state on success
            setReviewComment('');
            setReviewTitle('');
            setReviewRating(5);
            setShowReviewForm(false);

        } catch (error: any) {
            console.error('Review submission error:', error);
            // Display error from server response or a fallback message
            toast.error(error?.response?.data?.message || error?.message || 'Failed to add review');
        }
        // Removed the finally block as isSubmittingReview is automatically managed by the hook
    };

    return (
        <Card className={`group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-200 ${!stockStatus.available ? 'opacity-60 grayscale' : ''}`}>
            {/* Product Image */}
            <div className="relative">
                <Link href={loginLinkHref}>
                    <div className="aspect-square bg-gray-100 relative overflow-hidden">
                        <img
                            src={product.images?.[0]?.url ? `${API_BASE_URL}${product.images[0].url}` : (product.image ? `${API_BASE_URL}${product.image}` : '/images/placeholder.jpg')}
                            alt={product.images?.[0]?.altText || product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                                // Don't set fallback if already set to avoid infinite loop
                                if ((e.target as HTMLImageElement).src !== '/images/placeholder.jpg') {
                                    (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                                }
                            }}
                        />
                        {product.originalPrice && product.originalPrice > product.price && (
                            <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg">
                                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                            </div>
                        )}
                        <div className="absolute top-3 left-3">
                            <Badge className={`${stockStatus.color} text-xs font-medium`}>
                                {stockStatus.text}
                            </Badge>
                        </div>
                        {/* Quick View Button */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <Dialog open={showDetails} onOpenChange={setShowDetails}>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="bg-white/90 hover:bg-white text-gray-900 shadow-lg"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setShowDetails(true);
                                        }}
                                    >
                                        <Eye className="w-4 h-4 mr-2" />
                                        Quick View
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle className="flex items-center gap-2 text-xl">
                                            <span className="text-2xl">{getCategoryIcon(product.category)}</span>
                                            {product.name}
                                        </DialogTitle>
                                    </DialogHeader>
                                    <div className="grid md:grid-cols-2 gap-6 mt-4">
                                        {/* Product Image */}
                                        <div className="space-y-4">
                                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                                <img
                                                    src={product.images?.[0]?.url ? `${API_BASE_URL}${product.images[0].url}` : (product.image ? `${API_BASE_URL}${product.image}` : '/images/placeholder.jpg')}
                                                    alt={product.images?.[0]?.altText || product.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        // Don't set fallback if already set to avoid infinite loop
                                                        if ((e.target as HTMLImageElement).src !== '/images/placeholder.jpg') {
                                                            (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                                                        }
                                                    }}
                                                />
                                            </div>
                                            {/* Product Tags */}
                                            {product.tags && product.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {product.tags.map((tag, index) => (
                                                        <Badge key={index} variant="outline" className="text-xs">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Details */}
                                        <div className="space-y-4">
                                            {/* Category & Stock */}
                                            <div className="flex items-center justify-between">
                                                <Badge variant="secondary" className="capitalize">
                                                    {getCategoryIcon(product.category)} {product.category} Water
                                                </Badge>
                                                <Badge className={stockStatus.color}>
                                                    {product.stock} in stock
                                                </Badge>
                                            </div>

                                            {/* Description */}
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                                                <p className="text-gray-600 text-sm leading-relaxed">
                                                    {product.description}
                                                </p>
                                            </div>

                                            {/* Pricing */}
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-2xl font-bold text-gray-900">
                                                        ₦{(product.price || 0).toLocaleString()}
                                                    </span>
                                                    {product.originalPrice && (
                                                        <span className="text-lg text-gray-500 line-through">
                                                            ₦{(product.originalPrice || 0).toLocaleString()}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Quantity Selector */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Quantity</label>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-1">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleQuantityChange(-1)}
                                                            disabled={quantity <= 5}
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </Button>
                                                        <span className="text-sm font-medium w-8 text-center">{quantity}</span>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleQuantityChange(1)}
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                    <span className="text-sm text-gray-600">
                                                        Total: ₦{((product.price || 0) * quantity).toLocaleString()}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-blue-600">Minimum order: 5 units</p>
                                            </div>


                                            {/* Reviews Section */}
                                            <div className="border-t border-gray-200 pt-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <MessageSquare className="w-4 h-4 text-blue-600" />
                                                        <span className="text-sm font-medium text-gray-900">Reviews ({reviews.length})</span>
                                                        {averageRating > 0 && (
                                                            <div className="flex items-center gap-1">
                                                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                                <span className="text-sm font-medium text-gray-900">{averageRating.toFixed(1)}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setShowReviews(!showReviews)}
                                                        className="text-xs border-blue-300 text-blue-600 hover:bg-blue-50"
                                                    >
                                                        {showReviews ? 'Hide' : 'View'} Reviews
                                                    </Button>
                                                </div>

                                                {showReviews && (
                                                    <div className="space-y-3">
                                                        {reviewsLoading ? (
                                                            <p className="text-sm text-gray-500">Loading reviews...</p>
                                                        ) : reviews.length > 0 ? (
                                                            <div className="space-y-3 max-h-40 overflow-y-auto">
                                                                {reviews.slice(0, 3).map((review: any, index: number) => (
                                                                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                                                                        <div className="flex items-center justify-between mb-2">
                                                                            <div className="flex items-center gap-2">
                                                                                <div className="flex">
                                                                                    {[...Array(5)].map((_, i) => (
                                                                                        <Star
                                                                                            key={i}
                                                                                            className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                                                                        />
                                                                                    ))}
                                                                                </div>
                                                                                <span className="text-xs text-gray-600">{review.user?.firstName || 'Anonymous'}</span>
                                                                            </div>
                                                                            <span className="text-xs text-gray-500">
                                                                                {new Date(review.createdAt).toLocaleDateString()}
                                                                            </span>
                                                                        </div>
                                                                        {review.title && (
                                                                            <h5 className="text-sm font-medium text-gray-900 mb-1">{review.title}</h5>
                                                                        )}
                                                                        <p className="text-sm text-gray-700">{review.comment}</p>
                                                                    </div>
                                                                ))}
                                                                {reviews.length > 3 && (
                                                                    <p className="text-xs text-blue-600 text-center">+{reviews.length - 3} more reviews</p>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <p className="text-sm text-gray-500">No reviews yet. Be the first to review!</p>
                                                        )}

                                                        {/* Add Review Button */}
                                                        {user && (
                                                            <div className="border-t border-gray-200 pt-3">
                                                                <Button
                                                                    onClick={() => {
                                                                        setShowReviews(false);
                                                                        setShowReviewForm(true);
                                                                    }}
                                                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm"
                                                                >
                                                                    Write a Review
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="space-y-2">
                                                {stockStatus.available ? (
                                                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                                                        onClick={async () => {
                                                            try {
                                                                // Add to local store for immediate UI feedback
                                                                addToCartStore(product, quantity);

                                                                // Always attempt API add as well
                                                                await addToCartAPI.mutateAsync({
                                                                    productId: productId,
                                                                    quantity,
                                                                    image: product.images?.[0]?.url || product.image || '',
                                                                    name: product.name,
                                                                    price: product.price
                                                                });

                                                                toast.success(`${quantity} ${product.name} added to cart!`);
                                                            } catch (error: any) {
                                                                toast.error(error?.response?.data?.message || 'Failed to add item to cart');
                                                            }
                                                        }}>
                                                        <ShoppingCart className="w-4 h-4 mr-2" />
                                                        Add to Cart
                                                    </Button>
                                                ) : (
                                                    <Button className="w-full bg-gray-400 text-white font-medium cursor-not-allowed" disabled>
                                                        <ShoppingCart className="w-4 h-4 mr-2" />
                                                        Out of Stock
                                                    </Button>
                                                )}
                                                <Link href={loginLinkHref}>
                                                    <Button variant="outline" className="w-full border-blue-300 text-blue-600 hover:bg-blue-50">
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        View Full Details
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>

                            {/* Review Form Dialog */}
                            <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
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
                                            <button
                                                type="submit"
                                                disabled={isSubmittingReview || !reviewComment.trim()}
                                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                                                onClick={(e) => {
                                                    // Manually trigger form submission if needed
                                                    const form = (e.target as HTMLElement).closest('form');
                                                    if (form && !isSubmittingReview && reviewComment.trim()) {
                                                        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                                                        form.dispatchEvent(submitEvent);
                                                    }
                                                }}
                                            >
                                                {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                                            </button>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </Link>
            </div>

            <CardContent className="p-4">
                {/* Product Info */}
                <div className="space-y-3">
                    <div>
                        <Link href={loginLinkHref}>
                            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 hover:text-blue-600 transition-colors text-sm leading-tight">
                                {product.name}
                            </h3>
                        </Link>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs text-gray-500 capitalize">{product.category} Water</span>
                            <span className="text-xs">{getCategoryIcon(product.category)}</span>
                        </div>
                    </div>

                    {/* Individual Product Reviews */}
                    {reviews.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                            <MessageSquare className="w-3 h-3" />
                            <span>{reviews.length} review{reviews.length > 1 ? 's' : ''}</span>
                            {averageRating > 0 && (
                                <>
                                    <span>•</span>
                                    <div className="flex items-center gap-1">
                                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                        <span>{averageRating.toFixed(1)}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="flex gap-2">
                        <Dialog open={showDetails} onOpenChange={setShowDetails}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 text-xs hover-lift border-blue-300 text-blue-600 hover:bg-blue-50"
                                    onClick={() => setShowDetails(true)}
                                >
                                    <Eye className="w-3 h-3 mr-1" />
                                    Details
                                </Button>
                            </DialogTrigger>
                        </Dialog>
                        {stockStatus.available ? (
                             <Button size="sm" className="flex-1 w-full bg-blue-600 hover:bg-blue-700 text-white text-xs"
                                 onClick={async () => {
                                     try {
                                         // Add to local store for immediate UI feedback
                                         addToCartStore(product, quantity);

                                         // Also add to API if user is logged in
                                         if (token) {
                                             await addToCartAPI.mutateAsync({
                                                 productId: productId,
                                                 quantity,
                                                 image: product.images?.[0]?.url || product.image || '',
                                                 name: product.name,
                                                 price: product.price
                                             });
                                         }

                                         toast.success(`${quantity} ${product.name} added to cart!`);
                                     } catch (error: any) {
                                         toast.error(error?.response?.data?.message || 'Failed to add item to cart');
                                     }
                                 }}>
                                 <ShoppingCart className="w-3 h-3 mr-1" />
                                 Add
                             </Button>
                         ) : (
                            <Button size="sm" className="w-full bg-gray-400 text-white text-xs cursor-not-allowed" disabled>
                                <ShoppingCart className="w-3 h-3 mr-1" />
                                Out
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}