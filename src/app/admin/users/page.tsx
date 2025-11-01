/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { useAdminUser, useAdminUsers, useCreateAdminUser, useDeleteAdminUser, useUpdateAdminUser, useUpdateUserRole, useSuspendUser } from '@/hooks/useAdmin';
import { Edit, Eye, Filter, MoreHorizontal, Search, Trash2, UserCheck, UserPlus, X, Ban } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

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

  // Dialog states
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Form states
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: ''
  });
  const [newUserForm, setNewUserForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    role: 'user'
  });
  const [selectedRole, setSelectedRole] = useState('');

  const { data: usersData, isLoading } = useAdminUsers({ page, limit: 10 });
  const { data: userData } = useAdminUser(selectedUser?._id || '');
  const updateUserRoleMutation = useUpdateUserRole();
  const updateUserMutation = useUpdateAdminUser();
  const deleteUserMutation = useDeleteAdminUser();
  const createUserMutation = useCreateAdminUser();
  const suspendUserMutation = useSuspendUser();

  const users = usersData?.data || [];
  const pagination = usersData?.pagination || {};

  // Dialog handlers
  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setShowViewDialog(true);
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setEditForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'user'
    });
    setShowEditDialog(true);
  };

  const handleChangeRole = (user: any) => {
    setSelectedUser(user);
    setSelectedRole(user.role || 'user');
    setShowRoleDialog(true);
  };

  const handleDeleteUser = (user: any) => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
  };

  const handleSuspendUser = (user: any) => {
    setSelectedUser(user);
    setShowSuspendDialog(true);
  };

  const handleSaveEdit = () => {
    if (selectedUser) {
      updateUserMutation.mutate(
        { id: selectedUser._id, data: editForm as any },
        {
          onSuccess: () => {
            setShowEditDialog(false);
            setSelectedUser(null);
            toast.success('User updated successfully!');
          },
          onError: (error: any) => {
            toast.error(error?.response?.data?.message || error?.message || 'Failed to update user');
          }
        }
      );
    }
  };

  const handleSaveRole = () => {
    if (selectedUser) {
      updateUserRoleMutation.mutate(
        { id: selectedUser._id, role: selectedRole },
        {
          onSuccess: () => {
            setShowRoleDialog(false);
            setSelectedUser(null);
            toast.success('User role updated successfully!');
          },
          onError: (error: any) => {
            toast.error(error?.response?.data?.message || error?.message || 'Failed to update user role');
          }
        }
      );
    }
  };

  const handleConfirmDelete = () => {
    if (selectedUser) {
      deleteUserMutation.mutate(selectedUser._id, {
        onSuccess: () => {
          setShowDeleteDialog(false);
          setSelectedUser(null);
          toast.success('User deleted successfully!');
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || error?.message || 'Failed to delete user');
        }
      });
    }
  };

  const handleConfirmSuspend = () => {
    if (selectedUser) {
      suspendUserMutation.mutate({ id: selectedUser._id, suspended: !selectedUser.suspended }, {
        onSuccess: () => {
          setShowSuspendDialog(false);
          setSelectedUser(null);
          toast.success(`User ${selectedUser.suspended ? 'unsuspended' : 'suspended'} successfully!`);
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || error?.message || 'Failed to update user status');
        }
      });
    }
  };

  const handleAddUser = () => {
    createUserMutation.mutate(newUserForm, {
      onSuccess: () => {
        setShowAddDialog(false);
        setNewUserForm({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          password: '',
          role: 'user'
        });
        toast.success('User created successfully!');
        // The mutation will automatically invalidate queries and refresh the users list
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || error?.message || 'Failed to create user');
      }
    });
  };

  const filteredUsers = users.filter((user: { firstName: string; lastName: string; email: string; }) =>
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="destructive">Admin</Badge>;
      case 'affiliate':
        return <Badge variant="secondary">Affiliate</Badge>;
      case 'marketer':
        return <Badge className="bg-green-100 text-green-800">Marketer</Badge>;
      default:
        return <Badge variant="outline">Customer</Badge>;
    }
  };

  const getStatusBadge = (user: any) => {
    return user.suspended
      ? <Badge className="bg-red-100 text-red-800">Suspended</Badge>
      : <Badge className="bg-green-100 text-green-800">Active</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent animate-bounceIn">
                Users Management
              </h1>
              <p className="text-gray-600 mt-1 animate-fadeIn animation-delay-300">Manage user accounts and permissions</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all hover-lift animate-fadeIn animation-delay-500" onClick={() => setShowAddDialog(true)}>
              <UserPlus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">

        {/* Filters and Search */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl mb-6 animate-fadeIn animation-delay-700">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/50 border-gray-200"
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2 hover-lift">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl animate-fadeIn animation-delay-900">
          <CardHeader>
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Orders</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Total Spent</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Join Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user: any) => (
                  <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{`${user.firstName} ${user.lastName}`}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(user)}
                    </td>
                    <td className="py-4 px-4 text-gray-900">-</td>
                    <td className="py-4 px-4 text-gray-900">
                      -
                    </td>
                    <td className="py-4 px-4 text-gray-900">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="py-4 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className='cursor-pointer'>
                            <MoreHorizontal className="w-4 h-4 " />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewUser(user)} className='cursor-pointer'>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditUser(user)} className='cursor-pointer'>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleChangeRole(user)} className='cursor-pointer'>
                            <UserCheck className="w-4 h-4 mr-2" />
                            Change Role
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSuspendUser(user)} className='cursor-pointer'>
                            <Ban className="w-4 h-4 mr-2" />
                            {user.suspended ? 'Unsuspend User' : 'Suspend User'}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 cursor-pointer"
                            onClick={() => handleDeleteUser(user)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No users found matching your search.
            </div>
          )}
        </CardContent>
      </Card>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl animate-fadeIn animation-delay-1100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(prev => Math.max(1, prev - 1))}
                    disabled={pagination.page <= 1}
                    className="hover-lift"
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-700">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(prev => Math.min(pagination.pages, prev + 1))}
                    disabled={pagination.page >= pagination.pages}
                    className="hover-lift"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

      </div>

      {/* Add User Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-white rounded-lg p-6 w-full max-w-md animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add New User</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowAddDialog(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="new-firstName">First Name</Label>
                <Input
                  id="new-firstName"
                  value={newUserForm.firstName}
                  onChange={(e) => setNewUserForm(prev => ({ ...prev, firstName: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="new-lastName">Last Name</Label>
                <Input
                  id="new-lastName"
                  value={newUserForm.lastName}
                  onChange={(e) => setNewUserForm(prev => ({ ...prev, lastName: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="new-email">Email</Label>
                <Input
                  id="new-email"
                  type="email"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="new-phone">Phone Number</Label>
                <Input
                  id="new-phone"
                  type="tel"
                  value={newUserForm.phone}
                  onChange={(e) => setNewUserForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+234..."
                />
              </div>
              <div>
                <Label htmlFor="new-password">Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newUserForm.password}
                  onChange={(e) => setNewUserForm(prev => ({ ...prev, password: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="new-role">Role</Label>
                <select
                  id="new-role"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newUserForm.role}
                  onChange={(e) => setNewUserForm(prev => ({ ...prev, role: e.target.value }))}
                >
                  <option value="user">User</option>
                  <option value="affiliate">Affiliate</option>
                  <option value="marketer">Marketer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddUser}>
                Add User
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* View User Dialog */}
      {showViewDialog && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-white rounded-lg p-6 w-full max-w-md animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">User Details</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowViewDialog(false)} className='cursor-pointer'>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-xl">
                    {selectedUser.firstName?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <h4 className="font-semibold">{`${selectedUser.firstName} ${selectedUser.lastName}`}</h4>
                <p className="text-gray-600">{selectedUser.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Role</Label>
                  <div className="mt-1">{getRoleBadge(selectedUser.role)}</div>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedUser)}</div>
                </div>
                <div>
                  <Label>Join Date</Label>
                  <div className="mt-1 text-sm">
                    {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
                <div>
                  <Label>Last Login</Label>
                  <div className="mt-1 text-sm">
                    {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleDateString() : 'Never'}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button onClick={() => setShowViewDialog(false)} className='cursor-pointer'>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Dialog */}
      {showEditDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-white rounded-lg p-6 w-full max-w-md animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit User</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowEditDialog(false)}>
                <X className="w-4 h-4 cursor-pointer" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-firstName">First Name</Label>
                <Input
                  id="edit-firstName"
                  value={editForm.firstName}
                  onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="edit-lastName">Last Name</Label>
                <Input
                  id="edit-lastName"
                  value={editForm.lastName}
                  onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="edit-phone">Phone Number</Label>
                <Input
                  id="edit-phone"
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+234..."
                />
              </div>
              <div>
                <Label htmlFor="edit-role">Role</Label>
                <select
                  id="edit-role"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={editForm.role}
                  onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                >
                  <option value="user">User</option>
                  <option value="affiliate">Affiliate</option>
                  <option value="marketer">Marketer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button className='cursor-pointer' variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button className='cursor-pointer' onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Change Role Dialog */}
      {showRoleDialog && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-white rounded-lg p-6 w-full max-w-md animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Change User Role</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowRoleDialog(false)}>
                <X className="w-4 h-4 cursor-pointer" />
              </Button>
            </div>
            <div className="space-y-4">
              <p>Change role for <strong>{`${selectedUser.firstName} ${selectedUser.lastName}`}</strong></p>
              <div>
                <Label htmlFor="role-select">New Role</Label>
                <select
                  id="role-select"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="affiliate">Affiliate</option>
                  <option value="marketer">Marketer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowRoleDialog(false)} className='cursor-pointer'>
                Cancel
              </Button>
              <Button onClick={handleSaveRole} className='cursor-pointer'>
                Update Role
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend User Dialog */}
      {showSuspendDialog && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-white rounded-lg p-6 w-full max-w-md animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-orange-600">Suspend User</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowSuspendDialog(false)}>
                <X className="w-4 h-4 cursor-pointer" />
              </Button>
            </div>
            <div className="space-y-4">
              <p>Are you sure you want to {selectedUser.suspended ? 'unsuspend' : 'suspend'} <strong>{`${selectedUser.firstName} ${selectedUser.lastName}`}</strong>?</p>
              <p className="text-sm text-gray-600">The user will be {selectedUser.suspended ? 'restored to active status' : 'temporarily suspended from the platform'}.</p>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowSuspendDialog(false)} className='cursor-pointer'>
                Cancel
              </Button>
              <Button variant={selectedUser.suspended ? "default" : "destructive"} onClick={handleConfirmSuspend} className='cursor-pointer'>
                {selectedUser.suspended ? 'Unsuspend User' : 'Suspend User'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Dialog */}
      {showDeleteDialog && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-white rounded-lg p-6 w-full max-w-md animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-red-600">Delete User</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowDeleteDialog(false)}>
                <X className="w-4 h-4 cursor-pointer" />
              </Button>
            </div>
            <div className="space-y-4">
              <p>Are you sure you want to delete <strong>{`${selectedUser.firstName} ${selectedUser.lastName}`}</strong>?</p>
              <p className="text-sm text-gray-600">This action cannot be undone.</p>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)} className='cursor-pointer'>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete} className='cursor-pointer'>
                Delete User
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}