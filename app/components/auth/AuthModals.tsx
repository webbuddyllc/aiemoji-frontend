'use client';

import { useState } from 'react';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import { useAuth } from '@/app/contexts/AuthContext';

interface AuthModalsProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export default function AuthModals({ isOpen, onClose, initialMode = 'login' }: AuthModalsProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const { login } = useAuth();

  const handleSuccess = (token: string, user: any) => {
    login(token, user);
    onClose();
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
  };

  if (!isOpen) return null;

  return (
    <>
      {mode === 'login' ? (
        <LoginModal
          isOpen={isOpen}
          onClose={onClose}
          onSwitch={switchMode}
          onSuccess={handleSuccess}
        />
      ) : (
        <RegisterModal
          isOpen={isOpen}
          onClose={onClose}
          onSwitch={switchMode}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
} 