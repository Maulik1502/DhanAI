'use client';

import { ScoreBadge } from '@/components/market/score-badge';
import { formatINR } from '@/lib/calculators';

export function MfTable({ rows }: { rows: Array<{ code: string; name: string; nav: number; returns3Y: number; score: number }> }) {
  return (
    <div className='overflow-hidden rounded-2xl border bg-white shadow-sm dark:bg-gray-800'>
      <table className='min-w-full text-sm'>
        <thead className='bg-gray-50 text-left text-gray-500 dark:bg-gray-900'>
          <tr><th className='px-4 py-3'>Fund</th><th className='px-4 py-3'>NAV</th><th className='px-4 py-3'>3Y</th><th className='px-4 py-3'>Score</th></tr>
        </thead>
        <tbody>
          {rows.map((row) => <tr key={row.code} className='border-t'><td className='px-4 py-3 font-medium'>{row.name}</td><td className='px-4 py-3'>{formatINR(row.nav)}</td><td className='px-4 py-3'>{row.returns3Y}%</td><td className='px-4 py-3'><ScoreBadge score={row.score} /></td></tr>)}
        </tbody>
      </table>
    </div>
  );
}
