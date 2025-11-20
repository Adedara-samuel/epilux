/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch('https://epilux-backend.vercel.app/api/users/me/address', {
      method: 'GET',
      headers: {
        'Authorization': request.headers.get('authorization') || '',
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Get user addresses proxy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Return success - in real app, save to database
    const newAddress = {
      id: `addr-${Date.now()}`,
      ...body,
    };

    return NextResponse.json({
      success: true,
      message: 'Address added successfully',
      address: newAddress,
    }, { status: 201 });
  } catch (error) {
    console.error('Add user address error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}