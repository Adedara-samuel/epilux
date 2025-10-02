/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
    try {
        const authToken = request.cookies.get('authToken')?.value;

        if (!authToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let decoded;
        try {
            decoded = jwt.verify(authToken, JWT_SECRET) as any;
        } catch (error) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const userId = decoded.id || decoded.userId;

        if (!userId) {
            return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });
        }

        // For now, return mock data since we don't have a database
        const mockOrders = [
            {
                id: 'order-1',
                userId,
                status: 'completed',
                total: 2500,
                items: [
                    {
                        productId: {
                            name: 'Sample Product',
                            image: '/images/logo.png',
                            price: 2500
                        },
                        quantity: 1
                    }
                ],
                createdAt: new Date().toISOString()
            }
        ];

        return NextResponse.json({
            orders: mockOrders,
            pagination: {
                page: 1,
                limit: 10,
                total: 1,
                pages: 1,
            },
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}