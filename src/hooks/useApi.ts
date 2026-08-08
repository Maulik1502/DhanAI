'use client';

import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
  });
  const payload = await response.json().catch(() => ({ success: false, error: 'Invalid JSON response' }));
  if (!response.ok || !payload.success) throw new Error(payload.error || 'Request failed');
  return payload.data as T;
}

export function useApiQuery<T>(key: readonly unknown[], path: string, options?: Omit<UseQueryOptions<T, Error, T, readonly unknown[]>, 'queryKey' | 'queryFn'>) {
  return useQuery({ queryKey: key, queryFn: () => apiRequest<T>(path), ...options });
}

export function useApiMutation<T, V>(path: string, method: 'POST' | 'PATCH' | 'DELETE', invalidate: readonly unknown[]) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: V) => apiRequest<T>(path, { method, body: JSON.stringify(variables) }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: invalidate });
    },
  });
}
