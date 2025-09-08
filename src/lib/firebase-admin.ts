// lib/firebase-admin.ts
// IMPORTANT: This file MUST only be imported in server-side code (API routes, middleware, server actions).
// DO NOT import this file in client components.
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// IMPORTANT: Use PRIVATE environment variables for the Admin SDK.
// Do not use a NEXT_PUBLIC_ prefixed variable here, as that exposes the module to the client.
const adminConfig = {
    credential: cert({
        // Change the environment variable name here to a private one
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
};

// Initialize only if not already initialized
const adminApp = getApps().length === 0 ? initializeApp(adminConfig) : getApps()[0];
export const adminAuth = getAuth(adminApp);
