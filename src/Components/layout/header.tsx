/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { ShoppingCart, Search, Menu, UserCircle2, X } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export default function Header() {
    const { totalItems } = useCartStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [showMobileSearch, setShowMobileSearch] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle search logic here
        setShowMobileSearch(false);
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left: Hamburger Menu & Logo */}
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.dispatchEvent(new Event('toggleMobileSidebar'))}
                            className="lg:hidden text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                        <Link href="/" className="flex items-center gap-2 group">
                            <img
                                src="/images/logo.png"
                                alt="Epilux Water Logo"
                                className="h-8 w-auto transition-transform group-hover:scale-105"
                            />
                            <span className="text-xl font-bold text-blue-800 hidden sm:block">
                                Epilux <span className="text-blue-600">Water</span>
                            </span>
                        </Link>
                    </div>

                    {/* Right: Icons */}
                    <div className="flex items-center gap-4">
                        {/* Mobile Search Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowMobileSearch(true)}
                            className="lg:hidden text-gray-600 hover:text-blue-600"
                        >
                            <Search className="h-5 w-5" />
                        </Button>

                        <Link
                            href="/account"
                            className="p-2 rounded-full hover:bg-gray-50 transition-colors hidden md:block"
                        >
                            <UserCircle2 className="h-6 w-6 text-gray-600 hover:text-blue-600 transition-colors" />
                        </Link>

                        <Link
                            href="/cart"
                            className="relative p-2 rounded-full hover:bg-gray-50 transition-colors"
                        >
                            <ShoppingCart className="h-6 w-6 text-gray-600 hover:text-blue-600 transition-colors" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>

                {/* Mobile Search Input - appears when search icon is clicked */}
                {showMobileSearch && (
                    <form
                        onSubmit={handleSearch}
                        className="lg:hidden px-4 pb-3"
                    >
                        <div className="relative flex items-center">
                            <Input
                                type="text"
                                placeholder="Search products..."
                                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowMobileSearch(false)}
                                className="absolute right-0 text-gray-500 hover:text-gray-700"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </header>
    );
}