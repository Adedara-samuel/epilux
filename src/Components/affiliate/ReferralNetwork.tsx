/* eslint-disable react/no-unescaped-entities */
import { Card } from "../ui/card";

interface Referral {
    name: string;
    joinDate: string;
    sales: number;
    commission: number;
}

export default function ReferralNetwork({ referrals }: { referrals: Referral[] }) {
    return (
        <Card className="p-6">
            <h3 className="font-semibold mb-4">Your Referral Network</h3>
            {referrals.length > 0 ? (
                <div className="space-y-4">
                    {referrals.map((referral, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-epilux-blue/10 flex items-center justify-center">
                                    <span className="text-epilux-blue font-medium">{referral.name.charAt(0)}</span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{referral.name}</p>
                                    <p className="text-sm text-gray-500">Joined: {referral.joinDate}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">{referral.sales} sales</p>
                                <p className="text-sm text-epilux-blue">₦{referral.commission.toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-gray-500">You haven't referred anyone yet.</p>
            )}
        </Card>
    );
}