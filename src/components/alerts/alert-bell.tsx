'use client';

import Link from 'next/link';
import { Bell } from 'lucide-react';

export function AlertBell({ unread = 0 }: { unread?: number }) {
  return (
    <Link href='/alerts' className='relative inline-flex h-11 w-11 items-center justify-center rounded-lg border bg-white text-gray-700 dark:bg-gray-900'>
      <Bell className='h-5 w-5' />
      {unread > 0 ? <span className='absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500' /> : null}
    </Link>
  );
}
