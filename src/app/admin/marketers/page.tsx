'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useAllMarketers, useCreateMarketer, useUpdateMarketer, useDeleteMarketer } from '@/hooks/useMarketer';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
// Note: Table components not available, using basic HTML table instead
import { Badge } from '@/Components/ui/badge';
import { ArrowLeft, Plus, Edit, Trash2, Users, Mail, Phone, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function MarketersManagementPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingMarketer, setEditingMarketer] = useState<any>(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: ''
    });

    const { data: marketersData, isLoading } = useAllMarketers();
    const createMutation = useCreateMarketer();
    const updateMutation = useUpdateMarketer();
    const deleteMutation = useDeleteMarketer();

    const handleCreate = async () => {
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            await createMutation.mutateAsync(formData);
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
                    phone: formData.phone,
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

    const openEditDialog = (marketer: any) => {
        setEditingMarketer(marketer);
        setFormData({
            firstName: marketer.firstName,
            lastName: marketer.lastName,
            email: marketer.email,
            phone: marketer.phone || '',
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
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        value={formData.phone}
                                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                        placeholder="+1234567890"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="password">Password *</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                        placeholder="Enter password"
                                    />
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
                                        <tr key={marketer._id}>
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
                                                {marketer.phone ? (
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="w-4 h-4 text-gray-400" />
                                                        {marketer.phone}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge variant={marketer.isActive ? 'default' : 'secondary'}>
                                                    {marketer.isActive ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                    {new Date(marketer.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => openEditDialog(marketer)}
                                                        className="text-blue-600 hover:text-blue-700"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(marketer._id)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
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
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="editLastName">Last Name</Label>
                                        <Input
                                            id="editLastName"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
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
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="editPhone">Phone</Label>
                                    <Input
                                        id="editPhone"
                                        value={formData.phone}
                                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
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
            </div>
        </div>
    );
}