'use client';

import { ProgressBar } from '@/components/shared/progress-bar';
import { formatINR } from '@/lib/calculators';

export function IncomeCard({ item }: { item: { name: string; amount: number; frequency: string; type: string } }) {
  return (
    <div className='rounded-xl border bg-white p-4 shadow-sm card-hover dark:bg-gray-800'>
      <div className='flex items-center justify-between gap-3'>
        <div>
          <p className='text-sm font-medium text-blue-600'>{item.type}</p>
          <h3 className='font-semibold text-gray-900 dark:text-white'>{item.name}</h3>
        </div>
        <div className='text-right'>
          <p className='amount-positive font-semibold'>{formatINR(item.amount)}</p>
          <p className='text-xs text-gray-500'>{item.frequency}</p>
        </div>
      </div>
    </div>
  );
}
