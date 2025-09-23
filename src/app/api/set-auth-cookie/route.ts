/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/set-auth-cookie/route.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const COOKIE_DURATION_SECONDS = parseInt(process.env.JWT_COOKIE_DURATION_SECONDS || '604800'); // 7 days

export async function POST(request: Request) {
    try {
        const { token, user } = await request.json();
        
        if (!token || !user) {
            return NextResponse.json({ error: 'No token or user provided' }, { status: 400 });
        }

        // Verify the JWT token from backend
        const decoded = jwt.verify(token, JWT_SECRET);
        
        if (!decoded || typeof decoded !== 'object') {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const response = NextResponse.json({ 
            success: true,
            user: user
        });
        
        // Set the JWT token as HTTP-only cookie
        response.cookies.set('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: COOKIE_DURATION_SECONDS,
            path: '/',
        });

        return response;
    } catch (error: any) {
        console.error('Auth cookie creation failed:', error.message);
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
}