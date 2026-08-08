'use client';

import { useApiMutation, useApiQuery } from '@/hooks/useApi';

export function useInvestments() {
  return useApiQuery(['investments'], '/api/investments');
}

export function useCreateInvestment() {
  return useApiMutation('/api/investments', 'POST', ['investments']);
}

