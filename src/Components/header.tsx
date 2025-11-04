'use client';

/* eslint-disable @next/next/no-img-element */
// components/layout/Header.tsx
import Link from 'next/link';
import React, { useState } from 'react';
import { Button } from './ui/button';
import { LogIn, LogOut, User, ShoppingBag, Wallet, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCartStore } from '@/stores/cart-store';

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const totalItems = useCartStore((s) => s.getTotalItems());
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            if (token) {
                await fetch('https://epilux-backend.vercel.app/api/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
            }
        } catch (error) {
            console.error('Logout API failed:', error);
        } finally {
            // Clear local auth data
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            localStorage.removeItem('tokenTimestamp');
            document.cookie = 'authToken=; path=/; max-age=0; samesite=strict';
            window.location.href = '/login';
        }
    };

    return (
        <>
            <header className="bg-white/95 backdrop-blur-sm text-blue-700 p-4 shadow-lg sticky top-0 z-50 border-b border-gray-100">
                <div className="container mx-auto flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <img
                            src="/images/logo.png"
                            alt="Epilux Water Logo"
                            className="h-9 w-auto rounded-full border-2 border-white transition-transform group-hover:scale-105"

                        />
                        <span className="text-2xl font-bold text-blue-700 hidden sm:block">
                            Epilux <span className="text-blue-300">Water</span>
                        </span>
                    </Link>

                    <div className="flex items-center gap-4">
                        {/* Cart Icon - Always visible on mobile, hidden on desktop */}
                        <div className="relative md:hidden">
                            <Link href="/cart">
                                <Button variant="ghost" size="sm" className="relative p-2">
                                    <ShoppingBag className="w-5 h-5" />
                                    {totalItems > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                                            {totalItems > 99 ? '99+' : totalItems}
                                        </span>
                                    )}
                                </Button>
                            </Link>
                        </div>

                        {user ? (
                            <>
                                {/* User Info */}
                                <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                                    <User className="w-4 h-4" />
                                    <span>Welcome, {user.firstName}!</span>
                                </div>

                                {/* Affiliate Quick Actions - Desktop */}
                                {user.role === 'affiliate' && (
                                    <div className="hidden lg:flex items-center gap-2">
                                        <Link href="#orders">
                                            <Button variant="ghost" size="sm" className="flex items-center gap-1">
                                                <ShoppingBag className="w-4 h-4" />
                                                <span className="hidden xl:inline">Orders</span>
                                            </Button>
                                        </Link>
                                        <Link href="#wallet">
                                            <Button variant="ghost" size="sm" className="flex items-center gap-1">
                                                <Wallet className="w-4 h-4" />
                                                <span className="hidden xl:inline">Wallet</span>
                                            </Button>
                                        </Link>
                                        <Link href="#referrals">
                                            <Button variant="ghost" size="sm" className="flex items-center gap-1">
                                                <Users className="w-4 h-4" />
                                                <span className="hidden xl:inline">Referrals</span>
                                            </Button>
                                        </Link>
                                    </div>
                                )}

                                {/* Logout Button */}
                                <Button
                                    onClick={handleLogout}
                                    variant="outline"
                                    className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className="hidden sm:inline">Logout</span>
                                </Button>
                            </>
                        ) : (
                            <Button asChild variant="secondary" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-full shadow-md cursor-pointer">
                                <Link href="/login">
                                    <LogIn className="w-4 h-4 mr-2" />
                                    Login
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            {/* Mobile Bottom Navigation - Only for affiliates */}
            {user && user.role === 'affiliate' && (
                <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 z-40 lg:hidden">
                    <div className="flex justify-around items-center py-2 px-4">
                        <Link
                            href="#orders"
                            className="flex flex-col items-center gap-1 p-2 rounded-lg transition-all hover:bg-gray-100 relative group"
                            onMouseEnter={() => setHoveredItem('orders')}
                            onMouseLeave={() => setHoveredItem(null)}
                        >
                            <ShoppingBag className="w-5 h-5 text-gray-600" />
                            <span className={`text-xs text-gray-600 transition-opacity ${hoveredItem === 'orders' ? 'opacity-100' : 'opacity-0 lg:opacity-100'}`}>
                                Orders
                            </span>
                        </Link>

                        <Link
                            href="#wallet"
                            className="flex flex-col items-center gap-1 p-2 rounded-lg transition-all hover:bg-gray-100 relative group"
                            onMouseEnter={() => setHoveredItem('wallet')}
                            onMouseLeave={() => setHoveredItem(null)}
                        >
                            <Wallet className="w-5 h-5 text-gray-600" />
                            <span className={`text-xs text-gray-600 transition-opacity ${hoveredItem === 'wallet' ? 'opacity-100' : 'opacity-0 lg:opacity-100'}`}>
                                Wallet
                            </span>
                        </Link>

                        <Link
                            href="#referrals"
                            className="flex flex-col items-center gap-1 p-2 rounded-lg transition-all hover:bg-gray-100 relative group"
                            onMouseEnter={() => setHoveredItem('referrals')}
                            onMouseLeave={() => setHoveredItem(null)}
                        >
                            <Users className="w-5 h-5 text-gray-600" />
                            <span className={`text-xs text-gray-600 transition-opacity ${hoveredItem === 'referrals' ? 'opacity-100' : 'opacity-0 lg:opacity-100'}`}>
                                Referrals
                            </span>
                        </Link>
                    </div>
                </nav>
            )}
        </>
    );
}

export default Header;