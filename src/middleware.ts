import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Skip middleware for API routes and static files
    if (path.startsWith('/api/') || path.startsWith('/_next/') || path.includes('.')) {
        return NextResponse.next();
    }

    // Check if the path requires authentication
    const protectedPaths = ['/admin', '/checkout'];
    const requiresAuth = protectedPaths.some(protectedPath => path.startsWith(protectedPath));

    if (requiresAuth) {
        // Check both cookie and localStorage (via headers if available)
        const authToken = request.cookies.get('authToken')?.value;

        if (!authToken) {
            console.log('No authToken cookie found, redirecting to login');
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // For admin routes, we can add a basic token validation here
        // Since we can't verify JWT in middleware, we'll let the API handle it
        // But we can at least check if the token looks valid (has proper format)
        try {
            // Basic JWT format check (header.payload.signature)
            const parts = authToken.split('.');
            if (parts.length !== 3) {
                console.log('Invalid token format, redirecting to login');
                return NextResponse.redirect(new URL('/login', request.url));
            }

            // For now, just allow access if token exists and has valid format
            // The actual validation will happen on API calls
            console.log('Valid token format found, allowing access to:', path);
            return NextResponse.next();
        } catch (error) {
            console.log('Token validation error, redirecting to login:', error);
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/checkout/:path*'],
};