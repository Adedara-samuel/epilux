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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decoded = jwt.verify(token, JWT_SECRET) as any;

        if (decoded.role !== 'affiliate') {
            return NextResponse.json({ error: 'Affiliate access required' }, { status: 403 });
        }

        // Mock referrals data
        const referrals = [
            {
                id: '1',
                name: 'Alice Johnson',
                email: 'alice@example.com',
                joinDate: '2024-09-01T00:00:00Z',
                totalPurchases: 15000,
                commissionEarned: 750,
                status: 'active'
            },
            {
                id: '2',
                name: 'Bob Wilson',
                email: 'bob@example.com',
                joinDate: '2024-09-15T00:00:00Z',
                totalPurchases: 8000,
                commissionEarned: 400,
                status: 'active'
            }
        ];

        return NextResponse.json({ referrals });
    } catch (error) {
        console.error('Get affiliate referrals error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}