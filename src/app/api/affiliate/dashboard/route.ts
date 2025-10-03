/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
    try {
        // Verify affiliate token
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, JWT_SECRET) as any;

        if (decoded.role !== 'affiliate') {
            return NextResponse.json({ error: 'Affiliate access required' }, { status: 403 });
        }

        // Mock dashboard data
        const dashboard = {
            totalEarnings: 50000,
            availableBalance: 25000,
            totalReferrals: 15,
            activeReferrals: 12,
            totalClicks: 450,
            conversionRate: 3.3,
            monthlyEarnings: [
                { month: 'Jan', amount: 5000 },
                { month: 'Feb', amount: 7500 },
                { month: 'Mar', amount: 6200 },
                { month: 'Apr', amount: 8900 },
                { month: 'May', amount: 7200 },
                { month: 'Jun', amount: 10100 }
            ]
        };

        return NextResponse.json({ dashboard });
    } catch (error) {
        console.error('Get affiliate dashboard error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}