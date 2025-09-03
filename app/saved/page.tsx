'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const SavedPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with actual data from your backend
  const savedEmojis = [
    {
      id: 1,
      name: 'Happy Robot',
      image: '/api/placeholder/100/100',
      category: 'robots',
      createdAt: '2024-01-15',
      tags: ['robot', 'happy', 'tech']
    },
    {
      id: 2,
      name: 'Space Cat',
      image: '/api/placeholder/100/100',
      category: 'animals',
      createdAt: '2024-01-14',
      tags: ['cat', 'space', 'cute']
    },
    {
      id: 3,
      name: 'Gaming Controller',
      image: '/api/placeholder/100/100',
      category: 'gaming',
      createdAt: '2024-01-13',
      tags: ['gaming', 'controller', 'tech']
    }
  ];

  const categories = [
    { id: 'all', name: 'All', count: savedEmojis.length },
    { id: 'robots', name: 'Robots', count: savedEmojis.filter(e => e.category === 'robots').length },
    { id: 'animals', name: 'Animals', count: savedEmojis.filter(e => e.category === 'animals').length },
    { id: 'gaming', name: 'Gaming', count: savedEmojis.filter(e => e.category === 'gaming').length },
    { id: 'food', name: 'Food', count: 0 },
    { id: 'nature', name: 'Nature', count: 0 }
  ];

  const filteredEmojis = savedEmojis.filter(emoji => {
    const matchesCategory = selectedCategory === 'all' || emoji.category === selectedCategory;
    const matchesSearch = emoji.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         emoji.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleRemoveFromSaved = (emojiId: number) => {
    // TODO: Implement remove functionality
    console.log('Remove emoji:', emojiId);
  };

  const handleDownload = (emojiId: number) => {
    // TODO: Implement download functionality
    console.log('Download emoji:', emojiId);
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
            <h1 className="text-2xl font-bold text-white">Saved Emojis</h1>
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
                    <button className="px-6 py-3 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-400 hover:from-gray-500 hover:via-gray-400 hover:to-gray-300 text-white rounded-lg font-medium transition-all duration-300 shadow-lg shadow-gray-500/20 hover:shadow-gray-500/30">
                      Create New
                    </button>
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
                <div className="text-3xl font-bold text-[#ff6b2b] mb-2">{savedEmojis.length}</div>
                <div className="text-gray-400">Total Saved</div>
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
                <div className="absolute -inset-1 bg-gradient-to-r from-gray-500 via-gray-400 to-gray-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl border border-gray-500/20 overflow-hidden hover:border-gray-400/40 transition-all duration-300 hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-radial from-gray-500/10 via-transparent to-transparent blur-xl"></div>
                  
                  {/* Emoji Image */}
                  <div className="relative aspect-square bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#ff6b2b] to-[#ff69b4] rounded-full flex items-center justify-center text-3xl shadow-lg">
                      🎨
                    </div>
                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleDownload(emoji.id)}
                        className="p-2 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-400 hover:from-gray-500 hover:via-gray-400 hover:to-gray-300 text-white rounded-lg transition-all duration-200 shadow-lg"
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
                    <h3 className="font-semibold text-white mb-2 truncate">{emoji.name}</h3>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {emoji.tags.slice(0, 2).map((tag, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-black/60 text-gray-300 text-xs rounded-full border border-gray-500/30"
                        >
                          {tag}
                        </span>
                      ))}
                      {emoji.tags.length > 2 && (
                        <span className="px-2 py-1 bg-black/60 text-gray-300 text-xs rounded-full border border-gray-500/30">
                          +{emoji.tags.length - 2}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400">
                      Saved {new Date(emoji.createdAt).toLocaleDateString()}
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
                <div className="w-24 h-24 mx-auto mb-6 bg-black/60 rounded-full flex items-center justify-center border border-gray-500/30">
                  <svg className="w-12 h-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No saved emojis yet</h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  Start creating and saving your favorite emojis. They'll appear here for easy access.
                </p>
                <button className="px-6 py-3 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-400 hover:from-gray-500 hover:via-gray-400 hover:to-gray-300 text-white rounded-lg font-medium transition-all duration-300 shadow-lg shadow-gray-500/20 hover:shadow-gray-500/30">
                  Create Your First Emoji
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPage;
