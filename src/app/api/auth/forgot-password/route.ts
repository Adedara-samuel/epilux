import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://epilux-backend.vercel.app';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const response = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('Forgot password proxy error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}