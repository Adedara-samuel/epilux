/* eslint-disable @next/next/no-img-element */
// components/components/RegistrationModal.tsx
"use client";
import React, { useState } from 'react';
import { X, User, Mail, Lock, Key, DollarSign, Users, Zap, CheckCircle } from 'lucide-react';

interface RegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Key benefits extracted and strictly taken from the EPILUX WEBSITE FEATURES JUNE 2025.docx
const programHighlights = [
    {
        icon: DollarSign,
        title: "Fixed Commission per Bag",
        description: "Earn a fixed commission for every bag of Epilux water sold, redeemed monthly as cash or product.",
    },
    {
        icon: Users,
        title: "Extended Referral Bonus (₦15)",
        description: "Recruit other marketers and earn a bonus on their sales for their first 3 months. Build a passive stream.",
    },
    {
        icon: Zap,
        title: "Free Marketing Tools",
        description: "Get pre-designed flyers, captions, and video templates for WhatsApp, Facebook, and Instagram to boost conversions.",
    },
    {
        icon: CheckCircle,
        title: "Full Training & Onboarding",
        description: "Access visual guides, training videos, and a comprehensive FAQ on how commissions and programs work.",
    },
];

export default function RegistrationModal({ isOpen, onClose }: RegistrationModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        referralCode: '',
        password: '',
        confirmPassword: '',
    });

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        
        console.log("Registration Data:", formData);
        // **TODO: Implement registration API call here**
        onClose(); // Close modal after submission attempt
    };

    return (
        // 1. BLURRED BACKGROUND
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md transition-opacity duration-300"
            onClick={onClose} 
        >
            <div 
                // 2. MODERN SPLIT DESIGN CONTAINER
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl m-4 flex overflow-hidden transform transition-all duration-300 scale-100"
                onClick={(e) => e.stopPropagation()} 
            >
                {/* Left Side: Program Highlights (Value Proposition) */}
                <div className="hidden md:block w-1/2 bg-blue-600 p-10 text-white relative">
                    <h3 className="text-3xl font-extrabold mb-4 border-b border-blue-400 pb-3">
                        Join the Epilux Partner Program
                    </h3>
                    <p className="text-blue-100 mb-8 text-lg">
                        Start your journey to predictable income by partnering with a premium water brand.
                    </p>
                    <ul className="space-y-6">
                        {programHighlights.map((item, index) => (
                            <li key={index} className="flex items-start gap-4">
                                <item.icon className="h-6 w-6 text-yellow-300 flex-shrink-0 mt-1" />
                                <div>
                                    <p className="font-semibold text-lg">{item.title}</p>
                                    <p className="text-blue-200 text-sm">{item.description}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <img 
                        src="/images/logo.png"
                        alt="Epilux Water"
                        className="absolute bottom-0 -right-20 opacity-20 h-40 w-auto"
                    />
                </div>

                {/* Right Side: Registration Form */}
                <div className="w-full md:w-1/2 p-8 sm:p-10 relative">
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors rounded-full p-1"
                    >
                        <X className="h-6 w-6" />
                    </button>
                    
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Your Account</h2>
                    <p className="text-gray-500 mb-6">It only takes a minute to get started.</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-colors"
                            />
                        </div>

                        {/* Email */}
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-colors"
                            />
                        </div>

                        {/* Referral Code (Optional) */}
                        <div className="relative">
                            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                name="referralCode"
                                placeholder="Referral Code (Optional)"
                                value={formData.referralCode}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-colors"
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-colors"
                            />
                        </div>

                        {/* Confirm Password */}
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                minLength={6}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-colors"
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl mt-6"
                        >
                            Complete Registration
                        </button>
                    </form>
                    <p className="text-center text-sm text-gray-500 mt-4">
                        Already a partner? <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">Sign in here</a>
                    </p>
                </div>
            </div>
        </div>
    );
}