// src/services/auth.ts

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const authAPI = {
    /**
     * Registers a new user with the backend API.
     * @param {object} userData - The user data including firstName, lastName, email, and password.
     * @returns {Promise<object>} - A promise that resolves with the API response.
     */
    register: async (userData: { firstName: string; lastName: string; email: string; password: string }) => {
                const response = await fetch(`${BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Registration failed');
        }
        return response.json();
    },

    /**
     * Logs in a user with the backend API.
     * @param {object} credentials - The user credentials including email and password.
     * @returns {Promise<object>} - A promise that resolves with the API response.
     */
    login: async (credentials: { email: string; password: string }) => {
        const response = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed');
        }
        return response.json();
    },

    /**
     * Gets the current user's profile.
     * @param {string} token - The authorization token.
     * @returns {Promise<object>} - A promise that resolves with the API response.
     */
    getProfile: async (token: string) => {
        const response = await fetch(`${BASE_URL}/api/auth/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to get profile');
        }
        return response.json();
    },

    /**
     * Logs out the user.
     * @param {string} token - The authorization token.
     * @returns {Promise<object>} - A promise that resolves with the API response.
     */
    logout: async (token: string) => {
        const response = await fetch(`${BASE_URL}/api/auth/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Logout failed');
        }
        return response.json();
    },
};

export { authAPI };