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
  Calendar,
  CreditCard
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { useAffiliateProfile } from '@/hooks/useAffiliate';
import { toast } from 'sonner';
import WithdrawalReceipt from './WithdrawalReceipt';

export default function AffiliateWallet() {
  const { data: profileData } = useAffiliateProfile();
  const profile = profileData?.profile;
  const [showBalance, setShowBalance] = useState(false);
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const [withdrawalData, setWithdrawalData] = useState({
    amount: '',
    bankName: '',
    accountNumber: '',
    accountName: '',
  });
  const [receiptWithdrawal, setReceiptWithdrawal] = useState<any>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  // TODO: Implement withdrawal functionality when API is available
  const requestWithdrawalMutation = { mutateAsync: async (data: any) => ({ withdrawal: null }), isPending: false };

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

  const handleWithdrawalRequest = async () => {
    if (!withdrawalData.amount || !withdrawalData.bankName || !withdrawalData.accountNumber || !withdrawalData.accountName) {
      toast.error('Please fill in all fields');
      return;
    }

    const amount = parseFloat(withdrawalData.amount);
    if (amount <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }

    if (amount > (profile?.availableBalance || 0)) {
      toast.error('Insufficient balance');
      return;
    }

    try {
      const result = await requestWithdrawalMutation.mutateAsync({
        amount,
        bankName: withdrawalData.bankName,
        accountNumber: withdrawalData.accountNumber,
        accountName: withdrawalData.accountName,
      });

      setIsWithdrawalModalOpen(false);
      setWithdrawalData({
        amount: '',
        bankName: '',
        accountNumber: '',
        accountName: '',
      });

      // Show receipt for successful withdrawal
      if (result?.withdrawal) {
        setReceiptWithdrawal(result.withdrawal);
        setShowReceipt(true);
      }
    } catch (error) {
      // Error handled by mutation
    }
  };

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
            <p className="text-sm text-gray-600 mb-4">
              You can request withdrawals until the end of the month
            </p>
            <Dialog open={isWithdrawalModalOpen} onOpenChange={setIsWithdrawalModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Request Withdrawal
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md animate-scaleIn">
                <DialogHeader>
                  <DialogTitle>Request Withdrawal</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="amount">Amount (₦)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount"
                      value={withdrawalData.amount}
                      onChange={(e) => setWithdrawalData(prev => ({ ...prev, amount: e.target.value }))}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Available: ₦{profile?.availableBalance?.toLocaleString() || '0'}
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Select value={withdrawalData.bankName} onValueChange={(value) => setWithdrawalData(prev => ({ ...prev, bankName: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select bank" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="access">Access Bank</SelectItem>
                        <SelectItem value="fidelity">Fidelity Bank</SelectItem>
                        <SelectItem value="firstbank">First Bank</SelectItem>
                        <SelectItem value="gtb">Guaranty Trust Bank (GTB)</SelectItem>
                        <SelectItem value="heritage">Heritage Bank</SelectItem>
                        <SelectItem value="keystone">Keystone Bank</SelectItem>
                        <SelectItem value="polaris">Polaris Bank</SelectItem>
                        <SelectItem value="providus">Providus Bank</SelectItem>
                        <SelectItem value="stanbic">Stanbic IBTC Bank</SelectItem>
                        <SelectItem value="sterling">Sterling Bank</SelectItem>
                        <SelectItem value="uba">United Bank for Africa (UBA)</SelectItem>
                        <SelectItem value="union">Union Bank</SelectItem>
                        <SelectItem value="unity">Unity Bank</SelectItem>
                        <SelectItem value="wema">Wema Bank</SelectItem>
                        <SelectItem value="zenith">Zenith Bank</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      placeholder="Enter account number"
                      value={withdrawalData.accountNumber}
                      onChange={(e) => setWithdrawalData(prev => ({ ...prev, accountNumber: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="accountName">Account Name</Label>
                    <Input
                      id="accountName"
                      placeholder="Enter account name"
                      value={withdrawalData.accountName}
                      onChange={(e) => setWithdrawalData(prev => ({ ...prev, accountName: e.target.value }))}
                    />
                  </div>
                  <Button
                    onClick={handleWithdrawalRequest}
                    disabled={requestWithdrawalMutation.isPending}
                    className="w-full"
                  >
                    {requestWithdrawalMutation.isPending ? 'Processing...' : 'Submit Request'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
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

      {/* Withdrawal Receipt Modal */}
      {receiptWithdrawal && (
        <WithdrawalReceipt
          withdrawal={receiptWithdrawal}
          isOpen={showReceipt}
          onClose={() => {
            setShowReceipt(false);
            setReceiptWithdrawal(null);
          }}
        />
      )}
    </div>
  );
}