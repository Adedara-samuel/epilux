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
    image?: string | string[];
    images?: string[]; // Array field
    [key: string]: any;
  }) => {

    // 1. Create a mutable copy of the product data
    const payload = { ...productData };

    // 2. Determine the single primary image string
    let primaryImage: string = '';

    // Prioritize the 'images' array if it exists and has data
    if (Array.isArray(payload.images) && payload.images.length > 0) {
      primaryImage = payload.images[0];
    }
    // Fallback: Check 'image' field if it's an array
    else if (Array.isArray(payload.image) && payload.image.length > 0) {
      primaryImage = payload.image[0];
    }
    // Fallback: Use 'image' field if it's already a string
    else if (typeof payload.image === 'string') {
      primaryImage = payload.image;
    }

    // 3. CRITICAL FIXES: Clean the payload for the backend

    // A. Assign the single string to the 'image' field
    payload.image = primaryImage;

    // B. REMOVE the problematic 'images' array field 
    if (payload.images !== undefined) {
      delete payload.images;
    }

    // 4. Send the cleaned payload
    const response = await api.post('/api/admin/products', payload);
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
    image: string | string[]; // Allow array for consistency
  }>) => {
    const dataToSend: any = { ...productData }; // Use 'any' for the temporary addition of 'id'

    // FIX: Add the id to the payload body as requested by the backend
    dataToSend.id = id; 

    if (dataToSend.image !== undefined) {
      if (Array.isArray(dataToSend.image)) {
        dataToSend.image = dataToSend.image.length > 0 ? dataToSend.image[0] : '';
      } else if (typeof dataToSend.image !== 'string') {
        dataToSend.image = '';
      }
    }

    const response = await api.put(`/api/admin/products/${id}`, dataToSend);
    return response.data;
  },

  // Delete product (admin only)
  deleteProduct: async (id: string) => {
    const response = await api.delete(`/api/admin/products/${id}`);
    return response.data;
  },

  // Get product categories (admin)
  getCategories: async () => {
    const response = await api.get('/api/admin/products/categories');
    return response.data;
  },
};