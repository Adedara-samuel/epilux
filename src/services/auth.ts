// src/services/auth.ts

// Use the environment variable, falling back to localhost:5000 if not set.
// This requires NEXT_PUBLIC_API_URL to be defined in .env.local
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://epilux-backend.vercel.app';

/**
 * Defines the structure for user registration data.
 */
interface UserRegistrationData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: string;
}

/**
 * Defines the structure for user login credentials.
 */
interface UserCredentials {
    email: string;
    password: string;
}

/**
 * Defines the structure for user profile update data.
 */
interface UserProfileUpdateData {
    firstName?: string;
    lastName?: string;
    phone?: string;
    profile?: Record<string, unknown>;
}

/**
 * Helper function to handle fetch response errors consistently.
 * @param response The Response object from a fetch call.
 * @param defaultMessage The default error message to use if API response doesn't provide one.
 * @returns The parsed JSON body if the response is ok.
 * @throws An error with a message from the API or the default message.
 */
const handleResponse = async (response: Response, defaultMessage: string) => {
    if (!response.ok) {
        // Attempt to parse the error message from the response body
        const errorData = await response.json().catch(() => ({ message: defaultMessage }));
        throw new Error(errorData.message || defaultMessage);
    }
    return response.json();
};

const authAPI = {
    /**
     * Logs in a user with the backend API.
     * @param credentials - The user credentials including email and password.
     * @returns A promise that resolves with the API response (e.g., auth token and user data).
     */
    async login(credentials: UserCredentials) {
        const response = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
            credentials: 'include', // Important for cookies
        });

        return handleResponse(response, 'Login failed');
    },
    /**
     * Registers a new user with the backend API.
     * @param userData - The user data including firstName, lastName, email, password, and optional role.
     * @returns A promise that resolves with the API response (e.g., user data or token).
     */
    register: async (userData: UserRegistrationData) => {
        console.log('Attempting to register user at:', `${BASE_URL}/api/auth/register`);
        try {
            const response = await fetch(`${BASE_URL}/api/auth/register`, {
                // const response = await fetch("http://localhost:5000/api/auth/register", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            return await handleResponse(response, 'Registration failed');
        } catch (error) {
            console.error('Network error during registration:', error);
            throw new Error('Failed to Fetch')
        }
    },

    /**
     * Logs in an admin with the backend API.
     * @param credentials - The admin credentials including email and password.
     * @returns A promise that resolves with the API response (e.g., auth token).
     */
    adminLogin: async (credentials: UserCredentials) => {
        const response = await fetch(`${BASE_URL}/api/auth/admin/login`, {
        // const response = await fetch("http://localhost:5000/api/auth/admin/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });
        return handleResponse(response, 'Admin login failed');
    },

    /**
     * Gets the current user's profile.
     * @param token - The authorization token.
     * @returns A promise that resolves with the user profile data.
     */
    getProfile: async (token: string) => {
        const response = await fetch(`${BASE_URL}/api/auth/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return handleResponse(response, 'Failed to get profile');
    },

    /**
     * Logs out the user.
     * @param token - The authorization token.
     * @returns A promise that resolves with the API response.
     */
    logout: async (token: string) => {
        const response = await fetch(`${BASE_URL}/api/auth/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return handleResponse(response, 'Logout failed');
    },

    /**
     * Updates the user profile.
     * @param token - The authorization token.
     * @param profileData - The profile data to update.
     * @returns A promise that resolves with the API response.
     */
    updateProfile: async (token: string, profileData: UserProfileUpdateData) => {
        const response = await fetch(`${BASE_URL}/api/auth/profile`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profileData),
        });
        return handleResponse(response, 'Profile update failed');
    },

    /**
     * Changes the user password.
     * @param token - The authorization token.
     * @param passwordData - The password data including current and new password.
     * @returns A promise that resolves with the API response.
     */
    changePassword: async (token: string, passwordData: { currentPassword: string; newPassword: string }) => {
        const response = await fetch(`${BASE_URL}/api/auth/password`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(passwordData),
        });
        return handleResponse(response, 'Password change failed');
    },

    /**
     * Sends a forgot password request.
     * @param data - The data including email.
     * @returns A promise that resolves with the API response.
     */
    forgotPassword: async (data: { email: string }) => {
        const response = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return handleResponse(response, 'Forgot password failed');
    },
};

export { authAPI };