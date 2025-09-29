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
    logout: async () => {},
    token: null,
});

const useAuth = () => useContext(AuthContext);

// API Service
const apiService = {
    get: async (endpoint: string, token: string) => {
        const response = await fetch(`http://localhost:5000/api${endpoint}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    },
    
    post: async (endpoint: string, data: any, token: string) => {
        const response = await fetch(`http://localhost:5000/api${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }
};

// ===============================================
// 3. MAIN APP COMPONENT
// ===============================================
const App = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState('landing');
    const [userData, setUserData] = useState<AffiliateData | null>(null);
    const [salesData, setSalesData] = useState<Transaction[]>([]);
    const [referrals, setReferrals] = useState<Referral[]>([]);
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [token, setToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            fetchAffiliateProfile(storedToken, JSON.parse(storedUser));
        } else {
            setLoading(false);
        }
    }, []);

    const fetchAffiliateProfile = async (authToken: string, currentUser: User) => {
        try {
            const profileData = await apiService.get('/affiliate/profile', authToken);
            setUserData(profileData);
            
            // Fetch sales data
            const sales = await apiService.get('/affiliate/sales', authToken);
            setSalesData(sales);
            
            // Fetch referrals
            const referralData = await apiService.get('/affiliate/referrals', authToken);
            setReferrals(referralData);
            
            // Fetch dashboard summary
            const dashboard = await apiService.get('/affiliate/dashboard', authToken);
            setDashboardData(dashboard);
            
        } catch (err) {
            console.error('Error fetching affiliate data:', err);
            setError('Failed to fetch affiliate data');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
        setUserData(null);
        setSalesData([]);
        setReferrals([]);
        setDashboardData(null);
        setCurrentPage('landing');
    };

    const handleLogin = (loggedInUser: User, authToken: string) => {
        setUser(loggedInUser);
        setToken(authToken);
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        fetchAffiliateProfile(authToken, loggedInUser);
        setCurrentPage('dashboard');
    };

    const handleNavigate = (page: string) => {
        setCurrentPage(page);
    };

    const authValue = {
        user,
        loading,
        logout: handleLogout,
        token
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={authValue}>
            <div className="min-h-screen bg-gray-50">
                {currentPage === 'landing' && (
                    <LandingPage onNavigate={handleNavigate} />
                )}
                {currentPage === 'login' && (
                    <LoginPage onLoginSuccess={handleLogin} onNavigate={handleNavigate} />
                )}
                {currentPage === 'dashboard' && user && userData && (
                    <AffiliateDashboardPage 
                        user={user} 
                        userData={userData} 
                        token={token} 
                        onNavigate={handleNavigate}
                    />
                )}
                {currentPage === 'sales' && user && (
                    <SalesPage salesData={salesData} onNavigate={handleNavigate} />
                )}
                {currentPage === 'referrals' && user && (
                    <ReferralPage referrals={referrals} onNavigate={handleNavigate} />
                )}
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
    return (
        <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <h1 className="text-xl font-bold text-gray-900">Affiliate Program</h1>
                        </div>
                        <nav className="ml-6 flex space-x-8">
                            <button
                                onClick={() => onNavigate('dashboard')}
                                className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-indigo-500 text-sm font-medium"
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={() => onNavigate('sales')}
                                className="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium"
                            >
                                Sales
                            </button>
                            <button
                                onClick={() => onNavigate('referrals')}
                                className="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium"
                            >
                                Referrals
                            </button>
                        </nav>
                    </div>
                    <div className="flex items-center">
                        {isLoggedIn ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-700">Welcome, {displayName}</span>
                                <button
                                    onClick={onLogout}
                                    className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={onLoginClick}
                                className="text-gray-500 hover:text-gray-700 text-sm font-medium"
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
interface LandingPageProps {
    onNavigate: (page: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <Header 
                isLoggedIn={!!user} 
                onLoginClick={() => onNavigate('login')} 
                onNavigate={onNavigate}
                displayName={user ? `${user.firstName} ${user.lastName}` : null}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                        Affiliate Program
                    </h1>
                    <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
                        Earn commissions by referring customers to our products
                    </p>
                    <div className="mt-8 flex justify-center">
                        <div className="inline-flex rounded-md shadow">
                            <button
                                onClick={() => onNavigate(user ? 'dashboard' : 'login')}
                                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                {user ? 'Go to Dashboard' : 'Get Started'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-20">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">Competitive Commissions</h3>
                                <div className="mt-2 max-w-xl text-sm text-gray-500">
                                    <p>Earn up to 10% commission on every sale you refer.</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">Real-time Tracking</h3>
                                <div className="mt-2 max-w-xl text-sm text-gray-500">
                                    <p>Track your clicks, conversions, and earnings in real-time.</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">Monthly Payouts</h3>
                                <div className="mt-2 max-w-xl text-sm text-gray-500">
                                    <p>Get paid monthly via bank transfer or PayPal.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ===============================================
// 6. LOGIN & REGISTER COMPONENT
// ===============================================
interface LoginPageProps {
    onLoginSuccess: (user: User, token: string) => void;
    onNavigate: (page: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigate }) => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

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

            if (response.ok) {
                onLoginSuccess(data.user, data.token);
            } else {
                setError(data.message || 'Authentication failed');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    {isLoginMode ? 'Sign in to your account' : 'Create your account'}
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {!isLoginMode && (
                            <>
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                        First Name
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="firstName"
                                            name="firstName"
                                            type="text"
                                            required={!isLoginMode}
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                        Last Name
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="lastName"
                                            name="lastName"
                                            type="text"
                                            required={!isLoginMode}
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-600 text-sm">{error}</div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {loading ? 'Processing...' : (isLoginMode ? 'Sign in' : 'Sign up')}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    {isLoginMode ? "Don't have an account?" : "Already have an account?"}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={() => setIsLoginMode(!isLoginMode)}
                                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                {isLoginMode ? 'Sign up' : 'Sign in'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
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
    onNavigate: (page: string) => void;
}

const AffiliateDashboardPage: React.FC<AffiliateDashboardPageProps> = ({ user, userData, token, onNavigate }) => {
    const [salesData, setSalesData] = useState<Transaction[]>([]);
    const [referrals, setReferrals] = useState<Referral[]>([]);
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (token) {
            fetchDashboardData();
        }
    }, [token]);

    const fetchDashboardData = async () => {
        if (!token) return;
        
        try {
            const [sales, referralData, dashboard] = await Promise.all([
                apiService.get('/affiliate/sales', token),
                apiService.get('/affiliate/referrals', token),
                apiService.get('/affiliate/dashboard', token)
            ]);
            
            setSalesData(sales);
            setReferrals(referralData);
            setDashboardData(dashboard);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleRecordSale = async () => {
        if (!token) return;
        
        try {
            const bagsSold = prompt('Enter number of bags sold:');
            if (!bagsSold) return;
            
            const amount = parseFloat(prompt('Enter sale amount:') || '0');
            if (!amount) return;
            
            await apiService.post('/affiliate/record-sale', {
                bagsSold: parseInt(bagsSold),
                amount: amount
            }, token);
            
            // Refresh data
            await fetchDashboardData();
        } catch (err) {
            console.error('Error recording sale:', err);
            setError('Failed to record sale');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header 
                isLoggedIn={true} 
                onLogout={() => {}} 
                onNavigate={onNavigate}
                displayName={`${user.firstName} ${user.lastName}`}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Affiliate Dashboard</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Welcome back, {user.firstName}! Here's your affiliate performance overview.
                    </p>
                </div>

                {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                <DashboardContent 
                    salesData={salesData} 
                    referrals={referrals} 
                    dashboardData={dashboardData} 
                    loading={loading}
                    onRecordSale={handleRecordSale}
                />
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
    onRecordSale?: () => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ salesData, referrals, dashboardData, loading, onRecordSale }) => {
    const chartData = salesData.map(sale => ({
        date: new Date(sale.timestamp).toLocaleDateString(),
        amount: sale.amount,
        commission: sale.commissionEarned
    }));

    return (
        <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Sales</dt>
                                    <dd className="flex items-baseline">
                                        <div className="text-2xl font-semibold text-gray-900">
                                            {dashboardData?.totalSales || 0}
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Commission</dt>
                                    <dd className="flex items-baseline">
                                        <div className="text-2xl font-semibold text-gray-900">
                                            ${(dashboardData?.totalCommissionEarned || 0).toFixed(2)}
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Referrals</dt>
                                    <dd className="flex items-baseline">
                                        <div className="text-2xl font-semibold text-gray-900">
                                            {dashboardData?.totalReferrals || 0}
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Referral Code</dt>
                                    <dd className="flex items-baseline">
                                        <div className="text-lg font-semibold text-gray-900">
                                            {dashboardData?.referralCode || 'N/A'}
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart Section */}
            <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Sales Performance</h3>
                    <div className="mt-4 h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="amount" stroke="#8884d8" />
                                <Line type="monotone" dataKey="commission" stroke="#82ca9d" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
                <button
                    onClick={onRecordSale}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Record Sale
                </button>
            </div>
        </div>
    );
};

// ===============================================
// 9. SALES PAGE COMPONENT
// ===============================================
interface SalesPageProps {
    salesData: Transaction[];
    onNavigate: (page: string) => void;
}

const SalesPage: React.FC<SalesPageProps> = ({ salesData, onNavigate }) => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50">
            <Header 
                isLoggedIn={true} 
                onLogout={() => {}} 
                onNavigate={onNavigate}
                displayName={user ? `${user.firstName} ${user.lastName}` : null}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Sales History</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        View all your sales and commission earnings.
                    </p>
                </div>

                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Bags Sold
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Commission
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {salesData.map((sale) => (
                                        <tr key={sale._id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {new Date(sale.timestamp).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {sale.bagsSold}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                ${sale.amount.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                ${sale.commissionEarned.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    sale.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    sale.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {sale.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ===============================================
// 10. REFERRAL PAGE COMPONENT
// ===============================================
interface ReferralPageProps {
    referrals: Referral[];
    onNavigate: (page: string) => void;
}

const ReferralPage: React.FC<ReferralPageProps> = ({ referrals, onNavigate }) => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50">
            <Header 
                isLoggedIn={true} 
                onLogout={() => {}} 
                onNavigate={onNavigate}
                displayName={user ? `${user.firstName} ${user.lastName}` : null}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Referrals</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Track your referred customers and their performance.
                    </p>
                </div>

                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Join Date
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Sales
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Commission
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {referrals.map((referral) => (
                                        <tr key={referral.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                ${referral.commission.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
