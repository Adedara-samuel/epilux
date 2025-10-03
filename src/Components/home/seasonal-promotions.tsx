/* eslint-disable react/no-unescaped-entities */
// components/home/SeasonalPromotions.tsx
/* eslint-disable @next/next/no-img-element */
import { productImages } from '@/constants/images';
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
            image: productImages.sachetWater[1] || "https://via.placeholder.com/600x400/FF5733/FFFFFF?text=Dry+Season+Promo",
            cta: "Shop Now",
            endDate: "2025-04-30",
            redirectPath: "/products?promo=dry-season"
        },
        {
            title: "Festival Hydration Bundle",
            description: "Buy 5 bags, get 1 free for all festive periods!",
            image: productImages.bottledWater[0] || "https://via.placeholder.com/600x400/33FF57/FFFFFF?text=Festival+Bundle",
            cta: "View Offer",
            endDate: "2025-12-31",
            redirectPath: "/products?promo=festival-bundle"
        }
    ];

    return (
        <section className="bg-white py-16">
            <div className="container mx-auto px-6">
                <div className="text-center mb-14">
                    <h2 className="text-4xl font-bold text-blue-700 mb-4 tracking-tight">Exciting Seasonal Promotions</h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Don't miss out on our special offers during high-demand periods and festive seasons!
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
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
                            <div className="absolute inset-0 z-20 flex flex-col justify-end p-8">
                                <h3 className="text-3xl font-bold text-white mb-2">{promo.title}</h3>
                                <p className="text-white text-lg mb-6 opacity-90">{promo.description}</p>
                                <div className="flex justify-between items-center">
                                    <Button asChild variant="outline" className="bg-white text-blue-700 hover:bg-gray-100 px-6 py-3 text-base rounded-full shadow-md">
                                        <Link href={`/login?redirect=${encodeURIComponent(promo.redirectPath)}`}>
                                            {promo.cta}
                                        </Link>
                                    </Button>
                                    <span className="text-white text-sm opacity-80">Offer ends: {promo.endDate}</span>
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