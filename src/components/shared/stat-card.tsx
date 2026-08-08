import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

export function StatCard({
  label,
  value,
  helper,
  icon: Icon,
  tone = 'blue',
}: {
  label: string;
  value: ReactNode;
  helper?: string;
  icon?: LucideIcon;
  tone?: 'blue' | 'green' | 'red' | 'amber' | 'purple';
}) {
  const tones = {
    blue: 'bg-gradient-to-br from-blue-50/80 to-blue-100/40 border-blue-200/60 text-blue-900 dark:from-blue-950/40 dark:to-blue-900/20 dark:border-blue-900/40 dark:text-blue-100',
    green: 'bg-gradient-to-br from-emerald-50/80 to-emerald-100/40 border-emerald-200/60 text-emerald-900 dark:from-emerald-950/40 dark:to-emerald-900/20 dark:border-emerald-900/40 dark:text-emerald-100',
    red: 'bg-gradient-to-br from-rose-50/80 to-rose-100/40 border-rose-200/60 text-rose-900 dark:from-rose-950/40 dark:to-rose-900/20 dark:border-rose-900/40 dark:text-rose-100',
    amber: 'bg-gradient-to-br from-amber-50/80 to-amber-100/40 border-amber-200/60 text-amber-900 dark:from-amber-950/40 dark:to-amber-900/20 dark:border-amber-900/40 dark:text-amber-100',
    purple: 'bg-gradient-to-br from-purple-50/80 to-purple-100/40 border-purple-200/60 text-purple-900 dark:from-purple-950/40 dark:to-purple-900/20 dark:border-purple-900/40 dark:text-purple-100',
  };

  const iconTones = {
    blue: 'bg-blue-600/10 text-blue-600 dark:bg-blue-400/20 dark:text-blue-400',
    green: 'bg-emerald-600/10 text-emerald-600 dark:bg-emerald-400/20 dark:text-emerald-400',
    red: 'bg-rose-600/10 text-rose-600 dark:bg-rose-400/20 dark:text-rose-400',
    amber: 'bg-amber-600/10 text-amber-600 dark:bg-amber-400/20 dark:text-amber-400',
    purple: 'bg-purple-600/10 text-purple-600 dark:bg-purple-400/20 dark:text-purple-400',
  };

  return (
    <div className={`rounded-2xl border p-5 shadow-xs backdrop-blur-md transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${tones[tone]}`}>
      <div className='flex items-center justify-between'>
        <p className='text-xs font-semibold uppercase tracking-wider opacity-75'>{label}</p>
        {Icon && (
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconTones[tone]}`}>
            <Icon className='h-4 w-4' />
          </div>
        )}
      </div>
      <div className='mt-3 text-2xl font-bold font-mono tracking-tight'>{value}</div>
      {helper && <p className='mt-2 text-xs font-medium opacity-75'>{helper}</p>}
    </div>
  );
}



