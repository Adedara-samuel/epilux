/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://epilux-backend.vercel.app';

// FIX: Changed the type of the second argument from '{ params: { id: string } }' to 'any'
export async function GET(request: NextRequest, { params }: any) { 
    try {
        // We assume params is { id: string } based on the route structure
        const { id } = params;

        const response = await fetch(`${BASE_URL}/api/support/tickets/${id}`, {
            method: 'GET',
            headers: {
                Authorization: request.headers.get('authorization') || '',
            },
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('Get ticket proxy error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// FIX: Changed the type of the second argument from '{ params: { id: string } }' to 'any'
export async function POST(request: NextRequest, { params }: any) {
    try {
        // We assume params is { id: string } based on the route structure
        const { id } = params;
        const body = await request.json();

        const response = await fetch(`${BASE_URL}/api/support/tickets/${id}/reply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: request.headers.get('authorization') || '',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('Reply to ticket proxy error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}