'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '../context/UserContext';
import { toast } from 'react-hot-toast';

interface UsageData {
  usageCount: number;
  usageLimit: number;
  planType: 'FREE' | 'PREMIUM';
  status: string;
  lastReset?: string;
}

interface PricingValidationResult {
  canGenerate: boolean;
  usageCount: number;
  usageLimit: number;
  planType: 'FREE' | 'PREMIUM';
  isLoading: boolean;
  error: string | null;
  remainingGenerations: number;
  isLimitReached: boolean;
  isPremiumUser: boolean;
}

export const usePricingValidation = () => {
  const { user, isAuthenticated } = useUser();
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if usage needs to be reset (monthly reset check)
  const checkAndResetUsage = useCallback(async (usageData: UsageData): Promise<UsageData> => {
    if (usageData.planType === 'PREMIUM') {
      return usageData; // Premium users don't need resets
    }

    const currentDate = new Date();
    const lastReset = usageData.lastReset ? new Date(usageData.lastReset) : null;
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    // If no last reset or last reset was before the start of this month, reset usage
    if (!lastReset || lastReset < firstDayOfMonth) {
      console.log('🔄 Monthly usage reset needed for user:', user?.id);

      try {
        // Update the usage data locally
        const resetData = {
          ...usageData,
          usageCount: 0,
          lastReset: currentDate.toISOString()
        };

        // Update in database
        const response = await fetch('/api/usage/reset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user?.id })
        });

        if (response.ok) {
          console.log('✅ Usage reset successfully');
          return resetData;
        }
      } catch (err) {
        console.error('❌ Failed to reset usage:', err);
      }
    }

    return usageData;
  }, [user?.id]);

  // Fetch current usage data
  const fetchUsageData = useCallback(async () => {
    if (!user?.id || !isAuthenticated) {
      setUsageData(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/usage?userId=${user.id}`);
      const data = await response.json();

      if (response.ok) {
        // Check if monthly reset is needed
        const processedData = await checkAndResetUsage(data);
        setUsageData(processedData);
      } else {
        setError(data.error || 'Failed to fetch usage data');
      }
    } catch (err) {
      setError('Network error while fetching usage data');
      console.error('Usage fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, isAuthenticated, checkAndResetUsage]);

  // Check if user can generate emoji
  const checkGenerationLimit = useCallback(async (): Promise<boolean> => {
    if (!user?.id || !isAuthenticated) {
      return false;
    }

    try {
      const response = await fetch('/api/usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });

      if (response.status === 429) {
        // Usage limit reached
        const data = await response.json();
        setUsageData(data);
        return false;
      }

      if (response.ok) {
        const data = await response.json();
        setUsageData(data);
        return true;
      }

      return false;
    } catch (err) {
      console.error('Usage check error:', err);
      return false;
    }
  }, [user?.id, isAuthenticated]);

  // Show upgrade prompt for free users
  const showUpgradePrompt = useCallback((
    title?: string,
    message?: string,
    showUsage?: boolean,
    usage?: number,
    limit?: number
  ) => {
    let upgradeMessage = message || 'Get unlimited emoji generations and premium features';

    if (showUsage && usage !== undefined && limit !== undefined) {
      upgradeMessage += `\n\nCurrent usage: ${usage}/${limit} generations`;
    }

    toast.success(`${title || 'Upgrade to Premium'}\n${upgradeMessage}`, {
      duration: 10000,
      position: 'top-center',
      style: {
        border: '1px solid #10B981',
        padding: '16px',
        color: '#D1FAE5',
        background: '#064E3B'
      },
      icon: '⭐'
    });
  }, []);

  // Get validation result
  const getValidationResult = useCallback((): PricingValidationResult => {
    const defaultData: UsageData = {
      usageCount: 0,
      usageLimit: 5,
      planType: 'FREE',
      status: 'active'
    };

    const data = usageData || defaultData;
    const isPremiumUser = data.planType === 'PREMIUM';
    const remainingGenerations = Math.max(0, data.usageLimit - data.usageCount);
    const isLimitReached = !isPremiumUser && data.usageCount >= data.usageLimit;

    return {
      canGenerate: isAuthenticated && (isPremiumUser || !isLimitReached),
      usageCount: data.usageCount,
      usageLimit: data.usageLimit,
      planType: data.planType,
      isLoading,
      error,
      remainingGenerations,
      isLimitReached,
      isPremiumUser
    };
  }, [usageData, isAuthenticated, isLoading, error]);

  // Refresh usage data
  const refreshUsage = useCallback(() => {
    fetchUsageData();
  }, [fetchUsageData]);

  // Initialize usage data on mount and when user changes
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchUsageData();
    }
  }, [isAuthenticated, user?.id, fetchUsageData]);

  return {
    checkGenerationLimit,
    showUpgradePrompt,
    refreshUsage,
    getValidationResult,
    usageData
  };
};
