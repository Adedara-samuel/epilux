/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { ShoppingCart, Search, Menu, UserCircle2, X, Wallet, Users, Eye, EyeOff } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useAffiliateProfile } from '@/hooks/useAffiliate';

export default function Header() {
    const totalItems = useCartStore((s) => s.getTotalItems());
    const { user } = useAuth();
    const { data: profileData } = useAffiliateProfile();
    const profile = profileData?.profile;

    const [searchQuery, setSearchQuery] = useState('');
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [showBalance, setShowBalance] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle search logic here
        setShowMobileSearch(false);
    };

    return (
        <header className="bg-gradient-to-r from-white via-blue-50/30 to-indigo-50/30 shadow-lg sticky top-0 z-40 border-b border-blue-100/50 backdrop-blur-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left: Hamburger Menu & Logo */}
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.dispatchEvent(new Event('toggleMobileSidebar'))}
                            className="lg:hidden text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                                <img src="/images/logo.png" alt="" />
                            </div>
                            <div className="hidden sm:block">
                                <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                    Epilux <span className="text-blue-600">Water</span>
                                </span>
                                <p className="text-xs text-gray-500 -mt-1">Premium Water Solutions</p>
                            </div>
                        </Link>
                    </div>

                    {/* Center: Navigation Tabs - For all logged-in users */}
                    {user && (
                        <div className="hidden lg:flex items-center gap-1 bg-white/60 backdrop-blur-sm rounded-2xl p-1 border border-gray-200/50">
                            <Link
                                href="/products"
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium"
                            >
                                <ShoppingCart className="w-4 h-4" />
                                Products
                            </Link>
                            <Link
                                href="/products/wallet"
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all duration-200 font-medium"
                            >
                                <Wallet className="w-4 h-4" />
                                My Wallet
                            </Link>
                            <Link
                                href="/products/referrals"
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200 font-medium"
                            >
                                <Users className="w-4 h-4" />
                                Referrals
                            </Link>
                        </div>
                    )}

                    {/* Right: User Actions */}
                    <div className="flex items-center gap-3">
                        {/* User Balance - For all logged-in users */}
                        {user && (
                            <div className="hidden sm:flex">
                                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                            <Wallet className="w-4 h-4" />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs opacity-90">Balance</p>
                                            <p className="font-bold text-sm leading-tight">
                                                {showBalance ? `₦${profile?.availableBalance?.toLocaleString() || '0'}` : '••••••'}
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setShowBalance(!showBalance)}
                                            className="text-white hover:bg-white/20 rounded-full p-1"
                                        >
                                            {showBalance ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Mobile Search Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowMobileSearch(true)}
                            className="lg:hidden text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl"
                        >
                            <Search className="h-5 w-5" />
                        </Button>

                        <Link
                            href="/account"
                            className="p-2 rounded-xl hover:bg-blue-50 transition-colors hidden md:block"
                        >
                            <UserCircle2 className="h-6 w-6 text-gray-600 hover:text-blue-600 transition-colors" />
                        </Link>

                        <Link
                            href="/cart"
                            className="relative p-2 rounded-xl hover:bg-blue-50 transition-colors"
                        >
                            <ShoppingCart className="h-6 w-6 text-gray-600 hover:text-blue-600 transition-colors" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>

                {/* Mobile Search Input */}
                {showMobileSearch && (
                    <form
                        onSubmit={handleSearch}
                        className="lg:hidden px-4 pb-4"
                    >
                        <div className="relative flex items-center">
                            <Input
                                type="text"
                                placeholder="🔍 Search premium water products..."
                                className="w-full pl-4 pr-12 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowMobileSearch(false)}
                                className="absolute right-2 text-gray-500 hover:text-gray-700 rounded-lg"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                    </form>
                )}

                {/* Mobile Navigation Tabs - For all logged-in users */}
                {user && (
                    <div className="lg:hidden border-t border-gray-200/50 pt-3 pb-2">
                        <div className="flex gap-2 overflow-x-auto">
                            <Link
                                href="/products"
                                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl font-medium whitespace-nowrap border border-blue-200"
                            >
                                <ShoppingCart className="w-4 h-4" />
                                Products
                            </Link>
                            <Link
                                href="/wallet"
                                className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-xl font-medium whitespace-nowrap border border-green-200"
                            >
                                <Wallet className="w-4 h-4" />
                                Wallet
                            </Link>
                            <Link
                                href="/referrals"
                                className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-xl font-medium whitespace-nowrap border border-purple-200"
                            >
                                <Users className="w-4 h-4" />
                                Referrals
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}