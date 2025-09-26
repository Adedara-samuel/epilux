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

    useEffect(() => {
        if (authLoading) {
            return;
        }

        if (!user) {
            setError("Please log in to view your inbox.");
            setLoadingMessages(false);
            return;
        }

        // Inbox functionality removed with Firebase
        setError("Inbox is currently not available.");
        setLoadingMessages(false);
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

            <div className="text-center p-10 bg-white rounded-lg shadow-md">
                <Mail className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-xl text-gray-600">Inbox is currently not available.</p>
                <p className="text-md text-gray-500 mt-2">This feature has been disabled.</p>
            </div>
        </div>
    );
}
