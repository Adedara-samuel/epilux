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
        let decoded: jwt.JwtPayload;
        try {
            decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
        } catch {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        if (decoded.role !== 'admin') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        // Mock product categories - in real app, fetch from database
        const mockCategories = [
            { id: '1', name: 'Water', description: 'Drinking water products' },
            { id: '2', name: 'Beverages', description: 'Other beverages' },
            { id: '3', name: 'Accessories', description: 'Water-related accessories' }
        ];

        return NextResponse.json({
            success: true,
            categories: mockCategories
        });
    } catch (error) {
        console.error('Get product categories error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}