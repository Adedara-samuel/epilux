'use client';

import { useState } from 'react';
import { MapPin, Package, Truck, CheckCircle, Clock, Navigation, Phone, MessageSquare, Search, Filter, User, Eye, EyeOff, Key, Settings } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useMarketerOrders, useUpdateOrderStatus, useMarketerStats } from '@/hooks/useMarketer';
import GoogleMap from '@/Components/GoogleMap';
import { Order } from '@/services/marketer';

export default function MarketerPage() {
  const { user } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showDirections, setShowDirections] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'profile'>('dashboard');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // API hooks
  const { data: ordersData, isLoading } = useMarketerOrders({
    search: searchTerm || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  });
  const { data: statsData } = useMarketerStats();
  const updateOrderStatusMutation = useUpdateOrderStatus();

  const orders = ordersData?.data || [];
  const stats = statsData?.data || {
    totalOrders: 0,
    pendingOrders: 0,
    inTransitOrders: 0,
    deliveredOrders: 0,
  };

  const handleMarkDelivered = (orderId: string) => {
    updateOrderStatusMutation.mutate({ id: orderId, status: 'delivered' });
  };

  const handleStartDelivery = (orderId: string) => {
    updateOrderStatusMutation.mutate({ id: orderId, status: 'in_transit' });
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pending</Badge>;
      case 'in_transit':
        return <Badge className="bg-blue-100 text-blue-800">In Transit</Badge>;
      case 'delivered':
        return <Badge className="bg-green-100 text-green-800">Delivered</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'in_transit':
        return <Truck className="w-4 h-4 text-blue-600" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Package className="w-4 h-4 text-gray-600" />;
    }
  };

  const pendingOrders = orders.filter((order: Order) => order.status === 'pending');
  const inTransitOrders = orders.filter((order: Order) => order.status === 'in_transit');
  const deliveredOrders = orders.filter((order: Order) => order.status === 'delivered');

  if (!user || user.role !== 'marketer') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🚫</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You need marketer access to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Welcome back, {user.firstName}!
              </h1>
              <p className="text-gray-600 mt-1">Your delivery dashboard</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 mt-6">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Package },
              { id: 'profile', label: 'My Profile', icon: User }
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Delivery Dashboard</h1>
                <p className="text-gray-600">Manage your deliveries and routes</p>
              </div>
              <Button
                onClick={() => setShowMap(!showMap)}
                className="flex items-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                {showMap ? 'Hide Map' : 'Show Map'}
              </Button>
            </div>

            {/* Search and Filters */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search by customer name, address, or order number..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/50 border-gray-200"
                    />
                  </div>
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-md bg-white/50"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in_transit">In Transit</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{stats.pendingOrders || pendingOrders.length}</div>
                  <p className="text-xs text-muted-foreground">Awaiting pickup</p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">In Transit</CardTitle>
                  <Truck className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats.inTransitOrders || inTransitOrders.length}</div>
                  <p className="text-xs text-muted-foreground">Currently delivering</p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Delivered Today</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.deliveredOrders || deliveredOrders.length}</div>
                  <p className="text-xs text-muted-foreground">Completed deliveries</p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalOrders || orders.length}</div>
                  <p className="text-xs text-muted-foreground">Assigned today</p>
                </CardContent>
              </Card>
            </div>

            {/* Map Section */}
            {showMap && (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Delivery Routes
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant={showDirections ? "default" : "outline"}
                        onClick={() => setShowDirections(!showDirections)}
                        disabled={!selectedOrder}
                      >
                        <Navigation className="w-4 h-4 mr-1" />
                        {showDirections ? 'Hide Directions' : 'Show Directions'}
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <GoogleMap
                    orders={orders}
                    selectedOrder={selectedOrder}
                    showDirections={showDirections}
                    height="500px"
                    className="w-full"
                  />
                </CardContent>
              </Card>
            )}

            {/* Orders List */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Assigned Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order: Order) => (
                    <div
                      key={order._id}
                      className={`border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                        selectedOrder?._id === order._id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {getStatusIcon(order.status)}
                            <h3 className="font-semibold text-gray-900">Order #{order.orderNumber}</h3>
                            {getStatusBadge(order.status)}
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
                              <p className="text-sm text-gray-600">Total: ₦{order.totalAmount.toFixed(2)}</p>
                            </div>
                          </div>

                          <div className="mb-3">
                            <p className="text-sm font-medium text-gray-700 mb-1">Items:</p>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {order.items.map((item, index) => (
                                <li key={index} className="flex items-center gap-1">
                                  <Package className="w-3 h-3" />
                                  {item.name} (x{item.quantity})
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 ml-4">
                          {order.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartDelivery(order._id);
                              }}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <Truck className="w-3 h-3 mr-1" />
                              Start Delivery
                            </Button>
                          )}

                          {order.status === 'in_transit' && (
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkDelivered(order._id);
                              }}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Mark Delivered
                            </Button>
                          )}

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedOrder(order);
                            }}
                          >
                            <MessageSquare className="w-3 h-3 mr-1" />
                            Contact
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {orders.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p>No orders assigned yet.</p>
                    <p className="text-sm">Check back later for new deliveries.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Modal */}
            {selectedOrder && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Contact Customer</h3>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(null)}>
                      ×
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="font-medium">{selectedOrder.customerName}</p>
                      <p className="text-sm text-gray-600">Order #{selectedOrder.orderNumber}</p>
                    </div>

                    <div className="space-y-2">
                      <Button
                        className="w-full"
                        onClick={() => window.open(`tel:${selectedOrder.customerPhone}`)}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Call Customer
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => window.open(`https://wa.me/${selectedOrder.customerPhone.replace(/\s+/g, '')}`)}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        WhatsApp Message
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* Profile Header */}
            <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold">
                    {user.firstName?.charAt(0)?.toUpperCase() || 'M'}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{user.firstName} {user.lastName}</h2>
                    <p className="text-blue-100">Delivery Marketer</p>
                    <p className="text-blue-100 text-sm">{user.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">First Name</Label>
                      <p className="text-lg font-semibold">{user.firstName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Last Name</Label>
                      <p className="text-lg font-semibold">{user.lastName}</p>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-sm font-medium text-gray-600">Email</Label>
                      <p className="text-lg font-semibold">{user.email}</p>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-sm font-medium text-gray-600">Role</Label>
                      <Badge className="bg-blue-100 text-blue-800">Delivery Marketer</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-blue-600" />
                    Account Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Account Status</Label>
                      <div className="mt-1">
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Member Since</Label>
                      <p className="text-lg font-semibold">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Change Password */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-blue-600" />
                  Change Password
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-w-md">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative mt-1">
                      <Input
                        id="currentPassword"
                        type={showPassword ? "text" : "password"}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                        placeholder="Enter current password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                      placeholder="Enter new password"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirm new password"
                      className="mt-1"
                    />
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Update Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}