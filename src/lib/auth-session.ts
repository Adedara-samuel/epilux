// src/lib/auth-session.ts
// Browser-side session storage shared by the auth provider and the API client.
// The token lives in localStorage (sent as a Bearer header) and is mirrored in
// the `authToken` cookie so the route middleware can gate protected pages.

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user';
const COOKIE_NAME = 'authToken';
// Matches the backend JWT lifetime (JWT_EXPIRE=7d)
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60;

const isBrowser = () => typeof window !== 'undefined';

// Decode a JWT payload without verifying it (the backend verifies). Used only
// to avoid keeping a session the server will reject anyway.
export const decodeTokenPayload = (token: string): { exp?: number; role?: string; userId?: string } | null => {
    try {
        const payload = token.split('.')[1];
        if (!payload) return null;
        const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(json);
    } catch {
        return null;
    }
};

export const isTokenExpired = (token: string) => {
    const payload = decodeTokenPayload(token);
    if (!payload) return true;
    return typeof payload.exp === 'number' && payload.exp * 1000 <= Date.now();
};

const writeCookie = (value: string, maxAge: number) => {
    if (!isBrowser()) return;
    const secure = window.location.protocol === 'https:' ? '; secure' : '';
    // Lax (not Strict) so the cookie survives the redirect back from the payment gateway
    document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${maxAge}; samesite=lax${secure}`;
};

export const authSession = {
    getToken: (): string | null => (isBrowser() ? localStorage.getItem(TOKEN_KEY) : null),

    getUser: <T = unknown>(): T | null => {
        if (!isBrowser()) return null;
        try {
            const raw = localStorage.getItem(USER_KEY);
            return raw ? (JSON.parse(raw) as T) : null;
        } catch {
            return null;
        }
    },

    save: (token: string, user: unknown) => {
        if (!isBrowser()) return;
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        writeCookie(token, COOKIE_MAX_AGE);
    },

    saveUser: (user: unknown) => {
        if (!isBrowser()) return;
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    },

    // Re-sync the cookie from localStorage (e.g. after the cookie expired or was cleared)
    syncCookie: () => {
        const token = authSession.getToken();
        if (token && !isTokenExpired(token)) writeCookie(token, COOKIE_MAX_AGE);
    },

    clear: () => {
        if (!isBrowser()) return;
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem('tokenTimestamp');
        writeCookie('', 0);
    },

    storageKeys: { token: TOKEN_KEY, user: USER_KEY },
};

// Only allow same-site relative redirects (prevents open redirects via ?redirect=)
export const safeRedirectPath = (value: string | null | undefined, fallback = '/products') =>
    value && value.startsWith('/') && !value.startsWith('//') && !value.startsWith('/login') ? value : fallback;

export const homePathForRole = (role?: string) => {
    switch (role) {
        case 'admin':
            return '/admin/dashboard';
        case 'marketer':
            return '/marketer';
        default:
            return '/products';
    }
};
