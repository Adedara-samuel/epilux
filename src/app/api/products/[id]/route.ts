import { BACKEND_URL } from '@/lib/config';
import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = BACKEND_URL;

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const response = await fetch(`${BASE_URL}/api/products/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('Get product proxy error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}