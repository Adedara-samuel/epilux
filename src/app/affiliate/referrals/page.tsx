/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useAffiliateReferrals } from '@/hooks/useAffiliate';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { ArrowLeft, Users, Search, Filter, Mail, Phone, Calendar, DollarSign, TrendingUp, Award } from 'lucide-react';

interface Referral {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    joinDate: string;
    status: string;
    sales: number;
    commission: number;
    lastActivity?: string;
}

export default function AffiliateReferralsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const { data: referralsData, isLoading } = useAffiliateReferrals();
    const referrals: Referral[] = referralsData?.referrals || [];

    if (!user || user.role !== 'affiliate') {
        router.push('/login');
        return null;
    }

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return { text: 'Active', class: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
            case 'promising':
                return { text: 'Promising', class: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
            case 'inactive':
                return { text: 'Inactive', class: 'bg-gray-100 text-gray-600 border-gray-200' };
            default:
                return { text: status, class: 'bg-blue-100 text-blue-700 border-blue-200' };
        }
    };

    const filteredReferrals = referrals.filter(referral => {
        const matchesSearch = referral.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (referral.email && referral.email.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = statusFilter === 'all' || referral.status.toLowerCase() === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalReferrals = referrals.length;
    const activeReferrals = referrals.filter(r => r.status.toLowerCase() === 'active').length;
    const totalCommission = referrals.reduce((sum, r) => sum + r.commission, 0);
    const totalSales = referrals.reduce((sum, r) => sum + r.sales, 0);

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
                            onClick={() => router.push('/affiliate/dashboard')}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Dashboard
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">My Referrals</h1>
                            <p className="text-gray-600 mt-1">Track and manage your referral network</p>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Users className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{totalReferrals}</p>
                                <p className="text-sm text-gray-600">Total Referrals</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <TrendingUp className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{activeReferrals}</p>
                                <p className="text-sm text-gray-600">Active Referrals</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <DollarSign className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">₦{totalCommission.toLocaleString()}</p>
                                <p className="text-sm text-gray-600">Total Commission</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-orange-100 rounded-lg">
                                <Award className="h-6 w-6 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{totalSales}</p>
                                <p className="text-sm text-gray-600">Total Sales</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Filters and Search */}
                <Card className="p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search referrals by name or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={statusFilter === 'all' ? 'default' : 'outline'}
                                onClick={() => setStatusFilter('all')}
                                size="sm"
                            >
                                All
                            </Button>
                            <Button
                                variant={statusFilter === 'active' ? 'default' : 'outline'}
                                onClick={() => setStatusFilter('active')}
                                size="sm"
                            >
                                Active
                            </Button>
                            <Button
                                variant={statusFilter === 'promising' ? 'default' : 'outline'}
                                onClick={() => setStatusFilter('promising')}
                                size="sm"
                            >
                                Promising
                            </Button>
                            <Button
                                variant={statusFilter === 'inactive' ? 'default' : 'outline'}
                                onClick={() => setStatusFilter('inactive')}
                                size="sm"
                            >
                                Inactive
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Referrals List */}
                <Card className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Referral Details</h3>

                    {filteredReferrals.length > 0 ? (
                        <div className="space-y-4">
                            {filteredReferrals.map((referral) => {
                                const badge = getStatusBadge(referral.status);
                                return (
                                    <div
                                        key={referral.id}
                                        className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                                                    {referral.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-semibold text-gray-900">{referral.name}</h4>
                                                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                                        <span className="flex items-center gap-1">
                                                            <Mail className="h-4 w-4" />
                                                            {referral.email || 'No email'}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="h-4 w-4" />
                                                            Joined {new Date(referral.joinDate).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    {referral.lastActivity && (
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            Last active: {new Date(referral.lastActivity).toLocaleDateString()}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${badge.class}`}>
                                                    {badge.text}
                                                </span>
                                                <div className="mt-2 space-y-1">
                                                    <p className="text-sm text-gray-600">
                                                        <span className="font-medium">{referral.sales}</span> sales
                                                    </p>
                                                    <p className="text-sm font-bold text-green-600">
                                                        ₦{referral.commission.toLocaleString()} commission
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                                            <Button variant="outline" size="sm">
                                                <Mail className="h-4 w-4 mr-2" />
                                                Send Message
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                View Details
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No referrals found</h3>
                            <p className="text-gray-600">
                                {searchTerm || statusFilter !== 'all'
                                    ? 'Try adjusting your search or filter criteria.'
                                    : 'You haven\'t referred anyone yet. Start sharing your referral link!'}
                            </p>
                            {(searchTerm || statusFilter !== 'all') && (
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearchTerm('');
                                        setStatusFilter('all');
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