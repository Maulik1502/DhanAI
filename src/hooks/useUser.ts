'use client';

import { useSession } from 'next-auth/react';
import { useApiQuery } from '@/hooks/useApi';

export function useUser() {
  const session = useSession();
  const profile = useApiQuery(['user'] as const, '/api/user', { enabled: session.status === 'authenticated' });
  return { session, profile };
}
