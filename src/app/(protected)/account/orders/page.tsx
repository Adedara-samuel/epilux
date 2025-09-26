'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/auth-context';
import { Loader2 } from 'lucide-react';


export default function MyOrdersPage() {
    const { user, loading: authLoading } = useAuth();
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (authLoading) {
            return;
        }

        if (!user) {
            setError("Please log in to view your orders.");
            setLoadingOrders(false);
            return;
        }

        // Orders functionality removed with Firebase
        setError("Orders are currently not available.");
        setLoadingOrders(false);
    }, [user, authLoading]);

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

            <div className="text-center p-10 bg-white rounded-lg shadow-md">
                <p className="text-xl text-gray-600">Orders are currently not available.</p>
                <p className="text-md text-gray-500 mt-2">This feature has been disabled.</p>
            </div>
        </div>
    );
}