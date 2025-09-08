/* eslint-disable @next/next/no-img-element */
// components/layout/Header.tsx
import Link from 'next/link';
import React from 'react';
import { Button } from './ui/button';
import { LogIn } from 'lucide-react';

const Header: React.FC = () => {
    return (
        <header className="bg-white text-blue-700 p-4 shadow-lg sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2 group">
                    <img
                        src="/images/logo.png"
                        alt="Epilux Water Logo"
                        className="h-9 w-auto rounded-full border-2 border-white transition-transform group-hover:scale-105"
                        
                    />
                    <span className="text-2xl font-bold text-blue-700 hidden sm:block">
                        Epilux <span className="text-blue-300">Water</span>
                    </span>
                </Link>
                <Button asChild variant="secondary" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-full shadow-md">
                    <Link href="/login">
                    <LogIn/>
                    Login
                    </Link>
                </Button>
            </div>
        </header>
    );
}

export default Header;