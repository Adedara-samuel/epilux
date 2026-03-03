'use client';

import { Button } from '@/Components/ui/button';
import { Card } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Check, Truck, Shield, Users,  Award } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function StandardPlanPage() {
    const planDetails = {
        name: "Standard Plan",
        tagline: "Ideal for medium households and small offices",
        price: "₦34,000",
        period: "per month",
        bagsPerMonth: 100,
        discount: "10%",
        features: [
            "100 bags per month",
            "10% discount included",
            "Priority support",
            "Free delivery within city limits",
            "Flexible scheduling",
            "Quality assurance guarantee"
        ],
        benefits: [
            {
                icon: Award,
                title: "Priority Support",
                description: "Get faster response times and dedicated assistance"
            },
            {
                icon: Truck,
                title: "Free City Delivery",
                description: "Complimentary delivery within Lagos city limits"
            },
            {
                icon: Shield,
                title: "Quality Guarantee",
                description: "Premium Epilux water with quality assurance"
            },
            {
                icon: Users,
                title: "Office & Family Ready",
                description: "Perfect for medium households and small offices"
            }
        ],
        process: [
            {
                step: 1,
                title: "Select Delivery Zone",
                description: "Choose from our free delivery zones within Lagos"
            },
            {
                step: 2,
                title: "Set Up Priority Account",
                description: "Get priority support and account management"
            },
            {
                step: 3,
                title: "Enjoy Premium Service",
                description: "Receive enhanced service with 10% savings"
            }
        ]
    };

    return (
        <div className="app-content min-h-screen bg-gradient-to-br from-green-50 to-white">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-800 opacity-10"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <Badge className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 text-sm font-semibold">
                                    MOST POPULAR
                                </Badge>
                                <h1 className="text-5xl lg:text-6xl font-bold text-green-900 leading-tight">
                                    {planDetails.name}
                                </h1>
                                <p className="text-xl text-gray-600 leading-relaxed">
                                    {planDetails.tagline}
                                </p>
                                <p className="text-lg text-gray-700">
                                    The perfect balance of value and convenience. Get priority service with significant savings for growing households and small businesses.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                <div className="space-y-2">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-bold text-green-600">
                                            {planDetails.price}
                                        </span>
                                        <span className="text-lg text-gray-600">
                                            {planDetails.period}
                                        </span>
                                    </div>
                                    <p className="text-green-600 font-semibold">
                                        {planDetails.bagsPerMonth} bags + {planDetails.discount} discount monthly
                                    </p>
                                </div>
                                <Badge variant="outline" className="border-green-500 text-green-700 px-3 py-1">
                                    Save ₦3,400/month
                                </Badge>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                                    <Link href="/register?plan=standard">
                                        Start Standard Subscription
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="lg" className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 text-lg rounded-full">
                                    <Link href="/subscriptions">
                                        Compare All Plans
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="z-50 absolute -top-4 -left-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold text-sm animate-pulse">
                                SAVE 10%
                            </div>
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                <Image
                                    src="/images/product1.jpeg"
                                    alt="Standard Plan Bottled Water"
                                    width={600}
                                    height={400}
                                    className="w-full h-96 object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                <div className="absolute bottom-6 left-6 text-white">
                                    <p className="text-2xl font-bold">Priority Service</p>
                                    <p className="text-lg opacity-90">Enhanced Experience</p>
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
                        <h2 className="text-4xl font-bold text-green-900 mb-4">
                            Premium Features & Benefits
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Experience enhanced service with priority support and exclusive savings
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        <Card className="p-8 border-2 border-green-100 hover:border-green-300 transition-colors duration-300">
                            <h3 className="text-2xl font-bold text-green-900 mb-6">Plan Features</h3>
                            <ul className="space-y-4">
                                {planDetails.features.map((feature, index) => (
                                    <li key={index} className="flex items-start">
                                        <Check className="text-green-500 mr-3 h-6 w-6 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700 text-lg">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </Card>

                        <Card className="p-8 border-2 border-blue-100 hover:border-blue-300 transition-colors duration-300">
                            <h3 className="text-2xl font-bold text-blue-900 mb-6">Why Choose Standard Plan?</h3>
                            <div className="space-y-6">
                                {planDetails.benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-start">
                                        <div className="bg-green-100 p-2 rounded-full mr-4">
                                            <benefit.icon className="text-green-600 h-5 w-5" />
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
                        <h3 className="text-3xl font-bold text-center text-green-900 mb-12">How Priority Service Works</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {planDetails.process.map((step, index) => (
                                <div key={index} className="text-center">
                                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl font-bold text-green-600">{step.step}</span>
                                    </div>
                                    <h4 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h4>
                                    <p className="text-gray-600">{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pricing Card */}
                    <Card className="p-8 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 max-w-md mx-auto">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-green-900 mb-4">{planDetails.name}</h3>
                            <div className="text-5xl font-bold text-green-600 mb-2">{planDetails.price}</div>
                            <p className="text-gray-600 mb-4">{planDetails.period}</p>
                            <Badge className="bg-green-500 text-white mb-4">{planDetails.discount} Discount Included</Badge>
                            <p className="text-green-600 font-semibold mb-6">
                                {planDetails.bagsPerMonth} bags delivered monthly
                            </p>
                            <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-lg rounded-full">
                                <Link href="/register?plan=standard">
                                    Subscribe Now
                                </Link>
                            </Button>
                        </div>
                    </Card>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-green-900 text-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold mb-6">
                        Ready for Priority Service?
                    </h2>
                    <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                        Join our most popular plan and experience the Epilux difference with enhanced service and savings.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" className="bg-white text-green-900 hover:bg-gray-100 px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                            <Link href="/register?plan=standard">
                                Start Standard Plan
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-green-900 px-8 py-4 text-lg rounded-full">
                            <Link href="/contact-us">
                                Need Assistance?
                            </Link>
                        </Button>
                    </div>
                    <div className="mt-8 flex justify-center items-center gap-8 text-sm opacity-75">
                        <span className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Priority Support
                        </span>
                        <span className="flex items-center gap-2">
                            <Truck className="h-4 w-4" />
                            Free Delivery
                        </span>
                        <span className="flex items-center gap-2">
                            <Award className="h-4 w-4" />
                            10% Savings
                        </span>
                    </div>
                </div>
            </section>
        </div>
    );
}