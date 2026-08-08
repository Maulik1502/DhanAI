'use client';

import { formatINR } from '@/lib/calculators';

export function SurplusSummary({ income, expenses }: { income: number; expenses: number }) {
  const surplus = income - expenses;
  return (
    <div className='rounded-2xl border bg-white p-5 shadow-sm dark:bg-gray-800'>
      <p className='text-sm text-gray-500'>Monthly Surplus</p>
      <p className={`mt-2 text-3xl font-bold ${surplus >= 0 ? 'amount-positive' : 'amount-negative'}`}>{formatINR(surplus)}</p>
      <p className='mt-1 text-sm text-gray-500'>Income {formatINR(income)} minus expenses {formatINR(expenses)}</p>
    </div>
  );
}
