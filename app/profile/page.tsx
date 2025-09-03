'use client';

import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import Link from 'next/link';

const ProfilePage = () => {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    avatar: user?.avatar || ''
  });

  const handleSave = () => {
    // TODO: Implement save functionality
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      bio: user?.bio || '',
      avatar: user?.avatar || ''
    });
    setIsEditing(false);
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
            <h1 className="text-2xl font-bold text-white">My Profile</h1>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Card */}
        <div className="relative group">
          {/* Decorative elements */}
          <div className="absolute -inset-1 bg-gradient-to-r from-gray-500 via-gray-400 to-gray-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
          
          {/* Main card with enhanced glass effect */}
          <div className="relative bg-black/40 rounded-2xl p-1 backdrop-blur-xl border border-gray-500/20">
            <div className="absolute inset-0 bg-gradient-radial from-gray-500/10 via-transparent to-transparent blur-xl"></div>
            
            <div className="relative">
              {/* Cover Section */}
              <div className="relative h-48 bg-gradient-to-r from-[#ff6b2b] via-[#ff69b4] to-[#8a2be2] rounded-t-2xl overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/10 to-black/40"></div>
                
                {/* Floating elements */}
                <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 rounded-full shadow-xl backdrop-blur-xl border border-gray-500/20">
                  <span className="text-sm font-medium text-white">✨ AI Powered</span>
                </div>
                
                <div className="absolute bottom-4 left-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#ff6b2b] to-[#ff69b4] border-4 border-white shadow-2xl flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    {/* Glow effect */}
                    <div className="absolute inset-0 w-24 h-24 rounded-full bg-gradient-to-br from-[#ff6b2b] to-[#ff69b4] blur-xl opacity-50 animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="px-6 pb-6 pt-20">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-black/60 border border-gray-500/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b2b] focus:border-transparent backdrop-blur-sm"
                        />
                      ) : (
                        user?.name || 'User Name'
                      )}
                    </h2>
                    <p className="text-gray-400">
                      {isEditing ? (
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full bg-black/60 border border-gray-500/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b2b] focus:border-transparent backdrop-blur-sm"
                        />
                      ) : (
                        user?.email || 'user@example.com'
                      )}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleSave}
                          className="px-4 py-2 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-400 hover:from-gray-500 hover:via-gray-400 hover:to-gray-300 text-white rounded-lg font-medium transition-all duration-300 shadow-lg shadow-gray-500/20 hover:shadow-gray-500/30"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="px-4 py-2 bg-black/60 hover:bg-black/80 text-white rounded-lg font-medium transition-all duration-300 border border-gray-500/30 hover:border-gray-400/50"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-black/60 hover:bg-black/80 text-white rounded-lg font-medium transition-all duration-300 border border-gray-500/30 hover:border-gray-400/50"
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>

                {/* Bio Section */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Bio</h3>
                  {isEditing ? (
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      rows={4}
                      className="w-full bg-black/60 border border-gray-500/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b2b] focus:border-transparent backdrop-blur-sm resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-gray-300 leading-relaxed">
                      {formData.bio || "No bio added yet. Click 'Edit Profile' to add one!"}
                    </p>
                  )}
                </div>

                {/* Subscription & Usage Section */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Subscription Status</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user?.subscription?.planType === 'PREMIUM'
                        ? 'bg-gradient-to-r from-[#ff6b2b] to-[#ff69b4] text-white'
                        : 'bg-gray-600 text-gray-300'
                    }`}>
                      {user?.subscription?.planType || 'FREE'} Plan
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user?.subscription?.status === 'active'
                        ? 'bg-green-600 text-white'
                        : 'bg-red-600 text-white'
                    }`}>
                      {user?.subscription?.status || 'active'}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-black/40 rounded-lg p-4 border border-gray-500/20">
                      <div className="text-sm text-gray-400 mb-1">Usage This Month</div>
                      <div className="text-2xl font-bold text-white">
                        {user?.subscription?.usageCount || 0} / {user?.subscription?.usageLimit || 5}
                      </div>
                      <div className="mt-2 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-[#ff6b2b] to-[#ff69b4] h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(((user?.subscription?.usageCount || 0) / (user?.subscription?.usageLimit || 5)) * 100, 100)}%`
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="bg-black/40 rounded-lg p-4 border border-gray-500/20">
                      <div className="text-sm text-gray-400 mb-1">Remaining Generations</div>
                      <div className="text-2xl font-bold text-[#ff6b2b]">
                        {Math.max((user?.subscription?.usageLimit || 5) - (user?.subscription?.usageCount || 0), 0)}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        {user?.subscription?.planType === 'PREMIUM' ? 'Unlimited' : 'Resets monthly'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-gray-500 via-gray-400 to-gray-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                    <div className="relative bg-black/60 backdrop-blur-sm rounded-xl p-6 text-center border border-gray-500/20">
                      <div className="text-3xl font-bold text-[#ff6b2b] mb-2">{user?.subscription?.usageCount || 0}</div>
                      <div className="text-gray-400 text-sm">Emojis Created</div>
                    </div>
                  </div>
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-gray-500 via-gray-400 to-gray-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                    <div className="relative bg-black/60 backdrop-blur-sm rounded-xl p-6 text-center border border-gray-500/20">
                      <div className="text-3xl font-bold text-[#ff69b4] mb-2">0</div>
                      <div className="text-gray-400 text-sm">Emojis Saved</div>
                    </div>
                  </div>
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-gray-500 via-gray-400 to-gray-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                    <div className="relative bg-black/60 backdrop-blur-sm rounded-xl p-6 text-center border border-gray-500/20">
                      <div className="text-3xl font-bold text-[#8a2be2] mb-2">{user?.subscription?.planType === 'PREMIUM' ? '∞' : '5'}</div>
                      <div className="text-gray-400 text-sm">Monthly Limit</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-gray-500 via-gray-400 to-gray-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
          <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-500/20">
            <div className="absolute inset-0 bg-gradient-radial from-gray-500/10 via-transparent to-transparent blur-xl"></div>
            <div className="relative">
              <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-black/40 rounded-lg border border-gray-500/20 backdrop-blur-sm">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#ff6b2b] to-[#ff69b4] rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">Created new emoji</p>
                    <p className="text-gray-400 text-sm">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-black/40 rounded-lg border border-gray-500/20 backdrop-blur-sm">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#ff69b4] to-[#8a2be2] rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">Saved emoji to collection</p>
                    <p className="text-gray-400 text-sm">1 day ago</p>
                  </div>
                </div>
                <div className="text-center py-8 text-gray-500">
                  <p>No more recent activity</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
