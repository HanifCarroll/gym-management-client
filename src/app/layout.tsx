'use client';
import React from 'react';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/app/ui/context/auth-context';
import { SnackbarProvider } from '@/app/ui/context/snackbar-context';

const theme = createTheme();
const queryClient = new QueryClient();

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
    <body>
    <AuthProvider>
      <SnackbarProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <CssBaseline/>
            {children}
          </ThemeProvider>
        </QueryClientProvider>
      </SnackbarProvider>
    </AuthProvider>
    </body>
    </html>
  );
}
