import { formatINR } from '@/lib/calculators';
import { ShieldCheck, ShieldAlert, HeartPulse, Car, Home, Activity, CheckCircle2, Sparkles } from 'lucide-react';

export function InsuranceCard({
  item,
}: {
  item: { type: string; priority: string; status: string; coverAmount: number; premium: number; reason: string };
}) {
  const isCritical = item.priority === 'CRITICAL';
  const isActive = item.status === 'ACTIVE';

  const priorityStyles = isCritical
    ? 'bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400'
    : item.priority === 'RECOMMENDED'
    ? 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400'
    : 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400';

  const statusStyles = isActive
    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
    : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300';

  const Icon = item.type.includes('HEALTH')
    ? HeartPulse
    : item.type.includes('MOTOR')
    ? Car
    : item.type.includes('HOME')
    ? Home
    : item.type.includes('CRITICAL')
    ? Activity
    : ShieldCheck;

  return (
    <div className='glass-card p-6 border border-gray-200/80 dark:border-gray-800/80 shadow-xs flex flex-col justify-between space-y-4 group transition-all duration-200 hover:shadow-md hover:-translate-y-0.5'>
      <div className='space-y-3'>
        <div className='flex items-start justify-between gap-3'>
          <div className='flex items-center gap-3'>
            <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${isCritical ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'}`}>
              <Icon className='h-5 w-5' />
            </div>
            <div>
              <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${priorityStyles}`}>
                {item.priority}
              </span>
              <h3 className='font-bold text-gray-900 dark:text-white text-base mt-1'>
                {item.type.replaceAll('_', ' ')} Insurance
              </h3>
            </div>
          </div>

          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusStyles}`}>
            {item.status}
          </span>
        </div>

        <p className='text-xs text-gray-600 dark:text-gray-400 leading-relaxed bg-gray-50/80 dark:bg-gray-800/40 p-3 rounded-xl border border-gray-100 dark:border-gray-800'>
          {item.reason}
        </p>
      </div>

      <div className='pt-3 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-3 text-xs'>
        <div className='rounded-xl bg-gray-50/80 dark:bg-gray-800/40 p-2.5 border border-gray-100 dark:border-gray-800'>
          <span className='text-[10px] text-gray-400 font-medium uppercase'>Cover Protection</span>
          <p className='font-mono font-bold text-gray-900 dark:text-white text-sm mt-0.5'>
            {formatINR(item.coverAmount)}
          </p>
        </div>

        <div className='rounded-xl bg-gray-50/80 dark:bg-gray-800/40 p-2.5 border border-gray-100 dark:border-gray-800'>
          <span className='text-[10px] text-gray-400 font-medium uppercase'>Annual Premium</span>
          <p className='font-mono font-bold text-blue-600 dark:text-blue-400 text-sm mt-0.5'>
            {formatINR(item.premium)}/yr
          </p>
        </div>
      </div>
    </div>
  );
}



