/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useAffiliateProfile, useAffiliateSales, useAffiliateReferrals } from '@/hooks/useAffiliate';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { ArrowLeft, DollarSign, TrendingUp, Users, Award, Edit, Save, X, ShoppingBag, Share2 } from 'lucide-react';

interface Sale {
    id: string;
    amount: number;
    commission: number;
    status: string;
    date: string;
}

interface Referral {
    id: string;
    name: string;
    status: string;
}

export default function AffiliateProfilePage() {
    const { user } = useAuth();
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: '',
        bio: ''
    });

    // API hooks
    const { data: profileData, isLoading: profileLoading } = useAffiliateProfile();
    const { data: salesData, isLoading: salesLoading } = useAffiliateSales();
    const { data: referralsData, isLoading: referralsLoading } = useAffiliateReferrals();

    const profile = profileData?.profile;
    const sales: Sale[] = salesData?.sales || [];
    const referrals: Referral[] = referralsData?.referrals || [];

    if (!user || user.role !== 'affiliate') {
        router.push('/login');
        return null;
    }

    const isLoading = profileLoading || salesLoading || referralsLoading;

    // Calculate statistics
    const totalEarnings = sales.reduce((sum: number, sale: Sale) => sum + sale.amount, 0);
    const totalCommissions = sales.reduce((sum: number, sale: Sale) => sum + sale.commission, 0);
    const completedSales = sales.filter((s: Sale) => s.status === 'completed').length;
    const activeReferrals = referrals.filter((r: Referral) => r.status === 'active').length;

    const handleSaveProfile = () => {
        // TODO: Implement profile update API call
        console.log('Saving profile:', editForm);
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setEditForm({
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: user?.email || '',
            phone: '',
            bio: ''
        });
        setIsEditing(false);
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
                            onClick={() => router.push('/affiliate/dashboard')}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Dashboard
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                            <p className="text-gray-600 mt-1">Manage your account and track your performance</p>
                        </div>
                    </div>
                </div>

                {/* Profile Overview */}
                <Card className="p-6 mb-6">
                    <div className="flex items-start gap-6">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                            {user.firstName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {user.firstName} {user.lastName}
                                    </h2>
                                    <p className="text-gray-600">{user.email}</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Partner ID: {profile?.userId || user.id}
                                    </p>
                                </div>
                                <Button
                                    onClick={() => setIsEditing(!isEditing)}
                                    variant="outline"
                                    className="flex items-center gap-2"
                                >
                                    <Edit className="h-4 w-4" />
                                    {isEditing ? 'Cancel' : 'Edit Profile'}
                                </Button>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                                    <p className="text-2xl font-bold text-blue-600">₦{totalEarnings.toLocaleString()}</p>
                                    <p className="text-sm text-gray-600">Total Earnings</p>
                                </div>
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                                    <p className="text-2xl font-bold text-green-600">{completedSales}</p>
                                    <p className="text-sm text-gray-600">Sales Completed</p>
                                </div>
                                <div className="text-center p-4 bg-purple-50 rounded-lg">
                                    <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                                    <p className="text-2xl font-bold text-purple-600">{activeReferrals}</p>
                                    <p className="text-sm text-gray-600">Active Referrals</p>
                                </div>
                                <div className="text-center p-4 bg-orange-50 rounded-lg">
                                    <Award className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                                    <p className="text-2xl font-bold text-orange-600">Silver</p>
                                    <p className="text-sm text-gray-600">Partner Rank</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Edit Profile Form */}
                {isEditing && (
                    <Card className="p-6 mb-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Edit Profile</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <Input
                                    value={editForm.firstName}
                                    onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <Input
                                    value={editForm.lastName}
                                    onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <Input
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <Input
                                    value={editForm.phone}
                                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                <Input
                                    value={editForm.bio}
                                    onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                                    placeholder="Tell us about yourself..."
                                />
                            </div>
                        </div>
                        <div className="flex gap-4 mt-6">
                            <Button onClick={handleSaveProfile} className="flex items-center gap-2">
                                <Save className="h-4 w-4" />
                                Save Changes
                            </Button>
                            <Button variant="outline" onClick={handleCancelEdit} className="flex items-center gap-2">
                                <X className="h-4 w-4" />
                                Cancel
                            </Button>
                        </div>
                    </Card>
                )}

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <ShoppingBag className="h-5 w-5" />
                            My Orders
                        </h3>
                        <p className="text-gray-600 mb-4">View and manage your sales orders</p>
                        <Button onClick={() => router.push('/affiliate/orders')} className="w-full">
                            View Orders
                        </Button>
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Share2 className="h-5 w-5" />
                            Marketing Tools
                        </h3>
                        <p className="text-gray-600 mb-4">Access marketing assets and tools</p>
                        <Button onClick={() => router.push('/affiliate/marketing')} className="w-full">
                            Marketing Assets
                        </Button>
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Award className="h-5 w-5" />
                            Settings
                        </h3>
                        <p className="text-gray-600 mb-4">Manage your account settings</p>
                        <Button onClick={() => router.push('/affiliate/settings')} className="w-full">
                            Account Settings
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
}