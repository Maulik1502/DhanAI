'use client';

import { MessageBubble } from '@/components/chat/message-bubble';

export function MessageList({ messages }: { messages: Array<{ id: string; role: 'user' | 'assistant'; content: string }> }) {
  return <div className='space-y-3'>{messages.map((message) => <MessageBubble key={message.id} role={message.role} content={message.content} />)}</div>;
}
