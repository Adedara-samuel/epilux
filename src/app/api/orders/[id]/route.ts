import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://epilux-backend.vercel.app';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

    const response = await fetch(`${BASE_URL}/api/orders/${id}`, {
      method: 'GET',
      headers: {
        Authorization: request.headers.get('authorization') || '',
      },
      cache: 'no-store',
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Get order proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const url = new URL(request.url);
        const action = url.searchParams.get('action');

    // Handle cancel action
    if (action === 'cancel') {
      const response = await fetch(`${BASE_URL}/api/orders/${id}/cancel`, {
        method: 'PUT',
        headers: {
          Authorization: request.headers.get('authorization') || '',
        },
        cache: 'no-store',
      });

      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }

    // Handle regular update
    const body = await request.json();
    const response = await fetch(`${BASE_URL}/api/orders/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: request.headers.get('authorization') || '',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Update order proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


