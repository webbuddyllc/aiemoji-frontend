'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../context/UserContext';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const { user, setUser } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }
    setFormData(prev => ({
      ...prev,
      name: user.name || '',
      email: user.email || '',
    }));
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate passwords if trying to change them
      if (formData.newPassword || formData.confirmPassword || formData.currentPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          throw new Error('New passwords do not match');
        }
        if (!formData.currentPassword) {
          throw new Error('Current password is required to change password');
        }
      }

      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          currentPassword: formData.currentPassword || undefined,
          newPassword: formData.newPassword || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update settings');
      }

      // Update user in context and localStorage
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));

      // Reset password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));

      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user?.email) return;

    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );

    if (!confirmed) return;

    try {
      const response = await fetch('/api/settings', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete account');
      }

      // Clear user data and redirect
      localStorage.removeItem('user');
      setUser(null);
      router.push('/');
      toast.success('Account deleted successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete account');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-200">
            Account Settings
          </h1>
          <p className="text-gray-400 mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Settings Form */}
        <div className="bg-black/50 border border-blue-500/20 rounded-2xl p-6 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Profile Information</h2>
              
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black/50 border border-blue-500/20 rounded-lg focus:outline-none focus:border-blue-500/50 text-white placeholder-gray-500 transition-colors"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black/50 border border-blue-500/20 rounded-lg focus:outline-none focus:border-blue-500/50 text-white placeholder-gray-500 transition-colors"
                  placeholder="Your email"
                />
              </div>
            </div>

            {/* Password Section */}
            <div className="space-y-4 pt-6 border-t border-blue-500/20">
              <h2 className="text-xl font-semibold text-white">Change Password</h2>
              
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black/50 border border-blue-500/20 rounded-lg focus:outline-none focus:border-blue-500/50 text-white placeholder-gray-500 transition-colors"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black/50 border border-blue-500/20 rounded-lg focus:outline-none focus:border-blue-500/50 text-white placeholder-gray-500 transition-colors"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black/50 border border-blue-500/20 rounded-lg focus:outline-none focus:border-blue-500/50 text-white placeholder-gray-500 transition-colors"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-400 
                hover:from-blue-600 hover:via-blue-500 hover:to-cyan-500
                text-white font-medium rounded-lg transition-all duration-300 
                shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 
                transform hover:-translate-y-0.5 relative group overflow-hidden 
                disabled:opacity-50"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-400 opacity-0 group-hover:opacity-50 transition-opacity duration-300 animate-pulse"></span>
                <span className="relative">
                  {loading ? 'Saving...' : 'Save Changes'}
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="mt-8 bg-black/50 border border-red-500/20 rounded-2xl p-6 backdrop-blur-xl">
          <h2 className="text-xl font-semibold text-red-400">Danger Zone</h2>
          <p className="text-gray-400 mt-2 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 
            rounded-lg hover:bg-red-500/20 transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 