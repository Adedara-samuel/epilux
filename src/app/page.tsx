// pages/index.tsx
'use client';

import Header from "@/Components/header";
import AffiliateProgram from "@/Components/home/AffiliateProgram";
import FeaturedProducts from "@/Components/home/featured-product";
import HeroSection from "@/Components/home/HeroSection";
import ProductCategories from "@/Components/home/ProductCategories";
import SeasonalPromotions from "@/Components/home/seasonal-promotions";
import SubscriptionPlans from "@/Components/home/subscription-plan";
import Testimonials from "@/Components/home/testimonial";
import Link from 'next/link';
import React from 'react';
import Footer from "@/Components/layout/footer";

const HomePage: React.FC = () => {
  return (
    <>
      <Header />

      {/* Main Content */}
      <div className="app-content">
        {/* Mobile Layout */}
        <div className="md:hidden space-y-2 px-4">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
            <h1 className="text-2xl font-bold mb-2">Welcome to Epilux Water</h1>
            <p className="text-blue-100">Premium water delivery at your doorstep</p>
          </div>
          <ProductCategories />
          <FeaturedProducts />
          <AffiliateProgram />
          <SubscriptionPlans />
          <SeasonalPromotions />
          <Testimonials />
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block px-8 flex-1 overflow-y-auto">
          <HeroSection />
          <ProductCategories />
          <FeaturedProducts />
          <AffiliateProgram />
          <SubscriptionPlans />
          <SeasonalPromotions />
          <Testimonials />
        </div>
        <Footer />
      </div>
    </>
  );
}

export default HomePage;