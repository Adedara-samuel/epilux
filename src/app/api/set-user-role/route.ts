/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/set-user-role/route.ts
import { NextRequest, NextResponse } from 'next/server';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function POST(request: NextRequest) {
    try {
        // Verify admin token
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, JWT_SECRET) as any;

        if (decoded.role !== 'admin') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const { email, role } = await request.json();

        if (!email || !role) {
            return NextResponse.json({ error: 'Email and role are required.' }, { status: 400 });
        }

        // Validate role
        const validRoles = ['user', 'admin', 'affiliate'];
        if (!validRoles.includes(role)) {
            return NextResponse.json({ error: 'Invalid role.' }, { status: 400 });
        }

        // Get all users to find the user by email
        const usersResponse = await fetch(`${BASE_URL}/api/admin/users`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!usersResponse.ok) {
            return NextResponse.json({ error: 'Failed to fetch users.' }, { status: 500 });
        }

        const usersData = await usersResponse.json();
        const user = usersData.users?.find((u: any) => u.email === email);

        if (!user) {
            return NextResponse.json({ error: 'User not found.' }, { status: 404 });
        }

        // Update user role
        const updateResponse = await fetch(`${BASE_URL}/api/admin/users/${user._id}/role`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ role }),
        });

        if (!updateResponse.ok) {
            const errorData = await updateResponse.json().catch(() => ({ message: 'Failed to update user role.' }));
            return NextResponse.json({ error: errorData.message || 'Failed to set user role.' }, { status: 400 });
        }

        const updateData = await updateResponse.json();

        if (updateData.success) {
            console.log(`Successfully set role '${role}' for user ${email}`);
            return NextResponse.json({
                message: `Role '${role}' set for ${email}. User needs to re-login.`
            });
        } else {
            return NextResponse.json({ error: updateData.message || 'Failed to set user role.' }, { status: 400 });
        }

    } catch (error: any) {
        console.error('Error setting user role:', error);

        if (error.response?.status === 404) {
            return NextResponse.json({ error: 'User not found.' }, { status: 404 });
        }

        return NextResponse.json({ error: 'Failed to set user role.' }, { status: 500 });
    }
}