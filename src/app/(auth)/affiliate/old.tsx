"use client"
import React, { useState, useEffect, createContext, useContext } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// ===============================================
// 1. INTERFACES & DATA MODELS
// ===============================================
interface AffiliateData {
    _id: string;
    userId: string;
    name: string;
    email: string;
    registrationDate: string;
    totalSales: number;
    currentCommission: number;
    referralCode: string;
    isActive: boolean;
    commissionRate: number;
    totalCommissionEarned: number;
    totalReferrals: number;
    createdAt: string;
    updatedAt: string;
}

interface Commission {
    date: string;
    amount: number;
    status: 'Pending' | 'Paid';
    type: 'Sales' | 'Referral';
}

interface Referral {
    id: string;
    name: string;
    email: string;
    joinDate: string;
    sales: number;
    commission: number;
}

interface Transaction {
    _id: string;
    userId: string;
    referrerId: string | null;
    affiliateId: string | null;
    bagsSold: number;
    amount: number;
    commissionEarned: number;
    commissionRate: number;
    status: 'pending' | 'completed' | 'cancelled';
    type: 'sales' | 'referral';
    timestamp: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

// ===============================================
// 2. AUTH CONTEXT
// ===============================================
interface AuthContextType {
    user: User | null;
    loading: boolean;
    logout: () => Promise<void>;
    token: string | null;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    logout: async () => { },
    token: null,
});

const useAuth = () => useContext(AuthContext);

// API Service
const apiService = {
    async get(endpoint: string, token: string) {
        const response = await fetch(`http://localhost:5000/api${endpoint}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        return response.json();
    },

    async post(endpoint: string, data: any, token: string) {
        const response = await fetch(`http://localhost:5000/api${endpoint}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        return response.json();
    }
};

// ===============================================
// 3. MAIN APP COMPONENT
// ===============================================
const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [token, setToken] = useState<string | null>(null);
    const [userData, setUserData] = useState<AffiliateData | null>(null);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // Get token from localStorage
                const storedToken = localStorage.getItem('token');
                if (!storedToken) {
                    setLoading(false);
                    return;
                }

                setToken(storedToken);
                
                // Get user info from token or localStorage
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
                
                setLoading(false);
            } catch (e: unknown) {
                console.error("Auth initialization failed:", e);
                setError("Failed to initialize authentication");
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    useEffect(() => {
        if (!user || !token) return;

        const fetchAffiliateData = async () => {
            try {
                const response = await apiService.get('/affiliate/profile', token);
                if (response.success) {
                    setUserData(response.data);
                    setError('');
                } else {
                    setUserData(null);
                }
            } catch (error) {
                console.error("Error fetching affiliate data:", error);
                setError("Failed to load affiliate data");
                setUserData(null);
            }
        };

        fetchAffiliateData();
    }, [user, token]);

    const handleLogout = async () => {
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            setToken(null);
            setUserData(null);
            setError('');
        } catch (e: unknown) {
            console.error("Logout error:", e);
            setError("Failed to log out.");
        }
    };

    const authContextValue: AuthContextType = { user, loading, logout: handleLogout, token };

    return (
        <AuthContext.Provider value={authContextValue}>
            <div className="min-h-screen bg-gray-100 font-inter text-gray-800">
                <main>
                    {loading ? (
                        <div className="flex justify-center items-center h-screen">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : user && userData ? (
                        <AffiliateDashboardPage user={user} userData={userData} token={token} />
                    ) : (
                        <LandingPage />
                    )}
                    {error && <div className="text-red-500 text-sm text-center mt-4">{error}</div>}
                </main>
                <footer className="bg-blue-900 text-white text-center py-4 rounded-t-lg mt-8">
                    <p className="font-inter">&copy; 2024 Epilux Water. All rights reserved.</p>
                </footer>
            </div>
        </AuthContext.Provider>
    );
};

// ===============================================
// 4. HEADER COMPONENT
// ===============================================
interface HeaderProps {
    isLoggedIn: boolean;
    onLogout?: () => void;
    onLoginClick?: () => void;
    onNavigate: (page: string) => void;
    displayName: string | null;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, onLogout, onLoginClick, onNavigate, displayName }) => {
    const [currentPage, setCurrentPage] = useState<string>('dashboard');

    const handleNavigation = (page: string) => {
        setCurrentPage(page);
        onNavigate(page);
    };

    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-2xl font-bold text-blue-900">Epilux Water</h1>
                        {isLoggedIn && (
                            <nav className="hidden md:flex space-x-6">
                                <button
                                    onClick={() => handleNavigation('dashboard')}
                                    className={`px-3 py-2 rounded-md text-sm font-medium ${currentPage === 'dashboard' ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'}`}
                                >
                                    Dashboard
                                </button>
                                <button
                                    onClick={() => handleNavigation('sales')}
                                    className={`px-3 py-2 rounded-md text-sm font-medium ${currentPage === 'sales' ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'}`}
                                >
                                    Sales
                                </button>
                                <button
                                    onClick={() => handleNavigation('referrals')}
                                    className={`px-3 py-2 rounded-md text-sm font-medium ${currentPage === 'referrals' ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'}`}
                                >
                                    Referrals
                                </button>
                            </nav>
                        )}
                    </div>
                    <div className="flex items-center space-x-4">
                        {isLoggedIn ? (
                            <>
                                <span className="text-sm text-gray-700">Welcome, {displayName}</span>
                                <button
                                    onClick={onLogout}
                                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={onLoginClick}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
                            >
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

// ===============================================
// 5. LANDING PAGE COMPONENT
// ===============================================
const LandingPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Join Our Affiliate Program</h1>
                <p className="text-xl text-gray-600 mb-8">Earn commissions by referring customers to Epilux Water</p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-semibold text-blue-900 mb-4">How It Works</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-blue-900">1</span>
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Sign Up</h3>
                            <p className="text-gray-600">Create your affiliate account and get your unique referral code</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-blue-900">2</span>
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Refer Friends</h3>
                            <p className="text-gray-600">Share your referral code with friends and family</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-blue-900">3</span>
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Earn Commissions</h3>
                            <p className="text-gray-600">Get paid for every successful referral and sale</p>
                        </div>
                    </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h2 className="text-2xl font-semibold text-green-900 mb-4">Commission Structure</h2>
                    <ul className="text-left max-w-2xl mx-auto space-y-2">
                        <li className="flex items-center">
                            <span className="text-green-600 mr-2">✓</span>
                            <span><strong>10% commission</strong> on all referred sales</span>
                        </li>
                        <li className="flex items-center">
                            <span className="text-green-600 mr-2">✓</span>
                            <span><strong>5% bonus</strong> on sales from your referrals</span>
                        </li>
                        <li className="flex items-center">
                            <span className="text-green-600 mr-2">✓</span>
                            <span><strong>Monthly payouts</strong> via bank transfer</span>
                        </li>
                        <li className="flex items-center">
                            <span className="text-green-600 mr-2">✓</span>
                            <span><strong>Real-time tracking</strong> of your commissions</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

// ===============================================
// 6. LOGIN & REGISTER COMPONENT
// ===============================================
interface LoginPageProps {
    onForgotPasswordClick?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onForgotPasswordClick }) => {
    const [isLoginMode, setIsLoginMode] = useState<boolean>(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: ''
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const endpoint = isLoginMode ? '/auth/login' : '/auth/register';
            const response = await fetch(`http://localhost:5000/api${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Store token and user data
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setSuccess(isLoginMode ? 'Login successful!' : 'Registration successful!');
                // Reload to update auth state
                setTimeout(() => window.location.reload(), 1000);
            } else {
                setError(data.message || 'Authentication failed');
            }
        } catch (error) {
            console.error('Auth error:', error);
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-center mb-6">
                {isLoginMode ? 'Login to Your Account' : 'Create Affiliate Account'}
            </h2>
            
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
            {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
                {!isLoginMode && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </>
                )}
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        minLength={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Processing...' : (isLoginMode ? 'Login' : 'Register')}
                </button>
            </form>
            
            <div className="mt-4 text-center">
                <button
                    type="button"
                    onClick={() => setIsLoginMode(!isLoginMode)}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                >
                    {isLoginMode ? "Don't have an account? Register" : 'Already have an account? Login'}
                </button>
            </div>
            
            {isLoginMode && onForgotPasswordClick && (
                <div className="mt-2 text-center">
                    <button
                        type="button"
                        onClick={onForgotPasswordClick}
                        className="text-blue-500 hover:text-blue-700 text-sm"
                    >
                        Forgot your password?
                    </button>
                </div>
            )}
        </div>
    );
};

// ===============================================
// 7. AFFILIATE DASHBOARD COMPONENTS
// ===============================================
interface AffiliateDashboardPageProps {
    user: User;
    userData: AffiliateData;
    token: string | null;
}

const AffiliateDashboardPage: React.FC<AffiliateDashboardPageProps> = ({ user, userData, token }) => {
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [salesData, setSalesData] = useState<Transaction[]>([]);
    const [referrals, setReferrals] = useState<Referral[]>([]);
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const { logout } = useAuth();
    const displayName = userData?.name || 'Affiliate';

    // Fetch dashboard data
    useEffect(() => {
        if (!token) return;

        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const response = await apiService.get('/affiliate/dashboard', token);
                if (response.success) {
                    setDashboardData(response.data);
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [token]);

    // Fetch sales data
    useEffect(() => {
        if (!token) return;

        const fetchSalesData = async () => {
            try {
                const response = await apiService.get('/affiliate/sales', token);
                if (response.success) {
                    setSalesData(response.data);
                }
            } catch (error) {
                console.error('Error fetching sales data:', error);
            }
        };

        fetchSalesData();
    }, [token]);

    // Fetch referrals
    useEffect(() => {
        if (!token) return;

        const fetchReferrals = async () => {
            try {
                const response = await apiService.get('/affiliate/referrals', token);
                if (response.success) {
                    setReferrals(response.data);
                }
            } catch (error) {
                console.error('Error fetching referrals:', error);
            }
        };

        fetchReferrals();
    }, [token]);

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return <DashboardContent salesData={salesData} referrals={referrals} dashboardData={dashboardData} loading={loading} />;
            case 'sales':
                return <SalesPage salesData={salesData} loading={loading} />;
            case 'referrals':
                return <ReferralPage referrals={referrals} loading={loading} />;
            default:
                return <DashboardContent salesData={salesData} referrals={referrals} dashboardData={dashboardData} loading={loading} />;
        }
    };

    return (
        <div>
            <Header
                isLoggedIn={true}
                onLogout={logout}
                onNavigate={setCurrentPage}
                displayName={displayName}
            />
            <div className="container mx-auto px-4 py-8">
                {renderPage()}
            </div>
        </div>
    );
};

// ===============================================
// 8. DASHBOARD CONTENT COMPONENT
// ===============================================
interface DashboardContentProps {
    salesData: Transaction[];
    referrals: Referral[];
    dashboardData: any;
    loading: boolean;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ salesData, referrals, dashboardData, loading }) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const totalSales = dashboardData?.summary?.totalSales || 0;
    const totalCommission = dashboardData?.summary?.totalCommission || 0;
    const totalReferrals = dashboardData?.summary?.totalReferrals || 0;
    const totalTransactions = dashboardData?.summary?.totalTransactions || 0;
    const chartData = dashboardData?.salesData || [];

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Affiliate Dashboard</h2>
                <p className="text-gray-600">Welcome back! Here's your affiliate performance overview.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Sales</p>
                            <p className="text-2xl font-semibold text-gray-900">${totalSales.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Commission Earned</p>
                            <p className="text-2xl font-semibold text-gray-900">${totalCommission.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Referrals</p>
                            <p className="text-2xl font-semibold text-gray-900">{totalReferrals}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Transactions</p>
                            <p className="text-2xl font-semibold text-gray-900">{totalTransactions}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales & Commission Trend</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} name="Sales ($)" />
                            <Line type="monotone" dataKey="commission" stroke="#10b981" strokeWidth={2} name="Commission ($)" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Sales</h3>
                    <div className="space-y-3">
                        {salesData.slice(0, 5).map((sale) => (
                            <div key={sale._id} className="flex justify-between items-center py-2 border-b border-gray-100">
                                <div>
                                    <p className="font-medium text-gray-900">{sale.description}</p>
                                    <p className="text-sm text-gray-600">{new Date(sale.timestamp).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-gray-900">${sale.amount.toFixed(2)}</p>
                                    <p className="text-sm text-green-600">${sale.commissionEarned.toFixed(2)} commission</p>
                                </div>
                            </div>
                        ))}
                        {salesData.length === 0 && (
                            <p className="text-gray-500 text-center py-4">No sales data available</p>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Referrals</h3>
                    <div className="space-y-3">
                        {referrals.slice(0, 5).map((referral) => (
                            <div key={referral.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                                <div>
                                    <p className="font-medium text-gray-900">{referral.name}</p>
                                    <p className="text-sm text-gray-600">{referral.email}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-gray-900">{referral.sales} sales</p>
                                    <p className="text-sm text-green-600">${referral.commission.toFixed(2)} commission</p>
                                </div>
                            </div>
                        ))}
                        {referrals.length === 0 && (
                            <p className="text-gray-500 text-center py-4">No referrals data available</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ===============================================
// 9. SALES PAGE COMPONENT
// ===============================================
interface SalesPageProps {
    salesData: Transaction[];
    loading: boolean;
}

const SalesPage: React.FC<SalesPageProps> = ({ salesData, loading }) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Sales History</h2>
                <p className="text-gray-600">Track all your sales and commission earnings.</p>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">All Transactions</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {salesData.map((sale) => (
                                <tr key={sale._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(sale.timestamp).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {sale.description}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ${sale.amount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                                        ${sale.commissionEarned.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            sale.status === 'completed' ? 'bg-green-100 text-green-800' :
                                            sale.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {sale.type.charAt(0).toUpperCase() + sale.type.slice(1)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {salesData.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No sales data available</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// ===============================================
// 10. REFERRAL PAGE COMPONENT
// ===============================================
interface ReferralPageProps {
    referrals: Referral[];
    loading: boolean;
}

const ReferralPage: React.FC<ReferralPageProps> = ({ referrals, loading }) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Referrals</h2>
                <p className="text-gray-600">Manage and track your referred customers.</p>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Referred Customers</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {referrals.map((referral) => (
                                <tr key={referral.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {referral.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {referral.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(referral.joinDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {referral.sales}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                                        ${referral.commission.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {referrals.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No referrals data available</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
    name: string;
    email: string;
    registrationDate: Date;
    totalSales: number;
    currentCommission: number;
    referralCode: string;
}

interface Commission {
    date: string;
    amount: number;
    status: 'Pending' | 'Paid';
    type: 'Sales' | 'Referral';
}

interface Referral {
    id: string;
    name: string;
    joinDate: string;
    sales: number;
    commission: number;
}

interface Transaction {
    id: string;
    userId: string;
    referrerId: string | null;
    bagsSold: number;
    commissionEarned: number;
    timestamp: Date;
}

// ===============================================
// 2. AUTH CONTEXT
// ===============================================
interface AuthContextType {
    user: User | null;
    loading: boolean;
    logout: () => Promise<void>;
    authInstance: Auth | null;
    dbInstance: Firestore | null;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    logout: async () => { },
    authInstance: null,
    dbInstance: null,
});

const useAuth = () => useContext(AuthContext);

// ===============================================
// 3. MAIN APP COMPONENT
// ===============================================
const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [auth, setAuth] = useState<Auth | null>(null);
    const [db, setDb] = useState<Firestore | null>(null);
    const [userData, setUserData] = useState<AffiliateData | null>(null);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const initFirebase = async () => {
            try {
                const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
                const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
                const authInstance = getAuth(app);
                const dbInstance = getFirestore(app);

                setAuth(authInstance);
                setDb(dbInstance);

                const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
                if (initialAuthToken) {
                    await signInWithCustomToken(authInstance, initialAuthToken);
                } else {
                    await signInAnonymously(authInstance);
                }

                const unsubscribeAuth = authInstance.onAuthStateChanged((currentUser) => {
                    setUser(currentUser);
                    setLoading(false);
                });

                return () => unsubscribeAuth();
            } catch (e: unknown) {
                console.error("Firebase initialization failed:", e);
                if (e instanceof Error) {
                    setError(`Failed to initialize the app: ${e.message}`);
                } else {
                    setError("An unknown error occurred during app initialization.");
                }
                setLoading(false);
            }
        };

        initFirebase();
    }, []);

    useEffect(() => {
        if (!user || !db) return;

        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const docRef = doc(db, `/artifacts/${appId}/users/${user.uid}/affiliates`, user.uid);

        const unsubscribeSnapshot = onSnapshot(docRef,
            (docSnap) => {
                if (docSnap.exists()) {
                    setUserData(docSnap.data() as AffiliateData);
                    setError('');
                } else {
                    setUserData(null);
                }
            },
            (snapshotError: unknown) => {
                console.error("Error fetching user data:", snapshotError);
                if (snapshotError instanceof Error) {
                    setError(`Failed to load user data: ${snapshotError.message}`);
                } else {
                    setError("An unknown error occurred while fetching user data.");
                }
            }
        );

        return () => unsubscribeSnapshot();
    }, [user, db]);

    const handleLogout = async () => {
        if (!auth) {
            setError("Authentication service not available.");
            return;
        }
        try {
            await signOut(auth);
            setError('');
        } catch (e: unknown) {
            console.error("Logout error:", e);
            setError("Failed to log out.");
        }
    };

    const authContextValue: AuthContextType = { user, loading, logout: handleLogout, authInstance: auth, dbInstance: db };

    return (
        <AuthContext.Provider value={authContextValue}>
            <div className="min-h-screen bg-gray-100 font-inter text-gray-800">
                <main>
                    {loading ? (
                        <div className="flex justify-center items-center h-screen">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : user && userData ? (
                        <AffiliateDashboardPage user={user} userData={userData} />
                    ) : (
                        <LandingPage />
                    )}
                    {error && <div className="text-red-500 text-sm text-center mt-4">{error}</div>}
                </main>
                <footer className="bg-blue-900 text-white text-center py-4 rounded-t-lg mt-8">
                    <p className="font-inter">&copy; 2024 Epilux Water. All rights reserved.</p>
                </footer>
            </div>
        </AuthContext.Provider>
    );
};

// ===============================================
// 4. HEADER COMPONENT
// ===============================================
interface HeaderProps {
    isLoggedIn: boolean;
    onLogout?: () => void;
    onLoginClick?: () => void;
    onNavigate: (page: string) => void;
    displayName: string | null;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, onLogout, onLoginClick, onNavigate, displayName }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="bg-white shadow-md rounded-b-lg sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center">
                    <img src="https://placehold.co/100x40/5060f0/fff?text=EPILUX" alt="Epilux Water Logo" className="h-8 w-auto mr-2" />
                    <h1 className="text-2xl font-bold text-gray-800 font-inter">Epilux Water</h1>
                </div>

                {isLoggedIn ? (
                    <>
                        <div className="hidden md:flex items-center space-x-6">
                            <nav className="text-sm font-semibold text-gray-700 space-x-6">
                                <button onClick={() => onNavigate('dashboard')} className="hover:text-blue-600 transition-colors">Dashboard</button>
                                <button onClick={() => onNavigate('sales')} className="hover:text-blue-600 transition-colors">Sales</button>
                                <button onClick={() => onNavigate('referrals')} className="hover:text-blue-600 transition-colors">Referrals</button>
                            </nav>
                            <button
                                onClick={onLogout}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-200 shadow-lg font-inter"
                            >
                                Logout
                            </button>
                        </div>
                        <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                                </svg>
                            </button>
                        </div>
                    </>
                ) : (
                    <button
                        onClick={() => onLoginClick && onLoginClick()}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition-colors duration-200 shadow-md font-inter"
                    >
                        Login / Sign Up
                    </button>
                )}
            </div>
            {/* Mobile Menu */}
            {isMenuOpen && isLoggedIn && (
                <div className="md:hidden px-6 pb-4 pt-2">
                    <nav className="flex flex-col space-y-2 text-sm font-semibold text-gray-700">
                        <button onClick={() => { onNavigate('dashboard'); setIsMenuOpen(false); }} className="hover:text-blue-600 transition-colors text-left">Dashboard</button>
                        <button onClick={() => { onNavigate('sales'); setIsMenuOpen(false); }} className="hover:text-blue-600 transition-colors text-left">Sales</button>
                        <button onClick={() => { onNavigate('referrals'); setIsMenuOpen(false); }} className="hover:text-blue-600 transition-colors text-left">Referrals</button>
                    </nav>
                    <button
                        onClick={() => onLogout && onLogout()}
                        className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-200 shadow-lg font-inter"
                    >
                        Logout
                    </button>
                </div>
            )}
        </header>
    );
};

// ===============================================
// 5. LANDING PAGE COMPONENT
// ===============================================
const LandingPage: React.FC = () => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);

    const handleForgotPasswordClick = () => {
        setShowModal(false); // Close the login modal
        setShowForgotPassword(true); // Open the forgot password modal
    };

    const handleCloseForgotPassword = () => {
        setShowForgotPassword(false); // Close forgot password modal
        setShowModal(true); // Reopen the login modal
    };

    return (
        <>
            <Header isLoggedIn={false} onLoginClick={() => setShowModal(true)} onNavigate={() => { }} displayName={null} />

            <div className="relative isolate px-6 pt-14 lg:px-8 bg-cover bg-center bg-fixed" style={{ backgroundImage: `url('https://placehold.co/1920x1080/0d47a1/ffffff?text=Epilux+Water')` }}>
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="relative mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-white">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                            Join the Epilux Affiliate Program
                        </h1>
                        <p className="mt-6 text-lg leading-8">
                            Transform your network into a source of income by partnering with Epilux Water. Promote premium, clean water and earn commissions on every sale, referral, and subscription.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <button
                                onClick={() => setShowModal(true)}
                                className="rounded-full bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                            >
                                Get started
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <section className="bg-white py-16 rounded-lg shadow-inner">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                        Why Join Our Program?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-500 text-white mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.076 60.076 0 0115.79-2.104m-9.176 11.238a13.38 13.38 0 01-2.91-2.613c-2.31-2.264-3.134-4.298-2.651-7.142M1.5 8.25a1.5 1.5 0 011.5-1.5h15c.828 0 1.5.672 1.5 1.5v3.75a1.5 1.5 0 01-1.5 1.5H3a1.5 1.5 0 01-1.5-1.5V8.25zM12 9a.75.75 0 100 1.5.75.75 0 000-1.5z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2">High Commissions</h3>
                            <p className="text-gray-600 text-sm">Earn generous commissions on every sale you generate, from single bags to bulk orders and subscriptions.</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-500 text-white mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 17.5a2.5 2.5 0 10-5 0 2.5 2.5 0 005 0zM12 21a9 9 0 100-18 9 9 0 000 18z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Marketing Tools</h3>
                            <p className="text-gray-600 text-sm">Gain access to pre-designed flyers, social media templates, and a personal referral link generator to simplify your promotions.</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-500 text-white mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Referral Bonuses</h3>
                            <p className="text-gray-600 text-sm">Expand your income by referring new affiliates and earning a bonus on their sales, building a passive income stream.</p>
                        </div>
                    </div>
                </div>
            </section>

            {showModal && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-[99]">
                    <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-sm p-8">
                        <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <LoginPage onForgotPasswordClick={handleForgotPasswordClick} />
                    </div>
                </div>
            )}

            {showForgotPassword && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-[99]">
                    <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-sm p-8">
                        <button onClick={() => setShowForgotPassword(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <ForgotPasswordPage onClose={handleCloseForgotPassword} />
                    </div>
                </div>
            )}
        </>
    );
};

// ===============================================
// 2. FORGOTTEN PASSWORD PAGE (Modal Content)
// ===============================================
const ForgotPasswordPage: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { authInstance } = useAuth();
    const [email, setEmail] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setIsLoading(true);

        if (!authInstance) {
            setError("Authentication service not ready.");
            setIsLoading(false);
            return;
        }

        try {
            await sendPasswordResetEmail(authInstance, email);
            setMessage('Password reset email sent! Check your inbox.');
            setEmail(''); // Clear the input field
        } catch (e: any) {
            console.error("Password reset error:", e);
            if (e.code === 'auth/user-not-found') {
                setError("There is no user record corresponding to this email address. Please check the spelling or register for a new account.");
            } else {
                setError(e.message.replace('Firebase: ', ''));
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full p-8 bg-white rounded-lg shadow-xl max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">
                Reset Your Password
            </h2>
            <form onSubmit={handlePasswordReset} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                        required
                        disabled={isLoading}
                    />
                </div>
                {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                {message && <div className="text-green-600 text-sm text-center">{message}</div>}
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-full transition-colors duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                >
                    {isLoading ? 'Sending...' : 'Send Reset Email'}
                </button>
            </form>
            <p className="mt-6 text-center text-gray-600">
                <a href="#" onClick={onClose} className="text-blue-600 hover:underline font-semibold">
                    Return to Login
                </a>
            </p>
        </div>
    );
};

// ===============================================
// 3. LOGIN & REGISTER COMPONENT
// ===============================================
const LoginPage: React.FC<{ onForgotPasswordClick: () => void }> = ({ onForgotPasswordClick }) => {
    const { authInstance, dbInstance } = useAuth();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isRegistering, setIsRegistering] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const [referralCode, setReferralCode] = useState<string>('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!authInstance || !dbInstance) return setError("Authentication service not ready.");
        try {
            const userCredential = await signInWithEmailAndPassword(authInstance, email, password);
            const uid = userCredential.user.uid;
            const docRef = doc(dbInstance, `/artifacts/${App}/users/${uid}/affiliates`, uid);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                await signOut(authInstance);
                setError("You are not a registered affiliate. Please register to access the portal.");
            }
        } catch (e: any) {
            console.error("Login error:", e);
            if (e.code === 'auth/invalid-credential' || e.code === 'auth/wrong-password' || e.code === 'auth/user-not-found') {
                setError("Incorrect email or password. Please try again.");
            } else {
                setError(e.message.replace('Firebase: ', ''));
            }
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!authInstance || !dbInstance) return setError("Services not available.");

        try {
            let user: User;
            let userCredential;

            try {
                userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
                user = userCredential.user;
            } catch (createError: any) {
                if (createError.code === 'auth/email-already-in-use') {
                    userCredential = await signInWithEmailAndPassword(authInstance, email, password);
                    user = userCredential.user;
                } else {
                    setError(createError.message.replace('Firebase: ', ''));
                    return;
                }
            }

            if (user) {
                const uid = user.uid;
                const uniqueReferralCode = 'EPILUX-' + uid.slice(0, 6).toUpperCase();

                const docRef = doc(dbInstance, `/artifacts/${App}/users/${uid}/affiliates`, uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setError("You are already a registered affiliate. Please log in.");
                    return;
                }

                await setDoc(docRef, {
                    name,
                    email,
                    registrationDate: new Date(),
                    totalSales: 0,
                    currentCommission: 0,
                    referralCode: uniqueReferralCode
                } as AffiliateData);

                const referralCodeDocRef = doc(dbInstance, `/artifacts/${App}/public/data/referralCodes`, uniqueReferralCode);
                await setDoc(referralCodeDocRef, { uid });

                if (referralCode) {
                    const q = query(collection(dbInstance, `/artifacts/${App}/public/data/referralCodes`), where("code", "==", referralCode));
                    const querySnapshot = await getDocs(q);
                    if (!querySnapshot.empty) {
                        const referrerDoc = querySnapshot.docs[0];
                        const referrerUid = referrerDoc.data().uid;
                        await addDoc(collection(dbInstance, `/artifacts/${App}/public/data/transactions`), {
                            userId: uid,
                            referrerId: referrerUid,
                            bagsSold: 0,
                            commissionEarned: 500, // Example referral bonus
                            timestamp: new Date()
                        } as Transaction);
                        const referrerRef = doc(dbInstance, `/artifacts/${App}/users/${referrerUid}/affiliates`, referrerUid);
                        const referrerData = (await getDoc(referrerRef)).data() as AffiliateData;
                        await updateDoc(referrerRef, {
                            currentCommission: referrerData.currentCommission + 500,
                        });
                    }
                }
                setError('');
            }
        } catch (e: any) {
            console.error("Registration error:", e);
            setError(e.message.replace('Firebase: ', ''));
        }
    };

    const isFormDisabled = !authInstance || !dbInstance;

    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">
                {isRegistering ? 'Create Your Account' : 'Log In to Your Dashboard'}
            </h2>
            <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-6">
                {isRegistering && (
                    <>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-200"
                                required
                                disabled={isFormDisabled}
                            />
                        </div>
                        <div>
                            <label htmlFor="referralCode" className="block text-sm font-medium text-gray-700">Referral Code (Optional)</label>
                            <input
                                type="text"
                                id="referralCode"
                                value={referralCode}
                                onChange={(e) => setReferralCode(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-200"
                                disabled={isFormDisabled}
                            />
                        </div>
                    </>
                )}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-200"
                        required
                        disabled={isFormDisabled}
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-200"
                        required
                        disabled={isFormDisabled}
                    />
                </div>
                {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-full transition-colors duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed" disabled={isFormDisabled}>
                    {isRegistering ? 'Create Account' : 'Login'}
                </button>
            </form>
            <p className="mt-6 text-center text-gray-600">
                {isRegistering ? (
                    <>Already have an account? <a href="#" onClick={() => setIsRegistering(false)} className="text-blue-600 hover:underline font-semibold">Login here</a></>
                ) : (
                    <>Don't have an account? <a href="#" onClick={() => setIsRegistering(true)} className="text-blue-600 hover:underline font-semibold">Register as an affiliate</a></>
                )}
                {!isRegistering && (
                    <span className="block mt-2">
                        <a href="#" onClick={onForgotPasswordClick} className="text-blue-600 hover:underline font-semibold">Forgot password?</a>
                    </span>
                )}
            </p>
        </div>
    );
};


// ===============================================
// 7. OTHER COMPONENTS (with prop types)
// ===============================================
interface AffiliateDashboardPageProps {
    user: User;
    userData: AffiliateData | null;
}
const AffiliateDashboardPage: React.FC<AffiliateDashboardPageProps> = ({ user, userData }) => {
    const { logout } = useAuth();
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [salesData, setSalesData] = useState<Transaction[]>([]);
    const [referrals, setReferrals] = useState<Referral[]>([]);
    const { dbInstance, authInstance } = useAuth();
    const displayName = userData?.name || 'Affiliate';

    // Fetch sales data
    useEffect(() => {
        if (!dbInstance || !authInstance?.currentUser) return;
        const q = query(
            collection(dbInstance, `transactions`),
            where("userId", "==", authInstance.currentUser.uid)
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const sales = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Transaction[];
            setSalesData(sales);
        });
        return () => unsubscribe();
    }, [dbInstance, authInstance?.currentUser]);

    // Fetch referrals
    useEffect(() => {
        if (!dbInstance || !authInstance?.currentUser) return;
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const q = query(
            collection(dbInstance, `/artifacts/${appId}/users/${authInstance.currentUser.uid}/affiliates`),
            where("referralCode", "==", userData?.referralCode)
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const referredUsers = snapshot.docs.map(doc => ({
                id: doc.id,
                name: doc.data().name,
                joinDate: new Date(doc.data().registrationDate).toLocaleDateString(),
                sales: doc.data().totalSales,
                commission: doc.data().currentCommission,
            })) as Referral[];
            setReferrals(referredUsers);
        });
        return () => unsubscribe();
    }, [dbInstance, authInstance?.currentUser, userData?.referralCode]);

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return <DashboardContent salesData={salesData} referrals={referrals} />;
            case 'sales':
                return <SalesPage salesData={salesData} />;
            case 'referrals':
                return <ReferralPage referrals={referrals} />;
            default:
                return <DashboardContent salesData={salesData} referrals={referrals} />;
        }
    };

    return (
        <>
            <Header isLoggedIn={true} onLogout={logout} onNavigate={setCurrentPage} displayName={displayName} />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-blue-800 mb-2">Welcome, {displayName}!</h1>
                <p className="text-gray-600 mb-6">User ID: <span className="font-mono text-xs bg-gray-200 p-1 rounded-md">{user?.uid || 'N/A'}</span></p>
                <p className="text-gray-600 mb-6">Your Referral Code: <span className="font-mono font-bold text-sm bg-gray-200 p-1 rounded-md">{userData?.referralCode || 'N/A'}</span></p>
                {renderPage()}
            </div>
        </>
    );
};

interface DashboardContentProps {
    salesData: Transaction[];
    referrals: Referral[];
}
const DashboardContent: React.FC<DashboardContentProps> = ({ salesData, referrals }) => {
    const totalBagsSold = salesData.reduce((sum, sale) => sum + sale.bagsSold, 0);
    const totalCommission = salesData.reduce((sum, sale) => sum + sale.commissionEarned, 0);
    const totalReferralBonus = referrals.reduce((sum, ref) => sum + ref.commission, 0);

    const salesGraphData = salesData.reduce((acc, curr) => {
        const date = new Date(curr.timestamp).toLocaleDateString();
        const existingEntry = acc.find(item => item.name === date);
        if (existingEntry) {
            existingEntry.sales += curr.bagsSold;
        } else {
            acc.push({ name: date, sales: curr.bagsSold });
        }
        return acc;
    }, [] as { name: string; sales: number; }[]).sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-blue-100 p-4 rounded-lg shadow-md flex flex-col items-center justify-center text-center">
                    <h3 className="text-sm font-semibold text-blue-800 mb-2">Total Sales</h3>
                    <p className="text-2xl font-bold text-blue-600 mt-2">{totalBagsSold} Bags</p>
                </div>
                <div className="bg-green-100 p-4 rounded-lg shadow-md flex flex-col items-center justify-center text-center">
                    <h3 className="text-sm font-semibold text-green-800 mb-2">Total Commission</h3>
                    <p className="text-2xl font-bold text-green-600 mt-2">₦{totalCommission.toLocaleString()}</p>
                </div>
                <div className="bg-yellow-100 p-4 rounded-lg shadow-md flex flex-col items-center justify-center text-center">
                    <h3 className="text-sm font-semibold text-yellow-800 mb-2">Active Referrals</h3>
                    <p className="text-2xl font-bold text-yellow-600 mt-2">{referrals.length}</p>
                </div>
                <div className="bg-purple-100 p-4 rounded-lg shadow-md flex flex-col items-center justify-center text-center">
                    <h3 className="text-sm font-semibold text-purple-800 mb-2">Referral Bonus</h3>
                    <p className="text-2xl font-bold text-purple-600 mt-2">₦{totalReferralBonus.toLocaleString()}</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-xl" id="sales">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Sales Tracker</h3>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={salesGraphData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <CommissionHistory commissions={salesData.map(s => ({
                date: new Date(s.timestamp).toLocaleDateString(),
                amount: s.commissionEarned,
                status: 'Paid',
                type: 'Sales'
            }))} />
        </div>
    );
};

interface SalesPageProps {
    salesData: Transaction[];
}
const SalesPage: React.FC<SalesPageProps> = ({ salesData }) => {
    const { dbInstance, user } = useAuth();
    const [bags, setBags] = useState<number>(1);
    const [status, setStatus] = useState<string>('');

    const handleLogSale = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!dbInstance || !user) {
            setStatus("Error: Services not available.");
            return;
        }

        const commissionRate = 50; // ₦50 per bag
        const commissionEarned = bags * commissionRate;
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

        try {
            // First, get the current user data to ensure the update is based on the latest values
            const userRef = doc(dbInstance, `/artifacts/${appId}/users/${user.uid}/affiliates`, user.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const currentData = userSnap.data() as AffiliateData;

                // Add new transaction
                await addDoc(collection(dbInstance, `transactions`), {
                    userId: user.uid,
                    referrerId: null, // This is a sale, not a referral signup
                    bagsSold: bags,
                    commissionEarned: commissionEarned,
                    timestamp: new Date()
                });

                // Update user's total sales and commission
                await updateDoc(userRef, {
                    totalSales: currentData.totalSales + bags,
                    currentCommission: currentData.currentCommission + commissionEarned
                });

                setStatus("Sale logged successfully!");
                setBags(1);
            } else {
                setStatus("User data not found. Please log in again.");
            }
        } catch (e) {
            console.error("Error logging sale:", e);
            setStatus("Error logging sale. Please try again.");
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-xl" id="sales">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Log a New Sale</h3>
            <form onSubmit={handleLogSale} className="space-y-4 mb-8">
                <div>
                    <label htmlFor="bags" className="block text-sm font-medium text-gray-700">Number of Bags Sold</label>
                    <input
                        type="number"
                        id="bags"
                        value={bags}
                        onChange={(e) => setBags(parseInt(e.target.value))}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                        min="1"
                        required
                    />
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                    Log Sale
                </button>
            </form>
            {status && <div className="text-sm text-center mb-4">{status}</div>}
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Sales History</h3>
            <ul className="space-y-4">
                {salesData.map((sale) => (
                    <li key={sale.id} className="bg-gray-50 p-4 rounded-lg shadow-sm flex justify-between items-center">
                        <div>
                            <p className="font-semibold text-gray-800">{sale.bagsSold} bags sold</p>
                            <p className="text-sm text-gray-500">{new Date(sale.timestamp).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold text-green-600">₦{sale.commissionEarned.toLocaleString()}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

interface ReferralPageProps {
    referrals: Referral[];
}
const ReferralPage: React.FC<ReferralPageProps> = ({ referrals }) => (
    <div className="bg-white p-6 rounded-lg shadow-xl" id="referrals">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Your Referred Affiliates</h3>
        <ul className="space-y-4">
            {referrals.length === 0 ? (
                <p className="text-gray-500">You haven't referred any affiliates yet.</p>
            ) : (
                referrals.map((ref) => (
                    <li key={ref.id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <p className="font-semibold text-gray-800">{ref.name}</p>
                        <p className="text-sm text-gray-500">Joined: {ref.joinDate}</p>
                        <p className="text-sm text-gray-700">Sales: {ref.sales} bags</p>
                        <p className="text-sm text-green-600">Earned from this referral: ₦{ref.commission.toLocaleString()}</p>
                    </li>
                ))
            )}
        </ul>
    </div>
);

interface CommissionHistoryProps {
    commissions: Commission[];
}
const CommissionHistory: React.FC<CommissionHistoryProps> = ({ commissions }) => (
    <div className="bg-white p-6 rounded-lg shadow-xl" id="commission-history">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Commission History</h3>
        <ul className="space-y-4">
            {commissions.map((c, index) => (
                <li key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm flex justify-between items-center">
                    <div>
                        <p className="font-semibold text-gray-800">{c.type}</p>
                        <p className="text-sm text-gray-500">{c.date}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-bold" style={{ color: c.status === 'Paid' ? '#22c55e' : '#f59e0b' }}>
                            ₦{c.amount.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">{c.status}</p>
                    </div>
                </li>
            ))}
        </ul>
    </div>
);

export default App;

    </div>
);

export default App;
