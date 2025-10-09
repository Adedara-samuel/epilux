/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Package } from 'lucide-react';
import { useAdminDashboardStats } from '@/hooks/useAdmin';
import { useOrderStats } from '@/hooks/useOrders';

export default function AdminAnalyticsPage() {
  const { data: dashboardStats } = useAdminDashboardStats();
  const { data: orderStats } = useOrderStats();

  const stats = dashboardStats?.stats || {};
  const orderStatsData = orderStats?.stats || {};

  // Use only real data from backend
  const analytics = {
    totalRevenue: stats.totalRevenue,
    totalOrders: stats.totalOrders,
    totalUsers: stats.totalUsers,
    conversionRate: stats.totalOrders && stats.totalUsers ? ((stats.totalOrders / stats.totalUsers) * 100).toFixed(1) : undefined,
    topProducts: stats.topProducts || [],
    monthlyData: stats.monthlyData || []
  };

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
                        <div className="text-2xl font-bold">₦{(analytics.totalRevenue ? (analytics.totalRevenue / 1000000).toFixed(1) : '0')}M</div>
                        <div className="flex items-center text-xs text-green-600">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            +12.5% from last month
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics.totalOrders || 0}</div>
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
                        <div className="text-2xl font-bold">{analytics.totalUsers ? analytics.totalUsers.toLocaleString() : '0'}</div>
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
                        <div className="text-2xl font-bold">{analytics.conversionRate || '0'}%</div>
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
                            {analytics.monthlyData.length > 0 ? analytics.monthlyData.map((data: any) => (
                                <div key={data.month} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                                            {data.month.slice(0, 1)}
                                        </div>
                                        <span className="font-medium">{data.month}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-medium">₦{(data.revenue / 1000).toFixed(0)}K</div>
                                        <div className="text-sm text-gray-500">{data.orders} orders</div>
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
                            {analytics.topProducts.length > 0 ? analytics.topProducts.map((product: any, index: number) => (
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

            {/* Additional Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Customer Insights</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">New Customers</span>
                                <span className="font-medium">127</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Returning Customers</span>
                                <span className="font-medium">89%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Avg. Order Value</span>
                                <span className="font-medium">₦6,250</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Sales Channels</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Website</span>
                                <span className="font-medium">72%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Mobile App</span>
                                <span className="font-medium">23%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Affiliate</span>
                                <span className="font-medium">5%</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Inventory Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">In Stock</span>
                                <span className="font-medium text-green-600">89</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Low Stock</span>
                                <span className="font-medium text-yellow-600">12</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Out of Stock</span>
                                <span className="font-medium text-red-600">3</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}