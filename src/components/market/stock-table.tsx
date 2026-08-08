'use client';

import { ScoreBadge } from '@/components/market/score-badge';
import { formatINR } from '@/lib/calculators';

export function StockTable({ rows }: { rows: Array<{ symbol: string; name: string; price: number; score: number; note: string }> }) {
  return (
    <div className='overflow-hidden rounded-2xl border bg-white shadow-sm dark:bg-gray-800'>
      <table className='min-w-full text-sm'>
        <thead className='bg-gray-50 text-left text-gray-500 dark:bg-gray-900'><tr><th className='px-4 py-3'>Symbol</th><th className='px-4 py-3'>Price</th><th className='px-4 py-3'>Score</th><th className='px-4 py-3'>Note</th></tr></thead>
        <tbody>{rows.map((row) => <tr key={row.symbol} className='border-t'><td className='px-4 py-3 font-medium'>{row.symbol}</td><td className='px-4 py-3'>{formatINR(row.price)}</td><td className='px-4 py-3'><ScoreBadge score={row.score} /></td><td className='px-4 py-3 text-gray-500'>{row.note}</td></tr>)}</tbody>
      </table>
    </div>
  );
}
