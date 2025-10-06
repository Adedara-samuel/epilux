/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React from 'react';
import { Award, User, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@/Components/ui/button';

const HeaderComponent = React.memo(() => {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const handleProfileClick = () => {
        router.push('/affiliate/profile');
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-10 p-4 border-b border-blue-100">
            <div className="flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-bold text-blue-800 flex items-center">
                    {/* <Award className="h-6 w-6 mr-2 text-yellow-500 fill-yellow-500" /> */}
                    <img src="/images/logo.png" alt="Epilux Water Logo" className="h-8 w-auto mr-2" />
                    Epilux Partner Dashboard
                </h1>
                <div className="flex items-center space-x-4">
                    <span className="text-gray-600 hidden sm:inline text-sm">
                        Welcome, {user?.firstName || user?.name || 'Partner'}!
                    </span>

                    {/* Profile Button */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleProfileClick}
                        className="flex items-center gap-1 border-none rounded-full hover:bg-blue-50 cursor-pointer"
                    >
                        <User className="h-4 w-4" />
                    </Button>

                    <button
                        onClick={handleLogout}
                        className="text-sm font-semibold text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg transition-colors shadow-md cursor-pointer"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
});

HeaderComponent.displayName = 'AffiliateHeader';

export const Header = HeaderComponent;
