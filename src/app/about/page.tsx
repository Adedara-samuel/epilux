/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Droplets, Users, Award, Truck, Shield, Heart, Target, Globe, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
    const [activeTab, setActiveTab] = useState('mission');

    const stats = [
        { number: '50,000+', label: 'Happy Customers', icon: Users },
        { number: '5+', label: 'Years Experience', icon: Award },
        { number: '10', label: 'Cities Served', icon: Globe },
        { number: '99.9%', label: 'Quality Rating', icon: CheckCircle }
    ];

    const values = [
        {
            icon: Shield,
            title: 'Quality First',
            description: 'We maintain the highest standards in water purification and packaging to ensure every drop meets our premium quality criteria.'
        },
        {
            icon: Heart,
            title: 'Customer Care',
            description: 'Our customers are at the heart of everything we do. We strive to provide exceptional service and build lasting relationships.'
        },
        {
            icon: Target,
            title: 'Innovation',
            description: 'We continuously invest in new technologies and processes to improve our products and services for better customer experience.'
        },
        {
            icon: Users,
            title: 'Community',
            description: 'We believe in giving back to the communities we serve through various social responsibility initiatives and partnerships.'
        }
    ];

    const milestones = [
        {
            year: '2019',
            title: 'Company Founded',
            description: 'Epilux Water was established with a vision to provide premium quality drinking water to Nigerian households and businesses.'
        },
        {
            year: '2020',
            title: 'First Production Facility',
            description: 'Opened our state-of-the-art water purification and bottling facility in Lagos, equipped with advanced filtration technology.'
        },
        {
            year: '2021',
            title: 'Affiliate Program Launch',
            description: 'Introduced our successful affiliate marketing program, creating income opportunities for thousands of Nigerians.'
        },
        {
            year: '2022',
            title: 'Nationwide Expansion',
            description: 'Extended our delivery network to cover major cities across Nigeria, making premium water accessible nationwide.'
        },
        {
            year: '2023',
            title: 'Quality Certifications',
            description: 'Achieved multiple international quality certifications and expanded our product line with new premium offerings.'
        },
        {
            year: '2024',
            title: 'Innovation & Growth',
            description: 'Launched subscription services and bulk ordering systems, further improving customer convenience and business efficiency.'
        }
    ];

    const team = [
        {
            name: 'Ezeama Ugochukwu',
            role: 'Founder & CEO',
            bio: 'Visionary leader with 15+ years in the water industry, passionate about providing clean water solutions.',
            image: '/images/team1.jpg'
        },
        {
            name: 'Nwabenu udoka',
            role: 'Operations Director',
            bio: 'Expert in supply chain management and quality control, ensuring our products meet the highest standards.',
            image: '/images/team2.jpg'
        },
        // {
        //     name: 'Emmanuel Adeyemi',
        //     role: 'Marketing Director',
        //     bio: 'Digital marketing specialist driving our affiliate program and brand awareness across Nigeria.',
        //     image: '/images/team3.jpg'
        // }
    ];

    return (
        <div className="app-content md:bg-gradient-to-br md:from-blue-50 md:via-white md:to-purple-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 md:py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        About Epilux Water
                    </h1>
                    <p className="text-xl opacity-90 max-w-3xl mx-auto">
                        Nigeria's leading provider of premium drinking water, committed to delivering
                        quality, convenience, and innovation for healthier living.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 md:py-16">
                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <stat.icon className="w-8 h-8 text-blue-600" />
                            </div>
                            <div className="text-3xl font-bold text-gray-800 mb-2">{stat.number}</div>
                            <div className="text-gray-600">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Mission & Values Tabs */}
                <div className="mb-16">
                    <div className="flex justify-center mb-8">
                        <div className="bg-white rounded-lg p-1 shadow-sm">
                            <button
                                onClick={() => setActiveTab('mission')}
                                className={`px-6 py-3 rounded-md font-medium transition-colors ${activeTab === 'mission'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                Our Mission
                            </button>
                            <button
                                onClick={() => setActiveTab('values')}
                                className={`px-6 py-3 rounded-md font-medium transition-colors ${activeTab === 'values'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                Our Values
                            </button>
                        </div>
                    </div>

                    {activeTab === 'mission' && (
                        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                            <div className="text-center max-w-4xl mx-auto">
                                <Droplets className="w-16 h-16 text-blue-600 mx-auto mb-6" />
                                <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
                                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                                    At Epilux Water, our mission is to provide every Nigerian with access to premium quality
                                    drinking water that promotes health, convenience, and sustainable living. We are committed
                                    to maintaining the highest standards of water purification while creating economic opportunities
                                    through our innovative affiliate program.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="text-center">
                                        <h3 className="font-semibold text-gray-800 mb-2">Quality Assurance</h3>
                                        <p className="text-gray-600">Rigorous testing and purification processes ensure every bottle meets international standards.</p>
                                    </div>
                                    <div className="text-center">
                                        <h3 className="font-semibold text-gray-800 mb-2">Customer Satisfaction</h3>
                                        <p className="text-gray-600">Convenient delivery and exceptional service that exceeds customer expectations.</p>
                                    </div>
                                    <div className="text-center">
                                        <h3 className="font-semibold text-gray-800 mb-2">Community Impact</h3>
                                        <p className="text-gray-600">Creating jobs and economic opportunities through our growing network of affiliates.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'values' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {values.map((value, index) => (
                                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <value.icon className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <h3 className="font-semibold text-gray-800 mb-3">{value.title}</h3>
                                        <p className="text-gray-600 text-sm">{value.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Company Timeline */}
                <div className="mb-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Journey</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            From humble beginnings to becoming Nigeria's trusted water brand, here's our story of growth and innovation.
                        </p>
                    </div>

                    <div className="relative">
                        {/* Desktop Timeline */}
                        <div className="hidden md:block">
                            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-blue-200"></div>
                            <div className="space-y-12">
                                {milestones.map((milestone, index) => (
                                    <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                                        <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                                            <div className="bg-white rounded-lg p-6 shadow-md">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <Badge className="bg-blue-100 text-blue-800">{milestone.year}</Badge>
                                                </div>
                                                <h3 className="font-semibold text-gray-800 mb-2">{milestone.title}</h3>
                                                <p className="text-gray-600 text-sm">{milestone.description}</p>
                                            </div>
                                        </div>
                                        <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-md z-10"></div>
                                        <div className="w-1/2"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Mobile Timeline */}
                        <div className="md:hidden space-y-6">
                            {milestones.map((milestone, index) => (
                                <div key={index} className="flex items-start gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-md"></div>
                                        {index < milestones.length - 1 && (
                                            <div className="w-0.5 h-16 bg-blue-200 mx-auto mt-2"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 bg-white rounded-lg p-4 shadow-md">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Badge className="bg-blue-100 text-blue-800">{milestone.year}</Badge>
                                        </div>
                                        <h3 className="font-semibold text-gray-800 mb-2">{milestone.title}</h3>
                                        <p className="text-gray-600 text-sm">{milestone.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Leadership Team */}
                <div className="mb-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Leadership Team</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Meet the dedicated professionals driving Epilux Water's mission to deliver quality and innovation.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {team.map((member, index) => (
                            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                                        <Users className="w-12 h-12 text-white" />
                                    </div>
                                    <h3 className="font-semibold text-gray-800 mb-1">{member.name}</h3>
                                    <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                                    <p className="text-gray-600 text-sm">{member.bio}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white text-center">
                    <h2 className="text-3xl font-bold mb-4">Join the Epilux Family</h2>
                    <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                        Whether you're looking for premium water delivery or an opportunity to earn through our affiliate program,
                        we're here to serve you with excellence.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                            <Link href="/products">Shop Our Products</Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                            <Link href="/affiliate">Become an Affiliate</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}