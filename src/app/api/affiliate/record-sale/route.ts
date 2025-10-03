/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
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

        const { productId, amount, referralCode } = await request.json();

        // Mock record sale
        const sale = {
            id: Date.now().toString(),
            affiliateId: decoded.id,
            productId,
            amount,
            commission: amount * 0.05, // 5% commission
            referralCode,
            date: new Date().toISOString(),
            status: 'pending'
        };

        return NextResponse.json({ sale, message: 'Sale recorded successfully' });
    } catch (error) {
        console.error('Record sale error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}