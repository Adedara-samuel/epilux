/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { X, ShoppingBag, User, LogOut, Package, Home } from 'lucide-react';
import { useAuth } from '@/app/context/auth-context';
import { Button } from '../ui/button';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const categories = [
    { name: 'Home', href: '/products', icon: Home },
    { name: 'All Products', href: '/products', icon: ShoppingBag },
    { name: 'Sachet Water', href: '/products?category=sachet', icon: Package },
    { name: 'Bottled Water', href: '/products?category=bottled', icon: Package },
    { name: 'Water Dispensers', href: '/products?category=dispenser', icon: Package },
    { name: 'Accessories', href: '/products?category=accessories', icon: Package },
    { name: 'Bulk Orders', href: '/products?category=bulk', icon: Package },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const { user, logout } = useAuth();
    const handleLinkClick = () => {
        onClose();
    };

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
                    onClick={onClose}
                />
            )}

            {/* Sidebar - Now completely fixed */}
            <aside
                className={`fixed top-0 left-0 h-screen w-72 bg-white shadow-xl z-50 transform transition-all duration-300 ease-in-out overflow-y-auto
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:fixed lg:translate-x-0 lg:w-64 lg:shadow-none lg:border-r lg:border-gray-200 lg:bg-gray-50`}
            >
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="p-4 flex items-center justify-between border-b border-gray-200 bg-white text-blue-700 lg:bg-white lg:border-b-0 lg:pt-6 sticky top-0 z-10">
                        <Link href="/" className="flex items-center gap-2" onClick={handleLinkClick}>
                            <img
                                src="/images/logo.png"
                                alt="Epilux Water Logo"
                                className="h-8 w-auto rounded-full border-2 border-white lg:border-gray-200"
                            />
                            <span className="text-xl font-bold text-blue-800 hidden sm:block">
                                Epilux <span className="text-blue-600">Water</span>
                            </span>
                        </Link>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="text-white hover:bg-blue-800 lg:hidden"
                        >
                            <X className="h-6 w-6" />
                        </Button>
                    </div>

                    {/* User Info */}
                    <div className="p-4 border-b border-gray-100 bg-white">
                        {user ? (
                            <Link
                                href="/account"
                                className="flex items-center gap-3 hover:bg-blue-50 p-2 rounded-md transition-colors"
                                onClick={handleLinkClick}
                            >
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || <User size={20} />}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800 text-sm truncate">
                                        {user.displayName || 'My Account'}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {user.email}
                                    </p>
                                </div>
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center gap-3 hover:bg-blue-50 p-2 rounded-md transition-colors"
                                onClick={handleLinkClick}
                            >
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                    <User className="h-5 w-5 text-gray-500" />
                                </div>
                                <p className="font-medium text-gray-700">Sign In</p>
                            </Link>
                        )}
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto bg-white">
                        <div className="p-4 border-b border-gray-100">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
                                Menu
                            </h3>
                            <ul className="space-y-1">
                                {categories.map((item) => (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                            onClick={handleLinkClick}
                                        >
                                            <item.icon className="h-5 w-5 text-blue-600" />
                                            <span className="font-medium">{item.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="p-4">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
                                Account
                            </h3>
                            <ul className="space-y-1">
                                <li>
                                    <Link
                                        href="/account"
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                        onClick={handleLinkClick}
                                    >
                                        <User className="h-5 w-5 text-blue-600" />
                                        <span className="font-medium">My Account</span>
                                    </Link>
                                </li>
                                {user && (
                                    <li>
                                        <button
                                            onClick={async () => {
                                                await logout();
                                                onClose();
                                                window.location.href = '/login';
                                            }}
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-red-600 hover:bg-red-50 w-full text-left transition-colors"
                                        >
                                            <LogOut className="h-5 w-5" />
                                            <span className="font-medium">Sign Out</span>
                                        </button>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </nav>
                </div>
            </aside>
        </>
    );
}