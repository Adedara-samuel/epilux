/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const authToken = request.cookies.get('authToken')?.value;

    // Check if the path requires authentication
    const protectedPaths = ['/admin', '/checkout'];
    const requiresAuth = protectedPaths.some(protectedPath => path.startsWith(protectedPath));

    if (requiresAuth) {
        if (!authToken) {
            console.log('No authToken cookie found, redirecting to login');
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
    matcher: ['/admin/:path*', '/checkout/:path*'],
};