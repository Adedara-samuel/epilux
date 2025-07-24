// app/affiliate/dashboard/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/auth-context';
import AffiliateStats from '@/Components/affiliate/AffiliateStats';
import SalesTracker from '@/Components/affiliate/SalesTracker';
import PerformanceMilestones from '@/Components/affiliate/PerformanceMilestones';
import ReferralNetwork from '@/Components/affiliate/ReferralNetwork';
import CommissionHistory from '@/Components/affiliate/CommissionHistory';

// Define types for the affiliate dashboard
type Commission = {
    date: string;
    amount: number;
    status: 'Pending' | 'Paid';
    type: 'Sales' | 'Referral';
};

type Referral = {
    name: string;
    joinDate: string;
    sales: number;
    commission: number;
};

type Milestone = {
    name: string;
    target: number;
    progress: number;
    reward: string;
    achieved: boolean;
};

// Mock data with proper typing
const mockCommissionHistory: Commission[] = [
    { date: '2023-10-15', amount: 12500, status: 'Paid', type: 'Sales' },
    { date: '2023-10-10', amount: 4500, status: 'Paid', type: 'Sales' },
    { date: '2023-10-05', amount: 3200, status: 'Paid', type: 'Referral' },
    { date: '2023-10-01', amount: 18700, status: 'Paid', type: 'Sales' },
    { date: '2023-09-25', amount: 1500, status: 'Pending', type: 'Referral' },
];

const mockReferrals: Referral[] = [
    { name: 'Jane Smith', joinDate: '2023-09-15', sales: 45, commission: 675 },
    { name: 'Michael Brown', joinDate: '2023-09-20', sales: 32, commission: 480 },
    { name: 'Sarah Williams', joinDate: '2023-10-01', sales: 18, commission: 270 },
];

const mockMilestones: Milestone[] = [
    { name: 'First 100 Bags', target: 100, progress: 125, reward: '₦5,000 Bonus', achieved: true },
    { name: 'Silver Seller', target: 500, progress: 125, reward: 'Branded T-Shirt', achieved: false },
    { name: 'Gold Seller', target: 1000, progress: 125, reward: 'All-expense-paid Trip', achieved: false },
];

export default function AffiliateDashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push('/login');
        } else {
            setLoading(false);
        }
    }, [user, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-epilux-blue"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-epilux-blue mb-6">Affiliate Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <AffiliateStats
                    totalSales={125}
                    totalCommission={6250}
                    activeReferrals={3}
                    referralBonus={675}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <SalesTracker />
                    <CommissionHistory commissions={mockCommissionHistory} />
                </div>

                <div className="space-y-6">
                    <ReferralNetwork referrals={mockReferrals} />
                    <PerformanceMilestones milestones={mockMilestones} />
                </div>
            </div>
        </div>
    );
}