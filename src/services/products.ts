/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/products.ts
import { api } from './base';

// Public Products API functions
export const productsAPI = {
    // Get all products
    getProducts: async (params?: { category?: string; search?: string }) => {
        let url = '/api/products';
        const queryParams: Record<string, string> = {};

        if (params?.category) {
            url = `/api/products/category/${params.category}`;
        } else if (params?.search) {
            url = '/api/products/search';
            queryParams.q = params.search;
        }

        const response = await api.get(url, { params: queryParams });
        return response.data;
    },

    // Get single product by ID
    getProduct: async (id: string) => {
        const response = await api.get(`/api/products/${id}`);
        return response.data;
    },

    // Get products by category
    getProductsByCategory: async (category: string) => {
        const response = await api.get(`/api/products/category/${category}`);
        return response.data;
    },

    // Search products
    searchProducts: async (query: string) => {
        const response = await api.get('/api/products/search', {
            params: { q: query }
        });
        return response.data;
    },

    // Get product categories (public)
    getCategories: async () => {
        const response = await api.get('/api/products/categories');
        return response.data;
    },

    // Get product reviews
    getProductReviews: async (productId: string) => {
        const response = await api.get(`/api/products/${productId}/reviews`);
        return response.data;
    },

    // Add product review
    addProductReview: async (productId: string, reviewData: {
        rating: number;
        comment: string;
        title?: string;
    }) => {
        const response = await api.post(`/api/products/${productId}/reviews`, reviewData, {
            headers: {
                // Ensure the base api client handles the base URL and proper headers
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
        });
        return response.data;
    },

    // Get product ratings
    getProductRatings: async (productId: string) => {
        const response = await api.get(`/api/products/${productId}/ratings`);
        return response.data;
    },

    // Get product rating summary
    getProductRatingSummary: async (productId: string) => {
        const response = await api.get(`/api/products/${productId}/ratings/summary`);
        return response.data;
    },

    // Get current user's ratings
    getUserRatings: async () => {
        const response = await api.get('/api/users/me/ratings');
        return response.data;
    },
};

// Admin Products API functions
export const adminProductsAPI = {
    // Get all products (admin)
    getProducts: async (params?: { limit?: number }) => {
        const queryParams: Record<string, string> = {};
        if (params?.limit) {
            queryParams.limit = params.limit.toString();
        }
        const response = await api.get('/api/admin/products', { params: queryParams });
        return response.data;
    },

    // Create new product (admin only)
    createProduct: async (productData: {
        name: string;
        description: string;
        price: number;
        category: string;
        stock: number;
        brand?: string;
        images?: { url: string; alt: string; isPrimary: boolean }[];
        [key: string]: any;
    }) => {
        const response = await api.post('/api/admin/products', productData);
        return response.data;
    },

    // Get single product by ID (admin)
    getProduct: async (id: string) => {
        const response = await api.get(`/api/admin/products/${id}`);
        return response.data;
    },

    // Update product (admin only)
    updateProduct: async (id: string, productData: Partial<{
        name: string;
        description: string;
        price: number;
        category: string;
        stock: number;
        images: { url: string; alt: string; isPrimary: boolean }[];
    }>) => {
        const response = await api.put(`/api/admin/products/${id}`, productData);
        return response.data;
    },

    // Delete product (admin only)
    deleteProduct: async (id: string) => {
        const response = await api.delete(`/api/admin/products/${id}`);
        return response.data;
    },

    // Upload product images (admin only)
    uploadProductImages: async (id: string, images: File[]) => {
        const formData = new FormData();
        images.forEach(image => {
            formData.append('images', image);
        });
        const response = await api.post(`/api/products/${id}/images`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Get product categories (admin)
    getCategories: async () => {
        const response = await api.get('/api/admin/products/category');
        return response.data;
    },
};