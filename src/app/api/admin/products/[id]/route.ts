/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Define the direct type for the context argument, though we are avoiding its use per request
// type RouteContext = {
//     params: {
//         id: string;
//     };
// };

// --- START: Placeholder Admin Product Service ---
// This is your mock API layer that needs a guaranteed string token.
const adminProductAPI = {
    // Requires a guaranteed string token
    getProduct: async (token: string, productId: string) => {
        console.log(`API Call: GET product ${productId} using token: ${token.substring(0, 10)}...`);
        // Replace with actual API call
        return {
            id: productId,
            name: 'Fetched Product Name',
            price: 100,
            stock: 500
        };
    },
    // Requires a guaranteed string token
    updateProduct: async (token: string, productId: string, updates: any) => {
        console.log(`API Call: PUT product ${productId} with updates:`, updates);
        // Replace with actual API call
        return {
            id: productId,
            ...updates,
            updatedAt: new Date().toISOString()
        };
    },
    // Requires a guaranteed string token
    deleteProduct: async (token: string, productId: string) => {
        console.log(`API Call: DELETE product ${productId} using token: ${token.substring(0, 10)}...`);
        // Replace with actual API call
        return { message: 'Product deleted successfully' };
    }
};
// --- END: Placeholder Admin Product Service ---

// --- FIX: Refactored Utility Function for Type Safety ---
// The return type is narrowed to be either an error object OR an object with a guaranteed string token.
const validateAdminRequest = (request: NextRequest): { token: string } | { error: string, status: number } => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { error: 'Unauthorized: Missing or malformed Authorization header', status: 401 };
    }

    // The token extracted here is definitely a string
    const token = authHeader.substring(7);
    let decoded: jwt.JwtPayload;

    try {
        // Here, jwt.verify expects a string, which 'token' is.
        decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    } catch {
        return { error: 'Unauthorized: Invalid token', status: 401 };
    }

    if (decoded.role !== 'admin') {
        return { error: 'Forbidden: Admin access required', status: 403 };
    }

    // When returning success, TypeScript knows the return object MUST contain a string token.
    return { token };
};

// Utility to extract ID from URL (since we avoided the 'params' argument)
const getProductIdFromUrl = (request: NextRequest): string | null => {
    const pathSegments = request.nextUrl.pathname.split('/');
    // Assumes URL structure is /api/admin/products/[id]
    const id = pathSegments.pop();

    // Ensures the segment is not empty and is likely the ID
    return id && id !== 'products' && id !== 'api' && id !== 'admin' ? id : null;
};


// ----------------------------------------------------------------------

/**
 * GET /api/admin/products/[id]
 * Fetches a single product by ID (Admin-only)
 */
export async function GET(request: NextRequest) {
    try {
        const validation = validateAdminRequest(request);
        if ('error' in validation) { // Check if the utility returned an error object
            return NextResponse.json({ error: validation.error }, { status: validation.status });
        }
        // TypeScript now knows 'validation' is { token: string }
        const { token } = validation;

        const id = getProductIdFromUrl(request);
        if (!id) {
            return NextResponse.json({ error: 'Missing product ID in URL' }, { status: 400 });
        }

        // FIX: 'token' is now guaranteed to be a string, resolving the type error.
        const product = await adminProductAPI.getProduct(token, id);

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            product
        });
    } catch (error) {
        console.error('Get product error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// ----------------------------------------------------------------------

/**
 * PUT /api/admin/products/[id]
 * Updates an existing product by ID (Admin-only)
 */
export async function PUT(request: NextRequest) {
    try {
        const validation = validateAdminRequest(request);
        if ('error' in validation) { // Check if the utility returned an error object
            return NextResponse.json({ error: validation.error }, { status: validation.status });
        }
        const { token } = validation;

        const id = getProductIdFromUrl(request);
        if (!id) {
            return NextResponse.json({ error: 'Missing product ID in URL' }, { status: 400 });
        }

        const updates = await request.json();

        // FIX: 'token' is now guaranteed to be a string.
        const updatedProduct = await adminProductAPI.updateProduct(token, id, updates);

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

// ----------------------------------------------------------------------

/**
 * DELETE /api/admin/products/[id]
 * Deletes a product by ID (Admin-only)
 */
export async function DELETE(request: NextRequest) {
    try {
        const validation = validateAdminRequest(request);
        if ('error' in validation) { // Check if the utility returned an error object
            return NextResponse.json({ error: validation.error }, { status: validation.status });
        }
        const { token } = validation;

        const id = getProductIdFromUrl(request);
        if (!id) {
            return NextResponse.json({ error: 'Missing product ID in URL' }, { status: 400 });
        }

        // FIX: 'token' is now guaranteed to be a string.
        await adminProductAPI.deleteProduct(token, id);

        return NextResponse.json({
            success: true,
            message: `Product with ID ${id} deleted successfully`
        });
    } catch (error) {
        console.error('Delete product error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}