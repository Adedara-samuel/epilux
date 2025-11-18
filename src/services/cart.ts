import { api } from './base';

export interface CartItem {
    _id: string;
    productId: {
        _id: string;
        name: string;
        price: number;
        images?: Array<{ url: string; alt?: string; isPrimary?: boolean }>;
        image?: string;
        stock: number;
    };
    quantity: number;
}

export interface Cart {
    _id: string;
    userId: string;
    items: CartItem[];
    total: number;
    createdAt: string;
    updatedAt: string;
}

export const cartAPI = {
    // Get user's cart
    getCart: async (token: string): Promise<{ data: Cart }> => {
        if (!token) {
            throw new Error('Authentication required');
        }
        const response = await api.get('/api/cart', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    // Add item to cart
    addToCart: async (token: string, productId: string, quantity: number, image: string, name?: string, price?: number): Promise<{ data: Cart }> => {
        if (!token) {
            throw new Error('Authentication required');
        }
        const response = await api.post('/api/cart/items', { productId, quantity, image, name, price }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    // Update cart item quantity
    updateCartItem: async (token: string, itemId: string, quantity: number): Promise<{ data: Cart }> => {
        if (!token) {
            throw new Error('Authentication required');
        }
        const response = await api.put(`/api/cart/items/${itemId}`, { quantity }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    // Remove item from cart
    removeFromCart: async (token: string, itemId: string): Promise<{ data: Cart }> => {
        if (!token) {
            throw new Error('Authentication required');
        }
        const response = await api.delete(`/api/cart/items/${itemId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    // Clear cart
    clearCart: async (token: string): Promise<{ message: string }> => {
        if (!token) {
            throw new Error('Authentication required');
        }
        const response = await api.delete('/api/cart', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
};