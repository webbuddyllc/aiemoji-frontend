'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSavedEmojis } from '../hooks/useSavedEmojis';
import { toast } from 'react-hot-toast';

const SavedPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { savedEmojis, unsaveEmoji } = useSavedEmojis();

  // Extract unique categories from saved emojis
  const allCategories = savedEmojis.flatMap(emoji =>
    emoji.metadata?.prompt?.toLowerCase().split(' ').filter(word =>
      ['robot', 'animal', 'cat', 'dog', 'gaming', 'food', 'nature', 'space', 'superhero', 'magic', 'crystal'].includes(word)
    ) || []
  );

  const uniqueCategories = [...new Set(allCategories)];

  const categories = [
    { id: 'all', name: 'All', count: savedEmojis.length },
    ...uniqueCategories.map(category => ({
      id: category,
      name: category.charAt(0).toUpperCase() + category.slice(1),
      count: savedEmojis.filter(emoji =>
        emoji.metadata?.prompt?.toLowerCase().includes(category)
      ).length
    }))
  ];

  const filteredEmojis = savedEmojis.filter(emoji => {
    const matchesCategory = selectedCategory === 'all' ||
      emoji.metadata?.prompt?.toLowerCase().includes(selectedCategory);
    const matchesSearch = emoji.metadata?.prompt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         emoji.originalPrompt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         emoji.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleRemoveFromSaved = (emojiId: string) => {
    unsaveEmoji(emojiId);
    toast.success('Emoji removed from saved', {
      style: {
        border: '1px solid #EF4444',
        padding: '16px',
        color: '#FEE2E2',
        background: '#7F1D1D'
      },
      iconTheme: {
        primary: '#EF4444',
        secondary: '#7F1D1D',
      },
    });
  };

  const handleDownload = (emojiUrl: string, prompt: string) => {
    // Create a download link for the emoji
    const link = document.createElement('a');
    link.href = emojiUrl;
    link.download = `3d-emoji-${prompt.replace(/\s+/g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Emoji downloaded!', {
      style: {
        border: '1px solid #10B981',
        padding: '16px',
        color: '#D1FAE5',
        background: '#064E3B'
      },
      iconTheme: {
        primary: '#10B981',
        secondary: '#064E3B',
      },
    });
  };

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
            <h1 className="text-2xl font-bold text-white">Saved 3D Emojis</h1>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats & Search */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-gray-500 via-gray-400 to-gray-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-500/20">
                <div className="absolute inset-0 bg-gradient-radial from-gray-500/10 via-transparent to-transparent blur-xl"></div>
                <div className="relative flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label htmlFor="search" className="block text-sm font-medium text-gray-400 mb-2">
                      Search saved emojis
                    </label>
                    <div className="relative">
                      <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input
                        type="text"
                        id="search"
                        placeholder="Search by name or tags..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-black/60 border border-gray-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b2b] focus:border-transparent backdrop-blur-sm"
                      />
                    </div>
                  </div>
                  <div className="flex items-end">
                    <Link href="/">
                      <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 via-cyan-500 to-blue-500 hover:from-emerald-500 hover:via-cyan-400 hover:to-blue-400 text-white rounded-lg font-medium transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30">
                        Create New 3D Emoji
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-gray-500 via-gray-400 to-gray-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-500/20">
              <div className="absolute inset-0 bg-gradient-radial from-gray-500/10 via-transparent to-transparent blur-xl"></div>
              <div className="relative text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-2">{savedEmojis.length}</div>
                <div className="text-gray-400">Saved Emojis</div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-gray-600 via-gray-500 to-gray-400 text-white shadow-lg shadow-gray-500/25'
                    : 'bg-black/40 text-gray-300 hover:bg-black/60 hover:text-white border border-gray-500/20 hover:border-gray-400/40 backdrop-blur-sm'
                }`}
              >
                {category.name}
                <span className="ml-2 text-xs opacity-75">({category.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Emojis Grid */}
        {filteredEmojis.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredEmojis.map((emoji) => (
              <div key={emoji.id} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-cyan-400 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl border border-emerald-500/20 overflow-hidden hover:border-emerald-400/40 transition-all duration-300 hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-radial from-emerald-500/10 via-transparent to-transparent blur-xl"></div>

                  {/* Emoji Image */}
                  <div className="relative aspect-square bg-gradient-to-br from-emerald-950 via-cyan-950 to-blue-950 flex items-center justify-center">
                    {emoji.isImage ? (
                      <img
                        src={emoji.emoji}
                        alt={`Generated 3D Emoji: ${emoji.metadata?.prompt || emoji.originalPrompt}`}
                        className="w-full h-full object-contain p-4"
                      />
                    ) : (
                      <span className="text-6xl">{emoji.emoji}</span>
                    )}

                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleDownload(emoji.emoji, emoji.metadata?.prompt || emoji.originalPrompt || 'emoji')}
                        className="p-2 bg-gradient-to-r from-emerald-600 via-cyan-500 to-blue-500 hover:from-emerald-500 hover:via-cyan-400 hover:to-blue-400 text-white rounded-lg transition-all duration-200 shadow-lg"
                        title="Download"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleRemoveFromSaved(emoji.id)}
                        className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 shadow-lg"
                        title="Remove from saved"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Emoji Info */}
                  <div className="relative p-4">
                    <h3 className="font-semibold text-white mb-2 truncate">
                      {emoji.metadata?.prompt || emoji.originalPrompt || 'Generated Emoji'}
                    </h3>
                    <div className="flex flex-wrap gap-1 mb-3">
                      <span className="px-2 py-1 bg-emerald-600/60 text-emerald-200 text-xs rounded-full border border-emerald-500/30">
                        3D
                      </span>
                      <span className="px-2 py-1 bg-cyan-600/60 text-cyan-200 text-xs rounded-full border border-cyan-500/30">
                        {emoji.metadata?.model?.split(' ')[0] || 'AI'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Saved {new Date(emoji.savedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-gray-500 via-gray-400 to-gray-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-16 border border-gray-500/20 text-center">
              <div className="absolute inset-0 bg-gradient-radial from-gray-500/10 via-transparent to-transparent blur-xl"></div>
              <div className="relative">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-emerald-600/20 to-cyan-600/20 rounded-full flex items-center justify-center border border-emerald-500/30">
                  <svg className="w-12 h-12 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No saved 3D emojis yet</h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  Start creating and saving your favorite 3D emojis. They'll appear here for easy access and management.
                </p>
                <Link href="/">
                  <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 via-cyan-500 to-blue-500 hover:from-emerald-500 hover:via-cyan-400 hover:to-blue-400 text-white rounded-lg font-medium transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30">
                    Create Your First 3D Emoji
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPage;
