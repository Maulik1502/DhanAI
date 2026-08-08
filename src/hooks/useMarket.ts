'use client';

import { useApiQuery } from '@/hooks/useApi';

export function useMarket() {
  return useApiQuery(['market'] as const, '/api/market', { refetchInterval: 300000 });
}
