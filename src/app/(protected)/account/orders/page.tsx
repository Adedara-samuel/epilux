/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/auth-context';
import { collection, query, onSnapshot, orderBy, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { Card } from '@/Components/ui/card';
import { db } from '@/lib/firebase'; // Import db directly from firebase config

interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

interface Order {
    id: string;
    items: OrderItem[];
    totalAmount: number;
    deliveryInfo: {
        fullName: string;
        address: string;
        city: string;
        state: string;
        phone: string;
        additionalInfo?: string;
    };
    paymentMethod: string;
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
    timestamp: {
        seconds: number;
        nanoseconds: number;
    };
    paystackReference?: string;
}

export default function MyOrdersPage() {
    const { user, loading: authLoading } = useAuth(); // Only get user and loading from auth context
    const [orders, setOrders] = useState<Order[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const currentUserId = user?.uid; // Get userId from the authenticated user

        if (authLoading || !db || !currentUserId) {
            if (!authLoading && (!db || !currentUserId)) {
                setError("Please log in to view your orders.");
                setLoadingOrders(false);
            }
            return;
        }

        // Determine appId based on environment
        const appId = typeof __app_id !== 'undefined' ? __app_id : process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'default-app-id';

        const ordersCollectionRef = collection(db, "artifacts", appId, "users", currentUserId, "orders");
        const q = query(ordersCollectionRef, orderBy("timestamp", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedOrders: Order[] = [];
            snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                fetchedOrders.push({
                    id: doc.id,
                    ...doc.data() as Omit<Order, 'id'>
                });
            });
            setOrders(fetchedOrders);
            setLoadingOrders(false);
        }, (err) => {
            console.error("Error fetching orders:", err);
            setError("Failed to load orders. Please try again later.");
            setLoadingOrders(false);
        });

        return () => unsubscribe();
    }, [db, user, authLoading]);

    if (authLoading || loadingOrders) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                <p className="ml-3 text-lg text-gray-700">Loading orders...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-red-600 text-xl">{error}</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-gray-700 text-xl">Please log in to view your orders.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 bg-gray-50 min-h-screen">
            <h1 className="text-4xl font-extrabold text-blue-800 mb-8 text-center">My Orders</h1>

            {orders.length === 0 ? (
                <div className="text-center p-10 bg-white rounded-lg shadow-md">
                    <p className="text-xl text-gray-600">You haven't placed any orders yet.</p>
                    <p className="text-md text-gray-500 mt-2">Start shopping now to see your order history here!</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {orders.map((order) => (
                        <Card key={order.id} className="p-6 md:p-8 rounded-xl shadow-lg border border-blue-100">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b pb-4">
                                <div>
                                    <h2 className="text-xl md:text-2xl font-bold text-blue-700">Order #{order.id.substring(0, 8).toUpperCase()}</h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Placed on: {new Date(order.timestamp.seconds * 1000).toLocaleString()}
                                    </p>
                                </div>
                                <span className={`mt-3 md:mt-0 px-4 py-1 rounded-full text-sm font-semibold ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                    order.status === 'Processing' || order.status === 'Shipped' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-gray-100 text-gray-700'
                                    }`}>
                                    Status: {order.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-800 mb-3">Items:</h3>
                                    <ul className="space-y-3">
                                        {order.items.map((item) => (
                                            <li key={item.id} className="flex items-center gap-4">
                                                {item.image && (
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-16 h-16 object-cover rounded-md shadow-sm"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64x64/CCCCCC/000000?text=Item';
                                                        }}
                                                    />
                                                )}
                                                <div>
                                                    <p className="font-medium text-gray-700">{item.name}</p>
                                                    <p className="text-sm text-gray-500">{item.quantity} x ₦{item.price.toLocaleString()}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-lg text-gray-800 mb-3">Delivery & Payment:</h3>
                                    <p className="text-gray-600 mb-2">
                                        <span className="font-medium">Recipient:</span> {order.deliveryInfo.fullName}
                                    </p>
                                    <p className="text-gray-600 mb-2">
                                        <span className="font-medium">Address:</span> {order.deliveryInfo.address}, {order.deliveryInfo.city}, {order.deliveryInfo.state}
                                    </p>
                                    <p className="text-gray-600 mb-2">
                                        <span className="font-medium">Phone:</span> {order.deliveryInfo.phone}
                                    </p>
                                    {order.deliveryInfo.additionalInfo && (
                                        <p className="text-gray-600 mb-2">
                                            <span className="font-medium">Notes:</span> {order.deliveryInfo.additionalInfo}
                                        </p>
                                    )}
                                    <p className="text-gray-600">
                                        <span className="font-medium">Payment Method:</span> {order.paymentMethod}
                                    </p>
                                    {order.paystackReference && (
                                        <p className="text-gray-600 text-sm">
                                            <span className="font-medium">Paystack Ref:</span> {order.paystackReference}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="border-t pt-4 flex justify-between items-center">
                                <span className="text-lg font-bold text-gray-800">Total: ₦{order.totalAmount.toLocaleString()}</span>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}