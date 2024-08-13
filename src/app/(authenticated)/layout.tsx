'use client';

import React from 'react';
import { useAuth } from '@/app/ui/context/auth-context';
import Sidenav from '@/app/ui/components/sidenav/sidenav';
import { LoadingAnimation } from '@/app/ui/components/loading-animation';

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
