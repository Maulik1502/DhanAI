'use client';

import { useApiMutation, useApiQuery } from '@/hooks/useApi';

export function useFinances() {
  return useApiQuery(['finances'], '/api/finances');
}

export function useCreateFinanceItem() {
  return useApiMutation('/api/finances', 'POST', ['finances']);
}


