'use client';

import { useState, useCallback } from 'react';

interface UpgradeModalState {
  isOpen: boolean;
  title: string;
  message: string;
  showCurrentUsage: boolean;
  currentUsage: number;
  usageLimit: number;
}

export const useUpgradeModal = () => {
  const [modalState, setModalState] = useState<UpgradeModalState>({
    isOpen: false,
    title: "Upgrade to Premium",
    message: "You've reached your monthly generation limit. Upgrade to Premium for unlimited access!",
    showCurrentUsage: false,
    currentUsage: 0,
    usageLimit: 5
  });

  const openModal = useCallback((
    title?: string,
    message?: string,
    showCurrentUsage?: boolean,
    currentUsage?: number,
    usageLimit?: number
  ) => {
    setModalState({
      isOpen: true,
      title: title || "Upgrade to Premium",
      message: message || "You've reached your monthly generation limit. Upgrade to Premium for unlimited access!",
      showCurrentUsage: showCurrentUsage || false,
      currentUsage: currentUsage || 0,
      usageLimit: usageLimit || 5
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      isOpen: false
    }));
  }, []);

  return {
    modalState,
    openModal,
    closeModal
  };
};






