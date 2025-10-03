/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { Card } from '../ui/card';
import { Users, Gift, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

interface Referral {
  name: string;
  joinDate: string;
  status: string;
  sales: number;
  commission: number;
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'Active':
            return { text: 'Active', class: 'bg-emerald-100 text-emerald-700' };
        case 'Promising':
            return { text: 'Promising', class: 'bg-yellow-100 text-yellow-700' };
        case 'Inactive':
        default:
            return { text: 'Inactive', class: 'bg-gray-100 text-gray-600' };
    }
};

export const ReferralNetwork = ({ referrals }: { referrals: Referral[] }) => {
    const router = useRouter();

    return (
        <Card className="p-6 h-full">
            <div className="flex items-center justify-between mb-6 border-b pb-3">
                <h3 className="flex items-center text-xl font-bold text-gray-800">
                    <Users className="h-5 w-5 mr-2 text-indigo-600" />
                    Your Referral Network
                </h3>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push('/affiliate/referrals')}
                    className="flex items-center gap-2"
                >
                    View All
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </div>
            
            {referrals && referrals.length > 0 ? (
                <div className="space-y-4">
                    {referrals.map((referral, index) => {
                        const badge = getStatusBadge(referral.status);
                        return (
                            <div 
                                key={index} 
                                className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-all duration-200"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center border-2 border-indigo-200">
                                        <span className="text-indigo-600 font-bold text-lg">{referral.name.charAt(0)}</span>
                                    </div>
                                    
                                    <div>
                                        <p className="text-base font-semibold text-gray-900">{referral.name}</p>
                                        <p className="text-xs text-gray-500">Joined: {referral.joinDate}</p>
                                    </div>
                                </div>
                                
                                {/* Performance Stats */}
                                <div className="text-right space-y-1">
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${badge.class}`}>
                                        {badge.text}
                                    </span>
                                    <p className="text-sm text-gray-600 font-medium">{referral.sales.toLocaleString()} bags</p>
                                    <p className="text-sm font-bold text-blue-600">₦{referral.commission.toLocaleString()}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center p-8 bg-gray-50 rounded-lg">
                    <Gift className="h-10 w-10 mx-auto mb-4 text-gray-400" />
                <p className="text-sm text-gray-500">You haven't referred anyone yet.</p>
                </div>
            )}
        </Card>
    );
}