'use client';

import { useCartStore } from '@/stores/cart-store';

export const useCart = () => {
  return useCartStore();
};