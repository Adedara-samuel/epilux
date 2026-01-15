/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, HelpCircle, MessageSquare, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import Link from 'next/link';

interface FAQItem {
    question: string;
    answer: string;
}

const faqs: FAQItem[] = [
    {
        question: "How do I place an order?",
        answer: "You can place an order by browsing our products, adding them to your cart, and proceeding to checkout. If you're not logged in, you'll be prompted to do so before completing your purchase."
    },
    {
        question: "What are your delivery areas?",
        answer: "We currently deliver across major cities in Nigeria, including Lagos, Abuja, and Port Harcourt. Please enter your address at checkout to confirm if we deliver to your specific location."
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept online payments via Paystack (debit/credit cards, bank transfers) and Cash on Delivery (COD) for your convenience."
    },
    {
        question: "How does the subscription service work?",
        answer: "Our subscription service allows you to set up recurring deliveries of your preferred water products. You choose a plan, set your delivery schedule, and enjoy automated, hassle-free hydration. You can manage, pause, or cancel your subscription anytime from your account."
    },
    {
        question: "How can I track my order?",
        answer: "Once your order is placed, you can track its status in the 'My Orders' section of your account. We'll also send you updates via email or SMS."
    },
    {
        question: "What is the Epilux Affiliate Program?",
        answer: "Our Affiliate Program allows individuals and businesses to earn commissions by promoting Epilux Water products. You get a unique referral link and earn for every successful sale or new affiliate you refer. Visit the 'Become an Affiliate' page for more details."
    },
    {
        question: "Can I return a product?",
        answer: "We strive for 100% customer satisfaction. If you encounter any issues with your order, please contact our customer support within 24 hours of delivery, and we'll be happy to assist you."
    }
];

export default function HelpCenterPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="app-content min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <HelpCircle className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                        Help Center & FAQs
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Find quick answers to your most common questions about Epilux Water products, orders, and services.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-12">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                            type="text"
                            placeholder="Search FAQs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 pr-4 py-4 text-lg rounded-2xl border-2 border-gray-200 focus:border-blue-500 shadow-lg"
                        />
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="max-w-4xl mx-auto mb-16">
                    <div className="space-y-6">
                        {filteredFaqs.length > 0 ? (
                            filteredFaqs.map((faq, index) => (
                                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300">
                                    <button
                                        className="w-full flex justify-between items-center p-8 text-left font-semibold text-gray-900 hover:bg-blue-50/50 transition-colors"
                                        onClick={() => toggleFAQ(index)}
                                        aria-expanded={openIndex === index}
                                        aria-controls={`faq-answer-${index}`}
                                    >
                                        <span className="text-xl pr-4">{faq.question}</span>
                                        {openIndex === index ? (
                                            <ChevronUp className="h-6 w-6 text-blue-600 flex-shrink-0" />
                                        ) : (
                                            <ChevronDown className="h-6 w-6 text-blue-600 flex-shrink-0" />
                                        )}
                                    </button>
                                    <div
                                        id={`faq-answer-${index}`}
                                        className={`px-8 pb-8 text-gray-700 transition-all duration-500 ease-in-out ${openIndex === index ? 'max-h-screen opacity-100 pt-4' : 'max-h-0 opacity-0 overflow-hidden'
                                            }`}
                                    >
                                        <p className="leading-relaxed text-lg">{faq.answer}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-16">
                                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <Search className="w-10 h-10 text-gray-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-3">No results found</h3>
                                <p className="text-gray-600">Try adjusting your search terms or browse all FAQs below.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Contact Options */}
                <div className="max-w-6xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Other Ways to Get Help</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 text-center hover:shadow-2xl transition-all duration-300">
                            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <MessageSquare className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Live Chat</h3>
                            <p className="text-gray-600 mb-6">Chat with our support team in real-time</p>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3">
                                Start Chat
                            </Button>
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 text-center hover:shadow-2xl transition-all duration-300">
                            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Phone className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Phone Support</h3>
                            <p className="text-gray-600 mb-6">Call us at +234 123 456 7890</p>
                            <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50 rounded-xl py-3">
                                Call Now
                            </Button>
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 text-center hover:shadow-2xl transition-all duration-300">
                            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Mail className="w-8 h-8 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Email Support</h3>
                            <p className="text-gray-600 mb-6">Send us an email for detailed assistance</p>
                            <Link href="/account/contact">
                                <Button variant="outline" className="w-full border-purple-600 text-purple-600 hover:bg-purple-50 rounded-xl py-3">
                                    Send Email
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Contact Support Section */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-12 text-center text-white">
                        <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-8">
                            <span className="text-4xl">💬</span>
                        </div>
                        <h2 className="text-3xl font-bold mb-6">Still Need Help?</h2>
                        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                            If you can't find the answer you're looking for, feel free to reach out to our support team.
                        </p>
                        <Link href="/account/contact">
                            <Button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg">
                                Contact Support
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}