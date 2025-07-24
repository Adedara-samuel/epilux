/* eslint-disable react/no-unescaped-entities */
// app/account/help/page.tsx
'use client';

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
        <div className="container mx-auto px-4 py-12 bg-gray-50 min-h-screen">
            <h1 className="text-4xl font-extrabold text-blue-800 mb-8 text-center">Help Center & FAQs</h1>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto text-center mb-10">
                Find quick answers to your most common questions about Epilux Water products, orders, and services.
            </p>

            <div className="max-w-4xl mx-auto space-y-6">
                {faqs.map((faq, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-100">
                        <button
                            className="w-full flex justify-between items-center p-6 text-left font-semibold text-lg text-gray-800 hover:bg-blue-50 transition-colors duration-200"
                            onClick={() => toggleFAQ(index)}
                            aria-expanded={openIndex === index}
                            aria-controls={`faq-answer-${index}`}
                        >
                            {faq.question}
                            {openIndex === index ? (
                                <ChevronUp className="h-6 w-6 text-blue-600" />
                            ) : (
                                <ChevronDown className="h-6 w-6 text-gray-500" />
                            )}
                        </button>
                        <div
                            id={`faq-answer-${index}`}
                            className={`px-6 pb-6 text-gray-600 transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-screen opacity-100 pt-2' : 'max-h-0 opacity-0 overflow-hidden'
                                }`}
                        >
                            <p>{faq.answer}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-16 text-center p-8 bg-blue-700 text-white rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
                <p className="text-lg mb-6 opacity-90">
                    If you can't find the answer you're looking for, feel free to reach out to our support team.
                </p>
                <a href="/account/contact" className="inline-block bg-white text-blue-700 hover:bg-gray-100 px-8 py-3 rounded-full text-lg font-semibold shadow-md transition-all duration-300 transform hover:scale-105">
                    Contact Support
                </a>
            </div>
        </div>
    );
}
