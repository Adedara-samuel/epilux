// components/home/AffiliateProgram.tsx
/* eslint-disable @next/next/no-img-element */
import { productImages } from '@/constants/images'; // Assuming this exists
import Link from 'next/link';
import React from 'react';
import { Button } from '../ui/button';

const AffiliateProgram: React.FC = () => {
    return (
        <section className="bg-blue-700 text-white py-12 md:py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12">
                    <div className="lg:w-1/2 w-full">
                        <img
                            src={productImages.affiliate || "https://via.placeholder.com/600x400/800000/FFFFFF?text=Affiliate+Program"}
                            alt="Affiliate program"
                            width={600}
                            height={400}
                            className="rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-300 w-full h-auto"
                        />
                    </div>
                    <div className="lg:w-1/2 w-full">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-5 leading-tight">Join Our Lucrative Affiliate Program</h2>
                        <p className="text-base sm:text-lg mb-6 md:mb-8 opacity-90">
                            Become a partner and earn attractive commissions by promoting Epilux Water products. Our program empowers you with:
                        </p>
                        <ul className="space-y-3 md:space-y-4 mb-8 md:mb-10 text-sm sm:text-base md:text-lg">
                            <li className="flex items-center">
                                <span className="text-green-300 mr-2 md:mr-3 text-xl md:text-2xl">✓</span>
                                <span>Generous ₦50 commission per bag sold</span>
                            </li>
                            <li className="flex items-center">
                                <span className="text-green-300 mr-2 md:mr-3 text-xl md:text-2xl">✓</span>
                                <span>Exciting referral bonuses for new affiliates</span>
                            </li>
                            <li className="flex items-center">
                                <span className="text-green-300 mr-2 md:mr-3 text-xl md:text-2xl">✓</span>
                                <span>Exclusive monthly performance rewards</span>
                            </li>
                            <li className="flex items-center">
                                <span className="text-green-300 mr-2 md:mr-3 text-xl md:text-2xl">✓</span>
                                <span>Flexible and timely payout options</span>
                            </li>
                        </ul>
                        <Button asChild className="bg-white text-blue-700 hover:bg-gray-100 px-6 sm:px-8 py-3 text-base sm:text-lg rounded-full shadow-lg transition-transform transform hover:scale-105 w-full sm:w-auto">
                            <Link href="/affiliate-reg">Learn More & Register</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AffiliateProgram;