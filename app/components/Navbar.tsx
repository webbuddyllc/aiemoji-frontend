'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import AuthModals from './AuthModals';
import { useUser } from '../context/UserContext';

const EMOJI_LIST = [
  { emoji: '😊', gradient: ['from-yellow-400', 'to-orange-400'] },
  { emoji: '🚀', gradient: ['from-gray-400', 'to-gray-600'] },
  { emoji: '🌟', gradient: ['from-yellow-300', 'to-amber-400'] },
  { emoji: '🎨', gradient: ['from-pink-400', 'to-rose-400'] },
  { emoji: '🎮', gradient: ['from-purple-400', 'to-gray-600'] },
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
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useUser();
  const pathname = usePathname();
  
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
      <nav className="sticky top-0 left-0 right-0 z-50 bg-[#0A0A0A]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
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
              <span className="text-white font-bold text-xl tracking-tight group-hover:text-gray-300 transition-colors duration-200">
                Emojify
              </span>
            </Link>

            {/* Navigation Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className={`text-gray-400 font-medium px-3 py-2 rounded-md text-sm transition-colors duration-200 border-b-2 ${pathname === '/' ? 'border-gray-300' : 'border-transparent'}`}
              >
                Home
              </Link>
              <Link
                href="/pricing"
                className={`text-gray-300 hover:text-white font-medium px-3 py-2 rounded-md text-sm transition-colors duration-200 hover:border-b-2 hover:border-gray-300 ${pathname === '/pricing' ? 'border-gray-300' : 'border-transparent'}`}
              >
                Pricing
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-white p-2 rounded-md transition-colors duration-200"
                aria-label="Toggle mobile menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

            {/* Auth Buttons */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-500/10 transition-colors relative group"
                  >
                    <div className={`w-8 h-8 rounded-full overflow-hidden border-2 border-gray-500/20 group-hover:border-gray-500/40 transition-all duration-300 relative bg-gradient-to-br ${userEmoji.gradient.join(' ')}`}>
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
                    <div className="absolute right-0 mt-2 w-48 rounded-lg bg-[#0A0A0A] border border-gray-700 shadow-lg py-1">
                      <div className="px-4 py-2 border-b border-gray-700">
                        <p className="text-sm text-white font-medium">{user?.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        My Profile
                      </Link>
                      <Link
                        href="/subscription"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Usage and Subscription
                      </Link>
                      <Link
                        href="/saved"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        Saved
                      </Link>
                      <div className="border-t border-gray-700 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      setAuthModalMode('login');
                      setIsAuthModalOpen(true);
                    }}
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setAuthModalMode('signup');
                      setIsAuthModalOpen(true);
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 shadow-lg shadow-gray-600/30 hover:shadow-gray-600/50"
                  >
                    Sign Up
                  </button>
                </div>
              )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#0A0A0A] border-t border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                className={`text-gray-400 font-medium block px-3 py-2 rounded-md text-base border-b-2 ${pathname === '/' ? 'border-gray-300' : 'border-transparent'}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/pricing"
                className={`text-gray-300 hover:text-white font-medium block px-3 py-2 rounded-md text-base transition-colors duration-200 ${pathname === '/pricing' ? 'border-gray-300' : 'border-transparent'}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>

              {/* Mobile Auth Buttons */}
              {!isAuthenticated && (
                <div className="border-t border-gray-700 pt-4 mt-4 space-y-2">
                  <button
                    onClick={() => {
                      setAuthModalMode('login');
                      setIsAuthModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-gray-300 hover:text-white font-medium block w-full text-left px-3 py-2 rounded-md text-base transition-colors duration-200"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setAuthModalMode('signup');
                      setIsAuthModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-medium block w-full text-left px-3 py-2 rounded-md text-base transition-all duration-200 shadow-lg shadow-gray-600/30 hover:shadow-gray-600/50"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      <AuthModals
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </>
  );
};

export default Navbar; 