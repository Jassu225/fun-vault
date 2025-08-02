import { signInAnonymouslyUser, getCurrentUser, onAuthStateChange } from './firebase';

// Mock Firebase Auth
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    currentUser: null,
  })),
  signInAnonymously: jest.fn(),
  onAuthStateChanged: jest.fn(() => jest.fn()), // Return unsubscribe function
}));

// Mock Firebase App
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({})),
}));

describe('Firebase Service (Client-side)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should export required functions', () => {
    expect(signInAnonymouslyUser).toBeDefined();
    expect(getCurrentUser).toBeDefined();
    expect(onAuthStateChange).toBeDefined();
  });

  it('should handle getCurrentUser when no user is signed in', () => {
    const user = getCurrentUser();
    expect(user).toBe(null);
  });

  it('should handle onAuthStateChange', () => {
    const callback = jest.fn();
    const unsubscribe = onAuthStateChange(callback);
    expect(typeof unsubscribe).toBe('function');
  });

  it('should handle signInAnonymouslyUser', async () => {
    const mockUser = { uid: 'test-uid', isAnonymous: true };
    const { signInAnonymously, getAuth } = require('firebase/auth');
    signInAnonymously.mockResolvedValue({ user: mockUser });

    const result = await signInAnonymouslyUser();
    expect(result).toEqual(mockUser);
    expect(signInAnonymously).toHaveBeenCalled();
  });

  it('should handle signInAnonymouslyUser error', async () => {
    const { signInAnonymously } = require('firebase/auth');
    signInAnonymously.mockRejectedValue(new Error('Auth failed'));

    await expect(signInAnonymouslyUser()).rejects.toThrow('Auth failed');
  });
});
