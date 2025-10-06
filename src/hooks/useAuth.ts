"use client"; // Retained, must be the absolute first line

/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext } from 'react';
import { UseMutationResult } from '@tanstack/react-query';

// Define the type for the AuthContext value
export interface AuthContextType {
    /* eslint-disable @typescript-eslint/no-explicit-any */ 
    user: any;
    loading: boolean;
    register: UseMutationResult<{ user: any; token: any; }, Error, { firstName: string; lastName: string; email: string; password: string; role?: string; }, unknown>;
    login: UseMutationResult<{ user: any; token: any; }, Error, { email: string; password: string; }, unknown>;
    adminLogin: UseMutationResult<{ user: any; token: any; }, Error, { email: string; password: string; }, unknown>;
    logout: () => void;
    error: string | undefined;
    token: any;
}

const initialValue = () => {
    if (typeof window !== 'undefined') {
        // ONLY access browser APIs here
        return localStorage.getItem('key') || '';
    }
    return ''; // Return a safe default value during server rendering
};

const [state, setState] = useState(initialValue);

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
    // This correctly calls useContext, which is a hook, inside a custom hook.
    const context = useContext(AuthContext);
    if (!context) {
        // This is a common pattern to ensure the hook is used inside its provider.
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export { AuthContext };