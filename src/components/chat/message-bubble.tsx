'use client';

export function MessageBubble({ role, content }: { role: 'user' | 'assistant'; content: string }) {
  return <div className={`max-w-3xl rounded-2xl px-4 py-3 text-sm ${role === 'user' ? 'ml-auto bg-blue-600 text-white' : 'mr-auto bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'}`}>{content}</div>;
}
