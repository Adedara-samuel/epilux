/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useMyOrders } from '@/hooks/useOrders';
import { Loader2, Package, Calendar, DollarSign, ArrowLeft, ShoppingBag, Eye, Truck } from 'lucide-react';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import Link from 'next/link';
import { Order, OrderItem } from '@/types/order';

export default function MyOrdersPage() {
    const router = useRouter();
    const { data: ordersData, isLoading: loadingOrders, error } = useMyOrders();

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

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-12">
                {/* Header */}
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
                        <h1 className="text-4xl font-bold text-gray-900">
                            My Orders
                        </h1>
                        <p className="text-gray-600 mt-2">Track your purchase history</p>
                    </div>
                    <div></div> {/* Spacer for centering */}
                </div>

                {/* Stats Overview */}
                {orders.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <ShoppingBag className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">{orders.length}</h3>
                            <p className="text-gray-600">Total Orders</p>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">
                                ₦{orders.reduce((sum: number, order: Order) => sum + order.total, 0).toLocaleString()}
                            </h3>
                            <p className="text-gray-600">Total Spent</p>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Truck className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">
                                {orders.filter((order: Order) => order.status.toLowerCase() === 'delivered').length}
                            </h3>
                            <p className="text-gray-600">Delivered Orders</p>
                        </div>
                    </div>
                )}

                {/* Orders List */}
                {orders.length === 0 ? (
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
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-colors"
                        >
                            Start Shopping
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order: Order) => (
                            <Card key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300">
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
                                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                                                <Eye className="w-4 h-4" />
                                                View Details
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                Track Order
                                            </Button>
                                        </div>
                                        {order.status.toLowerCase() === 'delivered' && (
                                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                                                Buy Again
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}