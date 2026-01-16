/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://epilux-backend.vercel.app';

// FIX: Changed the type of 'params' to 'any' in all function signatures to resolve the Next.js build error.
// The functions are also updated to proxy calls to a real backend API, removing mock data.

export async function PUT(request: NextRequest, { params }: any) {
  try {
    // Assume params is { id: string } based on the route structure
    const { id } = params;
    const body = await request.json();

    // Proxy call to the actual backend API to update the specific address
    const response = await fetch(`${BASE_URL}/api/user/addresses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // Pass authorization header from client to backend
        Authorization: request.headers.get('authorization') || '',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });

  } catch (error) {
    console.error('Update user address proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: any) {
  try {
    // Assume params is { id: string } based on the route structure
    const { id } = params;

    // Proxy call to the actual backend API to delete the specific address
    const response = await fetch(`${BASE_URL}/api/user/addresses/${id}`, {
      method: 'DELETE',
      headers: {
        // Pass authorization header from client to backend
        Authorization: request.headers.get('authorization') || '',
      },
    });

    // DELETE requests often return status 204 (No Content), so we handle JSON parsing defensively
    if (response.status === 204) {
      return NextResponse.json({ success: true, message: 'Address deleted successfully' }, { status: 200 });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });

  } catch (error) {
    console.error('Delete user address proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}