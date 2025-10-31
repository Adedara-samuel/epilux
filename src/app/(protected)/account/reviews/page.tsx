'use client';

import { useAuth } from '@/app/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Star, MessageSquare, Calendar, ArrowLeft, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import Link from 'next/link';
import { toast } from 'sonner';

interface Review {
    _id: string;
    productId: string;
    productName: string;
    productImage: string;
    rating: number;
    title?: string;
    comment: string;
    createdAt: string;
    updatedAt: string;
}

export default function MyReviewsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loadingReviews, setLoadingReviews] = useState(true);

    // No login redirect - let backend handle authentication

    useEffect(() => {
        if (user) {
            fetchUserReviews();
        }
    }, [user]);

    const fetchUserReviews = async () => {
        try {
            setLoadingReviews(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://epilux-backend.vercel.app'}/api/user/reviews`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setReviews(data.reviews || []);
            } else {
                toast.error('Failed to load reviews');
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
            toast.error('Failed to load reviews');
        } finally {
            setLoadingReviews(false);
        }
    };

    const handleDeleteReview = async (reviewId: string) => {
        if (!confirm('Are you sure you want to delete this review?')) return;

        try {
            const response = await fetch(`/api/products/reviews/${reviewId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                toast.success('Review deleted successfully');
                setReviews(reviews.filter(review => review._id !== reviewId));
            } else {
                toast.error('Failed to delete review');
            }
        } catch (error) {
            console.error('Error deleting review:', error);
            toast.error('Failed to delete review');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push('/account')}
                        className="border-blue-300 text-blue-600 hover:bg-blue-50"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Account
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Reviews</h1>
                        <p className="text-gray-600">Manage your product reviews and ratings</p>
                    </div>
                </div>

                {/* Reviews Content */}
                {loadingReviews ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-lg text-gray-700">Loading your reviews...</p>
                        </div>
                    </div>
                ) : reviews.length === 0 ? (
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                        <CardContent className="p-12 text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <MessageSquare className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
                            <p className="text-gray-600 mb-6">
                                You haven't written any reviews yet. Start exploring our products and share your experience!
                            </p>
                            <Button
                                onClick={() => router.push('/products')}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                Browse Products
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                                <CardContent className="p-6 text-center">
                                    <div className="text-3xl font-bold text-blue-600 mb-2">{reviews.length}</div>
                                    <div className="text-sm text-gray-600">Total Reviews</div>
                                </CardContent>
                            </Card>
                            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                                <CardContent className="p-6 text-center">
                                    <div className="text-3xl font-bold text-green-600 mb-2">
                                        {(reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)}
                                    </div>
                                    <div className="text-sm text-gray-600">Average Rating</div>
                                </CardContent>
                            </Card>
                            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                                <CardContent className="p-6 text-center">
                                    <div className="text-3xl font-bold text-purple-600 mb-2">
                                        {reviews.filter(review => review.rating >= 4).length}
                                    </div>
                                    <div className="text-sm text-gray-600">5-Star Reviews</div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Reviews List */}
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <Card key={review._id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-4 flex-1">
                                                {/* Product Image */}
                                                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={review.productImage}
                                                        alt={review.productName}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = '/images/product-1.jpeg';
                                                        }}
                                                    />
                                                </div>

                                                {/* Review Content */}
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h3 className="font-semibold text-gray-900">{review.productName}</h3>
                                                        <Badge variant="outline" className="text-xs">
                                                            {new Date(review.createdAt).toLocaleDateString()}
                                                        </Badge>
                                                    </div>

                                                    {/* Rating */}
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <div className="flex">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className="text-sm text-gray-600">({review.rating}/5)</span>
                                                    </div>

                                                    {/* Review Title */}
                                                    {review.title && (
                                                        <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
                                                    )}

                                                    {/* Review Comment */}
                                                    <p className="text-gray-700 mb-4">{review.comment}</p>

                                                    {/* Actions */}
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => router.push(`/products/${review.productId}`)}
                                                            className="border-blue-300 text-blue-600 hover:bg-blue-50"
                                                        >
                                                            <Eye className="w-3 h-3 mr-1" />
                                                            View Product
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDeleteReview(review._id)}
                                                            className="border-red-300 text-red-600 hover:bg-red-50"
                                                        >
                                                            <Trash2 className="w-3 h-3 mr-1" />
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}