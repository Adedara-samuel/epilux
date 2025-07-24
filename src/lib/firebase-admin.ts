// lib/firebase-admin.ts
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Make sure these are in your .env.local (NOT NEXT_PUBLIC_)
const adminConfig = {
    credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
};

// Initialize only if not already initialized
const adminApp = getApps().length === 0 ? initializeApp(adminConfig) : getApps()[0];
export const adminAuth = getAuth(adminApp);