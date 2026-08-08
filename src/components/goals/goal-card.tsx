import Link from 'next/link';
import { formatINR } from '@/lib/calculators';
import { Calendar, Target, TrendingUp, Sparkles } from 'lucide-react';

type GoalCardProps = {
  goal: {
    id: string;
    emoji: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline: Date;
    monthlySIP: number;
    instrument: string;
  };
};

export function GoalCard({ goal }: GoalCardProps) {
  const progress = goal.targetAmount > 0 ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100)) : 0;
  const deadlineStr = new Date(goal.deadline).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });

  return (
    <Link
      href={`/goals/${goal.id}`}
      className='glass-card p-6 border border-gray-200/80 dark:border-gray-800/80 shadow-xs flex flex-col justify-between space-y-4 group transition-all duration-250 hover:shadow-lg hover:-translate-y-1 hover:border-blue-300 dark:hover:border-blue-900/60'
    >
      <div className='space-y-3'>
        <div className='flex items-start justify-between gap-3'>
          <div className='flex items-center gap-3'>
            <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-2xl shadow-xs group-hover:scale-110 transition-transform'>
              {goal.emoji || '🎯'}
            </div>
            <div>
              <h3 className='font-bold text-gray-900 dark:text-white text-base leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
                {goal.name}
              </h3>
              <p className='text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5'>
                <Target className='h-3 w-3 text-blue-500' />
                <span>{goal.instrument}</span>
              </p>
            </div>
          </div>

          <div className='flex flex-col items-end shrink-0'>
            <span className='rounded-full bg-blue-50 dark:bg-blue-950 px-2.5 py-1 text-xs font-extrabold text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50'>
              {progress}%
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className='space-y-1.5 pt-1'>
          <div className='h-2.5 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden p-0.5 border border-gray-200/40 dark:border-gray-700/40'>
            <div
              className='h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500'
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className='flex items-center justify-between text-[11px] font-medium text-gray-500'>
            <span>Saved: <strong className='font-mono text-gray-900 dark:text-white'>{formatINR(goal.currentAmount)}</strong></span>
            <span>Target: <strong className='font-mono text-gray-900 dark:text-white'>{formatINR(goal.targetAmount)}</strong></span>
          </div>
        </div>
      </div>

      <div className='pt-3 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-3 text-xs'>
        <div className='rounded-xl bg-gray-50/80 dark:bg-gray-800/40 p-2.5 border border-gray-100/80 dark:border-gray-800'>
          <span className='text-[10px] text-gray-400 font-medium uppercase'>Monthly SIP</span>
          <p className='font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm mt-0.5'>
            {formatINR(goal.monthlySIP)}
          </p>
        </div>

        <div className='rounded-xl bg-gray-50/80 dark:bg-gray-800/40 p-2.5 border border-gray-100/80 dark:border-gray-800'>
          <span className='text-[10px] text-gray-400 font-medium uppercase'>Target Date</span>
          <p className='font-medium text-gray-900 dark:text-white text-xs sm:text-sm mt-0.5 flex items-center gap-1'>
            <Calendar className='h-3 w-3 text-gray-400' />
            <span>{deadlineStr}</span>
          </p>
        </div>
      </div>
    </Link>
  );
}



