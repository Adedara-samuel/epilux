// types/order.ts

import { Product } from './product';

export interface OrderItem {
  productId: Product;
  quantity: number;
}

export interface ProductRating {
  productId: string;
  rating: number;
  review: string;
  createdAt: string;
}

export interface MarketerRating {
  rating: number;
  review: string;
  createdAt: string;
}

export interface Order {
  id: string;
  createdAt: string;
  total: number;
  status: string;
  items: OrderItem[];
  marketerId?: string;
  deliveryConfirmed: boolean;
  deliveryConfirmedAt?: string;
  productRatings: ProductRating[];
  marketerRating?: MarketerRating;
}