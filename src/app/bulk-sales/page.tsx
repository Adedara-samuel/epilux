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
import { Truck, Package, Users, Building, Calculator, CheckCircle, Phone, Mail } from 'lucide-react';
import Link from 'next/link';

export default function BulkSalesPage() {
    const [quantity, setQuantity] = useState('');
    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: '',
        productType: '75cl',
        estimatedQuantity: ''
    });

    const bulkOptions = [
        {
            minQuantity: 50,
            maxQuantity: 199,
            discount: '5%',
            pricePerBottle: 45,
            features: [
                'Volume discount applied',
                'Free delivery within Lagos',
                'Quality assurance certificate',
                'Custom packaging available'
            ]
        },
        {
            minQuantity: 200,
            maxQuantity: 499,
            discount: '10%',
            pricePerBottle: 42,
            features: [
                'Enhanced volume discount',
                'Free delivery within Lagos',
                'Priority scheduling',
                'Quality assurance certificate',
                'Custom branding options',
                'Dedicated account manager'
            ]
        },
        {
            minQuantity: 500,
            maxQuantity: 999,
            discount: '15%',
            pricePerBottle: 38,
            features: [
                'Maximum volume discount',
                'Free delivery nationwide',
                'Express delivery options',
                'Quality assurance certificate',
                'Full custom branding',
                'Dedicated account manager',
                'Monthly billing options'
            ]
        },
        {
            minQuantity: 1000,
            maxQuantity: 'Unlimited',
            discount: '20%+',
            pricePerBottle: 35,
            features: [
                'Premium volume discount',
                'Free delivery nationwide',
                'Express & scheduled delivery',
                'Quality assurance certificate',
                'Full custom branding & packaging',
                'Dedicated account manager',
                'Monthly/quarterly billing',
                'Bulk storage solutions'
            ]
        }
    ];

    const testimonials = [
        {
            name: 'Chief Adebayo',
            company: 'Adebayo Hotels & Suites',
            quote: 'Epilux bulk water service has been reliable for our hotel operations. The quality is consistent and delivery is always on time.',
            bottles: '200 bottles/month'
        },
        {
            name: 'Mrs. Okon',
            company: 'Okon Supermarket Chain',
            quote: 'We switched to Epilux for our retail locations and our customers love the purity. The bulk pricing makes it very cost-effective.',
            bottles: '500 bottles/month'
        },
        {
            name: 'Mr. Johnson',
            company: 'Johnson Construction Ltd',
            quote: 'For our construction sites, having clean water delivered regularly is crucial. Epilux handles our large orders efficiently.',
            bottles: '150 bottles/month'
        }
    ];

    const handleContactSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        alert('Thank you for your inquiry! Our sales team will contact you within 24 hours.');
        setContactForm({
            name: '',
            email: '',
            phone: '',
            company: '',
            message: '',
            productType: '75cl',
            estimatedQuantity: ''
        });
    };

    const calculatePrice = (qty: number) => {
        if (qty >= 1000) return qty * 35;
        if (qty >= 500) return qty * 38;
        if (qty >= 200) return qty * 42;
        if (qty >= 50) return qty * 45;
        return qty * 50; // Regular price
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Bulk Water Sales
                    </h1>
                    <p className="text-xl opacity-90 max-w-3xl mx-auto">
                        Premium quality water for businesses, events, and large households.
                        Competitive pricing with reliable delivery.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                {/* Quick Calculator */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Quick Price Calculator</h2>
                        <p className="text-gray-600">Get an instant quote for your bulk water needs</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <Label htmlFor="quantity" className="text-lg font-semibold">Number of Bottles</Label>
                            <Input
                                id="quantity"
                                type="number"
                                placeholder="Enter quantity"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                className="mt-2 text-lg"
                            />
                            <p className="text-sm text-gray-600 mt-2">
                                Minimum order: 50 bottles. Price per bottle decreases with higher quantities.
                            </p>
                        </div>

                        <div className="flex flex-col justify-center">
                            {quantity && parseInt(quantity) >= 50 && (
                                <div className="bg-blue-50 rounded-lg p-6">
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600 mb-2">Estimated Total</p>
                                        <p className="text-3xl font-bold text-blue-600">
                                            ₦{calculatePrice(parseInt(quantity)).toLocaleString()}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-2">
                                            ₦{(calculatePrice(parseInt(quantity)) / parseInt(quantity)).toFixed(0)} per bottle
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bulk Pricing Tiers */}
                <div className="mb-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Bulk Pricing Tiers</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Higher quantities mean better prices. All prices are for 75cl bottles.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {bulkOptions.map((option, index) => (
                            <Card key={index} className="relative hover:shadow-lg transition-shadow">
                                <CardHeader className="text-center">
                                    <CardTitle className="text-xl font-bold text-gray-800">
                                        {option.minQuantity}-{option.maxQuantity} bottles
                                    </CardTitle>
                                    <div className="mt-4">
                                        <div className="text-3xl font-bold text-blue-600">₦{option.pricePerBottle}</div>
                                        <div className="text-sm text-gray-600">per bottle</div>
                                        <Badge className="mt-2 bg-green-100 text-green-800">
                                            {option.discount} discount
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent>
                                    <ul className="space-y-2">
                                        {option.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Testimonials */}
                <div className="mb-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Trusted by Businesses</h2>
                        <p className="text-gray-600">See what our bulk customers say about our service</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                                <div className="mb-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                        <Building className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-gray-800">{testimonial.name}</p>
                                            <p className="text-sm text-gray-600">{testimonial.company}</p>
                                        </div>
                                        <Badge variant="outline">{testimonial.bottles}</Badge>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Get Your Custom Quote</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Tell us about your needs and we'll provide a personalized quote with the best pricing and delivery options.
                        </p>
                    </div>

                    <form onSubmit={handleContactSubmit} className="max-w-2xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <Label htmlFor="name">Full Name *</Label>
                                <Input
                                    id="name"
                                    value={contactForm.name}
                                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="email">Email Address *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={contactForm.email}
                                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="phone">Phone Number *</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={contactForm.phone}
                                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="company">Company/Organization</Label>
                                <Input
                                    id="company"
                                    value={contactForm.company}
                                    onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="productType">Product Type</Label>
                                <select
                                    id="productType"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    value={contactForm.productType}
                                    onChange={(e) => setContactForm({ ...contactForm, productType: e.target.value })}
                                >
                                    <option value="75cl">75cl Bottles</option>
                                    <option value="1L">1L Bottles</option>
                                    <option value="5L">5L Dispensers</option>
                                    <option value="20L">20L Containers</option>
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="estimatedQuantity">Estimated Monthly Quantity</Label>
                                <Input
                                    id="estimatedQuantity"
                                    placeholder="e.g., 200 bottles"
                                    value={contactForm.estimatedQuantity}
                                    onChange={(e) => setContactForm({ ...contactForm, estimatedQuantity: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <Label htmlFor="message">Additional Requirements</Label>
                            <Textarea
                                id="message"
                                placeholder="Tell us about your specific needs, delivery preferences, etc."
                                value={contactForm.message}
                                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                                rows={4}
                            />
                        </div>

                        <div className="text-center">
                            <Button type="submit" size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                                Request Quote
                            </Button>
                            <p className="text-sm text-gray-600 mt-4">
                                We'll respond within 24 hours with a customized quote and delivery options.
                            </p>
                        </div>
                    </form>
                </div>

                {/* Contact Information */}
                <div className="mt-16 text-center">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Need Immediate Assistance?</h3>
                    <p className="text-gray-600 mb-8">Our bulk sales team is ready to help with your large orders.</p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild variant="outline" size="lg" className="flex items-center gap-2">
                            <Link href="tel:+2341234567890">
                                <Phone className="w-5 h-5" />
                                Call +234 123 456 7890
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="flex items-center gap-2">
                            <Link href="mailto:bulk@epiluxwater.com">
                                <Mail className="w-5 h-5" />
                                Email bulk@epiluxwater.com
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}