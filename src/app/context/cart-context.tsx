// @/stores/cart-store.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define your Cart Item type
interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    // Add other properties like size, etc.
}

// Define the state and actions
interface CartState {
    cart: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity'>, quantity: number) => void;
    removeFromCart: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            // State
            cart: [],

            // Actions
            addToCart: (item, quantity) => {
                set((state) => {
                    const existingItemIndex = state.cart.findIndex(i => i.id === item.id);
                    if (existingItemIndex > -1) {
                        // Update quantity if item exists
                        const newCart = [...state.cart];
                        newCart[existingItemIndex].quantity += quantity;
                        return { cart: newCart };
                    } else {
                        // Add new item
                        return { cart: [...state.cart, { ...item, quantity }] };
                    }
                });
            },

            removeFromCart: (itemId) => {
                set((state) => ({
                    cart: state.cart.filter(item => item.id !== itemId),
                }));
            },

            updateQuantity: (itemId, quantity) => {
                if (quantity <= 0) {
                    get().removeFromCart(itemId);
                    return;
                }
                set((state) => ({
                    cart: state.cart.map(item =>
                        item.id === itemId ? { ...item, quantity } : item
                    ),
                }));
            },

            clearCart: () => set({ cart: [] }),
        }),
        {
            name: 'cart-storage', // key for localStorage
            // 💡 THIS IS THE CRITICAL FIX: Use 'noOp' storage on the server
            storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : {
                getItem: () => null,
                setItem: () => undefined,
                removeItem: () => undefined,
            })),
            // Optional: Prevent hydration mismatch warning by waiting for rehydration
            onRehydrateStorage: () => (state) => {
                if (state) {
                    console.log('Cart state rehydrated from storage');
                }
            },
        }
    )
);

// 💡 NOTE: Remove any other access to window/localStorage inside this file!