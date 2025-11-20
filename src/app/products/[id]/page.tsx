/* eslint-disable @next/next/no-img-element */
// app/products/[id]/page.tsx
'use client'; // Convert to client component

import { notFound, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useCartStore } from '@/app/context/cart-context';
import { Button } from '@/Components/ui/button';
import { useProduct, useProductReviews, useAddProductReview, useProductRatings, useProductRatingSummary, useUserRatings } from '@/hooks/useProducts';
import { useAuth } from '@/hooks/useAuth';
import { useAddToCart } from '@/hooks/useCart';
import { Star, MessageSquare, ThumbsUp, ShoppingCart, Plus, Minus, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Textarea } from '@/Components/ui/textarea';
import { Label } from '@/Components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { API_BASE_URL } from '@/services/base';

export default function ProductDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [quantity, setQuantity] = useState<number>(5);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [reviewTitle, setReviewTitle] = useState('');
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [imageViewerOpen, setImageViewerOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [mainImageIndex, setMainImageIndex] = useState(0);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const addToCart = useCartStore((s) => s.addToCart);
    const { user, token } = useAuth();
    const addToCartAPI = useAddToCart();

    const handleViewImages = (startIndex: number = 0) => {
      console.log('Opening image viewer with index:', startIndex);
      setSelectedImageIndex(startIndex);
      setImageViewerOpen(true);
    };

    const handlePrevImage = () => {
      if (product?.images?.length > 0) {
        setSelectedImageIndex((prev) =>
          prev > 0 ? prev - 1 : product.images.length - 1
        );
      }
    };

    const handleNextImage = () => {
        if (product?.images?.length > 0) {
            setSelectedImageIndex((prev) =>
                prev < product.images.length - 1 ? prev + 1 : 0
            );
        }
    };

    // Touch handlers for swipe functionality
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            handleNextImage();
        } else if (isRightSwipe) {
            handlePrevImage();
        }
    };

    const handleMainTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = Math.abs(touchStart - touchEnd);
        const isLeftSwipe = (touchStart - touchEnd) > 50;
        const isRightSwipe = (touchStart - touchEnd) < -50;
        const images = product?.images?.length > 0 ? product.images : [{ url: product?.image ? `${API_BASE_URL}${product.image}` : '/images/placeholder.jpg' }];

        if (isLeftSwipe && images.length > 1) {
            setMainImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0);
        } else if (isRightSwipe && images.length > 1) {
            setMainImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1);
        } else if (distance < 10) {
            // If minimal movement, treat as tap/click and open modal
            handleViewImages(mainImageIndex);
        }
    };

    // Use API to fetch product
    const { data: productData, isLoading, error } = useProduct(id);
    const { data: reviewsData, isLoading: reviewsLoading } = useProductReviews(id);
    const { data: ratingsData } = useProductRatings(id);
    const { data: ratingSummaryData } = useProductRatingSummary(id);
    const { data: userRatingsData } = useUserRatings();
    const addReviewMutation = useAddProductReview();

    const product = productData?.data || productData?.product;

    // Debug logging
    useEffect(() => {
        console.log('imageViewerOpen changed:', imageViewerOpen);
    }, [imageViewerOpen]);
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
                image: product.images?.[0]?.absoluteUrl || `${API_BASE_URL}${product.images?.[0]?.url}` || product.image || '/images/placeholder.jpg'
            }, quantity);

            // Also add to API if user is logged in
            if (token) {
                await addToCartAPI.mutateAsync({
                    productId: product.id || product._id,
                    quantity,
                    image: product.images?.[0]?.absoluteUrl || `${API_BASE_URL}${product.images?.[0]?.url}` || product.image || '/images/placeholder.jpg',
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
                    {(() => {
                        const images = product.images && product.images.length > 0 ? product.images : [{ url: product.image || '/images/placeholder.jpg', alt: product.name }];
                        const currentImage = images[mainImageIndex];

                        return (
                            <div className="space-y-4">
                                {/* Main Image Carousel */}
                                <div className="relative h-96 lg:h-[500px] rounded-lg overflow-hidden bg-gray-100 group">
                                    <div
                                        className="w-full h-full cursor-pointer"
                                        onClick={() => {
                                            console.log('Image clicked, opening viewer');
                                            handleViewImages(mainImageIndex);
                                        }}
                                        onTouchStart={handleTouchStart}
                                        onTouchMove={handleTouchMove}
                                        onTouchEnd={handleMainTouchEnd}
                                    >
                                        <img
                                            src={currentImage.absoluteUrl || `${API_BASE_URL}${currentImage.url}`}
                                            alt={currentImage.alt || product.name}
                                            className="w-full h-full object-contain"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                                        />
                                    </div>

                                    {/* Navigation Arrows - Hidden on mobile, visible on desktop */}
                                    {images.length > 1 && (
                                        <>
                                            <button
                                                onClick={() => setMainImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1)}
                                                className="hidden md:flex absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                                            >
                                                <ChevronLeft className="w-6 h-6" />
                                            </button>
                                            <button
                                                onClick={() => setMainImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0)}
                                                className="hidden md:flex absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                                            >
                                                <ChevronRight className="w-6 h-6" />
                                            </button>
                                        </>
                                    )}

                                    {/* Image Counter */}
                                    {images.length > 1 && (
                                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                                            {mainImageIndex + 1} / {images.length}
                                        </div>
                                    )}
                                </div>

                                {/* Thumbnails */}
                                {images.length > 1 && (
                                    <div className="flex gap-2 overflow-x-auto pb-2">
                                        {images.map((image: any, index: number) => (
                                            <button
                                                key={index}
                                                onClick={() => setMainImageIndex(index)}
                                                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                                                    index === mainImageIndex ? 'border-blue-500' : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                            >
                                                <img
                                                    src={image.absoluteUrl || `${API_BASE_URL}${image.url}`}
                                                    alt={`Thumbnail ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })()}
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
                                {(() => {
                                    const minQuantity = 5;
                                    const maxQuantity = Math.min(product.stock, 10); // Limit to 10 or stock if less
                                    const options = [];

                                    for (let i = minQuantity; i <= maxQuantity; i++) {
                                        options.push(
                                            <option key={i} value={i}>
                                                {i}
                                            </option>
                                        );
                                    }

                                    return options;
                                })()}
                            </select>
                            <p className="text-sm text-blue-600 mt-1">Minimum order: 5 units</p>
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

            {/* Image Viewer Modal */}
            {imageViewerOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 p-4" onClick={() => setImageViewerOpen(false)}>
                    <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
                        {/* Close button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setImageViewerOpen(false)}
                            className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
                        >
                            <X className="w-6 h-6" />
                        </Button>

                        {/* Main image */}
                        <div className="relative">
                            {(() => {
                                const images = product?.images?.length > 0 ? product.images : [{ url: product?.image ? `${API_BASE_URL}${product.image}` : '/images/placeholder.jpg', alt: product?.name }];
                                const currentImage = images[selectedImageIndex];

                                return currentImage ? (
                                    <img
                                        src={currentImage.absoluteUrl || `${API_BASE_URL}${currentImage.url}`}
                                        alt={currentImage.alt || product?.name}
                                        className="max-w-full max-h-[80vh] object-contain"
                                        onTouchStart={handleTouchStart}
                                        onTouchMove={handleTouchMove}
                                        onTouchEnd={handleTouchEnd}
                                        onError={(e) => {
                                            if ((e.target as HTMLImageElement).src !== '/images/placeholder.jpg') {
                                                (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                                            }
                                        }}
                                    />
                                ) : null;
                            })()}

                            {/* Navigation buttons */}
                            {(() => {
                                const images = product?.images?.length > 0 ? product.images : [{ url: product?.image ? `${API_BASE_URL}${product.image}` : '/images/placeholder.jpg' }];
                                return images.length > 1 ? (
                                    <>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={handlePrevImage}
                                            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                                        >
                                            <ChevronLeft className="w-8 h-8" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleNextImage}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                                        >
                                            <ChevronRight className="w-8 h-8" />
                                        </Button>
                                    </>
                                ) : null;
                            })()}
                        </div>

                        {/* Image counter and thumbnails */}
                        {(() => {
                            const images = product?.images?.length > 0 ? product.images : [{ url: product?.image ? `${API_BASE_URL}${product.image}` : '/images/placeholder.jpg', alt: product?.name }];
                            return images.length > 1 ? (
                                <div className="mt-4 flex flex-col items-center">
                                    <div className="text-white text-sm mb-2">
                                        {selectedImageIndex + 1} of {images.length}
                                    </div>
                                    <div className="flex gap-2 overflow-x-auto max-w-full">
                                        {images.map((image: any, index: number) => (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedImageIndex(index)}
                                                className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                                                    index === selectedImageIndex ? 'border-blue-500' : 'border-gray-400'
                                                }`}
                                            >
                                                <img
                                                    src={image.absoluteUrl || `${API_BASE_URL}${image.url}`}
                                                    alt={`Thumbnail ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        if ((e.target as HTMLImageElement).src !== '/images/placeholder.jpg') {
                                                            (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                                                        }
                                                    }}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : null;
                        })()}
                    </div>
                </div>
            )}
        </div>
    );
}