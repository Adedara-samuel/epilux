/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/set-jwt/route.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key'; // Replace with a secure key or env variable

export async function POST(request: Request) {
    try {
        const { idToken } = await request.json();
        if (!idToken) {
            return NextResponse.json({ error: 'No ID token provided' }, { status: 400 });
        }

        // Generate JWT from Firebase ID token
        const token = jwt.sign({ firebaseIdToken: idToken }, SECRET_KEY, { expiresIn: '1h' });

        const response = NextResponse.json({ success: true });
        response.cookies.set('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600,
            path: '/',
        });

        return response;
    } catch (error: any) {
        console.error('JWT creation failed:', error.message);
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
}