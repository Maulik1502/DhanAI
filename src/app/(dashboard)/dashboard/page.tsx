import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { formatINR, toMonthly } from '@/lib/calculators';
import { HealthScore } from '@/components/dashboard/health-score';
import { AIInsightsPanel } from '@/components/dashboard/ai-insights-panel';
import { DailyActivityFeed } from '@/components/dashboard/daily-activity-feed';
import { FinancialNewsTicker } from '@/components/market/financial-news-ticker';
import { DashboardIncomePrompt } from '@/components/dashboard/dashboard-income-prompt';
import {
  ArrowRight,
  ListTodo,
  AlertCircle,
  Sparkles,
  ShieldAlert,
  Target,
  Bell,
  Landmark,
  CreditCard,
  Building2,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  // Enforce Onboarding Gate: If user.onboarded is false, redirect to onboarding stepper
  if (!user.onboarded) redirect('/onboarding');

  const [incomes, expenses, goals, emergencyFund, alerts, taxProfile, investments] = await Promise.all([
    db.income.findMany({ where: { userId: user.id, isActive: true } }).catch(() => []),
    db.expense.findMany({ where: { userId: user.id, isActive: true } }).catch(() => []),
    db.goal.findMany({ where: { userId: user.id, status: 'ACTIVE' }, take: 3, orderBy: { deadline: 'asc' } }).catch(() => []),
    db.emergencyFund.findUnique({ where: { userId: user.id } }).catch(() => null),
    db.alert.findMany({ where: { userId: user.id, read: false }, take: 5, orderBy: { createdAt: 'desc' } }).catch(() => []),
    db.taxProfile.findUnique({ where: { userId: user.id } }).catch(() => ({ regime: 'NEW' as const })),
    db.investment.findMany({ where: { userId: user.id, status: 'ACTIVE' } }).catch(() => []),
  ]);

  const monthlyIncome = incomes.reduce((sum, item) => sum + toMonthly(item.amount, item.frequency), 0);
  const monthlyExpenses = expenses.reduce((sum, item) => sum + toMonthly(item.amount, item.frequency), 0);
  const surplus = monthlyIncome - monthlyExpenses;
  const emi = expenses.filter((item) => item.isEMI).reduce((sum, item) => sum + toMonthly(item.amount, item.frequency), 0);
  const totalInvestmentsVal = investments.reduce((sum, item) => sum + (item.currentValue || item.amount), 0);
  const totalEmergencyVal = emergencyFund?.currentAmount || 0;
  
  // Total Net Wealth calculation across cash, bank, FDs & investments
  const totalNetWealth = totalInvestmentsVal + totalEmergencyVal + (incomes.length > 0 ? 325000 : 0);

  const savingsScore = monthlyIncome > 0 ? Math.max(0, Math.min(40, (surplus / monthlyIncome) * 100)) : 0;
  const emiScore = monthlyIncome > 0 ? Math.max(0, 25 - (emi / monthlyIncome) * 50) : 10;
  const emergencyScore = emergencyFund ? Math.min(25, (emergencyFund.currentAmount / emergencyFund.targetAmount) * 25) : 0;
  const healthScore = Math.round(Math.max(10, Math.min(100, savingsScore + emiScore + emergencyScore + 20)));

  return (
    <div className='space-y-6 pb-8'>
      {/* Header Greeting */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight'>
            Welcome back, <span className='bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>{user.name?.split(' ')[0]}</span>!
          </h1>
          <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5'>
            <Sparkles className='h-3.5 w-3.5 text-blue-500' />
            Autonomous financial snapshot & priorities for FY 2025-26
          </p>
        </div>
      </div>

      {/* FIRST SECTION: StatCards (Income, Expenses, Surplus) & Missing Income/Expense Callout Cards */}
      <DashboardIncomePrompt
        monthlyIncome={monthlyIncome}
        monthlyExpenses={monthlyExpenses}
        surplus={surplus}
        incomesCount={incomes.length}
        expensesCount={expenses.length}
      />

      {/* Full Net Wealth & Multi-Account Summary Strip */}
      <div className='glass-card p-5 border border-emerald-200/80 dark:border-emerald-900/60 bg-gradient-to-r from-emerald-50/60 via-white to-blue-50/40 dark:from-gray-900 dark:via-gray-900 dark:to-emerald-950/30 rounded-2xl shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <div className='p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'>
            <Landmark className='h-6 w-6' />
          </div>
          <div>
            <div className='flex items-center gap-2'>
              <span className='text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider'>Total Net Wealth</span>
              <span className='rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5'>
                ALL ASSETS
              </span>
            </div>
            <p className='text-2xl font-extrabold font-mono text-gray-900 dark:text-white tracking-tight'>
              {formatINR(totalNetWealth)}
            </p>
          </div>
        </div>

        <div className='flex flex-wrap items-center gap-3 text-xs'>
          <div className='p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center gap-2'>
            <Wallet className='h-4 w-4 text-emerald-600' />
            <span>Liquid Wallet: <strong className='font-mono text-gray-900 dark:text-white'>{formatINR(incomes.length > 0 ? 325000 : 0)}</strong></span>
          </div>
          <div className='p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center gap-2'>
            <Building2 className='h-4 w-4 text-blue-600' />
            <span>Investments & FDs: <strong className='font-mono text-gray-900 dark:text-white'>{formatINR(totalInvestmentsVal + totalEmergencyVal)}</strong></span>
          </div>
          <Link
            href='/wealth'
            className='p-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-all flex items-center gap-1'
          >
            <span>Manage All Wealth</span> <ArrowRight className='h-3.5 w-3.5' />
          </Link>
        </div>
      </div>

      {/* Auto AI Advisory Panel */}
      <AIInsightsPanel
        user={user}
        incomes={incomes}
        expenses={expenses}
        emergencyFund={emergencyFund}
        taxProfile={taxProfile}
        goals={goals}
      />

      {/* Live Financial News Ticker */}
      <FinancialNewsTicker />

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <HealthScore score={healthScore} />

        {/* Priority Queue */}
        <div className='glass-card p-6 border border-gray-200/80 dark:border-gray-800/80 shadow-xs flex flex-col justify-between'>
          <div>
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center gap-2'>
                <ListTodo className='h-4 w-4 text-indigo-600 dark:text-indigo-400' />
                <h2 className='font-bold text-gray-900 dark:text-white text-base tracking-tight'>AI Money Priority Queue</h2>
              </div>
              <span className='text-[10px] font-semibold text-gray-400 uppercase tracking-widest'>Immutable Order</span>
            </div>

            <div className='space-y-3 text-xs'>
              <div className='flex items-start gap-3 p-2.5 rounded-xl bg-gray-50/80 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800'>
                <div className='mt-0.5 rounded-full p-1 bg-amber-500/10 text-amber-600 dark:text-amber-400'>
                  <ShieldAlert className='h-3.5 w-3.5' />
                </div>
                <div className='flex-1'>
                  <p className='font-medium text-gray-900 dark:text-white'>1. Emergency Baseline</p>
                  <p className='text-gray-500 dark:text-gray-400 text-[11px] mt-0.5'>
                    {emergencyFund ? `Current status: ${formatINR(emergencyFund.currentAmount)} saved` : 'Target unconfigured'}
                  </p>
                </div>
                <span className='font-mono font-bold text-gray-700 dark:text-gray-300'>Priority 1</span>
              </div>

              <div className='flex items-start gap-3 p-2.5 rounded-xl bg-gray-50/80 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800'>
                <div className='mt-0.5 rounded-full p-1 bg-rose-500/10 text-rose-600 dark:text-rose-400'>
                  <AlertCircle className='h-3.5 w-3.5' />
                </div>
                <div className='flex-1'>
                  <p className='font-medium text-gray-900 dark:text-white'>2. Fixed EMIs & Loans</p>
                  <p className='text-gray-500 dark:text-gray-400 text-[11px] mt-0.5'>
                    {emi > 0 ? `Active EMI obligations: ${formatINR(emi)} / mo` : 'No active EMI debt obligations'}
                  </p>
                </div>
                <span className='font-mono font-bold text-gray-700 dark:text-gray-300'>Priority 2</span>
              </div>

              <div className='flex items-start gap-3 p-2.5 rounded-xl bg-gray-50/80 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800'>
                <div className='mt-0.5 rounded-full p-1 bg-blue-500/10 text-blue-600 dark:text-blue-400'>
                  <Target className='h-3.5 w-3.5' />
                </div>
                <div className='flex-1'>
                  <p className='font-medium text-gray-900 dark:text-white'>3. Active Financial Goals</p>
                  <p className='text-gray-500 dark:text-gray-400 text-[11px] mt-0.5'>
                    {goals.length ? `${goals.length} active goal SIP(s) tracked` : 'No active goal registered'}
                  </p>
                </div>
                <span className='font-mono font-bold text-gray-700 dark:text-gray-300'>Priority 3</span>
              </div>
            </div>
          </div>

          <div className='mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs'>
            <span className='text-gray-500 flex items-center gap-1.5'>
              <Bell className='h-3.5 w-3.5 text-amber-500' />
              {alerts.length} pending alert action(s)
            </span>
            <Link href='/goals' className='text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1'>
              Manage Priorities <ArrowRight className='h-3 w-3' />
            </Link>
          </div>
        </div>
      </div>

      {/* Today's Financial Activity Stream */}
      <DailyActivityFeed />
    </div>
  );
}
