/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useAffiliateSales } from '@/hooks/useAffiliate';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { ArrowLeft, Search, Filter, ShoppingBag, DollarSign, Calendar, Eye, Download } from 'lucide-react';

interface Sale {
    id: string;
    customerName?: string;
    customerEmail?: string;
    amount: number;
    commission: number;
    status: string;
    date: string;
    products?: string[];
    orderId?: string;
}

export default function AffiliateOrdersPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');

    const { data: salesData, isLoading } = useAffiliateSales();
    const sales: Sale[] = salesData?.sales || [];

    if (!user || user.role !== 'affiliate') {
        router.push('/login');
        return null;
    }

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return { text: 'Completed', class: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
            case 'pending':
                return { text: 'Pending', class: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
            case 'cancelled':
                return { text: 'Cancelled', class: 'bg-red-100 text-red-700 border-red-200' };
            default:
                return { text: status, class: 'bg-gray-100 text-gray-600 border-gray-200' };
        }
    };

    const filteredSales = sales.filter(sale => {
        const matchesSearch = !searchTerm ||
            (sale.customerName && sale.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (sale.customerEmail && sale.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
            sale.id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || sale.status.toLowerCase() === statusFilter;

        let matchesDate = true;
        if (dateFilter !== 'all') {
            const saleDate = new Date(sale.date);
            const now = new Date();
            const daysDiff = Math.floor((now.getTime() - saleDate.getTime()) / (1000 * 3600 * 24));

            switch (dateFilter) {
                case 'today':
                    matchesDate = daysDiff === 0;
                    break;
                case 'week':
                    matchesDate = daysDiff <= 7;
                    break;
                case 'month':
                    matchesDate = daysDiff <= 30;
                    break;
            }
        }

        return matchesSearch && matchesStatus && matchesDate;
    });

    const totalOrders = sales.length;
    const completedOrders = sales.filter(s => s.status.toLowerCase() === 'completed').length;
    const totalEarnings = sales.reduce((sum, s) => sum + s.commission, 0);
    const pendingOrders = sales.filter(s => s.status.toLowerCase() === 'pending').length;

    const exportToCSV = () => {
        const headers = ['Order ID', 'Customer', 'Email', 'Amount', 'Commission', 'Status', 'Date'];
        const csvData = filteredSales.map(sale => [
            sale.id,
            sale.customerName || 'N/A',
            sale.customerEmail || 'N/A',
            sale.amount,
            sale.commission,
            sale.status,
            new Date(sale.date).toLocaleDateString()
        ]);

        const csvContent = [headers, ...csvData]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `affiliate-orders-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            onClick={() => router.push('/affiliate/profile')}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Profile
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                            <p className="text-gray-600 mt-1">Track your sales and commission earnings</p>
                        </div>
                    </div>
                    <Button onClick={exportToCSV} className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Export CSV
                    </Button>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <ShoppingBag className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
                                <p className="text-sm text-gray-600">Total Orders</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <DollarSign className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">₦{totalEarnings.toLocaleString()}</p>
                                <p className="text-sm text-gray-600">Total Commission</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-100 rounded-lg">
                                <Calendar className="h-6 w-6 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{completedOrders}</p>
                                <p className="text-sm text-gray-600">Completed Orders</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <Eye className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
                                <p className="text-sm text-gray-600">Pending Orders</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search orders by ID, customer name, or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Status</option>
                                <option value="completed">Completed</option>
                                <option value="pending">Pending</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                            <select
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Time</option>
                                <option value="today">Today</option>
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                            </select>
                        </div>
                    </div>
                </Card>

                {/* Orders List */}
                <Card className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Order History</h3>

                    {filteredSales.length > 0 ? (
                        <div className="space-y-4">
                            {filteredSales.map((sale) => {
                                const badge = getStatusBadge(sale.status);
                                return (
                                    <div
                                        key={sale.id}
                                        className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h4 className="text-lg font-semibold text-gray-900">Order #{sale.id}</h4>
                                                <p className="text-sm text-gray-600">
                                                    {sale.customerName && `Customer: ${sale.customerName}`}
                                                    {sale.customerEmail && ` • ${sale.customerEmail}`}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${badge.class}`}>
                                                    {badge.text}
                                                </span>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {new Date(sale.date).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                            <div>
                                                <p className="text-sm text-gray-600">Order Value</p>
                                                <p className="text-lg font-bold text-gray-900">₦{sale.amount.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Your Commission</p>
                                                <p className="text-lg font-bold text-green-600">₦{sale.commission.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Commission Rate</p>
                                                <p className="text-lg font-bold text-blue-600">
                                                    {((sale.commission / sale.amount) * 100).toFixed(1)}%
                                                </p>
                                            </div>
                                        </div>

                                        {sale.products && sale.products.length > 0 && (
                                            <div className="mb-4">
                                                <p className="text-sm text-gray-600 mb-2">Products:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {sale.products.map((product, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                                                        >
                                                            {product}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex gap-2 pt-4 border-t border-gray-100">
                                            <Button variant="outline" size="sm">
                                                <Eye className="h-4 w-4 mr-2" />
                                                View Details
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                Contact Customer
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                            <p className="text-gray-600">
                                {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                                    ? 'Try adjusting your search or filter criteria.'
                                    : 'You haven\'t made any sales yet. Keep sharing your referral link!'}
                            </p>
                            {(searchTerm || statusFilter !== 'all' || dateFilter !== 'all') && (
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearchTerm('');
                                        setStatusFilter('all');
                                        setDateFilter('all');
                                    }}
                                    className="mt-4"
                                >
                                    Clear Filters
                                </Button>
                            )}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}