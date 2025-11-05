'use client';

import { useState, useEffect } from 'react';
import { MapPin, Package, Truck, CheckCircle, Clock, Navigation, Phone, MessageSquare, Search, Filter, User, Eye, EyeOff, Key, Settings, RefreshCw, TrendingUp, Calendar, Star, Zap, Bell, ChevronDown, ChevronUp, MoreVertical, Play, Pause, RotateCcw, Menu, LogOut } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useMarketerOrders, useMarketerStats } from '@/hooks/useMarketer';
import GoogleMap from '@/Components/GoogleMap';
import { Order } from '@/services/marketer';

export default function MarketerPage() {
    const { user, logout } = useAuth();
    const currentUser = user;

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('assigned');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'amount'>('newest');
  const [showDirections, setShowDirections] = useState(false);
  const [selectedOrderMap, setSelectedOrderMap] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'profile'>('dashboard');
  const [showPassword, setShowPassword] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Dashboard API hook
  const { data: dashboardData, isLoading: dashboardLoading } = useMarketerStats();

  // Mobile navigation hide/show states
  const [isMobileNavVisible, setIsMobileNavVisible] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Reset mobile nav visibility when component mounts/refreshes
  useEffect(() => {
    setIsMobileNavVisible(true);
    setLastActivity(Date.now());
  }, []);

  // Handle user activity to show mobile nav
  const handleUserActivity = () => {
    setIsMobileNavVisible(true);
    setLastActivity(Date.now());
  };

  // Auto-hide mobile nav after 2 minutes of inactivity
  useEffect(() => {
    const checkInactivity = () => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivity;
      const twoMinutes = 2 * 60 * 1000; // 2 minutes in milliseconds

      if (timeSinceLastActivity > twoMinutes && isMobileNavVisible) {
        setIsMobileNavVisible(false);
      }
    };

    const interval = setInterval(checkInactivity, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [lastActivity, isMobileNavVisible]);

  // Add event listeners for user activity
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    const handleActivity = () => handleUserActivity();

    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        await fetch('https://epilux-backend.vercel.app/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout API failed:', error);
    } finally {
      // Clear local auth data
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      localStorage.removeItem('tokenTimestamp');
      document.cookie = 'authToken=; path=/; max-age=0; samesite=strict';
      window.location.href = '/login';
    }
  };

  // Animation states
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);


  // Mock data for demonstration with diverse locations
  const mockOrders: Order[] = [
    {
      _id: 'order-1',
      orderNumber: 'ORD-2024-001',
      customerName: 'Alice Johnson',
      customerPhone: '+2348012345678',
      address: '123 Victoria Island, Lagos',
      status: 'pending',
      totalAmount: 2500,
      deliveryTime: new Date().toISOString(),
      coordinates: { lat: 6.4358, lng: 3.4219 },
      items: [
        { name: 'Sachet Water (24 pack)', quantity: 1, price: 1200 },
        { name: 'Bottled Water (6 pack)', quantity: 2, price: 600 }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'order-2',
      orderNumber: 'ORD-2024-002',
      customerName: 'Bob Smith',
      customerPhone: '+2348023456789',
      address: '456 Lekki Phase 1, Lagos',
      status: 'in_transit',
      totalAmount: 1800,
      deliveryTime: new Date().toISOString(),
      coordinates: { lat: 6.4698, lng: 3.5852 },
      items: [
        { name: 'Bottled Water (12 pack)', quantity: 1, price: 900 }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'order-3',
      orderNumber: 'ORD-2024-003',
      customerName: 'Carol Williams',
      customerPhone: '+2348034567890',
      address: '789 Ikeja GRA, Lagos',
      status: 'delivered',
      totalAmount: 3200,
      deliveryTime: new Date().toISOString(),
      coordinates: { lat: 6.6018, lng: 3.3515 },
      items: [
        { name: 'Bulk Dispenser Refill', quantity: 1, price: 2500 },
        { name: 'Sachet Water (12 pack)', quantity: 1, price: 700 }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'order-4',
      orderNumber: 'ORD-2024-004',
      customerName: 'David Brown',
      customerPhone: '+2348045678901',
      address: '321 Wuse 2, Abuja',
      status: 'pending',
      totalAmount: 1500,
      deliveryTime: new Date().toISOString(),
      coordinates: { lat: 9.0765, lng: 7.3986 },
      items: [
        { name: 'Sachet Water (12 pack)', quantity: 1, price: 700 }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'order-5',
      orderNumber: 'ORD-2024-005',
      customerName: 'Emma Davis',
      customerPhone: '+2348056789012',
      address: '654 Maitama, Abuja',
      status: 'in_transit',
      totalAmount: 2800,
      deliveryTime: new Date().toISOString(),
      coordinates: { lat: 9.1044, lng: 7.4891 },
      items: [
        { name: 'Water Dispenser', quantity: 1, price: 2800 }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'order-6',
      orderNumber: 'ORD-2024-006',
      customerName: 'Frank Miller',
      customerPhone: '+2348067890123',
      address: '987 GRA Phase 2, Port Harcourt',
      status: 'pending',
      totalAmount: 4200,
      deliveryTime: new Date().toISOString(),
      coordinates: { lat: 4.8156, lng: 7.0498 },
      items: [
        { name: 'Premium Dispenser Set', quantity: 1, price: 3500 },
        { name: 'Bottled Water (6 pack)', quantity: 2, price: 600 }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'order-7',
      orderNumber: 'ORD-2024-007',
      customerName: 'Grace Taylor',
      customerPhone: '+2348078901234',
      address: '147 Bodija, Ibadan',
      status: 'delivered',
      totalAmount: 1900,
      deliveryTime: new Date().toISOString(),
      coordinates: { lat: 7.3775, lng: 3.9470 },
      items: [
        { name: 'Family Water Pack', quantity: 1, price: 1900 }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'order-8',
      orderNumber: 'ORD-2024-008',
      customerName: 'Henry Wilson',
      customerPhone: '+2348089012345',
      address: '258 Challenge, Ibadan',
      status: 'pending',
      totalAmount: 3600,
      deliveryTime: new Date().toISOString(),
      coordinates: { lat: 7.3876, lng: 3.8794 },
      items: [
        { name: 'Office Water Supply', quantity: 1, price: 3600 }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];


  // API hooks
  const { data: ordersData, isLoading: ordersLoading } = useMarketerOrders({
    search: searchTerm || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  });
  const { data: statsData } = useMarketerStats();

  // Real-time refresh function
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastUpdated(new Date());
    setIsRefreshing(false);
  };

  // Initialize lastUpdated on client side only
  useEffect(() => {
    setLastUpdated(new Date());
  }, []);

  // Get unique locations for filter dropdown
  const uniqueLocations = Array.from(new Set(mockOrders.map(order => {
    const parts = order.address.split(',');
    return parts[parts.length - 1].trim(); // Get city from address
  })));

  // Filter and sort orders based on search, status, location, and sort criteria
  const filteredAndSortedOrders = mockOrders
    .filter((order) => {
      const matchesSearch = searchTerm === '' ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.address.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

      const matchesLocation = locationFilter === 'all' ||
        order.address.toLowerCase().includes(locationFilter.toLowerCase());

      return matchesSearch && matchesStatus && matchesLocation;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'amount':
          return b.totalAmount - a.totalAmount;
        default:
          return 0;
      }
    });

  const orders = filteredAndSortedOrders;
  const stats = dashboardData;
  const isLoading = ordersLoading || dashboardLoading;

  // Mock mutation functions with state updates
  const updateOrderStatusMutation = {
    mutate: (params: { id: string; status: Order['status'] }) => {
      console.log('Mock: Updating order', params.id, 'to status', params.status);
      // In a real app, this would update the order status via API
      // For demo, we'll just log it
    }
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
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 transition-all duration-700 ease-out overflow-hidden ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Main Content */}
      <div className="pb-20 lg:pb-0 overflow-y-auto h-screen">
        {/* Top Header */}
        <div className="bg-white/70 backdrop-blur-xl border-b border-white/20 fixed top-0 lg:left-64 left-0 right-0 z-40 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">
                  {activeTab === 'dashboard' && 'Dashboard Overview'}
                  {activeTab === 'orders' && 'Order Management'}
                  {activeTab === 'profile' && 'Account Profile'}
                </h1>
                <p className="text-sm text-slate-600">
                  {activeTab === 'dashboard' && 'Monitor your delivery operations'}
                  {activeTab === 'orders' && 'Track and manage all deliveries'}
                  {activeTab === 'profile' && 'Manage your account settings'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-xs text-slate-500 hidden md:block">
                Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Loading...'}
              </div>
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                size="sm"
                variant="outline"
                className="border-slate-200 hover:bg-slate-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className={`fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 z-40 lg:hidden transition-all duration-500 ease-out ${
          isMobileNavVisible
            ? 'translate-y-0 opacity-100 scale-100'
            : 'translate-y-full opacity-0 scale-95'
        }`}>
           <div className="flex items-center justify-around py-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
              { id: 'orders', label: 'Orders', icon: Package },
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'logout', label: 'Logout', icon: LogOut }
            ].map((item) => (
              item.id === 'logout' ? (
                <button
                  key={item.id}
                  onClick={handleLogout}
                  className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl transition-all duration-200 text-red-600 hover:bg-red-50"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              ) : (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    handleUserActivity();
                  }}
                  className={`flex flex-col items-center gap-1 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === item.id
                      ? 'bg-gradient-to-t from-blue-500 to-indigo-600 text-white shadow-lg'
                      : 'text-slate-600 hover:bg-slate-100'
                    }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              )
            ))}
          </div>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-white/95 backdrop-blur-xl border-r border-white/20 shadow-xl z-50 overflow-hidden">
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="flex items-center justify-center p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Delivery Hub</h2>
                  <p className="text-xs text-slate-600">Operations Center</p>
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                  {currentUser.firstName?.charAt(0)?.toUpperCase() || 'M'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {currentUser.firstName} {currentUser.lastName}
                  </p>
                  <p className="text-xs text-slate-600 truncate">{currentUser.email}</p>
                  <Badge className="mt-1 bg-green-100 text-green-700 text-xs px-2 py-0.5">
                    Active
                  </Badge>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 px-4 py-6">
              <div className="space-y-2">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: TrendingUp, description: 'Overview & stats' },
                  { id: 'orders', label: 'Orders', icon: Package, description: 'Manage deliveries' },
                  { id: 'profile', label: 'Profile', icon: User, description: 'Account settings' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as any);
                      handleUserActivity();
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab === item.id
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                        : 'text-slate-700 hover:bg-slate-100 hover:shadow-md'
                      }`}
                  >
                    <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-blue-600'
                      }`} />
                    <div className="text-left">
                      <div className={`font-medium ${activeTab === item.id ? 'text-white' : 'text-slate-800'
                        }`}>
                        {item.label}
                      </div>
                      <div className={`text-xs ${activeTab === item.id ? 'text-blue-100' : 'text-slate-500'
                        }`}>
                        {item.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-slate-200 space-y-3">
              <div className="text-xs text-slate-500 text-center hidden sm:block">
                Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Loading...'}
              </div>

              {/* Logout Button */}
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:ml-64 px-6 py-8 pt-24">

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-500">

              {/* Orders Header */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                  <h2 className="text-3xl font-bold text-slate-800 mb-2">Order Management</h2>
                  <p className="text-slate-600">Track and manage all your deliveries</p>
                </div>

                <div className="flex items-center gap-3 w-full lg:w-auto">
                  <Button
                    onClick={() => setShowMap(!showMap)}
                    variant="outline"
                    className="border-slate-300 hover:bg-slate-50"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    {showMap ? 'Hide Map' : 'View Map'}
                  </Button>
                </div>
              </div>

              {/* Advanced Filters */}
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        placeholder="Search orders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200"
                      />
                    </div>

                    <select
                      className="px-4 py-2 border border-slate-200 rounded-lg bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-200 transition-all"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="in_transit">In Transit</option>
                      <option value="delivered">Delivered</option>
                    </select>

                    <select
                      className="px-4 py-2 border border-slate-200 rounded-lg bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-200 transition-all"
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                    >
                      <option value="all">All Locations</option>
                      {uniqueLocations.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>

                    <select
                      className="px-4 py-2 border border-slate-200 rounded-lg bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-200 transition-all"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="amount">Highest Amount</option>
                    </select>

                    <Button
                      onClick={() => {
                        setSearchTerm('');
                        setStatusFilter('all');
                        setLocationFilter('all');
                        setSortBy('newest');
                      }}
                      variant="outline"
                      className="border-slate-300 hover:bg-slate-50"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Orders Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {orders.map((order: Order, index) => (
                  <Card
                    key={order._id}
                    className={`bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 ease-out transform hover:-translate-y-1 hover:scale-[1.02] cursor-pointer animate-in slide-in-from-bottom-4 ${selectedOrder?._id === order._id ? 'ring-2 ring-blue-500 shadow-2xl' : ''
                      }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-md ${order.status === 'pending' ? 'bg-yellow-100' :
                              order.status === 'in_transit' ? 'bg-blue-100' : 'bg-green-100'
                            }`}>
                            {getStatusIcon(order.status)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-800 text-sm">#{order.orderNumber}</h4>
                            <p className="text-xs text-slate-600">{order.customerName}</p>
                          </div>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <Phone className="w-3 h-3" />
                          {order.customerPhone}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <MapPin className="w-3 h-3" />
                          {order.address.split(',')[0]}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <div className="text-lg font-bold text-slate-800">
                          ₦{order.totalAmount.toLocaleString()}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedOrder(expandedOrder === order._id ? null : order._id);
                          }}
                          className="p-1 h-6 w-6"
                        >
                          {expandedOrder === order._id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </Button>
                      </div>

                      {/* Expandable Items */}
                      {expandedOrder === order._id && (
                        <div className="border-t border-slate-200 pt-3 animate-in slide-in-from-top-2 duration-300">
                          <p className="text-xs font-medium text-slate-700 mb-2">Items:</p>
                          <div className="space-y-1">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between text-xs">
                                <span className="text-slate-600">{item.name}</span>
                                <div className="flex items-center gap-1">
                                  <span className="text-slate-500">x{item.quantity}</span>
                                  <span className="font-medium text-slate-800">₦{(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {order.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartDelivery(order._id);
                            }}
                            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-sm transform hover:scale-105 hover:-translate-y-0.5 transition-all duration-200 ease-out text-xs py-1.5 h-7"
                          >
                            <Truck className="w-3 h-3 mr-1" />
                            Start
                          </Button>
                        )}

                        {order.status === 'in_transit' && (
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkDelivered(order._id);
                            }}
                            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-sm transform hover:scale-105 hover:-translate-y-0.5 transition-all duration-200 ease-out text-xs py-1.5 h-7"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Complete
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrderMap(order);
                          }}
                          className="border-slate-300 hover:bg-slate-50 transform hover:scale-105 transition-all duration-200 p-1 h-7 w-7"
                        >
                          <Navigation className="w-3 h-3" />
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(order);
                          }}
                          className="border-slate-300 hover:bg-slate-50 transform hover:scale-105 transition-all duration-200 p-1 h-7 w-7"
                        >
                          <MessageSquare className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {orders.length === 0 && (
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                  <CardContent className="p-12 text-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Package className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">No orders found</h3>
                    <p className="text-slate-600 mb-6">Try adjusting your search or filter criteria.</p>
                    <Button
                      onClick={() => {
                        setSearchTerm('');
                        setStatusFilter('all');
                        setSortBy('newest');
                      }}
                      variant="outline"
                      className="border-slate-300 hover:bg-slate-50"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-2 duration-500">

              {/* Welcome Section */}
              {stats && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 px-6 py-3 rounded-full border border-blue-200/50">
                    <Zap className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-700 font-medium">Good morning! You have {stats.pending || 0} pending deliveries</span>
                  </div>
                </div>
              )}

              {/* Enhanced Stats Cards */}
              {stats ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      title: 'Pending Orders',
                      value: stats.pending || 0,
                      icon: Clock,
                      color: 'from-yellow-500 to-orange-500',
                      bgColor: 'from-yellow-50 to-orange-50',
                      textColor: 'text-yellow-700',
                      subtitle: 'Awaiting pickup'
                    },
                    {
                      title: 'In Transit',
                      value: stats.inTransit || 0,
                      icon: Truck,
                      color: 'from-blue-500 to-indigo-500',
                      bgColor: 'from-blue-50 to-indigo-50',
                      textColor: 'text-blue-700',
                      subtitle: 'Currently delivering'
                    },
                    {
                      title: 'Delivered Today',
                      value: stats.delivered || 0,
                      icon: CheckCircle,
                      color: 'from-green-500 to-emerald-500',
                      bgColor: 'from-green-50 to-emerald-50',
                      textColor: 'text-green-700',
                      subtitle: 'Completed deliveries'
                    },
                    {
                      title: 'Total Orders',
                      value: stats.totalOrders || 0,
                      icon: Package,
                      color: 'from-slate-500 to-slate-600',
                      bgColor: 'from-slate-50 to-slate-100',
                      textColor: 'text-slate-700',
                      subtitle: 'Assigned today'
                    }
                  ].map((stat, index) => (
                    <Card
                      key={stat.title}
                      className={`bg-gradient-to-br ${stat.bgColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300 ease-out transform hover:-translate-y-1 hover:scale-[1.02] animate-in slide-in-from-bottom-4`}
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                            <stat.icon className="h-6 w-6 text-white" />
                          </div>
                          <TrendingUp className="h-4 w-4 text-slate-400" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                          <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                          <p className="text-xs text-slate-500">{stat.subtitle}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Loading Dashboard Stats...</h3>
                  <p className="text-slate-600">Please wait while we fetch your dashboard data.</p>
                </div>
              )}

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => setShowMap(!showMap)}
                  className="h-16 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 ease-out transform hover:scale-105 hover:-translate-y-1"
                >
                  <div className="flex items-center gap-3">
                    <Navigation className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-semibold">{showMap ? 'Hide Map' : 'View Routes'}</div>
                      <div className="text-xs opacity-90">Track deliveries</div>
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={() => {
                    setActiveTab('orders');
                    handleUserActivity();
                  }}
                  variant="outline"
                  className="h-16 border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 ease-out transform hover:scale-105 hover:-translate-y-1"
                >
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-blue-600" />
                    <div className="text-left">
                      <div className="font-semibold">Manage Orders</div>
                      <div className="text-xs text-slate-600">View all deliveries</div>
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  variant="outline"
                  className="h-16 border-2 border-slate-200 hover:border-green-300 hover:bg-green-50 transition-all duration-300 ease-out transform hover:scale-105 hover:-translate-y-1"
                >
                  <div className="flex items-center gap-3">
                    <RefreshCw className={`w-5 h-5 text-green-600 ${isRefreshing ? 'animate-spin' : ''}`} />
                    <div className="text-left">
                      <div className="font-semibold">Refresh Data</div>
                      <div className="text-xs text-slate-600">Get latest updates</div>
                    </div>
                  </div>
                </Button>
              </div>

              {/* Map Section */}
              {showMap && (
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl animate-in slide-in-from-top-4 duration-500">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <MapPin className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800">Delivery Routes</h3>
                          <p className="text-sm text-slate-600">Track all active deliveries</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant={showDirections ? "default" : "outline"}
                          onClick={() => setShowDirections(!showDirections)}
                          disabled={!selectedOrder}
                          className="shadow-sm"
                        >
                          <Navigation className="w-4 h-4 mr-2" />
                          {showDirections ? 'Hide Directions' : 'Show Directions'}
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="h-96 bg-slate-100 rounded-b-lg overflow-hidden">
                      {/* Placeholder for Google Maps */}
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                        <div className="text-center">
                          <MapPin className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                          <p className="text-slate-600 font-medium">Interactive Map View</p>
                          <p className="text-sm text-slate-500">Google Maps integration would go here</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recent Orders Preview */}
              {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg">
                          <Package className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800">Recent Orders</h3>
                          <p className="text-sm text-slate-600">Your latest deliveries</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          setActiveTab('orders');
                          setSelectedOrder(null); // Clear any selected order when switching tabs
                          handleUserActivity();
                        }}
                        variant="outline"
                        size="sm"
                        className="border-slate-300 hover:bg-slate-50"
                      >
                        View All
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {stats.recentOrders.slice(0, 3).map((order: any, index: number) => (
                        <div
                          key={order._id || index}
                          className={`border border-slate-200 rounded-xl p-4 hover:bg-slate-50/50 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] animate-in slide-in-from-left-4 ${selectedOrder?._id === order._id ? 'ring-2 ring-blue-500 bg-blue-50/50' : ''
                            }`}
                          style={{ animationDelay: `${index * 100}ms` }}
                          onClick={() => setSelectedOrder(order)}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <div className={`p-2 rounded-lg ${order.status === 'pending' ? 'bg-yellow-100' :
                                    order.status === 'in_transit' ? 'bg-blue-100' : 'bg-green-100'
                                  }`}>
                                  {getStatusIcon(order.status)}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-slate-800">Order #{order.orderNumber}</h4>
                                  <p className="text-sm text-slate-600">{order.customerName}</p>
                                </div>
                                {getStatusBadge(order.status)}
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                  <Phone className="w-4 h-4" />
                                  {order.customerPhone}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                  <MapPin className="w-4 h-4" />
                                  {order.address?.split(',')[0] || order.address}
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="text-lg font-bold text-slate-800">
                                  ₦{order.totalAmount?.toLocaleString() || '0'}
                                </div>
                                <div className="text-xs text-slate-500">
                                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  }) : 'N/A'}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons at Bottom */}
                          <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-200">
                            {order.status === 'pending' && (
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStartDelivery(order._id);
                                }}
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-sm transform hover:scale-105 transition-all duration-200"
                              >
                                <Truck className="w-3 h-3 mr-1" />
                                Start
                              </Button>
                            )}

                            {order.status === 'in_transit' && (
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkDelivered(order._id);
                                }}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-sm transform hover:scale-105 transition-all duration-200"
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Complete
                              </Button>
                            )}

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOrderMap(order);
                              }}
                              className="border-slate-300 hover:bg-slate-50 transform hover:scale-105 transition-all duration-200"
                            >
                              <Navigation className="w-3 h-3 mr-1" />
                              Navigate
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOrder(order);
                              }}
                              className="border-slate-300 hover:bg-slate-50 transform hover:scale-105 transition-all duration-200"
                            >
                              <MessageSquare className="w-3 h-3 mr-1" />
                              Contact
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <Package className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800">Recent Orders</h3>
                        <p className="text-sm text-slate-600">Your latest deliveries</p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">No recent orders</h3>
                      <p className="text-slate-600">Your recent deliveries will appear here when available.</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Contact Modal */}
              {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300 p-4">
                  <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in slide-in-from-bottom-4 duration-300 max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <MessageSquare className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800">Contact Customer</h3>
                          <p className="text-sm text-slate-600">Order #{selectedOrder.orderNumber}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(null)} className="hover:bg-slate-100 rounded-full transition-all duration-200 ease-out transform hover:scale-110 hover:rotate-90">
                        ×
                      </Button>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-slate-50 rounded-xl p-4">
                        <div className="flex flex-col sm:flex-row items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {selectedOrder.customerName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">{selectedOrder.customerName}</p>
                            <p className="text-sm text-slate-600">{selectedOrder.address.split(',')[0]}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Button
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
                          onClick={() => window.open(`tel:${selectedOrder.customerPhone}`)}
                        >
                          <Phone className="w-4 h-4 mr-3" />
                          Call Customer
                        </Button>

                        <Button
                          variant="outline"
                          className="w-full border-green-300 hover:bg-green-50 hover:border-green-400 transform hover:scale-[1.02] transition-all duration-200"
                          onClick={() => window.open(`https://wa.me/${selectedOrder.customerPhone.replace(/\s+/g, '')}`)}
                        >
                          <MessageSquare className="w-4 h-4 mr-3 text-green-600" />
                          WhatsApp Message
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Individual Order Map Modal */}
              {selectedOrderMap && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300 p-4">
                  <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
                    <div className="flex items-center justify-between p-6 border-b border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Navigation className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800">Navigate to Delivery</h3>
                          <p className="text-sm text-slate-600">Order #{selectedOrderMap.orderNumber} - {selectedOrderMap.customerName}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedOrderMap(null)} className="hover:bg-slate-100 rounded-full">
                        ×
                      </Button>
                    </div>

                    <div className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {/* Order Details */}
                        <div className="lg:col-span-1 space-y-4">
                          <Card className="bg-slate-50 border-0">
                            <CardContent className="p-4">
                              <h4 className="font-semibold text-slate-800 mb-3">Delivery Details</h4>
                              <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm">
                                  <User className="w-4 h-4 text-slate-500" />
                                  <span className="text-slate-700">{selectedOrderMap.customerName}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Phone className="w-4 h-4 text-slate-500" />
                                  <span className="text-slate-700">{selectedOrderMap.customerPhone}</span>
                                </div>
                                <div className="flex items-start gap-2 text-sm">
                                  <MapPin className="w-4 h-4 text-slate-500 mt-0.5" />
                                  <span className="text-slate-700">{selectedOrderMap.address}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Package className="w-4 h-4 text-slate-500" />
                                  <span className="text-slate-700">₦{selectedOrderMap.totalAmount.toLocaleString()}</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <div className="space-y-3">
                            <Button
                              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
                              onClick={() => {
                                // Open in Google Maps with directions
                                const destination = `${selectedOrderMap.coordinates.lat},${selectedOrderMap.coordinates.lng}`;
                                window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, '_blank');
                              }}
                            >
                              <Navigation className="w-4 h-4 mr-2" />
                              Get Directions
                            </Button>

                            <Button
                              variant="outline"
                              className="w-full border-slate-300 hover:bg-slate-50 transform hover:scale-[1.02] transition-all duration-200"
                              onClick={() => window.open(`tel:${selectedOrderMap.customerPhone}`)}
                            >
                              <Phone className="w-4 h-4 mr-2" />
                              Call Customer
                            </Button>
                          </div>
                        </div>

                        {/* Map View */}
                        <div className="lg:col-span-2">
                          <Card className="border-0 shadow-lg overflow-hidden">
                            <CardContent className="p-0">
                              <div className="h-96 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center relative">
                                {/* Map placeholder */}
                                <div className="text-center">
                                  <MapPin className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                                  <p className="text-slate-600 font-medium mb-2">Interactive Map View</p>
                                  <p className="text-sm text-slate-500 mb-4">Click "Get Directions" to open in Google Maps</p>
                                  <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">
                                    <p className="text-xs text-slate-600">
                                      📍 {selectedOrderMap.address}
                                    </p>
                                  </div>
                                </div>

                                {/* Coordinates display */}
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
                                  <p className="text-xs text-slate-600">
                                    Lat: {selectedOrderMap.coordinates.lat.toFixed(4)}
                                  </p>
                                  <p className="text-xs text-slate-600">
                                    Lng: {selectedOrderMap.coordinates.lng.toFixed(4)}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}


          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">

              {/* Profile Header */}
              <Card className="bg-gradient-to-br from-slate-800 via-blue-800 to-indigo-800 text-white border-0 shadow-2xl overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20"></div>
                <CardContent className="p-8 relative">
                  <div className="flex flex-col sm:flex-row items-center gap-8">
                    <div className="relative">
                      <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl font-bold shadow-2xl">
                        {currentUser.firstName?.charAt(0)?.toUpperCase() || 'M'}
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-4 border-white shadow-lg"></div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold mb-2">{currentUser.firstName} {currentUser.lastName}</h2>
                      <p className="text-blue-100 text-lg mb-1">Delivery Operations Specialist</p>
                      <p className="text-blue-200 text-sm">{currentUser.email}</p>
                      <div className="flex items-center gap-4 mt-4">
                        <Badge className="bg-green-500/20 text-green-100 border-green-400/30 px-3 py-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                          Active
                        </Badge>
                        <div className="text-blue-200 text-sm">
                          Member since {currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 gap-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-slate-600">First Name</Label>
                          <p className="text-xl font-semibold text-slate-800 mt-1">{currentUser.firstName}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-slate-600">Last Name</Label>
                          <p className="text-xl font-semibold text-slate-800 mt-1">{currentUser.lastName}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-slate-600">Email Address</Label>
                        <p className="text-lg font-semibold text-slate-800 mt-1">{currentUser.email}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-slate-600">Role</Label>
                        <div className="mt-1">
                          <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 text-sm font-medium">
                            <User className="w-3 h-3 mr-1" />
                            Delivery Marketer
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      </div>
                      Performance Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-slate-800 mb-1">247</div>
                        <div className="text-sm text-slate-600">Total Deliveries</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 mb-1">4.8</div>
                        <div className="text-sm text-slate-600">Avg Rating</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-1">94%</div>
                        <div className="text-sm text-slate-600">Success Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600 mb-1">28min</div>
                        <div className="text-sm text-slate-600">Avg Time</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Change Password */}
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <Key className="w-5 h-5 text-slate-600" />
                    </div>
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="max-w-md space-y-6">
                    <div>
                      <Label htmlFor="currentPassword" className="text-slate-700 font-medium">Current Password</Label>
                      <div className="relative mt-2">
                        <Input
                          id="currentPassword"
                          type={showPassword ? "text" : "password"}
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                          placeholder="Enter current password"
                          className="border-slate-200 focus:border-blue-300 focus:ring-blue-200 pr-12"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-slate-100"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4 text-slate-500" /> : <Eye className="w-4 h-4 text-slate-500" />}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="newPassword" className="text-slate-700 font-medium">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                        placeholder="Enter new password"
                        className="mt-2 border-slate-200 focus:border-blue-300 focus:ring-blue-200"
                      />
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Confirm new password"
                        className="mt-2 border-slate-200 focus:border-blue-300 focus:ring-blue-200"
                      />
                    </div>

                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-200 ease-out">
                      <Key className="w-4 h-4 mr-2" />
                      Update Password
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Logout Section */}
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 border-b border-red-100">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <LogOut className="w-5 h-5 text-red-600" />
                    </div>
                    Account Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <p className="text-sm text-slate-600">
                      Need to sign out? You can securely log out of your account here.
                    </p>
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200 ease-out transform hover:scale-[1.02] hover:-translate-y-0.5"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout from Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}