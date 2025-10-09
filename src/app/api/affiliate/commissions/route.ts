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
        try {
            jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
        } catch {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        // Mock commissions data - in real app, fetch from database for this affiliate
        const mockCommissions = [
            {
                id: '1',
                orderId: 'order-1',
                amount: 50,
                status: 'paid',
                createdAt: '2024-01-10T00:00:00Z'
            },
            {
                id: '2',
                orderId: 'order-2',
                amount: 75,
                status: 'pending',
                createdAt: '2024-01-15T00:00:00Z'
            }
        ];

        return NextResponse.json({
            success: true,
            commissions: mockCommissions,
            total: mockCommissions.length
        });
    } catch (error) {
        console.error('Get commissions error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}