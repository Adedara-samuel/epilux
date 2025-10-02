/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
// app/account/inbox/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/auth-context';
import { Loader2, Mail } from 'lucide-react';
import { Card } from '@/Components/ui/card';
import { toast } from 'sonner';

export default function MyInboxPage() {
    const { user, loading: authLoading } = useAuth();
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Mock inbox data - in a real app, this would come from an API
    const mockMessages = [
        {
            id: '1',
            subject: 'Welcome to Epilux Water!',
            message: 'Thank you for joining us. Your account has been successfully created.',
            date: new Date().toISOString(),
            read: false,
        },
        {
            id: '2',
            subject: 'Order Confirmation',
            message: 'Your order has been confirmed and is being processed.',
            date: new Date(Date.now() - 86400000).toISOString(),
            read: true,
        },
    ];

    useEffect(() => {
        if (authLoading) {
            return;
        }

        if (!user) {
            setError("Please log in to view your inbox.");
            setLoadingMessages(false);
            return;
        }

        // Simulate API call
        setTimeout(() => {
            setLoadingMessages(false);
        }, 1000);
    }, [user, authLoading]);


    if (authLoading || loadingMessages) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                <p className="ml-3 text-lg text-gray-700">Loading inbox...</p>
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
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
                <p className="text-lg text-gray-700 text-center">Please log in to view your inbox and messages.</p>
                {/* Optional: Add a login button */}
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 bg-gray-50 min-h-screen">
            <h1 className="text-4xl font-extrabold text-blue-800 mb-8 text-center">My Inbox</h1>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto text-center mb-10">
                Here you'll find all your important messages, notifications, and updates from Epilux Water.
            </p>

            <div className="max-w-4xl mx-auto space-y-4">
                {mockMessages.map((message) => (
                    <Card key={message.id} className={`p-6 ${!message.read ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}>
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h3 className={`text-lg font-semibold ${!message.read ? 'text-blue-800' : 'text-gray-800'}`}>
                                    {message.subject}
                                </h3>
                                <p className="text-gray-600 mt-2">{message.message}</p>
                                <p className="text-sm text-gray-500 mt-2">
                                    {new Date(message.date).toLocaleDateString()}
                                </p>
                            </div>
                            {!message.read && (
                                <div className="w-3 h-3 bg-blue-600 rounded-full ml-4 mt-2"></div>
                            )}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
