/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable @typescript-eslint/no-explicit-any */

"use client"
import React, { useState, useEffect, createContext, useContext } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, Auth, User, signInAnonymously, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, onSnapshot, collection, query, where, addDoc, Firestore, DocumentData, updateDoc, getDocs } from 'firebase/firestore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// ===============================================
// 1. INTERFACES & DATA MODELS
// ===============================================
interface AffiliateData extends DocumentData {
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
