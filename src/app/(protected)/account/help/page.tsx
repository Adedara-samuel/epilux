/* eslint-disable react/no-unescaped-entities */
// app/account/help/page.tsx
'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

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

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center & FAQs</h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Find quick answers to your most common questions about Epilux Water products, orders, and services.
                    </p>
                </div>

                {/* FAQ Section */}
                <div className="max-w-4xl mx-auto mb-16">
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <button
                                    className="w-full flex justify-between items-center p-6 text-left font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                                    onClick={() => toggleFAQ(index)}
                                    aria-expanded={openIndex === index}
                                    aria-controls={`faq-answer-${index}`}
                                >
                                    <span className="text-lg">{faq.question}</span>
                                    {openIndex === index ? (
                                        <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                                    )}
                                </button>
                                <div
                                    id={`faq-answer-${index}`}
                                    className={`px-6 pb-6 text-gray-700 transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-screen opacity-100 pt-2' : 'max-h-0 opacity-0 overflow-hidden'
                                        }`}
                                >
                                    <p className="leading-relaxed">{faq.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Support Section */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-3xl">💬</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Need Help?</h2>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            If you can't find the answer you're looking for, feel free to reach out to our support team.
                        </p>
                        <a
                            href="/account/contact"
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            Contact Support
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
