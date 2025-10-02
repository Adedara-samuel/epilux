// app/account/page.tsx
'use client';

import { useAuth } from '@/app/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Mail, HelpCircle, Phone, Settings, LogOut } from 'lucide-react';
import { Button } from '@/Components/ui/button';

export default function AccountPage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            // If not logged in after auth state is resolved, redirect to login
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-lg text-gray-600">Loading user data...</p>
            </div>
        );
    }

    if (!user) {
        // This case should ideally be handled by the useEffect redirect,
        // but as a fallback, show a message.
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
                <p className="text-gray-600 mb-6">Please log in to view your account.</p>
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                    <Link href="/login?redirect=/account">Go to Login</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-blue-800 mb-8">My Account</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* User Profile Card */}
                <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-5xl font-bold mb-4">
                            {user.firstName.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800">{`${user.firstName} ${user.lastName}`}</h2>
                        <p className="text-gray-600 text-sm">{user.email}</p>
                        {user.emailVerified ? (
                            <span className="text-green-600 text-xs mt-2 flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Verified
                            </span>
                        ) : (
                            <span className="text-red-600 text-xs mt-2 flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Email Not Verified
                            </span>
                        )}
                    </div>
                    <Button onClick={logout} className="w-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2">
                        <LogOut size={18} /> Sign Out
                    </Button>
                </div>

                {/* Account Navigation Links */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">My Dashboard</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link href="/account/orders" className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors">
                            <ShoppingBag size={24} className="text-blue-600" />
                            <span className="font-medium text-gray-800">My Orders</span>
                        </Link>
                        <Link href="/account/inbox" className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors">
                            <Mail size={24} className="text-blue-600" />
                            <span className="font-medium text-gray-800">My Inbox</span>
                        </Link>
                        <Link href="/account/help" className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors">
                            <HelpCircle size={24} className="text-blue-600" />
                            <span className="font-medium text-gray-800">Help Center</span>
                        </Link>
                        <Link href="/account/contact" className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors">
                            <Phone size={24} className="text-blue-600" />
                            <span className="font-medium text-gray-800">Contact Us</span>
                        </Link>
                        <Link href="/settings" className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors">
                            <Settings size={24} className="text-blue-600" />
                            <span className="font-medium text-gray-800">Settings</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}