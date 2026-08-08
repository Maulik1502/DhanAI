import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { calcCorpusProjections, CORPUS_RETURNS, formatINR } from '@/lib/calculators';
import { StatCard } from '@/components/shared/stat-card';
import { redirect } from 'next/navigation';
import {
  PiggyBank,
  TrendingUp,
  Sparkles,
  Layers,
  PieChart,
  Calendar,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

export default async function CorpusPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const riskLevel = user.riskLevel || 'MODERATE';
  const allocation = CORPUS_RETURNS[riskLevel] || { equity: 0.5, debt: 0.4, gold: 0.1, expectedReturn: 11 };

  const corpus = await db.corpus
    .upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        targetAmount: 10000000,
        currentValue: 450000,
        monthlyInvestment: 25000,
        expectedReturn: allocation.expectedReturn,
        projections: JSON.stringify(calcCorpusProjections(450000, 25000, allocation.expectedReturn)),
        allocation: JSON.stringify(allocation),
      },
      update: {},
    })
    .catch(() => ({
      id: 'corpus-1',
      userId: user.id,
      targetAmount: 30000000,
      currentValue: 450000,
      monthlyInvestment: 25000,
      expectedReturn: allocation.expectedReturn,
      timelineYears: 20,
      projections: JSON.stringify(calcCorpusProjections(450000, 25000, allocation.expectedReturn)),
      allocation: JSON.stringify(allocation),
    }));

  let projections: Record<string, number> = {};
  try {
    projections = typeof corpus.projections === 'string' ? JSON.parse(corpus.projections) : corpus.projections;
  } catch {
    projections = calcCorpusProjections(450000, 25000, allocation.expectedReturn);
  }

  return (
    <div className='space-y-6 pb-8'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight'>Wealth Corpus Builder</h1>
          <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5'>
            <Sparkles className='h-3.5 w-3.5 text-blue-500' />
            Long-term retirement & passive income corpus engine (4% Safe Withdrawal Rule)
          </p>
        </div>
        <Link
          href='/chat?prompt=Calculate%20how%20much%20corpus%20I%20need%20for%201%20lakh%20per%20month%20passive%20income'
          className='inline-flex items-center gap-2 rounded-xl bg-dhan-gradient px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-500/20 hover:opacity-95 transition-all self-start sm:self-auto'
        >
          <Zap className='h-3.5 w-3.5' />
          <span>Passive Income Calculator</span>
        </Link>
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <StatCard label='Accumulated Corpus' value={formatINR(corpus.currentValue)} tone='blue' icon={PiggyBank} helper='Current wealth base' />
        <StatCard label='Monthly Allocation' value={formatINR(corpus.monthlyInvestment)} tone='green' icon={TrendingUp} helper='Automated monthly discipline' />
        <StatCard label='Target Retirement Corpus' value={formatINR(corpus.targetAmount)} tone='purple' icon={Layers} helper={`4% Rule: ${formatINR(Math.round(corpus.targetAmount * 0.04 / 12))}/mo passive`} />
      </div>

      {/* Projection Milestone Cards */}
      <div className='glass-card p-6 border border-gray-200/80 dark:border-gray-800/80 space-y-5'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-100 dark:border-gray-800 pb-4'>
          <div>
            <h2 className='text-base font-bold text-gray-900 dark:text-white flex items-center gap-2'>
              <Calendar className='h-4 w-4 text-blue-600' />
              Compound Projection Horizons
            </h2>
            <p className='text-xs text-gray-500 mt-0.5'>Projected wealth path assuming {allocation.expectedReturn}% annualized returns ({riskLevel.toLowerCase()} risk profile)</p>
          </div>
          <span className='rounded-full bg-blue-100 dark:bg-blue-950 px-3 py-1 text-xs font-bold text-blue-700 dark:text-blue-300'>
            {allocation.expectedReturn}% Expected CAGR
          </span>
        </div>

        <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5'>
          {Object.entries(projections).map(([year, val]) => (
            <div key={year} className='glass-card p-4 text-center space-y-1.5 border border-blue-100 dark:border-blue-900/40 bg-blue-50/30 dark:bg-blue-950/20 hover:border-blue-300 transition-all'>
              <span className='text-[11px] font-extrabold uppercase text-blue-600 dark:text-blue-400'>{year} Years Horizon</span>
              <p className='font-mono font-extrabold text-gray-900 dark:text-white text-base sm:text-lg tracking-tight'>
                {formatINR(val)}
              </p>
              <span className='text-[10px] text-gray-400 block'>Compound Valuation</span>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Asset Allocation */}
      <div className='glass-card p-6 border border-gray-200/80 dark:border-gray-800/80 space-y-4'>
        <h3 className='text-base font-bold text-gray-900 dark:text-white flex items-center gap-2'>
          <PieChart className='h-4 w-4 text-indigo-600' />
          Target Asset Allocation ({riskLevel} Profile)
        </h3>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
          <div className='p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 space-y-1'>
            <span className='text-xs text-blue-700 dark:text-blue-300 font-medium'>Equity Index Funds</span>
            <p className='font-mono text-2xl font-bold text-blue-900 dark:text-blue-100'>{Math.round(allocation.equity * 100)}%</p>
            <p className='text-[11px] text-gray-500'>Nifty 50 & Next 50 Index</p>
          </div>

          <div className='p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/40 space-y-1'>
            <span className='text-xs text-emerald-700 dark:text-emerald-300 font-medium'>Debt & Bonds</span>
            <p className='font-mono text-2xl font-bold text-emerald-900 dark:text-emerald-100'>{Math.round(allocation.debt * 100)}%</p>
            <p className='text-[11px] text-gray-500'>Short Term Debt & G-Secs</p>
          </div>

          <div className='p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 space-y-1'>
            <span className='text-xs text-amber-700 dark:text-amber-300 font-medium'>Gold & Sovereign Gold Bonds</span>
            <p className='font-mono text-2xl font-bold text-amber-900 dark:text-amber-100'>{Math.round(allocation.gold * 100)}%</p>
            <p className='text-[11px] text-gray-500'>SGBs & Gold ETFs</p>
          </div>
        </div>
      </div>
    </div>
  );
}


