'use client';

import { ShieldCheck } from 'lucide-react';

export function AiTipCard({ tip }: { tip: string }) {
  return (
    <div className='rounded-2xl bg-dhan-gradient p-5 text-white shadow-lg'>
      <div className='mb-3 flex items-center gap-2 text-sm text-blue-100'><ShieldCheck className='h-4 w-4' /><span>Daily AI tip</span></div>
      <p className='text-lg font-medium leading-7'>{tip}</p>
    </div>
  );
}
