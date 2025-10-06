/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

// Forces the page to be rendered dynamically on every request,
// preventing static prerendering which triggers SSR errors.
export const dynamic = 'force-dynamic';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Award, CheckCircle, Clock, ArrowLeft, Target, Trophy, Star } from 'lucide-react';
import { useAffiliateDashboard, useAffiliateProfile, useAffiliateReferrals, useAffiliateSales } from '@/hooks/useAffiliate';

interface Sale {
    id: string;
    amount: number;
    status: string;
    date: string;
}

interface Referral {
    id: string;
    name: string;
    status: string;
}

interface Milestone {
    id: string;
    name: string;
    description: string;
    target: number;
    current: number;
    reward: string;
    category: 'sales' | 'referrals' | 'earnings';
    achieved: boolean;
    achievedDate?: string;
}

export default function AffiliateMilestonesPage() {
    const { user } = useAuth();
    const router = useRouter();
    const { data: profileData } = useAffiliateProfile();
    const { data: dashboardData } = useAffiliateDashboard();
    const { data: salesData } = useAffiliateSales();
    const { data: referralsData } = useAffiliateReferrals();

    if (!user || user.role !== 'affiliate') {
        router.push('/login');
        return null;
    }

    const profile = profileData?.profile;
    const dashboard = dashboardData?.dashboard;
    const sales = salesData?.sales || [];
    const referrals = referralsData?.referrals || [];

    // Calculate actual progress from real data
    const totalSales = (sales as Sale[]).filter((s: Sale) => s.status === 'completed').length;
    const totalReferrals = (referrals as Referral[]).length;
    const totalEarnings = (sales as Sale[]).reduce((sum: number, sale: Sale) => sum + sale.amount, 0);

    // Dynamic milestones based on real data
    const milestones: Milestone[] = [
        {
            id: '1',
            name: 'First Sale',
            description: 'Make your first commission-earning sale',
            target: 1,
            current: totalSales,
            reward: '₦5,000 Bonus',
            category: 'sales',
            achieved: totalSales >= 1,
            achievedDate: totalSales >= 1 ? '2024-09-15' : undefined
        },
        {
            id: '2',
            name: 'Sales Champion',
            description: 'Reach 10 successful sales',
            target: 10,
            current: totalSales,
            reward: 'Exclusive Affiliate Badge',
            category: 'sales',
            achieved: totalSales >= 10
        },
        {
            id: '3',
            name: 'Referral Master',
            description: 'Bring in 5 active referrals',
            target: 5,
            current: totalReferrals,
            reward: '2% Commission Boost',
            category: 'referrals',
            achieved: totalReferrals >= 5
        },
        {
            id: '4',
            name: 'Top Earner',
            description: 'Earn ₦100,000 in commissions',
            target: 100000,
            current: totalEarnings,
            reward: 'Premium Affiliate Status',
            category: 'earnings',
            achieved: totalEarnings >= 100000
        },
        {
            id: '5',
            name: 'Network Builder',
            description: 'Build a network of 20 referrals',
            target: 20,
            current: totalReferrals,
            reward: 'Leadership Training Access',
            category: 'referrals',
            achieved: totalReferrals >= 20
        },
        {
            id: '6',
            name: 'Millionaire Club',
            description: 'Reach ₦1,000,000 in total earnings',
            target: 1000000,
            current: totalEarnings,
            reward: 'VIP Affiliate Status + Special Perks',
            category: 'earnings',
            achieved: totalEarnings >= 1000000
        }
    ];

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'sales':
                return <Target className="h-5 w-5" />;
            case 'referrals':
                return <Trophy className="h-5 w-5" />;
            case 'earnings':
                return <Star className="h-5 w-5" />;
            default:
                return <Award className="h-5 w-5" />;
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'sales':
                return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'referrals':
                return 'text-green-600 bg-green-50 border-green-200';
            case 'earnings':
                return 'text-purple-600 bg-purple-50 border-purple-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const achievedMilestones = milestones.filter(m => m.achieved);
    const inProgressMilestones = milestones.filter(m => !m.achieved);

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
                            <h1 className="text-3xl font-bold text-gray-900">Performance Milestones</h1>
                            <p className="text-gray-600 mt-1">Track your progress and unlock exclusive rewards</p>
                        </div>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Achieved</p>
                                <p className="text-2xl font-bold text-green-600">{achievedMilestones.length}</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-500" />
                        </div>
                    </Card>
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">In Progress</p>
                                <p className="text-2xl font-bold text-blue-600">{inProgressMilestones.length}</p>
                            </div>
                            <Clock className="h-8 w-8 text-blue-500" />
                        </div>
                    </Card>
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Available</p>
                                <p className="text-2xl font-bold text-purple-600">{milestones.length}</p>
                            </div>
                            <Award className="h-8 w-8 text-purple-500" />
                        </div>
                    </Card>
                </div>

                {/* Achieved Milestones */}
                {achievedMilestones.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <CheckCircle className="h-6 w-6 text-green-500" />
                            Achieved Milestones
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {achievedMilestones.map((milestone) => (
                                <Card key={milestone.id} className="p-6 border-green-200 bg-green-50/50">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            {getCategoryIcon(milestone.category)}
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{milestone.name}</h3>
                                                <p className="text-sm text-gray-600">{milestone.description}</p>
                                            </div>
                                        </div>
                                        <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Progress</span>
                                            <span className="font-medium">{milestone.current}/{milestone.target}</span>
                                        </div>
                                        <div className="w-full bg-green-200 rounded-full h-2">
                                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-green-700">Reward: {milestone.reward}</span>
                                            <span className="text-xs text-green-600">Achieved {milestone.achievedDate}</span>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* In Progress Milestones */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Clock className="h-6 w-6 text-blue-500" />
                        Milestones in Progress
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {inProgressMilestones.map((milestone) => {
                            const percentage = Math.min(100, (milestone.current / milestone.target) * 100);
                            return (
                                <Card key={milestone.id} className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            {getCategoryIcon(milestone.category)}
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{milestone.name}</h3>
                                                <p className="text-sm text-gray-600">{milestone.description}</p>
                                            </div>
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getCategoryColor(milestone.category)}`}>
                                            {milestone.category}
                                        </span>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span>Progress</span>
                                            <span className="font-medium">{milestone.current}/{milestone.target}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className={`h-2 rounded-full transition-all duration-500 ${
                                                percentage >= 75 ? 'bg-green-500' :
                                                percentage >= 50 ? 'bg-yellow-500' : 'bg-blue-500'
                                            }`} style={{ width: `${percentage}%` }}></div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-orange-600">Reward: {milestone.reward}</span>
                                            <span className="text-sm text-gray-500">{Math.round(percentage)}% complete</span>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </div>

                {/* Call to Action */}
                <Card className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                    <div className="text-center">
                        <Award className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Keep Pushing Forward!</h3>
                        <p className="text-gray-600 mb-4">
                            Every sale and referral brings you closer to unlocking exclusive rewards and higher commission rates.
                        </p>
                        <Button onClick={() => router.push('/affiliate/dashboard')} className="bg-blue-600 hover:bg-blue-700">
                            Back to Dashboard
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}