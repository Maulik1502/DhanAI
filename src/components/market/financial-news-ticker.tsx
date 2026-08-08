'use client';

import { Newspaper, ExternalLink, TrendingUp, Sparkles, ShieldCheck } from 'lucide-react';

const newsItems = [
  {
    id: 1,
    headline: 'RBI Policy Review: Repo rate held stable at 6.5%; FD interest rates expected to remain attractive.',
    source: 'Economic Times',
    time: '30m ago',
    tag: 'BANKING',
  },
  {
    id: 2,
    headline: 'FY 2025-26 Tax Update: Standard deduction under New Tax Regime increased to ₹75,000.',
    source: 'Financial Express',
    time: '2h ago',
    tag: 'TAXATION',
  },
  {
    id: 3,
    headline: 'Nifty 50 touches new high; Largecap Flexi-Cap mutual funds register +14.2% annual XIRR.',
    source: 'Moneycontrol',
    time: '4h ago',
    tag: 'MARKETS',
  },
];

export function FinancialNewsTicker() {
  return (
    <div className='glass-card p-4 border border-blue-200/80 dark:border-blue-900/60 bg-blue-50/30 dark:bg-blue-950/20 rounded-2xl shadow-xs space-y-3'>
      <div className='flex items-center justify-between pb-2 border-b border-blue-100 dark:border-gray-800'>
        <div className='flex items-center gap-2'>
          <Newspaper className='h-4 w-4 text-blue-600 dark:text-blue-400' />
          <h2 className='font-bold text-gray-900 dark:text-white text-xs tracking-tight uppercase'>
            Live Market & Financial News Stream
          </h2>
        </div>
        <a
          href='/market'
          className='text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1'
        >
          <span>View All News</span> <ExternalLink className='h-3 w-3' />
        </a>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-3 text-xs'>
        {newsItems.map((item) => (
          <div
            key={item.id}
            className='p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/80 flex flex-col justify-between space-y-2'
          >
            <div>
              <div className='flex items-center justify-between text-[10px] text-gray-400 mb-1'>
                <span className='font-bold text-blue-600 dark:text-blue-400 uppercase'>{item.tag}</span>
                <span>{item.time}</span>
              </div>
              <p className='font-semibold text-gray-800 dark:text-gray-200 leading-snug line-clamp-2'>
                {item.headline}
              </p>
            </div>
            <span className='text-[10px] text-gray-400 italic'>Source: {item.source}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
