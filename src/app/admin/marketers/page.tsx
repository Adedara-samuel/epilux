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
// Note: Table components not available, using basic HTML table instead
import { Badge } from '@/Components/ui/badge';
import { ArrowLeft, Plus, Edit, Trash2, Users, Mail, Phone, Calendar, Eye, EyeOff, Ban, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

export default function MarketersManagementPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingMarketer, setEditingMarketer] = useState<any>(null);
    const [selectedMarketer, setSelectedMarketer] = useState<any>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showSuspendDialog, setShowSuspendDialog] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: ''
    });

    const { data: usersData, isLoading } = useAdminUsers();
    const marketersData = usersData ? { data: usersData.data.filter((user: any) => user.role === 'marketer') } : { data: [] };
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
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Button
                        variant="outline"
                        onClick={() => router.push('/admin')}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Admin
                    </Button>
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900">Marketers Management</h1>
                        <p className="text-gray-600 mt-2">Manage affiliate marketers and their accounts</p>
                    </div>
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Add Marketer
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Marketer</DialogTitle>
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

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">
                            {marketersData?.data?.length || 0}
                        </h3>
                        <p className="text-gray-600">Total Marketers</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <Users className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">
                            {marketersData?.data?.filter((m: any) => m.isActive).length || 0}
                        </h3>
                        <p className="text-gray-600">Active Marketers</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <Users className="w-6 h-6 text-yellow-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">
                            {marketersData?.data?.filter((m: any) => !m.isActive).length || 0}
                        </h3>
                        <p className="text-gray-600">Inactive Marketers</p>
                    </div>
                </div>

                {/* Marketers Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900">All Marketers</h2>
                        <p className="text-gray-600 mt-1">Manage your affiliate marketers</p>
                    </div>

                    {isLoading ? (
                        <div className="p-12 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="text-gray-600 mt-4">Loading marketers...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {marketersData?.data?.map((marketer: any) => (
                                        <tr key={marketer._id} onClick={() => setSelectedMarketer(marketer)} className="cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {marketer.firstName} {marketer.lastName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4 text-gray-400" />
                                                    {marketer.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {marketer.profile?.phone ? (
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="w-4 h-4 text-gray-400" />
                                                        {marketer.profile.phone}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge variant={marketer.suspended ? 'destructive' : marketer.isActive ? 'default' : 'secondary'}>
                                                    {marketer.suspended ? 'Suspended' : marketer.isActive ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                    {new Date(marketer.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="cursor-pointer"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openEditDialog(marketer);
                                                            }}
                                                            className="cursor-pointer"
                                                        >
                                                            <Edit className="w-4 h-4 mr-2" />
                                                            Edit Marketer
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openSuspendDialog(marketer);
                                                            }}
                                                            className="cursor-pointer"
                                                        >
                                                            <Ban className="w-4 h-4 mr-2" />
                                                            {marketer.suspended ? 'Unsuspend Marketer' : 'Suspend Marketer'}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDelete(marketer._id);
                                                            }}
                                                            className="text-red-600 cursor-pointer"
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-2" />
                                                            Delete Marketer
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {marketersData?.data?.length === 0 && !isLoading && (
                        <div className="p-12 text-center">
                            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No marketers yet</h3>
                            <p className="text-gray-600">Get started by adding your first affiliate marketer.</p>
                        </div>
                    )}
                </div>

                {/* Edit Dialog */}
                {editingMarketer && (
                    <Dialog open={!!editingMarketer} onOpenChange={() => setEditingMarketer(null)}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Marketer</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                     <div>
                                         <Label htmlFor="editFirstName">First Name</Label>
                                         <Input
                                             id="editFirstName"
                                             value={formData.firstName}
                                             onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                                             autoComplete="off"
                                         />
                                     </div>
                                     <div>
                                         <Label htmlFor="editLastName">Last Name</Label>
                                         <Input
                                             id="editLastName"
                                             value={formData.lastName}
                                             onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                                             autoComplete="off"
                                         />
                                     </div>
                                 </div>
                                 <div>
                                     <Label htmlFor="editEmail">Email</Label>
                                     <Input
                                         id="editEmail"
                                         type="email"
                                         value={formData.email}
                                         onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                         autoComplete="off"
                                     />
                                 </div>
                                 <div>
                                     <Label htmlFor="editPhone">Phone</Label>
                                     <Input
                                         id="editPhone"
                                         value={formData.phone}
                                         onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                         autoComplete="off"
                                     />
                                 </div>
                                 <div className="flex items-center gap-2">
                                     <input
                                         type="checkbox"
                                         id="isActive"
                                         checked={editingMarketer.isActive}
                                         onChange={(e: any) => setEditingMarketer((prev: any) => ({ ...prev, isActive: e.target.checked }))}
                                     />
                                     <Label htmlFor="isActive">Active</Label>
                                 </div>
                                 <div className="flex justify-end gap-2">
                                     <Button variant="outline" onClick={() => setEditingMarketer(null)}>
                                         Cancel
                                     </Button>
                                     <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
                                         {updateMutation.isPending ? 'Updating...' : 'Update'}
                                     </Button>
                                 </div>
                             </div>
                         </DialogContent>
                     </Dialog>
                 )}

                {/* Marketer Details Dialog */}
                {selectedMarketer && (
                    <Dialog open={!!selectedMarketer} onOpenChange={() => setSelectedMarketer(null)}>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="text-2xl">Marketer Details: {selectedMarketer.firstName} {selectedMarketer.lastName}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6">
                                {/* Basic Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Basic Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Email</p>
                                            <p className="font-medium">{selectedMarketer.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Phone</p>
                                            <p className="font-medium">{selectedMarketer.profile?.phone || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Status</p>
                                            <Badge variant={selectedMarketer.isActive ? 'default' : 'secondary'}>
                                                {selectedMarketer.isActive ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Joined</p>
                                            <p className="font-medium">{new Date(selectedMarketer.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Last Login</p>
                                            <p className="font-medium">{selectedMarketer.lastLogin ? new Date(selectedMarketer.lastLogin).toLocaleString() : 'Never'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Referral Code</p>
                                            <p className="font-medium">{selectedMarketer.referralCode || 'N/A'}</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Orders Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Orders Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Assigned Orders</p>
                                            <p className="text-2xl font-bold text-blue-600">{selectedMarketer.assignedOrdersCount || 0}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Completed Orders</p>
                                            <p className="text-2xl font-bold text-green-600">{selectedMarketer.completedOrdersCount || 0}</p>
                                        </div>
                                    </CardContent>
                                </Card>


                                {/* Stats */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Performance Stats</CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Total Referrals</p>
                                            <p className="text-xl font-bold text-indigo-600">{selectedMarketer.stats?.totalReferrals || 0}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Active Referrals</p>
                                            <p className="text-xl font-bold text-green-600">{selectedMarketer.stats?.activeReferrals || 0}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Total Commission Earned</p>
                                            <p className="text-xl font-bold text-purple-600">₦{(selectedMarketer.stats?.totalCommissionEarned || 0).toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Total Withdrawn</p>
                                            <p className="text-xl font-bold text-red-600">₦{(selectedMarketer.stats?.totalWithdrawn || 0).toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Commission Share Active</p>
                                            <Badge variant={selectedMarketer.stats?.commissionShareActive ? 'default' : 'secondary'}>
                                                {selectedMarketer.stats?.commissionShareActive ? 'Yes' : 'No'}
                                            </Badge>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Rating</p>
                                            <p className="text-xl font-bold text-yellow-600">{selectedMarketer.rating || 0}/5</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Referrals */}
                                {selectedMarketer.referrals && selectedMarketer.referrals.length > 0 && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Recent Referrals</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                {selectedMarketer.referrals.slice(0, 5).map((referral: any, index: number) => (
                                                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                                        <span>{referral.name || `Referral ${index + 1}`}</span>
                                                        <span className="text-sm text-gray-600">{new Date(referral.date).toLocaleDateString()}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>
                )}

                {/* Suspend Marketer Dialog */}
                {showSuspendDialog && selectedMarketer && (
                    <Dialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="text-orange-600">
                                    {selectedMarketer.suspended ? 'Unsuspend' : 'Suspend'} Marketer
                                </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <p>
                                    Are you sure you want to {selectedMarketer.suspended ? 'unsuspend' : 'suspend'}{' '}
                                    <strong>{selectedMarketer.firstName} {selectedMarketer.lastName}</strong>?
                                </p>
                                <p className="text-sm text-gray-600">
                                    The marketer will be {selectedMarketer.suspended ? 'restored to active status' : 'temporarily suspended from the platform'}.
                                </p>
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <Button variant="outline" onClick={() => setShowSuspendDialog(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    variant={selectedMarketer.suspended ? "default" : "destructive"}
                                    onClick={handleSuspend}
                                    disabled={suspendMutation.isPending}
                                >
                                    {suspendMutation.isPending ? 'Processing...' : (selectedMarketer.suspended ? 'Unsuspend' : 'Suspend')} Marketer
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </div>
    );
}