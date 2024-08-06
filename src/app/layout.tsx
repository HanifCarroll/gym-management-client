'use client';

import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import Sidebar from './components/Sidebar/Sidebar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const theme = createTheme();

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  const queryClient = new QueryClient();
  return (
    <html lang="en">
    <body>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <div style={{ display: 'flex' }}>
          <Sidebar/>
          <main style={{ flexGrow: 1, padding: '20px' }}>
            {children}
          </main>
        </div>
      </ThemeProvider>
    </QueryClientProvider>
    </body>
    </html>
  )
}