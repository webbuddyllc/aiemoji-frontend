'use client';

import React from 'react';
import { usePricingValidation } from '../hooks/usePricingValidation';
import { useUser } from '../context/UserContext';
import Link from 'next/link';

interface UsageDisplayProps {
  className?: string;
  compact?: boolean;
}

const UsageDisplay: React.FC<UsageDisplayProps> = ({ className = '', compact = false }) => {
  const { isAuthenticated } = useUser();
  const { getValidationResult, showUpgradePrompt } = usePricingValidation();
  const validation = getValidationResult();

  if (!isAuthenticated) {
    return null;
  }

  const progressPercentage = (validation.usageCount / validation.usageLimit) * 100;
  const isNearLimit = validation.remainingGenerations <= 2 && !validation.isPremiumUser;
  const isAtLimit = validation.isLimitReached;

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <div className="text-xs text-gray-300">
          {validation.isPremiumUser ? (
            <span className="text-emerald-400 font-medium">Unlimited</span>
          ) : (
            <span className={isAtLimit ? 'text-red-400' : isNearLimit ? 'text-yellow-400' : 'text-gray-300'}>
              {validation.usageCount}/{validation.usageLimit}
            </span>
          )}
        </div>
        {isNearLimit && !isAtLimit && (
          <button
            onClick={() => showUpgradePrompt(
              'Upgrade to Premium',
              'Get unlimited emoji generations and premium features',
              true,
              validation.usageCount,
              validation.usageLimit
            )}
            className="text-xs text-emerald-400 hover:text-emerald-300 underline"
          >
            Upgrade
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-black/40 backdrop-blur-xl rounded-xl p-4 border ${isAtLimit ? 'border-red-500/30' : isNearLimit ? 'border-yellow-500/30' : 'border-gray-500/20'} ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${validation.isPremiumUser ? 'bg-emerald-400' : isAtLimit ? 'bg-red-400' : isNearLimit ? 'bg-yellow-400' : 'bg-gray-400'} animate-pulse`}></div>
          <span className="text-sm font-medium text-white">
            {validation.isPremiumUser ? 'Premium Plan' : 'Free Plan'}
          </span>
        </div>
        {isNearLimit && !isAtLimit && (
          <button
            onClick={() => showUpgradePrompt(
              'Upgrade to Premium',
              'Get unlimited emoji generations and premium features',
              true,
              validation.usageCount,
              validation.usageLimit
            )}
            className="text-xs text-emerald-400 hover:text-emerald-300 underline font-medium"
          >
            Upgrade
          </button>
        )}
      </div>

      {!validation.isPremiumUser && (
        <>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400">Generations used</span>
            <span className={`text-xs font-medium ${isAtLimit ? 'text-red-400' : isNearLimit ? 'text-yellow-400' : 'text-gray-300'}`}>
              {validation.usageCount} / {validation.usageLimit}
            </span>
          </div>

          <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${isAtLimit ? 'bg-red-500' : isNearLimit ? 'bg-yellow-500' : 'bg-emerald-500'}`}
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            ></div>
          </div>

          <div className="text-xs text-gray-400 text-center">
            {validation.remainingGenerations > 0 ? (
              <span>{validation.remainingGenerations} generations remaining this month</span>
            ) : (
              <span className="text-red-400">Limit reached - upgrade to continue</span>
            )}
          </div>

          {isAtLimit && (
            <div className="mt-3 text-center">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Upgrade to Premium
              </Link>
            </div>
          )}
        </>
      )}

      {validation.isPremiumUser && (
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-emerald-400 font-medium">Unlimited Access</span>
          </div>
          <p className="text-xs text-gray-400">Generate as many emojis as you want!</p>
        </div>
      )}
    </div>
  );
};

export default UsageDisplay;
