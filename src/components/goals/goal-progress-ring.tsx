'use client';

import { formatINR } from '@/lib/calculators';
import { ProgressBar } from '@/components/shared/progress-bar';

export function GoalProgressRing({ progress }: { progress: number }) {
  return (
    <div className='grid h-28 w-28 place-items-center rounded-full border-8 border-blue-100 bg-white text-center shadow-sm'>
      <div>
        <p className='text-xl font-bold text-gray-900'>{Math.round(progress)}%</p>
        <p className='text-xs text-gray-500'>done</p>
      </div>
    </div>
  );
}
