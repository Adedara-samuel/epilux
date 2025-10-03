/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Import products array from products route
// Note: This is a temporary solution for demo purposes
let products: any[] = [];
try {
  // Since we can't directly import, we'll use a simple approach
  // In a real app, this would be from a database
} catch (e) {
  products = [];
}

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

        // Get real product count
        const productsResponse = await fetch(`${request.nextUrl.origin}/api/products?limit=1000`);
        const productsData = await productsResponse.json();
        const totalProducts = productsData.products?.length || 0;

        // Mock stats data (update totalProducts with real count)
        const stats = {
            totalUsers: 1250,
            totalOrders: 450,
            totalRevenue: 1250000,
            totalProducts: totalProducts,
            pendingOrders: 5,
            lowStockItems: 3
        };

        return NextResponse.json({ stats });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}