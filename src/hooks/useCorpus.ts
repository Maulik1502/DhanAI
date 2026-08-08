'use client';

import { useApiMutation, useApiQuery } from '@/hooks/useApi';

export function useCorpus() {
  return useApiQuery(['corpus'], '/api/corpus');
}

export function useUpdateCorpus() {
  return useApiMutation('/api/corpus', 'PATCH', ['corpus']);
}
