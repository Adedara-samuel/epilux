// pages/index.tsx
import Header from "@/Components/header";
import AffiliateProgram from "@/Components/home/AffiliateProgram";
import FeaturedProducts from "@/Components/home/featured-product";
import HeroSection from "@/Components/home/HeroSection";
import ProductCategories from "@/Components/home/ProductCategories";
import SeasonalPromotions from "@/Components/home/seasonal-promotions";
import SubscriptionPlans from "@/Components/home/subscription-plan";
import Testimonials from "@/Components/home/testimonial";
import Footer from "@/Components/layout/footer";
import React from 'react';

const Home: React.FC = () => {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <HeroSection />
        <ProductCategories />
        <FeaturedProducts />
        <AffiliateProgram />
        <SubscriptionPlans />
        <SeasonalPromotions />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}

export default Home;