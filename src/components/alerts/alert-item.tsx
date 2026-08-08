'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { AlertTriangle, Shield, Coins, Goal } from 'lucide-react';

const icons: Record<string, React.ReactNode> = {
  GOAL_COMPLETED: <Goal className='h-4 w-4' />,
  GOAL_AT_RISK: <AlertTriangle className='h-4 w-4' />,
  TAX_SAVING_LIMIT: <Coins className='h-4 w-4' />,
  INSURANCE_SUGGESTED: <Shield className='h-4 w-4' />,
};

export function AlertItem({ alert }: { alert: { id: string; type: string; title: string; message: string; read: boolean; createdAt: string | Date; data?: string | null } }) {
  const deepLink = alert.data ? (JSON.parse(alert.data) as { deepLink?: string }).deepLink : '/alerts';
  return (
    <Link href={deepLink || '/alerts'} className={`flex gap-3 rounded-2xl border p-4 transition hover:shadow-sm ${alert.read ? 'bg-white dark:bg-gray-800' : 'bg-blue-50/70 dark:bg-blue-950/30'}`}>
      <div className='mt-1 text-blue-600'>{icons[alert.type] || <AlertTriangle className='h-4 w-4' />}</div>
      <div className='min-w-0 flex-1'>
        <div className='flex items-center gap-2'>
          {!alert.read ? <span className='h-2 w-2 rounded-full bg-blue-600' /> : null}
          <p className='font-medium text-gray-900 dark:text-white'>{alert.title}</p>
        </div>
        <p className='mt-1 text-sm text-gray-600 dark:text-gray-300'>{alert.message}</p>
        <p className='mt-2 text-xs text-gray-400'>{formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}</p>
      </div>
    </Link>
  );
}
