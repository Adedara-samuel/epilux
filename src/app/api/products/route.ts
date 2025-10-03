/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// In-memory storage for products
const products: any[] = [];

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');

        let filteredProducts = products;

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
        // TODO: Re-enable auth check
        // // Verify admin token
        // const authHeader = request.headers.get('authorization');
        // console.log('Auth header:', authHeader);
        // if (!authHeader || !authHeader.startsWith('Bearer ')) {
        //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        // }

        // const token = authHeader.substring(7);
        // console.log('Token:', token);
        // console.log('JWT_SECRET:', JWT_SECRET);
        // const decoded = jwt.verify(token, JWT_SECRET) as any;
        // console.log('Decoded:', decoded);

        // if (decoded.role !== 'admin') {
        //     return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        // }

        const productData = await request.json();

        // Mock create product
        const product = {
            id: Date.now().toString(),
            ...productData,
            isActive: true,
            createdAt: new Date().toISOString()
        };

        products.push(product);

        return NextResponse.json({ product, message: 'Product created successfully' });
    } catch (error) {
        console.error('Create product error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}