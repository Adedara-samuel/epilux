
import { Package, Users, Wallet, TrendingUp } from 'lucide-react';
import { Card } from '../ui/card';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    change?: number;
}

const StatCard = ({ title, value, icon, change }: StatCardProps) => {
    return (
        <Card className="p-6">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <h3 className="text-2xl font-bold mt-1">
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </h3>
                </div>
                <div className="p-3 rounded-lg bg-epilux-blue/10 text-epilux-blue">
                    {icon}
                </div>
            </div>
            {change !== undefined && (
                <div className={`mt-4 flex items-center text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% from last month
                </div>
            )}
        </Card>
    );
};

export default function AffiliateStats({
    totalSales,
    totalCommission,
    activeReferrals,
    referralBonus,
}: {
    totalSales: number;
    totalCommission: number;
    activeReferrals: number;
    referralBonus: number;
}) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
                title="Total Sales"
                value={totalSales}
                icon={<Package className="h-5 w-5" />}
                change={12}
            />
            <StatCard
                title="Total Commission"
                value={`₦${totalCommission.toLocaleString()}`}
                icon={<Wallet className="h-5 w-5" />}
                change={8}
            />
            <StatCard
                title="Active Referrals"
                value={activeReferrals}
                icon={<Users className="h-5 w-5" />}
                change={5}
            />
            <StatCard
                title="Referral Bonus"
                value={`₦${referralBonus.toLocaleString()}`}
                icon={<TrendingUp className="h-5 w-5" />}
                change={15}
            />
        </div>
    );
}