import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LoadingAnimation } from '@/components/loading-animation';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ isLoading, setIsLoading ] = useState(true);
  const [ isAuthenticated, setIsAuthenticated ] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const login = useCallback(() => {
    localStorage.setItem('authToken', 'dummyToken');
    setIsAuthenticated(true);
    router.push('/members');
  }, [ router ]);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    router.push('/login');
  }, [ router ]);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      setIsAuthenticated(!!token);

      if (!token && pathname !== '/login') {
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      } else if (token && pathname === '/login') {
        router.replace('/members');
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [ pathname, router ]);

  if (isLoading) {
    return <LoadingAnimation/>
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};