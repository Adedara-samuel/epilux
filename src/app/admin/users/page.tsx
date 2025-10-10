/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import { Search, Filter, MoreHorizontal, UserPlus, Eye, Edit, UserCheck, Trash2, X } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Label } from '@/Components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { useAdminUsers, useAdminUser, useUpdateUserRole, useUpdateAdminUser, useDeleteAdminUser } from '@/hooks/useAdmin';

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  // Dialog states
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Form states
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: ''
  });
  const [newUserForm, setNewUserForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [selectedRole, setSelectedRole] = useState('');

  const { data: usersData, isLoading } = useAdminUsers({ page, limit: 10 });
  const { data: userData } = useAdminUser(selectedUser?._id || '');
  const updateUserRoleMutation = useUpdateUserRole();
  const updateUserMutation = useUpdateAdminUser();
  const deleteUserMutation = useDeleteAdminUser();

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

  const handleSaveEdit = () => {
    if (selectedUser) {
      updateUserMutation.mutate(
        { id: selectedUser._id, data: editForm as any },
        {
          onSuccess: () => {
            setShowEditDialog(false);
            setSelectedUser(null);
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
        }
      });
    }
  };

  const handleAddUser = () => {
    // For now, just close dialog. In real app, would call create user API
    setShowAddDialog(false);
    setNewUserForm({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'user'
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
      default:
        return <Badge variant="outline">Customer</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'active'
      ? <Badge className="bg-green-100 text-green-800">Active</Badge>
      : <Badge variant="secondary">Inactive</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>
        <Button className="flex items-center gap-2 cursor-pointer" onClick={() => setShowAddDialog(true)}>
          <UserPlus className="w-4 h-4" />
          Add User
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
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
                      {getStatusBadge(user.emailVerified ? 'active' : 'inactive')}
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
                          <DropdownMenuItem onClick={() => handleViewUser(user)}className='cursor-pointer'>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditUser(user)}className='cursor-pointer'>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleChangeRole(user)}className='cursor-pointer'>
                            <UserCheck className="w-4 h-4 mr-2" />
                            Change Role
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
        <Card>
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
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
                  <div className="mt-1">{getStatusBadge(selectedUser.emailVerified ? 'active' : 'inactive')}</div>
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
                <Label htmlFor="edit-role">Role</Label>
                <select
                  id="edit-role"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={editForm.role}
                  onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                >
                  <option value="user">User</option>
                  <option value="affiliate">Affiliate</option>
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