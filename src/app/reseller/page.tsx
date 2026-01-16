/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Truck, Package, Users, Building, Calculator, CheckCircle, Phone, Mail, Star, Award, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function ResellerPage() {
    const [applicationForm, setApplicationForm] = useState({
        name: '',
        email: '',
        phone: '',
        businessName: '',
        businessType: '',
        location: '',
        experience: '',
        expectedVolume: '',
        message: ''
    });

    const resellerBenefits = [
        {
            icon: Award,
            title: 'Competitive Margins',
            description: 'Earn 20-35% profit margins on every sale with our reseller pricing.'
        },
        {
            icon: Truck,
            title: 'Reliable Supply',
            description: 'Guaranteed stock availability with priority ordering and fast delivery.'
        },
        {
            icon: Users,
            title: 'Marketing Support',
            description: 'Access to marketing materials, training, and promotional campaigns.'
        },
        {
            icon: TrendingUp,
            title: 'Business Growth',
            description: 'Scale your business with our established brand and customer base.'
        }
    ];

    const pricingTiers = [
        {
            level: 'Bronze',
            minOrder: 100,
            maxOrder: 499,
            discount: '20%',
            pricePerBottle: 40,
            monthlyFee: 0,
            features: [
                '20% discount on all products',
                'Basic marketing materials',
                'Email support',
                'Monthly sales reports'
            ]
        },
        {
            level: 'Silver',
            minOrder: 500,
            maxOrder: 999,
            discount: '25%',
            pricePerBottle: 37.50,
            monthlyFee: 5000,
            features: [
                '25% discount on all products',
                'Advanced marketing materials',
                'Priority phone support',
                'Weekly sales reports',
                'Training sessions',
                'Custom branding options'
            ]
        },
        {
            level: 'Gold',
            minOrder: 1000,
            maxOrder: 'Unlimited',
            discount: '30%',
            pricePerBottle: 35,
            monthlyFee: 10000,
            features: [
                '30% discount on all products',
                'Premium marketing materials',
                'Dedicated account manager',
                'Real-time sales analytics',
                'Advanced training programs',
                'Full custom branding',
                'Exclusive promotions',
                'Bulk storage solutions'
            ]
        }
    ];

    const successStories = [
        {
            name: 'Mr. Adeolu',
            business: 'Adeolu Water Depot',
            location: 'Lagos',
            monthlyVolume: '800 bottles',
            testimonial: 'Started as a Bronze reseller 2 years ago, now Gold level. My business has grown 300% thanks to Epilux reliable supply and strong brand.',
            image: '/images/reseller1.jpg'
        },
        {
            name: 'Mrs. Ibrahim',
            business: 'Pure Water Plus',
            location: 'Abuja',
            monthlyVolume: '1200 bottles',
            testimonial: 'The marketing support and training programs are exceptional. Epilux helped me build a successful water distribution business.',
            image: '/images/reseller2.jpg'
        },
        {
            name: 'Mr. Okoro',
            business: 'Okoro Supermarket',
            location: 'Port Harcourt',
            monthlyVolume: '600 bottles',
            testimonial: 'Consistent quality and timely delivery. The profit margins allow me to offer competitive prices while maintaining healthy business margins.',
            image: '/images/reseller3.jpg'
        }
    ];

    const handleApplicationSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        alert('Thank you for your application! Our reseller team will review your application and contact you within 48 hours.');
        setApplicationForm({
            name: '',
            email: '',
            phone: '',
            businessName: '',
            businessType: '',
            location: '',
            experience: '',
            expectedVolume: '',
            message: ''
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Become an Epilux Reseller
                    </h1>
                    <p className="text-xl opacity-90 max-w-3xl mx-auto">
                        Join our network of successful water distributors. Start your profitable water business
                        with Nigeria's leading premium water brand.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                {/* Benefits Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {resellerBenefits.map((benefit, index) => (
                        <div key={index} className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <benefit.icon className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">{benefit.title}</h3>
                            <p className="text-gray-600">{benefit.description}</p>
                        </div>
                    ))}
                </div>

                {/* Pricing Tiers */}
                <div className="mb-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Reseller Pricing Tiers</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Choose the tier that best fits your business needs. Higher tiers offer better discounts and more support.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {pricingTiers.map((tier, index) => (
                            <Card key={index} className="relative hover:shadow-lg transition-shadow">
                                <CardHeader className="text-center">
                                    <CardTitle className="text-2xl font-bold text-gray-800">{tier.level} Tier</CardTitle>
                                    <div className="mt-4">
                                        <div className="text-3xl font-bold text-blue-600">₦{tier.pricePerBottle}</div>
                                        <div className="text-sm text-gray-600">per bottle</div>
                                        <Badge className="mt-2 bg-green-100 text-green-800">
                                            {tier.discount} discount
                                        </Badge>
                                    </div>
                                    <p className="text-gray-600 mt-2">
                                        {tier.minOrder}-{tier.maxOrder} bottles/month
                                    </p>
                                    {tier.monthlyFee > 0 && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            ₦{tier.monthlyFee.toLocaleString()} monthly fee
                                        </p>
                                    )}
                                </CardHeader>

                                <CardContent>
                                    <ul className="space-y-2 mb-6">
                                        {tier.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                        Apply for {tier.level}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Success Stories */}
                <div className="mb-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Success Stories</h2>
                        <p className="text-gray-600">Real resellers sharing their Epilux journey</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {successStories.map((story, index) => (
                            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                                <div className="text-center mb-4">
                                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                                        <Users className="w-8 h-8 text-gray-600" />
                                    </div>
                                    <h3 className="font-semibold text-gray-800">{story.name}</h3>
                                    <p className="text-sm text-gray-600">{story.business}</p>
                                    <p className="text-xs text-gray-500">{story.location}</p>
                                    <Badge variant="outline" className="mt-2">{story.monthlyVolume}</Badge>
                                </div>
                                <p className="text-gray-700 italic text-sm">"{story.testimonial}"</p>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Application Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Apply to Become a Reseller</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Fill out the form below and our team will review your application within 48 hours.
                            We'll contact you to discuss the next steps and get you started.
                        </p>
                    </div>

                    <form onSubmit={handleApplicationSubmit} className="max-w-2xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <Label htmlFor="name">Full Name *</Label>
                                <Input
                                    id="name"
                                    value={applicationForm.name}
                                    onChange={(e) => setApplicationForm({ ...applicationForm, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="email">Email Address *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={applicationForm.email}
                                    onChange={(e) => setApplicationForm({ ...applicationForm, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="phone">Phone Number *</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={applicationForm.phone}
                                    onChange={(e) => setApplicationForm({ ...applicationForm, phone: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="businessName">Business Name *</Label>
                                <Input
                                    id="businessName"
                                    value={applicationForm.businessName}
                                    onChange={(e) => setApplicationForm({ ...applicationForm, businessName: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="businessType">Business Type *</Label>
                                <select
                                    id="businessType"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    value={applicationForm.businessType}
                                    onChange={(e) => setApplicationForm({ ...applicationForm, businessType: e.target.value })}
                                    required
                                >
                                    <option value="">Select business type</option>
                                    <option value="retail">Retail Store</option>
                                    <option value="supermarket">Supermarket</option>
                                    <option value="water-depot">Water Depot</option>
                                    <option value="distribution">Distribution Company</option>
                                    <option value="online">Online Business</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="location">Location *</Label>
                                <Input
                                    id="location"
                                    placeholder="City, State"
                                    value={applicationForm.location}
                                    onChange={(e) => setApplicationForm({ ...applicationForm, location: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="experience">Years of Experience</Label>
                                <select
                                    id="experience"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    value={applicationForm.experience}
                                    onChange={(e) => setApplicationForm({ ...applicationForm, experience: e.target.value })}
                                >
                                    <option value="">Select experience</option>
                                    <option value="0-1">0-1 years</option>
                                    <option value="1-3">1-3 years</option>
                                    <option value="3-5">3-5 years</option>
                                    <option value="5+">5+ years</option>
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="expectedVolume">Expected Monthly Volume</Label>
                                <Input
                                    id="expectedVolume"
                                    placeholder="e.g., 500 bottles"
                                    value={applicationForm.expectedVolume}
                                    onChange={(e) => setApplicationForm({ ...applicationForm, expectedVolume: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <Label htmlFor="message">Additional Information</Label>
                            <Textarea
                                id="message"
                                placeholder="Tell us about your business, target market, distribution plans, etc."
                                value={applicationForm.message}
                                onChange={(e) => setApplicationForm({ ...applicationForm, message: e.target.value })}
                                rows={4}
                            />
                        </div>

                        <div className="text-center">
                            <Button type="submit" size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                                Submit Application
                            </Button>
                            <p className="text-sm text-gray-600 mt-4">
                                By submitting this application, you agree to our reseller terms and conditions.
                            </p>
                        </div>
                    </form>
                </div>

                {/* Requirements */}
                <div className="mt-16 bg-blue-50 rounded-2xl p-8">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Reseller Requirements</h3>
                        <p className="text-gray-600">To ensure successful partnership, we look for:</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Package className="w-6 h-6 text-blue-600" />
                            </div>
                            <h4 className="font-semibold text-gray-800 mb-2">Minimum Order</h4>
                            <p className="text-sm text-gray-600">100 bottles per month minimum</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Building className="w-6 h-6 text-blue-600" />
                            </div>
                            <h4 className="font-semibold text-gray-800 mb-2">Business Registration</h4>
                            <p className="text-sm text-gray-600">Valid business registration or permit</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Truck className="w-6 h-6 text-blue-600" />
                            </div>
                            <h4 className="font-semibold text-gray-800 mb-2">Storage & Delivery</h4>
                            <p className="text-sm text-gray-600">Proper storage facilities and delivery capability</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                            <h4 className="font-semibold text-gray-800 mb-2">Customer Service</h4>
                            <p className="text-sm text-gray-600">Commitment to excellent customer service</p>
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="mt-16 text-center">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Questions About Becoming a Reseller?</h3>
                    <p className="text-gray-600 mb-8">Our reseller team is here to help you get started.</p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild variant="outline" size="lg" className="flex items-center gap-2">
                            <Link href="tel:+2341234567890">
                                <Phone className="w-5 h-5" />
                                Call +234 123 456 7890
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="flex items-center gap-2">
                            <Link href="mailto:reseller@epiluxwater.com">
                                <Mail className="w-5 h-5" />
                                Email reseller@epiluxwater.com
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}