import { create } from 'zustand';
import { Product } from '@/types/product';
import { toast } from 'sonner';

interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  cart: [],

  addToCart: (product: Product, quantity: number = 1) => {
    set((state) => {
      const existingItem = state.cart.find((item) => item.id === product.id);

      if (existingItem) {
        // Check if adding quantity exceeds stock
        if (existingItem.quantity + quantity > product.stock) {
          toast.error(`Cannot add more than ${product.stock} units of ${product.name} to cart. Only ${product.stock - existingItem.quantity} more available.`);
          return state; // Return previous cart state without modification
        }
        return {
          cart: state.cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }

      // Check if product quantity exceeds stock
      if (quantity > product.stock) {
        toast.error(`Cannot add ${quantity} units of ${product.name}. Only ${product.stock} available.`);
        return state; // Return previous cart state without modification
      }

      return {
        cart: [...state.cart, { ...product, quantity }],
      };
    });

    // Toast message is handled in ProductCard/ProductDetailPage
    // toast.success(`${quantity} ${product.name} added to cart`);
  },

  removeFromCart: (productId: string) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== productId),
    }));
    toast.success('Item removed from cart');
  },

  updateQuantity: (productId: string, quantity: number) => {
    set((state) => {
      const itemToUpdate = state.cart.find(item => item.id === productId);
      if (!itemToUpdate) return state;

      if (quantity < 1) {
        // Remove if quantity goes to 0 or less
        return {
          cart: state.cart.filter((item) => item.id !== productId),
        };
      }

      // Prevent quantity from exceeding stock
      if (quantity > itemToUpdate.stock) {
        toast.error(`Cannot set quantity to ${quantity} for ${itemToUpdate.name}. Only ${itemToUpdate.stock} available.`);
        return state; // Keep existing quantity if stock is exceeded
      }

      return {
        cart: state.cart.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        ),
      };
    });
  },

  clearCart: () => {
    set({ cart: [] });
    toast.success('Cart cleared!');
  },

  get totalItems() {
    return get().cart.reduce((total, item) => total + item.quantity, 0);
  },

  get totalPrice() {
    return get().cart.reduce(
      (total, item) => total + item.price * item.quantity, 0
    );
  },
}));