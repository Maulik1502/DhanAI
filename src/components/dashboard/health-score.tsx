import { Activity, ShieldCheck, Sparkles } from 'lucide-react';

export function HealthScore({ score }: { score: number }) {
  const grade =
    score >= 80
      ? { label: 'Excellent', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400' }
      : score >= 65
      ? { label: 'Good', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400' }
      : score >= 45
      ? { label: 'Average', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400' }
      : score >= 25
      ? { label: 'Needs Attention', color: 'bg-orange-500/10 text-orange-600 border-orange-500/20 dark:text-orange-400' }
      : { label: 'Critical', color: 'bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400' };

  const strokeDashoffset = 283 - (283 * score) / 100;

  return (
    <div className='glass-card p-6 border border-gray-200/80 dark:border-gray-800/80 shadow-xs transition-all duration-200 hover:shadow-md'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Activity className='h-4 w-4 text-blue-600 dark:text-blue-400' />
          <p className='text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400'>Financial Health Index</p>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs font-bold ${grade.color}`}>{grade.label}</span>
      </div>

      <div className='mt-5 flex flex-col sm:flex-row items-center gap-6'>
        <div className='relative flex items-center justify-center shrink-0'>
          <svg className='h-28 w-28 -rotate-90 transform' viewBox='0 0 100 100'>
            <circle cx='50' cy='50' r='45' className='stroke-gray-100 dark:stroke-gray-800' strokeWidth='8' fill='none' />
            <circle
              cx='50'
              cy='50'
              r='45'
              className='stroke-blue-600 dark:stroke-blue-500 transition-all duration-1000 ease-out'
              strokeWidth='8'
              strokeDasharray='283'
              strokeDashoffset={strokeDashoffset}
              strokeLinecap='round'
              fill='none'
            />
          </svg>
          <div className='absolute flex flex-col items-center justify-center text-center'>
            <span className='font-mono text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight'>{score}</span>
            <span className='text-[10px] font-semibold text-gray-400 uppercase tracking-widest'>/ 100</span>
          </div>
        </div>

        <div className='space-y-2 text-center sm:text-left'>
          <h3 className='font-bold text-gray-900 dark:text-white text-base flex items-center justify-center sm:justify-start gap-1.5'>
            <ShieldCheck className='h-4 w-4 text-emerald-500' />
            Health Status: {grade.label}
          </h3>
          <p className='text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm'>
            Evaluated against your monthly surplus, EMI commitments, emergency fund progress, and savings discipline.
          </p>
          <div className='pt-1 flex items-center justify-center sm:justify-start gap-2 text-[11px] font-medium text-blue-600 dark:text-blue-400'>
            <Sparkles className='h-3.5 w-3.5' />
            <span>AI recommendation active</span>
          </div>
        </div>
      </div>
    </div>
  );
}



