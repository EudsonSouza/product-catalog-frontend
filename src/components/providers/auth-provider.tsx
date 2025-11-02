'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '@/services/auth';
import { User, AuthContextValue } from '@/lib/types/auth';

const UNAUTHORIZED_STATUS = 401;

interface AuthError {
  statusCode?: number;
  message?: string;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function isUnauthorizedError(error: unknown): boolean {
  const authError = error as AuthError;
  return authError?.statusCode === UNAUTHORIZED_STATUS;
}

function logAuthenticationStatus(error: unknown): void {
  if (isUnauthorizedError(error)) {
    console.log('[AuthProvider] User not authenticated');
  } else {
    console.error('[AuthProvider] Error fetching user:', error);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      console.log('[AuthProvider] Fetching user...');

      const currentUser = await authService.getCurrentUser();

      console.log('[AuthProvider] User fetched:', currentUser);
      setUser(currentUser);
    } catch (error: unknown) {
      logAuthenticationStatus(error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = () => {
    authService.login();
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error: unknown) {
      console.error('[AuthProvider] Logout error:', error);
      throw error;
    }
  };

  const refetch = async () => {
    await fetchUser();
  };

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refetch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
