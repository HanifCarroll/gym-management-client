'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { CircularProgress } from '@mui/material';

interface AuthContextType {
  isAuthenticated: () => boolean;
  login: () => void;
  logout: () => void;
}

const defaultAuthContext: AuthContextType = {
  isAuthenticated: () => false,
  login: () => {
  },
  logout: () => {
  },
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ isLoading, setIsLoading ] = useState(true);

  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useCallback(() => !!localStorage.getItem('authToken'), []);

  const login = () => {
    localStorage.setItem('authToken', 'dummyToken');
    router.push('/members')
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    router.push('/login');
  };

  useEffect(() => {
    const tokenExists = isAuthenticated();

    if (!tokenExists && pathname !== '/login') {
      // Redirect to the login page with the intended path as a query parameter
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    } else if (tokenExists && pathname === '/login') {
      router.replace('/members'); // Default authenticated route
    }

    setIsLoading(false);
  }, [ isAuthenticated, pathname, router ]);

  if (isLoading) {
    return <CircularProgress/>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, }}>
      {isLoading ? <CircularProgress/> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
