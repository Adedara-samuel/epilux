'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AffiliateReferrals from '@/Components/affiliate/AffiliateReferrals';
import { useAffiliateReferrals } from '@/hooks/useAffiliate';

export default function ReferralsPage() {
  const { user } = useAuth();
  const router = useRouter();
  // Fetch API data via hooks
  const referrals = useAffiliateReferrals();

  console.log('Referrals data:', referrals.data);
  console.log('Referrals error:', referrals.error);

  // Add global animations
  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      @keyframes bounceIn { from { transform: scale(0.3); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
      @keyframes shimmer { 0% { background-position: -200px 0; } 100% { background-position: calc(200px + 100%) 0; } }

      .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
      .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
      .animate-slideUp { animation: slideUp 0.4s ease-out; }
      .animate-bounceIn { animation: bounceIn 0.6s ease-out; }
      .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      .animate-float { animation: float 3s ease-in-out infinite; }
      .animate-shimmer { animation: shimmer 2s infinite linear; }

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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Add null check for user.role
  if (!user.role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h2>
          <p className="text-gray-600 mb-6">
            Please wait while we load your account information.
          </p>
        </div>
      </div>
    );
  }

  // Check if user has access to referrals (affiliate or user role)
  if (user.role !== 'affiliate' && user.role !== 'user') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🚫</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access the referrals page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">

      <div className="container mx-auto px-6 py-8">
        <div className="animate-fadeIn animation-delay-600">
          <AffiliateReferrals referralsData={referrals.data} />
        </div>
      </div>
    </div>
  );
}