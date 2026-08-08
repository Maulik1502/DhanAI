'use client';

export function StepIndicator({ step, total }: { step: number; total: number }) {
  return <div className='rounded-full bg-gray-100 p-1 text-sm text-gray-600'><span className='rounded-full bg-blue-600 px-3 py-1 text-white'>Step {step}</span> / {total}</div>;
}
