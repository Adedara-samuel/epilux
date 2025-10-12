import React from 'react';
import { Card } from '@/Components/ui/card';
import { History, DollarSign } from 'lucide-react';
import Link from 'next/link';

interface Commission {
    date: string;
    amount: number;
    status: string;
    type: string;
    transactionId?: string;
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'Paid':
            return 'bg-green-100 text-green-800 border-green-300';
        case 'Pending':
            return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        case 'Bonus':
            return 'bg-blue-100 text-blue-800 border-blue-300';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-300';
    }
};

export const CommissionHistory = ({ commissions }: { commissions: Commission[] }) => {
    return (
        <Card className="p-6 h-full">
            <h3 className="flex items-center text-xl font-bold text-gray-800 mb-6 border-b pb-3">
                <History className="h-5 w-5 mr-2 text-blue-600" />
                Transaction History
            </h3>
            
            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {commissions && commissions.map((commission) => (
                            <tr key={commission.transactionId} className="hover:bg-blue-50/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{commission.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 flex items-center">
                                    <DollarSign className="h-4 w-4 mr-1 text-green-500" />
                                    ₦{commission.amount.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(commission.status)}`}>
                                        {commission.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{commission.type}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400 font-mono">{commission.transactionId}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="text-right mt-4">
                <Link href="/affiliate/reports" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                    View Full Report &rarr;
                </Link>
            </div>
        </Card>
    );
};
