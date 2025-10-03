import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        // Mock product data
        const product = {
            id,
            name: 'Premium Bottled Water',
            description: 'Pure, refreshing bottled water sourced from natural springs',
            price: 500,
            category: 'bottled',
            image: '/images/bottled-water.jpg',
            stock: 100,
            isActive: true,
            specifications: {
                volume: '500ml',
                type: 'Still',
                packaging: 'Plastic bottle'
            },
            reviews: [
                {
                    id: '1',
                    userId: 'user1',
                    userName: 'John Doe',
                    rating: 5,
                    comment: 'Great quality water!',
                    date: '2024-10-01T00:00:00Z'
                }
            ]
        };

        return NextResponse.json({ product });
    } catch (error) {
        console.error('Get product error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}