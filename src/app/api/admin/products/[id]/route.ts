import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Define the expected type for route parameters
type RouteContext = {
    params: {
        id: string;
    };
};

export async function GET(request: NextRequest, { params }: RouteContext) {
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

        // FIX: Access params directly. No 'await' is needed.
        const { id } = params;

        // Mock product lookup - in real app, fetch from database
        const mockProduct = {
            id,
            name: 'Epilux Pure Water 75cl',
            description: 'Premium quality sachet water',
            price: 50,
            category: 'water',
            stock: 1000,
            image: '/images/product1.jpg',
            createdAt: '2024-01-01T00:00:00Z'
        };

        if (!mockProduct) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            product: mockProduct
        });
    } catch (error) {
        console.error('Get product error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
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

        // FIX: Access params directly. No 'await' is needed.
        const { id } = params;
        const updates = await request.json();

        // Mock product update - in real app, update in database
        const updatedProduct = {
            id,
            ...updates,
            updatedAt: new Date().toISOString()
        };

        return NextResponse.json({
            success: true,
            message: 'Product updated successfully',
            product: updatedProduct
        });
    } catch (error) {
        console.error('Update product error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
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

        // FIX: Access params directly.
        const { id } = params; 

        // Mock product deletion - in real app, delete from database
        // Use 'id' here to delete the specific product

        return NextResponse.json({
            success: true,
            message: `Product with ID ${id} deleted successfully`
        });
    } catch (error) {
        console.error('Delete product error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}