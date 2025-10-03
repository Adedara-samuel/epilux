// src/services/admin.ts

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

const adminAPI = {
    /**
     * Gets all users (admin only).
     * @param token - The authorization token.
     * @returns A promise that resolves with the users data.
     */
    getUsers: async (token: string) => {
        const response = await fetch(`${BASE_URL}/api/admin/users`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return handleResponse(response, 'Failed to get users');
    },

    /**
     * Gets a user by ID (admin only).
     * @param token - The authorization token.
     * @param id - The user ID.
     * @returns A promise that resolves with the user data.
     */
    getUser: async (token: string, id: string) => {
        const response = await fetch(`${BASE_URL}/api/admin/users/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return handleResponse(response, 'Failed to get user');
    },

    /**
     * Updates a user's role (admin only).
     * @param token - The authorization token.
     * @param id - The user ID.
     * @param role - The new role.
     * @returns A promise that resolves with the updated user data.
     */
    updateUserRole: async (token: string, id: string, role: string) => {
        const response = await fetch(`${BASE_URL}/api/admin/users/${id}/role`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ role }),
        });
        return handleResponse(response, 'Failed to update user role');
    },

    /**
     * Deletes a user (admin only).
     * @param token - The authorization token.
     * @param id - The user ID.
     * @returns A promise that resolves with the response.
     */
    deleteUser: async (token: string, id: string) => {
        const response = await fetch(`${BASE_URL}/api/admin/users/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return handleResponse(response, 'Failed to delete user');
    },

    /**
     * Gets admin dashboard stats (admin only).
     * @param token - The authorization token.
     * @returns A promise that resolves with the stats data.
     */
    getDashboardStats: async (token: string) => {
        // Use relative URL for Next.js API
        const response = await fetch('/api/admin/dashboard/stats', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return handleResponse(response, 'Failed to get dashboard stats');
    },

    /**
     * Gets recent users (admin only).
     * @param token - The authorization token.
     * @returns A promise that resolves with the recent users data.
     */
    getRecentUsers: async (token: string) => {
        const response = await fetch(`${BASE_URL}/api/admin/users/recent`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return handleResponse(response, 'Failed to get recent users');
    },
};

export { adminAPI };