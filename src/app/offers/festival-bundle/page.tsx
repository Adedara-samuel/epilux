/* eslint-disable react/no-unescaped-entities */
'use client';

import { Button } from '@/Components/ui/button';
import { Card } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Check, Truck, Shield, Clock, Gift, Sparkles, Zap, Heart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function FestivalBundlePage() {
    const bundleDetails = {
        title: "Festival Hydration Bundle",
        subtitle: "Buy 5 Bags, Get 1 FREE!",
        description: "Perfect for festive celebrations, family gatherings, and holiday parties. Ensure your guests stay hydrated with premium Epilux water.",
        originalPrice: "₦17,500",
        bundlePrice: "₦14,000",
        savings: "₦3,500",
        bagsIncluded: 6,
        bagPrice: "₦2,333",
        features: [
            "6 bags of premium Epilux sachet water (5+1 FREE)",
            "Perfect for events and celebrations",
            "Free delivery within Lagos",
            "Valid for all festive periods",
            "Premium quality guaranteed",
            "Fresh and hygienic packaging"
        ],
        benefits: [
            {
                icon: Truck,
                title: "Free Delivery",
                description: "Complimentary delivery within Lagos metropolis",
                color: "bg-blue-100 text-blue-600"
            },
            {
                icon: Shield,
                title: "Quality Assured",
                description: "Certified clean and safe drinking water",
                color: "bg-green-100 text-green-600"
            },
            {
                icon: Clock,
                title: "Quick Processing",
                description: "Fast order processing and delivery",
                color: "bg-orange-100 text-orange-600"
            },
            {
                icon: Gift,
                title: "Festival Special",
                description: "Exclusive offer for festive seasons",
                color: "bg-purple-100 text-purple-600"
            }
        ]
    };

    return (
        <div className="app-content min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-blue-50">
            {/* Floating Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-bounce"></div>
                <div className="absolute top-40 right-20 w-16 h-16 bg-blue-300 rounded-full opacity-30 animate-pulse"></div>
                <div className="absolute bottom-40 left-20 w-24 h-24 bg-blue-400 rounded-full opacity-20 animate-bounce"></div>
                <div className="absolute bottom-20 right-10 w-18 h-18 bg-blue-500 rounded-full opacity-25 animate-pulse"></div>
            </div>

            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 opacity-90"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-500 opacity-20"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-10">
                            {/* Badges */}
                            <div className="flex flex-wrap gap-3">
                                <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 px-4 py-2 text-sm font-semibold hover:bg-white/30 transition-all">
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    LIMITED TIME OFFER
                                </Badge>
                                <Badge className="bg-blue-400 text-blue-900 px-4 py-2 text-sm font-bold animate-pulse">
                                    🔥 HOT DEAL
                                </Badge>
                            </div>

                            <div className="space-y-6">
                                <h1 className="text-6xl lg:text-7xl font-black text-white leading-none tracking-tight">
                                    Festival
                                    <span className="block text-blue-300">Hydration</span>
                                    <span className="block text-4xl lg:text-5xl font-bold text-white/90">Bundle</span>
                                </h1>

                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                    <p className="text-2xl font-bold text-blue-300 mb-2">
                                        {bundleDetails.subtitle}
                                    </p>
                                    <p className="text-white/90 text-lg leading-relaxed">
                                        {bundleDetails.description}
                                    </p>
                                </div>
                            </div>

                            {/* Pricing Section */}
                            <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-blue-400">
                                <div className="text-center space-y-4">
                                    <div className="flex items-center justify-center gap-4">
                                        <span className="text-4xl font-bold text-gray-500 line-through">
                                            {bundleDetails.originalPrice}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-5xl font-black text-green-600">
                                                {bundleDetails.bundlePrice}
                                            </span>
                                            <Badge className="bg-red-500 text-white text-lg px-3 py-1 animate-bounce">
                                                SAVE {bundleDetails.savings}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                                        <span className="flex items-center gap-2">
                                            <Gift className="w-4 h-4 text-green-500" />
                                            {bundleDetails.bagsIncluded} bags included
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-blue-500" />
                                            {bundleDetails.bagPrice} per bag
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button asChild size="lg" className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold px-10 py-6 text-xl rounded-full shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 border-4 border-white">
                                    <Link href="/login?redirect=/checkout?promo=festival-bundle">
                                        🎉 Order Now - Save {bundleDetails.savings}
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-10 py-6 text-xl rounded-full backdrop-blur-sm bg-white/10 font-semibold">
                                    <Link href="/products">
                                        View All Products
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {/* Hero Image */}
                        <div className="relative">
                            <div className="absolute -top-8 -left-8 bg-blue-400 text-blue-900 px-6 py-3 rounded-2xl font-black text-xl animate-bounce shadow-lg">
                                FREE BAG!
                            </div>
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                                <Image
                                    src="/images/hero-image.jpeg"
                                    alt="Festival Hydration Bundle"
                                    width={700}
                                    height={500}
                                    className="w-full h-[500px] object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                                {/* Floating Price Badge */}
                                <div className="absolute bottom-6 right-6 bg-white rounded-2xl p-4 shadow-xl">
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600">Bundle Price</p>
                                        <p className="text-2xl font-black text-green-600">{bundleDetails.bundlePrice}</p>
                                        <p className="text-xs text-gray-500">Worth {bundleDetails.originalPrice}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-400 rounded-full opacity-80 animate-pulse"></div>
                            <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-500 rounded-full opacity-60 animate-bounce"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-white relative">
                <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-blue-50 to-white"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-5xl font-black text-gray-900 mb-6">
                            What's Inside Your
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-600">
                                Festival Bundle
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Everything you need for unforgettable celebrations and perfect hydration
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                        {/* Bundle Details */}
                        <Card className="p-10 border-4 border-blue-200 hover:border-blue-400 transition-all duration-300 shadow-xl hover:shadow-blue-200/50 bg-gradient-to-br from-blue-50 to-white">
                            <div className="text-center mb-8">
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Gift className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900 mb-2">Bundle Contents</h3>
                                <p className="text-gray-600">Premium quality for your special occasions</p>
                            </div>

                            <ul className="space-y-5">
                                {bundleDetails.features.map((feature, index) => (
                                    <li key={index} className="flex items-start group">
                                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-green-200 transition-colors">
                                            <Check className="w-5 h-5 text-green-600" />
                                        </div>
                                        <span className="text-gray-700 text-lg leading-relaxed group-hover:text-gray-900 transition-colors">
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </Card>

                        {/* Benefits Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {bundleDetails.benefits.map((benefit, index) => {
                                const Icon = benefit.icon;
                                return (
                                    <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 border-2 border-gray-100 hover:border-gray-200 group">
                                        <div className="text-center space-y-4">
                                            <div className={`w-16 h-16 ${benefit.color} rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300`}>
                                                <Icon className="w-8 h-8" />
                                            </div>
                                            <h4 className="font-bold text-gray-900 text-lg">{benefit.title}</h4>
                                            <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>

                    {/* Enhanced Pricing Breakdown */}
                    <Card className="p-12 bg-gradient-to-r from-blue-50 via-blue-50 to-blue-50 border-4 border-blue-300 shadow-2xl max-w-4xl mx-auto">
                        <div className="text-center mb-10">
                            <h3 className="text-4xl font-black text-gray-900 mb-4">Festival Bundle Pricing</h3>
                            <p className="text-lg text-gray-600">See exactly what you're saving</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center p-6 bg-white/50 rounded-2xl border-2 border-red-200">
                                <div className="text-6xl mb-2">😔</div>
                                <p className="text-gray-600 font-medium mb-2">Regular Price</p>
                                <p className="text-3xl font-bold text-gray-500 line-through">{bundleDetails.originalPrice}</p>
                                <p className="text-sm text-gray-500">6 bags at regular price</p>
                            </div>
    
                            <div className="text-center p-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl border-4 border-blue-400 shadow-lg transform scale-105">
                                <div className="text-6xl mb-2">🎉</div>
                                <p className="text-gray-900 font-bold mb-2">Festival Bundle</p>
                                <p className="text-4xl font-black text-blue-600">{bundleDetails.bundlePrice}</p>
                                <p className="text-sm text-blue-700 font-semibold">Limited time offer!</p>
                            </div>
    
                            <div className="text-center p-6 bg-white/50 rounded-2xl border-2 border-blue-200">
                                <div className="text-6xl mb-2">💰</div>
                                <p className="text-gray-600 font-medium mb-2">You Save</p>
                                <p className="text-3xl font-bold text-red-600">{bundleDetails.savings}</p>
                                <p className="text-sm text-gray-500">20% discount applied</p>
                            </div>
                        </div>

                        <div className="text-center mt-8">
                            <p className="text-2xl font-bold text-gray-800">
                                That's <span className="text-green-600">{bundleDetails.bagPrice}</span> per bag instead of <span className="text-gray-500 line-through">₦2,916</span>!
                            </p>
                        </div>
                    </Card>
                </div>
            </section>

            {/* Social Proof & Urgency */}
            <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="space-y-2">
                            <div className="text-4xl font-bold text-yellow-400">500+</div>
                            <p className="text-gray-300">Happy Customers</p>
                        </div>
                        <div className="space-y-2">
                            <div className="text-4xl font-bold text-green-400">4.9★</div>
                            <p className="text-gray-300">Average Rating</p>
                        </div>
                        <div className="space-y-2">
                            <div className="text-4xl font-bold text-blue-400">24hrs</div>
                            <p className="text-gray-300">Delivery Time</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-24 bg-gradient-to-br from-blue-500 via-blue-500 to-blue-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-500 opacity-20"></div>

                <div className="container mx-auto px-6 text-center relative z-10">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-5xl lg:text-6xl font-black text-white leading-tight">
                                Don't Miss Out on
                                <span className="block text-blue-300">Festival Savings!</span>
                            </h2>
                            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                                This exclusive festival bundle won't last forever. Secure your hydration for all your celebrations today!
                            </p>
                        </div>

                        {/* Urgency Elements */}
                        <div className="flex flex-wrap justify-center gap-4 mb-8">
                            <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm">
                                <Clock className="w-4 h-4 mr-2" />
                                Limited Time Only
                            </Badge>
                            <Badge className="bg-blue-400 text-blue-900 px-4 py-2 text-sm font-bold animate-pulse">
                                🔥 While Supplies Last
                            </Badge>
                            <Badge className="bg-green-500 text-white px-4 py-2 text-sm">
                                ✓ Free Delivery
                            </Badge>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-bold px-12 py-6 text-xl rounded-full shadow-2xl hover:shadow-white/25 transform hover:scale-105 transition-all duration-300 border-4 border-blue-400">
                                <Link href="/login?redirect=/checkout?promo=festival-bundle">
                                    <Heart className="w-6 h-6 mr-3" />
                                    Claim Festival Bundle Now
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-12 py-6 text-xl rounded-full backdrop-blur-sm bg-white/10 font-semibold">
                                <Link href="/contact-us">
                                    Need Help? Contact Us
                                </Link>
                            </Button>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 max-w-md mx-auto">
                            <p className="text-white/90 text-sm">
                                <strong>Offer Details:</strong> Valid until December 31, 2025. Free delivery within Lagos. Terms and conditions apply.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-10 left-10 w-32 h-32 bg-blue-300 rounded-full opacity-20 animate-bounce"></div>
                <div className="absolute bottom-10 right-10 w-24 h-24 bg-blue-300 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full opacity-10 animate-bounce"></div>
            </section>
        </div>
    );
}