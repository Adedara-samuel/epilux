/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://epilux-backend.vercel.app';

export async function GET(request: NextRequest) {
    try {
        const response = await fetch(`${BASE_URL}/api/products/categories`, {
            method: 'GET',
        });

        const data = await response.json();

        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('Get categories proxy error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}