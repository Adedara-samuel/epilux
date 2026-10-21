import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Pages that need a signed-in user. The backend still authorizes every API
// call; this only avoids rendering protected pages for signed-out visitors.
const PROTECTED_PATHS = ['/admin', '/checkout', '/products', '/account', '/cart', '/affiliate', '/marketer', '/settings'];

// Decode the JWT payload (no verification; that happens on the backend)
const readTokenPayload = (token: string): { exp?: number; role?: string } | null => {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    try {
        const json = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(json);
    } catch {
        return null;
    }
};

const hasValidSession = (token: string | undefined) => {
    if (!token) return false;
    const payload = readTokenPayload(token);
    if (!payload) return false;
    return typeof payload.exp !== 'number' || payload.exp * 1000 > Date.now();
};

export async function middleware(request: NextRequest) {
    const { pathname, search } = request.nextUrl;
    const authToken = request.cookies.get('authToken')?.value;
    const signedIn = hasValidSession(authToken);

    // Signed-in visitors skip the marketing home page
    if (pathname === '/' && signedIn) {
        return NextResponse.redirect(new URL('/products', request.url));
    }

    const requiresAuth = PROTECTED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));

    if (requiresAuth && !signedIn) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', `${pathname}${search}`);
        const response = NextResponse.redirect(loginUrl);
        if (authToken) {
            // Drop an expired or malformed cookie so it isn't re-checked
            response.cookies.delete('authToken');
        }
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/checkout/:path*',
        '/products/:path*',
        '/account/:path*',
        '/cart/:path*',
        '/affiliate/:path*',
        '/admin/:path*',
        '/marketer/:path*',
        '/settings/:path*',
    ],
};
