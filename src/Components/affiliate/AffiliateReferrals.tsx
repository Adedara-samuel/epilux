'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Copy,
  Check,
  Share2,
  Award,
  DollarSign,
  TrendingUp
} from 'lucide-react';

// Add custom CSS animations
const customStyles = `
  @keyframes bounceIn {
    0% { transform: scale(0.3); opacity: 0; }
    50% { transform: scale(1.05); }
    70% { transform: scale(0.9); }
    100% { transform: scale(1); opacity: 1; }
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-30px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes countUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .animate-bounceIn { animation: bounceIn 0.8s ease-out; }
  .animate-fadeInUp { animation: fadeInUp 0.6s ease-out; }
  .animate-slideInLeft { animation: slideInLeft 0.6s ease-out; }
  .animate-countUp { animation: countUp 0.8s ease-out; }
  .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }

  .animation-delay-200 { animation-delay: 0.2s; }
  .animation-delay-300 { animation-delay: 0.3s; }
  .animation-delay-500 { animation-delay: 0.5s; }
  .animation-delay-600 { animation-delay: 0.6s; }
`;
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { useAffiliateProfile, useAffiliateReferrals } from '@/hooks/useAffiliate';

interface AffiliateReferralsProps {
  referralsData?: { referrals: any[]; total: number };
}

export default function AffiliateReferrals({ referralsData }: AffiliateReferralsProps) {
  const { data: profileData } = useAffiliateProfile();
  const { data: fetchedReferralsData } = useAffiliateReferrals();
  const profile = profileData?.profile as any;
  const referrals = (referralsData?.referrals ?? fetchedReferralsData?.referrals ?? []) as any[];
  const [copiedCode, setCopiedCode] = useState(false);

  // Inject custom styles
  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = customStyles;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const copyReferralCode = async () => {
    if (profile?.affiliateInfo?.affiliateCode) {
      await navigator.clipboard.writeText(profile.affiliateInfo.affiliateCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else if (profile?.referralCode) {
      await navigator.clipboard.writeText(profile.referralCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="space-y-6" id="referrals-section">
      {/* Referral Code Header */}
      <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 shadow-lg animate-fadeInUp">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2 animate-slideInLeft">My Referral Network</h2>
              <p className="text-purple-100 animate-slideInLeft animation-delay-200">Share your code and earn commissions</p>
            </div>
            <div className="text-right">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3 mb-3">
                <p className="text-xs text-purple-100 mb-1">Your Referral Code</p>
                <div className="flex items-center gap-3">
                  <code className="text-lg font-mono font-bold">{profile?.referralCode || 'Loading...'}</code>
                  <Button
                    onClick={copyReferralCode}
                    size="sm"
                    className="bg-white text-purple-600 hover:bg-gray-50"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-4 h-4 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                {profile?.referralLink && (
                  <p className="mt-2 text-xs break-all text-purple-100/90">{profile.referralLink}</p>
                )}
              </div>
              <Button
                onClick={() => {
                  const shareText = `Join Epilux Water and get premium products delivered! Use my referral code: ${profile?.affiliateInfo?.affiliateCode || profile?.referralCode} to get started.`;
                  if (navigator.share) {
                    navigator.share({
                      title: 'Join Epilux Water',
                      text: shareText,
                      url: window.location.origin
                    });
                  } else {
                    navigator.clipboard.writeText(`${shareText} ${window.location.origin}`);
                    alert('Referral link copied to clipboard!');
                  }
                }}
                className="bg-white text-purple-600 hover:bg-gray-50"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Code
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fadeInUp animation-delay-300">
        <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Referrals</p>
                <p className="text-2xl font-bold text-gray-900 animate-countUp">{profile?.totalReferrals ?? referrals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                <Award className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Referrals</p>
                <p className="text-2xl font-bold text-gray-900 animate-countUp">
                  {profile?.activeReferrals ?? referrals.filter((r: any) => r.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center animate-pulse">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Commission</p>
                <p className="text-2xl font-bold text-gray-900 animate-countUp">
                  ₦{(profile?.totalEarned ?? referrals.reduce((sum: number, r: any) => sum + r.commission, 0)).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referrals List */}
      <Card className="bg-white border border-gray-200 shadow-sm animate-fadeInUp animation-delay-500">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg animate-slideInLeft animation-delay-600">
            <Users className="w-5 h-5 text-purple-500 animate-pulse" />
            My Referral Network
          </CardTitle>
        </CardHeader>
        <CardContent>
          {referrals.length > 0 ? (
            <div className="space-y-3">
              {referrals.map((referral: any, index: number) => (
                <div key={referral.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all animate-fadeInUp hover:scale-105 cursor-pointer" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                        {referral.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{referral.name}</h4>
                        <p className="text-sm text-gray-600">
                          Joined {new Date(referral.joinDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={referral.status === 'active' ? 'default' : 'secondary'}
                        className={`mb-2 ${
                          referral.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {referral.status}
                      </Badge>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">{referral.sales}</span> sales made
                        </p>
                        <p className="text-sm font-bold text-green-600">
                          ₦{referral.commission.toLocaleString()} commission earned
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No referrals yet</h3>
              <p className="text-gray-600 text-sm mb-6 max-w-md mx-auto">
                Share your referral code to start building your network and earning commissions
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => window.location.href = '/products'}
                  variant="outline"
                >
                  Browse Products
                </Button>
                <Button
                  onClick={copyReferralCode}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Code
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}