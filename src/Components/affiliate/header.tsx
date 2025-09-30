import React from 'react';
import { Award } from 'lucide-react';

export const Header = () => (
    <header className="bg-white shadow-md sticky top-0 z-10 p-4 border-b border-blue-100">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-blue-800 flex items-center">
                <Award className="h-6 w-6 mr-2 text-yellow-500 fill-yellow-500" />
                Epilux Partner Dashboard
            </h1>
            <div className="flex items-center space-x-4">
                <span className="text-gray-600 hidden sm:inline text-sm">Welcome, Partner!</span>
                <button className="text-sm font-semibold text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg transition-colors shadow-md">Logout</button>
            </div>
        </div>
    </header>
);
