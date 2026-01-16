/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, MoreHorizontal, CheckCircle } from 'lucide-react';
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
import { useAdminOrders, useUpdateOrderStatus, useCancelOrder } from '@/hooks/useOrders';

export default function AdminOrdersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

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

    const { data: ordersData, isLoading } = useAdminOrders();
    const updateOrderStatusMutation = useUpdateOrderStatus();
    const cancelOrderMutation = useCancelOrder();

    const orders = ordersData?.data || [];

    const filteredOrders = orders.filter((order: any) => {
        const matchesSearch = order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
        // PUT /api/orders/:id - Update order status
        updateOrderStatusMutation.mutate({ id: orderId, status: newStatus });
    };

    const handleCancelOrder = (orderId: string) => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            // DELETE /api/orders/:id - Cancel order
            cancelOrderMutation.mutate(orderId);
        }
    };

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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
                <div className="container mx-auto px-4 sm:px-6 py-4 lg:py-6">
                    <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent animate-bounceIn">
                                Orders Management
                            </h1>
                            <p className="text-gray-600 mt-1 animate-fadeIn animation-delay-300 text-sm sm:text-base">Track and manage customer orders</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 py-6 lg:py-8">

                {/* Filters and Search */}
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl mb-6 animate-fadeIn animation-delay-700">
                    <CardContent className="p-4 md:p-6">
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Search orders..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 bg-white/50 border-gray-200"
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 lg:gap-4">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 hover-lift min-w-0"
                                >
                                    <option value="all">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                                <Button variant="outline" className="flex items-center gap-2 hover-lift whitespace-nowrap">
                                    <Filter className="w-4 h-4" />
                                    More Filters
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Orders List */}
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl animate-fadeIn animation-delay-900">
                    <CardHeader>
                        <CardTitle>Orders ({filteredOrders.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {/* Desktop Table View */}
                        <div className="hidden lg:block">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-6 font-medium text-gray-900">Order ID</th>
                                            <th className="text-left py-3 px-6 font-medium text-gray-900">Customer</th>
                                            <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                                            <th className="text-left py-3 px-6 font-medium text-gray-900">Items</th>
                                            <th className="text-left py-3 px-6 font-medium text-gray-900">Total</th>
                                            <th className="text-left py-3 px-6 font-medium text-gray-900">Date</th>
                                            <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredOrders.map((order: any) => (
                                            <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-4 px-6">
                                                    <div className="font-medium text-gray-900">{order._id}</div>
                                                    {order.deliveryConfirmed && (
                                                        <div className="flex items-center gap-1 mt-1">
                                                            <CheckCircle className="w-3 h-3 text-green-600" />
                                                            <span className="text-xs text-green-600">Receipt Confirmed</span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div>
                                                        <div className="font-medium text-gray-900">{order.customer?.name || 'N/A'}</div>
                                                        <div className="text-sm text-gray-500">{order.customer?.email || 'N/A'}</div>
                                                        {order.marketerId && (
                                                            <div className="text-xs text-blue-600 mt-1">
                                                                Marketer: #{order.marketerId}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex flex-col gap-1">
                                                        {getStatusBadge(order.status)}
                                                        {order.deliveryConfirmed && order.status === 'delivered' && (
                                                            <Badge className="bg-green-100 text-green-800 text-xs">Confirmed</Badge>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-gray-900">{order.items?.length || 0}</td>
                                                <td className="py-4 px-6 text-gray-900 font-medium">
                                                    ₦{order.total?.toLocaleString() || '0'}
                                                </td>
                                                <td className="py-4 px-6 text-gray-900">
                                                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-2">
                                                        <Button variant="outline" size="sm" className="hover-lift">
                                                            <Eye className="w-4 h-4 mr-1" />
                                                            View
                                                        </Button>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="sm" className="hover-lift">
                                                                    <MoreHorizontal className="w-4 h-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem
                                                                    className="cursor-pointer"
                                                                    onClick={() => {
                                                                        const newStatus = prompt('Enter new status (pending, processing, shipped, delivered, cancelled):', order.status);
                                                                        if (newStatus && ['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(newStatus)) {
                                                                            handleUpdateOrderStatus(order._id, newStatus);
                                                                        }
                                                                    }}
                                                                >
                                                                    Update Status
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="cursor-pointer">View Details</DropdownMenuItem>
                                                                <DropdownMenuItem className="cursor-pointer">Print Invoice</DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    className="text-red-600 cursor-pointer"
                                                                    onClick={() => handleCancelOrder(order._id)}
                                                                >
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
                        </div>

                        {/* Mobile Card View */}
                        <div className="lg:hidden">
                            <div className="divide-y divide-gray-200">
                                {filteredOrders.map((order: any) => (
                                    <div key={order._id} className="p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-medium text-gray-900 text-sm truncate">{order._id}</span>
                                                    {order.deliveryConfirmed && (
                                                        <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
                                                    )}
                                                </div>
                                                <div className="text-xs text-gray-500 truncate">{order.customer?.email || 'N/A'}</div>
                                            </div>
                                            <div className="flex flex-col items-end gap-1 ml-2">
                                                {getStatusBadge(order.status)}
                                                {order.deliveryConfirmed && order.status === 'delivered' && (
                                                    <Badge className="bg-green-100 text-green-800 text-xs">Confirmed</Badge>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                                            <div>
                                                <span className="text-gray-500">Customer:</span>
                                                <div className="font-medium text-gray-900 truncate">{order.customer?.name || 'N/A'}</div>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Items:</span>
                                                <div className="font-medium text-gray-900">{order.items?.length || 0}</div>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Total:</span>
                                                <div className="font-medium text-gray-900">₦{order.total?.toLocaleString() || '0'}</div>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Date:</span>
                                                <div className="font-medium text-gray-900 text-xs">
                                                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                                                </div>
                                            </div>
                                        </div>

                                        {order.marketerId && (
                                            <div className="text-xs text-blue-600 mb-3">
                                                Marketer: #{order.marketerId}
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between">
                                            <Button variant="outline" size="sm" className="flex-1 mr-2 hover-lift">
                                                <Eye className="w-4 h-4 mr-1" />
                                                View
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="hover-lift">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        className="cursor-pointer"
                                                        onClick={() => {
                                                            const newStatus = prompt('Enter new status (pending, processing, shipped, delivered, cancelled):', order.status);
                                                            if (newStatus && ['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(newStatus)) {
                                                                handleUpdateOrderStatus(order._id, newStatus);
                                                            }
                                                        }}
                                                    >
                                                        Update Status
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="cursor-pointer">View Details</DropdownMenuItem>
                                                    <DropdownMenuItem className="cursor-pointer">Print Invoice</DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-red-600 cursor-pointer"
                                                        onClick={() => handleCancelOrder(order._id)}
                                                    >
                                                        Cancel Order
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {filteredOrders.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                <div className="text-lg mb-2">📦</div>
                                No orders found matching your criteria.
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 animate-fadeIn animation-delay-1100">
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover-glow">
                        <CardContent className="p-4 lg:p-6">
                            <div className="text-xl lg:text-2xl font-bold text-blue-600">{orders.length}</div>
                            <p className="text-xs lg:text-sm text-gray-600">Total Orders</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover-glow">
                        <CardContent className="p-4 lg:p-6">
                            <div className="text-xl lg:text-2xl font-bold text-yellow-600">
                                {orders.filter((o: any) => o.status === 'pending').length}
                            </div>
                            <p className="text-xs lg:text-sm text-gray-600">Pending Orders</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover-glow">
                        <CardContent className="p-4 lg:p-6">
                            <div className="text-xl lg:text-2xl font-bold text-green-600">
                                {orders.filter((o: any) => o.status === 'delivered').length}
                            </div>
                            <p className="text-xs lg:text-sm text-gray-600">Delivered Orders</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover-glow">
                        <CardContent className="p-4 lg:p-6">
                            <div className="text-xl lg:text-2xl font-bold text-teal-600">
                                {orders.filter((o: any) => o.deliveryConfirmed).length}
                            </div>
                            <p className="text-xs lg:text-sm text-gray-600">Confirmed Deliveries</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover-glow sm:col-span-2 lg:col-span-1">
                        <CardContent className="p-4 lg:p-6">
                            <div className="text-lg lg:text-2xl font-bold text-purple-600">
                                ₦{orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0).toLocaleString()}
                            </div>
                            <p className="text-xs lg:text-sm text-gray-600">Total Revenue</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}