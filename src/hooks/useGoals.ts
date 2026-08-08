'use client';

import { useApiMutation, useApiQuery } from '@/hooks/useApi';

export function useGoals() {
  return useApiQuery(['goals'], '/api/goals');
}

export function useCreateGoal() {
  return useApiMutation('/api/goals', 'POST', ['goals']);
}


