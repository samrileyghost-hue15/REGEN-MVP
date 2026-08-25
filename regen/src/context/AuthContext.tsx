import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User, Role } from '../types';
import { authApi } from '../lib/api';
import { MOCK_USERS } from '../data/users';

interface AuthContextValue {
  user: User | null;
  login: (role: Role) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (role: Role) => {
    try {
      const { user: apiUser } = await authApi.login(role);
      setUser(apiUser);
    } catch {
      // API unreachable — fall back to local mock user
      const found = MOCK_USERS.find(u => u.role === role) ?? MOCK_USERS[0];
      setUser(found);
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
