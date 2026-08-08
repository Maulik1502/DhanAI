'use client';

import { useApiMutation, useApiQuery } from '@/hooks/useApi';

export function useEmergency() {
  return useApiQuery(['emergency'], '/api/emergency');
}

export function useUpdateEmergency() {
  return useApiMutation('/api/emergency', 'PATCH', ['emergency']);
}
