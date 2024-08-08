'use client';

import React from 'react';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import Sidebar from '@/components/sidenav/sidenav';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '@/context/auth-context';

const theme = createTheme();
const queryClient = new QueryClient();

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  const { isAuthenticated } = useAuth();

  return (
    <html lang="en">
    <body>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline/>
          {isAuthenticated ? (
            <AuthenticatedLayout>{children}</AuthenticatedLayout>
          ) : (
            children
          )}
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
    </body>
    </html>
  );
}

const AuthenticatedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar/>
      <main style={{ flexGrow: 1, padding: '20px' }}>
        {children}
      </main>
    </div>
  );
};