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

      {/* Main Content wrapper for full-screen experience */}
      <main className="app-content flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Hero occupies full viewport height and serves as the "app" entry screen */}
        <HeroSection />

        {/* Subsequent sections - stacked and responsive */}
        <section className="flex-grow">
          {/* categories, products, etc. will scale responsively */}
          <ProductCategories />
          <FeaturedProducts />
          <AffiliateProgram />
          <SubscriptionPlans />
          <SeasonalPromotions />
          <Testimonials />
        </section>

        {/* Footer remains at bottom */}
        <Footer />
      </main>
    </>
  );
}

export default HomePage;