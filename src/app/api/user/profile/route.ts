import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://epilux-backend.vercel.app';

export async function GET(request: NextRequest) {
    try {
        const response = await fetch(`${BASE_URL}/api/user/profile`, {
            method: 'GET',
            headers: {
                'Authorization': request.headers.get('authorization') || '',
            },
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('Get user profile proxy error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();

        const response = await fetch(`${BASE_URL}/api/user/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': request.headers.get('authorization') || '',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('Update user profile proxy error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}