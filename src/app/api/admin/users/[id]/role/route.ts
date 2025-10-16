import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        // Verify admin token
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.substring(7);
        let decoded: jwt.JwtPayload;
        try {
            decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
        } catch {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        if (decoded.role !== 'admin') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const { id } = await params;
        const { role } = await request.json();

        if (!role) {
            return NextResponse.json({ error: 'Role is required' }, { status: 400 });
        }

        // Validate role
        const validRoles = ['user', 'admin', 'affiliate'];
        if (!validRoles.includes(role)) {
            return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
        }

        // Mock user role update - in real app, update in database
        // Assume user exists and update role

        return NextResponse.json({
            success: true,
            message: `User role updated to ${role}`,
            user: {
                id,
                role
            }
        });
    } catch (error) {
        console.error('Update user role error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}