'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, TrendingDown, Wallet, Plus, AlertTriangle, ArrowRight } from 'lucide-react';
import { formatINR } from '@/lib/calculators';
import { StatCard } from '@/components/shared/stat-card';
import { AddIncomeModal } from '@/components/finances/add-income-modal';
import { AddExpenseModal } from '@/components/finances/add-expense-modal';

type DashboardIncomePromptProps = {
  monthlyIncome: number;
  monthlyExpenses: number;
  surplus: number;
  incomesCount: number;
  expensesCount: number;
};

export function DashboardIncomePrompt({
  monthlyIncome,
  monthlyExpenses,
  surplus,
  incomesCount,
  expensesCount,
}: DashboardIncomePromptProps) {
  const router = useRouter();
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  const refreshData = () => {
    router.refresh();
  };

  return (
    <div className='space-y-4'>
      {/* 1. Primary StatCards (Income, Expenses, Surplus) */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <StatCard
          label='Monthly Income'
          value={formatINR(monthlyIncome)}
          tone='green'
          icon={TrendingUp}
          helper={incomesCount > 0 ? `${incomesCount} active source(s)` : 'No income added yet'}
        />
        <StatCard
          label='Monthly Expenses'
          value={formatINR(monthlyExpenses)}
          tone='red'
          icon={TrendingDown}
          helper={expensesCount > 0 ? `${expensesCount} active outflow(s)` : 'No expenses added yet'}
        />
        <StatCard
          label='Monthly Surplus'
          value={formatINR(surplus)}
          tone={surplus >= 0 ? 'blue' : 'amber'}
          icon={Wallet}
          helper='Available for priority allocation'
        />
      </div>

      {/* 2. Prominent Missing Income Callout Card if incomesCount === 0 */}
      {incomesCount === 0 && (
        <div className='p-5 rounded-2xl border border-amber-200/80 dark:border-amber-900/60 bg-gradient-to-r from-amber-50/80 via-white to-amber-50/40 dark:from-amber-950/30 dark:via-gray-900 dark:to-gray-900 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-200'>
          <div className='flex items-center gap-3'>
            <div className='p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0'>
              <AlertTriangle className='h-6 w-6' />
            </div>
            <div>
              <div className='flex items-center gap-2'>
                <h3 className='font-extrabold text-gray-900 dark:text-white text-base tracking-tight'>
                  No Income Source Registered Yet
                </h3>
                <span className='rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-bold px-2.5 py-0.5'>
                  ACTION REQUIRED
                </span>
              </div>
              <p className='text-xs text-gray-600 dark:text-gray-300 mt-0.5'>
                Add your primary salary, freelance, or business income to enable cashflow surplus, emergency fund & tax calculations.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsIncomeModalOpen(true)}
            className='inline-flex items-center gap-2 rounded-xl bg-emerald-600 text-white px-5 py-2.5 text-xs font-extrabold shadow-md shadow-emerald-500/20 hover:bg-emerald-500 transition-all shrink-0 self-start sm:self-auto'
          >
            <Plus className='h-4 w-4' />
            <span>Add Income Source Now</span>
          </button>
        </div>
      )}

      {/* 3. Prominent Missing Expense Callout Card if expensesCount === 0 */}
      {expensesCount === 0 && (
        <div className='p-5 rounded-2xl border border-rose-200/80 dark:border-rose-900/60 bg-gradient-to-r from-rose-50/80 via-white to-rose-50/40 dark:from-rose-950/30 dark:via-gray-900 dark:to-gray-900 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-200'>
          <div className='flex items-center gap-3'>
            <div className='p-3 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 shrink-0'>
              <TrendingDown className='h-6 w-6' />
            </div>
            <div>
              <div className='flex items-center gap-2'>
                <h3 className='font-extrabold text-gray-900 dark:text-white text-base tracking-tight'>
                  No Expenses or Loan EMIs Logged
                </h3>
                <span className='rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[10px] font-bold px-2.5 py-0.5'>
                  ACTION RECOMMENDED
                </span>
              </div>
              <p className='text-xs text-gray-600 dark:text-gray-300 mt-0.5'>
                Record house rent, groceries, or active loan EMIs to calculate your debt ratio and net monthly savings.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsExpenseModalOpen(true)}
            className='inline-flex items-center gap-2 rounded-xl bg-rose-600 text-white px-5 py-2.5 text-xs font-extrabold shadow-md shadow-rose-500/20 hover:bg-rose-500 transition-all shrink-0 self-start sm:self-auto'
          >
            <Plus className='h-4 w-4' />
            <span>Add Expense / EMI Now</span>
          </button>
        </div>
      )}

      {/* Modals */}
      <AddIncomeModal
        isOpen={isIncomeModalOpen}
        onClose={() => setIsIncomeModalOpen(false)}
        onSuccess={refreshData}
      />
      <AddExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSuccess={refreshData}
      />
    </div>
  );
}
