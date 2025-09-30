import React from 'react';
import { Card } from '../ui/card';
import { Package, Users, Wallet, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
    change?: number;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, change, color }) => {
    const isPositive = change !== undefined && change >= 0;
    const changeClass = isPositive ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50';
    const IconComponent = isPositive ? ArrowUp : ArrowDown;
    const safeValue = typeof value === 'number' ? value.toLocaleString() : value;

    return (
        <Card className="p-6 overflow-hidden relative">
            <div className={`absolute top-0 left-0 w-full h-1 ${color.replace('text-', 'bg-')} opacity-80`} />
            
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <h3 className="text-3xl font-extrabold text-gray-900 mt-1">{safeValue}</h3>
                </div>
                <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
                    {React.cloneElement(icon, { className: `h-6 w-6 ${color}` })}
                </div>
            </div>
            
            {change !== undefined && (
                <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className={`flex items-center text-sm font-semibold px-3 py-1 rounded-full ${changeClass}`}>
                        <IconComponent className="h-4 w-4 mr-1" />
                        {Math.abs(change)}%
                    </span>
                    <span className="text-xs text-gray-500">vs. last period</span>
                </div>
            )}
        </Card>
    );
};

type AffiliateStatsProps = {
    totalSales?: number;
    totalCommission?: number;
    activeReferrals?: number;
    referralBonus?: number;
};

export const AffiliateStats = ({ totalSales, totalCommission, activeReferrals, referralBonus }: AffiliateStatsProps) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
                title="Total Bags Sold"
                value={totalSales ?? 0}
                icon={<Package />}
                change={12}
                color="text-blue-600"
            />
            <StatCard
                title="Total Commission"
                value={`₦${(totalCommission ?? 0).toLocaleString()}`}
                icon={<Wallet />}
                change={8}
                color="text-teal-600"
            />
            <StatCard
                title="Active Referrals"
                value={activeReferrals ?? 0}
                icon={<Users />}
                change={-5}
                color="text-indigo-600"
            />
            <StatCard
                title="Referral Bonus YTD"
                value={`₦${(referralBonus ?? 0).toLocaleString()}`}
                icon={<TrendingUp />}
                change={15}
                color="text-orange-600"
            />
        </div>
    );
};
