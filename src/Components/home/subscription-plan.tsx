/* eslint-disable react/no-unescaped-entities */
// components/home/SubscriptionPlans.tsx
import { Check } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import Link from 'next/link';
import React from 'react';

interface Plan {
    name: string;
    price: string;
    description: string;
    features: string[];
    popular?: boolean;
}

const SubscriptionPlans: React.FC = () => {
    const plans: Plan[] = [
        {
            name: "Basic Plan",
            price: "₦17,500",
            description: "Perfect for small families and individuals.",
            features: [
                "50 bags per month",
                "Automated delivery",
                "Flexible delivery days",
                "Pause or cancel anytime"
            ]
        },
        {
            name: "Standard Plan",
            price: "₦34,000",
            description: "Ideal for medium households and small offices.",
            features: [
                "100 bags per month",
                "10% discount included",
                "Priority support",
                "Free delivery within city limits"
            ],
            popular: true
        },
        {
            name: "Premium Plan",
            price: "₦66,000",
            description: "Best for large offices, events & big families.",
            features: [
                "200 bags per month",
                "15% discount included",
                "Custom delivery schedule",
                "Dedicated account manager"
            ]
        }
    ];

    return (
        <section className="bg-blue-50 py-16">
            <div className="container mx-auto px-6">
                <div className="text-center mb-14">
                    <h2 className="text-4xl font-bold text-blue-700 mb-4 tracking-tight">Flexible Water Subscription Plans</h2>
                    <p className="text-lg text-blue-600 max-w-3xl mx-auto leading-relaxed">
                        Choose a plan that fits your consumption and enjoy seamless, automated deliveries of premium Epilux Water.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {plans.map((plan, index) => (
                        <Card key={index} className={`p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${plan.popular ? 'border-4 border-blue-500 bg-blue-50' : 'bg-white'} flex flex-col justify-between`}>
                            {plan.popular && (
                                <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 text-sm font-bold rounded-bl-lg rounded-tr-xl">
                                    MOST POPULAR
                                </div>
                            )}
                            <div className="mb-6">
                                <h3 className={`text-2xl font-bold ${plan.popular ? 'text-blue-700' : 'text-blue-600'} mb-3`}>{plan.name}</h3>
                                <p className="text-gray-600 mb-5">{plan.description}</p>
                                <div className={`text-5xl font-extrabold ${plan.popular ? 'text-blue-900' : 'text-gray-900'} mb-6`}>{plan.price}</div>

                                <ul className="space-y-3 text-gray-700">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start">
                                            <Check className="text-blue-500 mr-3 h-5 w-5 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <Button asChild className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white px-6 py-3 text-lg rounded-full transition-all duration-300 shadow-md hover:shadow-lg mt-auto`}>
                                <Link href={`/subscriptions/${plan.name.toLowerCase().replace(' plan', '')}`}>Subscribe Now</Link>
                            </Button>
                        </Card>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">How Our Subscription Works</h3>
                    <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 text-gray-700">
                        <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md flex-1">
                            <div className="bg-blue-100 p-4 rounded-full mb-4">
                                <Check className="text-blue-600 h-10 w-10" />
                            </div>
                            <h4 className="font-bold text-xl text-blue-800 mb-2">1. Choose Your Plan</h4>
                            <p className="text-blue-600 leading-relaxed">Select from Basic, Standard, or Premium plans tailored to your water consumption needs.</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md flex-1">
                            <div className="bg-blue-100 p-4 rounded-full mb-4">
                                <Check className="text-blue-600 h-10 w-10" />
                            </div>
                            <h4 className="font-bold text-xl text-blue-800 mb-2">2. Set Delivery Schedule</h4>
                            <p className="text-blue-600 leading-relaxed">Enjoy flexible delivery days that seamlessly integrate with your routine. Modify or pause anytime.</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md flex-1">
                            <div className="bg-blue-100 p-4 rounded-full mb-4">
                                <Check className="text-blue-600 h-10 w-10" />
                            </div>
                            <h4 className="font-bold text-xl text-blue-800 mb-2">3. Automated Deliveries</h4>
                            <p className="text-blue-600 leading-relaxed">Receive consistent, high-quality water delivered directly to your door, absolutely hassle-free.</p>
                        </div>
                    </div>
                </div>

                <div className="mt-20 text-center bg-blue-700 text-white p-12 rounded-xl shadow-lg">
                    <h3 className="text-3xl font-bold mb-6">Convenient Payment Options</h3>
                    <p className="text-lg opacity-90 max-w-3xl mx-auto mb-8">
                        We offer a variety of secure and flexible payment methods to ensure a smooth and hassle-free transaction experience.
                    </p>
                    <div className="flex flex-col md:flex-row justify-center items-center gap-12">
                        <div className="flex flex-col items-center text-center p-4">
                            <div className="bg-green-100 p-4 rounded-full mb-4">
                                <Check className="text-green-600 h-10 w-10" />
                            </div>
                            <h4 className="font-bold text-xl mb-2">Online Payments</h4>
                            <p className="opacity-90">Securely pay with your debit/credit card or direct bank transfer through our trusted gateways.</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-4">
                            <div className="bg-yellow-100 p-4 rounded-full mb-4">
                                <Check className="text-yellow-600 h-10 w-10" />
                            </div>
                            <h4 className="font-bold text-xl mb-2">Cash on Delivery (COD)</h4>
                            <p className="opacity-90">Prefer to pay in cash? Pay conveniently when your fresh water order is delivered to your doorstep.</p>
                        </div>
                    </div>
                </div>

                <div className="mt-20">
                    <h3 className="text-3xl font-bold text-blue-700 text-center mb-10">Frequently Asked Questions</h3>
                    <div className="space-y-6 max-w-5xl mx-auto">
                        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                            <h4 className="font-bold text-xl text-blue-800 mb-3">Can I change my plan later?</h4>
                            <p className="text-blue-600 leading-relaxed">Absolutely! You can easily upgrade or downgrade your subscription plan at any time directly through your personalized account portal. We offer full flexibility to match your evolving needs.</p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                            <h4 className="font-bold text-xl text-blue-800 mb-3">How do I pause or cancel my subscription?</h4>
                            <p className="text-blue-600 leading-relaxed">Managing your subscription is straightforward. You can pause or cancel your service directly from your user dashboard with just a few clicks. Our aim is to provide you with complete control.</p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                            <h4 className="font-bold text-xl text-blue-800 mb-3">What if I need more water than my plan offers?</h4>
                            <p className="text-blue-600 leading-relaxed">No problem at all! If your consumption temporarily exceeds your plan's allocation, you can always place an ad-hoc order for additional bags. For sustained higher demand, we recommend upgrading your plan for better value and convenience.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default SubscriptionPlans;