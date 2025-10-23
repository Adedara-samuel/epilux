/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
// app/products/page.tsx
'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductGrid from '@/Components/products/product-grid';
import { useSearchStore } from '@/stores/search-store';
import { useProducts, useCategories } from '@/hooks/useProducts';
import { useAuth } from '@/hooks/useAuth';
import {
  Wallet,
  Users,
  Eye,
  EyeOff,
  Clock,
  Copy,
  Check,
  TrendingUp,
  DollarSign,
  Award,
  Filter,
  Search,
  Calendar,
  Timer,
  ArrowLeft,
  ShoppingBag,
  Star,
  Heart,
  Share2,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  Zap,
  Droplets,
  Package2,
  Truck,
  Shield
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { useAffiliateProfile, useAffiliateDashboard, useAffiliateReferrals } from '@/hooks/useAffiliate';

// Note: Metadata export is moved to app/layout.tsx for client components.
// If you need dynamic titles based on filters, you'd update the document title client-side.

function ProductsPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialCategory = searchParams.get('category') || 'all';
    const { searchQuery } = useSearchStore(); // Get searchQuery from store
    const { user } = useAuth();

    const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
    const [showBalance, setShowBalance] = useState(false);
    const [copiedCode, setCopiedCode] = useState(false);
    const [activeTab, setActiveTab] = useState<'products'>('products');
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    // Affiliate hooks
    const { data: profileData } = useAffiliateProfile();
    const { data: dashboardData } = useAffiliateDashboard();
    const { data: referralsData } = useAffiliateReferrals();

    const profile = profileData?.profile;
    const dashboard = dashboardData?.dashboard;
    const referrals = referralsData?.referrals || [];

    // Removed [searchQuery, setSearchQuery] useState and handleSearch function

    // Update category state if URL param changes
    useEffect(() => {
        setSelectedCategory(searchParams.get('category') || 'all');
    }, [searchParams]);

    // Handle tab changes from URL - redirect to dedicated pages
    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab === 'wallet') {
            window.location.href = '/wallet';
        } else if (tab === 'referrals') {
            window.location.href = '/referrals';
        }
    }, [searchParams]);

    const handleCategoryChange = (categoryValue: string) => {
        setSelectedCategory(categoryValue);
        // Optionally update URL for persistence/sharing
        const newSearchParams = new URLSearchParams(searchParams.toString());
        if (categoryValue === 'all') {
            newSearchParams.delete('category');
        } else {
            newSearchParams.set('category', categoryValue);
        }
        window.history.pushState(null, '', `?${newSearchParams.toString()}`);
    };

    // Withdrawal countdown logic
    const getNextWithdrawalDate = () => {
        const now = new Date();
        const currentDay = now.getDate();
        let nextWithdrawalDay;

        if (currentDay <= 25) {
            nextWithdrawalDay = 26;
        } else if (currentDay <= 30) {
            nextWithdrawalDay = 30;
        } else {
            // Next month 26th
            const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 26);
            return nextMonth;
        }

        return new Date(now.getFullYear(), now.getMonth(), nextWithdrawalDay);
    };

    const getWithdrawalCountdown = () => {
        const nextDate = getNextWithdrawalDate();
        const now = new Date();
        const diff = nextDate.getTime() - now.getTime();

        if (diff <= 0) return null;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        return { days, hours, minutes };
    };

    const getLockCountdown = () => {
        const now = new Date();
        const currentDay = now.getDate();

        // If it's withdrawal day (26-30), show lock countdown until end of period
        if (currentDay >= 26 && currentDay <= 30) {
            const lockDate = new Date(now.getFullYear(), now.getMonth(), 30, 23, 59, 59);
            const diff = lockDate.getTime() - now.getTime();

            if (diff <= 0) return null;

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            return { days, hours, minutes };
        }

        return null;
    };

    const copyReferralCode = async () => {
        if (profile?.referralCode) {
            await navigator.clipboard.writeText(profile.referralCode);
            setCopiedCode(true);
            setTimeout(() => setCopiedCode(false), 2000);
        }
    };

    const withdrawalCountdown = getWithdrawalCountdown();
    const lockCountdown = getLockCountdown();

    // Use API for products
    const { data: productsData, isLoading } = useProducts({
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        search: searchQuery || undefined,
    });

    const products = productsData?.data || [];

    // Get categories for filters
    const { data: categoriesData } = useCategories();

    const categories = categoriesData?.categories || [];

    // If user is not logged in, show login prompt
    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">🔒</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h2>
                    <p className="text-gray-600 mb-6">
                        Please log in to access our premium water products and start earning commissions through our affiliate program.
                    </p>
                    <Button
                        onClick={() => router.push('/login')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                    >
                        Login to Continue
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header is now handled by the layout */}

            {/* Main Content */}
            <div className="container mx-auto px-4 py-6">
                {/* Products Tab */}
                {activeTab === 'products' && (
                    <div className="space-y-6">

                        {/* Elegant Product Showcase */}
                        <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-3xl shadow-xl border border-blue-100/50 p-8 backdrop-blur-sm">
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                    <Droplets className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">Premium Water Collection</h2>
                                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                    Discover our complete range of high-quality water products, from convenient sachets to premium dispensers
                                </p>
                                <div className="flex items-center justify-center gap-4 mt-6">
                                    <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-blue-200">
                                        <Package2 className="w-4 h-4 text-blue-600" />
                                        <span className="font-semibold text-blue-800">{products.length} Products</span>
                                    </div>
                                    {/* <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-green-200">
                                        <Truck className="w-4 h-4 text-green-600" />
                                        <span className="font-semibold text-green-800">Free Delivery</span>
                                    </div> */}
                                    <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-purple-200">
                                        <Shield className="w-4 h-4 text-purple-600" />
                                        <span className="font-semibold text-purple-800">Quality Guaranteed</span>
                                    </div>
                                </div>
                            </div>

                            {/* Featured Categories Preview */}
                            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    {
                                        title: 'Sachet Water',
                                        icon: '💧',
                                        desc: 'Convenient, hygienic, and affordable',
                                        color: 'from-blue-500 to-cyan-500',
                                        products: products.filter((p: any) => p.category === 'sachet').length
                                    },
                                    {
                                        title: 'Bottled Water',
                                        icon: '🥤',
                                        desc: 'Premium bottled solutions for every need',
                                        color: 'from-green-500 to-emerald-500',
                                        products: products.filter((p: any) => p.category === 'bottled').length
                                    },
                                    {
                                        title: 'Bulk & Dispensers',
                                        icon: '🏢',
                                        desc: 'Large quantities and home/office solutions',
                                        color: 'from-purple-500 to-indigo-500',
                                        products: products.filter((p: any) => p.category === 'bulk').length + products.filter((p: any) => p.category === 'dispenser').length
                                    }
                                ].map((category, index) => (
                                    <div key={index} className="group relative overflow-hidden bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"> */}
                                        {/* <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 shadow-md`}>
                                            <span className="text-2xl filter drop-shadow-sm">{category.icon}</span>
                                        </div> */}
                                        {/* <h3 className="text-xl font-bold text-gray-900 mb-2">{category.title}</h3>
                                        <p className="text-gray-600 mb-4">{category.desc}</p> */}
                                        {/* <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-blue-600">{category.products} products</span>
                                            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                                <ChevronRight className="w-4 h-4 text-blue-600" />
                                            </div>
                                        </div> */}

                                        {/* Hover overlay */}
                                        {/* <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/5 group-hover:to-indigo-500/5 rounded-2xl transition-all duration-300"></div>
                                    </div>
                                ))}
                            </div> */}

                            {/* Call to Action */}
                            <div className="text-center mt-8">
                                <p className="text-gray-600 mb-4">Ready to start earning commissions?</p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <Button className="cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                                        <ShoppingBag className="w-4 h-4 mr-2" />
                                        Browse All Products
                                    </Button>
                                    {user.role !== 'admin' && user.role !== 'marketer' && (
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                // Smooth scroll animation to referrals page
                                                const scrollToReferrals = () => {
                                                    // First, navigate to referrals page
                                                    router.push('/products/referrals');

                                                    // Add a small delay to allow page load, then scroll to section
                                                    setTimeout(() => {
                                                        const element = document.getElementById('referrals-section');
                                                        if (element) {
                                                            element.scrollIntoView({
                                                                behavior: 'smooth',
                                                                block: 'start'
                                                            });
                                                            // Add a subtle bounce animation
                                                            element.style.animation = 'bounceIn 0.8s ease-out';
                                                        }
                                                    }, 500);
                                                };

                                                scrollToReferrals();
                                            }}
                                            className="cursor-pointer border-2 border-purple-200 text-purple-700 hover:bg-purple-50 px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                                        >
                                            <Users className="w-4 h-4 mr-2" />
                                            Share & Earn
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Products Grid */}
                        <div className="space-y-4">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-16">
                                    <div className="text-center">
                                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
                                        <p className="text-lg text-gray-700">Loading products...</p>
                                    </div>
                                </div>
                            ) : products.length > 0 ? (
                                <>
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            {selectedCategory === 'all'
                                                ? 'All Products'
                                                : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Products`
                                            }
                                        </h2>
                                        <span className="text-sm text-gray-600">
                                            {products.length} items
                                        </span>
                                    </div>
                                    <ProductGrid products={products} />
                                </>
                            ) : (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-3xl"><Search size={20} strokeWidth={2.8} /></span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                                    <p className="text-gray-600 mb-6">
                                        Try selecting a different category or check back later.
                                    </p>
                                    <Button
                                        onClick={() => handleCategoryChange('all')}
                                        className="bg-orange-500 hover:bg-orange-600 cursor-pointer"
                                    >
                                        View All Products
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <span className="text-xl">🚚</span>
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-1">Free Delivery</h4>
                                <p className="text-sm text-gray-600">On orders above ₦10,000</p>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <span className="text-xl">✅</span>
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-1">Quality Guaranteed</h4>
                                <p className="text-sm text-gray-600">Premium water products</p>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <span className="text-xl">🔒</span>
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-1">Secure Payments</h4>
                                <p className="text-sm text-gray-600">Bank-grade security</p>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default function App() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading products...</div>}>
            <ProductsPage />
        </Suspense>
    );
}

