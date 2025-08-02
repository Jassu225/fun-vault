'use client';

import { useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import cookies from 'js-cookie';
import { signInAnonymouslyUser, onAuthStateChange, getCurrentUser } from '@/services/client/firebase';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  const signInAnonymously = useCallback(async () => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      const user = await signInAnonymouslyUser();
      setAuthState((prev) => ({ ...prev, user, loading: false }));
      return user;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in anonymously';
      setAuthState((prev) => ({ ...prev, error: errorMessage, loading: false }));
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      // For anonymous auth, we don't need to sign out - just clear the state
      setAuthState({ user: null, loading: false, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign out';
      setAuthState((prev) => ({ ...prev, error: errorMessage }));
    }
  }, []);

  useEffect(() => {
    const updateAuthState = async (user: User | null) => {
      if (user) {
        cookies.set('token', await user.getIdToken());
      } else {
        cookies.remove('token');
      }
      setAuthState({
        user,
        loading: false,
        error: null,
      });
    };
    // Set up auth state listener
    const unsubscribe = onAuthStateChange(updateAuthState);

    // Check if there's already a user
    const currentUser = getCurrentUser();
    if (currentUser) {
      updateAuthState(currentUser);
    }

    return unsubscribe;
  }, []);

  // Auto-sign in anonymously if no user is present
  useEffect(() => {
    if (!authState.loading && !authState.user && !authState.error) {
      signInAnonymously().catch(() => {
        // Error is already handled in signInAnonymously
      });
    }
  }, [authState.loading, authState.user, authState.error, signInAnonymously]);

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    signInAnonymously,
    signOut,
    isAuthenticated: !!authState.user,
    isAnonymous: authState.user?.isAnonymous ?? false,
  };
};
