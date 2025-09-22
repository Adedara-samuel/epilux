// src/lib/api.ts
import axios from 'axios';

const API_BASE_URL = process.env.MONGODB_URI || 'http://localhost:5000/api';
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  // Register new user
  register: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials: {
    email: string;
    password: string;
  }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData: any) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },

  // Change password
  changePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }) => {
    const response = await api.put('/auth/password', passwordData);
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Verify email
  verifyEmail: async (token: string) => {
    const response = await api.post('/auth/verify-email', { token });
    return response.data;
  },

  // Update user role (admin only)
  updateUserRole: async (email: string, role: string) => {
    const response = await api.put('/auth/role', { email, role });
    return response.data;
  },
};

// Utility functions for token management
export const tokenManager = {
  setToken: (token: string) => {
    localStorage.setItem('authToken', token);
  },

  getToken: () => {
    return localStorage.getItem('authToken');
  },

  removeToken: () => {
    localStorage.removeItem('authToken');
  },

  setUser: (user: any) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  getUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  removeUser: () => {
    localStorage.removeItem('user');
  },

  // Clear all auth data
  clearAuth: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
};

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
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Get single product by ID
  getProduct: async (id: string) => {
    const response = await api.get(`/products/${id}`);
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
    const response = await api.post('/products', productData);
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
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  // Delete product (admin only)
  deleteProduct: async (id: string) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Get product categories
  getCategories: async () => {
    const response = await api.get('/products/categories/list');
    return response.data;
  },

  // Get product brands
  getBrands: async () => {
    const response = await api.get('/products/brands/list');
    return response.data;
  },
};

// Orders API functions
export const ordersAPI = {
  // Get user's orders
  getMyOrders: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) => {
    const response = await api.get('/orders/my-orders', { params });
    return response.data;
  },

  // Get single order by ID
  getOrder: async (id: string) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Create new order
  createOrder: async (orderData: {
    items: {
      productId: string;
      quantity: number;
    }[];
    shippingAddress: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    billingAddress?: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    paymentMethod: string;
    notes?: string;
  }) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Get all orders (admin only)
  getAllOrders: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    paymentStatus?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  // Update order status (admin only)
  updateOrderStatus: async (id: string, status: string) => {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
  },

  // Update payment status (admin only)
  updatePaymentStatus: async (id: string, paymentStatus: string) => {
    const response = await api.put(`/orders/${id}/payment-status`, { paymentStatus });
    return response.data;
  },

  // Get order statistics (admin only)
  getOrderStats: async () => {
    const response = await api.get('/orders/stats/summary');
    return response.data;
  },
};

// Health check
export const healthAPI = {
  check: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;
