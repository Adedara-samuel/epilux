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

        // Mock sales data
        const sales = [
            {
                id: '1',
                productName: 'Premium Water Bottle',
                amount: 5000,
                commission: 250,
                date: '2024-10-01T10:00:00Z',
                status: 'completed'
            },
            {
                id: '2',
                productName: 'Sachet Water Pack',
                amount: 2000,
                commission: 100,
                date: '2024-10-02T08:30:00Z',
                status: 'pending'
            }
        ];

        return NextResponse.json({ sales });
    } catch (error) {
        console.error('Get affiliate sales error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}