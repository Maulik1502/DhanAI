import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { compareTaxRegimes, formatINR } from '@/lib/calculators';
import { StatCard } from '@/components/shared/stat-card';
import { redirect } from 'next/navigation';
import {
  Receipt,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingDown,
  ShieldCheck,
  Percent,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export default async function TaxPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const profile = await db.taxProfile
    .upsert({
      where: { userId: user.id },
      create: { userId: user.id, financialYear: '2025-26', grossIncome: 1500000, deductions80C: 85000, deductions80D: 20000 },
      update: {},
    })
    .catch(() => ({
      id: 'tax-1',
      userId: user.id,
      regime: 'NEW' as const,
      grossIncome: 1500000,
      taxableIncome: 1425000,
      taxLiability: 135000,
      deductions80C: 85000,
      deductions80D: 20000,
      npsAdditional: 15000,
      hraDeduction: 0,
      homeLoanInterest: 0,
      otherDeductions: 0,
      taxSaved: 22800,
      remainingLimit80C: 65000,
      financialYear: '2025-26',
    }));

  const comparison = compareTaxRegimes(profile.grossIncome, {
    section80C: profile.deductions80C,
    section80D: profile.deductions80D,
    npsAdditional: profile.npsAdditional,
    hra: profile.hraDeduction,
    homeLoanInterest: profile.homeLoanInterest,
  });

  const limit80C = 150000;
  const pct80C = Math.min(100, Math.round((profile.deductions80C / limit80C) * 100));

  return (
    <div className='space-y-6 pb-8'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight'>Tax Optimization Engine</h1>
          <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5'>
            <Sparkles className='h-3.5 w-3.5 text-blue-500' />
            FY 2025-26 Slabs: Old vs New Regime Live Comparison & 80C Limits
          </p>
        </div>
        <Link
          href='/chat?prompt=Analyze%20my%20tax%20deductions%20and%20suggest%20the%20best%20tax%20saving%20strategy'
          className='inline-flex items-center gap-2 rounded-xl bg-dhan-gradient px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-500/20 hover:opacity-95 transition-all self-start sm:self-auto'
        >
          <Sparkles className='h-3.5 w-3.5' />
          <span>Generate AI Tax Plan</span>
        </Link>
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <StatCard label='Annual Gross Income' value={formatINR(profile.grossIncome)} tone='blue' icon={Receipt} helper='Base for tax slabs' />
        <StatCard label='Optimal Tax Regime' value={`${comparison.recommended} Regime`} tone='green' icon={ShieldCheck} helper='Computed lowest liability' />
        <StatCard label='Regime Tax Savings' value={formatINR(comparison.savings)} tone='purple' icon={TrendingDown} helper='Annual savings over alternate' />
      </div>

      {/* Side-by-Side Regime Comparison */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <div
          className={`glass-card p-6 border relative overflow-hidden transition-all ${
            comparison.recommended === 'NEW'
              ? 'border-emerald-500/50 shadow-md bg-emerald-50/20 dark:bg-emerald-950/20 ring-1 ring-emerald-500/30'
              : 'border-gray-200/80 dark:border-gray-800/80'
          }`}
        >
          {comparison.recommended === 'NEW' && (
            <div className='absolute top-3 right-3 rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-bold text-white shadow-sm flex items-center gap-1'>
              <CheckCircle2 className='h-3 w-3' /> RECOMMENDED REGIME
            </div>
          )}
          <div className='space-y-3'>
            <span className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>Default FY 2025-26</span>
            <h2 className='text-xl font-bold text-gray-900 dark:text-white'>New Tax Regime</h2>
            <div className='py-2'>
              <span className='text-xs text-gray-400'>Estimated Tax Liability</span>
              <p className='text-3xl font-extrabold font-mono text-gray-900 dark:text-white tracking-tight'>{formatINR(comparison.newTax)}</p>
            </div>
            <ul className='space-y-1.5 text-xs text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800'>
              <li className='flex items-center gap-2'>
                <CheckCircle2 className='h-3.5 w-3.5 text-emerald-500' />
                <span>₹75,000 Standard Deduction included</span>
              </li>
              <li className='flex items-center gap-2'>
                <CheckCircle2 className='h-3.5 w-3.5 text-emerald-500' />
                <span>87A Full Rebate up to ₹7.0 Lakhs taxable income</span>
              </li>
              <li className='flex items-center gap-2'>
                <CheckCircle2 className='h-3.5 w-3.5 text-emerald-500' />
                <span>Simplified tax slabs (0%, 5%, 10%, 15%, 20%, 30%)</span>
              </li>
            </ul>
          </div>
        </div>

        <div
          className={`glass-card p-6 border relative overflow-hidden transition-all ${
            comparison.recommended === 'OLD'
              ? 'border-emerald-500/50 shadow-md bg-emerald-50/20 dark:bg-emerald-950/20 ring-1 ring-emerald-500/30'
              : 'border-gray-200/80 dark:border-gray-800/80'
          }`}
        >
          {comparison.recommended === 'OLD' && (
            <div className='absolute top-3 right-3 rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-bold text-white shadow-sm flex items-center gap-1'>
              <CheckCircle2 className='h-3 w-3' /> RECOMMENDED REGIME
            </div>
          )}
          <div className='space-y-3'>
            <span className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>Deduction Based</span>
            <h2 className='text-xl font-bold text-gray-900 dark:text-white'>Old Tax Regime</h2>
            <div className='py-2'>
              <span className='text-xs text-gray-400'>Estimated Tax Liability</span>
              <p className='text-3xl font-extrabold font-mono text-gray-900 dark:text-white tracking-tight'>{formatINR(comparison.oldTax)}</p>
            </div>
            <ul className='space-y-1.5 text-xs text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800'>
              <li className='flex items-center gap-2'>
                <CheckCircle2 className='h-3.5 w-3.5 text-blue-500' />
                <span>80C Deductions up to ₹1.50 Lakhs (ELSS, PPF, EPF)</span>
              </li>
              <li className='flex items-center gap-2'>
                <CheckCircle2 className='h-3.5 w-3.5 text-blue-500' />
                <span>80D Health Insurance + 80CCD(1B) NPS ₹50K</span>
              </li>
              <li className='flex items-center gap-2'>
                <CheckCircle2 className='h-3.5 w-3.5 text-blue-500' />
                <span>HRA + Home Loan Interest deductions</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Section 80C Deduction Progress Tracker */}
      <div className='glass-card p-6 border border-gray-200/80 dark:border-gray-800/80 space-y-4'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
          <div>
            <h3 className='text-base font-bold text-gray-900 dark:text-white flex items-center gap-2'>
              <Receipt className='h-4 w-4 text-blue-600' />
              Section 80C Tax Saving Tracker
            </h3>
            <p className='text-xs text-gray-500 mt-0.5'>Max limit ₹1,50,000 per financial year (EPF, ELSS, PPF, Life Insurance, Home Loan Principal)</p>
          </div>
          <div className='text-right'>
            <span className='font-mono font-bold text-sm text-gray-900 dark:text-white'>
              {formatINR(profile.deductions80C)} <span className='text-gray-400 text-xs'>/ {formatINR(limit80C)}</span>
            </span>
          </div>
        </div>

        <div className='space-y-2'>
          <div className='flex items-center justify-between text-xs font-semibold'>
            <span className='text-blue-600 dark:text-blue-400'>{pct80C}% Completed</span>
            <span className='text-gray-500'>Remaining Limit: {formatINR(limit80C - profile.deductions80C)}</span>
          </div>
          <div className='h-3 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden p-0.5 border border-gray-200/60 dark:border-gray-700/60'>
            <div
              className='h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500'
              style={{ width: `${pct80C}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}


