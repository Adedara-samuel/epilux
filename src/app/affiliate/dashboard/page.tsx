/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { Award } from 'lucide-react';
import { Header } from '@/Components/affiliate/header';
import { AffiliateStats } from '@/Components/affiliate/AffiliateStats';
import { SalesTracker } from '@/Components/affiliate/SalesTracker';
import { Footer } from '@/Components/affiliate/footer';
import { ReferralLinkGenerator } from '@/Components/affiliate/ReferralLinkGenerator';
import { ReferralNetwork } from '@/Components/affiliate/ReferralNetwork';
import { CommissionHistory } from '@/Components/affiliate/CommissionHistory';
import { PerformanceMilestones } from '@/Components/affiliate/PerformanceMilestones';
import { useAuth } from '@/hooks/useAuth';
import { useAffiliateProfile, useAffiliateDashboard, useAffiliateSales, useAffiliateReferrals } from '@/hooks/useAffiliate';
import { useUserCommissions } from '@/hooks/useCommissions';

// TODO: Implement milestones API

// =================================================================================================
// --- MAIN AFFILIATE DASHBOARD LAYOUT ---
// =================================================================================================

export default function AffiliateDashboard() {
    const { user } = useAuth();
    const { data: profileData, isLoading: profileLoading } = useAffiliateProfile();
    const { data: dashboardData, isLoading: dashboardLoading } = useAffiliateDashboard();
    const { data: salesData, isLoading: salesLoading } = useAffiliateSales();
    const { data: referralsData, isLoading: referralsLoading } = useAffiliateReferrals();
    const { data: commissionsData, isLoading: commissionsLoading } = useUserCommissions();

    const profile = profileData?.profile;
    const dashboard = dashboardData?.dashboard;
    const sales = salesData?.sales || [];
    const referrals = referralsData?.referrals || [];

    const isLoading = profileLoading || dashboardLoading || salesLoading || referralsLoading || commissionsLoading;

    // Calculate milestone progress
    const totalSales = sales.filter((s: any) => s.status === 'completed').length;
    const totalReferrals = referrals.length;
    const totalEarnings = sales.reduce((sum: number, s: any) => sum + s.amount, 0);

    const milestones = [
        {
            id: '1',
            name: 'First Sale',
            description: 'Make your first commission-earning sale',
            target: 1,
            current: totalSales,
            progress: totalSales,
            reward: '₦5,000 Bonus',
            category: 'sales',
            achieved: totalSales >= 1
        },
        {
            id: '2',
            name: 'Sales Champion',
            description: 'Reach 10 successful sales',
            target: 10,
            current: totalSales,
            progress: totalSales,
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
            progress: totalReferrals,
            reward: '2% Commission Boost',
            category: 'referrals',
            achieved: totalReferrals >= 5
        }
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user || user.role !== 'affiliate') {
        return <div>Access denied</div>;
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
            {/* Header (Top Navigation/Branding) */}
            <Header />

            <main className="flex-grow container mx-auto px-4 py-8 md:py-12 max-w-7xl">

                {/* User Welcome and Rank Banner */}
                <div className="mb-8 p-6 bg-blue-600 rounded-xl shadow-xl text-white flex justify-between items-center flex-wrap gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold">Hello, {user.firstName}!</h2>
                        <p className="text-blue-100 mt-1 text-lg">Your Partner ID: <span className="font-mono bg-blue-700 px-2 py-0.5 rounded text-sm">{profile?.userId || user.id}</span></p>
                    </div>
                    <div className="flex items-center bg-white text-blue-800 px-4 py-2 rounded-full font-bold shadow-md">
                        <Award className="h-5 w-5 mr-2 text-yellow-500 fill-yellow-500" />
                        Rank: Silver Partner {/* TODO: Get from API */}
                    </div>
                </div>

                {/* ROW 1: KEY PERFORMANCE INDICATORS (4-column grid) */}
                <section className="mb-8">
                    {/* <AffiliateStats
                        totalSales={dashboard?.totalEarnings || 0}
                        totalCommission={profile?.totalEarnings || 0}
                        activeReferrals={profile?.activeReferrals || 0}
                        referralBonus={profile?.availableBalance || 0}
                    /> */}
                    <AffiliateStats
                        totalSales={dashboard?.totalEarnings ?? 0}
                        totalCommission={profile?.totalEarned ?? 0}
                        activeReferrals={dashboard?.totalReferrals ?? 0}
                        referralBonus={profile?.availableBalance ?? 0}
                    />
                </section>

                {/* ROW 2: CHART & MILESTONES (2/3 | 1/3 layout) */}
                <section className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-fr">
                    {/* Sales Tracker (2/3 width) */}
                    <div className="lg:col-span-2">
                        <SalesTracker />
                    </div>
                    {/* Performance Milestones (1/3 width) */}
                    <div className="lg:col-span-1">
                        <PerformanceMilestones milestones={milestones} />
                    </div>
                </section>

                {/* ROW 3: REFERRAL NETWORK & COMMISSION HISTORY (1/2 | 1/2 layout) */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 auto-rows-fr">
                    {/* Referral Network (1/2 width) */}
                    <div className="lg:col-span-1">
                        <ReferralNetwork referrals={referrals} />
                    </div>
                    {/* Commission History (1/2 width) */}
                    <div className="lg:col-span-1">
                        <CommissionHistory commissions={commissionsData?.data?.commissions || []} />
                    </div>
                </section>

                {/* ROW 4: QUICK ACTIONS (Full Width Footer card) */}
                <section className="mt-8">
                    <ReferralLinkGenerator userId={profile?.userId || user.id} />
                </section>

            </main>

            {/* Footer (Bottom of Page) */}
            <Footer />
        </div>
    );
}
