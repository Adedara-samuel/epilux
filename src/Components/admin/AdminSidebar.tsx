'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Package,
    ShoppingCart,
    BarChart3,
    Settings,
    LogOut
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/Components/ui/button';
import { cn } from '@/lib/utils';

const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
];

interface AdminSidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

export function AdminSidebar({ sidebarOpen, setSidebarOpen }: AdminSidebarProps) {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        window.location.href = '/admin-login';
    };

    return (
        <>
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 h-screen",
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-center h-16 px-4 bg-blue-600 border-b border-blue-700">
                        <Link href="/admin/dashboard" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                <span className="text-blue-600 font-bold text-sm">E</span>
                            </div>
                            <span className="text-white font-bold text-lg">Admin Panel</span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group",
                                        isActive
                                            ? "bg-blue-100 text-blue-700 shadow-sm"
                                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                    )}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <item.icon className={cn(
                                        "w-5 h-5 transition-colors",
                                        isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                                    )} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User info and logout */}
                    <div className="p-4 border-t border-gray-200 bg-gray-50">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-semibold text-sm">
                                    {user?.firstName?.charAt(0)?.toUpperCase() || 'A'}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {user?.firstName} {user?.lastName}
                                </p>
                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                            </div>
                        </div>
                        <Button
                            onClick={handleLogout}
                            variant="outline"
                            size="sm"
                            className="w-full flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}