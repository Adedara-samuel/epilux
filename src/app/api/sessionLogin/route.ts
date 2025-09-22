// app/api/sessionLogin/route.ts
// This API route will be called from the client after a successful sign-in
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const COOKIE_DURATION_SECONDS = parseInt(process.env.JWT_COOKIE_DURATION_SECONDS || '604800'); // 7 days

export async function POST(request: NextRequest) {
    try {
        const { token, user } = await request.json();

        if (!token || !user) {
            return NextResponse.json({ error: 'Unauthorized: No token or user provided' }, { status: 401 });
        }

        // Verify the JWT token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        if (!decoded || typeof decoded !== 'object') {
            return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
        }

        const response = NextResponse.json({ 
            status: 'success',
            user: user
        }, { status: 200 });

        // Set the JWT token as an HTTP-only cookie
        response.cookies.set({
            name: 'authToken',
            value: token,
            maxAge: COOKIE_DURATION_SECONDS,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            sameSite: 'strict'
        });

        return response;
    } catch (error) {
        console.error('Error creating session cookie:', error);
        return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }
}