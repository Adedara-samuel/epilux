/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/products.ts
import { api } from './base';

// Public Products API functions
export const productsAPI = {
    // Get active products. Filters map to query params on /api/products.
    getProducts: async (params?: {
        category?: string;
        search?: string;
        page?: number;
        limit?: number;
        minPrice?: number;
        maxPrice?: number;
    }) => {
        const queryParams: Record<string, string | number> = { limit: params?.limit ?? 100 };
        if (params?.category) queryParams.category = params.category;
        if (params?.search) queryParams.search = params.search;
        if (params?.page) queryParams.page = params.page;
        if (params?.minPrice !== undefined) queryParams.minPrice = params.minPrice;
        if (params?.maxPrice !== undefined) queryParams.maxPrice = params.maxPrice;

        const response = await api.get('/api/products', { params: queryParams });
        return response.data;
    },

    // Get single product by ID
    getProduct: async (id: string) => {
        const response = await api.get(`/api/products/${id}`);
        return response.data;
    },

    // Get products by category
    getProductsByCategory: async (category: string) => {
        const response = await api.get('/api/products', { params: { category, limit: 100 } });
        return response.data;
    },

    // Search products
    searchProducts: async (query: string) => {
        const response = await api.get('/api/products', {
            params: { search: query, limit: 100 }
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
        const response = await api.post(`/api/products/${productId}/reviews`, reviewData);
        return response.data;
    },

    // Delete the current user's review of a product
    deleteProductReview: async (productId: string, reviewId: string) => {
        const response = await api.delete(`/api/products/${productId}/reviews/${reviewId}`);
        return response.data;
    },

    // Reviews written by the current user (approved and pending)
    getMyReviews: async () => {
        const response = await api.get('/api/users/me/reviews');
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

    // Create new product (admin only). Pass FormData to upload image files.
    createProduct: async (productData: FormData | {
        name: string;
        description: string;
        price: number;
        category: string;
        stock: number;
        brand?: string;
        images?: { url: string; alt?: string; isPrimary?: boolean }[];
        [key: string]: any;
    }) => {
        const response = await api.post('/api/admin/products', productData, productData instanceof FormData
            ? { headers: { 'Content-Type': 'multipart/form-data' } }
            : undefined);
        return response.data;
    },

    // Get single product by ID (admin)
    getProduct: async (id: string) => {
        const response = await api.get(`/api/admin/products/${id}`);
        return response.data;
    },

    // Update product (admin only). Pass FormData to upload new image files;
    // its `images` field (JSON) lists the existing images to keep.
    updateProduct: async (id: string, productData: FormData | Partial<{
        name: string;
        description: string;
        price: number;
        category: string;
        brand: string;
        stock: number;
        isActive: boolean;
        isFeatured: boolean;
        images: { url: string; alt?: string; isPrimary?: boolean; publicId?: string }[];
    }>) => {
        const response = await api.put(`/api/admin/products/${id}`, productData, productData instanceof FormData
            ? { headers: { 'Content-Type': 'multipart/form-data' } }
            : undefined);
        return response.data;
    },

    // Delete product (admin only)
    deleteProduct: async (id: string) => {
        const response = await api.delete(`/api/admin/products/${id}`);
        return response.data;
    },

    // Add images to an existing product (admin only); existing images are kept
    uploadProductImages: async (id: string, images: File[]) => {
        const formData = new FormData();
        images.forEach(image => {
            formData.append('images', image);
        });
        const response = await api.put(`/api/admin/products/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Get product categories (admin)
    getCategories: async () => {
        const response = await api.get('/api/admin/products/categories');
        return response.data;
    },
};