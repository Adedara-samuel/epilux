/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMyOrders, useConfirmOrderReceipt, useRateProduct, useRateMarketer } from '@/hooks/useOrders';
import { Loader2, Package, Calendar, DollarSign, ArrowLeft, ShoppingBag, Eye, Truck, CheckCircle, Star, User, MessageSquare } from 'lucide-react';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';
import Link from 'next/link';
import { Order, OrderItem } from '@/types/order';

export default function MyOrdersPage() {
    const router = useRouter();
    const { data: ordersData, isLoading: loadingOrders, error } = useMyOrders();
    const [activeTab, setActiveTab] = useState<'orders' | 'track'>('orders');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [ratingModal, setRatingModal] = useState<{ type: 'product' | 'marketer', orderId: string, productId?: string } | null>(null);
    const [rating, setRating] = useState(5);
    const [review, setReview] = useState('');

    const confirmReceiptMutation = useConfirmOrderReceipt();
    const rateProductMutation = useRateProduct();
    const rateMarketerMutation = useRateMarketer();

    // Add global animations
    useEffect(() => {
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            @keyframes bounceIn { from { transform: scale(0.3); opacity: 0; } to { transform: scale(1); opacity: 1; } }

            .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
            .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
            .animate-slideUp { animation: slideUp 0.4s ease-out; }
            .animate-bounceIn { animation: bounceIn 0.6s ease-out; }

            * { cursor: default; }
            button, a, input, textarea, select { cursor: pointer; }

            .scroll-smooth { scroll-behavior: smooth; }
            .transition-all { transition: all 0.3s ease; }
            .hover-lift { transition: transform 0.2s ease; }
            .hover-lift:hover { transform: translateY(-2px); }
        `;
        document.head.appendChild(styleSheet);

        // Add smooth scrolling to body
        document.body.classList.add('scroll-smooth');

        return () => {
            document.head.removeChild(styleSheet);
            document.body.classList.remove('scroll-smooth');
        };
    }, []);

    // The loading check now only depends on loadingOrders
    if (loadingOrders) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-lg text-gray-700">Loading your orders...</p>
                </div>
            </div>
        );
    }

    // Removed the !user redirection check:
    // if (!user) {
    //     router.push('/login');
    //     return null;
    // }

    // If an error occurs (which might include a 401/403 unauthenticated error from the API),
    // it will be displayed. You might want to enhance this to redirect on a specific 401 error.
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-red-600 text-xl">
                    {/* The error message will now show for authentication failures too, if the hook returns an error */}
                    {error instanceof Error ? error.message : 'Failed to load orders. You may need to log in.'}
                </p>
            </div>
        );
    }

    const orders = ordersData?.orders || [];

    const handleConfirmReceipt = (orderId: string) => {
        confirmReceiptMutation.mutate(orderId);
    };

    const handleRateProduct = (orderId: string, productId: string) => {
        setRatingModal({ type: 'product', orderId, productId });
        setRating(5);
        setReview('');
    };

    const handleRateMarketer = (orderId: string) => {
        setRatingModal({ type: 'marketer', orderId });
        setRating(5);
        setReview('');
    };

    // Mock data for presentation - will be replaced with real data when available
    const mockTrackableOrders: Order[] = [
        {
            id: 'ORD-001',
            createdAt: '2024-10-20T10:30:00Z',
            total: 25000,
            status: 'delivered',
            deliveryConfirmed: true,
            deliveryConfirmedAt: '2024-10-22T14:20:00Z',
            marketerId: 'marketer-123',
            items: [
                {
                    productId: {
                        id: 'prod-1',
                        _id: 'prod-1',
                        name: 'Premium Bottled Water (1.5L)',
                        image: '/images/bottled-water.jpg',
                        price: 500,
                        description: 'Pure, refreshing bottled water',
                        category: 'bottled',
                        stock: 100,
                        affiliateCommission: 25
                    },
                    quantity: 2
                },
                {
                    productId: {
                        id: 'prod-2',
                        _id: 'prod-2',
                        name: 'Sachet Water Pack (20pcs)',
                        image: '/images/sachet-water.jpg',
                        price: 2000,
                        description: 'Convenient sachet water pack',
                        category: 'sachet',
                        stock: 50,
                        affiliateCommission: 100
                    },
                    quantity: 1
                }
            ],
            productRatings: [
                {
                    productId: 'prod-1',
                    rating: 5,
                    review: 'Excellent quality water, very refreshing!',
                    createdAt: '2024-10-22T15:00:00Z'
                }
            ],
            marketerRating: {
                rating: 4,
                review: 'Great delivery service, arrived on time',
                createdAt: '2024-10-22T15:30:00Z'
            }
        },
        {
            id: 'ORD-002',
            createdAt: '2024-10-18T09:15:00Z',
            total: 15000,
            status: 'shipped',
            deliveryConfirmed: false,
            marketerId: 'marketer-456',
            items: [
                {
                    productId: {
                        id: 'prod-3',
                        _id: 'prod-3',
                        name: 'Water Dispenser (Hot & Cold)',
                        image: '/images/dispenser.jpg',
                        price: 15000,
                        description: 'Professional water dispenser',
                        category: 'dispenser',
                        stock: 25,
                        affiliateCommission: 750
                    },
                    quantity: 1
                }
            ],
            productRatings: [],
            marketerRating: undefined
        },
        {
            id: 'ORD-003',
            createdAt: '2024-10-15T16:45:00Z',
            total: 8500,
            status: 'delivered',
            deliveryConfirmed: false,
            marketerId: 'marketer-789',
            items: [
                {
                    productId: {
                        id: 'prod-4',
                        _id: 'prod-4',
                        name: 'Bulk Water Bottles (19L x 2)',
                        image: '/images/bulk-water.jpg',
                        price: 4200,
                        description: 'Large refillable bottles',
                        category: 'bulk',
                        stock: 40,
                        affiliateCommission: 210
                    },
                    quantity: 2
                }
            ],
            productRatings: [],
            marketerRating: undefined
        }
    ];

    const trackableOrders = orders.length > 0 ? orders.filter((order: Order) => order.status.toLowerCase() === 'delivered' || order.status.toLowerCase() === 'shipped') : mockTrackableOrders;

    const submitRating = () => {
        if (!ratingModal) return;

        if (ratingModal.type === 'product') {
            rateProductMutation.mutate({
                orderId: ratingModal.orderId,
                productId: ratingModal.productId!,
                rating,
                review
            });
        } else {
            rateMarketerMutation.mutate({
                orderId: ratingModal.orderId,
                rating,
                review
            });
        }

        setRatingModal(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
            {/* Rating Modal */}
            {ratingModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md animate-scaleIn">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                Rate {ratingModal?.type === 'product' ? 'Product' : 'Marketer'}
                            </h3>
                            <Button variant="ghost" size="sm" onClick={() => setRatingModal(null)} className="cursor-pointer">
                                ×
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium">Rating</Label>
                                <div className="flex gap-1 mt-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setRating(star)}
                                            className="focus:outline-none cursor-pointer transition-transform hover:scale-110"
                                        >
                                            <Star
                                                className={`w-8 h-8 transition-colors ${
                                                    star <= rating
                                                        ? 'text-yellow-400 fill-current'
                                                        : 'text-gray-300 hover:text-yellow-300'
                                                }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="review" className="text-sm font-medium">Review (Optional)</Label>
                                <textarea
                                    id="review"
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                    placeholder="Share your experience..."
                                    className="w-full mt-1 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    rows={3}
                                />
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    onClick={() => setRatingModal(null)}
                                    variant="outline"
                                    className="flex-1 cursor-pointer hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={submitRating}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 cursor-pointer transition-all hover:scale-105"
                                    disabled={rateProductMutation.isPending || rateMarketerMutation.isPending}
                                >
                                    {rateProductMutation.isPending || rateMarketerMutation.isPending ? 'Submitting...' : 'Submit Rating'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 py-12 max-w-7xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 animate-slideUp">
                    <Button
                        variant="outline"
                        onClick={() => router.push('/account')}
                        className="flex items-center gap-2 cursor-pointer hover-lift transition-all"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Account
                    </Button>
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 animate-bounceIn">
                            My Orders
                        </h1>
                        <p className="text-gray-600 mt-2 animate-fadeIn animation-delay-300">Track your purchase history</p>
                    </div>
                    <div></div> {/* Spacer for centering */}
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mb-8 bg-gray-100 p-1 rounded-lg w-fit mx-auto animate-fadeIn animation-delay-500">
                    <Button
                        variant={activeTab === 'orders' ? 'default' : 'ghost'}
                        onClick={() => setActiveTab('orders')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-md transition-all cursor-pointer hover-lift ${
                            activeTab === 'orders'
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-gray-600 hover:bg-white'
                        }`}
                    >
                        <Package className="w-4 h-4" />
                        My Orders
                    </Button>
                    <Button
                        variant={activeTab === 'track' ? 'default' : 'ghost'}
                        onClick={() => setActiveTab('track')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-md transition-all cursor-pointer hover-lift ${
                            activeTab === 'track'
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-gray-600 hover:bg-white'
                        }`}
                    >
                        <Truck className="w-4 h-4" />
                        Track Orders
                    </Button>
                </div>

                {/* Stats Overview - Only show on orders tab */}
                {activeTab === 'orders' && orders.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 animate-fadeIn animation-delay-700">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center hover-lift cursor-pointer">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
                                <ShoppingBag className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 animate-countUp">{orders.length}</h3>
                            <p className="text-gray-600">Total Orders</p>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center hover-lift cursor-pointer">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4 animate-bounce">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 animate-countUp">
                                ₦{orders.reduce((sum: number, order: Order) => sum + order.total, 0).toLocaleString()}
                            </h3>
                            <p className="text-gray-600">Total Spent</p>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center hover-lift cursor-pointer">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
                                <Truck className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 animate-countUp">
                                {orders.filter((order: Order) => order.status.toLowerCase() === 'delivered').length}
                            </h3>
                            <p className="text-gray-600">Delivered Orders</p>
                        </div>
                    </div>
                )}

                {/* Content based on active tab */}
                {activeTab === 'orders' ? (
                    /* Orders List */
                    orders.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                                <Package className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">No orders yet</h3>
                            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                Your order history will appear here once you make your first purchase.
                            </p>
                            <Button
                                onClick={() => router.push('/products')}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-colors cursor-pointer"
                            >
                                Start Shopping
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order: Order, index: number) => (
                                <Card key={order.id} className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 hover-lift cursor-pointer animate-fadeIn`} style={{ animationDelay: `${index * 100}ms` }}>
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900">Order #{order.id}</h3>
                                                <p className="text-gray-600 flex items-center gap-2 mt-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-gray-900 mb-1">
                                                    ₦{order.total.toLocaleString()}
                                                </div>
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                                    order.status.toLowerCase() === 'delivered'
                                                        ? 'bg-green-100 text-green-800'
                                                        : order.status.toLowerCase() === 'processing'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {order.items.map((item: OrderItem, index: number) => (
                                                <div key={item.productId.id} className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-xl">
                                                    <img
                                                        src={item.productId.image}
                                                        alt={item.productId.name}
                                                        className="w-16 h-16 object-cover rounded-lg"
                                                    />
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-gray-800">{item.productId.name}</h4>
                                                        <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-gray-800">
                                                            ₦{(item.productId.price * item.quantity).toLocaleString()}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            ₦{item.productId.price.toLocaleString()} each
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                                            <div className="flex gap-3">
                                                <Button variant="outline" size="sm" className="flex items-center gap-2 cursor-pointer">
                                                    <Eye className="w-4 h-4" />
                                                    View Details
                                                </Button>
                                                <Button variant="outline" size="sm" className="cursor-pointer">
                                                    Track Order
                                                </Button>
                                            </div>
                                            {order.status.toLowerCase() === 'delivered' && (
                                                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white cursor-pointer">
                                                    Buy Again
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )
                ) : (
                    /* Track Orders Tab */
                    trackableOrders.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                                <Truck className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">No orders to track</h3>
                            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                Orders that are shipped or delivered will appear here for tracking and confirmation.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {trackableOrders.map((order: Order, index: number) => (
                                <Card key={order.id} className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 hover-lift cursor-pointer animate-fadeIn`} style={{ animationDelay: `${index * 150}ms` }}>
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900">Order #{order.id}</h3>
                                                <p className="text-gray-600 flex items-center gap-2 mt-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                                {order.marketerId && (
                                                    <p className="text-gray-600 flex items-center gap-2 mt-1">
                                                        <User className="w-4 h-4" />
                                                        Delivered by: Marketer #{order.marketerId}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-gray-900 mb-1">
                                                    ₦{order.total.toLocaleString()}
                                                </div>
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                                    order.status.toLowerCase() === 'delivered'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                                {order.deliveryConfirmed && (
                                                    <div className="flex items-center gap-1 mt-2 text-green-600">
                                                        <CheckCircle className="w-4 h-4" />
                                                        <span className="text-sm font-medium">Receipt Confirmed</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {order.items.map((item: OrderItem, index: number) => {
                                                const productRating = order.productRatings?.find(r => r.productId === item.productId.id);
                                                return (
                                                    <div key={item.productId.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gray-50/50 rounded-xl">
                                                        <img
                                                            src={item.productId.image}
                                                            alt={item.productId.name}
                                                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-semibold text-gray-800 truncate">{item.productId.name}</h4>
                                                            <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                                                            {productRating && (
                                                                <div className="flex items-center gap-1 mt-1">
                                                                    <div className="flex">
                                                                        {[...Array(5)].map((_, i) => (
                                                                            <Star
                                                                                key={i}
                                                                                className={`w-3 h-3 ${i < productRating.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                    <span className="text-xs text-gray-600 ml-1">Rated</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="text-right flex flex-col gap-2 flex-shrink-0">
                                                            <div>
                                                                <p className="font-bold text-gray-800 text-sm sm:text-base">
                                                                    ₦{(item.productId.price * item.quantity).toLocaleString()}
                                                                </p>
                                                                <p className="text-xs sm:text-sm text-gray-600">
                                                                    ₦{item.productId.price.toLocaleString()} each
                                                                </p>
                                                            </div>
                                                            {order.deliveryConfirmed && !productRating && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => handleRateProduct(order.id, item.productId.id || item.productId._id || '')}
                                                                    className="text-xs cursor-pointer hover-lift transition-all"
                                                                >
                                                                    <Star className="w-3 h-3 mr-1" />
                                                                    Rate Product
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-6 pt-6 border-t border-gray-100 gap-4">
                                            <div className="flex flex-wrap gap-2 sm:gap-3">
                                                {order.status.toLowerCase() === 'delivered' && !order.deliveryConfirmed && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleConfirmReceipt(order.id)}
                                                        className="bg-green-600 hover:bg-green-700 text-white cursor-pointer hover-lift transition-all"
                                                        disabled={confirmReceiptMutation.isPending}
                                                    >
                                                        <CheckCircle className="w-4 h-4 mr-1" />
                                                        <span className="hidden sm:inline">{confirmReceiptMutation.isPending ? 'Confirming...' : 'Confirm Receipt'}</span>
                                                        <span className="sm:hidden">Confirm</span>
                                                    </Button>
                                                )}
                                                {order.deliveryConfirmed && order.marketerId && !order.marketerRating?.rating && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleRateMarketer(order.id)}
                                                        className="flex items-center gap-2 cursor-pointer hover-lift transition-all"
                                                    >
                                                        <User className="w-4 h-4" />
                                                        <span className="hidden sm:inline">Rate Marketer</span>
                                                        <span className="sm:hidden">Rate</span>
                                                    </Button>
                                                )}
                                                {order.marketerRating?.rating && (
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <User className="w-4 h-4" />
                                                        <div className="flex">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`w-3 h-3 ${i < order.marketerRating!.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className="hidden sm:inline">Marketer Rated</span>
                                                        <span className="sm:hidden">Rated</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}