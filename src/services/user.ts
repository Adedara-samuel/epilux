// src/services/user.ts
import { api } from './base';

export interface UserAddress {
    _id: string;
    type?: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault?: boolean;
}

// The backend stores a single address per user (profile.address). It is
// exposed as a one-item list so address UIs can treat it like a collection.
const toAddressList = (address: Partial<UserAddress> | null | undefined): UserAddress[] =>
    address && address.street
        ? [{ _id: 'default', type: 'home', isDefault: true, country: 'Nigeria', zipCode: '', city: '', state: '', ...address } as UserAddress]
        : [];

type AddressInput = {
    type?: string;
    street: string;
    city: string;
    state: string;
    zipCode?: string;
    country?: string;
    isDefault?: boolean;
};

const saveAddress = async (addressData: Partial<AddressInput>) => {
    const response = await api.put('/api/users/me/address', {
        street: addressData.street,
        city: addressData.city,
        state: addressData.state,
        zipCode: addressData.zipCode || '000000',
        country: addressData.country || 'Nigeria',
    });
    return response.data;
};

// User API functions
export const userAPI = {
    // Get the logged in user's profile
    getProfile: async () => {
        const response = await api.get('/api/users/me');
        return response.data;
    },

    // Update the logged in user's profile (first/last name and phone only)
    updateProfile: async (profileData: {
        firstName?: string;
        lastName?: string;
        phone?: string;
    }) => {
        const response = await api.put('/api/users/me', profileData);
        return response.data;
    },

    // Change password
    changePassword: async (passwordData: {
        currentPassword: string;
        newPassword: string;
    }) => {
        const response = await api.put('/api/auth/change-password', passwordData);
        return response.data;
    },

    // Get user's orders
    getOrders: async () => {
        const response = await api.get('/api/orders/my-orders');
        return response.data;
    },

    // Get user's saved address, as { addresses: [...] }
    getAddresses: async () => {
        const response = await api.get('/api/users/me/address');
        return { addresses: toAddressList(response.data?.data) };
    },

    // Save the user's address (there is one address per user)
    addAddress: async (addressData: AddressInput) => saveAddress(addressData),

    // Update the user's address
    updateAddress: async (_id: string, addressData: Partial<AddressInput>) => saveAddress(addressData),

    // Remove the user's address
    deleteAddress: async (_id: string) => {
        const response = await api.delete('/api/users/me/address');
        return response.data;
    },
};
