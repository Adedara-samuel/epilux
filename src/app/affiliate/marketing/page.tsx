/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useAffiliateProfile } from '@/hooks/useAffiliate';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { ArrowLeft, Download, Share2, Copy, Image, FileText, Mail, MessageSquare } from 'lucide-react';

export default function AffiliateMarketingPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [copied, setCopied] = useState<string | null>(null);

    // Get affiliate profile for additional data
    const { data: profileData } = useAffiliateProfile();
    const profile = profileData?.profile;

    if (!user || user.role !== 'affiliate') {
        router.push('/login');
        return null;
    }

    const referralLink = `https://epiluxwater.com/join?ref=${user.id}`;
    const userName = user.firstName || 'Valued Partner';

    const marketingAssets = [
        {
            id: 'banner1',
            type: 'image',
            title: 'Hero Banner',
            description: 'Eye-catching banner for your website or social media',
            url: '/marketing/banner1.jpg',
            preview: '/marketing/banner1-preview.jpg'
        },
        {
            id: 'banner2',
            type: 'image',
            title: 'Product Showcase',
            description: 'Showcase our premium water products',
            url: '/marketing/banner2.jpg',
            preview: '/marketing/banner2-preview.jpg'
        },
        {
            id: 'flyer',
            type: 'pdf',
            title: 'Product Flyer',
            description: 'Detailed product information flyer',
            url: '/marketing/flyer.pdf',
            preview: '/marketing/flyer-preview.jpg'
        },
        {
            id: 'email-template',
            type: 'template',
            title: 'Email Template',
            description: 'Professional email template for promotions',
            url: '/marketing/email-template.html',
            preview: '/marketing/email-preview.jpg'
        }
    ];

    const socialPlatforms = [
        { name: 'Facebook', icon: '📘', color: 'bg-blue-600' },
        { name: 'Twitter', icon: '🐦', color: 'bg-sky-500' },
        { name: 'Instagram', icon: '📷', color: 'bg-pink-500' },
        { name: 'LinkedIn', icon: '💼', color: 'bg-blue-700' },
        { name: 'WhatsApp', icon: '💬', color: 'bg-green-500' }
    ];

    const copyToClipboard = async (text: string, id: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(id);
            setTimeout(() => setCopied(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const shareOnSocial = (platform: string) => {
        const text = `Join me in getting premium water delivery! Use my referral link: ${referralLink}`;
        const urls = {
            Facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
            Twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
            LinkedIn: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`,
        };

        if (urls[platform as keyof typeof urls]) {
            window.open(urls[platform as keyof typeof urls], '_blank');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            onClick={() => router.push('/affiliate/dashboard')}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Dashboard
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Marketing Assets</h1>
                            <p className="text-gray-600 mt-1">Everything you need to promote Epilux Water</p>
                        </div>
                    </div>
                </div>

                {/* Referral Link Section */}
                <Card className="p-6 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Your Referral Link</h2>
                    <div className="flex gap-4">
                        <Input
                            value={referralLink}
                            readOnly
                            className="flex-1"
                        />
                        <Button
                            onClick={() => copyToClipboard(referralLink, 'link')}
                            className="flex items-center gap-2"
                        >
                            <Copy className="h-4 w-4" />
                            {copied === 'link' ? 'Copied!' : 'Copy'}
                        </Button>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                        Share this link with friends, family, and your network to earn commissions on every sale.
                    </p>
                </Card>

                {/* Social Sharing */}
                <Card className="p-6 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Share2 className="h-5 w-5" />
                        Share on Social Media
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {socialPlatforms.map((platform) => (
                            <Button
                                key={platform.name}
                                variant="outline"
                                onClick={() => shareOnSocial(platform.name)}
                                className="flex items-center gap-2 h-auto py-3"
                            >
                                <span className="text-lg">{platform.icon}</span>
                                <span className="text-sm">{platform.name}</span>
                            </Button>
                        ))}
                    </div>
                </Card>

                {/* Marketing Assets */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Marketing Materials</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {marketingAssets.map((asset) => (
                            <Card key={asset.id} className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0">
                                        {asset.type === 'image' && <Image className="h-8 w-8 text-blue-500" />}
                                        {asset.type === 'pdf' && <FileText className="h-8 w-8 text-red-500" />}
                                        {asset.type === 'template' && <Mail className="h-8 w-8 text-green-500" />}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">{asset.title}</h3>
                                        <p className="text-sm text-gray-600 mb-4">{asset.description}</p>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => window.open(asset.preview, '_blank')}
                                            >
                                                Preview
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={() => window.open(asset.url, '_blank')}
                                                className="flex items-center gap-2"
                                            >
                                                <Download className="h-4 w-4" />
                                                Download
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Tips Section */}
                <Card className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Marketing Tips</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <MessageSquare className="h-5 w-5 text-blue-500" />
                                Content Ideas
                            </h3>
                            <ul className="text-sm text-gray-600 space-y-2">
                                <li>• Share your personal water delivery experience</li>
                                <li>• Post about the convenience and quality</li>
                                <li>• Create before/after stories</li>
                                <li>• Share customer testimonials</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <Mail className="h-5 w-5 text-green-500" />
                                Best Practices
                            </h3>
                            <ul className="text-sm text-gray-600 space-y-2">
                                <li>• Always disclose affiliate relationship</li>
                                <li>• Focus on genuine recommendations</li>
                                <li>• Use high-quality images and videos</li>
                                <li>• Track your performance regularly</li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}