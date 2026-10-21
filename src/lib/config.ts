// src/lib/config.ts
// Single source of truth for the backend origin.
//
// Locally, set NEXT_PUBLIC_BACKEND_URL in .env.local (gitignored) to point at
// a local API, e.g. http://localhost:5000. When it is not set (production),
// the deployed backend below is used, so deploys behave exactly as before.
export const PRODUCTION_BACKEND_URL = 'https://epilux-backend.vercel.app';

export const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || PRODUCTION_BACKEND_URL).replace(/\/+$/, '');
