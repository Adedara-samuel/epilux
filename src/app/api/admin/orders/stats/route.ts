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

        // Mock order statistics - in real app, calculate from database
        const mockStats = {
            totalOrders: 150,
            totalRevenue: 45000,
            pendingOrders: 12,
            completedOrders: 138,
            monthlyRevenue: [
                { month: 'Jan', revenue: 5000 },
                { month: 'Feb', revenue: 7000 },
                { month: 'Mar', revenue: 8000 },
                { month: 'Apr', revenue: 6000 },
                { month: 'May', revenue: 9000 },
                { month: 'Jun', revenue: 10000 }
            ],
            statusBreakdown: {
                pending: 12,
                processing: 8,
                shipped: 15,
                delivered: 105,
                cancelled: 10
            }
        };

        return NextResponse.json({
            success: true,
            stats: mockStats
        });
    } catch (error) {
        console.error('Get order stats error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}