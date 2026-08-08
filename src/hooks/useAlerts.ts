'use client';

import { useApiQuery } from '@/hooks/useApi';

export interface AlertsResponse {
  alerts: Array<{ id: string; type: string; title: string; message: string; read: boolean; createdAt: string; data?: string | null }>;
  page: number;
  pageSize: number;
  total: number;
  unread: number;
}

export function useAlerts() {
  return useApiQuery<AlertsResponse>(['alerts'] as const, '/api/alerts', { refetchInterval: 30000 });
}
