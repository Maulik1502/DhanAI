'use client';

import { BarChart3 } from 'lucide-react';

export function TaxCalculator() {
  return <div className='rounded-2xl border bg-white p-5 shadow-sm'><div className='flex items-center gap-2 text-sm text-gray-500'><BarChart3 className='h-4 w-4' /><span>Tax calculator</span></div></div>;
}
