'use client';

import { formatINR } from '@/lib/calculators';

export function ExpenseCard({ item }: { item: { name: string; amount: number; frequency: string; category: string; isEMI?: boolean; emiMonthsLeft?: number | null } }) {
  return (
    <div className='rounded-xl border bg-white p-4 shadow-sm card-hover dark:bg-gray-800'>
      <div className='flex items-center justify-between gap-3'>
        <div>
          <p className='text-sm font-medium text-gray-500'>{item.category}</p>
          <h3 className='font-semibold text-gray-900 dark:text-white'>{item.name}</h3>
          {item.isEMI ? <p className='text-xs text-amber-600'>{item.emiMonthsLeft ?? 0} months left</p> : null}
        </div>
        <div className='text-right'>
          <p className='amount-negative font-semibold'>{formatINR(item.amount)}</p>
          <p className='text-xs text-gray-500'>{item.frequency}</p>
        </div>
      </div>
    </div>
  );
}
