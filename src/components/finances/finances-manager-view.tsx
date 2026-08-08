'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Plus,
  CreditCard,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  BadgeAlert,
} from 'lucide-react';
import { formatINR, toMonthly } from '@/lib/calculators';
import { StatCard } from '@/components/shared/stat-card';
import { AddIncomeModal } from '@/components/finances/add-income-modal';
import { AddExpenseModal } from '@/components/finances/add-expense-modal';
import { EditDeleteActions } from '@/components/finances/edit-delete-actions';
import { FullWealthManager } from '@/components/wealth/full-wealth-manager';

type FinancesManagerViewProps = {
  initialIncomes: any[];
  initialExpenses: any[];
};

export function FinancesManagerView({ initialIncomes, initialExpenses }: FinancesManagerViewProps) {
  const router = useRouter();
  const [incomes, setIncomes] = useState(initialIncomes);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  const refreshData = async () => {
    try {
      const res = await fetch('/api/finances');
      if (res.ok) {
        const data = await res.json();
        if (data.incomes) setIncomes(data.incomes);
        if (data.expenses) setExpenses(data.expenses);
      }
    } catch {
      router.refresh();
    }
  };

  const monthlyIncome = incomes.reduce((sum, item) => sum + toMonthly(item.amount, item.frequency), 0);
  const monthlyExpenses = expenses.reduce((sum, item) => sum + toMonthly(item.amount, item.frequency), 0);
  const surplus = monthlyIncome - monthlyExpenses;

  return (
    <div className='space-y-6 pb-8'>
      {/* Header with Add Actions */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight'>
            Finances Manager
          </h1>
          <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5'>
            <Sparkles className='h-3.5 w-3.5 text-blue-500' />
            Track income streams, monthly expenses, and EMI debt payoff timelines
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <button
            onClick={() => setIsIncomeModalOpen(true)}
            className='inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 text-white px-3.5 py-2 text-xs font-bold shadow-md shadow-emerald-500/20 hover:bg-emerald-500 transition-all'
          >
            <Plus className='h-3.5 w-3.5' />
            <span>Add Income</span>
          </button>
          <button
            onClick={() => setIsExpenseModalOpen(true)}
            className='inline-flex items-center gap-1.5 rounded-xl bg-rose-600 text-white px-3.5 py-2 text-xs font-bold shadow-md shadow-rose-500/20 hover:bg-rose-500 transition-all'
          >
            <Plus className='h-3.5 w-3.5' />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <StatCard
          label='Total Monthly Income'
          value={formatINR(monthlyIncome)}
          tone='green'
          icon={TrendingUp}
          helper={`${incomes.length} active stream(s)`}
        />
        <StatCard
          label='Total Monthly Expenses'
          value={formatINR(monthlyExpenses)}
          tone='red'
          icon={TrendingDown}
          helper={`${expenses.length} active outflow(s)`}
        />
        <StatCard
          label='Monthly Surplus'
          value={formatINR(surplus)}
          tone={surplus >= 0 ? 'blue' : 'amber'}
          icon={Wallet}
          helper='Available for goals & corpus'
        />
      </div>

      {/* Full Net Wealth & Multi-Account Manager */}
      <FullWealthManager />

      {/* Main Grid */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        {/* Income Streams */}
        <section className='glass-card p-6 border border-gray-200/80 dark:border-gray-800/80 shadow-xs flex flex-col justify-between space-y-4'>
          <div>
            <div className='flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800'>
              <div className='flex items-center gap-2'>
                <div className='p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'>
                  <ArrowUpRight className='h-4 w-4' />
                </div>
                <h2 className='font-bold text-gray-900 dark:text-white text-base tracking-tight'>Income Streams</h2>
              </div>
              <button
                onClick={() => setIsIncomeModalOpen(true)}
                className='rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:hover:bg-emerald-900 transition-all'
              >
                + Add Stream
              </button>
            </div>

            <div className='mt-4 space-y-3'>
              {incomes.length === 0 ? (
                <div className='p-8 text-center border border-dashed border-gray-200 dark:border-gray-800 rounded-xl text-gray-400 text-xs'>
                  No income sources added yet. Click "+ Add Income" to record salary or freelance.
                </div>
              ) : (
                incomes.map((item) => (
                  <div
                    key={item.id}
                    className='group flex items-center justify-between rounded-xl border border-gray-100 bg-white/60 p-4 transition-all hover:border-emerald-200 hover:shadow-xs dark:border-gray-800 dark:bg-gray-800/40 dark:hover:border-emerald-900/50'
                  >
                    <div className='space-y-1'>
                      <div className='flex items-center gap-2'>
                        <span className='font-semibold text-gray-900 dark:text-white text-sm'>{item.name}</span>
                        <span className='rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400 uppercase'>
                          {item.type}
                        </span>
                      </div>
                      <p className='text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1'>
                        <Calendar className='h-3 w-3' />
                        Frequency: {item.frequency.toLowerCase()}
                      </p>
                    </div>
                    <div className='flex items-center gap-3'>
                      <div className='text-right'>
                        <span className='font-mono font-bold text-emerald-600 dark:text-emerald-400 text-base'>
                          +{formatINR(item.amount)}
                        </span>
                        <p className='text-[10px] text-gray-400'>Verified Inflow</p>
                      </div>
                      <EditDeleteActions id={item.id} kind='income' item={item} onSuccess={refreshData} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className='pt-2 flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 dark:border-gray-800'>
            <span>
              Net monthly income:{' '}
              <strong className='font-mono text-gray-900 dark:text-white'>{formatINR(monthlyIncome)}</strong>
            </span>
            <span className='text-emerald-600 dark:text-emerald-400 font-medium'>100% Tax Tracked</span>
          </div>
        </section>

        {/* Expenses & EMIs */}
        <section className='glass-card p-6 border border-gray-200/80 dark:border-gray-800/80 shadow-xs flex flex-col justify-between space-y-4'>
          <div>
            <div className='flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800'>
              <div className='flex items-center gap-2'>
                <div className='p-2 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400'>
                  <ArrowDownRight className='h-4 w-4' />
                </div>
                <h2 className='font-bold text-gray-900 dark:text-white text-base tracking-tight'>Expenses & EMIs</h2>
              </div>
              <button
                onClick={() => setIsExpenseModalOpen(true)}
                className='rounded-full bg-rose-100 px-2.5 py-1 text-[10px] font-bold text-rose-700 hover:bg-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:hover:bg-rose-900 transition-all'
              >
                + Add Outflow
              </button>
            </div>

            <div className='mt-4 space-y-3'>
              {expenses.length === 0 ? (
                <div className='p-8 text-center border border-dashed border-gray-200 dark:border-gray-800 rounded-xl text-gray-400 text-xs'>
                  No expenses recorded. Click "+ Add Expense" to record rent, EMIs, or groceries.
                </div>
              ) : (
                expenses.map((item) => (
                  <div
                    key={item.id}
                    className='group flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-gray-100 bg-white/60 p-4 gap-3 transition-all hover:border-rose-200 hover:shadow-xs dark:border-gray-800 dark:bg-gray-800/40 dark:hover:border-rose-900/50'
                  >
                    <div className='space-y-1'>
                      <div className='flex items-center gap-2'>
                        <span className='font-semibold text-gray-900 dark:text-white text-sm'>{item.name}</span>
                        {item.isEMI && (
                          <span className='rounded-md bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 flex items-center gap-1'>
                            <CreditCard className='h-3 w-3' /> EMI
                          </span>
                        )}
                      </div>
                      <p className='text-xs text-gray-500 dark:text-gray-400'>
                        Category: <span className='font-medium text-gray-700 dark:text-gray-300'>{item.category}</span>
                      </p>
                    </div>

                    <div className='flex items-center gap-3 sm:self-center'>
                      <div className='sm:text-right flex sm:flex-col justify-between items-end'>
                        <span className='font-mono font-bold text-rose-600 dark:text-rose-400 text-base'>
                          -{formatINR(item.amount)}
                        </span>
                        {item.isEMI && item.emiMonthsLeft !== null && (
                          <div className='mt-1 flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-200/50 dark:border-amber-900/50'>
                            <BadgeAlert className='h-3 w-3' />
                            <span>{item.emiMonthsLeft}m left</span>
                          </div>
                        )}
                      </div>
                      <EditDeleteActions id={item.id} kind='expense' item={item} onSuccess={refreshData} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className='pt-2 flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 dark:border-gray-800'>
            <span>
              Total EMI Debt Load:{' '}
              <strong className='font-mono text-rose-600 dark:text-rose-400'>
                {formatINR(expenses.filter((e) => e.isEMI).reduce((a, b) => a + b.amount, 0))}
              </strong>
            </span>
            <span className='text-gray-400'>Auto-updates surplus</span>
          </div>
        </section>
      </div>

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
