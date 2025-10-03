/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/affiliate.ts

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Helper function to handle fetch response errors consistently.
 */
const handleResponse = async (response: Response, defaultMessage: string) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: defaultMessage }));
        throw new Error(errorData.message || defaultMessage);
    }
    return response.json();
};

const affiliateAPI = {
    /**
     * Gets affiliate profile.
     * @param token - The authorization token.
     * @returns A promise that resolves with the profile data.
     */
    getProfile: async (token: string) => {
        const response = await fetch(`${BASE_URL}/api/affiliate/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return handleResponse(response, 'Failed to get affiliate profile');
    },

    /**
     * Creates or updates affiliate profile.
     * @param token - The authorization token.
     * @param profileData - The profile data.
     * @returns A promise that resolves with the profile data.
     */
    updateProfile: async (token: string, profileData: any) => {
        const response = await fetch(`${BASE_URL}/api/affiliate/profile`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profileData),
        });
        return handleResponse(response, 'Failed to update affiliate profile');
    },

    /**
     * Gets affiliate sales data.
     * @param token - The authorization token.
     * @returns A promise that resolves with the sales data.
     */
    getSales: async (token: string) => {
        const response = await fetch(`${BASE_URL}/api/affiliate/sales`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return handleResponse(response, 'Failed to get affiliate sales');
    },

    /**
     * Gets affiliate referrals.
     * @param token - The authorization token.
     * @returns A promise that resolves with the referrals data.
     */
    getReferrals: async (token: string) => {
        const response = await fetch(`${BASE_URL}/api/affiliate/referrals`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return handleResponse(response, 'Failed to get affiliate referrals');
    },

    /**
     * Gets affiliate dashboard summary.
     * @param token - The authorization token.
     * @returns A promise that resolves with the dashboard data.
     */
    getDashboard: async (token: string) => {
        const response = await fetch(`${BASE_URL}/api/affiliate/dashboard`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return handleResponse(response, 'Failed to get affiliate dashboard');
    },

    /**
     * Records a new sale/commission.
     * @param token - The authorization token.
     * @param saleData - The sale data.
     * @returns A promise that resolves with the sale data.
     */
    recordSale: async (token: string, saleData: any) => {
        const response = await fetch(`${BASE_URL}/api/affiliate/record-sale`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(saleData),
        });
        return handleResponse(response, 'Failed to record sale');
    },
};

export { affiliateAPI };