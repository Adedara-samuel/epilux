'use client';

import { useState, useEffect } from 'react';
import {
    MapPin,
    Package,
    Truck,
    CheckCircle,
    Clock,
    Navigation,
    Phone,
    MessageSquare,
    RefreshCw,
    TrendingUp,
    User,
    Eye,
    EyeOff,
    Key,
    LogOut,
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useMarketerOrders, useMarketerStats, useUpdateOrderStatus } from '@/hooks/useMarketer';
import { Order } from '@/services/marketer';

export default function MarketerPage() {
    const { user, logout } = useAuth();
    const currentUser = user;

    const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'profile'>('dashboard');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [selectedOrderMap, setSelectedOrderMap] = useState<Order | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'amount'>('newest');
    const [showPassword, setShowPassword] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [isMobileNavVisible, setIsMobileNavVisible] = useState(true);
    const [lastActivity, setLastActivity] = useState(Date.now());
    const [isLoaded, setIsLoaded] = useState(false);

    const [profileForm, setProfileForm] = useState({
        firstName: currentUser?.firstName || '',
        lastName: currentUser?.lastName || '',
        phone: currentUser?.phone || '',
    });

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // ── Data fetching ────────────────────────────────────────────────────────
    const { data: statsData, isLoading: statsLoading } = useMarketerStats();

    const {
        data: ordersResponse,
        isLoading: ordersLoading,
        isFetching: ordersFetching,
        refetch,
    } = useMarketerOrders({
        search: searchTerm || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
    });

    const updateStatusMutation = useUpdateOrderStatus();

    const orders: Order[] = ordersResponse?.orders || [];
    const isLoadingData = statsLoading || ordersLoading;

    useEffect(() => {
        if (!isLoadingData) {
            setLastUpdated(new Date());
        }
    }, [isLoadingData]);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    // Mobile nav auto-hide
    useEffect(() => {
        const checkInactivity = () => {
            if (Date.now() - lastActivity > 120_000 && isMobileNavVisible) {
                setIsMobileNavVisible(false);
            }
        };
        const id = setInterval(checkInactivity, 10_000);
        return () => clearInterval(id);
    }, [lastActivity, isMobileNavVisible]);

    useEffect(() => {
        const handler = () => {
            setIsMobileNavVisible(true);
            setLastActivity(Date.now());
        };
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
        events.forEach((ev) => document.addEventListener(ev, handler, true));
        return () => events.forEach((ev) => document.removeEventListener(ev, handler, true));
    }, []);

    const handleRefresh = () => {
        setIsRefreshing(true);
        refetch().finally(() => setIsRefreshing(false));
    };

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            if (token) {
                await fetch('https://epilux-backend.vercel.app/api/auth/logout', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
            }
        } catch (err) {
            console.error('Logout failed', err);
        } finally {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            localStorage.removeItem('tokenTimestamp');
            document.cookie = 'authToken=; path=/; max-age=0; samesite=strict';
            window.location.href = '/login';
        }
    };

    const handleStartDelivery = (id: string) => {
        updateStatusMutation.mutate({ id, status: 'in_transit' });
    };

    const handleMarkDelivered = (id: string) => {
        updateStatusMutation.mutate({ id, status: 'delivered' });
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

    const handleUpdateProfile = () => {
        console.log('Update profile →', profileForm);
        // TODO: real mutation here later
    };

    const handleChangePassword = () => {
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            alert("Passwords don't match");
            return;
        }
        console.log('Change password →', passwordForm);
        // TODO: real mutation here later
    };

    if (!user || user.role !== 'marketer') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center p-8">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                        🚫
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">Access Denied</h2>
                    <p className="text-lg text-gray-600">You need marketer access to view this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 transition-all duration-700 ease-out overflow-hidden ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
        >
            {/* ── Fixed Header ───────────────────────────────────────────────────── */}
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
                            Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : '—'}
                        </div>
                        <Button
                            onClick={handleRefresh}
                            disabled={isRefreshing || ordersFetching}
                            size="sm"
                            variant="outline"
                        >
                            <RefreshCw className={`w-4 h-4 ${isRefreshing || ordersFetching ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>
                </div>
            </div>

            {/* ── Mobile Bottom Nav ──────────────────────────────────────────────── */}
            <div
                className={`fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 z-40 lg:hidden transition-all duration-500 ease-out ${isMobileNavVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-full opacity-0 scale-95'
                    }`}
            >
                <div className="flex items-center justify-around py-2">
                    {[
                        { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
                        { id: 'orders', label: 'Orders', icon: Package },
                        { id: 'profile', label: 'Profile', icon: User },
                        { id: 'logout', label: 'Logout', icon: LogOut },
                    ].map((item) =>
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
                                    setIsMobileNavVisible(true);
                                    setLastActivity(Date.now());
                                }}
                                className={`flex flex-col items-center gap-1 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === item.id
                                        ? 'bg-gradient-to-t from-blue-500 to-indigo-600 text-white shadow-lg'
                                        : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="text-xs font-medium">{item.label}</span>
                            </button>
                        ),
                    )}
                </div>
            </div>

            {/* ── Main Content ───────────────────────────────────────────────────── */}
            <div className="pt-20 pb-24 lg:pb-0 lg:pl-64 min-h-screen">
                {/* ── DASHBOARD TAB ──────────────────────────────────────────────── */}
                {activeTab === 'dashboard' && (
                    <div className="p-6 max-w-6xl mx-auto space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                                <CardContent className="p-6">
                                    <div className="text-sm opacity-90 mb-1">Pending Orders</div>
                                    <div className="text-4xl font-bold">{statsData?.pending || 0}</div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                                <CardContent className="p-6">
                                    <div className="text-sm opacity-90 mb-1">In Transit</div>
                                    <div className="text-4xl font-bold">{statsData?.inTransit || 0}</div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-purple-500 to-violet-600 text-white">
                                <CardContent className="p-6">
                                    <div className="text-sm opacity-90 mb-1">Delivered Today</div>
                                    <div className="text-4xl font-bold">{statsData?.deliveredToday || 0}</div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                                <CardContent className="p-6">
                                    <div className="text-sm opacity-90 mb-1">Total Earnings</div>
                                    <div className="text-4xl font-bold">
                                        ₦{(statsData?.totalEarnings || 0).toLocaleString()}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {orders.slice(0, 5).map((order: Order) => (
                                        <div key={order._id} className="flex items-center justify-between border-b pb-3 last:border-0">
                                            <div>
                                                <p className="font-medium">{order.customerName}</p>
                                                <p className="text-sm text-slate-500">{order.address}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-medium">₦{order.totalAmount.toLocaleString()}</div>
                                                {getStatusBadge(order.status)}
                                            </div>
                                        </div>
                                    ))}
                                    {orders.length === 0 && !isLoadingData && (
                                        <p className="text-center text-slate-500 py-8">No recent orders</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* ── ORDERS TAB ─────────────────────────────────────────────────── */}
                {activeTab === 'orders' && (
                    <div className="p-6 max-w-6xl mx-auto space-y-8">
                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Input
                                placeholder="Search by name, order # or address..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="max-w-md"
                            />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="border rounded-md px-3 py-2 bg-white"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="in_transit">In Transit</option>
                                <option value="delivered">Delivered</option>
                            </select>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="border rounded-md px-3 py-2 bg-white"
                            >
                                <option value="newest">Newest first</option>
                                <option value="oldest">Oldest first</option>
                                <option value="amount">Highest amount</option>
                            </select>
                        </div>

                        {/* Orders List */}
                        {isLoadingData ? (
                            <div className="text-center py-12">
                                <RefreshCw className="w-10 h-10 animate-spin mx-auto text-blue-500" />
                                <p className="mt-4 text-slate-600">Loading orders...</p>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="text-center py-12 text-slate-500">
                                No orders found matching your filters
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order: Order) => (
                                    <Card key={order._id} className="overflow-hidden">
                                        <CardContent className="p-0">
                                            <div className="p-6">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                    <div>
                                                        <div className="font-semibold text-lg">
                                                            #{order.orderNumber} • {order.customerName}
                                                        </div>
                                                        <div className="text-sm text-slate-600 mt-1 flex items-center gap-2">
                                                            {getStatusIcon(order.status)}
                                                            {getStatusBadge(order.status)}
                                                        </div>
                                                    </div>

                                                    <div className="text-right">
                                                        <div className="font-bold text-xl">₦{order.totalAmount.toLocaleString()}</div>
                                                        <div className="text-sm text-slate-500">
                                                            {new Date(order.createdAt).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-4 text-sm text-slate-600">
                                                    <div className="flex items-start gap-2">
                                                        <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                                                        <span>{order.address}</span>
                                                    </div>
                                                </div>

                                                <div className="mt-5 flex flex-wrap gap-3">
                                                    {order.status === 'pending' && (
                                                        <Button
                                                            size="sm"
                                                            className="bg-blue-600 hover:bg-blue-700"
                                                            onClick={() => handleStartDelivery(order._id)}
                                                        >
                                                            <Truck className="w-4 h-4 mr-2" />
                                                            Start Delivery
                                                        </Button>
                                                    )}

                                                    {order.status === 'in_transit' && (
                                                        <Button
                                                            size="sm"
                                                            className="bg-green-600 hover:bg-green-700"
                                                            onClick={() => handleMarkDelivered(order._id)}
                                                        >
                                                            <CheckCircle className="w-4 h-4 mr-2" />
                                                            Mark Delivered
                                                        </Button>
                                                    )}

                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => window.open(`tel:${order.customerPhone}`)}
                                                    >
                                                        <Phone className="w-4 h-4 mr-2" />
                                                        Call
                                                    </Button>

                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            window.open(`https://wa.me/${order.customerPhone.replace(/\D/g, '')}`)
                                                        }
                                                    >
                                                        <MessageSquare className="w-4 h-4 mr-2" />
                                                        WhatsApp
                                                    </Button>

                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setSelectedOrderMap(order)}
                                                    >
                                                        <Navigation className="w-4 h-4 mr-2" />
                                                        View on Map
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ── PROFILE TAB ────────────────────────────────────────────────── */}
                {activeTab === 'profile' && (
                    <div className="p-6 max-w-5xl mx-auto space-y-8">
                        {/* Profile header */}
                        <Card className="bg-gradient-to-br from-slate-800 via-blue-800 to-indigo-800 text-white border-0 shadow-2xl">
                            <CardContent className="p-8">
                                <div className="flex flex-col sm:flex-row items-center gap-8">
                                    <div className="relative">
                                        <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl font-bold shadow-2xl">
                                            {currentUser?.firstName?.charAt(0)?.toUpperCase() || 'M'}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-3xl font-bold">
                                            {currentUser?.firstName} {currentUser?.lastName}
                                        </h2>
                                        <p className="text-blue-100 mt-1">Delivery Marketer</p>
                                        <p className="text-blue-200 text-sm">{currentUser?.email}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Forms */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Personal Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>First Name</Label>
                                            <Input
                                                value={profileForm.firstName}
                                                onChange={(e) => setProfileForm((p) => ({ ...p, firstName: e.target.value }))}
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label>Last Name</Label>
                                            <Input
                                                value={profileForm.lastName}
                                                onChange={(e) => setProfileForm((p) => ({ ...p, lastName: e.target.value }))}
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Phone Number</Label>
                                        <Input
                                            value={profileForm.phone}
                                            onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))}
                                            className="mt-1"
                                        />
                                    </div>
                                    <Button onClick={handleUpdateProfile} className="w-full">
                                        Save Changes
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Change Password</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="relative">
                                        <Label>Current Password</Label>
                                        <Input
                                            type={showPassword ? 'text' : 'password'}
                                            value={passwordForm.currentPassword}
                                            onChange={(e) =>
                                                setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))
                                            }
                                            className="mt-1 pr-10"
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-10"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>

                                    <div>
                                        <Label>New Password</Label>
                                        <Input
                                            type="password"
                                            value={passwordForm.newPassword}
                                            onChange={(e) =>
                                                setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))
                                            }
                                            className="mt-1"
                                        />
                                    </div>

                                    <div>
                                        <Label>Confirm New Password</Label>
                                        <Input
                                            type="password"
                                            value={passwordForm.confirmPassword}
                                            onChange={(e) =>
                                                setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))
                                            }
                                            className="mt-1"
                                        />
                                    </div>

                                    <Button onClick={handleChangePassword} className="w-full" variant="destructive">
                                        Update Password
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="flex justify-center">
                            <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50" onClick={handleLogout}>
                                <LogOut className="w-4 h-4 mr-2" />
                                Sign Out
                            </Button>
                        </div>
                    </div>
                )}

                {/* Map modal placeholder - add real GoogleMap component when ready */}
                {selectedOrderMap && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold">Delivery Location</h3>
                                    <Button variant="ghost" onClick={() => setSelectedOrderMap(null)}>
                                        ×
                                    </Button>
                                </div>
                                <div className="h-96 bg-slate-100 rounded-lg flex items-center justify-center">
                                    <div className="text-center text-slate-500">
                                        <MapPin className="w-12 h-12 mx-auto mb-4" />
                                        <p>Map view for {selectedOrderMap.address}</p>
                                        <p className="text-sm mt-2">
                                            Lat: {selectedOrderMap.coordinates.lat} • Lng: {selectedOrderMap.coordinates.lng}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}