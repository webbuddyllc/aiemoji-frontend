'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckIcon, XMarkIcon, StarIcon, BoltIcon, ShieldCheckIcon, UserGroupIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { useStripe } from '../../hooks/useStripe';
import { useUser } from '../context/UserContext';
import { PLANS } from '../../lib/plans';

const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const { createCheckoutSession, loading, error } = useStripe();
  const { user, isAuthenticated, setUser } = useUser();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const currentPlan = user?.subscription?.planType || 'FREE';

  // Debug logging on component mount
  useEffect(() => {
    console.log('📄 Pricing page mounted');
    console.log('🔐 Initial authentication state:', isAuthenticated);
    console.log('👤 Initial user data:', user);
    console.log('💳 Stripe publishable key available:', !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  }, []);

  // Debug logging when auth state changes
  useEffect(() => {
    console.log('🔄 Pricing page - auth state changed:', isAuthenticated);
    console.log('👤 User data updated:', user);
  }, [isAuthenticated, user]);

  // Check for success parameter and refresh user data
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const sessionId = urlParams.get('session_id');
    const userId = urlParams.get('user_id');

    if (success === 'true' && sessionId) {
      console.log('Payment success detected on pricing page, session:', sessionId, 'user:', userId);

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

  const handlePlanSelection = async (plan: any) => {
    console.log('🎯 Pricing page - handlePlanSelection called');
    console.log('👤 isAuthenticated:', isAuthenticated);
    console.log('👨‍💻 User:', user);
    console.log('📋 Plan:', plan);

    if (!isAuthenticated) {
      console.log('🚫 User not authenticated, redirecting to signup');
      window.location.href = '/?auth=signup';
      return;
    }

    try {
      console.log('💳 Creating checkout session...');
      if (plan.name === 'FREE') {
        console.log('📋 Processing FREE plan');
        await createCheckoutSession('FREE', 'monthly', user?.id || 'guest-user', user?.email || '');
      } else {
        console.log('💎 Processing PREMIUM plan');
        await createCheckoutSession('PREMIUM', isAnnual ? 'annual' : 'monthly', user?.id || 'guest-user', user?.email || '');
      }

      console.log('✅ Checkout session created, refreshing user data...');
      // Refresh user data after successful action
      setTimeout(refreshUserData, 1000);
    } catch (error) {
      console.log('❌ Error in handlePlanSelection:', error);
      console.error('Plan selection error:', error);
    }
  };

  const plans = [
    {
      name: 'Free',
      price: { monthly: 0, annual: 0 },
      description: 'Perfect for getting started with AI emoji generation',
      features: [
        '5 emoji generations per month',
        'Basic 3D-style Fluent emojis',
        '768x768 resolution',
        'Standard generation speed',
        'Community support',
        'Basic emoji styles',
        'Download in PNG format',
        'Share via social media'
      ],
      limitations: [
        'Limited to 5 generations/month',
        'No priority generation',
        'Basic support only',
        'No custom branding',
        'No API access'
      ],
      buttonText: 'Get Started Free',
      buttonVariant: 'outline',
      popular: false,
      icon: BoltIcon
    },
    {
      name: 'Premium',
      price: { monthly: 9.99, annual: 99.99 },
      description: 'Unlimited access to advanced AI emoji generation',
      features: [
        'Unlimited emoji generations',
        'Premium 3D-style Fluent emojis',
        'High-resolution (1024x1024)',
        'Priority generation queue',
        'Priority customer support',
        'Advanced emoji styles & themes',
        'Multiple export formats (PNG, SVG, WebP)',
        'Custom branding options',
        'API access for developers',
        'Bulk generation (up to 50 at once)',
        'Advanced prompt suggestions',
        'Emoji history & favorites',
        'Team collaboration features',
        'White-label solutions',
        'Analytics & insights'
      ],
      limitations: [],
      buttonText: 'Start Premium',
      buttonVariant: 'primary',
      popular: true,
      icon: StarIcon
    }
  ];

  const annualDiscount = 17; // 17% discount for annual

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <div className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[#0A0A0A]"></div>
          <div className="absolute inset-0 opacity-30 bg-[url('/noise-texture.png')] mix-blend-overlay"></div>
          <div className="absolute inset-0 z-0 grid-animation pointer-events-none">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.1]"></div>
          </div>
        </div>

        <div className="relative z-10 pt-8 pb-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-800/60 backdrop-blur-sm rounded-full border border-gray-700/50 mb-4">
              <BoltIcon className="w-4 h-4 text-[#ff6b2b]" />
              <span className="text-xs text-gray-300 font-medium">AI-Powered Emoji Generation</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Simple, Transparent
              <span className="block bg-gradient-to-r from-[#ff6b2b] via-[#ff69b4] to-[#ff6b2b] bg-clip-text text-transparent">
                Pricing
              </span>
            </h1>
            
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
              Choose the perfect plan for your emoji creation needs. Start free and upgrade when you're ready for unlimited possibilities.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-3 mb-10">
              <span className={`text-sm font-medium ${!isAnnual ? 'text-white' : 'text-gray-400'}`}>Monthly</span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-200 ${
                  isAnnual ? 'bg-gradient-to-r from-[#ff6b2b] to-[#ff69b4]' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 shadow-sm ${
                    isAnnual ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${isAnnual ? 'text-white' : 'text-gray-400'}`}>
                Annual
                {isAnnual && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#ff6b2b]/20 text-[#ff6b2b] border border-[#ff6b2b]/30">
                    Save {annualDiscount}%
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Current Plan Indicator */}
      {isAuthenticated && (
        <div className="relative z-10 px-4 mb-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-black/60 backdrop-blur-xl border border-gray-500/30 rounded-full">
              <div className={`w-3 h-3 rounded-full ${
                currentPlan === 'PREMIUM' ? 'bg-[#ff6b2b]' : 'bg-gray-400'
              } animate-pulse`}></div>
              <span className="text-white font-semibold">
                Your Current Plan: {currentPlan === 'PREMIUM' ? 'Premium' : 'Free'}
                {currentPlan === 'PREMIUM' && user?.subscription?.billingFrequency && (
                  <span className="text-gray-300 text-sm ml-2">
                    ({user.subscription.billingFrequency})
                  </span>
                )}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                user?.subscription?.status === 'active' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
              }`}>
                {user?.subscription?.status || 'active'}
              </span>
            </div>
          </div>
        </div>
      )}

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



      {/* Pricing Cards */}
      <div className="relative z-10 px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            {plans.map((plan, index) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] ${
                  plan.popular
                    ? 'bg-gray-800/60 border-2 border-[#ff6b2b]/60 shadow-2xl shadow-[#ff6b2b]/20'
                    : 'bg-gray-800/60 border border-gray-700/60 shadow-xl hover:shadow-2xl'
                } backdrop-blur-xl`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#ff6b2b] to-[#ff69b4] rounded-full text-white text-xs font-semibold shadow-lg">
                      <StarIcon className="w-3 h-3" />
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gray-700 mb-3 ${
                    plan.popular ? 'ring-2 ring-[#ff6b2b]/30' : ''
                  }`}>
                    {plan.name === 'FREE' ? (
                      <BoltIcon className="w-6 h-6 text-white" />
                    ) : (
                      <StarIcon className="w-6 h-6 text-white" />
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-sm text-gray-400 mb-4 leading-relaxed">{plan.description}</p>
                  
                  <div className="mb-5">
                    <span className="text-3xl font-bold text-white">
                      ${isAnnual ? plan.price.annual : plan.price.monthly}
                    </span>
                    {plan.price.monthly > 0 && (
                      <span className="text-gray-400 ml-1 text-sm">
                        /{isAnnual ? 'year' : 'month'}
                      </span>
                    )}
                  </div>

                  {/* Current Plan Badge */}
                  {plan.name === currentPlan && (
                    <div className="mb-3">
                      <span className="bg-gradient-to-r from-[#ff6b2b] via-[#ff69b4] to-[#ff6b2b] text-white px-3 py-1 rounded-full text-xs font-medium">
                        Current Plan
                      </span>
                    </div>
                  )}

                  <button
                                    onClick={() => {
                  console.log('🖱️ Button clicked for plan:', plan);
                  handlePlanSelection(plan);
                }}
                disabled={loading || plan.name === currentPlan}
                    className={`inline-flex items-center justify-center w-full px-5 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm ${
                      plan.name === currentPlan
                        ? 'bg-gradient-to-r from-[#ff6b2b] via-[#ff69b4] to-[#ff6b2b] text-white cursor-not-allowed border border-[#ff6b2b]/30'
                        : plan.buttonVariant === 'primary'
                        ? 'bg-gradient-to-r from-[#ff6b2b] to-[#ff69b4] hover:from-[#ff6b2b]/90 hover:to-[#ff69b4]/90 text-white shadow-lg shadow-[#ff6b2b]/30 hover:shadow-[#ff6b2b]/50 disabled:opacity-50 disabled:cursor-not-allowed'
                        : 'bg-transparent border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed'
                    }`}
                  >
                    {loading ? 'Processing...' : plan.name === currentPlan ? 'Current Plan' : plan.buttonText}
                  </button>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <h4 className="text-base font-semibold text-white mb-3">What's included:</h4>
                  
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-2.5">
                      <div className="flex-shrink-0 w-4 h-4 rounded-full bg-[#ff6b2b]/20 flex items-center justify-center mt-0.5">
                        <CheckIcon className="w-2.5 h-2.5 text-[#ff6b2b]" />
                      </div>
                      <span className="text-gray-300 text-xs leading-relaxed">{feature}</span>
                    </div>
                  ))}

                  {/* Limitations for Free Plan */}
                  {plan.limitations.length > 0 && (
                    <>
                      <h4 className="text-base font-semibold text-red-400 mt-5 mb-3">Limitations:</h4>
                      {plan.limitations.map((limitation, limitationIndex) => (
                        <div key={limitationIndex} className="flex items-start gap-2.5">
                          <div className="flex-shrink-0 w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center mt-0.5">
                            <XMarkIcon className="w-2.5 h-2.5 text-red-400" />
                          </div>
                          <span className="text-gray-400 text-xs leading-relaxed">{limitation}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="relative z-10 px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
                <h3 className="text-base font-semibold text-white mb-2">Can I cancel anytime?</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Yes! You can cancel your Premium subscription at any time. You'll continue to have access until the end of your billing period.</p>
              </div>
              
              <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
                <h3 className="text-base font-semibold text-white mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-400 text-sm leading-relaxed">We accept all major credit cards, PayPal, and Apple Pay. All payments are processed securely through Stripe.</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
                <h3 className="text-base font-semibold text-white mb-2">Do you offer refunds?</h3>
                <p className="text-gray-400 text-sm leading-relaxed">We offer a 30-day money-back guarantee. If you're not satisfied, contact us within 30 days for a full refund.</p>
              </div>
              
              <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
                <h3 className="text-base font-semibold text-white mb-2">Can I upgrade from Free to Premium?</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Absolutely! You can upgrade to Premium at any time. Your existing free generations will remain, and you'll get unlimited access immediately.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 px-4 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-600/50 backdrop-blur-xl">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Ready to Create Amazing Emojis?
            </h2>
            <p className="text-lg text-gray-400 mb-6 leading-relaxed">
              Join thousands of creators who are already using AI to generate stunning 3D-style Fluent emojis.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => handlePlanSelection(PLANS.PREMIUM)}
                disabled={loading}
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#ff6b2b] to-[#ff69b4] hover:from-[#ff6b2b]/90 hover:to-[#ff69b4]/90 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-[#ff6b2b]/30 hover:shadow-[#ff6b2b]/50 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <BoltIcon className="w-4 h-4 mr-2" />
                {loading ? 'Processing...' : 'Start Creating Now'}
              </button>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 bg-transparent border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white font-semibold rounded-lg transition-all duration-200 hover:bg-gray-700/50 text-sm"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
