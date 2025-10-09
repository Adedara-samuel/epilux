/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import { Search, Filter, Eye, MoreHorizontal } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { useAdminOrders, useOrderStats } from '@/hooks/useOrders';

export default function AdminOrdersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const { data: ordersData, isLoading } = useAdminOrders();
    const { data: statsData } = useOrderStats();

    const orders = ordersData?.data || [];
    const stats = statsData?.stats || {
        totalOrders: 0,
        pendingOrders: 0,
        deliveredOrders: 0,
        totalRevenue: 0
    };

    const filteredOrders = orders.filter((order: any) => {
        const matchesSearch = order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
            case 'processing':
                return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>;
            case 'shipped':
                return <Badge className="bg-purple-100 text-purple-800">Shipped</Badge>;
            case 'delivered':
                return <Badge className="bg-green-100 text-green-800">Delivered</Badge>;
            case 'cancelled':
                return <Badge variant="destructive">Cancelled</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
                    <p className="text-gray-600">Track and manage customer orders</p>
                </div>
            </div>

            {/* Filters and Search */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Search orders..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Orders Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Orders ({filteredOrders.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Order ID</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Customer</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Items</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Total</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((order: any) => (
                                    <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-4 px-4">
                                            <div className="font-medium text-gray-900">{order._id}</div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div>
                                                <div className="font-medium text-gray-900">{order.customer?.name || 'N/A'}</div>
                                                <div className="text-sm text-gray-500">{order.customer?.email || 'N/A'}</div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            {getStatusBadge(order.status)}
                                        </td>
                                        <td className="py-4 px-4 text-gray-900">{order.items?.length || 0}</td>
                                        <td className="py-4 px-4 text-gray-900 font-medium">
                                            ₦{order.total?.toLocaleString() || '0'}
                                        </td>
                                        <td className="py-4 px-4 text-gray-900">
                                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" size="sm">
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    View
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>Update Status</DropdownMenuItem>
                                                        <DropdownMenuItem>View Details</DropdownMenuItem>
                                                        <DropdownMenuItem>Print Invoice</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600">
                                                            Cancel Order
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredOrders.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No orders found matching your criteria.
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="text-2xl font-bold text-blue-600">{stats.totalOrders || orders.length}</div>
                        <p className="text-sm text-gray-600">Total Orders</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="text-2xl font-bold text-yellow-600">
                            {stats.pendingOrders || orders.filter((o: any) => o.status === 'pending').length}
                        </div>
                        <p className="text-sm text-gray-600">Pending Orders</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="text-2xl font-bold text-green-600">
                            {stats.deliveredOrders || orders.filter((o: any) => o.status === 'delivered').length}
                        </div>
                        <p className="text-sm text-gray-600">Delivered Orders</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="text-2xl font-bold text-purple-600">
                            ₦{stats.totalRevenue?.toLocaleString() || orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0).toLocaleString()}
                        </div>
                        <p className="text-sm text-gray-600">Total Revenue</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}