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
    LogOut, UserCheck, Percent, ChevronLeft, ChevronRight, Menu, X, Bell, DollarSign
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/Components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, key: 'dashboard' },
    { name: 'Users', href: '/admin/users', icon: Users, key: 'users' },
    { name: 'Products', href: '/admin/products', icon: Package, key: 'products' },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart, key: 'orders' },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3, key: 'analytics' },
    { name: 'Commission Rates', href: '/admin/commissions', icon: Percent, key: 'commissions' },
    { name: 'Notifications', href: '/admin/notifications', icon: Bell, key: 'notifications' },
    { name: 'Withdrawals', href: '/admin/withdrawals', icon: DollarSign, key: 'withdrawals' },
    { name: 'Settings', href: '/admin/settings', icon: Settings, key: 'settings' },
    { name: 'Marketers', href: '/admin/marketers', icon: UserCheck, key: 'marketers' },
];


export function AdminSidebar() {
    const pathname = usePathname();
    const { user, logout, token } = useAuth();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
            {/* Desktop Sidebar */}
            <div className={cn(
                "hidden lg:flex fixed inset-y-0 left-0 z-40 bg-white/95 backdrop-blur-sm border-r border-gray-200 shadow-2xl rounded-r-2xl transition-all duration-300 ease-in-out",
                sidebarCollapsed ? "w-16" : "w-64"
            )}>
                <div className="flex flex-col w-full">
                    {/* Logo and Collapse Button */}
                    <div className="flex items-center justify-between h-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700 border-b border-blue-500">
                        {!sidebarCollapsed && (
                            <button
                                onClick={() => window.location.href = '/admin'}
                                className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity flex-1"
                            >
                                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                    <span className="text-blue-600 font-bold text-sm">E</span>
                                </div>
                                <span className="text-white font-bold text-lg">Admin</span>
                            </button>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                const newCollapsed = !sidebarCollapsed;
                                setSidebarCollapsed(newCollapsed);
                                // Dispatch custom event for layout to adjust
                                window.dispatchEvent(new CustomEvent('sidebarCollapse', {
                                    detail: { collapsed: newCollapsed }
                                }));
                            }}
                            className="text-white hover:bg-white/20 h-8 w-8"
                        >
                            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                        </Button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-3 py-6 space-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href || (item.href === '/admin' && pathname === '/admin/dashboard');
                            return (
                                <Link
                                    key={item.key}
                                    href={item.href}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group cursor-pointer",
                                        sidebarCollapsed ? "justify-center px-2" : "",
                                        isActive
                                            ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-200"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    )}
                                >
                                    <item.icon className={cn(
                                        "w-5 h-5 transition-colors flex-shrink-0",
                                        isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                                    )} />
                                    {!sidebarCollapsed && <span className="truncate">{item.name}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User info and logout */}
                    <div className="p-4 border-t border-gray-200 bg-gray-50">
                        {!sidebarCollapsed ? (
                            <>
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
                                    className="w-full flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 transition-colors cursor-pointer"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 font-semibold text-xs">
                                        {user?.firstName?.charAt(0)?.toUpperCase() || 'A'}
                                    </span>
                                </div>
                                <Button
                                    onClick={handleLogout}
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-600 hover:bg-red-50 h-8 w-8"
                                >
                                    <LogOut className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
                <div className="flex items-center overflow-x-auto px-2 py-2">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href || (item.href === '/admin' && pathname === '/admin/dashboard');
                        return (
                            <Link
                                key={item.key}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 min-w-0 flex-shrink-0",
                                    isActive
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-gray-600 hover:bg-gray-50"
                                )}
                            >
                                <item.icon className="w-5 h-5 mb-1" />
                                <span className="text-xs font-medium truncate">{item.name}</span>
                            </Link>
                        );
                    })}
                </div>

            </div>

        </>
    );
}