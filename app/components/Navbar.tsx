'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AuthModals from './AuthModals';
import { useUser } from '../context/UserContext';

const EMOJI_LIST = [
  { emoji: '😊', gradient: ['from-yellow-400', 'to-orange-400'] },
  { emoji: '🚀', gradient: ['from-blue-400', 'to-indigo-400'] },
  { emoji: '🌟', gradient: ['from-yellow-300', 'to-amber-400'] },
  { emoji: '🎨', gradient: ['from-pink-400', 'to-rose-400'] },
  { emoji: '🎮', gradient: ['from-purple-400', 'to-indigo-400'] },
  { emoji: '🎵', gradient: ['from-green-400', 'to-emerald-400'] },
  { emoji: '🌈', gradient: ['from-red-400', 'via-yellow-400', 'to-green-400'] },
  { emoji: '💡', gradient: ['from-amber-300', 'to-orange-400'] },
  { emoji: '🎯', gradient: ['from-red-400', 'to-rose-400'] },
  { emoji: '🌺', gradient: ['from-pink-400', 'to-rose-300'] },
];

const getEmojiForUser = (email: string) => {
  // Generate a consistent index based on email
  const charSum = email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = charSum % EMOJI_LIST.length;
  return EMOJI_LIST[index];
};

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useUser();
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
  };

  // Get emoji based on user's email
  const userEmoji = user?.email ? getEmojiForUser(user.email) : EMOJI_LIST[0];

  return (
    <>
      <nav className="fixed top-5 left-0 right-0 z-50 px-4 pointer-events-none">
        <div 
          className={`pointer-events-auto mx-auto max-w-6xl rounded-xl transition-all duration-300 
          border border-gray-700/50 shadow-2xl shadow-black/30
          ${
            scrolled 
              ? 'bg-black/90 backdrop-blur-lg py-3' 
              : 'bg-black/80 backdrop-blur-md py-4'
          }`}
        >
          {/* Subtle glow effect */}
          <div className="absolute inset-0 rounded-xl bg-blue-500/5 pointer-events-none"></div>
          
          <div className="px-4 sm:px-6 lg:px-8 relative">
            <div className="flex justify-between items-center">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 relative transform group-hover:scale-110 transition-transform duration-200">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Main emoji circle with gradient */}
                    <circle cx="16" cy="16" r="14" fill="url(#emojiGradient)" />
                    
                    {/* Smile curve */}
                    <path d="M10 18C10 18 12 22 16 22C20 22 22 18 22 18" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    
                    {/* Eyes */}
                    <circle cx="11" cy="13" r="2" fill="white" />
                    <circle cx="21" cy="13" r="2" fill="white" />
                    
                    {/* AI circuit patterns */}
                    <path d="M4 16C4 16 8 10 16 10C24 10 28 16 28 16" stroke="#4299E1" strokeWidth="1" strokeOpacity="0.5" strokeDasharray="2 2" />
                    <path d="M5 10L8 7" stroke="#4299E1" strokeWidth="1" strokeOpacity="0.7" />
                    <path d="M27 10L24 7" stroke="#4299E1" strokeWidth="1" strokeOpacity="0.7" />
                    
                    {/* Small sparkle elements */}
                    <circle cx="27" cy="16" r="1" fill="#FFD700" />
                    <circle cx="5" cy="16" r="1" fill="#FFD700" />
                    
                    {/* Gradient definition */}
                    <defs>
                      <linearGradient id="emojiGradient" x1="2" y1="2" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#3182CE" />
                        <stop offset="100%" stopColor="#1A365D" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  {/* Animated sparkle effect on hover */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 0L7 4L10 5L7 6L6 10L5 6L2 5L5 4L6 0Z" fill="#FFD700" />
                    </svg>
                  </div>
                </div>
                <span className="text-white font-bold text-xl tracking-tight group-hover:text-blue-300 transition-colors duration-200">
                  Emojify
                </span>
              </Link>
              
              {/* Create Button or Profile */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-500/10 transition-colors relative group"
                  >
                    <div className={`w-8 h-8 rounded-full overflow-hidden border-2 border-blue-500/20 group-hover:border-blue-500/40 transition-all duration-300 relative bg-gradient-to-br ${userEmoji.gradient.join(' ')}`}>
                      {/* Emoji Placeholder */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl transform group-hover:scale-110 transition-transform duration-300" style={{ lineHeight: 1 }}>
                          {userEmoji.emoji}
                        </span>
                      </div>
                      {/* Sparkle Effects */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute top-0 left-1 w-1 h-1 bg-white rounded-full animate-ping"></div>
                        <div className="absolute bottom-1 right-0 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                        <div className="absolute top-1 right-1 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                    </div>
                    <svg 
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`}
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-lg bg-black/90 border border-blue-500/20 shadow-lg backdrop-blur-xl py-1">
                      <div className="px-4 py-2 border-b border-blue-500/10">
                        <p className="text-sm text-white font-medium">{user?.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                      </div>
                      <Link
                        href="/settings"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-blue-500/10 hover:text-white transition-colors"
                      >
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 
                  text-white font-medium rounded-md transition-all duration-200 shadow-lg shadow-blue-600/30
                  hover:shadow-blue-600/50 hover:-translate-y-0.5"
                >
                  {/* Custom Magic Wand Icon */}
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-white"
                  >
                    <path 
                      d="M20 4L8.5 15.5M8.5 15.5L10 19L4 20L5 14L8.5 15.5Z" 
                      stroke="currentColor" 
                      strokeWidth="1.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      fill="none"
                    />
                    <path 
                      d="M15 4L16 2L17 4L19 5L17 6L16 8L15 6L13 5L15 4Z" 
                      fill="#FFD300" 
                      stroke="white" 
                      strokeWidth="0.2"
                    />
                    <path 
                      d="M19 9L19.5 8L20 9L21 9.5L20 10L19.5 11L19 10L18 9.5L19 9Z" 
                      fill="#FFD300" 
                      stroke="white" 
                      strokeWidth="0.2"
                    />
                  </svg>
                  <span>Create</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModals 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default Navbar; 