'use client';

import { useApiMutation, useApiQuery } from '@/hooks/useApi';

export function useChat() {
  return useApiQuery(['chat'], '/api/ai/chat');
}

export function useSendChat() {
  return useApiMutation('/api/ai/chat', 'POST', ['chat']);
}
