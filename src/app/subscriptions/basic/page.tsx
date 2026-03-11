/* eslint-disable react/no-unescaped-entities */
'use client';

import { Button } from '@/Components/ui/button';
import { Card } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Check, Truck, Calendar, Shield, Users } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function BasicPlanPage() {
    const planDetails = {
        name: "Basic Plan",
        tagline: "Perfect for small families and individuals",
        price: "₦17,500",
        period: "per month",
        bagsPerMonth: 50,
        features: [
            "50 bags per month",
            "Automated delivery",
            "Flexible delivery days",
            "Pause or cancel anytime",
            "Standard delivery within Lagos"
        ],
        benefits: [
            {
                icon: Truck,
                title: "Reliable Delivery",
                description: "Consistent delivery schedule you can depend on",
                color: "bg-blue-100 text-blue-600"
            },
            {
                icon: Calendar,
                title: "Flexible Scheduling",
                description: "Choose delivery days that work for your schedule",
                color: "bg-green-100 text-green-600"
            },
            {
                icon: Shield,
                title: "Quality Guarantee",
                description: "Premium Epilux water quality assured",
                color: "bg-cyan-100 text-cyan-600"
            },
            {
                icon: Users,
                title: "Family Friendly",
                description: "Perfect for small households and individuals",
                color: "bg-indigo-100 text-indigo-600"
            }
        ],
        process: [
            {
                step: 1,
                title: "Choose Your Schedule",
                description: "Select delivery frequency and preferred days"
            },
            {
                step: 2,
                title: "Set Up Payment",
                description: "Secure monthly billing with flexible payment options"
            },
            {
                step: 3,
                title: "Enjoy Fresh Water",
                description: "Receive fresh, hygienic water delivered to your door"
            }
        ]
    };

    return (
        <div className="app-content min-h-screen bg-blue-50">
            {/* Hero Section */}
            <section className="py-20 bg-blue-600 text-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <Badge className="bg-blue-500 text-white px-4 py-2 text-sm font-semibold">
                                    MOST POPULAR CHOICE
                                </Badge>
                                <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                                    {planDetails.name}
                                </h1>
                                <p className="text-xl text-blue-100 leading-relaxed">
                                    {planDetails.tagline}
                                </p>
                                <p className="text-lg text-blue-100">
                                    Never run out of fresh, clean water. Perfect for small families and individuals who value convenience and quality.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                <div className="space-y-2">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-bold text-white">
                                            {planDetails.price}
                                        </span>
                                        <span className="text-lg text-blue-200">
                                            {planDetails.period}
                                        </span>
                                    </div>
                                    <p className="text-green-300 font-semibold">
                                        {planDetails.bagsPerMonth} bags delivered monthly
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-lg shadow-lg">
                                    <Link href="/register?plan=basic">
                                        Start Basic Subscription
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg rounded-lg">
                                    <Link href="/subscriptions">
                                        Compare All Plans
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="relative rounded-lg overflow-hidden shadow-2xl">
                                <Image
                                    src="/images/product1.jpeg"
                                    alt="Basic Plan Bottled Water"
                                    width={600}
                                    height={400}
                                    className="w-full h-96 object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-blue-900 mb-4">
                            What's Included
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Everything you need for convenient, reliable water delivery
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        <Card className="p-8 border-2 border-blue-100">
                            <h3 className="text-2xl font-bold text-blue-900 mb-6">Plan Features</h3>
                            <ul className="space-y-4">
                                {planDetails.features.map((feature, index) => (
                                    <li key={index} className="flex items-start">
                                        <Check className="text-green-500 mr-3 h-6 w-6 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700 text-lg">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </Card>

                        <Card className="p-8 border-2 border-green-100">
                            <h3 className="text-2xl font-bold text-green-900 mb-6">Why Choose Basic Plan?</h3>
                            <div className="space-y-6">
                                {planDetails.benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-start">
                                        <div className="bg-blue-100 p-2 rounded-full mr-4">
                                            <benefit.icon className="text-blue-600 h-5 w-5" />
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
                        <h3 className="text-3xl font-bold text-center text-blue-900 mb-12">How It Works</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {planDetails.process.map((step, index) => (
                                <div key={index} className="text-center">
                                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl font-bold text-blue-600">{step.step}</span>
                                    </div>
                                    <h4 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h4>
                                    <p className="text-gray-600">{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pricing Card */}
                    <Card className="p-8 bg-blue-50 border-2 border-blue-200 max-w-md mx-auto">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-blue-900 mb-4">{planDetails.name}</h3>
                            <div className="text-5xl font-bold text-blue-600 mb-2">{planDetails.price}</div>
                            <p className="text-gray-600 mb-6">{planDetails.period}</p>
                            <p className="text-green-600 font-semibold mb-6">
                                {planDetails.bagsPerMonth} bags delivered monthly
                            </p>
                            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg rounded-lg">
                                <Link href="/register?plan=basic">
                                    Subscribe Now
                                </Link>
                            </Button>
                        </div>
                    </Card>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-blue-900 text-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold mb-6">
                        Ready to Never Run Out of Water?
                    </h2>
                    <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                        Join thousands of satisfied customers who trust Epilux for their daily hydration needs.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" className="bg-white text-blue-900 hover:bg-gray-100 px-8 py-4 text-lg rounded-lg shadow-lg">
                            <Link href="/register?plan=basic">
                                Start Your Subscription
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 text-lg rounded-lg">
                            <Link href="/contact-us">
                                Have Questions?
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}