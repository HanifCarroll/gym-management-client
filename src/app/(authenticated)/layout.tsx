'use client';

import React from 'react';
import { useAuth } from '@/context/auth-context';
import Sidenav from '@/components/sidenav/sidenav';

export default function AuthenticatedLayout({
                                              children,
                                            }: {
  children: React.ReactNode
}) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidenav/>
      <main style={{ flexGrow: 1, padding: '20px' }}>
        {children}
      </main>
    </div>
  );
}