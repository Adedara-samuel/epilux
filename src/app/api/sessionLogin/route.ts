// app/api/sessionLogin/route.ts
// This API route will be called from the client after a successful sign-in
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

// Make sure you have a private environment variable like this
// FIREBASE_SESSION_COOKIE_DURATION_SECONDS=604800 // 7 days
const COOKIE_DURATION_SECONDS = parseInt(process.env.FIREBASE_SESSION_COOKIE_DURATION_SECONDS || '604800');

export async function POST(request: NextRequest) {
    // Get the ID token from the client request
    const { idToken } = await request.json();

    if (!idToken) {
        return NextResponse.json({ error: 'Unauthorized: No ID token provided' }, { status: 401 });
    }

    try {
        // Use the Firebase Admin SDK to create a session cookie
        const sessionCookie = await adminAuth.createSessionCookie(idToken, {
            expiresIn: COOKIE_DURATION_SECONDS * 1000
        });

        const response = NextResponse.json({ status: 'success' }, { status: 200 });

        // Set the session cookie as an HTTP-only cookie on the response
        // This makes it secure and inaccessible to client-side JavaScript
        response.cookies.set({
            name: 'session',
            value: sessionCookie,
            maxAge: COOKIE_DURATION_SECONDS,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Error creating session cookie:', error);
        return NextResponse.json({ error: 'Unauthorized: Invalid ID token' }, { status: 401 });
    }
}