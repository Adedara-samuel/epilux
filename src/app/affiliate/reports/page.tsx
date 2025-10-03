'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useAffiliateSales } from '@/hooks/useAffiliate';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
// Select component not available, using simple select
import { ArrowLeft, Download, Filter, DollarSign, TrendingUp, Calendar } from 'lucide-react';

interface Sale {
    id: string;
    productName: string;
    amount: number;
    commission: number;
    date: string;
    status: string;
    type: string;
}

export default function AffiliateReportsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const { data: salesData, isLoading } = useAffiliateSales();
    const sales: Sale[] = salesData?.sales || [];

    const [dateFilter, setDateFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');

    if (!user || user.role !== 'affiliate') {
        router.push('/login');
        return null;
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Filter sales based on selected filters
    const filteredSales = sales.filter((sale: Sale) => {
        const matchesDate = dateFilter === 'all' ||
            (dateFilter === 'this-month' && new Date(sale.date).getMonth() === new Date().getMonth()) ||
            (dateFilter === 'last-month' && new Date(sale.date).getMonth() === new Date().getMonth() - 1);

        const matchesStatus = statusFilter === 'all' || sale.status === statusFilter;
        const matchesType = typeFilter === 'all' || sale.type === typeFilter;

        return matchesDate && matchesStatus && matchesType;
    });

    // Calculate totals
    const totalEarnings = filteredSales.reduce((sum: number, sale: Sale) => sum + sale.amount, 0);
    const totalCommissions = filteredSales.reduce((sum: number, sale: Sale) => sum + sale.commission, 0);
    const completedSales = filteredSales.filter((sale: Sale) => sale.status === 'completed').length;

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const handleExport = () => {
        // Mock export functionality
        const csvContent = [
            ['Date', 'Amount', 'Commission', 'Status', 'Type', 'Transaction ID'],
            ...filteredSales.map((sale: Sale) => [
                sale.date,
                sale.amount.toString(),
                sale.commission.toString(),
                sale.status,
                sale.type,
                sale.id
            ])
        ].map((row: string[]) => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'affiliate-report.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            onClick={() => router.push('/affiliate/dashboard')}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Dashboard
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Commission Reports</h1>
                            <p className="text-gray-600 mt-1">Detailed view of your earnings and performance</p>
                        </div>
                    </div>
                    <Button onClick={handleExport} className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Export CSV
                    </Button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                                <p className="text-2xl font-bold text-green-600">₦{totalEarnings.toLocaleString()}</p>
                            </div>
                            <DollarSign className="h-8 w-8 text-green-500" />
                        </div>
                    </Card>
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Commissions</p>
                                <p className="text-2xl font-bold text-blue-600">₦{totalCommissions.toLocaleString()}</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-blue-500" />
                        </div>
                    </Card>
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Completed Sales</p>
                                <p className="text-2xl font-bold text-purple-600">{completedSales}</p>
                            </div>
                            <Calendar className="h-8 w-8 text-purple-500" />
                        </div>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="p-6 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <Filter className="h-5 w-5 text-gray-500" />
                        <h3 className="text-lg font-semibold">Filters</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                            <select
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Time</option>
                                <option value="this-month">This Month</option>
                                <option value="last-month">Last Month</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Status</option>
                                <option value="completed">Completed</option>
                                <option value="pending">Pending</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Types</option>
                                <option value="Sales">Sales</option>
                                <option value="Referral">Referral</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setDateFilter('all');
                                    setStatusFilter('all');
                                    setTypeFilter('all');
                                }}
                            >
                                Clear Filters
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Transactions Table */}
                <Card className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Transaction History</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredSales.map((sale: Sale) => (
                                    <tr key={sale.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(sale.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            ₦{sale.amount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                            ₦{sale.commission.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(sale.status)}`}>
                                                {sale.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {sale.type}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                                            {sale.id}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredSales.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                No transactions found matching your filters.
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}