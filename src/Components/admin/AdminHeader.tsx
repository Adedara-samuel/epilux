'use client';

import { Menu, Bell, Search } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { usePathname } from 'next/navigation';

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
    const { user } = useAuth();
    const pathname = usePathname();

    const currentPage = navigation.find(item => item.href === pathname)?.name || 'Admin Panel';

    return (
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left side - Mobile menu button and page title */}
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
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
                            className="md:hidden"
                        >
                            <Search className="w-5 h-5" />
                        </Button>

                        {/* Notifications */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative"
                        >
                            <Bell className="w-5 h-5" />
                            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                                3
                            </span>
                        </Button>

                        {/* User info */}
                        <div className="hidden sm:flex items-center gap-3">
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
    );
}