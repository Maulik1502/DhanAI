'use client';

import { useApiMutation, useApiQuery } from '@/hooks/useApi';

export function useInsurance() {
  return useApiQuery(['insurance'], '/api/insurance');
}

export function useConfirmInsurance() {
  return useApiMutation('/api/insurance', 'POST', ['insurance']);
}
