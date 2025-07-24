// components/home/HeroSection.tsx
import { Button } from '../ui/button';
import Link from 'next/link';
import React from 'react';

const HeroSection: React.FC = () => {
    return (
        <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-24 md:py-32 overflow-hidden shadow-lg">
            <div className="container mx-auto px-6 relative z-10 text-center">
                <h1 className="text-4xl md:text-6xl font-extrabold mb-6 animate-fade-in-down">
                    Premium Quality Water Delivered to You
                </h1>
                <p className="text-lg md:text-xl mb-10 max-w-3xl mx-auto opacity-90 animate-fade-in-up">
                    Epilux Water provides the purest drinking water with convenient delivery options and exciting affiliate opportunities.
                </p>
                <Button asChild variant="secondary" className="bg-white text-blue-700 hover:bg-gray-100 px-8 py-3 text-lg rounded-full shadow-lg transition-transform transform hover:scale-105 animate-fade-in-up delay-200">
                    <Link href="/login?redirect=/products">Shop Now</Link>
                </Button>
            </div>
            {/* Optional: Add background shapes/patterns for more visual interest */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
                <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-1/4 left-1/2 w-48 h-48 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>
        </section>
    );
}

export default HeroSection;