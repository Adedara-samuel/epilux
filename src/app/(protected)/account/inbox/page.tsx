/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
// app/account/inbox/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/auth-context';
import { collection, query, onSnapshot, orderBy, updateDoc, doc, serverTimestamp, addDoc, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Import db directly
import { Loader2, Mail, CheckCircle, CircleDot } from 'lucide-react';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';

interface InboxMessage {
    id: string;
    senderId: string;
    subject: string;
    message: string;
    timestamp: {
        seconds: number;
        nanoseconds: number;
    };
    read: boolean;
}

export default function MyInboxPage() {
    const { user, loading: authLoading } = useAuth();
    const [messages, setMessages] = useState<InboxMessage[]>([]);
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const currentUserId = user?.uid;

        if (authLoading || !db || !currentUserId) {
            if (!authLoading && (!db || !currentUserId)) {
                setError("Please log in to view your inbox.");
                setLoadingMessages(false);
            }
            return;
        }

        const appId = typeof __app_id !== 'undefined' ? __app_id : process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'default-app-id';
        const inboxCollectionRef = collection(db, "artifacts", appId, "users", currentUserId, "inboxMessages");
        const q = query(inboxCollectionRef, orderBy("timestamp", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedMessages: InboxMessage[] = [];
            snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                fetchedMessages.push({
                    id: doc.id,
                    ...doc.data() as Omit<InboxMessage, 'id'>
                });
            });
            setMessages(fetchedMessages);
            setLoadingMessages(false);
        }, (err) => {
            console.error("Error fetching inbox messages:", err);
            setError("Failed to load messages. Please try again later.");
            setLoadingMessages(false);
        });

        return () => unsubscribe();
    }, [db, user, authLoading]);

    const handleMarkAsRead = async (messageId: string, currentReadStatus: boolean) => {
        if (!db || !user?.uid) {
            toast.error("Authentication required to update message status.");
            return;
        }
        const appId = typeof __app_id !== 'undefined' ? __app_id : process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'default-app-id';
        const messageRef = doc(db, "artifacts", appId, "users", user.uid, "inboxMessages", messageId);
        try {
            await updateDoc(messageRef, { read: !currentReadStatus });
            toast.success(`Message marked as ${!currentReadStatus ? 'read' : 'unread'}.`);
        } catch (error) {
            console.error("Error updating message status:", error);
            toast.error("Failed to update message status.");
        }
    };

    // Optional: Function to simulate sending a system message (for testing)
    // You would typically send these from a backend or admin panel
    const sendTestMessage = async () => {
        if (!db || !user?.uid) {
            toast.error("Login to send test message.");
            return;
        }
        const appId = typeof __app_id !== 'undefined' ? __app_id : process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'default-app-id';
        try {
            await addDoc(collection(db, "artifacts", appId, "users", user.uid, "inboxMessages"), {
                senderId: "system",
                subject: `Welcome to Epilux! (${new Date().toLocaleTimeString()})`,
                message: "Thank you for joining Epilux Water. We're excited to have you! Explore our products and services.",
                timestamp: serverTimestamp(),
                read: false,
            });
            toast.success("Test message sent!");
        } catch (error) {
            console.error("Error sending test message:", error);
            toast.error("Failed to send test message.");
        }
    };


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

            {/* Optional: Button to send a test message for demonstration */}
            {/* <div className="text-center mb-6">
                <Button onClick={sendTestMessage} className="bg-blue-500 hover:bg-blue-600">
                    Send Test Message (For Dev)
                </Button>
            </div> */}

            {messages.length === 0 ? (
                <div className="text-center p-10 bg-white rounded-lg shadow-md">
                    <Mail className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-xl text-gray-600">Your inbox is empty!</p>
                    <p className="text-md text-gray-500 mt-2">No new messages or notifications at the moment.</p>
                </div>
            ) : (
                <div className="space-y-6 max-w-4xl mx-auto">
                    {messages.map((message) => (
                        <Card key={message.id} className={`p-6 rounded-xl shadow-md transition-all duration-200 ${
                            message.read ? 'bg-gray-100 border-gray-200' : 'bg-white border-blue-100 shadow-lg'
                        }`}>
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    {message.read ? (
                                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                                    ) : (
                                        <CircleDot className="h-5 w-5 text-blue-500 flex-shrink-0" />
                                    )}
                                    <h2 className={`text-lg font-semibold ${message.read ? 'text-gray-600' : 'text-gray-800'}`}>
                                        {message.subject}
                                    </h2>
                                </div>
                                <span className="text-sm text-gray-500 flex-shrink-0 ml-4">
                                    {new Date(message.timestamp.seconds * 1000).toLocaleString()}
                                </span>
                            </div>
                            <p className={`text-gray-700 mb-4 ${message.read ? 'text-gray-500' : ''}`}>
                                {message.message}
                            </p>
                            <div className="text-right">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleMarkAsRead(message.id, message.read)}
                                    className="text-blue-600 hover:bg-blue-50"
                                >
                                    {message.read ? 'Mark as Unread' : 'Mark as Read'}
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
