'use client';

import { useApiMutation } from '@/hooks/useApi';

export function useCompleteOnboarding() {
  return useApiMutation('/api/onboarding', 'POST', ['user', 'finances', 'goals', 'insurance', 'emergency', 'corpus', 'tax']);
}
