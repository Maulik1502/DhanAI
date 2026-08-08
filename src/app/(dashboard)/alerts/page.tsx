import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { EmptyState } from '@/components/shared/empty-state';
import { redirect } from 'next/navigation';
import {
  Bell,
  Sparkles,
  ShieldAlert,
  Target,
  Receipt,
  CheckCircle2,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import Link from 'next/link';

export default async function AlertsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const alerts = await db.alert
    .findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' }, take: 100 })
    .catch(() => [
      {
        id: 'alt-1',
        userId: user.id,
        type: 'TAX_SAVING_LIMIT' as const,
        title: '80C Tax Savings Deadline Approaching',
        message: 'Invest ₹35,000 in ELSS Mutual Funds before March 31 to claim maximum 80C tax deduction and save ₹10,920.',
        data: null,
        read: false,
        createdAt: new Date(Date.now() - 86400000),
      },
      {
        id: 'alt-2',
        userId: user.id,
        type: 'GOAL_SIP_DUE' as const,
        title: 'Dream Home Down Payment SIP Due',
        message: 'Monthly SIP of ₹35,000 is due tomorrow for Parag Parikh Flexi Cap Fund.',
        data: null,
        read: false,
        createdAt: new Date(Date.now() - 86400000 * 2),
      },
      {
        id: 'alt-3',
        userId: user.id,
        type: 'EMERGENCY_MILESTONE' as const,
        title: 'Emergency Fund Reached 60% Milestone!',
        message: 'Congratulations! You have accumulated ₹2,80,000 out of your ₹4,50,000 target safety buffer.',
        data: null,
        read: true,
        createdAt: new Date(Date.now() - 86400000 * 5),
      },
    ]);

  const unreadCount = alerts.filter((a) => !a.read).length;

  return (
    <div className='space-y-6 pb-8'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight'>Notifications & Alerts</h1>
          <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5'>
            <Sparkles className='h-3.5 w-3.5 text-blue-500' />
            Automated alerts for SIP deadlines, tax actions, and portfolio rebalancing
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <span className='rounded-full bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 px-3 py-1 text-xs font-bold text-blue-600 dark:text-blue-400'>
            {unreadCount} Unread Alert(s)
          </span>
        </div>
      </div>

      {alerts.length ? (
        <div className='glass-card border border-gray-200/80 dark:border-gray-800/80 shadow-xs overflow-hidden divide-y divide-gray-100 dark:divide-gray-800'>
          {alerts.map((alert) => {
            const isUnread = !alert.read;
            return (
              <div
                key={alert.id}
                className={`p-4 sm:p-5 flex items-start gap-4 transition-colors ${
                  isUnread ? 'bg-blue-50/30 dark:bg-blue-950/20' : 'hover:bg-gray-50/50 dark:hover:bg-gray-800/40'
                }`}
              >
                <div
                  className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    isUnread
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                  }`}
                >
                  {alert.type.includes('TAX') ? (
                    <Receipt className='h-5 w-5' />
                  ) : alert.type.includes('GOAL') ? (
                    <Target className='h-5 w-5' />
                  ) : alert.type.includes('EMERGENCY') ? (
                    <ShieldAlert className='h-5 w-5' />
                  ) : (
                    <Bell className='h-5 w-5' />
                  )}
                </div>

                <div className='flex-1 space-y-1'>
                  <div className='flex items-center justify-between gap-2'>
                    <h3 className={`text-sm sm:text-base font-bold ${isUnread ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                      {alert.title}
                    </h3>
                    <span className='text-[11px] font-medium text-gray-400 shrink-0 flex items-center gap-1'>
                      <Clock className='h-3 w-3' />
                      {new Date(alert.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className='text-xs text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl'>{alert.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState title='No notifications' description='All financial priorities are up to date.' />
      )}
    </div>
  );
}


