'use client';

import React from 'react';
import Link from 'next/link';
import { XMarkIcon, StarIcon, BoltIcon, CheckIcon } from '@heroicons/react/24/outline';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  showCurrentUsage?: boolean;
  currentUsage?: number;
  usageLimit?: number;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  title = "Upgrade to Premium",
  message = "You've reached your monthly generation limit. Upgrade to Premium for unlimited access!",
  showCurrentUsage = false,
  currentUsage = 0,
  usageLimit = 5
}) => {
  if (!isOpen) return null;

  const premiumFeatures = [
    'Unlimited emoji generations',
    'Premium 3D-style Fluent emojis',
    'High-resolution (1024x1024)',
    'Priority generation queue',
    'Advanced emoji styles & themes',
    'Multiple export formats (PNG, SVG, WebP)',
    'Custom branding options',
    'API access for developers',
    'Bulk generation (up to 50 at once)',
    'Advanced prompt suggestions'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative max-w-lg w-full bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors duration-200"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-xl flex items-center justify-center">
              <StarIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{title}</h2>
              <p className="text-sm text-gray-400 mt-1">{message}</p>
            </div>
          </div>

          {/* Usage Display */}
          {showCurrentUsage && (
            <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">Current Usage</span>
                <span className="text-sm text-red-400 font-medium">
                  {currentUsage} / {usageLimit} generations
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: `${Math.min((currentUsage / usageLimit) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {/* Premium Benefits */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Premium Benefits</h3>
            <div className="space-y-3">
              {premiumFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5 h-5 bg-emerald-600/20 rounded-full flex items-center justify-center mt-0.5">
                    <CheckIcon className="w-3 h-3 text-emerald-400" />
                  </div>
                  <span className="text-sm text-gray-300 leading-relaxed">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gradient-to-r from-emerald-600/10 to-cyan-600/10 rounded-xl p-4 mb-6 border border-emerald-500/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                $9.99<span className="text-sm font-normal text-gray-400">/month</span>
              </div>
              <div className="text-sm text-gray-400">
                or $99.99/year <span className="text-emerald-400 font-medium">(Save 17%)</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/pricing"
              onClick={onClose}
              className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 flex items-center justify-center gap-2"
            >
              <BoltIcon className="w-4 h-4" />
              Upgrade to Premium
            </Link>

            <button
              onClick={onClose}
              className="w-full bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
            >
              Maybe Later
            </button>
          </div>

          {/* Footer */}
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500">
              30-day money-back guarantee • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
