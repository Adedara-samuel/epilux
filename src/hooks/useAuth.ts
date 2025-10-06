"use client"; // Retained, must be the absolute first line

/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext } from 'react';
import { UseMutationResult } from '@tanstack/react-query';

// Define the type for the AuthContext value
interface AuthContextType {
    user: any;
    loading: boolean;
    register: UseMutationResult<{ user: any; token: any; }, Error, { firstName: string; lastName: string; email: string; password: string; role?: string; }, unknown>;
    login: UseMutationResult<{ user: any; token: any; }, Error, { email: string; password: string; }, unknown>;
    adminLogin: UseMutationResult<{ user: any; token: any; }, Error, { email: string; password: string; }, unknown>;
    logout: () => void;
    error: string | undefined;
    token: any;
}

// 1. Removed the illegal useState call and related initialValue function.
// 2. AuthContext is created with a null default value.
const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Custom hook to consume the authentication context.
 * Throws an error if used outside of an AuthProvider.
 */
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

// 3. You MUST now create an AuthProvider component in a separate file 
//    (e.g., AuthProvider.tsx) to hold all your state logic.
//    The AuthProvider component will contain the removed logic:
/*
// AuthProvider.tsx (Example structure)
"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { AuthContext } from './AuthContext'; // assuming the above code is here
import { useLoginMutation, useRegisterMutation, ... } from './mutations';

export function AuthProvider({ children }) {
    // Hook calls are LEGAL here because they are inside a function component body
    const [token, setToken] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token') || null;
        }
        return null;
    });
    // ... rest of your state and mutation logic
    
    const login = useLoginMutation(); // example
    const register = useRegisterMutation(); // example

    const contextValue = useMemo(() => ({
        user: null, // Placeholder
        loading: false, // Placeholder
        register,
        login,
        adminLogin: login, // Placeholder
        logout: () => {}, // Placeholder
        error: undefined, // Placeholder
        token,
    }), [token, register, login]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}
*/