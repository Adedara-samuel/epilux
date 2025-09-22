// src/types/user.ts
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin' | 'affiliate';
  emailVerified: boolean;
  profile?: UserProfile;
  affiliateInfo?: AffiliateInfo;
  createdAt: string;
  lastLogin?: string;
}

export interface UserProfile {
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  avatar?: string;
  dateOfBirth?: string;
}

export interface AffiliateInfo {
  affiliateCode?: string;
  referredBy?: string;
  commissionRate: number;
  totalEarnings: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  profile?: {
    address?: {
      street?: string;
      city?: string;
      state?: string;
      country?: string;
      zipCode?: string;
    };
  };
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}
