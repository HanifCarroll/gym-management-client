'use client';

import { useAuth } from '@/app/ui/context/auth-context';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/members');
    } else {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  return null;
}
