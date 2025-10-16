/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import { Menu, Bell, Search, User, Settings, LogOut, ChevronRight, MessageSquare, Loader2, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

// Import the hook to fetch support ticket data
import { useSupportTickets } from '@/hooks/useMessages';

const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard' },
    { name: 'Users', href: '/admin/users' },
    { name: 'Products', href: '/admin/products' },
    { name: 'Orders', href: '/admin/orders' },
    { name: 'Analytics', href: '/admin/analytics' },
    { name: 'Settings', href: '/admin/settings' },
];

interface AdminHeaderProps {
    setSidebarOpen: (open: boolean) => void;
}

export function AdminHeader({ setSidebarOpen }: AdminHeaderProps) {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    // 1. Fetch support tickets using the hook
    const { data: ticketsData, isLoading } = useSupportTickets();

    // 2. Calculate unread metrics
    const unreadTickets = (ticketsData?.tickets || []).filter(
        (ticket) => ticket.status === 'pending'
    );
    const unreadCount = unreadTickets.length;

    const [profileOpen, setProfileOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    const currentPage = navigation.find(item => item.href === pathname)?.name || 'Admin Panel';

    const handleProfileClick = () => {
        setProfileOpen(true);
        setNotificationsOpen(false); // Close other dialog
    };

    const handleNotificationsClick = () => {
        setNotificationsOpen(prev => !prev); // Toggle notifications
        setProfileOpen(false); // Close other dialog
    };

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 60) {
            return `${diffInMinutes} minutes ago`;
        }
        if (diffInMinutes < 1440) { // Less than 24 hours
            return `${Math.floor(diffInMinutes / 60)} hours ago`;
        }
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <>
        <header className="fixed top-0 left-0 lg:left-64 right-0 z-40 bg-white border-b border-gray-200 shadow-sm">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left side - Mobile menu button and page title */}
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden cursor-pointer"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="w-5 h-5" />
                        </Button>

                        <div className="hidden sm:block">
                            <h1 className="text-xl font-semibold text-gray-900">
                                {currentPage}
                            </h1>
                        </div>
                    </div>

                    {/* Center - Search bar (hidden on mobile) */}
                    <div className="hidden md:flex flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Search..."
                                className="pl-10 w-full"
                            />
                        </div>
                    </div>

                    {/* Right side - Notifications and user info */}
                    <div className="flex items-center gap-4">
                        {/* Search button for mobile */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden cursor-pointer"
                        >
                            <Search className="w-5 h-5" />
                        </Button>

                        {/* Notifications */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative cursor-pointer"
                            onClick={handleNotificationsClick}
                        >
                            <Bell className="w-5 h-5" />
                            {/* DYNAMIC COUNT HERE */}
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                                    {/* Use 99+ for very high counts */}
                                    {unreadCount > 99 ? '99+' : unreadCount} 
                                </span>
                            )}
                        </Button>

                        {/* User info */}
                        <div className="hidden sm:flex items-center gap-3 cursor-pointer" onClick={handleProfileClick}>
                            <div className="text-right">
                                <div className="text-sm font-medium text-gray-900">
                                    {user?.firstName} {user?.lastName}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {user?.role}
                                </div>
                            </div>
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-medium text-sm">
                                    {user?.firstName?.charAt(0)?.toUpperCase() || 'A'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile page title */}
            <div className="sm:hidden px-4 pb-3">
                <h1 className="text-lg font-semibold text-gray-900">
                    {currentPage}
                </h1>
            </div>
        </header>

        {/* Profile Dialog - Remains the same */}
        {profileOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md" onClick={() => setProfileOpen(false)}>
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
                    <div className="p-6">
                        <div className="text-center mb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-white font-bold text-2xl">
                                    {user?.firstName?.charAt(0)?.toUpperCase() || 'A'}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">{user?.firstName} {user?.lastName}</h3>
                            <p className="text-gray-600">{user?.email}</p>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mt-2">
                                {user?.role}
                            </span>
                        </div>

                        <div className="space-y-3">
                            <Link href="/admin/settings" onClick={() => setProfileOpen(false)}>
                                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                    <Settings className="w-5 h-5 text-gray-600" />
                                    <span className="text-gray-700">Settings</span>
                                    <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                                </div>
                            </Link>

                            <div className="border-t pt-3">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 transition-colors cursor-pointer w-full text-left"
                                >
                                    <LogOut className="w-5 h-5 text-red-600" />
                                    <span className="text-red-600">Sign Out</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Notifications Dialog - DYNAMIC CONTENT */}
        {notificationsOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md" onClick={() => setNotificationsOpen(false)}>
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6 sticky top-0 bg-white pb-3 border-b">
                            <h3 className="text-xl font-bold text-gray-900">Customer Messages</h3>
                            {unreadCount > 0 && (
                                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                    {unreadCount} New
                                </span>
                            )}
                            <button
                                onClick={() => setNotificationsOpen(false)}
                                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {isLoading ? (
                            <div className="py-10 flex flex-col items-center justify-center">
                                <Loader2 className="w-6 h-6 animate-spin text-blue-600 mb-3" />
                                <p className="text-gray-600">Loading tickets...</p>
                            </div>
                        ) : unreadCount === 0 ? (
                            <div className="py-10 text-center">
                                <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-600 font-medium">No new messages!</p>
                            </div>
                        ) : (
                            <div className="space-y-4 mb-6">
                                {/* Map over the unread tickets */}
                                {unreadTickets.slice(0, 5).map(ticket => (
                                    <Link 
                                        key={ticket.id} 
                                        href={`/admin/notifications?view=${ticket.id}`} 
                                        onClick={() => setNotificationsOpen(false)}
                                    >
                                        <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500 hover:bg-blue-100 transition-colors cursor-pointer">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-semibold text-gray-900 truncate max-w-[80%]">{ticket.subject}</h4>
                                                <MessageSquare className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1 truncate max-w-[90%]">
                                                From: {ticket.name} ({ticket.email})
                                            </p>
                                            <span className="text-xs text-gray-500 mt-2 block">
                                                {formatTimestamp(ticket.createdAt)}
                                            </span>
                                        </div>
                                    </Link>
                                ))}

                                {unreadTickets.length > 5 && (
                                    <p className="text-sm text-center text-gray-500 mt-4">
                                        + {unreadTickets.length - 5} more pending messages...
                                    </p>
                                )}
                            </div>
                        )}

                        <Link href="/admin/notifications" onClick={() => setNotificationsOpen(false)}>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                                View All Tickets
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        )}
    </>
    );
}