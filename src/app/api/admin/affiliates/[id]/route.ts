import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        // Verify admin token
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.substring(7);
        let decoded: jwt.JwtPayload;
        try {
            decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
        } catch {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        if (decoded.role !== 'admin') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const { id } = await params;

        // Mock affiliate lookup - in real app, fetch from database
        const mockAffiliate = {
            id,
            userId: 'user-1',
            status: 'active',
            totalEarnings: 2500,
            totalReferrals: 15,
            commissionRate: 10,
            bankDetails: {
                bankName: 'Sample Bank',
                accountNumber: '1234567890',
                accountName: 'John Doe'
            },
            createdAt: '2024-01-01T00:00:00Z'
        };

        if (!mockAffiliate) {
            return NextResponse.json({ error: 'Affiliate not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            affiliate: mockAffiliate
        });
    } catch (error) {
        console.error('Get affiliate error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}