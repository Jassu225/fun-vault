'use client';

import { useAuthContext } from './AuthProvider';

export const AuthStatus = () => {
  const { user, loading, error, isAuthenticated, isAnonymous } = useAuthContext();

  if (loading) {
    return (
      <div className="fixed top-4 right-4 bg-yellow-500 text-black px-3 py-1 rounded text-sm">Loading auth...</div>
    );
  }

  if (error) {
    return (
      <div className="fixed top-4 right-4 bg-red-500 text-white px-3 py-1 rounded text-sm">Auth Error: {error}</div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="fixed top-4 right-4 bg-gray-500 text-white px-3 py-1 rounded text-sm">Not authenticated</div>
    );
  }

  return (
    <div className="fixed top-4 right-4 bg-green-500 text-white px-3 py-1 rounded text-sm">
      {isAnonymous ? 'Anonymous' : 'Authenticated'}: {user?.uid?.slice(0, 8)}...
    </div>
  );
};
