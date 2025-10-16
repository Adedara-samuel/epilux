
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

// FIX APPLIED HERE: Changed the type of 'params' from Promise<{ id: string }> to { id: string }
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
	try {
		// Destructuring is now valid as 'params' is a plain object { id: string }
		const { id } = params;
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

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
	try {
		const { id } = params;

		// In real app, delete from database
		const index = mockUserAddresses.findIndex(addr => addr.id === id);
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