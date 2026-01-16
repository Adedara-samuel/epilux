import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Skip middleware for API routes and static files
    if (path.startsWith('/api/') || path.startsWith('/_next/') || path.includes('.')) {
        return NextResponse.next();
    }

    // Check if the path requires authentication
    const protectedPaths = ['/admin', '/checkout', '/products', '/account', '/cart', '/affiliate'];
    const requiresAuth = protectedPaths.some(protectedPath => path.startsWith(protectedPath));

    // Check for home page redirection if logged in
    if (path === '/') {
        const authToken = request.cookies.get('authToken')?.value;
        if (authToken) {
            try {
                const parts = authToken.split('.');
                if (parts.length === 3) {
                    console.log('User logged in, redirecting from home to products');
                    return NextResponse.redirect(new URL('/products', request.url));
                }
            } catch (error) {
                // Invalid token, stay on home
            }
        }
    }

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
    matcher: ['/', '/checkout/:path*', '/products/:path*', '/account/:path*', '/cart/:path*', '/affiliate/:path*', '/admin/:path*'],
};