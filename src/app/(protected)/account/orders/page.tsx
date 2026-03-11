'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    useMyOrders,
    useConfirmOrderReceipt,
    useRateProduct,
    useRateMarketer,
    useCancelOrder,
} from '@/hooks/useOrders';
import {
    Loader2,
    Package,
    Calendar,
    DollarSign,
    ArrowLeft,
    ShoppingBag,
    Eye,
    Truck,
    CheckCircle,
    Star,
    MapPin,
    CreditCard,
    X,
} from 'lucide-react';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';
import { toast } from 'sonner';

export default function MyOrdersPage() {
    const router = useRouter();
    const { data: ordersData, isLoading: loadingOrders, error } = useMyOrders();

    const [activeTab, setActiveTab] = useState<'orders' | 'track'>('orders');
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [showOrderModal, setShowOrderModal] = useState(false);

    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [pendingCancelOrderId, setPendingCancelOrderId] = useState<string | null>(null);

    const [ratingModal, setRatingModal] = useState<{
        type: 'product' | 'marketer';
        orderId: string;
        productId?: string;
    } | null>(null);
    const [rating, setRating] = useState(5);
    const [review, setReview] = useState('');

    const confirmReceiptMutation = useConfirmOrderReceipt();
    const rateProductMutation = useRateProduct();
    const rateMarketerMutation = useRateMarketer();
    const cancelOrderMutation = useCancelOrder();

    // Toast feedback
    useEffect(() => {
        if (confirmReceiptMutation.isSuccess) {
            toast.success('Receipt confirmed successfully');
            setShowOrderModal(false);
            confirmReceiptMutation.reset();
        }
        if (confirmReceiptMutation.isError) {
            toast.error('Failed to confirm receipt');
            confirmReceiptMutation.reset();
        }

        if (cancelOrderMutation.isSuccess) {
            toast.success('Order cancelled successfully');
            setShowCancelDialog(false);
            setPendingCancelOrderId(null);
            cancelOrderMutation.reset();
        }
        if (cancelOrderMutation.isError) {
            toast.error('Failed to cancel order');
            cancelOrderMutation.reset();
        }

        if (rateProductMutation.isSuccess || rateMarketerMutation.isSuccess) {
            toast.success('Rating submitted successfully');
            setRatingModal(null);
            setRating(5);
            setReview('');
            rateProductMutation.reset();
            rateMarketerMutation.reset();
        }
        if (rateProductMutation.isError || rateMarketerMutation.isError) {
            toast.error('Failed to submit rating');
            rateProductMutation.reset();
            rateMarketerMutation.reset();
        }
    }, [
        confirmReceiptMutation.isSuccess,
        confirmReceiptMutation.isError,
        cancelOrderMutation.isSuccess,
        cancelOrderMutation.isError,
        rateProductMutation.isSuccess,
        rateProductMutation.isError,
        rateMarketerMutation.isSuccess,
        rateMarketerMutation.isError,
    ]);

    const openOrderDetails = (order: any) => {
        setSelectedOrder(order);
        setShowOrderModal(true);
    };

    const closeOrderDetails = () => {
        setShowOrderModal(false);
        setTimeout(() => setSelectedOrder(null), 300);
    };

    const requestCancelOrder = (orderId: string) => {
        setPendingCancelOrderId(orderId);
        setShowCancelDialog(true);
    };

    const confirmCancel = () => {
        if (pendingCancelOrderId) {
            cancelOrderMutation.mutate(pendingCancelOrderId);
        }
    };

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

    const submitRating = () => {
        if (!ratingModal) return;

        if (ratingModal.type === 'product') {
            rateProductMutation.mutate({
                orderId: ratingModal.orderId,
                productId: ratingModal.productId!,
                rating,
                review,
            });
        } else {
            rateMarketerMutation.mutate({
                orderId: ratingModal.orderId,
                rating,
                review,
            });
        }
    };

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

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-red-600 text-xl">
                    {error instanceof Error ? error.message : 'Failed to load orders. Please log in.'}
                </p>
            </div>
        );
    }

    const orders = ordersData?.data || [];

    const trackableOrders = orders.filter(
        (order: any) =>
            order.status?.toLowerCase() === 'delivered' ||
            order.status?.toLowerCase() === 'shipped'
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-20 md:pb-0 relative">
            {/* Order Details Modal */}
            <Dialog open={showOrderModal} onOpenChange={setShowOrderModal}>
                <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto p-0 gap-0 rounded-2xl">
                    {selectedOrder && (
                        <>
                            <DialogHeader className="sticky top-0 bg-white z-10 border-b px-6 py-5 flex flex-row items-center justify-between">
                                <DialogTitle className="text-xl font-bold">
                                    Order #{selectedOrder.orderNumber}
                                </DialogTitle>
                                <button
                                    onClick={closeOrderDetails}
                                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <X className="h-6 w-6 text-gray-600" />
                                </button>
                            </DialogHeader>

                            <div className="p-6 space-y-6">
                                {/* Status & Date */}
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-gray-500">Placed on</p>
                                        <p className="font-medium">
                                            {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                    <span
                                        className={`px-4 py-1.5 rounded-full text-sm font-medium ${selectedOrder.status?.toLowerCase() === 'delivered'
                                                ? 'bg-green-100 text-green-800'
                                                : selectedOrder.status?.toLowerCase() === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}
                                    >
                                        {selectedOrder.status?.charAt(0).toUpperCase() + selectedOrder.status?.slice(1)}
                                    </span>
                                </div>

                                {/* Shipping Address */}
                                {selectedOrder.shippingAddress && (
                                    <div className="bg-gray-50 p-4 rounded-xl">
                                        <div className="flex items-start gap-3">
                                            <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                                            <div>
                                                <p className="font-medium text-gray-800">Delivery Address</p>
                                                <p className="text-gray-600 mt-1">
                                                    {selectedOrder.shippingAddress.address}
                                                    <br />
                                                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}
                                                    <br />
                                                    {selectedOrder.shippingAddress.country}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Items */}
                                <div>
                                    <h3 className="font-semibold text-lg mb-3">Items</h3>
                                    <div className="space-y-4">
                                        {selectedOrder.items.map((item: any, idx: number) => (
                                            <div
                                                key={idx}
                                                className="flex gap-4 bg-gray-50/70 p-4 rounded-xl"
                                            >
                                                <img
                                                    src={item.product.image || '/placeholder-product.jpg'}
                                                    alt={item.product.name}
                                                    className="w-20 h-20 object-cover rounded-lg border"
                                                />
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900">{item.product.name}</p>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        Qty: {item.quantity} × ₦{item.product.price.toLocaleString()}
                                                    </p>
                                                </div>
                                                <p className="font-bold text-gray-900 whitespace-nowrap">
                                                    ₦{(item.product.price * item.quantity).toLocaleString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Totals */}
                                <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>₦{selectedOrder.totalAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg pt-3 border-t">
                                        <span>Total</span>
                                        <span>₦{selectedOrder.totalAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                                        <CreditCard className="h-4 w-4" />
                                        <span>Paid via {selectedOrder.paymentMethod}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-wrap gap-3 pt-4">
                                    {selectedOrder.status?.toLowerCase() === 'pending' && (
                                        <Button
                                            variant="destructive"
                                            className="flex-1"
                                            onClick={() => requestCancelOrder(selectedOrder.orderId)}
                                            disabled={cancelOrderMutation.isPending}
                                        >
                                            {cancelOrderMutation.isPending ? 'Cancelling...' : 'Cancel Order'}
                                        </Button>
                                    )}

                                    {selectedOrder.status?.toLowerCase() === 'delivered' && (
                                        <Button
                                            className="flex-1 bg-green-600 hover:bg-green-700"
                                            onClick={() => handleConfirmReceipt(selectedOrder.orderId)}
                                            disabled={confirmReceiptMutation.isPending}
                                        >
                                            {confirmReceiptMutation.isPending ? 'Confirming...' : 'Confirm Receipt'}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Cancel Confirmation Dialog */}
            <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Cancel Order</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to cancel this order? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-3 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => setShowCancelDialog(false)}
                            className="flex-1 sm:flex-none"
                        >
                            No, keep order
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmCancel}
                            disabled={cancelOrderMutation.isPending}
                            className="flex-1 sm:flex-none"
                        >
                            {cancelOrderMutation.isPending ? 'Cancelling...' : 'Yes, cancel order'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Rating Modal */}
            {ratingModal && (
                <Dialog open={!!ratingModal} onOpenChange={() => setRatingModal(null)}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>
                                Rate {ratingModal.type === 'product' ? 'Product' : 'Marketer'}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6 py-4">
                            <div>
                                <Label className="text-sm font-medium">Rating</Label>
                                <div className="flex gap-1 mt-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setRating(star)}
                                            className="focus:outline-none transition-transform hover:scale-110"
                                        >
                                            <Star
                                                className={`w-8 h-8 ${star <= rating
                                                        ? 'text-yellow-400 fill-yellow-400'
                                                        : 'text-gray-300 hover:text-yellow-300'
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="review" className="text-sm font-medium">
                                    Review (Optional)
                                </Label>
                                <textarea
                                    id="review"
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                    placeholder="Share your experience..."
                                    className="w-full mt-1 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows={3}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setRatingModal(null)}>
                                Cancel
                            </Button>
                            <Button
                                onClick={submitRating}
                                disabled={rateProductMutation.isPending || rateMarketerMutation.isPending}
                            >
                                {rateProductMutation.isPending || rateMarketerMutation.isPending
                                    ? 'Submitting...'
                                    : 'Submit Rating'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12 max-w-7xl">
                <div className="flex items-center justify-between mb-8">
                    <Button
                        variant="outline"
                        onClick={() => router.push('/account')}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Account
                    </Button>
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900">My Orders</h1>
                        <p className="text-gray-600 mt-2">Track your purchase history</p>
                    </div>
                    <div />
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mb-8 bg-gray-100 p-1 rounded-lg w-fit mx-auto">
                    <Button
                        variant={activeTab === 'orders' ? 'default' : 'ghost'}
                        onClick={() => setActiveTab('orders')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-md ${activeTab === 'orders'
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
                        className={`flex items-center gap-2 px-6 py-2 rounded-md ${activeTab === 'track'
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-gray-600 hover:bg-white'
                            }`}
                    >
                        <Truck className="w-4 h-4" />
                        Track Orders
                    </Button>
                </div>

                {/* Stats */}
                {activeTab === 'orders' && orders.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <Card className="p-6 text-center">
                            <ShoppingBag className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold">{orders.length}</h3>
                            <p className="text-gray-600">Total Orders</p>
                        </Card>
                        <Card className="p-6 text-center">
                            <DollarSign className="w-12 h-12 text-green-600 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold">
                                ₦
                                {orders
                                    .reduce((sum: number, order: any) => sum + order.totalAmount, 0)
                                    .toLocaleString()}
                            </h3>
                            <p className="text-gray-600">Total Spent</p>
                        </Card>
                        <Card className="p-6 text-center">
                            <Truck className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold">
                                {orders.filter((o: any) => o.status?.toLowerCase() === 'delivered').length}
                            </h3>
                            <p className="text-gray-600">Delivered Orders</p>
                        </Card>
                    </div>
                )}

                {/* Main content */}
                {activeTab === 'orders' ? (
                    orders.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-12 text-center">
                            <Package className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                            <h3 className="text-2xl font-bold mb-3">No orders yet</h3>
                            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                Your order history will appear here once you make your first purchase.
                            </p>
                            <Button onClick={() => router.push('/products')} className="bg-blue-600">
                                Start Shopping
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order: any) => (
                                <Card key={order.orderId} className="overflow-hidden">
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h3 className="text-xl font-bold">Order #{order.orderNumber}</h3>
                                                <p className="text-gray-600 mt-1 flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold mb-1">
                                                    ₦{order.totalAmount.toLocaleString()}
                                                </div>
                                                <span
                                                    className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${order.status?.toLowerCase() === 'delivered'
                                                            ? 'bg-green-100 text-green-800'
                                                            : order.status?.toLowerCase() === 'processing'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-gray-100 text-gray-800'
                                                        }`}
                                                >
                                                    {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {order.items.map((item: any, idx: number) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                                                >
                                                    <img
                                                        src={item.product.image || '/placeholder-product.jpg'}
                                                        alt={item.product.name}
                                                        className="w-16 h-16 object-cover rounded-lg"
                                                    />
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold">{item.product.name}</h4>
                                                        <p className="text-sm text-gray-600">
                                                            Quantity: {item.quantity}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold">
                                                            ₦{(item.product.price * item.quantity).toLocaleString()}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            ₦{item.product.price.toLocaleString()} each
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t">
                                            <Button variant="outline" onClick={() => openOrderDetails(order)}>
                                                <Eye className="w-4 h-4 mr-2" />
                                                View Details
                                            </Button>

                                            {order.status?.toLowerCase() === 'pending' && (
                                                <Button
                                                    variant="destructive"
                                                    onClick={() => requestCancelOrder(order.orderId)}
                                                >
                                                    Cancel Order
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )
                ) : trackableOrders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <Truck className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold mb-3">No orders to track</h3>
                        <p className="text-gray-600 max-w-md mx-auto">
                            Orders that are shipped or delivered will appear here for tracking and confirmation.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {trackableOrders.map((order: any) => (
                            <Card key={order.orderId} className="overflow-hidden">
                                <div className="p-6">
                                    <div className="flex justify-between mb-6">
                                        <div>
                                            <h3 className="text-xl font-bold">Order #{order.orderNumber}</h3>
                                            <p className="text-gray-600 mt-1 flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold mb-1">
                                                ₦{order.totalAmount.toLocaleString()}
                                            </div>
                                            <span
                                                className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${order.status?.toLowerCase() === 'delivered'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-blue-100 text-blue-800'
                                                    }`}
                                            >
                                                {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {order.items.map((item: any, idx: number) => (
                                            <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                                <img
                                                    src={item.product.image || '/placeholder-product.jpg'}
                                                    alt={item.product.name}
                                                    className="w-16 h-16 object-cover rounded-lg"
                                                />
                                                <div className="flex-1">
                                                    <h4 className="font-semibold">{item.product.name}</h4>
                                                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold">
                                                        ₦{(item.product.price * item.quantity).toLocaleString()}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        ₦{item.product.price.toLocaleString()} each
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {order.status?.toLowerCase() === 'delivered' && (
                                        <div className="mt-6 pt-6 border-t">
                                            <Button
                                                className="bg-green-600 hover:bg-green-700"
                                                onClick={() => handleConfirmReceipt(order.orderId)}
                                                disabled={confirmReceiptMutation.isPending}
                                            >
                                                {confirmReceiptMutation.isPending ? 'Confirming...' : 'Confirm Receipt'}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}