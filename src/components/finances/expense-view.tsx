'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingDown, Plus, CreditCard, ArrowDownRight, BadgeAlert, Wallet } from 'lucide-react';
import { formatINR, toMonthly } from '@/lib/calculators';
import { StatCard } from '@/components/shared/stat-card';
import { AddExpenseModal } from '@/components/finances/add-expense-modal';
import { EditDeleteActions } from '@/components/finances/edit-delete-actions';

export function ExpenseView({ initialExpenses }: { initialExpenses: any[] }) {
  const router = useRouter();
  const [expenses, setExpenses] = useState(initialExpenses);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const refreshData = async () => {
    try {
      const res = await fetch('/api/finances');
      if (res.ok) {
        const data = await res.json();
        if (data.expenses) setExpenses(data.expenses);
      }
    } catch {
      router.refresh();
    }
  };

  const totalMonthlyExpenses = expenses.reduce((sum, item) => sum + toMonthly(item.amount, item.frequency), 0);
  const totalEmiLoad = expenses.filter((e) => e.isEMI).reduce((sum, item) => sum + toMonthly(item.amount, item.frequency), 0);
  const emiCount = expenses.filter((e) => e.isEMI).length;

  return (
    <div className='space-y-6 pb-8'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <div className='flex items-center gap-2'>
            <span className='rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[10px] font-bold px-2.5 py-0.5 flex items-center gap-1'>
              <TrendingDown className='h-3 w-3' /> EXPENSES & DEBT OBLIGATIONS
            </span>
          </div>
          <h1 className='text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mt-1'>
            Expenses & EMIs
          </h1>
          <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5'>
            Manage monthly outflows, fixed rents, utilities, and active loan EMI countdowns
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className='inline-flex items-center gap-1.5 rounded-xl bg-rose-600 text-white px-4 py-2.5 text-xs font-bold shadow-md shadow-rose-500/20 hover:bg-rose-500 transition-all self-start sm:self-auto'
        >
          <Plus className='h-4 w-4' />
          <span>Add Expense / EMI</span>
        </button>
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <StatCard
          label='Total Monthly Expenses'
          value={formatINR(totalMonthlyExpenses)}
          tone='red'
          icon={TrendingDown}
          helper={`${expenses.length} active outflow(s)`}
        />
        <StatCard
          label='Total EMI Debt Load'
          value={formatINR(totalEmiLoad)}
          tone='amber'
          icon={CreditCard}
          helper={`${emiCount} active loan EMI(s)`}
        />
        <StatCard
          label='Fixed vs Variable Spends'
          value={`${Math.round((totalEmiLoad / (totalMonthlyExpenses || 1)) * 100)}% EMI`}
          tone='blue'
          icon={Wallet}
          helper='Fixed debt ratio'
        />
      </div>

      <div className='glass-card p-6 border border-gray-200/80 dark:border-gray-800/80 shadow-xs space-y-4 rounded-2xl'>
        <div className='flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800'>
          <div className='flex items-center gap-2'>
            <div className='p-2 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400'>
              <ArrowDownRight className='h-4 w-4' />
            </div>
            <h2 className='font-bold text-gray-900 dark:text-white text-base tracking-tight'>Active Outflows & Loans</h2>
          </div>
          <span className='rounded-full bg-rose-100 px-2.5 py-1 text-[10px] font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300'>
            {expenses.length} Total Outflows
          </span>
        </div>

        <div className='space-y-3'>
          {expenses.length === 0 ? (
            <div className='p-8 text-center border border-dashed border-gray-200 dark:border-gray-800 rounded-xl text-gray-400 text-xs'>
              No expenses recorded yet. Click "+ Add Expense / EMI" to record rent, groceries, or loans.
            </div>
          ) : (
            expenses.map((item) => (
              <div
                key={item.id}
                className='group flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-gray-100 bg-white/60 p-4 gap-3 transition-all hover:border-rose-200 hover:shadow-xs dark:border-gray-800 dark:bg-gray-800/40'
              >
                <div className='space-y-1'>
                  <div className='flex items-center gap-2'>
                    <span className='font-bold text-gray-900 dark:text-white text-sm sm:text-base'>{item.name}</span>
                    {item.isEMI && (
                      <span className='rounded-md bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 flex items-center gap-1 border border-rose-200/50'>
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
                    <span className='font-mono font-bold text-rose-600 dark:text-rose-400 text-base sm:text-lg'>
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

      <AddExpenseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={refreshData} />
    </div>
  );
}
