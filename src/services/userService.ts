import { useAuthContext } from '@/components/AuthProvider';

export class UserService {
  static async createOrUpdateUser(): Promise<any> {
    const response = await fetch('/api/auth/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: null, // Will be set by the server using Firebase Auth UID
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create/update user: ${response.statusText}`);
    }

    return response.json();
  }

  static async getUserData(userId: string): Promise<any> {
    const response = await fetch(`/api/auth/user?userId=${userId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch user data: ${response.statusText}`);
    }

    return response.json();
  }

  static async getUserDataWithAuth(): Promise<any> {
    // This will be used by components that have access to auth context
    // The actual implementation will be in a hook
    throw new Error('Use useUserData hook instead');
  }
}

// Hook for components to get user data
export const useUserData = () => {
  const { user, isAuthenticated } = useAuthContext();

  const createOrUpdateUser = async () => {
    if (!isAuthenticated || !user) {
      throw new Error('User must be authenticated');
    }

    const response = await fetch('/api/auth/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.uid,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create/update user: ${response.statusText}`);
    }

    return response.json();
  };

  const getUserData = async () => {
    if (!isAuthenticated || !user) {
      throw new Error('User must be authenticated');
    }

    const response = await fetch(`/api/auth/user?userId=${user.uid}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch user data: ${response.statusText}`);
    }

    return response.json();
  };

  return {
    user,
    isAuthenticated,
    createOrUpdateUser,
    getUserData,
  };
};
