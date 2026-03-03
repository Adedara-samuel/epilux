'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
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
import { useWalletBalance, useWalletTransactions, useRequestWithdrawal } from '@/hooks/useWallet';
import { useNigerianBanks } from '@/hooks/useBanks';
import { toast } from 'sonner';
import WithdrawalReceipt from '@/Components/affiliate/WithdrawalReceipt';

export default function WalletPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [showBalance, setShowBalance] = useState(false);
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const [bankSearchOpen, setBankSearchOpen] = useState(false);
  const [withdrawalData, setWithdrawalData] = useState({
    amount: '',
    bankName: '',
    accountNumber: '',
    accountName: '',
  });
  const [receiptWithdrawal, setReceiptWithdrawal] = useState<any>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  // Fetch real wallet data - call hooks first before any early returns
  const { data: walletData, isLoading: balanceLoading, error: balanceError } = useWalletBalance();
  const { data: transactionsData, isLoading: transactionsLoading, error: transactionsError } = useWalletTransactions();
  const { data: banksData, isLoading: banksLoading } = useNigerianBanks();
  const requestWithdrawalMutation = useRequestWithdrawal();

  console.log('Wallet data:', walletData);
  console.log('Balance error:', balanceError);
  console.log('Transactions error:', transactionsError);

  // Use real data or defaults
  const balance = {
    availableBalance: walletData?.availableBalance ?? 0,
    totalEarned: walletData?.totalEarned ?? 0,
    totalWithdrawn: walletData?.totalWithdrawn ?? 0,
  };
  const transactions = transactionsData?.transactions || [];

  // Withdrawal countdown logic - 26th to 30th
  const getNextWithdrawalDate = () => {
    const now = new Date();
    const currentDay = now.getDate();

    if (currentDay >= 26 && currentDay <= 30) {
      // Currently in withdrawal period, no countdown needed
      return null;
    } else if (currentDay < 26) {
      // Before 26th, countdown to 26th of current month
      return new Date(now.getFullYear(), now.getMonth(), 26);
    } else {
      // After 30th, countdown to 26th of next month
      return new Date(now.getFullYear(), now.getMonth() + 1, 26);
    }
  };

  // Check if currently in withdrawal period
  const isWithdrawalPeriodActive = () => {
    const now = new Date();
    const currentDay = now.getDate();
    return currentDay >= 26 && currentDay <= 30;
  };

  const getWithdrawalCountdown = () => {
    const nextDate = getNextWithdrawalDate();
    if (!nextDate) return null; // Currently in withdrawal period

    const now = currentTime;
    const diff = nextDate.getTime() - now.getTime();

    if (diff <= 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  const getLockCountdown = () => {
    const now = currentTime;
    const currentDay = now.getDate();

    // If it's withdrawal period (26th to 30th), show countdown until 30th
    if (currentDay >= 26 && currentDay <= 30) {
      const endOfPeriod = new Date(now.getFullYear(), now.getMonth(), 30, 23, 59, 59);
      const diff = endOfPeriod.getTime() - now.getTime();

      if (diff <= 0) return null;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds };
    }

    return null;
  };

  const [currentTime, setCurrentTime] = useState(new Date());

  // Update countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const withdrawalCountdown = getWithdrawalCountdown();
  const lockCountdown = getLockCountdown();
  const withdrawalPeriodActive = isWithdrawalPeriodActive();

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

    if (amount > balance.availableBalance) {
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

  // Add global animations
  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      @keyframes bounceIn { from { transform: scale(0.3); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
      @keyframes shimmer { 0% { background-position: -200px 0; } 100% { background-position: calc(200px + 100%) 0; } }

      .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
      .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
      .animate-slideUp { animation: slideUp 0.4s ease-out; }
      .animate-bounceIn { animation: bounceIn 0.6s ease-out; }
      .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      .animate-float { animation: float 3s ease-in-out infinite; }
      .animate-shimmer { animation: shimmer 2s infinite linear; }

      * { cursor: default; }
      button, a, input, textarea, select { cursor: pointer; }

      .scroll-smooth { scroll-behavior: smooth; }
      .transition-all { transition: all 0.3s ease; }
      .hover-lift { transition: transform 0.2s ease; }
      .hover-lift:hover { transform: translateY(-2px); }
      .hover-glow { transition: box-shadow 0.3s ease; }
      .hover-glow:hover { box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); }
    `;
    document.head.appendChild(styleSheet);

    // Add smooth scrolling to body
    document.body.classList.add('scroll-smooth');

    return () => {
      document.head.removeChild(styleSheet);
      document.body.classList.remove('scroll-smooth');
    };
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Add null check for user.role
  if (!user.role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h2>
          <p className="text-gray-600 mb-6">
            Please wait while we load your account information.
          </p>
        </div>
      </div>
    );
  }

  // Check if user has access to wallet (affiliate or user role)
  if (user.role !== 'affiliate' && user.role !== 'user') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🚫</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access the wallet page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">

      <div className="container mx-auto px-6 py-8">
        <div className="animate-fadeIn animation-delay-600">
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
                      {showBalance ? `₦${balance.availableBalance.toLocaleString()}` : '••••••'}
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
                      <p className="text-xl font-bold text-gray-900">₦{balance.totalEarned.toLocaleString()}</p>
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
                      <p className="text-xl font-bold text-gray-900">₦{balance.availableBalance.toLocaleString()}</p>
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
                      <p className="text-xl font-bold text-gray-900">₦{balance.totalWithdrawn.toLocaleString()}</p>
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
                {withdrawalPeriodActive ? (
                  <div className="text-center py-6">
                    <div className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg mb-4">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Withdrawal period is active</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      You can request withdrawals until the end of the month
                    </p>
                    <Button
                      onClick={() => setIsWithdrawalModalOpen(true)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      disabled={balanceLoading}
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Request Withdrawal
                    </Button>
                  </div>
                ) : withdrawalCountdown ? (
                  <div className="text-center py-4">
                    <div className="inline-flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-lg mb-4">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-medium text-orange-800">Next period starts in</span>
                    </div>
                    <div className="flex justify-center gap-4">
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
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{withdrawalCountdown.seconds}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Seconds</div>
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
                    <div className="flex justify-center gap-4">
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
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{lockCountdown.seconds}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Seconds</div>
                      </div>
                    </div>
                    <p className="text-sm text-red-600 font-medium mt-4">
                      Make your withdrawals before the period ends!
                    </p>
                    <Button
                      onClick={() => setIsWithdrawalModalOpen(true)}
                      className="bg-red-600 hover:bg-red-700 text-white mt-4"
                      disabled={balanceLoading}
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Request Withdrawal
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="inline-flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg mb-4">
                      <Timer className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-800">Loading...</span>
                    </div>
                  </div>
                )}
                <Dialog open={isWithdrawalModalOpen} onOpenChange={setIsWithdrawalModalOpen}>
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
                          Available: ₦{balance.availableBalance.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="bankName">Bank Name</Label>
                        {banksLoading ? (
                          <div className="flex items-center justify-center p-2 border rounded-md">
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-600"></div>
                            <span className="ml-2 text-sm text-gray-600">Loading banks...</span>
                          </div>
                        ) : (
                          <Select value={withdrawalData.bankName} onValueChange={(value) => setWithdrawalData(prev => ({ ...prev, bankName: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select bank" />
                            </SelectTrigger>
                            <SelectContent className="max-h-60">
                              {banksData?.map((bank) => (
                                <SelectItem key={bank.id} value={bank.name}>
                                  {bank.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
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
                {transactionsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mx-auto mb-3"></div>
                    <p className="text-gray-600">Loading transactions...</p>
                  </div>
                ) : transactions.length > 0 ? (
                  <div className="space-y-3">
                    {transactions.map((transaction, index) => (
                      <div key={transaction.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                              {transaction.type === 'credit' ? (
                                <TrendingUp className="w-5 h-5 text-green-600" />
                              ) : (
                                <CreditCard className="w-5 h-5 text-red-600" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{transaction.description}</p>
                              <p className="text-sm text-gray-600">
                                {new Date(transaction.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${
                              transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.type === 'credit' ? '+' : '-'}₦{(transaction.amount ?? 0).toLocaleString()}
                            </p>
                            <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                              {transaction.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Calendar className="w-6 h-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
                    <p className="text-gray-600 text-sm">
                      Your commission earnings and withdrawal history will appear here
                    </p>
                  </div>
                )}
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
        </div>
      </div>
    </div>
  );
}