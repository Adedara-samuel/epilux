import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Mock admin user - in real app, this would be from database
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@epilux.com';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || bcrypt.hashSync('admin123', 10);

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        // Check if credentials match admin
        if (email !== ADMIN_EMAIL || !bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)) {
            return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
        }

        // Create JWT token
        const token = jwt.sign(
            {
                email: ADMIN_EMAIL,
                role: 'admin',
                type: 'admin'
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        const user = {
            id: 'admin-1',
            email: ADMIN_EMAIL,
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin',
            emailVerified: true
        };

        return NextResponse.json({
            success: true,
            message: 'Admin login successful',
            token,
            user
        });
    } catch (error) {
        console.error('Admin login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}