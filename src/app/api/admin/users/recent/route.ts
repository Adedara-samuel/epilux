import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://epilux-backend.vercel.app';

export async function GET(request: NextRequest) {
    try {
        const response = await fetch(`${BASE_URL}/api/admin/users/recent${request.nextUrl.search}`, {
            method: 'GET',
            headers: {
                'Authorization': request.headers.get('authorization') || '',
            },
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('Get admin recent users proxy error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}