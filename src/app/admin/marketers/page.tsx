/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreHorizontal, Eye, Edit, UserCheck, Trash2, X, MapPin, Package, Truck, Phone, Clock, ClockIcon } from 'lucide-react';
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

export default function AdminMarketersPage() {
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

  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showOrdersDialog, setShowOrdersDialog] = useState(false);
  const [selectedMarketer, setSelectedMarketer] = useState<any>(null);

  // Form states
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: ''
  });

  // Mock data for marketers with orders
  const mockMarketers = [
    {
      _id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      role: 'marketer',
      emailVerified: true,
      phone: '+2348012345678',
      location: 'Lagos',
      activeOrders: 3,
      completedToday: 12,
      totalDeliveries: 245,
      rating: 4.8,
      joinDate: '2024-01-15',
      status: 'active',
      orders: [
        {
          _id: 'o1',
          orderNumber: 'ORD-2024-001',
          customerName: 'Alice Johnson',
          customerPhone: '+2349012345678',
          address: '123 Victoria Island, Lagos',
          status: 'pending',
          totalAmount: 2500,
          deliveryDate: '2024-10-22T14:00:00Z',
          items: [{ name: 'Sachet Water (24 pack)', quantity: 1 }]
        },
        {
          _id: 'o2',
          orderNumber: 'ORD-2024-002',
          customerName: 'Bob Smith',
          customerPhone: '+2349023456789',
          address: '456 Lekki Phase 1, Lagos',
          status: 'in_transit',
          totalAmount: 1800,
          deliveryDate: '2024-10-22T16:00:00Z',
          items: [{ name: 'Bottled Water (6 pack)', quantity: 1 }]
        },
        {
          _id: 'o3',
          orderNumber: 'ORD-2024-003',
          customerName: 'Carol Williams',
          customerPhone: '+2349034567890',
          address: '789 Ikeja GRA, Lagos',
          status: 'delivered',
          totalAmount: 3200,
          deliveryDate: '2024-10-22T10:00:00Z',
          items: [{ name: 'Bulk Dispenser Refill', quantity: 1 }]
        }
      ]
    },
    {
      _id: '2',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@example.com',
      role: 'marketer',
      emailVerified: true,
      phone: '+2348023456789',
      location: 'Abuja',
      activeOrders: 5,
      completedToday: 8,
      totalDeliveries: 189,
      rating: 4.6,
      joinDate: '2024-02-20',
      status: 'active',
      orders: [
        {
          _id: 'o4',
          orderNumber: 'ORD-2024-004',
          customerName: 'David Brown',
          customerPhone: '+2349045678901',
          address: '321 Wuse 2, Abuja',
          status: 'pending',
          totalAmount: 1500,
          deliveryDate: '2024-10-22T12:00:00Z',
          items: [{ name: 'Sachet Water (12 pack)', quantity: 1 }]
        },
        {
          _id: 'o5',
          orderNumber: 'ORD-2024-005',
          customerName: 'Emma Davis',
          customerPhone: '+2349056789012',
          address: '654 Maitama, Abuja',
          status: 'failed',
          totalAmount: 2800,
          deliveryDate: '2024-10-21T15:00:00Z', // Past date, not completed
          items: [{ name: 'Water Dispenser', quantity: 1 }]
        }
      ]
    },
    {
      _id: '3',
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'michael.brown@example.com',
      role: 'marketer',
      emailVerified: true,
      phone: '+2348034567890',
      location: 'Port Harcourt',
      activeOrders: 2,
      completedToday: 15,
      totalDeliveries: 312,
      rating: 4.9,
      joinDate: '2023-11-10',
      status: 'active',
      orders: [
        {
          _id: 'o6',
          orderNumber: 'ORD-2024-006',
          customerName: 'Frank Miller',
          customerPhone: '+2349067890123',
          address: '987 GRA Phase 2, Port Harcourt',
          status: 'delivered',
          totalAmount: 4200,
          deliveryDate: '2024-10-22T11:00:00Z',
          items: [{ name: 'Premium Dispenser Set', quantity: 1 }]
        }
      ]
    },
    {
      _id: '4',
      firstName: 'Emily',
      lastName: 'Davis',
      email: 'emily.davis@example.com',
      role: 'marketer',
      emailVerified: false,
      phone: '+2348045678901',
      location: 'Kano',
      activeOrders: 0,
      completedToday: 0,
      totalDeliveries: 67,
      rating: 4.2,
      joinDate: '2024-03-05',
      status: 'inactive',
      orders: []
    },
    {
      _id: '5',
      firstName: 'David',
      lastName: 'Wilson',
      email: 'david.wilson@example.com',
      role: 'marketer',
      emailVerified: true,
      phone: '+2348056789012',
      location: 'Ibadan',
      activeOrders: 4,
      completedToday: 10,
      totalDeliveries: 178,
      rating: 4.7,
      joinDate: '2024-01-28',
      status: 'active',
      orders: [
        {
          _id: 'o7',
          orderNumber: 'ORD-2024-007',
          customerName: 'Grace Taylor',
          customerPhone: '+2349078901234',
          address: '147 Bodija, Ibadan',
          status: 'pending',
          totalAmount: 1900,
          deliveryDate: '2024-10-22T13:00:00Z',
          items: [{ name: 'Family Water Pack', quantity: 1 }]
        },
        {
          _id: 'o8',
          orderNumber: 'ORD-2024-008',
          customerName: 'Henry Wilson',
          customerPhone: '+2349089012345',
          address: '258 Challenge, Ibadan',
          status: 'in_transit',
          totalAmount: 3600,
          deliveryDate: '2024-10-22T17:00:00Z',
          items: [{ name: 'Office Water Supply', quantity: 1 }]
        }
      ]
    },
    {
      _id: '6',
      firstName: 'Lisa',
      lastName: 'Garcia',
      email: 'lisa.garcia@example.com',
      role: 'marketer',
      emailVerified: true,
      phone: '+2348067890123',
      location: 'Enugu',
      activeOrders: 1,
      completedToday: 6,
      totalDeliveries: 134,
      rating: 4.5,
      joinDate: '2024-02-14',
      status: 'active',
      orders: [
        {
          _id: 'o9',
          orderNumber: 'ORD-2024-009',
          customerName: 'Isaac Anderson',
          customerPhone: '+2349090123456',
          address: '369 Independence Layout, Enugu',
          status: 'delivered',
          totalAmount: 2750,
          deliveryDate: '2024-10-22T09:00:00Z',
          items: [{ name: 'Home Delivery Package', quantity: 1 }]
        }
      ]
    }
  ];

  // Mock pagination
  const mockPagination = {
    page: 1,
    pages: 1,
    total: mockMarketers.length,
    limit: 10
  };

  // Use mock data instead of API
  const marketers = mockMarketers;
  const pagination = mockPagination;
  const isLoading = false;

  // Mock mutations (no-op for now)
  const updateUserRoleMutation = { mutate: () => {} };
  const updateUserMutation = { mutate: (p0: { id: any; data: any; }, p1: { onSuccess: () => void; }) => {} };
  const deleteUserMutation = { mutate: () => {} };

  // Dialog handlers
  const handleViewMarketer = (marketer: any) => {
    setSelectedMarketer(marketer);
    setShowViewDialog(true);
  };

  const handleViewOrders = (marketer: any) => {
    setSelectedMarketer(marketer);
    setShowOrdersDialog(true);
  };

  const handleEditMarketer = (marketer: any) => {
    setSelectedMarketer(marketer);
    setEditForm({
      firstName: marketer.firstName || '',
      lastName: marketer.lastName || '',
      email: marketer.email || '',
      role: marketer.role || 'marketer'
    });
    setShowEditDialog(true);
  };


  const handleSaveEdit = () => {
    if (selectedMarketer) {
      updateUserMutation.mutate(
        { id: selectedMarketer._id, data: editForm as any },
        {
          onSuccess: () => {
            setShowEditDialog(false);
            setSelectedMarketer(null);
          }
        }
      );
    }
  };

  const filteredMarketers = marketers.filter((marketer: { firstName: string; lastName: string; email: string; }) =>
    marketer.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    marketer.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    marketer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-2xl font-bold text-gray-900">Marketers Management</h1>
          <p className="text-gray-600">Manage delivery marketers and their assignments</p>
        </div>
      </div>

        {/* Filters and Search */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl mb-6 animate-fadeIn animation-delay-700">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search marketers..."
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

      {/* Marketers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Marketers ({filteredMarketers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Marketer</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Active Orders</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Completed Today</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Location</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMarketers.map((marketer: any) => (
                  <tr key={marketer._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{`${marketer.firstName} ${marketer.lastName}`}</div>
                        <div className="text-sm text-gray-500">{marketer.email}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(marketer.emailVerified ? 'active' : 'inactive')}
                    </td>
                    <td className="py-4 px-4 text-gray-900">
                      <Badge variant="outline">{marketer.activeOrders}</Badge>
                    </td>
                    <td className="py-4 px-4 text-gray-900">
                      <Badge className="bg-green-100 text-green-800">{marketer.completedToday}</Badge>
                    </td>
                    <td className="py-4 px-4 text-gray-900">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{marketer.location}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className='cursor-pointer'>
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewMarketer(marketer)} className='cursor-pointer'>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleViewOrders(marketer)} className='cursor-pointer'>
                            <Package className="w-4 h-4 mr-2" />
                            View Orders
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditMarketer(marketer)} className='cursor-pointer'>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Marketer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredMarketers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No marketers found matching your search.
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
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} marketers
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


      {/* View Marketer Dialog */}
      {showViewDialog && selectedMarketer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-white rounded-lg p-6 w-full max-w-md animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Marketer Details</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowViewDialog(false)} className='cursor-pointer'>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-xl">
                    {selectedMarketer.firstName?.charAt(0)?.toUpperCase() || 'M'}
                  </span>
                </div>
                <h4 className="font-semibold">{`${selectedMarketer.firstName} ${selectedMarketer.lastName}`}</h4>
                <p className="text-gray-600">{selectedMarketer.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedMarketer.emailVerified ? 'active' : 'inactive')}</div>
                </div>
                <div>
                  <Label>Active Orders</Label>
                  <div className="mt-1">
                    <Badge variant="outline">{selectedMarketer.activeOrders}</Badge>
                  </div>
                </div>
                <div>
                  <Label>Completed Today</Label>
                  <div className="mt-1">
                    <Badge className="bg-green-100 text-green-800">{selectedMarketer.completedToday}</Badge>
                  </div>
                </div>
                <div>
                  <Label>Location</Label>
                  <div className="mt-1 text-sm">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {selectedMarketer.location}, Nigeria
                    </div>
                  </div>
                </div>
                <div>
                  <Label>Total Deliveries</Label>
                  <div className="mt-1">
                    <Badge variant="secondary">{selectedMarketer.totalDeliveries}</Badge>
                  </div>
                </div>
                <div>
                  <Label>Rating</Label>
                  <div className="mt-1">
                    <Badge className="bg-yellow-100 text-yellow-800">⭐ {selectedMarketer.rating}</Badge>
                  </div>
                </div>
                <div>
                  <Label>Join Date</Label>
                  <div className="mt-1 text-sm text-gray-600">
                    {new Date(selectedMarketer.joinDate).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <Label>Phone</Label>
                  <div className="mt-1 text-sm text-gray-600">
                    {selectedMarketer.phone}
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

      {/* Edit Marketer Dialog */}
      {showEditDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-white rounded-lg p-6 w-full max-w-md animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Marketer</h3>
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

      {/* View Orders Dialog */}
      {showOrdersDialog && selectedMarketer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-semibold">Orders for {selectedMarketer.firstName} {selectedMarketer.lastName}</h3>
                <p className="text-gray-600 text-sm">{selectedMarketer.location}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowOrdersDialog(false)} className='cursor-pointer'>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Orders Summary */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <Card className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{selectedMarketer.orders?.filter((o: any) => o.status === 'pending').length || 0}</div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedMarketer.orders?.filter((o: any) => o.status === 'in_transit').length || 0}</div>
                  <div className="text-sm text-gray-600">In Transit</div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{selectedMarketer.orders?.filter((o: any) => o.status === 'delivered').length || 0}</div>
                  <div className="text-sm text-gray-600">Delivered</div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{selectedMarketer.orders?.filter((o: any) => o.status === 'failed').length || 0}</div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
              </Card>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {selectedMarketer.orders && selectedMarketer.orders.length > 0 ? (
                selectedMarketer.orders.map((order: any) => {
                  const deliveryDate = new Date(order.deliveryDate);
                  const now = new Date();
                  const isOverdue = deliveryDate < now && order.status !== 'delivered';
                  const isFailed = order.status === 'failed' || (isOverdue && order.status !== 'delivered');

                  return (
                    <Card key={order._id} className={`p-4 ${isFailed ? 'border-red-200 bg-red-50' : ''}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-gray-900">{order.orderNumber}</h4>
                            <Badge
                              variant={order.status === 'delivered' ? 'default' : order.status === 'failed' ? 'destructive' : 'secondary'}
                              className={
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                order.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }
                            >
                              {order.status === 'failed' ? 'Failed' :
                               isFailed ? 'Overdue' :
                               order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('_', ' ')}
                            </Badge>
                            {isFailed && (
                              <Badge variant="destructive" className="ml-2">
                                Delivery Failed
                              </Badge>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            <div>
                              <p className="text-sm font-medium text-gray-700">{order.customerName}</p>
                              <p className="text-sm text-gray-600 flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {order.customerPhone}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {order.address}
                              </p>
                              <p className="text-sm text-gray-600">Total: ₦{order.totalAmount.toLocaleString()}</p>
                            </div>
                          </div>

                          <div className="mb-3">
                            <p className="text-sm font-medium text-gray-700 mb-1">Items:</p>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {order.items.map((item: any, index: number) => (
                                <li key={index} className="flex items-center gap-1">
                                  <Package className="w-3 h-3" />
                                  {item.name} (x{item.quantity})
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="flex items-center gap-4 text-sm">
                            <div className={`flex items-center gap-1 ${isOverdue && order.status !== 'delivered' ? 'text-red-600' : 'text-gray-600'}`}>
                              <ClockIcon  className="w-3 h-3" />
                              Delivery: {deliveryDate.toLocaleString()}
                            </div>
                            {isOverdue && order.status !== 'delivered' && (
                              <Badge variant="destructive" className="text-xs">
                                Overdue
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })
              ) : (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No orders assigned</h3>
                  <p className="text-gray-600">This marketer hasn't been assigned any orders yet.</p>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <Button onClick={() => setShowOrdersDialog(false)} className='cursor-pointer'>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}