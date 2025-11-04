/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
// components/Navbar.tsx
'use client';
import { useAuth } from '@/app/context/auth-context';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/stores/cart-store';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { Menu, Search, ShoppingCart, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export default function Navbar() {
    const { user, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const router = useRouter();
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const userRole = user?.role || 'customer';

    // Create a stable selector for cart state to prevent infinite re-renders
    const cartSelector = useMemo(() => (state: any) => state.cart.reduce((total: number, item: any) => total + item.quantity, 0), []);
    const totalItems = useCartStore(cartSelector);

    const categories = [
        { name: 'All Products', href: '/products' },
        { name: 'Bottled Water', href: '/products/bottled' },
        { name: 'Sachet Water', href: '/products/sachet' },
        { name: 'Subscriptions', href: '/subscriptions' },
        { name: "Today's Deals", href: '/deals' },
    ];

    // Handle search submission
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            setMobileMenuOpen(false);
        }
    };

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
                setMobileMenuOpen(false);
            }
        };

        if (mobileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [mobileMenuOpen]);

    // Add scroll effect to navbar
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={cn(
            "sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-lg transition-all duration-300 animate-slide-in-top",
            isScrolled ? "shadow-sm" : "shadow-none"
        )}>
            <div className="container mx-auto px-4">
                {/* Main Navigation Bar */}
                <div className="flex h-16 items-center justify-between">
                    {/* Left Section - Logo and Mobile Menu */}
                    <div className="flex items-center gap-4 animate-slide-in-left">
                        {/* Mobile Menu Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden hover-scale transition-all duration-200"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                            <span className="sr-only">Toggle menu</span>
                        </Button>

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 hover-lift">
                            <img
                                src="/images/logo.png"
                                className="w-10 h-10 transition-transform hover:scale-105 hover-glow"
                                alt="Epilux Logo"
                            />
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                                Epilux
                            </span>
                        </Link>
                    </div>

                    {/* Center Section - Search Bar (Desktop) */}
                    <form onSubmit={handleSearch} className="hidden flex-1 max-w-xl mx-4 md:block">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                placeholder="Search for water products..."
                                className="w-full rounded-full pl-9 focus-visible:ring-2 focus-visible:ring-blue-500 transition-all duration-200"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Button
                                type="submit"
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full hover:bg-gray-100"
                            >
                                <Search className="h-4 w-4 text-blue-600" />
                            </Button>
                        </div>
                    </form>

                    {/* Right Section - User Actions */}
                    <div className="flex items-center gap-3 animate-slide-in-right">
                        {/* Cart */}
                        <Button asChild variant="ghost" size="icon" className="relative rounded-full hover-lift hover-scale transition-all duration-200">
                            <Link href="/cart" className="relative">
                                <ShoppingCart className="h-5 w-5 text-blue-600" />
                                {totalItems > 0 && (
                                    <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white p-0 animate-bounce-in">
                                        {totalItems > 9 ? "9+" : totalItems}
                                    </Badge>
                                )}
                            </Link>
                        </Button>

                        {/* User Dropdown */}
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Link href="/account">
                                        <Button
                                            variant="ghost"
                                            className="relative h-9 w-9 rounded-full p-0 hover:bg-gray-100 hover-lift hover-scale transition-all duration-200"
                                        >
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage
                                                    src={user.profile?.avatar || undefined}
                                                    className="rounded-full"
                                                />
                                                <AvatarFallback className="flex items-center justify-center h-full w-full rounded-full bg-gradient-to-br from-blue-500 to-green-500 text-white hover-glow">
                                                    {user.firstName?.charAt(0).toUpperCase() || 'U'}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </Link>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-56 rounded-md bg-white p-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                                    align="end"
                                    forceMount
                                >
                                    <div className="px-3 py-2">
                                        <div className="text-sm font-medium text-gray-900 truncate">
                                            {`${user.firstName} ${user.lastName}` || user.email}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {userRole === 'admin'
                                                ? 'Administrator'
                                                : userRole === 'affiliate'
                                                    ? 'Affiliate Partner'
                                                    : userRole === 'marketer'
                                                        ? 'Delivery Marketer'
                                                        : 'Customer'}
                                        </div>
                                    </div>
                                    <DropdownMenuSeparator className="h-px bg-gray-200 my-1" />
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href="/account"
                                            className="block w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                                        >
                                            My Account
                                        </Link>
                                    </DropdownMenuItem>
                                    {userRole === 'admin' && (
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href="/admin"
                                                className="block w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                                            >
                                                Admin Dashboard
                                            </Link>
                                        </DropdownMenuItem>
                                    )}
                                    {userRole === 'affiliate' && (
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href="/affiliate"
                                                className="block w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                                            >
                                                Affiliate Dashboard
                                            </Link>
                                        </DropdownMenuItem>
                                    )}
                                    {userRole === 'marketer' && (
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href="/marketer"
                                                className="block w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                                            >
                                                Delivery Dashboard
                                            </Link>
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator className="h-px bg-gray-200 my-1" />
                                    <DropdownMenuItem
                                        onClick={() => {
                                            logout();
                                            window.location.href = '/login';
                                        }}
                                        className="block w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded cursor-pointer"
                                    >
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="hidden sm:flex gap-2 animate-fade-in-scale">
                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    className="text-gray-700 hover:text-blue-600 border-gray-300 hover:border-blue-400 hover-lift hover-scale transition-all duration-200"
                                >
                                    <Link href="/login">Login</Link>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    className="text-blue-600 hover:text-blue-700 border-blue-300 hover:border-blue-400 hover-lift hover-scale transition-all duration-200"
                                >
                                    <Link href="/admin-login">Admin Login</Link>
                                </Button>
                                <Button
                                    asChild
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover-lift hover-glow transition-all duration-200"
                                >
                                    <Link href="/register">Register</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Categories Bar (Desktop) */}
                <div className="hidden md:flex items-center justify-center space-x-6 py-2 border-t animate-fade-in-scale">
                    {categories.map((category) => (
                        <Link
                            key={category.href}
                            href={category.href}
                            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors relative group hover-lift"
                        >
                            {category.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    ))}
                </div>

                {/* Mobile Menu */}
                <div
                    ref={mobileMenuRef}
                    className={cn(
                        'md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white shadow-lg animate-slide-in-bottom',
                        mobileMenuOpen ? 'max-h-screen py-4 border-t' : 'max-h-0 py-0'
                    )}
                >
                    <div className="space-y-4 px-4">
                        {/* Mobile Search */}
                        <form onSubmit={handleSearch} className="relative animate-fade-in-scale">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                placeholder="Search products..."
                                className="w-full rounded-full pl-9 pr-9 hover-lift transition-all duration-200"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Button
                                type="submit"
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full hover:bg-gray-100 hover-scale transition-all duration-200"
                            >
                                <Search className="h-4 w-4 text-blue-600" />
                            </Button>
                        </form>

                        {/* Mobile Categories */}
                        <div className="space-y-1 stagger-children">
                            {categories.map((category) => (
                                <Link
                                    key={category.href}
                                    href={category.href}
                                    className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors hover-lift"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {category.name}
                                </Link>
                            ))}
                        </div>

                        {/* Mobile Auth Buttons */}
                        {!user && (
                            <div className="space-y-2 pt-2 animate-fade-in-scale">
                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    className="w-full border-gray-300 hover:border-blue-400 text-gray-700 hover-lift hover-scale transition-all duration-200"
                                >
                                    <Link
                                        href="/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    className="w-full border-blue-300 hover:border-blue-400 text-blue-600 hover-lift hover-scale transition-all duration-200"
                                >
                                    <Link
                                        href="/admin-login"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Admin Login
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="sm"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover-lift hover-glow transition-all duration-200"
                                >
                                    <Link
                                        href="/register"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Register
                                    </Link>
                                </Button>
                            </div>
                        )}

                        {/* User menu for mobile */}
                        {user && (
                            <div className="pt-2 border-t">
                                <div className="px-4 py-3">
                                    <div className="text-sm font-medium text-gray-900 truncate">
                                        {`${user.firstName} ${user.lastName}` || user.email}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {userRole === 'admin'
                                            ? 'Administrator'
                                            : userRole === 'affiliate'
                                                ? 'Affiliate Partner'
                                                : userRole === 'marketer'
                                                    ? 'Delivery Marketer'
                                                    : 'Customer'}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Link
                                        href="/account"
                                        className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        My Account
                                    </Link>
                                    {userRole === 'admin' && (
                                        <Link
                                            href="/admin"
                                            className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    {userRole === 'affiliate' && (
                                        <Link
                                            href="/affiliate"
                                            className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Affiliate Dashboard
                                        </Link>
                                    )}
                                    {userRole === 'marketer' && (
                                        <Link
                                            href="/marketer"
                                            className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Delivery Dashboard
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => {
                                            logout();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="block w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}