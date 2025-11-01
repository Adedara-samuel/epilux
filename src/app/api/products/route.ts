/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://epilux-backend.vercel.app';

// In-memory storage for products
const products: any[] = [];

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const searchParams = url.searchParams;

        // Build the backend URL with all query parameters
        const backendUrl = new URL(`${BASE_URL}/api/products`);
        searchParams.forEach((value, key) => {
            backendUrl.searchParams.set(key, value);
        });

        const response = await fetch(backendUrl.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('Get products proxy error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const productData = await request.json();

        const response = await fetch(`${BASE_URL}/api/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('Create product proxy error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}