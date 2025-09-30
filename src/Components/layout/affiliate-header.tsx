// components/layout/AffiliateHeader.tsx
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { Button } from '../ui/button'; // Assuming Button component is available
import React from 'react';

interface AffiliateHeaderProps {
    onRegisterClick: () => void;
}

export default function AffiliateHeader({ onRegisterClick }: AffiliateHeaderProps) {
    return (
        <header className="bg-white shadow-md sticky top-0 z-40 border-b border-gray-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <img
                            src="/images/logo.png" // Use your logo path
                            alt="Epilux Water Logo"
                            className="h-8 w-auto transition-transform group-hover:scale-105"
                        />
                        <span className="text-xl font-bold text-blue-800 hidden sm:block">
                            Epilux <span className="text-blue-600">Water</span>
                        </span>
                    </Link>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors hidden sm:block">
                            Sign In
                        </Link>
                        <Button 
                            onClick={onRegisterClick}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                        >
                            Register
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}