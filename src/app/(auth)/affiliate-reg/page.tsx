/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
// components/pages/AffiliateWelcomePage.tsx
"use client";
import React, { useState } from 'react';
import { Truck, DollarSign, Award, Users, Zap, BookOpen } from 'lucide-react';
import Footer from '@/Components/layout/footer';
import AffiliateHeader from '@/Components/layout/affiliate-header';
import { useRouter } from 'next/navigation';

const AFFILIATE_SUCCESS_IMAGE = "https://images.unsplash.com/photo-1552664730-d307ca884978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.0.3&q=80&w=1080";

const programOverview = "The Epilux Premium Water Program is a comprehensive marketing and distribution strategy designed to promote Epilux sachet and table water while creating income-generating opportunities for individuals, marketers, and business partners. At its core, the program uses an affiliate and performance-based model where BUYERS, DISTRIBUTORS, RETAIL STORES, MARKETERS, CONSUMERS earn commissions for every bag of water they buy from Epilux Premium water.";

const coreFeatures = [
    {
        icon: DollarSign,
        title: "High Commissions & Rewards",
        value: "12% Commission",
        description: "Earn a 12% commission on every bag sold. Redeem your earnings as cash (monthly payout) or product for extra profit.",
    },
    {
        icon: Users,
        title: "Extended Referral Bonus",
        value: "50% of Referred's Commission",
        description: "Recruit other marketers and earn 50% of the commission they earn on their sales for their first 3 months. Build a passive income stream.",
    },
    {
        icon: Truck,
        title: "Recurring Income Streams",
        value: "Subscription Commissions",
        description: "Sign up customers for weekly or monthly water delivery subscriptions and earn continuous commissions as long as they stay subscribed.",
    },
    {
        icon: Award,
        title: "Milestone & Loyalty Bonuses",
        value: "Trips & Smartphones",
        description: "Top performers qualify for exclusive rewards, including vouchers, branded apparel, all-expense-paid trips, and premium smartphones.",
    },
];

const supportingFeatures = [
    {
        icon: Zap,
        title: "Free Marketing Tools",
        description: "Receive pre-designed flyers, captions, and video templates for WhatsApp, Facebook, and Instagram to ensure greater visibility and higher conversions.",
        color: "text-green-500",
    },
    {
        icon: BookOpen,
        title: "Full Training & Onboarding",
        description: "Access visual guides, training videos, and a comprehensive FAQ section to make you a confident, active, and loyal marketer from day one.",
        color: "text-purple-500",
    },
];

export default function AffiliateWelcomePage() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
            <AffiliateHeader onRegisterClick={() => router.push('/register')} />

            <main className="app-content flex-grow">
                {/* 1. Modern Hero Section */}
                <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-24 md:py-36 shadow-xl">
                    <div className="container mx-auto px-6 text-center">
                        <span className="text-sm font-semibold uppercase tracking-widest text-blue-200 mb-2 block">
                            Epilux Performance Partner
                        </span>
                        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight">
                            Your Income. Our Premium Water.
                        </h1>
                        <p className="text-xl md:text-2xl mb-10 max-w-4xl mx-auto text-blue-200">
                            Partner with Epilux and tap into a system where **BUYERS, DISTRIBUTORS, and MARKETERS** all earn commissions for every bag of premium water sold.
                        </p>
                        <button
                            onClick={() => router.push('/register')}
                            className="bg-yellow-400 text-gray-900 font-bold py-4 px-12 rounded-xl text-lg shadow-2xl hover:bg-yellow-300 transition-all transform hover:scale-105"
                        >
                            Start Earning Today!
                        </button>
                    </div>
                </section>

                {/* 2. Overview & Core Features (Modern Cards) */}
                <section className="py-20 md:py-28 bg-white">
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl font-bold text-gray-800 text-center mb-4">
                            The Epilux Advantage: Built to Reward
                        </h2>
                        <p className="text-xl text-gray-500 text-center max-w-3xl mx-auto mb-16">
                            {programOverview}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {coreFeatures.map((feature, index) => (
                                <div key={index} className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 transform hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                                    <feature.icon className={`h-10 w-10 text-blue-600 mb-4 group-hover:text-blue-500 transition-colors`} />
                                    <h3 className="text-xl font-bold text-gray-800 mb-1">{feature.title}</h3>
                                    <p className="text-2xl font-extrabold text-blue-600 mb-3">{feature.value}</p>
                                    <p className="text-gray-500 text-sm">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 3. Why Epilux? (Document-Driven Features + Image) */}
                <section className="py-20 bg-blue-50">
                    <div className="container mx-auto px-6">
                        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
                            <div className="lg:w-1/2">
                                <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
                                    More Than Just Commissions
                                </h2>
                                <p className="text-lg text-gray-600 mb-8">
                                    We provide you with the resources to succeed, converting **Current Issues** into **Immediate Opportunities**—all sourced from the Epilux growth strategy document.
                                </p>

                                <div className="space-y-6">
                                    {supportingFeatures.map((feature, index) => (
                                        <div key={index} className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-md border-l-4 border-blue-500">
                                            <feature.icon className={`h-8 w-8 ${feature.color} flex-shrink-0 mt-1`} />
                                            <div>
                                                <h4 className="text-xl font-bold text-gray-800 mb-1">{feature.title}</h4>
                                                <p className="text-gray-500 text-base">{feature.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="lg:w-1/2 w-full">
                                {/* Illustrative Image - Replaced Placeholder with NEW URL */}
                                <img
                                    src={AFFILIATE_SUCCESS_IMAGE}
                                    alt="Business partners analyzing growth charts on a laptop in an office setting"
                                    className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-2xl"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    </div>
                </section>


                {/* Final Call to Action */}
                <section className="bg-blue-700 py-16">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Ready to Turn Hydration into High Income?
                        </h2>
                        <p className="text-lg text-blue-200 mb-8">
                            Join the Epilux Partner Program today. It's simple, free, and instantly rewarding.
                        </p>
                        <button
                            onClick={() => router.push('/register')}
                            className="bg-yellow-400 text-gray-900 font-bold py-4 px-12 rounded-xl text-xl shadow-2xl hover:bg-yellow-300 transition-all transform hover:scale-105"
                        >
                            Register in 60 Seconds
                        </button>
                    </div>
                </section>
                <Footer />
            </main>

        </div>
    );
}