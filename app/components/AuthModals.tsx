'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useUser } from '../context/UserContext';

interface AuthModalsProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

const AuthModals: React.FC<AuthModalsProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { setUser } = useUser();

  // Update modal mode when it opens
  useEffect(() => {
    if (isOpen) {
      setIsLogin(initialMode === 'login');
    }
  }, [isOpen, initialMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      if (!isLogin && !name) {
        throw new Error('Name is required for registration');
      }

      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name,
          isLogin,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Store user in localStorage and context
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      
      // Close modal and redirect
      onClose();
      router.push('/');
    } catch (err) {
      console.error('Auth error:', err);
      setError(err instanceof Error ? err.message : 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[100]">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md mx-4 sm:mx-auto"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="relative bg-black/90 border border-gray-500/20 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
              {/* Glow effects */}
              <div className="absolute inset-0 bg-gradient-radial from-gray-500/10 via-transparent to-transparent rounded-2xl blur-xl"></div>
              <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.05] rounded-2xl"></div>

              {/* Content */}
              <div className="relative">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gray-500/20 rounded-full blur-lg"></div>
                    <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="16" cy="16" r="14" fill="url(#emojiGradient)" />
                      <path d="M10 18C10 18 12 22 16 22C20 22 22 18 22 18" stroke="white" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="11" cy="13" r="2" fill="white" />
                      <circle cx="21" cy="13" r="2" fill="white" />
                      <path d="M4 16C4 16 8 10 16 10C24 10 28 16 28 16" stroke="#4299E1" strokeWidth="1" strokeOpacity="0.5" strokeDasharray="2 2" />
                      <defs>
                        <linearGradient id="emojiGradient" x1="2" y1="2" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#3182CE" />
                          <stop offset="100%" stopColor="#1A365D" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-3xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-200">
                  {isLogin ? 'Welcome Back!' : 'Create Account'}
                </h2>
                <p className="text-gray-400 text-center mb-8">
                  {isLogin ? 'Login to create amazing emojis' : 'Sign up to start creating emojis'}
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 bg-black/50 border border-gray-500/20 rounded-lg focus:outline-none focus:border-gray-500/50 text-white placeholder-gray-500 transition-colors"
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-black/50 border border-gray-500/20 rounded-lg focus:outline-none focus:border-gray-500/50 text-white placeholder-gray-500 transition-colors"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-black/50 border border-gray-500/20 rounded-lg focus:outline-none focus:border-gray-500/50 text-white placeholder-gray-500 transition-colors"
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  {error && (
                    <div className="text-red-500 text-sm text-center">{error}</div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-gradient-to-r from-gray-500 via-gray-400 to-gray-600 hover:from-gray-600 hover:via-gray-500 hover:to-gray-700
                    text-white font-medium rounded-lg transition-all duration-300 shadow-lg shadow-gray-500/20
                    hover:shadow-xl hover:shadow-gray-500/30 transform hover:-translate-y-0.5 relative group overflow-hidden disabled:opacity-50"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-gray-500 via-gray-400 to-gray-600 opacity-0 group-hover:opacity-50 transition-opacity duration-300 animate-pulse"></span>
                    <span className="relative">
                      {loading ? 'Loading...' : (isLogin ? 'Login' : 'Sign Up')}
                    </span>
                  </button>


                </form>

                {/* Switch between login/signup */}
                <p className="mt-6 text-center text-gray-400">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="ml-2 text-gray-400 hover:text-gray-300 transition-colors font-medium"
                  >
                    {isLogin ? 'Sign Up' : 'Login'}
                  </button>
                </p>
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute -top-4 -right-4 w-8 h-8 bg-black/80 border border-gray-500/20 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModals; 