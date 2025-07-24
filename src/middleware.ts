/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key'; // Match with API route

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const authToken = request.cookies.get('authToken')?.value;

    if (path.startsWith('/admin') || path.startsWith('/affiliate')) {
        if (!authToken) {
            console.log('No authToken cookie found');
            return NextResponse.redirect(new URL('/login', request.url));
        }

        try {
            jwt.verify(authToken, SECRET_KEY);
            return NextResponse.next();
        } catch (error: any) {
            console.error('JWT verification failed:', error.message);
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/affiliate/:path*'],
};