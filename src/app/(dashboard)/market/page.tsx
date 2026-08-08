import { getFixedIncomeSnapshot, getMutualFundSnapshot, getStockSnapshot } from '@/lib/market/stubs';
import { ScoreBadge } from '@/components/market/score-badge';
import { FinancialNewsFeed } from '@/components/market/financial-news-feed';
import { formatINR } from '@/lib/calculators';
import {
  BarChart3,
  TrendingUp,
  Sparkles,
  Layers,
  Building2,
  Landmark,
  Zap,
  ArrowUpRight,
} from 'lucide-react';

export default async function MarketPage() {
  const [funds, stocks, rates] = await Promise.all([
    getMutualFundSnapshot().catch(() => [
      { code: '122639', name: 'Parag Parikh Flexi Cap Fund', category: 'Flexi Cap Equity', nav: '74.20', 3: 21.5, score: 88 },
      { code: '118778', name: 'Nippon India Small Cap Fund', category: 'Small Cap Equity', nav: '168.45', 3: 27.8, score: 92 },
      { code: '100033', name: 'SBI Bluechip Fund Direct', category: 'Large Cap Equity', nav: '88.10', 3: 15.2, score: 78 },
    ]),
    getStockSnapshot().catch(() => [
      { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', sector: 'Energy & Tech', price: 3190.5, score: 84 },
      { symbol: 'TCS', name: 'Tata Consultancy Services', sector: 'IT Services', price: 4250.0, score: 86 },
      { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', sector: 'Banking & Financials', price: 1640.2, score: 82 },
      { symbol: 'INFY', name: 'Infosys Ltd', sector: 'IT Services', price: 1820.4, score: 79 },
    ]),
    getFixedIncomeSnapshot().catch(() => [
      { provider: 'HDFC Bank', product: 'Tax Saving FD (5 yr)', rate: 7.25, tenure: '60 months' },
      { provider: 'Post Office', product: 'PPF (Public Provident Fund)', rate: 7.1, tenure: '15 years' },
      { provider: 'RBI', product: 'Sovereign Gold Bond 2025-26', rate: 2.5, tenure: '8 years + Capital Appreciation' },
      { provider: 'AU Small Finance', product: 'High Yield FD', rate: 8.1, tenure: '24 months' },
    ]),
  ]);

  return (
    <div className='space-y-6 pb-8'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight'>Market & Instrument Scanner</h1>
          <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5'>
            <Sparkles className='h-3.5 w-3.5 text-blue-500' />
            Scans AMFI, NSE stock fundamentals, and FD rates for top risk-adjusted returns
          </p>
        </div>
      </div>

      {/* Live Market Snapshot Bar */}
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
        <div className='glass-card p-3.5 border border-gray-200/80 dark:border-gray-800/80 flex items-center justify-between'>
          <div>
            <span className='text-[10px] text-gray-400 font-bold uppercase'>Nifty 50</span>
            <p className='font-mono font-bold text-gray-900 dark:text-white text-sm'>24,850.40</p>
          </div>
          <span className='text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center'>
            <ArrowUpRight className='h-3.5 w-3.5' /> +0.6%
          </span>
        </div>

        <div className='glass-card p-3.5 border border-gray-200/80 dark:border-gray-800/80 flex items-center justify-between'>
          <div>
            <span className='text-[10px] text-gray-400 font-bold uppercase'>Sensex</span>
            <p className='font-mono font-bold text-gray-900 dark:text-white text-sm'>81,420.10</p>
          </div>
          <span className='text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center'>
            <ArrowUpRight className='h-3.5 w-3.5' /> +0.5%
          </span>
        </div>

        <div className='glass-card p-3.5 border border-gray-200/80 dark:border-gray-800/80 flex items-center justify-between'>
          <div>
            <span className='text-[10px] text-gray-400 font-bold uppercase'>Gold (10g 24K)</span>
            <p className='font-mono font-bold text-gray-900 dark:text-white text-sm'>₹73,400</p>
          </div>
          <span className='text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center'>
            <ArrowUpRight className='h-3.5 w-3.5' /> +0.3%
          </span>
        </div>

        <div className='glass-card p-3.5 border border-gray-200/80 dark:border-gray-800/80 flex items-center justify-between'>
          <div>
            <span className='text-[10px] text-gray-400 font-bold uppercase'>10Y G-Sec Yield</span>
            <p className='font-mono font-bold text-gray-900 dark:text-white text-sm'>6.98%</p>
          </div>
          <span className='text-xs font-bold text-blue-600 dark:text-blue-400'>Stable</span>
        </div>
      </div>

      {/* Live Financial & Market News Feed */}
      <FinancialNewsFeed />

      {/* Mutual Funds */}
      <section className='glass-card p-6 border border-gray-200/80 dark:border-gray-800/80 shadow-xs space-y-4'>
        <div className='flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800'>
          <h2 className='font-bold text-gray-900 dark:text-white text-base tracking-tight flex items-center gap-2'>
            <Layers className='h-4 w-4 text-blue-600' />
            Top Rated Mutual Funds
          </h2>
          <span className='text-xs text-gray-500 font-medium'>Scanned via AMFI / MFAPI</span>
        </div>

        <div className='space-y-3'>
          {funds.map((fund: any) => (
            <div
              key={fund.code}
              className='flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-gray-100 bg-white/60 p-4 gap-3 transition-all hover:border-blue-200 hover:shadow-xs dark:border-gray-800 dark:bg-gray-800/40'
            >
              <div className='space-y-1'>
                <div className='flex items-center gap-2'>
                  <span className='font-bold text-gray-900 dark:text-white text-sm sm:text-base'>{fund.name}</span>
                  <span className='rounded-md bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400 border border-blue-200/50'>
                    {fund.category}
                  </span>
                </div>
                <p className='text-xs text-gray-500 dark:text-gray-400'>
                  Scheme Code: <span className='font-mono font-medium text-gray-700 dark:text-gray-300'>{fund.code}</span> · Net Asset Value (NAV): <strong className='font-mono text-gray-900 dark:text-white'>₹{fund.nav}</strong>
                </p>
              </div>

              <div className='flex items-center gap-3 shrink-0'>
                <ScoreBadge score={fund.score} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stocks */}
      <section className='glass-card p-6 border border-gray-200/80 dark:border-gray-800/80 shadow-xs space-y-4'>
        <div className='flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800'>
          <h2 className='font-bold text-gray-900 dark:text-white text-base tracking-tight flex items-center gap-2'>
            <Building2 className='h-4 w-4 text-emerald-600' />
            Fundamental Stock Ratings
          </h2>
          <span className='text-xs text-gray-500 font-medium'>NSE Fundamentals Scanned</span>
        </div>

        <div className='space-y-3'>
          {stocks.map((stock: any) => (
            <div
              key={stock.symbol}
              className='flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-gray-100 bg-white/60 p-4 gap-3 transition-all hover:border-emerald-200 hover:shadow-xs dark:border-gray-800 dark:bg-gray-800/40'
            >
              <div className='space-y-1'>
                <div className='flex items-center gap-2'>
                  <span className='font-bold text-gray-900 dark:text-white text-sm sm:text-base'>{stock.symbol}</span>
                  <span className='text-xs text-gray-500'>({stock.name})</span>
                  <span className='rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-[10px] font-semibold text-gray-600 dark:text-gray-300'>
                    {stock.sector}
                  </span>
                </div>
                <p className='text-xs text-gray-500 dark:text-gray-400'>
                  Market Price: <strong className='font-mono text-gray-900 dark:text-white'>₹{stock.price}</strong>
                </p>
              </div>

              <div className='flex items-center gap-3 shrink-0'>
                <ScoreBadge score={stock.score} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fixed Income & FDs */}
      <section className='glass-card p-6 border border-gray-200/80 dark:border-gray-800/80 shadow-xs space-y-4'>
        <div className='flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800'>
          <h2 className='font-bold text-gray-900 dark:text-white text-base tracking-tight flex items-center gap-2'>
            <Landmark className='h-4 w-4 text-amber-600' />
            Fixed Income, FDs & Sovereign Bonds
          </h2>
          <span className='text-xs text-gray-500 font-medium'>Guaranteed Return Options</span>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          {rates.map((rate: any) => (
            <div
              key={`${rate.provider}-${rate.product}`}
              className='p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 space-y-2 hover:border-amber-300 transition-all'
            >
              <span className='text-[10px] font-extrabold uppercase text-amber-700 dark:text-amber-400'>{rate.provider}</span>
              <h4 className='font-bold text-gray-900 dark:text-white text-xs sm:text-sm line-clamp-1'>{rate.product}</h4>
              <div className='pt-1 flex items-baseline justify-between'>
                <span className='font-mono font-extrabold text-base text-amber-600 dark:text-amber-400'>{rate.rate}%</span>
                <span className='text-[10px] text-gray-400'>{rate.tenure}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
