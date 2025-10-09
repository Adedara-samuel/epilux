/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Return empty addresses - in real app, fetch from database
    return NextResponse.json({
      success: true,
      addresses: [],
    });
  } catch (error) {
    console.error('Get user addresses error:', error);
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