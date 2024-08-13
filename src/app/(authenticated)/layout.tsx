'use client';

import { LoadingAnimation } from '@/app/ui/components/loading-animation';
import Sidenav from '@/app/ui/components/sidenav/sidenav';
import { useAuth } from '@/app/ui/context/auth-context';
import React from 'react';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoadingAnimation />;
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidenav />
      <main style={{ flexGrow: 1, padding: '20px' }}>{children}</main>
    </div>
  );
}
