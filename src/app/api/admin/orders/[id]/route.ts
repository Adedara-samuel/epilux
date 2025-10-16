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

        // Mock order lookup - in real app, fetch from database
        const mockOrder = {
            id,
            userId: 'user-1',
            user: { firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
            items: [
                { productId: '1', name: 'Epilux Pure Water 75cl', quantity: 10, price: 50 }
            ],
            total: 500,
            status: 'pending',
            paymentStatus: 'paid',
            shippingAddress: {
                street: '123 Main St',
                city: 'Lagos',
                state: 'Lagos',
                zipCode: '100001'
            },
            createdAt: '2024-01-01T00:00:00Z'
        };

        if (!mockOrder) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            order: mockOrder
        });
    } catch (error) {
        console.error('Get order error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}