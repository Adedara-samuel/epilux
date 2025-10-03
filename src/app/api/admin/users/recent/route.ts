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

        // Mock recent users data
        const recentUsers = [
            {
                id: '1',
                email: 'newuser1@example.com',
                firstName: 'Alice',
                lastName: 'Johnson',
                role: 'customer',
                emailVerified: true,
                createdAt: '2024-10-01T10:00:00Z'
            },
            {
                id: '2',
                email: 'newuser2@example.com',
                firstName: 'Bob',
                lastName: 'Wilson',
                role: 'customer',
                emailVerified: false,
                createdAt: '2024-10-02T08:30:00Z'
            }
        ];

        return NextResponse.json({ users: recentUsers });
    } catch (error) {
        console.error('Get recent users error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}