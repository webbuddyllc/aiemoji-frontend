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
    // Check local storage for existing user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
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