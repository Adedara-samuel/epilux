// types/order.ts

import { Product } from './product';

export interface OrderItem {
  productId: Product;
  quantity: number;
}

export interface Order {
  id: string;
  createdAt: string;
  total: number;
  status: string;
  items: OrderItem[];
}