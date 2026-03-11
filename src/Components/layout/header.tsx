/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { ShoppingCart, Search, Menu, UserCircle2, X, Wallet, Users, Eye, EyeOff, Home, Plus, ShoppingBag, LogOut, Package, Droplets, Wrench } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useAuth } from '@/hooks/useAuth';
import React from 'react';
import { useWalletBalance } from '@/hooks/useWallet';
import { useCart } from '@/hooks/useCart';
import { usePathname, useRouter } from 'next/navigation';
import { authAPI } from '@/services/auth';

export default function Header() {
    const { user, token, logout } = useAuth();
    const { data: cartData } = useCart();
    const cartQueryEnabled = !!token;
    const pathname = usePathname();
    const router = useRouter();

    // Calculate number of distinct items in cart (same as cart page)
    const cartItems = cartData ? (cartData.data.items as any[])
        .filter(item => item.product)
        .map(item => ({
            id: item.product,
            quantity: item.quantity,
        })) : useCartStore.getState().cart;

    const distinctItemsCount = cartItems.length;

    const { data: walletData, error: walletError } = useWalletBalance();
    const balance = walletData?.availableBalance || 0;

    // Debug wallet error
    React.useEffect(() => {
        if (walletError) {
            console.log('Wallet balance error:', walletError);
            // Don't show error toast for wallet balance - it's not critical
            // The balance will just show as 0 if there's an error
        }
    }, [walletError]);

    const [searchQuery, setSearchQuery] = useState('');
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [isSearchClosing, setIsSearchClosing] = useState(false);
    const [showBalance, setShowBalance] = useState(false);
    const [isNavVisible, setIsNavVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle search logic here
        setShowMobileSearch(false);
    };

    // Scroll effect for mobile navigation
    React.useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down - hide nav
                setIsNavVisible(false);
            } else if (currentScrollY < lastScrollY) {
                // Scrolling up - show nav
                setIsNavVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <>
            {/* Desktop Header */}
            {pathname === '/' && !user ? (
                <header className="hidden md:block bg-white shadow-lg sticky top-0 z-40 border-b border-gray-200 backdrop-blur-sm animate-slide-in-top">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                        <div className="flex items-center justify-between h-16">
                            <Link href="/" className="flex items-center gap-3 group hover-lift">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 hover-glow">
                                    <img src="/images/logo.png" alt="" />
                                </div>
                                <div className="hidden sm:block">
                                    <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                                        Epilux <span className="text-blue-600">Water</span>
                                    </span>
                                    <p className="text-xs text-gray-500 -mt-1">Premium Water Solutions</p>
                                </div>
                            </Link>
                            <Link href="/login">
                                <Button
                                    variant="ghost"
                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg px-6 py-2 transition-all duration-300 hover:scale-105 active:scale-95"
                                >
                                    Login
                                </Button>
                            </Link>
                        </div>
                    </div>
                </header>
            ) : (
                <header className="app-header hidden md:block bg-gradient-to-r from-white via-blue-50/30 to-indigo-50/30 shadow-lg sticky top-0 z-40 border-b border-blue-100/50 backdrop-blur-sm animate-slide-in-top">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="flex items-center justify-between h-16">
                        {/* Left: Logo */}
                        <div className="flex items-center gap-4 animate-slide-in-left">
                            <Link href="/" className="flex items-center gap-3 group hover-lift">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 hover-glow">
                                    <img src="/images/logo.png" alt="" />
                                </div>
                                <div className="hidden sm:block">
                                    <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                                        Epilux <span className="text-blue-600">Water</span>
                                    </span>
                                    <p className="text-xs text-gray-500 -mt-1">Premium Water Solutions</p>
                                </div>
                            </Link>
                        </div>

                        {/* Center: Navigation Tabs - For all logged-in users */}
                        {user && (
                            <div className="hidden lg:flex items-center gap-1 bg-white/60 backdrop-blur-sm rounded-2xl p-1 border border-gray-200/50 animate-fade-in-scale">
                                <Link
                                    href="/products"
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium hover-lift"
                                >
                                    <ShoppingCart className="w-4 h-4" />
                                    Products
                                </Link>
                                <Link
                                    href="/products/wallet"
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all duration-200 font-medium hover-lift"
                                >
                                    <Wallet className="w-4 h-4" />
                                    My Wallet
                                </Link>
                                <Link
                                    href="/products/referrals"
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200 font-medium hover-lift"
                                >
                                    <Users className="w-4 h-4" />
                                    Referrals
                                </Link>
                            </div>
                        )}

                        {/* Right: User Actions */}
                        <div className="flex items-center gap-2 animate-slide-in-right">
                            {/* Desktop Balance - For all logged-in users */}
                            {user && (
                                <div className="hidden sm:flex">
                                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group hover-lift hover-glow">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                                <Wallet className="w-4 h-4" />
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs opacity-90">Balance</p>
                                                <p className="font-bold text-sm leading-tight">
                                                    {showBalance ? `₦${balance?.toLocaleString() || '0'}` : '••••••'}
                                                </p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setShowBalance(!showBalance)}
                                                className="text-white hover:bg-white/20 rounded-full p-1 hover-scale transition-all duration-200"
                                            >
                                                {showBalance ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Account Icon - Only on larger screens */}
                            <Link
                                href="/account"
                                className="p-2 rounded-xl hover:bg-blue-50 transition-colors hidden md:block hover-lift"
                            >
                                <UserCircle2 className="h-6 w-6 text-gray-600 hover:text-blue-600 transition-colors duration-200" />
                            </Link>

                            {/* Cart Icon - Always visible, simplified */}
                            <Link
                                href="/cart"
                                className="relative p-2 rounded-xl hover:bg-blue-50 transition-colors hover-lift"
                            >
                                <ShoppingCart className="h-6 w-6 text-gray-600 hover:text-blue-600 transition-colors duration-200" />
                                {distinctItemsCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md animate-bounce-in">
                                        {distinctItemsCount}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>
            </header>
            )}

            {/* Mobile Floating Navigation - Hide on home page */}
            {pathname !== '/' && (
                <nav className={`fixed bottom-4 left-4 right-4 bg-white/95 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-lg md:hidden z-50 animate-slide-in-bottom transition-transform duration-300 ${isNavVisible ? 'translate-y-0' : 'translate-y-full'}`}>
                <div className="flex justify-around items-center h-14 px-2">
                    <Link href="/products" className={`flex flex-col items-center p-1.5 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95 animate-bounce-in ${pathname === '/products' ? 'text-primary bg-primary/10 shadow-md' : 'text-muted-foreground hover:text-primary hover:bg-primary/5'}`}>
                        <ShoppingBag className="w-4 h-4" />
                        <span className="text-xs mt-0.5">Products</span>
                    </Link>
                    {user && (
                        <>
                            <Link href="/products/wallet" className={`flex flex-col items-center p-1.5 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95 animate-bounce-in ${pathname === '/products/wallet' ? 'text-primary bg-primary/10 shadow-md' : 'text-muted-foreground hover:text-primary hover:bg-primary/5'}`}>
                                <Wallet className="w-4 h-4" />
                                <span className="text-xs mt-0.5">Wallet</span>
                            </Link>
                            <Link href="/products/referrals" className={`flex flex-col items-center p-1.5 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95 animate-bounce-in ${pathname === '/products/referrals' ? 'text-primary bg-primary/10 shadow-md' : 'text-muted-foreground hover:text-primary hover:bg-primary/5'}`}>
                                <Users className="w-4 h-4" />
                                <span className="text-xs mt-0.5">Referrals</span>
                            </Link>
                        </>
                    )}
                    <Link href="/account" className={`flex flex-col items-center p-1.5 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95 animate-bounce-in ${pathname === '/account' ? 'text-primary bg-primary/10 shadow-md' : 'text-muted-foreground hover:text-primary hover:bg-primary/5'}`}>
                        <UserCircle2 className="w-4 h-4" />
                        <span className="text-xs mt-0.5">Account</span>
                    </Link>
                </div>
            </nav>
            )}

            {/* Mobile Search Overlay */}
            {showMobileSearch && (
                <div className="fixed inset-0 bg-black/50 z-50 md:hidden">
                    <div className="absolute top-4 left-4 right-4 bg-white rounded-2xl p-4">
                        <form onSubmit={handleSearch} className="relative">
                            <Input
                                type="text"
                                placeholder="🔍 Search premium water products..."
                                className="w-full pl-4 pr-12 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowMobileSearch(false)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 rounded-lg"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </form>
                    </div>
                </div>
            )}

            {/* Mobile Top App Bar */}
            <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-gray-200 md:hidden z-40 animate-slide-in-top">
                <div className="flex items-center justify-between h-12 px-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                            <img src="/images/logo.png" alt="" className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-bold text-gray-900">Epilux</span>
                    </Link>

                    {/* Action Buttons */}
                    {pathname === '/' && !user ? (
                        <Link href="/login">
                            <Button
                                variant="ghost"
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg px-4 py-2 transition-all duration-300 hover:scale-105 active:scale-95"
                            >
                                Login
                            </Button>
                        </Link>
                    ) : (
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowMobileSearch(true)}
                                className="text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg w-8 h-8 transition-all duration-300 hover:scale-110 active:scale-95 animate-pulse-custom"
                            >
                                <Search className="h-4 w-4" />
                            </Button>
                            <Link href="/cart" className="relative">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg w-8 h-8 relative transition-all duration-300 hover:scale-110 active:scale-95 animate-pulse-custom"
                                >
                                    <ShoppingCart className="h-4 w-4" />
                                    {distinctItemsCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center animate-bounce-in shadow-lg">
                                            {distinctItemsCount}
                                        </span>
                                    )}
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Floating Menu Button - Hide on home page */}
            {pathname !== '/' && (
                <div className="fixed bottom-16 right-4 md:hidden z-50">
                <Button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="bg-blue-600 text-white rounded-full w-12 h-12 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                >
                    <Plus className={`h-5 w-5 transition-transform duration-300 ${isDropdownOpen ? 'rotate-45' : ''}`} />
                </Button>
                {isDropdownOpen && (
                    <div className="absolute bottom-14 right-0 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200 p-3 animate-slide-in-bottom min-w-48">
                        <Link
                            href="/products?sachet-water"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium hover-lift"
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                💧
                            </div>
                            Sachet Water
                        </Link>
                        <Link
                            href="/products?bottled-water"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium hover-lift"
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                🥤
                            </div>
                            Bottled Water
                        </Link>
                        <Link
                            href="/products?water-dispenser"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium hover-lift"
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                🚰
                            </div>
                            Water Dispenser
                        </Link>
                        <Link
                            href="/products?accessories"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium hover-lift"
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                🛠️
                            </div>
                            Accessories
                        </Link>
                        <Link
                            href="/products?bulk-orders"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium hover-lift"
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                📦
                            </div>
                            Bulk Orders
                        </Link>
                        <button
                            onClick={async () => {
                                try {
                                    await authAPI.logout(token);
                                    logout(); // Clear local state
                                    router.push('/');
                                    setIsDropdownOpen(false);
                                } catch (error) {
                                    console.error('Logout failed:', error);
                                }
                            }}
                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200 font-medium hover-lift"
                        >
                            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                🚪
                            </div>
                            Logout
                        </button>
                    </div>
                )}
            </div>
            )}
        </>
    );
}