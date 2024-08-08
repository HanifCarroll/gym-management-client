'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import Sidenav from '@/components/sidenav/sidenav';
import { useRouter } from 'next/navigation';

export default function AuthenticatedLayout({
                                              children,
                                            }: {
  children: React.ReactNode
}) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [ isAuthenticated, router ]);

  if (!isAuthenticated) {
    return null; // or a loading spinner
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