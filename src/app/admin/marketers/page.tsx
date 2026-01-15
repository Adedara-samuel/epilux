'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useAdminUsers, useCreateAdminUser, useUpdateAdminUser, useDeleteAdminUser, useSuspendUser } from '@/hooks/useAdmin';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/Components/ui/dropdown-menu';
import { Badge } from '@/Components/ui/badge';
import { ArrowLeft, Plus, Edit, Trash2, Users, Mail, Phone, Calendar, Eye, EyeOff, Ban, MoreHorizontal, Search, Filter, Star, TrendingUp, UserCheck, UserX, DollarSign, Activity } from 'lucide-react';
import { toast } from 'sonner';

export default function MarketersManagementPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingMarketer, setEditingMarketer] = useState<any>(null);
    const [selectedMarketer, setSelectedMarketer] = useState<any>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showSuspendDialog, setShowSuspendDialog] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: ''
    });

    const { data: usersData, isLoading } = useAdminUsers();
    const allMarketers = usersData ? usersData.data.filter((user: any) => user.role === 'marketer') : [];

    // Filter marketers based on search and status
    const filteredMarketers = allMarketers.filter((marketer: any) => {
        const matchesSearch = searchQuery === '' ||
            `${marketer.firstName} ${marketer.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            marketer.email.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
            statusFilter === 'all' ||
            (statusFilter === 'active' && marketer.isActive && !marketer.suspended) ||
            (statusFilter === 'inactive' && !marketer.isActive) ||
            (statusFilter === 'suspended' && marketer.suspended);

        return matchesSearch && matchesStatus;
    });

    const marketersData = { data: filteredMarketers };
    const createMutation = useCreateAdminUser();
    const updateMutation = useUpdateAdminUser();
    const deleteMutation = useDeleteAdminUser();
    const suspendMutation = useSuspendUser();

    const handleCreate = async () => {
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            await createMutation.mutateAsync({ ...formData, role: 'marketer' });
            setIsCreateDialogOpen(false);
            setFormData({ firstName: '', lastName: '', email: '', phone: '', password: '' });
            toast.success('Marketer created successfully');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create marketer');
        }
    };

    const handleUpdate = async () => {
        if (!editingMarketer) return;

        try {
            await updateMutation.mutateAsync({
                id: editingMarketer._id,
                data: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    isActive: editingMarketer.isActive
                }
            });
            setEditingMarketer(null);
            setFormData({ firstName: '', lastName: '', email: '', phone: '', password: '' });
            toast.success('Marketer updated successfully');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update marketer');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this marketer?')) return;

        try {
            await deleteMutation.mutateAsync(id);
            toast.success('Marketer deleted successfully');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete marketer');
        }
    };

    const handleSuspend = async () => {
        if (!selectedMarketer) return;

        try {
            await suspendMutation.mutateAsync({
                id: selectedMarketer._id,
                suspended: !selectedMarketer.suspended
            });
            setShowSuspendDialog(false);
            setSelectedMarketer(null);
            toast.success(`Marketer ${selectedMarketer.suspended ? 'unsuspended' : 'suspended'} successfully`);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update marketer status');
        }
    };

    const openSuspendDialog = (marketer: any) => {
        setSelectedMarketer(marketer);
        setShowSuspendDialog(true);
    };

    const openEditDialog = (marketer: any) => {
        setEditingMarketer(marketer);
        setFormData({
            firstName: marketer.firstName,
            lastName: marketer.lastName,
            email: marketer.email,
            phone: marketer.profile?.phone || '',
            password: ''
        });
    };

    if (!user || user.role !== 'admin') {
        router.push('/login');
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            {/* App-like Header */}
            <div className="sticky top-16 lg:top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
                <div className="px-4 lg:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => router.push('/admin')}
                                className="lg:hidden rounded-full hover:bg-gray-100"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <div>
                                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Marketers
                                </h1>
                                <p className="text-sm text-gray-600 hidden sm:block">Manage your affiliate team</p>
                            </div>
                        </div>

                        {/* Desktop Add Button */}
                        <Button
                            onClick={() => setIsCreateDialogOpen(true)}
                            className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                        >
                            <Plus className="h-4 w-4" />
                            Add Marketer
                        </Button>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="mt-4 flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Search marketers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 rounded-full border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="rounded-full border-gray-200">
                                    <Filter className="h-4 w-4 mr-2" />
                                    {statusFilter === 'all' ? 'All Status' :
                                     statusFilter === 'active' ? 'Active' :
                                     statusFilter === 'inactive' ? 'Inactive' : 'Suspended'}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl">
                                <DropdownMenuItem onClick={() => setStatusFilter('all')} className="rounded-lg">
                                    All Status
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter('active')} className="rounded-lg">
                                    Active
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter('inactive')} className="rounded-lg">
                                    Inactive
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter('suspended')} className="rounded-lg">
                                    Suspended
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
            </div>
            <div className="container mx-auto px-4 lg:px-6 py-6">
                {/* Enhanced Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm font-medium">Total</p>
                                    <p className="text-2xl font-bold">{allMarketers.length}</p>
                                </div>
                                <Users className="h-8 w-8 text-blue-200" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm font-medium">Active</p>
                                    <p className="text-2xl font-bold">{allMarketers.filter((m: any) => m.isActive && !m.suspended).length}</p>
                                </div>
                                <UserCheck className="h-8 w-8 text-green-200" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-yellow-100 text-sm font-medium">Inactive</p>
                                    <p className="text-2xl font-bold">{allMarketers.filter((m: any) => !m.isActive).length}</p>
                                </div>
                                <UserX className="h-8 w-8 text-yellow-200" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-sm font-medium">Suspended</p>
                                    <p className="text-2xl font-bold">{allMarketers.filter((m: any) => m.suspended).length}</p>
                                </div>
                                <Ban className="h-8 w-8 text-purple-200" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Marketers Grid/List */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading marketers...</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {marketersData.data.map((marketer: any) => (
                            <Card
                                key={marketer._id}
                                className="bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
                                onClick={() => setSelectedMarketer(marketer)}
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                                <span className="text-white font-bold text-lg">
                                                    {marketer.firstName?.charAt(0)?.toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                    {marketer.firstName} {marketer.lastName}
                                                </h3>
                                                <p className="text-sm text-gray-500">{marketer.email}</p>
                                            </div>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl">
                                                <DropdownMenuItem
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openEditDialog(marketer);
                                                    }}
                                                    className="rounded-lg cursor-pointer"
                                                >
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openSuspendDialog(marketer);
                                                    }}
                                                    className="rounded-lg cursor-pointer"
                                                >
                                                    <Ban className="w-4 h-4 mr-2" />
                                                    {marketer.suspended ? 'Unsuspend' : 'Suspend'}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(marketer._id);
                                                    }}
                                                    className="text-red-600 rounded-lg cursor-pointer"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Status</span>
                                            <Badge
                                                variant={marketer.suspended ? 'destructive' : marketer.isActive ? 'default' : 'secondary'}
                                                className="rounded-full"
                                            >
                                                {marketer.suspended ? 'Suspended' : marketer.isActive ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </div>

                                        {marketer.profile?.phone && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Phone className="w-4 h-4" />
                                                {marketer.profile.phone}
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar className="w-4 h-4" />
                                            Joined {new Date(marketer.createdAt).toLocaleDateString()}
                                        </div>

                                        <div className="pt-3 border-t border-gray-100">
                                            <div className="grid grid-cols-2 gap-4 text-center">
                                                <div>
                                                    <p className="text-lg font-semibold text-blue-600">
                                                        {marketer.stats?.totalReferrals || 0}
                                                    </p>
                                                    <p className="text-xs text-gray-500">Referrals</p>
                                                </div>
                                                <div>
                                                    <p className="text-lg font-semibold text-green-600">
                                                        ₦{(marketer.stats?.totalCommissionEarned || 0).toLocaleString()}
                                                    </p>
                                                    <p className="text-xs text-gray-500">Commission</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {marketersData.data.length === 0 && !isLoading && (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {searchQuery || statusFilter !== 'all' ? 'No marketers found' : 'No marketers yet'}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {searchQuery || statusFilter !== 'all'
                                ? 'Try adjusting your search or filter criteria'
                                : 'Get started by adding your first affiliate marketer'
                            }
                        </p>
                        {(!searchQuery && statusFilter === 'all') && (
                            <Button
                                onClick={() => setIsCreateDialogOpen(true)}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add First Marketer
                            </Button>
                        )}
                    </div>
                )}

                {/* Floating Action Button for Mobile */}
                <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="fixed bottom-24 right-6 lg:hidden w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl hover:shadow-3xl transition-all duration-300 z-40"
                    size="icon"
                >
                    <Plus className="h-6 w-6" />
                </Button>

                {/* Create Dialog */}
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogContent className="sm:max-w-md rounded-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Add New Marketer
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="firstName">First Name *</Label>
                                        <Input
                                            id="firstName"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                                            placeholder="John"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="lastName">Last Name *</Label>
                                        <Input
                                            id="lastName"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                        placeholder="john.doe@example.com"
                                        autoComplete="off"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        value={formData.phone}
                                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                        placeholder="+1234567890"
                                        autoComplete="off"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="password">Password *</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password}
                                            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                            placeholder="Enter password"
                                            autoComplete="new-password"
                                            className="pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleCreate} disabled={createMutation.isPending}>
                                        {createMutation.isPending ? 'Creating...' : 'Create'}
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

            </div>
        </div>
    );
}