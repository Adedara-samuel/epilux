// types/auth.d.ts

// MongoDB User interface
export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin' | 'affiliate';
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  profile?: {
    phone?: string;
    address?: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    avatar?: string;
  };
}

// JWT Token payload interface
export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// Authentication response interface
export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}