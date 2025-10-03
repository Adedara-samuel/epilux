/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
    try {
        // Verify user token
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, JWT_SECRET) as any;

        const orderData = await request.json();

        // Mock create order
        const order = {
            id: Date.now().toString(),
            userId: decoded.id,
            items: orderData.items,
            totalAmount: orderData.totalAmount,
            deliveryFee: orderData.deliveryFee,
            status: 'pending',
            paymentMethod: orderData.paymentMethod,
            deliveryAddress: orderData.deliveryAddress,
            createdAt: new Date().toISOString()
        };

        return NextResponse.json({ order, message: 'Order created successfully' });
    } catch (error) {
        console.error('Create order error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}