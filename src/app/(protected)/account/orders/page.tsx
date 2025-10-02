/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React from 'react';
import { useAuth } from '@/app/context/auth-context';
import { useMyOrders } from '@/hooks/useOrders';
import { Loader2, Package, Calendar, DollarSign } from 'lucide-react';
import { Card } from '@/Components/ui/card';
import Link from 'next/link';
import { Order, OrderItem } from '@/types/order';

export default function MyOrdersPage() {
    const { user, loading: authLoading } = useAuth();
    const { data: ordersData, isLoading: loadingOrders, error } = useMyOrders();

    if (authLoading || loadingOrders) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                <p className="ml-3 text-lg text-gray-700">Loading orders...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
                <p className="text-lg text-gray-700 text-center">Please log in to view your orders.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-red-600 text-xl">
                    {error instanceof Error ? error.message : 'Failed to load orders'}
                </p>
            </div>
        );
    }

    const orders = ordersData?.orders || [];

    return (
        <div className="container mx-auto px-4 py-12 bg-gray-50 min-h-screen">
            <h1 className="text-4xl font-extrabold text-blue-800 mb-8 text-center">My Orders</h1>

            {orders.length === 0 ? (
                <div className="text-center p-10 bg-white rounded-lg shadow-md">
                    <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-xl text-gray-600">No orders found.</p>
                    <p className="text-md text-gray-500 mt-2">Your order history will appear here.</p>
                    <Link href="/products" className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order: Order) => (
                        <Card key={order.id} className="p-6 bg-white shadow-md">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">Order #{order.id}</h3>
                                    <p className="text-sm text-gray-500">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-blue-600">₦{order.total.toLocaleString()}</p>
                                    <p className="text-sm text-gray-500 capitalize">{order.status}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {order.items.map((item: OrderItem, index: number) => (
                                    <div key={item.productId.id} className="flex items-center space-x-4 py-2 border-t border-gray-100 first:border-t-0">
                                        <img
                                            src={item.productId.image}
                                            alt={item.productId.name}
                                            className="w-12 h-12 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-800">{item.productId.name}</p>
                                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                        </div>
                                        <p className="font-semibold text-gray-700">
                                            ₦{(item.productId.price * item.quantity).toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}