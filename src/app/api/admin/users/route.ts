/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
    try {
        // Verify admin token
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, JWT_SECRET) as any;

        if (decoded.role !== 'admin') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        // Mock users data - in real app, fetch from database
        const users = [
            {
                id: '1',
                email: 'user1@example.com',
                firstName: 'John',
                lastName: 'Doe',
                role: 'customer',
                emailVerified: true,
                createdAt: '2024-01-01T00:00:00Z'
            },
            {
                id: '2',
                email: 'user2@example.com',
                firstName: 'Jane',
                lastName: 'Smith',
                role: 'affiliate',
                emailVerified: true,
                createdAt: '2024-01-02T00:00:00Z'
            }
        ];

        return NextResponse.json({ users });
    } catch (error) {
        console.error('Get users error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}