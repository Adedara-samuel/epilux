import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
        const { status } = await request.json();

        if (!status) {
            return NextResponse.json({ error: 'Status is required' }, { status: 400 });
        }

        // Validate status
        const validStatuses = ['pending', 'active', 'suspended', 'inactive'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        // Mock affiliate status update - in real app, update in database
        const updatedAffiliate = {
            id,
            status,
            updatedAt: new Date().toISOString()
        };

        return NextResponse.json({
            success: true,
            message: `Affiliate status updated to ${status}`,
            affiliate: updatedAffiliate
        });
    } catch (error) {
        console.error('Update affiliate status error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}