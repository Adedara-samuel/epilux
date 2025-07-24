/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/set-user-role.ts (or app/api/set-user-role/route.ts for App Router)
import type { NextApiRequest, NextApiResponse } from 'next';
import { adminAuth } from '@/lib/firebase-admin'; // Adjust path if necessary

type Data = {
    message?: string;
    error?: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { email, role } = req.body;

    if (!email || !role) {
        return res.status(400).json({ error: 'Email and role are required.' });
    }

    try {
        // 1. Get the user by email
        const user = await adminAuth.getUserByEmail(email);

        // 2. Set custom claims for the user
        await adminAuth.setCustomUserClaims(user.uid, { role });

        // 3. Optionally, revoke existing refresh tokens to force the user to re-authenticate
        // This ensures the new claims are picked up immediately on next login
        await adminAuth.revokeRefreshTokens(user.uid);

        console.log(`Successfully set role '${role}' for user ${email} (UID: ${user.uid})`);
        res.status(200).json({ message: `Role '${role}' set for ${email}. User needs to re-login.` });

    } catch (error: any) {
        console.error('Error setting custom user claim:', error);
        if (error.code === 'auth/user-not-found') {
            return res.status(404).json({ error: 'User not found.' });
        }
        res.status(500).json({ error: 'Failed to set user role.' });
    }
}