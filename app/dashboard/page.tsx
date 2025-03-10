'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../context/UserContext';

export default function Dashboard() {
  const { user, isAuthenticated } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black pt-28 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-black/50 border border-blue-500/20 rounded-2xl p-8 backdrop-blur-xl">
          <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-200">
            Welcome, {user?.name}!
          </h1>
          <p className="text-gray-400 mb-8">
            Start creating your custom emojis with AI
          </p>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/50 border border-blue-500/20 rounded-xl p-6 hover:border-blue-500/40 transition-colors">
              <h3 className="text-xl font-semibold text-white mb-2">Create New Emoji</h3>
              <p className="text-gray-400 mb-4">Generate a custom emoji using AI</p>
              <button className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                Get Started →
              </button>
            </div>

            <div className="bg-black/50 border border-blue-500/20 rounded-xl p-6 hover:border-blue-500/40 transition-colors">
              <h3 className="text-xl font-semibold text-white mb-2">My Collection</h3>
              <p className="text-gray-400 mb-4">View your generated emojis</p>
              <button className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                View All →
              </button>
            </div>

            <div className="bg-black/50 border border-blue-500/20 rounded-xl p-6 hover:border-blue-500/40 transition-colors">
              <h3 className="text-xl font-semibold text-white mb-2">Account Settings</h3>
              <p className="text-gray-400 mb-4">Manage your profile and preferences</p>
              <button className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                Settings →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 