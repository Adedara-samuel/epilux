import { NextRequest, NextResponse } from 'next/server';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * GET /api/support/tickets/[id]
 * Retrieve a specific support ticket
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://epilux-backend.vercel.app';

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

/**
 * POST /api/support/tickets/[id]
 * Reply to a support ticket
 */
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://epilux-backend.vercel.app';
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

