'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Percent, Search, Filter, MoreHorizontal } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Badge } from '@/Components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/Components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { adminCommissionRatesAPI } from '@/services/admin';
import { toast } from 'sonner';
import { useAllCommissions, useCommissionRates, useCreateCommissionRate, useUpdateCommissionRate, useDeleteCommissionRate, useUpdateCommissionStatus } from '@/hooks/useCommissions';
import { CommissionRate } from '@/services/commissions';
import CommissionSettingsDisplay from '@/Components/admin/CommissionSettingsDisplay';
import { useAdminSettings } from '@/hooks/useAdmin';

export default function CommissionRatesPage() {
    const { user } = useAuth();
     const currentUser = user;
     const currentUserId = user?._id || user?.id;
   const { data: commissionsData, isLoading: commissionsLoading } = useAllCommissions();
   const { data: commissionRatesData, isLoading: ratesLoading } = useCommissionRates();
   const { data: settingsData } = useAdminSettings();
   const createCommissionRate = useCreateCommissionRate();
   const updateCommissionRate = useUpdateCommissionRate();
   const deleteCommissionRate = useDeleteCommissionRate();
   const updateCommissionStatus = useUpdateCommissionStatus();
  const [commissionRates, setCommissionRates] = useState<CommissionRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRate, setSelectedRate] = useState<CommissionRate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    rate: 0,
    type: 'percentage' as 'percentage' | 'fixed',
    category: 'general' as 'product' | 'service' | 'referral' | 'general'
  });

  // Add global animations
  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      @keyframes bounceIn { from { transform: scale(0.3); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

      .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
      .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
      .animate-slideUp { animation: slideUp 0.4s ease-out; }
      .animate-bounceIn { animation: bounceIn 0.6s ease-out; }
      .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }

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


  // Update commission rates when API data changes
  useEffect(() => {
    if (commissionRatesData?.commissionRates) {
      setCommissionRates(commissionRatesData.commissionRates);
      setLoading(false);
    } else if (!ratesLoading) {
      setCommissionRates([]);
      setLoading(false);
    }
  }, [commissionRatesData, ratesLoading]);

  // Filter commission rates based on search
  const filteredRates = commissionRates.filter(rate =>
    rate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rate.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form submission with real API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (selectedRate) {
        // Update existing rate
        await updateCommissionRate.mutateAsync({
          id: selectedRate._id,
          data: formData
        });
        toast.success('Commission rate updated successfully');
        setIsEditModalOpen(false);
      } else {
        // Create new rate
        const commissionData = {
          ...formData,
          userId: currentUserId // Add userId to the commission data
        };
        await createCommissionRate.mutateAsync(commissionData);
        toast.success('Commission rate created successfully');
        setIsCreateModalOpen(false);
      }
      setSelectedRate(null);
      resetForm();
    } catch (error) {
      console.error('Error saving commission rate:', error);
      toast.error('Failed to save commission rate');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle toggle status with real API
  const handleToggleStatus = async (rate: CommissionRate) => {
    try {
      await updateCommissionRate.mutateAsync({
        id: rate._id,
        data: { isActive: !rate.isActive }
      });
      toast.success(`Commission rate ${rate.isActive ? 'disabled' : 'enabled'} successfully`);
    } catch (error) {
      console.error('Error toggling commission rate status:', error);
      toast.error('Failed to toggle commission rate status');
    }
  };

  // Handle delete with real API
  const handleDelete = async (rate: CommissionRate) => {
    if (!confirm(`Are you sure you want to delete "${rate.name}"?`)) return;

    try {
      await deleteCommissionRate.mutateAsync(rate._id);
      toast.success('Commission rate deleted successfully');
    } catch (error) {
      console.error('Error deleting commission rate:', error);
      toast.error('Failed to delete commission rate');
    }
  };

  // Open edit modal
  const openEditModal = (rate: CommissionRate) => {
    setSelectedRate(rate);
    setFormData({
      name: rate.name,
      description: rate.description || '',
      rate: rate.rate,
      type: rate.type,
      category: rate.category
    });
    setIsEditModalOpen(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      rate: 0,
      type: 'percentage',
      category: 'general'
    });
  };

  // Close modals
  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedRate(null);
    resetForm();
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🚫</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You need admin access to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 lg:px-6 py-6 lg:py-8">
        {/* Commission Settings Display */}
        {settingsData?.data && settingsData.data.commissionRate !== undefined && (
          <CommissionSettingsDisplay settings={settingsData.data} />
        )}

        {/* Commission Statistics */}
        {commissionsData?.statistics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fadeIn animation-delay-700">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover-glow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Commissions</p>
                    <p className="text-2xl font-bold text-gray-900">{commissionsData.statistics.totalCommissions}</p>
                  </div>
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
                    <span className="text-blue-600 font-bold text-sm">📊</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover-glow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold text-green-600">₦{commissionsData.statistics.totalAmount.toLocaleString()}</p>
                  </div>
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
                    <span className="text-green-600 font-bold text-sm">₦</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover-glow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Amount</p>
                    <p className="text-2xl font-bold text-purple-600">₦{commissionsData.statistics.averageAmount.toFixed(2)}</p>
                  </div>
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center animate-pulse">
                    <span className="text-purple-600 font-bold text-sm">∅</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover-glow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-orange-600">{commissionsData.statistics.byStatus.pending}</p>
                  </div>
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center animate-pulse">
                    <span className="text-orange-600 font-bold text-sm">⏳</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Commission Rates Section */}
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-sm mb-8 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Commission Rates</h2>
                <p className="text-sm text-gray-600 mt-1">Manage commission rate configurations</p>
              </div>
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Rate
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md animate-scaleIn z-1000 sm:rounded-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Percent className="w-5 h-5 text-blue-600" />
                      Create Commission Rate
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Standard Product Commission"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Input
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Brief description of this commission rate"
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="rate">Rate</Label>
                        <Input
                          id="rate"
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          value={formData.rate}
                          onChange={(e) => setFormData(prev => ({ ...prev, rate: parseFloat(e.target.value) || 0 }))}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="type">Type</Label>
                        <Select value={formData.type} onValueChange={(value: 'percentage' | 'fixed') => setFormData(prev => ({ ...prev, type: value }))}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percentage">Percentage</SelectItem>
                            <SelectItem value="fixed">Fixed Amount</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={formData.category} onValueChange={(value: 'product' | 'service' | 'referral' | 'general') => setFormData(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="product">Product</SelectItem>
                          <SelectItem value="service">Service</SelectItem>
                          <SelectItem value="referral">Referral</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button type="button" variant="outline" onClick={closeModals} className="flex-1">
                        Cancel
                      </Button>
                      <Button type="submit" disabled={submitting || createCommissionRate.isPending} className="flex-1 bg-blue-600 hover:bg-blue-700">
                        {submitting || createCommissionRate.isPending ? 'Creating...' : 'Create Rate'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="p-6">
            {ratesLoading ? (
              <div className="py-12 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading rates...</span>
              </div>
            ) : (filteredRates.length ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredRates.map((rate) => (
                  <div key={rate._id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Percent className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{rate.name}</h3>
                          <p className="text-sm text-gray-500 capitalize">{rate.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(rate)}
                          className={`w-8 h-8 p-0 ${rate.isActive ? 'text-green-600' : 'text-gray-400'}`}
                        >
                          {rate.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditModal(rate)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(rate)} className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Rate:</span>
                        <span className="font-semibold text-lg text-blue-600">
                          {rate.rate}{rate.type === 'percentage' ? '%' : '₦'}
                        </span>
                      </div>
                      {rate.description && (
                        <p className="text-sm text-gray-600">{rate.description}</p>
                      )}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                        <Badge variant={rate.isActive ? 'default' : 'secondary'}>
                          {rate.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(rate.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Percent className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No commission rates yet</h3>
                <p className="text-gray-600 mb-4">Create your first commission rate to get started.</p>
                <Button onClick={() => setIsCreateModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Commission Rate
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Commission Records Section */}
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-sm mb-8 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Commission Records</h2>
          <p className="text-sm text-gray-600 mt-1">Recent commission transactions</p>
        </div>
        <div className="p-6">
          {commissionsLoading ? (
            <div className="py-12 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading commissions...</span>
            </div>
          ) : (commissionsData?.commissions?.length ? (
            <div className="space-y-4">
              {commissionsData.commissions.slice(0, 10).map((c) => (
                <div key={c._id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-bold text-sm">₦</span>
                      </div>
                      <div>
                        <div className="font-semibold text-lg text-gray-900">₦{(c.amount || 0).toLocaleString()}</div>
                        <div className="text-sm text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <Badge variant={
                      c.status === 'available' ? 'default' :
                      c.status === 'pending' ? 'secondary' :
                      c.status === 'withdrawn' ? 'outline' : 'destructive'
                    } className="capitalize">
                      {c.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {c.affiliate && (
                        <div className="flex items-center gap-1">
                          <span className="text-blue-600">👤</span>
                          {c.affiliate.firstName} {c.affiliate.lastName}
                        </div>
                      )}
                      {c.order && (
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-green-600">📦</span>
                          Order: {c.order.orderNumber}
                        </div>
                      )}
                    </div>
                    <Select
                      onValueChange={(value) => updateCommissionStatus.mutate({ id: c._id, status: value as any })}
                      disabled={updateCommissionStatus.isPending}
                    >
                      <SelectTrigger className="w-32 h-8 text-xs">
                        <SelectValue placeholder="Update" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="withdrawn">Withdrawn</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No commissions yet</h3>
              <p className="text-gray-600">Commission records will appear here once affiliates earn them.</p>
            </div>
          ))}
        </div>
      </div>

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-md animate-scaleIn max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-blue-600" />
                Edit Commission Rate
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description (Optional)</Label>
                <Input
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-rate">Rate</Label>
                  <Input
                    id="edit-rate"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.rate}
                    onChange={(e) => setFormData(prev => ({ ...prev, rate: parseFloat(e.target.value) || 0 }))}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-type">Type</Label>
                  <Select value={formData.type} onValueChange={(value: 'percentage' | 'fixed') => setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Select value={formData.category} onValueChange={(value: 'product' | 'service' | 'referral' | 'general') => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={closeModals} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting || updateCommissionRate.isPending} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  {submitting || updateCommissionRate.isPending ? 'Updating...' : 'Update Rate'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
