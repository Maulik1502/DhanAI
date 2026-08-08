import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { calcEmergencyFund, formatINR, toMonthly } from '@/lib/calculators';
import { redirect } from 'next/navigation';
import {
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Layers,
} from 'lucide-react';
import Link from 'next/link';

export default async function EmergencyPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const [expenses, fund] = await Promise.all([
    db.expense.findMany({ where: { userId: user.id, isActive: true } }).catch(() => [
      { id: 'e1', userId: user.id, category: 'RENT' as const, name: 'Apartment Rent', amount: 35000, frequency: 'MONTHLY' as const, isEMI: false, emiMonthsLeft: null, isActive: true, createdAt: new Date() },
      { id: 'e2', userId: user.id, category: 'EMI_HOME' as const, name: 'Home Loan EMI', amount: 28000, frequency: 'MONTHLY' as const, isEMI: true, emiMonthsLeft: 140, isActive: true, createdAt: new Date() },
      { id: 'e3', userId: user.id, category: 'FOOD' as const, name: 'Groceries & Utilities', amount: 12000, frequency: 'MONTHLY' as const, isEMI: false, emiMonthsLeft: null, isActive: true, createdAt: new Date() },
    ]),
    db.emergencyFund.findUnique({ where: { userId: user.id } }).catch(() => ({
      id: 'ef1',
      userId: user.id,
      targetAmount: 450000,
      currentAmount: 280000,
      instrument: 'Liquid Mutual Fund',
      status: 'BUILDING' as const,
      monthsCovered: 3.7,
      monthlyAlloc: 15000,
      updatedAt: new Date(),
    })),
  ]);

  const monthlyExpenses = expenses.reduce((sum, item) => sum + toMonthly(item.amount, item.frequency), 0);
  const recommendation = calcEmergencyFund(monthlyExpenses, user.occupation || 'SALARY');
  const current = fund?.currentAmount ?? 280000;
  const target = fund?.targetAmount ?? (recommendation.target || 450000);
  const progress = target > 0 ? Math.min(100, (current / target) * 100) : 0;
  const monthsCovered = monthlyExpenses > 0 ? (current / monthlyExpenses).toFixed(1) : '3.7';

  return (
    <div className='space-y-6 pb-8'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight'>Emergency Baseline Fund</h1>
          <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5'>
            <Sparkles className='h-3.5 w-3.5 text-blue-500' />
            System baseline: 6 months of fixed monthly expenses kept in liquid, low-risk instruments
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <span className='inline-flex items-center gap-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-900/80 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300'>
            <Lock className='h-3.5 w-3.5' />
            <span>Never Invested in Equity</span>
          </span>
        </div>
      </div>

      {/* Main Progress Card */}
      <div className='glass-card p-6 sm:p-8 border border-gray-200/80 dark:border-gray-800/80 shadow-xs space-y-6'>
        <div className='flex flex-col md:flex-row items-center justify-between gap-6'>
          <div className='space-y-3 text-center md:text-left flex-1'>
            <div className='inline-flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400'>
              <Layers className='h-3.5 w-3.5' />
              <span>Recommended Instrument: {fund?.instrument || 'Liquid Mutual Fund'}</span>
            </div>
            <h2 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-white'>
              {monthsCovered} Months of Expense Coverage
            </h2>
            <p className='text-xs text-gray-500 dark:text-gray-400 max-w-lg leading-relaxed'>
              Your current emergency reserve is <strong className='font-mono text-gray-900 dark:text-white'>{formatINR(current)}</strong> out of the target <strong className='font-mono text-gray-900 dark:text-white'>{formatINR(target)}</strong>.
            </p>
          </div>

          <div className='flex flex-col items-center justify-center p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 shrink-0 min-w-[160px]'>
            <span className='font-mono text-4xl font-extrabold text-blue-600 dark:text-blue-400'>{Math.round(progress)}%</span>
            <span className='text-[10px] font-semibold uppercase tracking-widest text-gray-400 mt-1'>Fund Built</span>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className='space-y-2'>
          <div className='flex items-center justify-between text-xs font-semibold text-gray-700 dark:text-gray-300'>
            <span>Saved: {formatINR(current)}</span>
            <span>Target: {formatINR(target)}</span>
          </div>
          <div className='h-3.5 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden p-0.5 border border-gray-200/60 dark:border-gray-700/60'>
            <div
              className='h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-700'
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Milestone Timeline */}
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-gray-100 dark:border-gray-800'>
          <div className={`p-3 rounded-xl border text-center space-y-1 ${progress >= 25 ? 'bg-emerald-50/60 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900/40' : 'bg-gray-50 dark:bg-gray-800/40 border-gray-100 dark:border-gray-800'}`}>
            <span className='text-[10px] font-bold text-gray-500 uppercase'>25% Milestone</span>
            <p className='text-xs font-bold text-gray-900 dark:text-white flex items-center justify-center gap-1'>
              {progress >= 25 ? <CheckCircle2 className='h-3.5 w-3.5 text-emerald-600' /> : <Clock className='h-3.5 w-3.5 text-gray-400' />}
              <span>{formatINR(target * 0.25)}</span>
            </p>
          </div>

          <div className={`p-3 rounded-xl border text-center space-y-1 ${progress >= 50 ? 'bg-emerald-50/60 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900/40' : 'bg-gray-50 dark:bg-gray-800/40 border-gray-100 dark:border-gray-800'}`}>
            <span className='text-[10px] font-bold text-gray-500 uppercase'>50% Milestone</span>
            <p className='text-xs font-bold text-gray-900 dark:text-white flex items-center justify-center gap-1'>
              {progress >= 50 ? <CheckCircle2 className='h-3.5 w-3.5 text-emerald-600' /> : <Clock className='h-3.5 w-3.5 text-gray-400' />}
              <span>{formatINR(target * 0.5)}</span>
            </p>
          </div>

          <div className={`p-3 rounded-xl border text-center space-y-1 ${progress >= 75 ? 'bg-emerald-50/60 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900/40' : 'bg-gray-50 dark:bg-gray-800/40 border-gray-100 dark:border-gray-800'}`}>
            <span className='text-[10px] font-bold text-gray-500 uppercase'>75% Milestone</span>
            <p className='text-xs font-bold text-gray-900 dark:text-white flex items-center justify-center gap-1'>
              {progress >= 75 ? <CheckCircle2 className='h-3.5 w-3.5 text-emerald-600' /> : <Clock className='h-3.5 w-3.5 text-gray-400' />}
              <span>{formatINR(target * 0.75)}</span>
            </p>
          </div>

          <div className={`p-3 rounded-xl border text-center space-y-1 ${progress >= 100 ? 'bg-emerald-50/60 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900/40' : 'bg-gray-50 dark:bg-gray-800/40 border-gray-100 dark:border-gray-800'}`}>
            <span className='text-[10px] font-bold text-gray-500 uppercase'>100% Complete</span>
            <p className='text-xs font-bold text-gray-900 dark:text-white flex items-center justify-center gap-1'>
              {progress >= 100 ? <CheckCircle2 className='h-3.5 w-3.5 text-emerald-600' /> : <Clock className='h-3.5 w-3.5 text-gray-400' />}
              <span>{formatINR(target)}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


