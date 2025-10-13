import { NextRequest, NextResponse } from 'next/server';

type Address = {
  id: string;
  type: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// Mock user addresses - In production, replace with database queries
const mockUserAddresses: Address[] = [
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

/**
 * PUT /api/user/addresses/[id]
 * Update a user address
 */
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const index = mockUserAddresses.findIndex((addr) => addr.id === id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      );
    }

    // Update address while preserving the ID
    mockUserAddresses[index] = {
      ...mockUserAddresses[index],
      ...body,
      id, // Ensure ID cannot be changed
    };

    return NextResponse.json({
      success: true,
      message: 'Address updated successfully',
      address: mockUserAddresses[index],
    });
  } catch (error) {
    console.error('Update user address error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/user/addresses/[id]
 * Delete a user address
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const index = mockUserAddresses.findIndex((addr) => addr.id === id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      );
    }

    // Remove address from array
    mockUserAddresses.splice(index, 1);

    return NextResponse.json({
      success: true,
      message: 'Address deleted successfully',
    });
  } catch (error) {
    console.error('Delete user address error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}