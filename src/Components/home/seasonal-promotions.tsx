/* eslint-disable react/no-unescaped-entities */
// components/home/SeasonalPromotions.tsx
/* eslint-disable @next/next/no-img-element */
import { Button } from '../ui/button';
import React from 'react';
import Link from 'next/link';

interface Promotion {
    title: string;
    description: string;
    image: string;
    cta: string;
    endDate: string;
    redirectPath: string;
}

const SeasonalPromotions: React.FC = () => {
    const promotions: Promotion[] = [
        {
            title: "Dry Season Special",
            description: "Get 10% off all bulk orders during the dry season!",
            image: "/images/dry-season.jpeg",
            cta: "Shop Now",
            endDate: "2025-04-30",
            redirectPath: "/products?promo=dry-season"
        },
        {
            title: "Festival Hydration Bundle",
            description: "Buy 5 bags, get 1 free for all festive periods!",
            image: "/images/hero-image.jpeg",
            cta: "View Offer",
            endDate: "2025-12-31",
            redirectPath: "/offers/festival-bundle"
        }
    ];

    return (
        <section className="bg-blue-50 py-12 md:py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8 md:mb-14">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-700 mb-4 tracking-tight">Exciting Seasonal Promotions</h2>
                    <p className="text-base sm:text-lg text-blue-600 max-w-3xl mx-auto leading-relaxed px-4">
                        Don't miss out on our special offers during high-demand periods and festive seasons!
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                    {promotions.map((promo, index) => (
                        <div key={index} className="relative rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                            <div className="absolute inset-0 bg-black/70 z-10"></div>
                            <img
                                src={promo.image}
                                alt={promo.title}
                                width={600}
                                height={400}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-8">
                                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">{promo.title}</h3>
                                <p className="text-white text-sm sm:text-base md:text-lg mb-4 md:mb-6 opacity-90">{promo.description}</p>
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <Button asChild variant="outline" className="bg-white text-blue-700 hover:bg-gray-100 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-full shadow-md w-full sm:w-auto">
                                        <Link href={promo.redirectPath}>
                                            {promo.cta}
                                        </Link>
                                    </Button>
                                    <span className="text-white text-xs sm:text-sm opacity-80">Offer ends: {promo.endDate}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default SeasonalPromotions;