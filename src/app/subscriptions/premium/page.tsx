'use client';

import { Button } from '@/Components/ui/button';
import { Card } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Check, Calendar, Shield, Users, Crown, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function PremiumPlanPage() {
    const planDetails = {
        name: "Premium Plan",
        tagline: "Best for large offices, events & big families",
        price: "₦66,000",
        period: "per month",
        bagsPerMonth: 200,
        discount: "15%",
        features: [
            "200 bags per month",
            "15% discount included",
            "Custom delivery schedule",
            "Dedicated account manager",
            "Priority support 24/7",
            "Free premium delivery",
            "Quality assurance guarantee",
            "Flexible payment terms"
        ],
        benefits: [
            {
                icon: Crown,
                title: "VIP Treatment",
                description: "Dedicated account manager and 24/7 priority support"
            },
            {
                icon: Calendar,
                title: "Custom Scheduling",
                description: "Flexible delivery times tailored to your needs"
            },
            {
                icon: Shield,
                title: "Premium Quality",
                description: "Highest quality standards with rigorous testing"
            },
            {
                icon: Users,
                title: "Enterprise Ready",
                description: "Perfect for large offices, events, and big families"
            }
        ],
        process: [
            {
                step: 1,
                title: "Personal Consultation",
                description: "Speak with our account manager to customize your plan"
            },
            {
                step: 2,
                title: "Custom Setup",
                description: "Tailored delivery schedule and payment arrangements"
            },
            {
                step: 3,
                title: "VIP Service",
                description: "Enjoy premium service with dedicated support"
            }
        ]
    };

    return (
        <div className="app-content min-h-screen bg-gradient-to-br from-purple-50 to-white">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-800 opacity-10"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <Badge className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 text-sm font-semibold">
                                    <Crown className="h-4 w-4 mr-1" />
                                    PREMIUM EXPERIENCE
                                </Badge>
                                <h1 className="text-5xl lg:text-6xl font-bold text-purple-900 leading-tight">
                                    {planDetails.name}
                                </h1>
                                <p className="text-xl text-gray-600 leading-relaxed">
                                    {planDetails.tagline}
                                </p>
                                <p className="text-lg text-gray-700">
                                    Experience the ultimate in water delivery service. Custom scheduling, dedicated support, and maximum savings for high-volume users.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                <div className="space-y-2">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-bold text-purple-600">
                                            {planDetails.price}
                                        </span>
                                        <span className="text-lg text-gray-600">
                                            {planDetails.period}
                                        </span>
                                    </div>
                                    <p className="text-purple-600 font-semibold">
                                        {planDetails.bagsPerMonth} bags + {planDetails.discount} discount + VIP service
                                    </p>
                                </div>
                                <Badge variant="outline" className="border-purple-500 text-purple-700 px-3 py-1">
                                    Save ₦9,900/month
                                </Badge>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                                    <Link href="/register?plan=premium">
                                        Start Premium Subscription
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="lg" className="border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-4 text-lg rounded-full">
                                    <Link href="/subscriptions">
                                        Compare All Plans
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="z-50 absolute -top-4 -left-4 bg-purple-500 text-white px-4 py-2 rounded-full font-bold text-sm animate-pulse">
                                SAVE 15%
                            </div>
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                <Image
                                    src="/images/Hydration.jpeg"
                                    alt="Premium Plan Water Dispenser"
                                    width={600}
                                    height={400}
                                    className="w-full h-96 object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                <div className="absolute bottom-6 left-6 text-white">
                                    <p className="text-2xl font-bold">VIP Experience</p>
                                    <p className="text-lg opacity-90">Ultimate Convenience</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-purple-900 mb-4">
                            Ultimate Premium Experience
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Enjoy the highest level of service with custom solutions and dedicated support
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        <Card className="p-8 border-2 border-purple-100 hover:border-purple-300 transition-colors duration-300">
                            <h3 className="text-2xl font-bold text-purple-900 mb-6">Premium Features</h3>
                            <ul className="space-y-4">
                                {planDetails.features.map((feature, index) => (
                                    <li key={index} className="flex items-start">
                                        <Check className="text-purple-500 mr-3 h-6 w-6 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700 text-lg">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </Card>

                        <Card className="p-8 border-2 border-blue-100 hover:border-blue-300 transition-colors duration-300">
                            <h3 className="text-2xl font-bold text-blue-900 mb-6">Why Choose Premium Plan?</h3>
                            <div className="space-y-6">
                                {planDetails.benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-start">
                                        <div className="bg-purple-100 p-2 rounded-full mr-4">
                                            <benefit.icon className="text-purple-600 h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{benefit.title}</h4>
                                            <p className="text-gray-600 text-sm">{benefit.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* How It Works */}
                    <div className="mb-16">
                        <h3 className="text-3xl font-bold text-center text-purple-900 mb-12">Personalized VIP Process</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {planDetails.process.map((step, index) => (
                                <div key={index} className="text-center">
                                    <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl font-bold text-purple-600">{step.step}</span>
                                    </div>
                                    <h4 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h4>
                                    <p className="text-gray-600">{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pricing Card */}
                    <Card className="p-8 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 max-w-md mx-auto">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-purple-900 mb-4">{planDetails.name}</h3>
                            <div className="text-5xl font-bold text-purple-600 mb-2">{planDetails.price}</div>
                            <p className="text-gray-600 mb-4">{planDetails.period}</p>
                            <Badge className="bg-purple-500 text-white mb-4">{planDetails.discount} Discount + VIP Service</Badge>
                            <p className="text-purple-600 font-semibold mb-6">
                                {planDetails.bagsPerMonth} bags delivered monthly
                            </p>
                            <Button asChild className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 text-lg rounded-full">
                                <Link href="/register?plan=premium">
                                    Subscribe Now
                                </Link>
                            </Button>
                        </div>
                    </Card>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-purple-900 text-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold mb-6">
                        Ready for VIP Treatment?
                    </h2>
                    <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                        Experience the ultimate in water delivery service with our premium plan designed for discerning customers.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" className="bg-white text-purple-900 hover:bg-gray-100 px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                            <Link href="/register?plan=premium">
                                Start Premium Plan
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-purple-900 px-8 py-4 text-lg rounded-full">
                            <Link href="/contact-us">
                                Speak to Account Manager
                            </Link>
                        </Button>
                    </div>
                    <div className="mt-8 flex justify-center items-center gap-8 text-sm opacity-75">
                        <span className="flex items-center gap-2">
                            <Crown className="h-4 w-4" />
                            VIP Service
                        </span>
                        <span className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            24/7 Support
                        </span>
                        <span className="flex items-center gap-2">
                            <Star className="h-4 w-4" />
                            15% Savings
                        </span>
                    </div>
                </div>
            </section>
        </div>
    );
}