// components/home/Testimonials.tsx
/* eslint-disable react/no-unescaped-entities */
import { Card } from "../ui/card";
import React from 'react';

interface Testimonial {
    name: string;
    role: string;
    content: string;
    rating: number;
}

const Testimonials: React.FC = () => {
    const testimonials: Testimonial[] = [
        {
            name: "Adeola Johnson",
            role: "Restaurant Owner",
            content: "Epilux Water has been a game-changer for my business. The subscription service ensures I never run out of water for my customers. Highly recommended!",
            rating: 5
        },
        {
            name: "Michael Brown",
            role: "Office Manager",
            content: "Our staff absolutely loves the consistent quality of Epilux water. Their bulk ordering system is incredibly efficient and keeps our office well-hydrated.",
            rating: 4
        },
        {
            name: "Sarah Williams",
            role: "Home User & Affiliate",
            content: "As an affiliate, I've not only secured premium water for my family but also generated significant extra income by referring others. It's a win-win!",
            rating: 5
        }
    ];

    return (
        <section className="py-16 bg-blue-700 text-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-14">
                    <h2 className="text-4xl font-bold mb-4 tracking-tight">What Our Valued Customers Say</h2>
                    <p className="text-lg opacity-90 max-w-3xl mx-auto leading-relaxed">
                        Hear directly from the households and businesses who trust Epilux Water for their daily hydration needs.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {testimonials.map((testimonial, index) => (
                        <Card key={index} className="p-8 bg-white rounded-xl shadow-lg text-gray-800 flex flex-col justify-between">
                            <div>
                                <div className="flex mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className={`w-6 h-6 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="text-lg mb-6 italic leading-relaxed">"{testimonial.content}"</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-blue-600 text-xl">{testimonial.name}</h4>
                                <p className="text-sm text-gray-500">{testimonial.role}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Testimonials;