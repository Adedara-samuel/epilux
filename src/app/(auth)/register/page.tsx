/* eslint-disable @next/next/no-img-element */
"use client";

// Forces the page to be rendered dynamically on every request,
// preventing static prerendering which triggers SSR errors.
export const dynamic = 'force-dynamic';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { X, User, Mail, Lock, Key, Phone, Eye, EyeOff, DollarSign, Users, Zap, CheckCircle } from 'lucide-react';

const programHighlights = [
    {
        icon: DollarSign,
        title: "Fixed Commission per Bag",
        description: "Earn a fixed commission for every bag of Epilux water sold, redeemed monthly as cash or product.",
    },
    {
        icon: Users,
        title: "Referral Bonus (5%)",
        description: "Get 5% bonus from every commission earned by the people you refer. Build a passive income stream!",
        animation: "animate-bounce",
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

const RegisterForm = () => {
    const { register: registerMutation, loading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        referralCode: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Redirect to login on successful registration with redirect parameter
    useEffect(() => {
        if (registerMutation.isSuccess) {
            const redirect = searchParams.get('redirect');
            const plan = searchParams.get('plan');

            // If user registered with a plan, create a subscription notification for admins
            if (plan) {
                createSubscriptionNotification(plan, formData.firstName, formData.lastName, formData.email);
            }

            const loginUrl = redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : '/login';
            router.push(loginUrl);
        }
    }, [registerMutation.isSuccess, router, searchParams, formData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const createSubscriptionNotification = async (plan: string, firstName: string, lastName: string, email: string) => {
        try {
            const notificationData = {
                type: 'subscription',
                title: `New ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan Subscription`,
                message: `${firstName} ${lastName} (${email}) has subscribed to the ${plan} plan.`,
                priority: 'medium',
                read: false,
                timestamp: new Date().toISOString(),
                details: `Customer: ${firstName} ${lastName}\nEmail: ${email}\nPlan: ${plan.charAt(0).toUpperCase() + plan.slice(1)}\nTime: ${new Date().toLocaleString()}`
            };

            // For now, we'll store in localStorage as a demo
            // In production, this would be sent to the backend API
            const existingNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
            existingNotifications.unshift(notificationData);
            localStorage.setItem('adminNotifications', JSON.stringify(existingNotifications));

            console.log('Subscription notification created for admins');
        } catch (error) {
            console.error('Failed to create subscription notification:', error);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }

        registerMutation.mutate({
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            referralCode: formData.referralCode
        } as any, {
            onSuccess: () => {
                toast.success('Registration successful! Welcome to Epilux!');
            },
            onError: (error: any) => {
                const errorMessage = error?.response?.data?.message || error?.message || 'Registration failed. Please try again.';
                toast.error(errorMessage);
            }
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
            {/* BLURRED BACKGROUND */}
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl m-4 flex overflow-hidden transform transition-all duration-300 scale-100">
                    {/* Left Side: Program Highlights (Value Proposition) */}
                    <div className="hidden md:block w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-10 text-white relative overflow-hidden">
                        {/* Animated background elements */}
                        <div className="absolute top-0 left-0 w-full h-full">
                            <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                            <div className="absolute top-32 right-16 w-16 h-16 bg-yellow-300/20 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
                            <div className="absolute bottom-20 left-20 w-12 h-12 bg-blue-300/20 rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-3xl font-extrabold mb-4 border-b border-blue-400 pb-3 animate-fadeIn">
                                Join the Epilux Partner Program
                            </h3>
                            <p className="text-blue-100 mb-8 text-lg animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                                Start your journey to predictable income by partnering with a premium water brand.
                            </p>
                            <ul className="space-y-6">
                                {programHighlights.map((item, index) => (
                                    <li key={index} className={`flex items-start gap-4 p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 animate-fadeIn ${item.animation || ''}`} style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
                                        <item.icon className={`h-6 w-6 text-yellow-300 flex-shrink-0 mt-1 ${item.animation ? 'animate-pulse' : ''}`} />
                                        <div>
                                            <p className="font-semibold text-lg text-white">{item.title}</p>
                                            <p className="text-blue-100 text-sm leading-relaxed">{item.description}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <img
                            src="/images/logo.png"
                            alt="Epilux Water"
                            className="absolute bottom-0 -right-20 opacity-20 h-40 w-auto animate-pulse"
                        />
                    </div>

                    {/* Right Side: Registration Form */}
                    <div className="w-full md:w-1/2 p-8 sm:p-10 relative bg-gradient-to-br from-white via-gray-50 to-blue-50">
                        {/* Floating decorative elements */}
                        <div className="absolute top-8 right-8 w-16 h-16 bg-blue-100 rounded-full opacity-20 animate-float"></div>
                        <div className="absolute bottom-16 left-8 w-12 h-12 bg-purple-100 rounded-full opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>

                        <button
                            onClick={() => router.back()}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors rounded-full p-2 hover:bg-gray-100 z-10"
                        >
                            <X className="h-6 w-6" />
                        </button>

                        <div className="relative z-10">
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg animate-bounceIn">
                                    <User className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2 animate-fadeIn">
                                    Create Your Account
                                </h2>
                                <p className="text-gray-500 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                                    It only takes a minute to get started.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
                                {/* First Name */}
                                <div className="relative group">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="First Name"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-white/80 backdrop-blur-sm hover:border-gray-400"
                                    />
                                </div>

                                {/* Last Name */}
                                <div className="relative group">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Last Name"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-white/80 backdrop-blur-sm hover:border-gray-400"
                                    />
                                </div>

                                {/* Email */}
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email Address"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-white/80 backdrop-blur-sm hover:border-gray-400"
                                    />
                                </div>

                                {/* Phone Number */}
                                <div className="relative group">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Phone Number"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-white/80 backdrop-blur-sm hover:border-gray-400"
                                    />
                                </div>

                                {/* Referral Code (Optional) */}
                                <div className="relative group">
                                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="text"
                                        name="referralCode"
                                        placeholder="Referral Code (Optional)"
                                        value={formData.referralCode}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-white/80 backdrop-blur-sm hover:border-gray-400"
                                    />
                                </div>

                                {/* Password */}
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        minLength={6}
                                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-white/80 backdrop-blur-sm hover:border-gray-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors p-1"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5 cursor-pointer" /> : <Eye className="h-5 w-5 cursor-pointer" />}
                                    </button>
                                </div>

                                {/* Confirm Password */}
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        placeholder="Confirm Password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        minLength={6}
                                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-white/80 backdrop-blur-sm hover:border-gray-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors p-1"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-5 w-5 cursor-pointer" /> : <Eye className="h-5 w-5 cursor-pointer" />}
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl mt-6 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {loading ? 'Creating Account...' : 'Complete Registration'}
                                </button>
                            </form>
                            <p className="text-center text-sm text-gray-500 mt-6 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
                                Already a partner? <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">Sign in here</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function App() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <RegisterForm />
        </Suspense>
    );
}
