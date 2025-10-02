import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get('authToken')?.value;

    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(authToken, JWT_SECRET) as any;
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Mock user profile data
    const mockProfile = {
      id: decoded.id || decoded.userId,
      firstName: decoded.firstName || 'John',
      lastName: decoded.lastName || 'Doe',
      email: decoded.email || 'user@example.com',
      role: decoded.role || 'customer',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ user: mockProfile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authToken = request.cookies.get('authToken')?.value;

    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(authToken, JWT_SECRET) as any;
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { firstName, lastName } = body;

    // Mock profile update
    const updatedProfile = {
      id: decoded.id || decoded.userId,
      firstName: firstName || decoded.firstName || 'John',
      lastName: lastName || decoded.lastName || 'Doe',
      email: decoded.email || 'user@example.com',
      role: decoded.role || 'customer',
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ user: updatedProfile });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}