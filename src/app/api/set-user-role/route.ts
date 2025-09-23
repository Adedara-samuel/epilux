/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/set-user-role/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { authAPI } from '@/lib/api';

export async function POST(request: NextRequest) {
    try {
        const { email, role } = await request.json();

        if (!email || !role) {
            return NextResponse.json({ error: 'Email and role are required.' }, { status: 400 });
        }

        // Validate role
        const validRoles = ['user', 'admin', 'affiliate'];
        if (!validRoles.includes(role)) {
            return NextResponse.json({ error: 'Invalid role.' }, { status: 400 });
        }

        // Call backend API to update user role
        const response = await authAPI.updateUserRole(email, role);
        
        if (response.success) {
            console.log(`Successfully set role '${role}' for user ${email}`);
            return NextResponse.json({ 
                message: `Role '${role}' set for ${email}. User needs to re-login.` 
            });
        } else {
            return NextResponse.json({ error: response.message || 'Failed to set user role.' }, { status: 400 });
        }

    } catch (error: any) {
        console.error('Error setting user role:', error);
        
        if (error.response?.status === 404) {
            return NextResponse.json({ error: 'User not found.' }, { status: 404 });
        }
        
        return NextResponse.json({ error: 'Failed to set user role.' }, { status: 500 });
    }
}