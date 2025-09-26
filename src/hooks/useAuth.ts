/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext } from 'react';
import { UseMutationResult } from '@tanstack/react-query';

// Define the type for the AuthContext value
interface AuthContextType {
    user: any;
    loading: boolean;
    register: UseMutationResult<{ user: any; token: any; }, Error, { firstName: string; lastName: string; email: string; password: string; }, unknown>;
    login: UseMutationResult<{ user: any; token: any; }, Error, { email: string; password: string; }, unknown>;
    error: string | undefined;
    token: any;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export { AuthContext };