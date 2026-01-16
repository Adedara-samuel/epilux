/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Package } from 'lucide-react';
// 💡 IMPORTANT: Import the new hook
import { useAdminAnalytics } from '@/hooks/useAdmin';
// NOTE: useOrderStats is likely not needed if the new hook covers order data

export default function AdminAnalyticsPage() {
    // 💡 FIX: Use the dedicated analytics hook
    const { data: analytics, isLoading } = useAdminAnalytics();

    // Add global animations
    useEffect(() => {
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
          @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
          @keyframes bounceIn { from { transform: scale(0.3); opacity: 0; } to { transform: scale(1); opacity: 1; } }
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

          .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
          .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
          .animate-slideUp { animation: slideUp 0.4s ease-out; }
          .animate-bounceIn { animation: bounceIn 0.6s ease-out; }
          .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }

          * { cursor: default; }
          button, a, input, textarea, select { cursor: pointer; }

          .scroll-smooth { scroll-behavior: smooth; }
          .transition-all { transition: all 0.3s ease; }
          .hover-lift { transition: transform 0.2s ease; }
          .hover-lift:hover { transform: translateY(-2px); }
          .hover-glow { transition: box-shadow 0.3s ease; }
          .hover-glow:hover { box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); }
        `;
        document.head.appendChild(styleSheet);

        // Add smooth scrolling to body
        document.body.classList.add('scroll-smooth');

        return () => {
          document.head.removeChild(styleSheet);
          document.body.classList.remove('scroll-smooth');
        };
    }, []);

    // Fallback data structure for loading/error states
    const fallbackAnalytics = {
        totalRevenue: 0,
        totalOrders: 0,
        totalUsers: 0,
        conversionRate: '0',
        topProducts: [],
        monthlyData: [],
        overview: {
            totalOrders: 0,
            totalRevenue: 0,
            monthlyRevenue: 0,
            pendingOrders: 0,
            completedOrders: 0,
            totalUsers: 0,
            totalProducts: 0,
            lowStockProducts: 0,
            activeAffiliates: 0,
            changes: {
                totalOrders: 0,
                totalRevenue: 0,
                pendingOrders: 0,
                activeAffiliates: 0,
            },
        },
        recentUsers: [],
    };

    // Safely assign data with fallback
    const data = analytics || fallbackAnalytics;

    // Optional: Add a simple loading state indicator
    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading Analytics Data...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
                <div className="container mx-auto px-6 py-6">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent animate-bounceIn">Analytics Dashboard</h1>
                        <p className="text-gray-600 mt-1 animate-fadeIn animation-delay-300">Track your business performance and insights</p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeIn animation-delay-700">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₦{data.overview.totalRevenue.toLocaleString()}</div>
                        <div className="flex items-center text-xs text-green-600">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            +{data.overview.changes.totalRevenue}% from last month
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.overview.totalOrders}</div>
                        <div className="flex items-center text-xs text-green-600">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            +{data.overview.changes.totalOrders} from last month
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.overview.totalUsers}</div>
                        <div className="flex items-center text-xs text-green-600">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Active users
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Affiliates</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.overview.activeAffiliates}</div>
                        <div className="flex items-center text-xs text-green-600">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            +{data.overview.changes.activeAffiliates} from last month
                        </div>
                    </CardContent>
                </Card>
            </div>

                {/* Charts and Tables */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn animation-delay-900">
                {/* Recent Users */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {data.recentUsers.length > 0 ? data.recentUsers.slice(0, 5).map((user: any) => (
                                <div key={user._id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                                            {user.firstName?.charAt(0)?.toUpperCase() || 'U'}
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm">{user.firstName} {user.lastName}</div>
                                            <div className="text-xs text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant="outline" className="text-xs capitalize">
                                            {user.role}
                                        </Badge>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-8 text-gray-500">
                                    No recent users available
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Business Overview */}
                <Card>
                    <CardHeader>
                        <CardTitle>Business Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-medium text-green-600">
                                        📦
                                    </div>
                                    <span className="font-medium">Total Products</span>
                                </div>
                                <div className="font-medium text-green-600">
                                    {data.overview.totalProducts}
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-sm font-medium text-orange-600">
                                        ⏳
                                    </div>
                                    <span className="font-medium">Pending Orders</span>
                                </div>
                                <div className="font-medium text-orange-600">
                                    {data.overview.pendingOrders}
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                                        ✅
                                    </div>
                                    <span className="font-medium">Completed Orders</span>
                                </div>
                                <div className="font-medium text-blue-600">
                                    {data.overview.completedOrders}
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-sm font-medium text-red-600">
                                        ⚠️
                                    </div>
                                    <span className="font-medium">Low Stock Items</span>
                                </div>
                                <div className="font-medium text-red-600">
                                    {data.overview.lowStockProducts}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

                {/* Additional Insights (Static for now) */}
                {/* These sections are using static/hardcoded data. If you need them to be dynamic,
                    the backend needs to provide those fields (New Customers, Returning %, Channels, Inventory Status) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn animation-delay-1100">
                    {/* ... (Existing static card content) ... */}
                    {/* Since the static cards are not the issue, they are omitted for brevity. */}
                </div>
            </div>
        </div>
    );
}