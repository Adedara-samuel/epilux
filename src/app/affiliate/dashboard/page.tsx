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




// =================================================================================================
// --- MOCK DATA ---
// =================================================================================================
const mockUserData = {
    firstName: "Samuel",
    rank: "Silver Partner",
    userId: "EPILUX_SML2025",
    // Stats Data
    totalSales: 1250,
    totalCommission: 75250,
    activeReferrals: 15,
    referralBonus: 12750,
    // Milestones Data
    milestones: [
        { name: 'Bronze Partner Rank', target: 500, progress: 500, reward: '₦5,000 Bonus', achieved: true },
        { name: 'Reach 10 Referrals', target: 10, progress: 8, reward: 'Free Delivery for 3 Months', achieved: false },
        { name: 'Silver Partner Rank', target: 2000, progress: 1250, reward: '2% Commission Increase', achieved: false },
    ],
    // Commission Data
    commissions: [
        { date: '2024-07-25', amount: 5000, status: 'Paid', type: 'Sales', transactionId: 'TXN-00124' },
        { date: '2024-07-20', amount: 1500, status: 'Pending', type: 'Referral', transactionId: 'TXN-00123' },
        { date: '2024-07-15', amount: 8500, status: 'Paid', type: 'Sales', transactionId: 'TXN-00122' },
        { date: '2024-07-01', amount: 1000, status: 'Bonus', type: 'Bonus', transactionId: 'TXN-00121' },
    ],
    // Referral Data
    referrals: [
        { name: 'Blessing Adeoye', joinDate: '2024-05-01', sales: 500, commission: 25000, status: 'Active' },
        { name: 'Kolawole Jide', joinDate: '2024-06-15', sales: 120, commission: 6000, status: 'Promising' },
        { name: 'Tosin Alabi', joinDate: '2024-07-20', sales: 5, commission: 250, status: 'Inactive' },
    ]
};

// =================================================================================================
// --- MAIN AFFILIATE DASHBOARD LAYOUT ---
// =================================================================================================

export default function AffiliateDashboard() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
            {/* Header (Top Navigation/Branding) */}
            <Header />

            <main className="flex-grow container mx-auto px-4 py-8 md:py-12 max-w-7xl">
                
                {/* User Welcome and Rank Banner */}
                <div className="mb-8 p-6 bg-blue-600 rounded-xl shadow-xl text-white flex justify-between items-center flex-wrap gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold">Hello, {mockUserData.firstName}!</h2>
                        <p className="text-blue-100 mt-1 text-lg">Your Partner ID: <span className="font-mono bg-blue-700 px-2 py-0.5 rounded text-sm">{mockUserData.userId}</span></p>
                    </div>
                    <div className="flex items-center bg-white text-blue-800 px-4 py-2 rounded-full font-bold shadow-md">
                        <Award className="h-5 w-5 mr-2 text-yellow-500 fill-yellow-500" />
                        Rank: {mockUserData.rank}
                    </div>
                </div>

                {/* ROW 1: KEY PERFORMANCE INDICATORS (4-column grid) */}
                <section className="mb-8">
                    <AffiliateStats 
                        totalSales={mockUserData.totalSales}
                        totalCommission={mockUserData.totalCommission}
                        activeReferrals={mockUserData.activeReferrals}
                        referralBonus={mockUserData.referralBonus}
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
                        <PerformanceMilestones milestones={mockUserData.milestones} />
                    </div>
                </section>

                {/* ROW 3: REFERRAL NETWORK & COMMISSION HISTORY (1/2 | 1/2 layout) */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 auto-rows-fr">
                    {/* Referral Network (1/2 width) */}
                    <div className="lg:col-span-1">
                        <ReferralNetwork referrals={mockUserData.referrals} />
                    </div>
                    {/* Commission History (1/2 width) */}
                    <div className="lg:col-span-1">
                        <CommissionHistory commissions={mockUserData.commissions} />
                    </div>
                </section>
                
                {/* ROW 4: QUICK ACTIONS (Full Width Footer card) */}
                <section className="mt-8">
                    <ReferralLinkGenerator userId={mockUserData.userId} />
                </section>

            </main>

            {/* Footer (Bottom of Page) */}
            <Footer />
        </div>
    );
}
