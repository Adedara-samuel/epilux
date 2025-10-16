/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Package } from 'lucide-react';
// 💡 IMPORTANT: Import the new hook
import { useAdminAnalytics } from '@/hooks/useAdmin'; 
// NOTE: useOrderStats is likely not needed if the new hook covers order data

export default function AdminAnalyticsPage() {
    // 💡 FIX: Use the dedicated analytics hook
    const { data: analytics, isLoading } = useAdminAnalytics();
    
    // Fallback data structure for loading/error states
    const fallbackAnalytics = {
        totalRevenue: 0,
        totalOrders: 0,
        totalUsers: 0,
        conversionRate: '0',
        topProducts: [],
        monthlyData: [],
    };
    
    // Safely assign data with fallback
    const data = analytics || fallbackAnalytics;

    // Optional: Add a simple loading state indicator
    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading Analytics Data...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-gray-600">Track your business performance and insights</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {/* Use data.totalRevenue */}
                        <div className="text-2xl font-bold">₦{(data.totalRevenue ? (data.totalRevenue / 1000000).toFixed(1) : '0')}M</div>
                        <div className="flex items-center text-xs text-green-600">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            +12.5% from last month {/* Hardcoded - ideally this comes from backend data */}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {/* Use data.totalOrders */}
                        <div className="text-2xl font-bold">{data.totalOrders.toLocaleString() || 0}</div>
                        <div className="flex items-center text-xs text-green-600">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            +8.2% from last month
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {/* Use data.totalUsers */}
                        <div className="text-2xl font-bold">{data.totalUsers.toLocaleString() || '0'}</div>
                        <div className="flex items-center text-xs text-green-600">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            +15.3% from last month
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {/* Use data.conversionRate (already calculated in hook) */}
                        <div className="text-2xl font-bold">{data.conversionRate || '0'}%</div>
                        <div className="flex items-center text-xs text-red-600">
                            <TrendingDown className="w-3 h-3 mr-1" />
                            -2.1% from last month
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts and Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Performance */}
                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Use data.monthlyData */}
                            {data.monthlyData.length > 0 ? data.monthlyData.map((item) => (
                                <div key={item.month} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                                            {item.month.slice(0, 1)}
                                        </div>
                                        <span className="font-medium">{item.month}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-medium">₦{(item.revenue / 1000).toFixed(0)}K</div>
                                        <div className="text-sm text-gray-500">{item.orders} orders</div>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-8 text-gray-500">
                                    No monthly data available
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Products */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top Performing Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Use data.topProducts */}
                            {data.topProducts.length > 0 ? data.topProducts.map((product, index: number) => (
                                <div key={product.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Badge variant="outline" className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">
                                            {index + 1}
                                        </Badge>
                                        <div>
                                            <div className="font-medium text-sm">{product.name}</div>
                                            <div className="text-xs text-gray-500">{product.sales} units sold</div>
                                        </div>
                                    </div>
                                    <div className="font-medium text-green-600">
                                        ₦{product.revenue.toLocaleString()}
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-8 text-gray-500">
                                    No top products data available
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Additional Insights (Static for now) */}
            {/* These sections are using static/hardcoded data. If you need them to be dynamic, 
                the backend needs to provide those fields (New Customers, Returning %, Channels, Inventory Status) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* ... (Existing static card content) ... */}
                {/* Since the static cards are not the issue, they are omitted for brevity. */}
            </div>
        </div>
    );
}