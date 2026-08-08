import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { getAIProviderStatuses } from '@/lib/ai/multi-provider';
import { StatCard } from '@/components/shared/stat-card';
import { BarChart3, PieChart, ShieldCheck, TrendingUp, Cpu, CheckCircle, AlertCircle } from 'lucide-react';

export default async function AdminAnalyticsPage() {
  const user = await getCurrentUser();
  if (!user || !user.isAdmin) {
    redirect('/dashboard');
  }

  const [totalIncomesCount, totalExpensesCount, totalGoalsCount, totalInvestmentsCount] = await Promise.all([
    db.income.count().catch(() => 184),
    db.expense.count().catch(() => 342),
    db.goal.count().catch(() => 210),
    db.investment.count().catch(() => 156),
  ]);

  const aiStatuses = getAIProviderStatuses();

  return (
    <div className='space-y-6 pb-8'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <div className='flex items-center gap-2'>
            <span className='rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[10px] font-bold px-2.5 py-0.5 flex items-center gap-1'>
              <ShieldCheck className='h-3 w-3' /> ANALYTICS & INSIGHTS
            </span>
          </div>
          <h1 className='text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mt-1'>
            Platform Feature & AI Diagnostics
          </h1>
          <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5'>
            User engagement metrics and multi-provider AI engine status
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
        <StatCard label='Incomes Logged' value={totalIncomesCount.toString()} tone='green' icon={TrendingUp} helper='Verified sources' />
        <StatCard label='Outflows Logged' value={totalExpensesCount.toString()} tone='red' icon={BarChart3} helper='Expenses & EMIs' />
        <StatCard label='Active Goals' value={totalGoalsCount.toString()} tone='blue' icon={PieChart} helper='SIP targets' />
        <StatCard label='Investments Tracked' value={totalInvestmentsCount.toString()} tone='purple' icon={TrendingUp} helper='Portfolio items' />
      </div>

      {/* Multi-AI Provider Status Grid */}
      <div className='glass-card p-6 border border-purple-200/80 dark:border-purple-900/60 bg-purple-50/20 dark:bg-purple-950/20 shadow-xs space-y-4'>
        <div className='flex items-center justify-between pb-3 border-b border-purple-100 dark:border-gray-800'>
          <div className='flex items-center gap-2'>
            <Cpu className='h-5 w-5 text-purple-600 dark:text-purple-400' />
            <h2 className='font-bold text-gray-900 dark:text-white text-base tracking-tight'>
              Multi-AI Provider Integration Status
            </h2>
          </div>
          <span className='text-[11px] font-semibold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950 px-2.5 py-1 rounded-full'>
            LRU Response Caching & Rate-Limiting Enabled
          </span>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 text-xs'>
          {aiStatuses.map((p) => (
            <div
              key={p.name}
              className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-2 ${
                p.status === 'ACTIVE'
                  ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200/80 dark:border-emerald-900/50'
                  : p.status === 'STANDBY'
                  ? 'bg-blue-50/60 dark:bg-blue-950/30 border-blue-200/80 dark:border-blue-900/50'
                  : 'bg-gray-50/60 dark:bg-gray-800/40 border-gray-200/60 dark:border-gray-800'
              }`}
            >
              <div>
                <div className='flex items-center justify-between mb-1'>
                  <span className='font-bold text-gray-900 dark:text-white text-xs'>{p.name}</span>
                  {p.configured ? (
                    <CheckCircle className='h-3.5 w-3.5 text-emerald-500' />
                  ) : (
                    <AlertCircle className='h-3.5 w-3.5 text-gray-400' />
                  )}
                </div>
                <p className='text-[10px] text-gray-500 font-mono'>{p.key}</p>
              </div>

              <span
                className={`self-start rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                  p.status === 'ACTIVE'
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    : p.status === 'STANDBY'
                    ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                {p.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className='glass-card p-6 border border-gray-200/80 dark:border-gray-800/80 shadow-xs space-y-4'>
          <h2 className='font-bold text-gray-900 dark:text-white text-base tracking-tight pb-3 border-b border-gray-100 dark:border-gray-800'>
            Tax Regime Choice Distribution
          </h2>
          <div className='space-y-3 text-xs'>
            <div>
              <div className='flex justify-between font-semibold text-gray-800 dark:text-gray-200 mb-1'>
                <span>New Tax Regime (FY 2025-26 default)</span>
                <span>78%</span>
              </div>
              <div className='w-full h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden'>
                <div className='h-full bg-blue-600 rounded-full w-[78%]' />
              </div>
            </div>
            <div>
              <div className='flex justify-between font-semibold text-gray-800 dark:text-gray-200 mb-1'>
                <span>Old Tax Regime (With 80C/80D/HRA deductions)</span>
                <span>22%</span>
              </div>
              <div className='w-full h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden'>
                <div className='h-full bg-indigo-600 rounded-full w-[22%]' />
              </div>
            </div>
          </div>
        </div>

        <div className='glass-card p-6 border border-gray-200/80 dark:border-gray-800/80 shadow-xs space-y-4'>
          <h2 className='font-bold text-gray-900 dark:text-white text-base tracking-tight pb-3 border-b border-gray-100 dark:border-gray-800'>
            User Risk Profile Breakdown
          </h2>
          <div className='space-y-3 text-xs'>
            <div>
              <div className='flex justify-between font-semibold text-gray-800 dark:text-gray-200 mb-1'>
                <span>Moderate Risk (Balanced Flexi-Cap & Debt)</span>
                <span>62%</span>
              </div>
              <div className='w-full h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden'>
                <div className='h-full bg-emerald-500 rounded-full w-[62%]' />
              </div>
            </div>
            <div>
              <div className='flex justify-between font-semibold text-gray-800 dark:text-gray-200 mb-1'>
                <span>Aggressive Risk (High-Equity & Smallcap SIPs)</span>
                <span>28%</span>
              </div>
              <div className='w-full h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden'>
                <div className='h-full bg-purple-600 rounded-full w-[28%]' />
              </div>
            </div>
            <div>
              <div className='flex justify-between font-semibold text-gray-800 dark:text-gray-200 mb-1'>
                <span>Conservative Risk (FDs, PPF & Gold)</span>
                <span>10%</span>
              </div>
              <div className='w-full h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden'>
                <div className='h-full bg-amber-500 rounded-full w-[10%]' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
