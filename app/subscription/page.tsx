'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useStripe } from '../../hooks/useStripe';
import { useUser } from '../context/UserContext';
import { PLANS } from '../../lib/plans';

const SubscriptionPage = () => {
  const { createCheckoutSession, loading, error } = useStripe();
  const { user, isAuthenticated, setUser } = useUser();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const currentPlan = user?.subscription?.planType || 'FREE';
  const usageStats = {
    emojisCreated: user?.subscription?.usageCount || 0,
    emojisRemaining: (user?.subscription?.usageLimit || 5) - (user?.subscription?.usageCount || 0),
    totalLimit: user?.subscription?.usageLimit || 5,
    daysUntilReset: 15,
    planType: user?.subscription?.planType || 'FREE',
    status: user?.subscription?.status || 'active'
  };

  // Check for success parameter and refresh user data
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const sessionId = urlParams.get('session_id');
    const userId = urlParams.get('user_id');

    if (success === 'true' && sessionId) {
      console.log('Payment success detected, session:', sessionId, 'user:', userId);

      // Show success message
      setSuccessMessage('🎉 Payment successful! Your plan has been upgraded.');

      // Refresh user data - handle both authenticated and guest users
      setTimeout(() => refreshUserData(userId || undefined), 1000);

      // Clean URL
      const url = new URL(window.location.href);
      url.searchParams.delete('success');
      url.searchParams.delete('session_id');
      url.searchParams.delete('user_id');
      window.history.replaceState({}, document.title, url.pathname);

      // Hide success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  }, [isAuthenticated]);

  const refreshUserData = async (specificUserId?: string) => {
    const targetUserId = specificUserId || user?.id;

    if (targetUserId) {
      try {
        console.log('Refreshing user data for:', targetUserId);

        const response = await fetch('/api/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: targetUserId })
        });

        if (response.ok) {
          const userData = await response.json();
          console.log('User data refreshed:', userData);

          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));

          // If this was a guest user upgrade, they should now be authenticated
          if (specificUserId && !user) {
            console.log('Guest user upgraded to authenticated user');
          }
        } else {
          console.error('Failed to refresh user data - response not ok:', response.status);
        }
      } catch (error) {
        console.error('Failed to refresh user data:', error);
      }
    } else {
      console.log('No user ID available for refresh');
    }
  };

  const handlePlanSelection = async (planType: 'FREE' | 'PREMIUM') => {
    if (!isAuthenticated) {
      window.location.href = '/?auth=signup';
      return;
    }

    try {
      if (planType === 'FREE') {
        await createCheckoutSession('FREE', 'monthly', user?.id || 'guest-user', user?.email || '');
      } else {
        await createCheckoutSession('PREMIUM', 'monthly', user?.id || 'guest-user', user?.email || '');
      }

      // Refresh user data after successful action
      setTimeout(refreshUserData, 1000);
    } catch (error) {
      console.error('Plan selection error:', error);
    }
  };

  const plans = [
    PLANS.FREE,
    PLANS.PREMIUM
  ];

  return (
    <div className="relative min-h-screen bg-[#0A0A0A]">
      {/* Enhanced background with space theme */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Radial gradient base */}
        <div className="absolute inset-0 bg-gradient-radial from-gray-950/30 via-black to-black"></div>
        
        {/* Dark texture overlay */}
        <div className="absolute inset-0 opacity-30 bg-[url('/noise-texture.png')] mix-blend-overlay"></div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 z-0 grid-animation pointer-events-none">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.1]"></div>
        </div>
        
        {/* Light streaks */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="light-streak light-streak-1 opacity-30"></div>
          <div className="light-streak light-streak-2 opacity-30"></div>
          <div className="light-streak light-streak-3 opacity-30"></div>
        </div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
          <div className="particle particle-4"></div>
          <div className="particle particle-5"></div>
          <div className="particle particle-6"></div>
        </div>
        
        {/* Animated gradient glow */}
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[50%] bg-gradient-to-br from-gray-900/10 via-gray-700/5 to-transparent rounded-full blur-3xl animate-glow-slow"></div>
        <div className="absolute top-[60%] -right-[20%] w-[60%] h-[40%] bg-gradient-to-br from-gray-900/10 via-gray-800/5 to-transparent rounded-full blur-3xl animate-glow-slow-reverse"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-black/40 backdrop-blur-xl border-b border-gray-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="group p-2 rounded-lg bg-black/40 hover:bg-black/60 border border-gray-500/20 hover:border-gray-400/40 transition-all duration-300"
            >
              <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold text-white">Usage & Subscription</h1>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="relative z-10 px-4 mb-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-center">
              <p className="text-green-400 text-sm font-medium">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="relative z-10 px-4 mb-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-center">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Title */}
        <div className="text-center mb-12 opacity-0 animate-[fadeIn_1s_ease-out_forwards]">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            <span className="text-white">Your Current</span>
            <span className="text-[#ff6b2b] inline-block"> Plan</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Track your usage and upgrade when you're ready for unlimited possibilities
          </p>

          {/* Current Plan Badge */}
          <div className="mt-6 flex justify-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-black/60 backdrop-blur-xl border border-gray-500/30 rounded-full">
              <div className={`w-3 h-3 rounded-full ${
                currentPlan === 'PREMIUM' ? 'bg-[#ff6b2b]' : 'bg-gray-400'
              } animate-pulse`}></div>
              <span className="text-white font-semibold">
                Current Plan: {currentPlan === 'PREMIUM' ? 'Premium' : 'Free'}
                {currentPlan === 'PREMIUM' && user?.subscription?.billingFrequency && (
                  <span className="text-gray-300 text-sm ml-2">
                    ({user.subscription.billingFrequency})
                  </span>
                )}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                usageStats.status === 'active' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
              }`}>
                {usageStats.status}
              </span>
            </div>
          </div>
        </div>

        {/* Current Usage - Simple Card */}
        <div className="mb-12 opacity-0 animate-[fadeIn_1s_ease-out_0.3s_forwards]">
          <div className="relative group max-w-2xl mx-auto">
            {/* Decorative elements */}
            <div className="absolute -inset-1 bg-gradient-to-r from-gray-500 via-gray-400 to-gray-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            
            {/* Main card with enhanced glass effect */}
            <div className="relative bg-black/40 rounded-2xl p-1 backdrop-blur-xl border border-gray-500/20">
              <div className="absolute inset-0 bg-gradient-radial from-gray-500/10 via-transparent to-transparent blur-xl"></div>
              
              <div className="relative p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-6">Current Usage</h3>
                
                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Emojis Created</span>
                    <span className="text-white font-medium">{usageStats.emojisCreated}/{usageStats.totalLimit}</span>
                  </div>
                  <div className="w-full bg-black/60 rounded-full h-3 border border-gray-500/30">
                    <div 
                      className="bg-gradient-to-r from-gray-600 via-gray-500 to-gray-400 h-3 rounded-full transition-all duration-500 shadow-lg"
                      style={{ width: `${(usageStats.emojisCreated / usageStats.totalLimit) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#ff6b2b] mb-2">{usageStats.emojisRemaining}</div>
                  <div className="text-gray-400">Emojis remaining</div>
                  <div className="text-sm text-gray-500 mt-2">Resets in {usageStats.daysUntilReset} days</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Plans Grid - Now 2 plans matching pricing page */}
        <div className="opacity-0 animate-[fadeIn_1s_ease-out_0.6s_forwards]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {plans.map((plan, index) => (
              <div key={plan.name} className="relative group">
                <div className={`absolute -inset-1 rounded-2xl blur transition-all duration-1000 ${
                  plan.name === currentPlan
                    ? 'bg-gradient-to-r from-[#ff6b2b] via-[#ff69b4] to-[#ff6b2b] opacity-40'
                    : 'bg-gradient-to-r from-gray-500 via-gray-400 to-gray-600 opacity-20 group-hover:opacity-30'
                }`}></div>
                
                <div className={`relative bg-black/40 backdrop-blur-xl rounded-2xl p-1 border transition-all duration-300 hover:scale-105 ${
                  plan.name === currentPlan
                    ? 'border-[#ff6b2b]/60 ring-2 ring-[#ff6b2b]/20'
                    : 'border-gray-500/20 hover:border-gray-400/40'
                }`}>
                  <div className="absolute inset-0 bg-gradient-radial from-gray-500/10 via-transparent to-transparent blur-xl"></div>
                  
                  {plan.name === currentPlan && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-[#ff6b2b] via-[#ff69b4] to-[#ff6b2b] text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                        Current Plan
                      </span>
                    </div>
                  )}
                  
                  <div className="relative p-6 text-center">
                    <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                    <div className="text-3xl font-bold text-white mb-1">${plan.price.monthly}</div>
                    <div className="text-gray-400 text-sm mb-6">per month</div>

                    <ul className="space-y-3 mb-8 text-left">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-3">
                          <svg className="w-4 h-4 text-[#ff6b2b] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handlePlanSelection(plan.name as 'FREE' | 'PREMIUM')}
                      disabled={loading || plan.name === currentPlan}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                        plan.name === currentPlan
                          ? 'bg-gradient-to-r from-[#ff6b2b] via-[#ff69b4] to-[#ff6b2b] text-white cursor-not-allowed border border-[#ff6b2b]/30'
                          : plan.name === 'PREMIUM'
                          ? 'bg-gradient-to-r from-[#ff6b2b] via-[#ff69b4] to-[#ff6b2b] hover:from-[#ff6b2b]/90 hover:via-[#ff69b4]/90 hover:to-[#ff6b2b]/90 text-white hover:shadow-lg hover:shadow-[#ff6b2b]/20 disabled:opacity-50 disabled:cursor-not-allowed'
                          : 'bg-black/60 text-gray-300 cursor-not-allowed border border-gray-500/30'
                      }`}
                    >
                      {loading ? 'Processing...' : plan.name === currentPlan ? 'Current Plan' : plan.name === 'PREMIUM' ? 'Upgrade to Premium' : 'Free Plan'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Simple CTA Section */}
        <div className="mt-16 text-center opacity-0 animate-[fadeIn_1s_ease-out_0.9s_forwards]">
          <div className="relative group max-w-2xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-gray-500 via-gray-400 to-gray-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-gray-500/20">
              <div className="absolute inset-0 bg-gradient-radial from-gray-500/10 via-transparent to-transparent blur-xl"></div>
              <div className="relative">
                <h3 className="text-2xl font-bold text-white mb-4">Ready to Upgrade?</h3>
                <p className="text-gray-400 mb-6">
                  Get unlimited emoji generations and premium features with our Premium plan
                </p>
                <Link href="/pricing" className="inline-block px-6 py-3 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-400 hover:from-gray-500 hover:via-gray-400 hover:to-gray-300 text-white rounded-lg font-medium transition-all duration-300 shadow-lg shadow-gray-500/20 hover:shadow-gray-500/30">
                  View All Plans
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
