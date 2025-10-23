'use client';

import { useState } from 'react';
import {
  Wallet,
  Eye,
  EyeOff,
  Clock,
  Timer,
  Check,
  TrendingUp,
  DollarSign,
  Award,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { useAffiliateProfile } from '@/hooks/useAffiliate';

export default function AffiliateWallet() {
  const { data: profileData } = useAffiliateProfile();
  const profile = profileData?.profile;
  const [showBalance, setShowBalance] = useState(false);

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

  const withdrawalCountdown = getWithdrawalCountdown();
  const lockCountdown = getLockCountdown();

  return (
    <div className="space-y-6">
      {/* Wallet Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">My Wallet</h2>
            <p className="text-green-100">Manage your earnings and withdrawals</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-green-100 mb-1">Available Balance</p>
            <div className="flex items-center gap-3">
              <p className="text-3xl font-bold">
                {showBalance ? `₦${profile?.availableBalance?.toLocaleString() || '0'}` : '••••••'}
              </p>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Earned</p>
                <p className="text-xl font-bold text-gray-900">₦{profile?.totalEarned?.toLocaleString() || '0'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Available</p>
                <p className="text-xl font-bold text-gray-900">₦{profile?.availableBalance?.toLocaleString() || '0'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Withdrawn</p>
                <p className="text-xl font-bold text-gray-900">₦{profile?.totalWithdrawn?.toLocaleString() || '0'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Withdrawal Period Card */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Timer className="w-5 h-5 text-orange-500" />
            Withdrawal Period
          </CardTitle>
        </CardHeader>
        <CardContent>
          {withdrawalCountdown ? (
            <div className="text-center py-4">
              <div className="inline-flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-lg mb-4">
                <Clock className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">Next period starts in</span>
              </div>
              <div className="flex justify-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{withdrawalCountdown.days}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Days</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{withdrawalCountdown.hours}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{withdrawalCountdown.minutes}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Minutes</div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Monthly withdrawal period: 26th - 30th
              </p>
            </div>
          ) : lockCountdown ? (
            <div className="text-center py-4">
              <div className="inline-flex items-center gap-2 bg-red-50 px-4 py-2 rounded-lg mb-4">
                <Timer className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-800">Period ends in</span>
              </div>
              <div className="flex justify-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{lockCountdown.days}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Days</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{lockCountdown.hours}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{lockCountdown.minutes}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Minutes</div>
                </div>
              </div>
              <p className="text-sm text-red-600 font-medium mt-4">
                Make your withdrawals before the period ends!
              </p>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg mb-4">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Withdrawal period is active</span>
              </div>
              <p className="text-sm text-gray-600">
                You can request withdrawals until the end of the month
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="w-5 h-5 text-blue-500" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
            <p className="text-gray-600 text-sm">
              Your commission earnings and withdrawal history will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}