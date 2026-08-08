import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { InteractiveChat } from '@/components/chat/interactive-chat';

export default async function ChatPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const messages = await db.chatMessage
    .findMany({ where: { userId: user.id }, orderBy: { createdAt: 'asc' }, take: 50 })
    .catch(() => []);

  const formattedMessages = messages.map((m) => ({
    id: m.id,
    role: (m.role === 'assistant' ? 'assistant' : 'user') as 'assistant' | 'user',
    content: m.content,
    timestamp: m.createdAt,
  }));

  return (
    <div className='space-y-4 pb-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight'>AI Financial Advisor Chat</h1>
      </div>
      <InteractiveChat initialMessages={formattedMessages} />
    </div>
  );
}


