'use client';

import { createContext, ReactNode, use } from 'react';
import { User } from 'firebase/auth';
import { useAuth } from '@/hooks/useAuth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInAnonymously: () => Promise<User>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  isAnonymous: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const auth = useAuth();

  return <AuthContext value={auth}>{children}</AuthContext>;
};

export const useAuthContext = () => {
  const context = use(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
