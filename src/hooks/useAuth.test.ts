import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuth } from './useAuth';
import { signInAnonymouslyUser, onAuthStateChange, getCurrentUser } from '@/services/firebase';

// Mock Firebase Auth
jest.mock('@/services/firebase', () => ({
  signInAnonymouslyUser: jest.fn(),
  onAuthStateChange: jest.fn(() => jest.fn()), // Return unsubscribe function
  getCurrentUser: jest.fn(),
}));

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBe(null);
    expect(result.current.error).toBe(null);
  });

  it('should handle successful anonymous sign in', async () => {
    const mockUser = { uid: 'test-uid', isAnonymous: true };
    (signInAnonymouslyUser as jest.Mock).mockResolvedValue(mockUser);
    (getCurrentUser as jest.Mock).mockReturnValue(null);

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signInAnonymously();
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isAnonymous).toBe(true);
  });

  it('should handle sign in error', async () => {
    const error = new Error('Auth failed');
    (signInAnonymouslyUser as jest.Mock).mockRejectedValue(error);
    (getCurrentUser as jest.Mock).mockReturnValue(null);

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      try {
        await result.current.signInAnonymously();
      } catch (e) {
        // Expected to throw
      }
    });

    expect(result.current.error).toBe('Auth failed');
    expect(result.current.loading).toBe(false);
    expect(result.current.user).toBe(null);
  });

  it('should handle existing user on initialization', () => {
    const mockUser = { uid: 'existing-uid', isAnonymous: true };
    (getCurrentUser as jest.Mock).mockReturnValue(mockUser);

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.loading).toBe(false);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should handle auth state changes', async () => {
    const mockUser = { uid: 'changed-uid', isAnonymous: true };
    let authStateCallback: ((user: any) => void) | null = null;

    (onAuthStateChange as jest.Mock).mockImplementation((callback) => {
      authStateCallback = callback;
      return jest.fn(); // unsubscribe function
    });
    (getCurrentUser as jest.Mock).mockReturnValue(null);

    const { result } = renderHook(() => useAuth());

    // Simulate auth state change
    await act(async () => {
      if (authStateCallback) {
        authStateCallback(mockUser);
      }
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.loading).toBe(false);
  });

  it('should handle sign out', async () => {
    const mockUser = { uid: 'test-uid', isAnonymous: true };
    (getCurrentUser as jest.Mock).mockReturnValue(mockUser);

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signOut();
    });

    expect(result.current.user).toBe(null);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isAnonymous).toBe(false);
  });
});
