/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';

// Mock user orders - in real app, fetch from database
const mockUserOrders = [
  {
    id: 'order-1',
    total: 150,
    status: 'delivered',
    createdAt: '2024-01-15T10:00:00Z',
    items: [
      {
        productId: {
          id: '1',
          name: 'Epilux Pure Water 75cl',
          price: 50,
          image: '/images/product1.jpg',
        },
        quantity: 3,
      },
    ],
  },
  {
    id: 'order-2',
    total: 300,
    status: 'processing',
    createdAt: '2024-01-20T14:30:00Z',
    items: [
      {
        productId: {
          id: '2',
          name: 'Epilux Table Water 1L',
          price: 150,
          image: '/images/product2.jpg',
        },
        quantity: 2,
      },
    ],
  },
];

export async function GET(request: NextRequest) {
  try {
    // In real app, get orders for authenticated user
    return NextResponse.json({
      success: true,
      orders: mockUserOrders,
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}