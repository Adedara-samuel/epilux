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

        // Mock affiliate profile data
        const profile = {
            id: decoded.id,
            userId: decoded.id,
            bankName: 'Sample Bank',
            accountNumber: '1234567890',
            accountName: 'John Doe',
            phoneNumber: '+1234567890',
            address: '123 Main St, City, Country',
            totalEarnings: 50000,
            availableBalance: 25000,
            totalReferrals: 15,
            status: 'active'
        };

        return NextResponse.json({ profile });
    } catch (error) {
        console.error('Get affiliate profile error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

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

        const profileData = await request.json();

        // Mock create/update profile
        const profile = {
            id: decoded.id,
            userId: decoded.id,
            ...profileData,
            status: 'active',
            createdAt: new Date().toISOString()
        };

        return NextResponse.json({ profile, message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Update affiliate profile error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}