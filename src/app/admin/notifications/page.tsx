/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useSupportTickets, useDeleteMessage, useUpdateTicketStatus, useResolveTicket } from '@/hooks/useMessages';
import { SupportTicket } from '@/services/messageService';

import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import {
    AlertTriangle,
    Bell,
    CheckCircle,
    DollarSign,
    Eye,
    EyeOff,
    MessageSquare,
    Package,
    Search,
    Send,
    ShoppingCart,
    Trash2,
    UserPlus,
    X,
    Loader2
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

// --- Helper Type for Mapping to Component's Expectation ---
// Adds fields required by the UI that are missing in the SupportTicket schema.
type NotificationView = SupportTicket & {
    read: boolean;
    type: 'message' | 'system' | 'order';
    priority: 'high' | 'medium' | 'low';
    title: string;
    timestamp: string;
    customerEmail: string;
};


export default function AdminNotificationsPage() {
    // 1. Fetch data and initialize mutations
    const { data: ticketsData, isLoading, isError } = useSupportTickets();
    const updateStatusMutation = useUpdateTicketStatus();
    const deleteMutation = useDeleteMessage();
    const resolveTicketMutation = useResolveTicket(); 

    // Local state for UI interactions
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterRead, setFilterRead] = useState('all');
    const [selectedNotification, setSelectedNotification] = useState<NotificationView | null>(null);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [replyDialogOpen, setReplyDialogOpen] = useState(false);
    const [replyMessage, setReplyMessage] = useState('');

    // --- Data Mapping and Derivation ---

    const mappedNotifications: NotificationView[] = (ticketsData?.tickets || []).map(ticket => ({
        ...ticket,
        // DYNAMICALLY MAPPED: Based on the API's 'status' field.
        read: ticket.status !== 'pending', 
        // NECESSARY DEFAULT: All records are customer messages/tickets.
        type: 'message', 
        // NECESSARY DEFAULT: The API does not provide a priority field.
        priority: 'medium', 
        // MAPPED: Use 'subject' for the 'title' field.
        title: ticket.subject,
        // MAPPED: Use 'createdAt' for the 'timestamp' field.
        timestamp: ticket.createdAt,
        // MAPPED: Use 'email' for the 'customerEmail' field.
        customerEmail: ticket.email, 
    }));

    // --- Utility Functions ---

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'order':
                return <ShoppingCart className="w-5 h-5 text-blue-600" />;
            case 'payment':
                return <DollarSign className="w-5 h-5 text-green-600" />;
            case 'inventory':
                return <Package className="w-5 h-5 text-orange-600" />;
            case 'subscription':
                return <UserPlus className="w-5 h-5 text-indigo-600" />;
            case 'message':
                return <MessageSquare className="w-5 h-5 text-green-600" />;
            case 'system':
                return <AlertTriangle className="w-5 h-5 text-purple-600" />;
            default:
                return <Bell className="w-5 h-5 text-gray-600" />;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // --- Filtering Logic ---

    const filteredNotifications = mappedNotifications.filter(notification => {
        const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            notification.message.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesType = filterType === 'all' || notification.type === filterType || filterType === 'message'; 
        
        const matchesRead = filterRead === 'all' ||
            (filterRead === 'read' && notification.read) ||
            (filterRead === 'unread' && !notification.read);

        return matchesSearch && matchesType && matchesRead;
    });

    // --- Action Handlers (using mutations) ---

    const markStatus = (id: string, readStatus: boolean) => {
        const newStatus = readStatus ? 'read' : 'pending';
        updateStatusMutation.mutate({ id, status: newStatus as 'read' | 'pending' });
    };

    const deleteNotificationHandler = (id: string) => {
        deleteMutation.mutate(id);
    };

    const markAllAsRead = () => {
        mappedNotifications.filter(n => !n.read).forEach(n => {
            markStatus(n.id, true);
        });
    };

    const viewNotificationDetails = (notification: NotificationView) => {
        setSelectedNotification(notification);
        setViewDialogOpen(true);
        if (!notification.read) {
            markStatus(notification.id, true);
        }
    };

    const openReplyDialog = (notification: NotificationView) => {
        setSelectedNotification(notification);
        setReplyDialogOpen(true);
        setReplyMessage('');
    };

    const sendReply = () => {
        if (!replyMessage.trim() || !selectedNotification?.id) return;
        
        // Use the resolveTicket mutation
        resolveTicketMutation.mutate(selectedNotification.id, {
            onSuccess: () => {
                // In a real application, the reply message would be sent to a separate endpoint
                toast.success('Reply logged and ticket marked as resolved.');
                setReplyDialogOpen(false);
                setReplyMessage('');
            },
            onError: (error) => {
                 const errorMessage = (error as any).response?.data?.message || error.message || "Failed to send reply/resolve ticket.";
                 toast.error(errorMessage);
            }
        });
    };

    const unreadCount = mappedNotifications.filter(n => !n.read).length;
    const messageCount = mappedNotifications.length;

    // --- Render Loading/Error State ---

    if (isLoading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p className="ml-3 text-lg text-gray-700">Loading support tickets...</p>
            </div>
        );
    }

    if (isError) {
         return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 bg-red-50 border border-red-200 rounded-xl">
                <AlertTriangle className="h-10 w-10 text-red-600 mb-4" />
                <h3 className="text-xl font-semibold text-red-800">Error Loading Data</h3>
                <p className="text-red-700 text-center">Failed to fetch support tickets from the server.</p>
            </div>
        );
    }
    
    // --- Main Component JSX ---
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                    <h1 className="text-3xl font-bold text-gray-900">Support Tickets (Notifications)</h1>
                    <p className="text-gray-600 mt-1">Manage customer inquiries and support requests</p>
                </div>
                <div className="flex gap-2">
                    {unreadCount > 0 && (
                        <Button 
                            onClick={markAllAsRead} 
                            variant="outline" 
                            className="cursor-pointer"
                            disabled={updateStatusMutation.isPending}
                        >
                            {updateStatusMutation.isPending ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <CheckCircle className="w-4 h-4 mr-2" />
                            )}
                            Mark All Read
                        </Button>
                    )}
                </div>
            </div>

            {/* Stats Cards - Updated to reflect ticket data */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Bell className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{messageCount}</p>
                                <p className="text-sm text-gray-600">Total Tickets</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
                                <p className="text-sm text-gray-600">New/Pending</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <MessageSquare className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {mappedNotifications.filter(n => n.read).length}
                                </p>
                                <p className="text-sm text-gray-600">Read/Active</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {mappedNotifications.filter(n => n.status === 'resolved').length}
                                </p>
                                <p className="text-sm text-gray-600">Resolved</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <DollarSign className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {0}
                                </p>
                                <p className="text-sm text-gray-600">Other (N/A)</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Search */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Search tickets by subject or content..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Filter Type simplified */}
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Types</option>
                            <option value="message">Customer Messages</option>
                        </select>

                        {/* Filter Read/Pending/Resolved */}
                        <select
                            value={filterRead}
                            onChange={(e) => setFilterRead(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="unread">Unread/Pending</option>
                            <option value="read">Read/Active</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Notifications List */}
            <div className="space-y-4">
                {filteredNotifications.length === 0 ? (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No support tickets found</h3>
                            <p className="text-gray-600">
                                {searchTerm || filterType !== 'all' || filterRead !== 'all'
                                    ? 'Try adjusting your filters'
                                    : 'You have no open tickets.'}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredNotifications.map((notification) => (
                        <Card
                            key={notification.id}
                            className={`transition-all duration-200 hover:shadow-md ${!notification.read ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''
                                }`}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        {getNotificationIcon(notification.type)}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <h3 className={`font-semibold ${notification.read ? 'text-gray-900' : 'text-gray-900'
                                                    }`}>
                                                    {notification.title}
                                                </h3>
                                                <Badge className={`text-xs ${getPriorityColor(notification.priority)}`}>
                                                    {notification.priority}
                                                </Badge>
                                                {!notification.read && (
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                )}
                                                {notification.status === 'resolved' && (
                                                    <Badge className="text-xs bg-purple-100 text-purple-800 border-purple-200">
                                                        Resolved
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => viewNotificationDetails(notification)}
                                                    className="text-blue-600 hover:text-blue-700 cursor-pointer"
                                                >
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    View Details
                                                </Button>

                                                {(notification.type === 'message' && notification.status !== 'resolved') && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => openReplyDialog(notification)}
                                                        className="text-green-600 hover:text-green-700 cursor-pointer"
                                                    >
                                                        <MessageSquare className="w-4 h-4 mr-1" />
                                                        Reply/Resolve
                                                    </Button>
                                                )}

                                                {!notification.read ? (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedNotification(notification);
                                                            markStatus(notification.id, true);
                                                        }}
                                                        className="text-purple-600 hover:text-purple-700 cursor-pointer"
                                                        disabled={updateStatusMutation.isPending && selectedNotification?.id === notification.id}
                                                    >
                                                         {updateStatusMutation.isPending && selectedNotification?.id === notification.id ? 
                                                            <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : 
                                                            <CheckCircle className="w-4 h-4 mr-1" />
                                                        }
                                                        Mark Read
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedNotification(notification);
                                                            markStatus(notification.id, false);
                                                        }}
                                                        className="text-gray-600 hover:text-gray-700 cursor-pointer"
                                                        disabled={updateStatusMutation.isPending && selectedNotification?.id === notification.id}
                                                    >
                                                        {updateStatusMutation.isPending && selectedNotification?.id === notification.id ? 
                                                            <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : 
                                                            <EyeOff className="w-4 h-4 mr-1" />
                                                        }
                                                        Mark Unread
                                                    </Button>
                                                )}

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedNotification(notification);
                                                        deleteNotificationHandler(notification.id);
                                                    }}
                                                    className="text-red-600 hover:text-red-700 cursor-pointer"
                                                    disabled={deleteMutation.isPending && selectedNotification?.id === notification.id}
                                                >
                                                    {deleteMutation.isPending && selectedNotification?.id === notification.id ? 
                                                        <Loader2 className="w-4 h-4 animate-spin" /> : 
                                                        <Trash2 className="w-4 h-4" />
                                                    }
                                                </Button>
                                            </div>
                                        </div>

                                        <p className={`mb-2 ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                                            {notification.message}
                                        </p>

                                        {/* Display sender email here */}
                                        <p className="text-sm text-gray-600 mb-3">
                                            From: <span className="font-medium text-gray-800">{notification.customerEmail}</span>
                                        </p>

                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500">
                                                {new Date(notification.timestamp).toLocaleString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>

                                            <span className={`text-xs px-2 py-1 rounded-full bg-green-100 text-green-800`}>
                                                Customer Message
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* View Details Dialog */}
            {viewDialogOpen && selectedNotification && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md" onClick={() => setViewDialogOpen(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">Ticket Details</h3>
                                <button
                                    onClick={() => setViewDialogOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h4 className="text-xl font-semibold text-gray-900">{selectedNotification.title}</h4>
                                            <Badge className={`text-xs ${getPriorityColor(selectedNotification.priority)}`}>
                                                {selectedNotification.priority} priority
                                            </Badge>
                                        </div>
                                        <p className="text-gray-700 mb-4">{selectedNotification.message}</p>

                                        
                                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                            <h5 className="font-medium text-gray-900 mb-2">Customer Information</h5>
                                            <p className="text-gray-700">Name: <span className="font-semibold">{selectedNotification.name}</span></p>
                                            <p className="text-gray-700">Email: <span className="font-semibold">{selectedNotification.customerEmail}</span></p>
                                        </div>

                                        <div className="flex items-center justify-between text-sm text-gray-600 flex-wrap gap-2">
                                            <span>
                                                <strong>Type:</strong> Customer Message
                                            </span>
                                            <span>
                                                <strong>Status:</strong> {selectedNotification.status.charAt(0).toUpperCase() + selectedNotification.status.slice(1)}
                                            </span>
                                            <span>
                                                <strong>Time:</strong> {new Date(selectedNotification.timestamp).toLocaleString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end mt-6">
                                <Button onClick={() => setViewDialogOpen(false)} className="cursor-pointer">
                                    Close
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Reply Dialog */}
            {replyDialogOpen && selectedNotification && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md" onClick={() => setReplyDialogOpen(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">Reply & Resolve Ticket</h3>
                                <button
                                    onClick={() => setReplyDialogOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-900 mb-2">Original Message: {selectedNotification.title}</h4>
                                    <p className="text-gray-700">{selectedNotification.message}</p>
                                    <p className="text-sm font-medium mt-3 text-blue-600">
                                        Replying to: {selectedNotification.customerEmail}
                                    </p>
                                </div>

                                <div>
                                    <Label htmlFor="replyMessage" className="text-gray-700 font-medium">Your Reply (Resolves Ticket)</Label>
                                    <Textarea
                                        id="replyMessage"
                                        value={replyMessage}
                                        onChange={(e) => setReplyMessage(e.target.value)}
                                        placeholder="Type your final reply/resolution details..."
                                        className="mt-2 min-h-[120px]"
                                        disabled={resolveTicketMutation.isPending}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <Button variant="outline" onClick={() => setReplyDialogOpen(false)} className="cursor-pointer">
                                    Cancel
                                </Button>
                                <Button
                                    onClick={sendReply}
                                    disabled={!replyMessage.trim() || resolveTicketMutation.isPending}
                                    className="bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                                >
                                    {resolveTicketMutation.isPending ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4 mr-2" />
                                    )}
                                    Send & Resolve
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}