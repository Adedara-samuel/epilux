/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState } from 'react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Headphones, FileText, ChevronDown, CheckCircle, X } from 'lucide-react';

export default function ContactUsPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        inquiryType: 'general'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            const response = await fetch('https://epilux-backend.vercel.app/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result.success) {
                setSubmitStatus('success');
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    subject: '',
                    message: '',
                    inquiryType: 'general'
                });
                setTimeout(() => setSubmitStatus('idle'), 3000);
            } else {
                setSubmitStatus('error');
                setTimeout(() => setSubmitStatus('idle'), 3000);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitStatus('error');
            setTimeout(() => setSubmitStatus('idle'), 3000);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="app-content min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 md:py-20">
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

            <div className="container mx-auto px-4 py-8 md:py-16">
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
                                    <div className="animate-fade-in">
                                        <Label htmlFor="name" className="transition-colors duration-200">Full Name *</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            className="transition-all duration-300 hover:border-gray-300 focus:scale-105 focus:shadow-lg animate-fade-in"
                                        />
                                    </div>
                                    <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                                        <Label htmlFor="email" className="transition-colors duration-200">Email Address *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                            className="transition-all duration-300 hover:border-gray-300 focus:scale-105 focus:shadow-lg animate-fade-in"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                                        <Label htmlFor="phone" className="transition-colors duration-200">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="transition-all duration-300 hover:border-gray-300 focus:scale-105 focus:shadow-lg animate-fade-in"
                                        />
                                    </div>
                                    <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                                        <Label htmlFor="inquiryType" className="transition-colors duration-200">Inquiry Type</Label>
                                        <div className="relative">
                                            <select
                                                id="inquiryType"
                                                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 hover:border-gray-300 hover:scale-105 focus:scale-105 focus:shadow-lg appearance-none cursor-pointer animate-fade-in"
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
                                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none transition-transform duration-200" />
                                        </div>
                                    </div>
                                </div>

                                <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                                    <Label htmlFor="subject" className="transition-colors duration-200">Subject *</Label>
                                    <Input
                                        id="subject"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        required
                                        className="transition-all duration-300 hover:border-gray-300 focus:scale-105 focus:shadow-lg animate-fade-in"
                                    />
                                </div>

                                <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
                                    <Label htmlFor="message" className="transition-colors duration-200">Message *</Label>
                                    <Textarea
                                        id="message"
                                        rows={5}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        placeholder="Please provide details about your inquiry..."
                                        required
                                        className="transition-all duration-300 hover:border-gray-300 focus:scale-105 focus:shadow-lg animate-fade-in resize-none"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    size="lg"
                                    disabled={isSubmitting}
                                    className={`w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 active:scale-95 animate-pulse-custom ${
                                        submitStatus === 'success' ? 'bg-green-600 hover:bg-green-700' :
                                        submitStatus === 'error' ? 'bg-red-600 hover:bg-red-700' : ''
                                    }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Sending...
                                        </>
                                    ) : submitStatus === 'success' ? (
                                        <>
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Sent Successfully!
                                        </>
                                    ) : submitStatus === 'error' ? (
                                        <>
                                            <X className="w-4 h-4 mr-2" />
                                            Failed to Send
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4 mr-2" />
                                            Send Message
                                        </>
                                    )}
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

                {/* Map Section */}
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Find Us</h2>
                    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                        Visit our headquarters in Lagos for in-person consultations and product demonstrations.
                    </p>
                    <div className="rounded-lg overflow-hidden shadow-lg">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.123456789012!2d3.3792055!3d6.5243793!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8c5c5c5c5c5c%3A0x1234567890abcdef!2s123%20Water%20Street%2C%20Lagos%2C%20Nigeria!5e0!3m2!1sen!2sng!4v1234567890"
                            width="100%"
                            height="400"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Epilux Water Office Location"
                        ></iframe>
                    </div>
                    <p className="text-sm text-gray-600 mt-4">123 Water Street, Lagos, Nigeria</p>
                </div>
            </div>
        </div>
    );
}