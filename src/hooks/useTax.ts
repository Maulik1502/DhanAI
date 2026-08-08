'use client';

import { useApiMutation, useApiQuery } from '@/hooks/useApi';

export function useTax() {
  return useApiQuery(['tax'], '/api/tax');
}

export function useUpdateTax() {
  return useApiMutation('/api/tax', 'POST', ['tax']);
}
