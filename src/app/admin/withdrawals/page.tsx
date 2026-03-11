'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { usePendingWithdrawals, useProcessWithdrawal } from '@/hooks/useWallet';
import {
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  User,
  CreditCard,
  MessageSquare,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { Textarea } from '@/Components/ui/textarea';
import { toast } from 'sonner';

export default function AdminWithdrawalsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<any>(null);
  const [adminNote, setAdminNote] = useState('');
  const [isProcessingModalOpen, setIsProcessingModalOpen] = useState(false);

  const { data: withdrawalsData, isLoading } = usePendingWithdrawals();
  const processWithdrawalMutation = useProcessWithdrawal();

  const withdrawals = withdrawalsData?.withdrawals || [];

  // Add global animations
  useEffect(() => {
    if (typeof window === 'undefined') return;

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
    router.push('/login');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user.role !== 'admin') {
    router.push('/');
    return null;
  }

  const handleProcessWithdrawal = async (action: 'approve' | 'reject') => {
    if (!selectedWithdrawal) return;

    try {
      await processWithdrawalMutation.mutateAsync({
        id: selectedWithdrawal.id,
        action,
        adminNote: adminNote.trim() || undefined,
      });

      setIsProcessingModalOpen(false);
      setSelectedWithdrawal(null);
      setAdminNote('');
      toast.success(`Withdrawal ${action}d successfully`);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'processed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent animate-bounceIn">
                Withdrawal Management
              </h1>
              <p className="text-gray-600 mt-1 animate-fadeIn animation-delay-300">Review and process affiliate withdrawal requests</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="animate-fadeIn animation-delay-600">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-xl font-bold text-gray-900">
                      {withdrawals.filter(w => w.status === 'pending').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Approved</p>
                    <p className="text-xl font-bold text-gray-900">
                      {withdrawals.filter(w => w.status === 'approved').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Rejected</p>
                    <p className="text-xl font-bold text-gray-900">
                      {withdrawals.filter(w => w.status === 'rejected').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-xl font-bold text-gray-900">
                      ₦{withdrawals.reduce((sum, w) => sum + w.amount, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Withdrawals List */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CreditCard className="w-5 h-5 text-blue-500" />
                Withdrawal Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mx-auto mb-3"></div>
                  <p className="text-gray-600">Loading withdrawals...</p>
                </div>
              ) : withdrawals.length > 0 ? (
                <div className="space-y-4">
                  {withdrawals.map((withdrawal) => (
                    <div key={withdrawal.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                            {withdrawal.accountName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{withdrawal.accountName}</h4>
                            <p className="text-sm text-gray-600">{withdrawal.bankName} - {withdrawal.accountNumber}</p>
                            <p className="text-xs text-gray-500">
                              Requested {new Date(withdrawal.requestedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">₦{withdrawal.amount.toLocaleString()}</p>
                          <Badge className={`mb-2 ${getStatusColor(withdrawal.status)}`}>
                            {withdrawal.status}
                          </Badge>
                          {withdrawal.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedWithdrawal(withdrawal);
                                  setIsProcessingModalOpen(true);
                                }}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Review
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      {withdrawal.adminNote && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <strong>Admin Note:</strong> {withdrawal.adminNote}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No withdrawal requests</h3>
                  <p className="text-gray-600 text-sm">
                    All withdrawal requests have been processed
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Processing Modal */}
      <Dialog open={isProcessingModalOpen} onOpenChange={setIsProcessingModalOpen}>
        <DialogContent className="sm:max-w-md animate-scaleIn">
          <DialogHeader>
            <DialogTitle>Process Withdrawal Request</DialogTitle>
          </DialogHeader>
          {selectedWithdrawal && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Withdrawal Details</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Amount:</strong> ₦{selectedWithdrawal.amount.toLocaleString()}</p>
                  <p><strong>Bank:</strong> {selectedWithdrawal.bankName}</p>
                  <p><strong>Account:</strong> {selectedWithdrawal.accountNumber}</p>
                  <p><strong>Name:</strong> {selectedWithdrawal.accountName}</p>
                  <p><strong>Requested:</strong> {new Date(selectedWithdrawal.requestedAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Admin Note (Optional)</label>
                <Textarea
                  placeholder="Add a note for the affiliate..."
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => handleProcessWithdrawal('reject')}
                  disabled={processWithdrawalMutation.isPending}
                  variant="destructive"
                  className="flex-1"
                >
                  {processWithdrawalMutation.isPending ? 'Processing...' : 'Reject'}
                </Button>
                <Button
                  onClick={() => handleProcessWithdrawal('approve')}
                  disabled={processWithdrawalMutation.isPending}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {processWithdrawalMutation.isPending ? 'Processing...' : 'Approve'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}