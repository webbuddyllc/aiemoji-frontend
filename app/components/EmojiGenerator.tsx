'use client';

import React, { useState } from 'react';
import { generateEmoji } from '../services/emojiService';
import { toast } from 'react-hot-toast';

const EmojiGenerator: React.FC = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [emojiUrl, setEmojiUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      toast.error('Please enter some text');
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading('Generating your emoji...');

    try {
      const response = await generateEmoji(text.trim());
      
      if (response.success && response.emoji) {
        setEmojiUrl(response?.emoji as any);
        toast.success('Emoji generated successfully!', {
          id: loadingToast,
        });
      } else {
        throw new Error(response.error || 'Failed to generate emoji');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate emoji', {
        id: loadingToast,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            {/* Enhanced input with glass-morphism and gradient effects */}
            <div className="relative group">
              {/* Gradient glow overlay */}
              <div className="absolute -inset-1 bg-gradient-to-r from-gray-500 via-gray-400 to-gray-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative">
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Describe your emoji (e.g., happy cat playing with yarn)"
                  className="w-full px-6 py-4 text-base bg-black/40 rounded-xl
                           text-white placeholder-gray-400
                           focus:outline-none
                           shadow-lg border border-gray-500/20
                           transition-all duration-300 backdrop-blur-xl
                           group-hover:shadow-xl group-hover:border-gray-500/30"
                  disabled={loading}
                />
                {/* Animated cursor indicator */}
                <div className="absolute right-16 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                {/* Submit button with enhanced styling */}
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10
                           bg-gradient-to-r from-gray-600 via-gray-500 to-gray-400
                           rounded-lg transition-all duration-300
                           flex items-center justify-center group/btn
                           hover:scale-105 hover:shadow-lg shadow-gray-500/20
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="animate-spin">⚡</span>
                  ) : (
                    <svg 
                      className="w-4 h-4 text-white transition-transform duration-300 group-hover/btn:scale-110"
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>

        {emojiUrl && (
          <div className="mt-8 flex flex-col items-center">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-gray-500 to-gray-600 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-all duration-200"></div>
              <div className="relative bg-black rounded-2xl p-2">
                <img
                  src={emojiUrl}
                  alt="Generated Emoji"
                  className="w-48 h-48 object-contain rounded-xl"
                />
              </div>
            </div>
            <p className="mt-4 text-gray-400 text-sm">
              Your custom emoji is ready! Click to download or share.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmojiGenerator; 