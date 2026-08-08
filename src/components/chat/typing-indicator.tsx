'use client';

export function TypingIndicator() {
  return <div className='flex gap-2 p-4 text-gray-500'><span className='h-2 w-2 animate-bounce rounded-full bg-gray-400' /><span className='h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:120ms]' /><span className='h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:240ms]' /></div>;
}
