'use client';

import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { usePricingValidation } from '../hooks/usePricingValidation';
import { toast } from 'react-hot-toast';

const PricingTest: React.FC = () => {
  const { user, isAuthenticated } = useUser();
  const { getValidationResult, refreshUsage } = usePricingValidation();
  const [isLoading, setIsLoading] = useState(false);

  const validation = getValidationResult();

  const testGeneration = async () => {
    if (!isAuthenticated || !user?.id) {
      toast.error('Please login first');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-emoji', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'test emoji for pricing validation',
          userId: user.id
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Generation successful!');
        refreshUsage(); // Refresh usage data
      } else {
        if (response.status === 429) {
          toast.error('Usage limit reached - upgrade needed');
        } else {
          toast.error(data.error || 'Generation failed');
        }
      }
    } catch (error) {
      toast.error('Network error');
    } finally {
      setIsLoading(false);
    }
  };

  const testUsageAPI = async () => {
    if (!isAuthenticated || !user?.id) {
      toast.error('Please login first');
      return;
    }

    try {
      const response = await fetch(`/api/usage?userId=${user.id}`);
      const data = await response.json();

      if (response.ok) {
        console.log('Usage data:', data);
        toast.success(`Usage: ${data.usageCount}/${data.usageLimit}`);
      } else {
        toast.error('Failed to fetch usage');
      }
    } catch (error) {
      toast.error('Network error');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
        <p className="text-red-400">Please login to test pricing validation</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900/50 rounded-xl border border-gray-700/50 space-y-4">
      <h3 className="text-lg font-semibold text-white">Pricing Validation Test</h3>

      {/* Current Status */}
      <div className="bg-black/40 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-300 mb-2">Current Status</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Plan:</span>
            <span className={`ml-2 font-medium ${validation.isPremiumUser ? 'text-emerald-400' : 'text-gray-300'}`}>
              {validation.planType}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Usage:</span>
            <span className={`ml-2 font-medium ${validation.isLimitReached ? 'text-red-400' : 'text-gray-300'}`}>
              {validation.usageCount} / {validation.usageLimit}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Can Generate:</span>
            <span className={`ml-2 font-medium ${validation.canGenerate ? 'text-green-400' : 'text-red-400'}`}>
              {validation.canGenerate ? 'Yes' : 'No'}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Remaining:</span>
            <span className="ml-2 font-medium text-blue-400">
              {validation.remainingGenerations}
            </span>
          </div>
        </div>
      </div>

      {/* Test Buttons */}
      <div className="flex gap-3">
        <button
          onClick={testGeneration}
          disabled={isLoading || !validation.canGenerate}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed"
        >
          {isLoading ? 'Testing...' : 'Test Generation'}
        </button>

        <button
          onClick={testUsageAPI}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Check Usage API
        </button>

        <button
          onClick={refreshUsage}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Refresh Usage
        </button>
      </div>

      {/* Usage Progress Bar */}
      <div className="bg-black/40 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-300">Usage Progress</span>
          <span className="text-sm text-gray-400">
            {validation.usageCount} / {validation.usageLimit}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              validation.isLimitReached ? 'bg-red-500' :
              validation.remainingGenerations <= 2 ? 'bg-yellow-500' : 'bg-blue-500'
            }`}
            style={{ width: `${Math.min((validation.usageCount / validation.usageLimit) * 100, 100)}%` }}
          ></div>
        </div>
        {validation.isLimitReached && (
          <p className="text-xs text-red-400 mt-2">Limit reached - upgrade to continue</p>
        )}
      </div>

      {/* Debug Info */}
      <details className="bg-black/20 rounded-lg p-3">
        <summary className="text-sm text-gray-400 cursor-pointer">Debug Info</summary>
        <pre className="text-xs text-gray-500 mt-2 overflow-x-auto">
          {JSON.stringify({
            userId: user?.id,
            validation,
            isAuthenticated,
            user: {
              id: user?.id,
              email: user?.email,
              subscription: user?.subscription
            }
          }, null, 2)}
        </pre>
      </details>
    </div>
  );
};

export default PricingTest;






