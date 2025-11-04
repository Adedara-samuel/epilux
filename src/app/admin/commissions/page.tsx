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
import { useCommissions, useCommissionRates, useCreateCommissionRate, useUpdateCommissionRate, useDeleteCommissionRate, useUpdateCommissionStatus } from '@/hooks/useCommissions';
import { Commission } from '@/services/commissions';

import { CommissionRate } from '@/services/commissions';

export default function CommissionRatesPage() {
   const { user } = useAuth();
   const currentUser = user;
  const { data: commissionsData, isLoading: commissionsLoading } = useCommissions();
  const { data: commissionRatesData, isLoading: ratesLoading } = useCommissionRates();
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
        await createCommissionRate.mutateAsync(formData);
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
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent animate-bounceIn">
                Commission Rates Management
              </h1>
              <p className="text-gray-600 mt-1 animate-fadeIn animation-delay-300">Manage affiliate commission rates and settings</p>
            </div>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all hover-lift animate-fadeIn animation-delay-500">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Commission Rate
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md animate-scaleIn z-1000 sm:rounded-lg">
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
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Live Commissions Section */}
      {/* Live Commissions Section */}
      <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm mb-8">
        <CardHeader>
          <CardTitle>Live Commissions</CardTitle>
        </CardHeader>
        <CardContent>
          {commissionsLoading ? (
            <div className="py-6 text-sm text-gray-600">Loading commissions...</div>
          ) : (commissionsData?.commissions?.length ? (
            <div className="space-y-3">
              {commissionsData.commissions.slice(0, 10).map((c: Commission) => (
                <div key={c._id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="text-sm">
                    <div className="font-semibold">₦{(c.amount || 0).toLocaleString()}</div>
                    <div className="text-gray-600">{new Date(c.createdAt).toLocaleString()}</div>
                    {c.user && (
                      <div className="text-xs text-blue-600">{c.user.firstName} {c.user.lastName}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">{c.status}</Badge>
                    <Select
                      onValueChange={(value) => updateCommissionStatus.mutate({ id: c._id, status: value as Commission['status'] })}
                      disabled={updateCommissionStatus.isPending}
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue placeholder="Change status" />
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
            <div className="py-6 text-sm text-gray-600">No commissions found.</div>
          ))}
        </CardContent>
      </Card>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-fadeIn animation-delay-700">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Rates</p>
                  <p className="text-2xl font-bold text-gray-900">{commissionRates.length}</p>
                </div>
                <Percent className="w-8 h-8 text-blue-600 animate-pulse" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Rates</p>
                  <p className="text-2xl font-bold text-green-600">{commissionRates.filter(r => r.isActive).length}</p>
                </div>
                <ToggleRight className="w-8 h-8 text-green-600 animate-pulse" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Inactive Rates</p>
                  <p className="text-2xl font-bold text-red-600">{commissionRates.filter(r => !r.isActive).length}</p>
                </div>
                <ToggleLeft className="w-8 h-8 text-red-600 animate-pulse" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Rate</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {commissionRates.length > 0
                      ? (commissionRates.reduce((sum, r) => sum + r.rate, 0) / commissionRates.length).toFixed(1)
                      : '0'
                    }%
                  </p>
                </div>
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-purple-600 font-bold text-sm">%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl mb-6 animate-fadeIn animation-delay-900">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search commission rates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/50 border-gray-200"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-48 bg-white/50">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48 bg-white/50">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Commission Rates List */}
        <div className="space-y-4">
          {loading || ratesLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredRates.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-12 text-center">
                <Percent className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Commission Rates Found</h3>
                <p className="text-gray-600 mb-6">Get started by creating your first commission rate.</p>
                <Button onClick={() => setIsCreateModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Rate
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredRates.map((rate, index) => (
              <Card key={rate._id} className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover-glow animate-fadeIn" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{rate.name}</h3>
                        <Badge variant={rate.isActive ? "default" : "secondary"} className={rate.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {rate.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {rate.category}
                        </Badge>
                      </div>
                      {rate.description && (
                        <p className="text-gray-600 mb-3">{rate.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Rate: <strong className="text-gray-900">{rate.rate}{rate.type === 'percentage' ? '%' : '₦'}</strong></span>
                        <span>Type: <strong className="text-gray-900 capitalize">{rate.type}</strong></span>
                        <span>Created: <strong className="text-gray-900">{new Date(rate.createdAt).toLocaleDateString()}</strong></span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(rate)}
                        className={`hover-lift ${rate.isActive ? 'text-green-600 hover:text-green-700' : 'text-red-600 hover:text-red-700'}`}
                      >
                        {rate.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="hover-lift">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditModal(rate)} className="cursor-pointer">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(rate)}
                            className="cursor-pointer text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-md animate-scaleIn">
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