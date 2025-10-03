import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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

        // For now, just check if token exists (verification will happen on API calls)
        // TODO: Implement proper JWT verification for edge runtime if needed
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/checkout/:path*'],
};