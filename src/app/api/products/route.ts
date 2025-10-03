/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');

        // Mock products data
        const allProducts = [
            {
                id: '1',
                name: 'Premium Bottled Water',
                description: 'Pure, refreshing bottled water',
                price: 500,
                category: 'bottled',
                image: '/images/bottled-water.jpg',
                stock: 100,
                isActive: true
            },
            {
                id: '2',
                name: 'Sachet Water Pack',
                description: 'Convenient sachet water',
                price: 200,
                category: 'sachet',
                image: '/images/sachet-water.jpg',
                stock: 500,
                isActive: true
            }
        ];

        let filteredProducts = allProducts;

        if (category && category !== 'all') {
            filteredProducts = filteredProducts.filter(p => p.category === category);
        }

        if (search) {
            filteredProducts = filteredProducts.filter(p =>
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.description.toLowerCase().includes(search.toLowerCase())
            );
        }

        const startIndex = (page - 1) * limit;
        const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit);

        return NextResponse.json({
            products: paginatedProducts,
            total: filteredProducts.length,
            page,
            limit
        });
    } catch (error) {
        console.error('Get products error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
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

        const productData = await request.json();

        // Mock create product
        const product = {
            id: Date.now().toString(),
            ...productData,
            isActive: true,
            createdAt: new Date().toISOString()
        };

        return NextResponse.json({ product, message: 'Product created successfully' });
    } catch (error) {
        console.error('Create product error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}