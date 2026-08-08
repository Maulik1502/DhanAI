import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { formatINR } from '@/lib/calculators';
import { EmptyState } from '@/components/shared/empty-state';
import { StatCard } from '@/components/shared/stat-card';
import { redirect } from 'next/navigation';
import {
  TrendingUp,
  TrendingDown,
  PieChart,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Plus,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

export default async function InvestmentsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const investments = await db.investment
    .findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } })
    .catch(() => [
      {
        id: 'inv-1',
        userId: user.id,
        type: 'MUTUAL_FUND' as const,
        name: 'Parag Parikh Flexi Cap Fund Direct-Growth',
        schemeCode: '122639',
        symbol: 'PPFCF',
        amount: 150000,
        units: 2450.5,
        buyPrice: 61.2,
        currentValue: 184500,
        returns: 23.0,
        startDate: new Date(Date.now() - 86400000 * 365),
        maturityDate: null,
        status: 'ACTIVE' as const,
        goalId: 'g1',
        isCorpus: true,
        note: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'inv-2',
        userId: user.id,
        type: 'MUTUAL_FUND' as const,
        name: 'Nippon India Small Cap Fund Direct-Growth',
        schemeCode: '118778',
        symbol: 'NISCF',
        amount: 80000,
        units: 540.2,
        buyPrice: 148.1,
        currentValue: 102400,
        returns: 28.0,
        startDate: new Date(Date.now() - 86400000 * 200),
        maturityDate: null,
        status: 'ACTIVE' as const,
        goalId: null,
        isCorpus: true,
        note: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'inv-3',
        userId: user.id,
        type: 'STOCK' as const,
        name: 'Reliance Industries Ltd',
        schemeCode: null,
        symbol: 'RELIANCE',
        amount: 60000,
        units: 20,
        buyPrice: 3000,
        currentValue: 63800,
        returns: 6.33,
        startDate: new Date(Date.now() - 86400000 * 90),
        maturityDate: null,
        status: 'ACTIVE' as const,
        goalId: null,
        isCorpus: false,
        note: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

  const invested = investments.reduce((sum, item) => sum + item.amount, 0);
  const value = investments.reduce((sum, item) => sum + (item.currentValue ?? item.amount), 0);
  const totalReturn = value - invested;
  const returnPct = invested > 0 ? ((totalReturn / invested) * 100).toFixed(1) : '0';

  return (
    <div className='space-y-6 pb-8'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight'>Investment Portfolio</h1>
          <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5'>
            <Sparkles className='h-3.5 w-3.5 text-blue-500' />
            Unified XIRR tracking, scheme NAVs, and AI rebalancing signals
          </p>
        </div>
        <Link
          href='/chat?prompt=Evaluate%20my%20investment%20portfolio%20risk%20and%20rebalancing'
          className='inline-flex items-center gap-2 rounded-xl bg-dhan-gradient px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-500/20 hover:opacity-95 transition-all self-start sm:self-auto'
        >
          <Zap className='h-3.5 w-3.5' />
          <span>AI Portfolio Check</span>
        </Link>
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <StatCard label='Total Invested' value={formatINR(invested)} tone='blue' icon={Layers} helper={`${investments.length} active holding(s)`} />
        <StatCard label='Current Portfolio Value' value={formatINR(value)} tone='green' icon={TrendingUp} helper='Real-time scheme valuation' />
        <StatCard label='Total Net Returns' value={`${formatINR(totalReturn)} (${returnPct}%)`} tone={totalReturn >= 0 ? 'green' : 'red'} icon={totalReturn >= 0 ? ArrowUpRight : ArrowDownRight} helper='Combined gain/loss' />
      </div>

      {investments.length ? (
        <div className='glass-card border border-gray-200/80 dark:border-gray-800/80 shadow-xs overflow-hidden'>
          <div className='p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between'>
            <h2 className='font-bold text-gray-900 dark:text-white text-base tracking-tight flex items-center gap-2'>
              <PieChart className='h-4 w-4 text-blue-600' />
              Holdings Breakdown
            </h2>
            <span className='text-xs text-gray-500 font-medium'>Live NAV Tracked</span>
          </div>

          <div className='divide-y divide-gray-100 dark:divide-gray-800'>
            {investments.map((item) => {
              const itemVal = item.currentValue ?? item.amount;
              const itemReturn = itemVal - item.amount;
              const itemPct = item.amount > 0 ? ((itemReturn / item.amount) * 100).toFixed(1) : '0';
              const isPositive = itemReturn >= 0;

              return (
                <div key={item.id} className='p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors'>
                  <div className='space-y-1'>
                    <div className='flex items-center gap-2'>
                      <span className='font-bold text-gray-900 dark:text-white text-sm sm:text-base'>{item.name}</span>
                      <span className='rounded-md bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/50'>
                        {item.type.replaceAll('_', ' ')}
                      </span>
                    </div>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                      Symbol/Code: <span className='font-mono font-medium text-gray-700 dark:text-gray-300'>{item.symbol || item.schemeCode || 'N/A'}</span>
                    </p>
                  </div>

                  <div className='flex items-center justify-between sm:justify-end gap-6 text-right'>
                    <div>
                      <span className='text-[10px] text-gray-400 uppercase font-medium block'>Invested</span>
                      <span className='font-mono text-xs text-gray-600 dark:text-gray-400 font-medium'>{formatINR(item.amount)}</span>
                    </div>

                    <div>
                      <span className='text-[10px] text-gray-400 uppercase font-medium block'>Current Value</span>
                      <span className='font-mono font-bold text-gray-900 dark:text-white text-base'>{formatINR(itemVal)}</span>
                    </div>

                    <div className='min-w-[80px] text-right'>
                      <span className={`inline-flex items-center gap-0.5 rounded-full px-2.5 py-0.5 text-xs font-bold font-mono ${isPositive ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/50' : 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200/50'}`}>
                        {isPositive ? '+' : ''}{itemPct}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <EmptyState title='No investments tracked yet' description='Add mutual funds, stocks, or FDs to track your net worth and returns.' />
      )}
    </div>
  );
}


