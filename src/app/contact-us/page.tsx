/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState } from 'react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Headphones, FileText } from 'lucide-react';

export default function ContactUsPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        inquiryType: 'general'
    });

    const contactMethods = [
        {
            icon: Phone,
            title: 'Phone Support',
            description: 'Speak directly with our customer service team',
            contact: '+234 800 000 0000',
            availability: 'Mon-Fri: 8AM-6PM WAT'
        },
        {
            icon: Mail,
            title: 'Email Support',
            description: 'Send us a detailed message and we\'ll respond within 24 hours',
            contact: 'epiluxcompany@gmail.com',
            availability: '24/7 email support'
        },
        {
            icon: MessageCircle,
            title: 'Live Chat',
            description: 'Get instant help through our live chat system',
            contact: 'Available on website',
            availability: 'Mon-Sun: 9AM-9PM WAT'
        },
        {
            icon: MapPin,
            title: 'Visit Our Office',
            description: 'Meet us in person at our Lagos headquarters',
            contact: '123 Water Street, Lagos, Nigeria',
            availability: 'Mon-Fri: 9AM-5PM WAT'
        }
    ];

    const faqs = [
        {
            question: 'How quickly do you deliver orders?',
            answer: 'We deliver within Lagos within 24 hours of order confirmation. Delivery times for other locations may vary from 2-5 business days depending on distance.'
        },
        {
            question: 'What payment methods do you accept?',
            answer: 'We accept bank transfers, card payments, mobile money (Flutterwave), and cash on delivery for verified customers.'
        },
        {
            question: 'Can I modify or cancel my subscription?',
            answer: 'Yes, you can modify delivery schedules or pause/cancel subscriptions anytime through your account dashboard or by contacting our support team.'
        },
        {
            question: 'Do you offer bulk discounts?',
            answer: 'Yes, we offer volume discounts starting from 50 bottles. Contact our bulk sales team for customized pricing based on your requirements.'
        },
        {
            question: 'How do I become an affiliate?',
            answer: 'Visit our affiliate registration page or contact us directly. We provide training, marketing materials, and ongoing support for our affiliates.'
        }
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        alert('Thank you for your message! We\'ll get back to you within 24 hours.');
        setFormData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: '',
            inquiryType: 'general'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Contact Us
                    </h1>
                    <p className="text-xl opacity-90 max-w-3xl mx-auto">
                        We're here to help! Reach out to us through any of our channels
                        and our dedicated team will assist you promptly.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                {/* Contact Methods */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {contactMethods.map((method, index) => (
                        <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <method.icon className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="font-semibold text-gray-800 mb-2">{method.title}</h3>
                                <p className="text-gray-600 text-sm mb-3">{method.description}</p>
                                <p className="font-medium text-blue-600 mb-1">{method.contact}</p>
                                <p className="text-xs text-gray-500">{method.availability}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    {/* Contact Form */}
                    <div>
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <div className="mb-6">
                                <h2 className="text-3xl font-bold text-gray-800 mb-4">Send us a Message</h2>
                                <p className="text-gray-600">
                                    Fill out the form below and we'll get back to you as soon as possible.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="name">Full Name *</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="email">Email Address *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="inquiryType">Inquiry Type</Label>
                                        <select
                                            id="inquiryType"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            value={formData.inquiryType}
                                            onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                                        >
                                            <option value="general">General Inquiry</option>
                                            <option value="orders">Order Support</option>
                                            <option value="subscriptions">Subscription Help</option>
                                            <option value="bulk">Bulk Orders</option>
                                            <option value="affiliate">Affiliate Program</option>
                                            <option value="technical">Technical Support</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="subject">Subject *</Label>
                                    <Input
                                        id="subject"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="message">Message *</Label>
                                    <Textarea
                                        id="message"
                                        rows={5}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        placeholder="Please provide details about your inquiry..."
                                        required
                                    />
                                </div>

                                <Button type="submit" size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                                    <Send className="w-4 h-4 mr-2" />
                                    Send Message
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div>
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <div className="mb-6">
                                <h2 className="text-3xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
                                <p className="text-gray-600">
                                    Quick answers to common questions about our services.
                                </p>
                            </div>

                            <div className="space-y-6">
                                {faqs.map((faq, index) => (
                                    <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                                        <h3 className="font-semibold text-gray-800 mb-2 flex items-start gap-2">
                                            <span className="text-blue-600 mt-1">Q:</span>
                                            {faq.question}
                                        </h3>
                                        <p className="text-gray-600 ml-6">
                                            <span className="text-blue-600 font-medium">A:</span> {faq.answer}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Business Hours & Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <Card className="text-center">
                        <CardContent className="p-6">
                            <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                            <h3 className="font-semibold text-gray-800 mb-2">Business Hours</h3>
                            <div className="text-sm text-gray-600 space-y-1">
                                <p>Monday - Friday: 8:00 AM - 6:00 PM WAT</p>
                                <p>Saturday: 9:00 AM - 4:00 PM WAT</p>
                                <p>Sunday: Closed</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="text-center">
                        <CardContent className="p-6">
                            <Headphones className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                            <h3 className="font-semibold text-gray-800 mb-2">Emergency Support</h3>
                            <p className="text-gray-600 text-sm mb-3">
                                For urgent delivery issues or water quality concerns
                            </p>
                            <p className="font-medium text-blue-600">+234 800 000 0000</p>
                        </CardContent>
                    </Card>

                    <Card className="text-center">
                        <CardContent className="p-6">
                            <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                            <h3 className="font-semibold text-gray-800 mb-2">Documentation</h3>
                            <p className="text-gray-600 text-sm mb-3">
                                Download our product catalog and terms of service
                            </p>
                            <Button variant="outline" size="sm">Download Catalog</Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Map Section (Placeholder) */}
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Find Us</h2>
                    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                        Visit our headquarters in Lagos for in-person consultations and product demonstrations.
                    </p>
                    <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                        <div className="text-center">
                            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">Interactive Map Coming Soon</p>
                            <p className="text-sm text-gray-400 mt-2">123 Water Street, Lagos, Nigeria</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}