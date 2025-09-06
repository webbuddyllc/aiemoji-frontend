'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface Subscription {
  planType: 'FREE' | 'PREMIUM';
  billingFrequency: 'monthly' | 'annual';
  status: 'active' | 'inactive' | 'cancelled' | 'past_due';
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  stripePriceId?: string;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
  usageCount?: number;
  usageLimit?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  subscription?: Subscription;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Fetch current session user from secure cookie
    const fetchMe = async () => {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        if (res.ok) {
          const me = await res.json();
          setUser(me);
        } else {
          setUser(null);
        }
      } catch (e) {
        setUser(null);
      }
    };
    fetchMe();
  }, []);

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      setUser(null);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, isAuthenticated: !!user, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 