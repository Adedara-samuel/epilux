// src/services/auth.ts

// Use the environment variable, falling back to localhost:5000 if not set.
// This requires NEXT_PUBLIC_API_URL to be defined in .env.local
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

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
     * Registers a new user with the backend API.
     * @param userData - The user data including firstName, lastName, email, password, and optional role.
     * @returns A promise that resolves with the API response (e.g., user data or token).
     */
    register: async (userData: UserRegistrationData) => {
        const response = await fetch(`${BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        return handleResponse(response, 'Registration failed');
    },

    /**
     * Logs in a user with the backend API.
     * @param credentials - The user credentials including email and password.
     * @returns A promise that resolves with the API response (e.g., auth token).
     */
    login: async (credentials: UserCredentials) => {
        const response = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });
        return handleResponse(response, 'Login failed');
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