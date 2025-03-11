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
        setEmojiUrl(response.emoji);
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
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your emoji (e.g., happy cat playing with yarn)"
              className="w-full px-4 py-3 bg-black/50 border border-gray-700/50 rounded-xl 
                       text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                       focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 
                       bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 
                       hover:to-blue-700 text-white rounded-lg transition-all duration-200 
                       disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⚡</span>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <span>✨</span>
                  <span>Generate</span>
                </>
              )}
            </button>
          </div>
        </form>

        {emojiUrl && (
          <div className="mt-8 flex flex-col items-center">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-all duration-200"></div>
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