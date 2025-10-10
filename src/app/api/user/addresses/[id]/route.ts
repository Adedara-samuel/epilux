import { NextRequest, NextResponse } from 'next/server';

// Mock user addresses - in real app, fetch from database
const mockUserAddresses = [
  {
    id: 'addr-1',
    type: 'home',
    street: '123 Main Street',
    city: 'Lagos',
    state: 'Lagos State',
    zipCode: '100001',
    country: 'Nigeria',
  },
  {
    id: 'addr-2',
    type: 'work',
    street: '456 Office Plaza',
    city: 'Abuja',
    state: 'FCT',
    zipCode: '900001',
    country: 'Nigeria',
  },
];

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();

    // In real app, update in database
    const index = mockUserAddresses.findIndex(addr => addr.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    mockUserAddresses[index] = { ...mockUserAddresses[index], ...body };

    return NextResponse.json({
      success: true,
      message: 'Address updated successfully',
      address: mockUserAddresses[index],
    });
  } catch (error) {
    console.error('Update user address error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // In real app, delete from database
    const index = mockUserAddresses.findIndex(addr => addr.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    mockUserAddresses.splice(index, 1);

    return NextResponse.json({
      success: true,
      message: 'Address deleted successfully',
    });
  } catch (error) {
    console.error('Delete user address error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}