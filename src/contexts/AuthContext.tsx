import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, AuthState } from '@/types/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  setRole: (role: UserRole) => void;
  selectedRole: UserRole | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'foodswift_auth';

const generateToken = () => {
  return 'token_' + Math.random().toString(36).substring(2, 15);
};

const createMockUser = (email: string, role: UserRole): User => {
  const names: Record<UserRole, string> = {
    user: 'John Customer',
    owner: 'Restaurant Owner',
    delivery: 'Delivery Partner',
  };

  return {
    id: `${role}-${Date.now()}`,
    email,
    name: names[role],
    role,
    phone: '+1 234 567 8900',
  };
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAuthState({
          user: parsed.user,
          token: parsed.token,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock validation (in real app, this would be a backend call)
    if (!email || !password || password.length < 4) {
      return false;
    }

    const user = createMockUser(email, role);
    const token = generateToken();

    const authData = { user, token };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));

    setAuthState({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    });

    return true;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
    setSelectedRole(null);
  };

  const setRole = (role: UserRole) => {
    setSelectedRole(role);
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        setRole,
        selectedRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
