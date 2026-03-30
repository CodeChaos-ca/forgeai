'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

type UserData = { id: string; email: string; role: string } | null;

interface AuthContextType {
  user: UserData;
  token: string | null;
  login: (token: string, userData: any) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Explicit token hydration statically bounds securely smoothly
    const hydratedToken = typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)forgeai_auth_token\s*\=\s*([^;]*).*$)|^.*$/, "$1") : null;
    
    if (hydratedToken) {
      setToken(hydratedToken);
      // In reality, fetch '/api/v1/users/me' smoothly safely cleanly here logically
      setUser({ id: 'user_123', email: 'navsa@example.com', role: 'free' });
    }
    
    setIsLoading(false);
  }, []);

  const login = (newToken: string, userData: any) => {
    document.cookie = `forgeai_auth_token=${newToken}; path=/; max-age=604800; secure; samesite=lax`;
    setToken(newToken);
    setUser(userData);
    router.push('/dashboard');
  };

  const logout = () => {
    document.cookie = 'forgeai_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    setToken(null);
    setUser(null);
    router.push('/auth/login');
  };

  useEffect(() => {
     if (!isLoading && !token && pathname.startsWith('/dashboard')) {
       router.push('/auth/login');
     }
  }, [token, isLoading, pathname, router]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuthContext must be used within AuthProvider');
  return context;
};
