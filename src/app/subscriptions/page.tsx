/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState } from 'react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Check, Star, Truck, Shield, Clock } from 'lucide-react';
import Link from 'next/link';

export default function SubscriptionsPage() {
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

    const plans = [
        {
            id: 'basic',
            name: 'Basic Plan',
            price: 2500,
            originalPrice: 3000,
            bottles: 12,
            frequency: 'Monthly',
            features: [
                '12 bottles of 75cl Epilux Water',
                'Free delivery within Lagos',
                'Quality guarantee',
                'Flexible scheduling',
                '24/7 customer support'
            ],
            popular: false,
            savings: '17%'
        },
        {
            id: 'premium',
            name: 'Premium Plan',
            price: 4500,
            originalPrice: 5400,
            bottles: 24,
            frequency: 'Monthly',
            features: [
                '24 bottles of 75cl Epilux Water',
                'Free delivery within Lagos',
                'Priority scheduling',
                'Quality guarantee',
                '24/7 customer support',
                'Exclusive discounts on bulk orders'
            ],
            popular: true,
            savings: '17%'
        },
        {
            id: 'family',
            name: 'Family Plan',
            price: 6500,
            originalPrice: 7800,
            bottles: 36,
            frequency: 'Monthly',
            features: [
                '36 bottles of 75cl Epilux Water',
                'Free delivery within Lagos',
                'Priority scheduling',
                'Quality guarantee',
                '24/7 customer support',
                'Exclusive discounts on bulk orders',
                'Family health tips included'
            ],
            popular: false,
            savings: '17%'
        }
    ];

    const benefits = [
        {
            icon: Truck,
            title: 'Convenient Delivery',
            description: 'Scheduled deliveries right to your doorstep at your preferred time.'
        },
        {
            icon: Shield,
            title: 'Quality Assured',
            description: 'Every bottle meets our strict quality standards for purity and taste.'
        },
        {
            icon: Clock,
            title: 'Flexible Scheduling',
            description: 'Change delivery dates, pause, or cancel anytime with no penalties.'
        },
        {
            icon: Star,
            title: 'Premium Experience',
            description: 'Enjoy the finest drinking water with our premium subscription service.'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Premium Water Subscriptions
                    </h1>
                    <p className="text-xl opacity-90 max-w-3xl mx-auto">
                        Never run out of clean, pure Epilux water. Choose from our flexible subscription plans
                        with convenient delivery schedules.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                {/* Benefits Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <benefit.icon className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">{benefit.title}</h3>
                            <p className="text-gray-600">{benefit.description}</p>
                        </div>
                    ))}
                </div>

                {/* Subscription Plans */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Choose Your Plan</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        All plans include free delivery within Lagos and our quality guarantee.
                        Cancel or modify anytime.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {plans.map((plan) => (
                        <Card
                            key={plan.id}
                            className={`relative cursor-pointer transition-all duration-300 hover:shadow-xl ${plan.popular ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-lg'
                                } ${selectedPlan === plan.id ? 'ring-2 ring-green-500' : ''}`}
                            onClick={() => setSelectedPlan(plan.id)}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                    <Badge className="bg-blue-500 text-white px-4 py-1">Most Popular</Badge>
                                </div>
                            )}

                            <CardHeader className="text-center pb-4">
                                <CardTitle className="text-2xl font-bold text-gray-800">{plan.name}</CardTitle>
                                <div className="mt-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="text-3xl font-bold text-blue-600">₦{plan.price.toLocaleString()}</span>
                                        <span className="text-lg text-gray-500 line-through">₦{plan.originalPrice.toLocaleString()}</span>
                                    </div>
                                    <Badge variant="secondary" className="mt-2 bg-green-100 text-green-800">
                                        Save {plan.savings}
                                    </Badge>
                                </div>
                                <p className="text-gray-600 mt-2">{plan.bottles} bottles {plan.frequency.toLowerCase()}</p>
                            </CardHeader>

                            <CardContent>
                                <ul className="space-y-3 mb-6">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    className={`w-full ${selectedPlan === plan.id
                                            ? 'bg-green-600 hover:bg-green-700'
                                            : plan.popular
                                                ? 'bg-blue-600 hover:bg-blue-700'
                                                : 'bg-gray-600 hover:bg-gray-700'
                                        }`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedPlan(plan.id);
                                    }}
                                >
                                    {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* CTA Section */}
                {selectedPlan && (
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-8 text-white text-center">
                        <h3 className="text-2xl font-bold mb-4">Ready to Start Your Subscription?</h3>
                        <p className="text-green-100 mb-6 max-w-2xl mx-auto">
                            Join thousands of satisfied customers who trust Epilux for their daily hydration needs.
                            Your first delivery will be scheduled within 24 hours.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                                <Link href="/register">Start Subscription</Link>
                            </Button>
                            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                                <Link href="/contact">Contact Sales</Link>
                            </Button>
                        </div>
                    </div>
                )}

                {/* FAQ Section */}
                <div className="mt-16">
                    <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Frequently Asked Questions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="font-semibold text-gray-800 mb-2">Can I change my delivery schedule?</h3>
                            <p className="text-gray-600">Yes, you can modify your delivery schedule anytime through your account dashboard or by contacting our support team.</p>
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="font-semibold text-gray-800 mb-2">What if I'm not home for delivery?</h3>
                            <p className="text-gray-600">Our delivery team will contact you to reschedule. We offer flexible delivery windows to ensure you receive your order.</p>
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="font-semibold text-gray-800 mb-2">Can I pause my subscription?</h3>
                            <p className="text-gray-600">Absolutely! You can pause your subscription for up to 3 months and resume whenever you're ready.</p>
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="font-semibold text-gray-800 mb-2">Is there a minimum commitment?</h3>
                            <p className="text-gray-600">No minimum commitment required. You can cancel anytime without penalties.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}