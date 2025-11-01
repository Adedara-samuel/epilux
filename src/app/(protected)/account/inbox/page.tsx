/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
// app/account/inbox/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// NOTE: Ensure this import is available in your environment
import { useQueryClient } from '@tanstack/react-query'; 
import { useAuth } from '@/hooks/useAuth';
import { useMessages } from '@/hooks/useSupport';
import { Loader2, Mail, ArrowLeft, Inbox, MessageSquare, Bell, X } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';

import { useMarkMessageAsRead } from '@/hooks/useSupport';

// --- BACKEND TYPE DEFINITIONS ---
interface BackendSenderRecipient {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
}

interface BackendMessage {
    _id: string;
    sender: BackendSenderRecipient;
    recipient: BackendSenderRecipient;
    subject: string;
    content: string;
    isRead: boolean;
    isAdminReply: boolean;
    createdAt: string;
    updatedAt: string;
}

interface BackendResponse {
    success: boolean;
    data: {
        messages: BackendMessage[];
        totalMessages: number;
        totalPages: number;
        currentPage: number;
    }
}
// --- END BACKEND TYPES ---


// Frontend Message interface, simplified
interface Message {
    id: string;
    subject: string;
    message: string;
    date: string;
    read: boolean;
    type: 'support' | 'admin';
    senderName: string; 
}

// Define the query key for cache updates
const MESSAGE_QUERY_KEY = ['supportTickets']; 


export default function MyInboxPage() {
    const { user } = useAuth();
    const router = useRouter();
    const queryClient = useQueryClient();
    const markAsReadMutation = useMarkMessageAsRead();

    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [showModal, setShowModal] = useState(false);

    // Fetch data, using optional chaining for safe access
    const { data: responseData, isLoading: loadingMessages } = useMessages() as { data: any, isLoading: boolean };
    
    const backendMessages: any[] = responseData?.data?.messages || [];

    // --- DATA MAPPING: ALL MESSAGES ARE PULLED FROM THE BACKEND RESPONSE ---
    
    const allMessages: Message[] = backendMessages.map((msg) => {
        // Determine the sender name
        const senderName = msg.isAdminReply 
            ? 'Epilux Water Support'
            : `${msg.sender.firstName} ${msg.sender.lastName}`;

        return {
            id: msg._id,
            subject: msg.subject,
            message: msg.content,
            date: msg.createdAt, 
            read: msg.isRead,
            type: msg.isAdminReply ? 'admin' : 'support',
            senderName: senderName
        } as Message; 
    }).sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    // --- END DATA MAPPING ---


    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
    }, [user, router]);


    const handleViewDetails = (message: Message) => {
        setSelectedMessage(message);
        setShowModal(true);
        
        // --- LOGIC TO MARK AS READ WHEN VIEWED AND OPTIMISTICALLY UPDATE COUNTS ---
        if (!message.read) {
            markAsReadMutation.mutate(message.id, {
                onSuccess: () => {
                    // 1. Optimistically update the React Query cache (updates component data)
                    queryClient.setQueryData(MESSAGE_QUERY_KEY, (oldData: BackendResponse | undefined) => {
                        if (!oldData) return oldData;

                        const updatedMessages = oldData.data.messages.map(msg => 
                            msg._id === message.id ? { ...msg, isRead: true } : msg
                        );
                        
                        return {
                            ...oldData,
                            data: {
                                ...oldData.data,
                                messages: updatedMessages,
                            }
                        };
                    });

                    // 2. Update the currently selected message state (updates the modal status)
                    setSelectedMessage(prev => prev ? { ...prev, read: true } : null);

                    toast.success("Message marked as read.");
                },
                onError: (error: any) => {
                    const errorMessage = error?.response?.data?.message || "Failed to mark as read.";
                    toast.error(errorMessage);
                },
            });
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedMessage(null);
    };

    if (loadingMessages) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                <p className="ml-3 text-lg text-gray-700">Loading inbox...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
                <p className="text-lg text-gray-700 text-center">Please log in to view your inbox and messages.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Button
                        variant="outline"
                        onClick={() => router.push('/account')}
                        className="flex items-center gap-2 bg-transparent border-none cursor-pointer hover:bg-gray-100"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to profile
                    </Button>
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900">
                            My Inbox
                        </h1>
                        <p className="text-gray-600 mt-2">Messages, notifications & updates</p>
                    </div>
                    <div></div> {/* Spacer for centering */}
                </div>

                {/* Stats Cards - Counts now update automatically due to Query Cache change */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <Inbox className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">{allMessages.length}</h3>
                        <p className="text-gray-600">Total Messages</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <Bell className="w-6 h-6 text-orange-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">
                            {/* Uses the recalculated allMessages array */}
                            {allMessages.filter((m: Message) => !m.read).length}
                        </h3>
                        <p className="text-gray-600">Unread Messages</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <MessageSquare className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">
                            {/* Uses the recalculated allMessages array */}
                            {allMessages.filter((m: Message) => m.read).length}
                        </h3>
                        <p className="text-gray-600">Read Messages</p>
                    </div>
                </div>

                {/* Messages List */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900">Recent Messages</h2>
                            <p className="text-gray-600 mt-1">Stay updated with your account activity</p>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {allMessages.map((message: Message) => (
                                <div
                                    key={message.id}
                                    // Use onMouseDown to prevent the click from firing twice if focusing on the button
                                    onClick={() => handleViewDetails(message)} 
                                    className={`p-6 hover:bg-gray-50/50 transition-colors cursor-pointer ${
                                        !message.read ? 'bg-blue-50/30 border-l-4 border-blue-500' : ''
                                    }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className={`text-lg font-semibold truncate ${
                                                    !message.read ? 'text-blue-800' : 'text-gray-800'
                                                }`}>
                                                    {message.subject}
                                                </h3>
                                                {!message.read && (
                                                    <div className="w-3 h-3 bg-blue-600 rounded-full flex-shrink-0"></div>
                                                )}
                                            </div>

                                            <p className="text-gray-600 mb-3 line-clamp-2">{message.message}</p>

                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Mail className="w-4 h-4" />
                                                    {message.senderName} 
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Bell className="w-4 h-4" />
                                                    {new Date(message.date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="ml-4 flex-shrink-0">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer"
                                            >
                                                View Details →
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {allMessages.length === 0 && (
                            <div className="p-12 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <Inbox className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No messages yet</h3>
                                <p className="text-gray-600">Your inbox is empty. We'll notify you when you have new messages.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Message Modal */}
            {showModal && selectedMessage && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Mail className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800">{selectedMessage.subject}</h3>
                                        <p className="text-gray-600 text-sm">From {selectedMessage.senderName}</p> 
                                        {selectedMessage.read && (
                                            <span className="text-xs text-green-600 font-medium"> • Read</span>
                                        )}
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={closeModal}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>

                        <div className="p-6 max-h-96 overflow-y-auto">
                            <div className="prose prose-gray max-w-none">
                                {selectedMessage.message.split('\n').map((paragraph: string, index: number) => (
                                    <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-gray-50">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                    Received on {new Date(selectedMessage.date).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                                <Button onClick={closeModal} className="bg-blue-600 hover:bg-blue-700">
                                    Close
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}