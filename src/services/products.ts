// src/services/products.ts
import { api } from './base';

// Products API functions
export const productsAPI = {
  // Get all products with pagination and filtering
  getProducts: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sortBy?: 'price' | 'name' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
  }) => {
    const response = await api.get('/api/products', { params });
    return response.data;
  },

  // Get single product by ID
  getProduct: async (id: string) => {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  },

  // Create new product (admin only)
  createProduct: async (productData: {
    name: string;
    description: string;
    price: number;
    category: string;
    brand: string;
    stock: number;
    images?: string[];
    tags?: string[];
  }) => {
    const response = await api.post('/api/products', productData);
    return response.data;
  },

  // Update product (admin only)
  updateProduct: async (id: string, productData: Partial<{
    name: string;
    description: string;
    price: number;
    category: string;
    brand: string;
    stock: number;
    images: string[];
    tags: string[];
    isActive: boolean;
  }>) => {
    const response = await api.put(`/api/products/${id}`, productData);
    return response.data;
  },

  // Delete product (admin only)
  deleteProduct: async (id: string) => {
    const response = await api.delete(`/api/products/${id}`);
    return response.data;
  },

  // Get product categories
  getCategories: async () => {
    const response = await api.get('/api/products/categories/list');
    return response.data;
  },

  // Get product brands
  getBrands: async () => {
    const response = await api.get('/api/products/brands/list');
    return response.data;
  },
};