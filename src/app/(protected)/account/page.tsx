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
        if (!user) {
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
                <Button asChild className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
                    <Link href="/login?redirect=/account">Go to Login</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="container mx-auto px-4 py-12">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                        Welcome back, {user.firstName}!
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Manage your account, track orders, and explore our premium water products
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* User Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 text-center hover:shadow-2xl transition-all duration-300">
                            <div className="relative mb-6">
                                <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                                    {user.firstName.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                {user.emailVerified && (
                                    <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            <h2 className="text-2xl font-bold text-gray-800 mb-2">{`${user.firstName} ${user.lastName}`}</h2>
                            <p className="text-gray-600 mb-4">{user.email}</p>

                            {!user.emailVerified && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                                    <p className="text-yellow-800 text-sm flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        Email not verified
                                    </p>
                                </div>
                            )}

                            <Button
                                onClick={logout}
                                className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
                            >
                                <LogOut className="w-5 h-5 mr-2" />
                                Sign Out
                            </Button>
                        </div>
                    </div>

                    {/* Account Navigation Links */}
                    <div className="lg:col-span-3">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Account Dashboard</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <Link
                                    href="/account/orders"
                                    className="group bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
                                            <ShoppingBag className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold">My Orders</h3>
                                            <p className="text-blue-100">Track your purchases</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-2xl">→</span>
                                    </div>
                                </Link>

                                <Link
                                    href="/account/inbox"
                                    className="group bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
                                            <Mail className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold">My Inbox</h3>
                                            <p className="text-purple-100">Messages & notifications</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-2xl">→</span>
                                    </div>
                                </Link>

                                <Link
                                    href="/account/help"
                                    className="group bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
                                            <HelpCircle className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold">Help Center</h3>
                                            <p className="text-green-100">Get support & answers</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-2xl">→</span>
                                    </div>
                                </Link>

                                <Link
                                    href="/account/contact"
                                    className="group bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
                                            <Phone className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold">Contact Us</h3>
                                            <p className="text-orange-100">Reach our team</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-2xl">→</span>
                                    </div>
                                </Link>

                                <Link
                                    href="/settings"
                                    className="group bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 text-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
                                            <Settings className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold">Settings</h3>
                                            <p className="text-pink-100">Account preferences</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-2xl">→</span>
                                    </div>
                                </Link>

                                {/* Placeholder for future features */}
                                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6 border-2 border-dashed border-gray-300 flex items-center justify-center">
                                    <div className="text-center text-gray-500">
                                        <div className="w-12 h-12 mx-auto mb-3 bg-gray-300 rounded-xl flex items-center justify-center">
                                            <span className="text-2xl">+</span>
                                        </div>
                                        <p className="font-medium">Coming Soon</p>
                                        <p className="text-sm">New features</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}