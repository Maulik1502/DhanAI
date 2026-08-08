'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, Plus, Calendar, ArrowUpRight, Sparkles, Wallet } from 'lucide-react';
import { formatINR, toMonthly } from '@/lib/calculators';
import { StatCard } from '@/components/shared/stat-card';
import { AddIncomeModal } from '@/components/finances/add-income-modal';
import { EditDeleteActions } from '@/components/finances/edit-delete-actions';

export function IncomeView({ initialIncomes }: { initialIncomes: any[] }) {
  const router = useRouter();
  const [incomes, setIncomes] = useState(initialIncomes);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const refreshData = async () => {
    try {
      const res = await fetch('/api/finances');
      if (res.ok) {
        const data = await res.json();
        if (data.incomes) setIncomes(data.incomes);
      }
    } catch {
      router.refresh();
    }
  };

  const totalMonthlyIncome = incomes.reduce((sum, item) => sum + toMonthly(item.amount, item.frequency), 0);
  const annualIncome = totalMonthlyIncome * 12;

  return (
    <div className='space-y-6 pb-8'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <div className='flex items-center gap-2'>
            <span className='rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 flex items-center gap-1'>
              <TrendingUp className='h-3 w-3' /> INCOME & INFLOWS MANAGER
            </span>
          </div>
          <h1 className='text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mt-1'>
            Income Streams
          </h1>
          <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5'>
            Track verified salary, freelance, rental, business, and dividend inflows
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className='inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 text-white px-4 py-2.5 text-xs font-bold shadow-md shadow-emerald-500/20 hover:bg-emerald-500 transition-all self-start sm:self-auto'
        >
          <Plus className='h-4 w-4' />
          <span>Add Income Source</span>
        </button>
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <StatCard
          label='Total Monthly Inflow'
          value={formatINR(totalMonthlyIncome)}
          tone='green'
          icon={TrendingUp}
          helper={`${incomes.length} active stream(s)`}
        />
        <StatCard
          label='Projected Annual Income'
          value={formatINR(annualIncome)}
          tone='blue'
          icon={Wallet}
          helper='FY 2025-26 gross total'
        />
        <StatCard
          label='Active Income Types'
          value={Array.from(new Set(incomes.map((i) => i.type))).length.toString()}
          tone='purple'
          icon={Sparkles}
          helper='Diversified streams'
        />
      </div>

      <div className='glass-card p-6 border border-gray-200/80 dark:border-gray-800/80 shadow-xs space-y-4 rounded-2xl'>
        <div className='flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800'>
          <div className='flex items-center gap-2'>
            <div className='p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'>
              <ArrowUpRight className='h-4 w-4' />
            </div>
            <h2 className='font-bold text-gray-900 dark:text-white text-base tracking-tight'>Verified Inflow List</h2>
          </div>
          <span className='rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'>
            {incomes.length} Active Streams
          </span>
        </div>

        <div className='space-y-3'>
          {incomes.length === 0 ? (
            <div className='p-8 text-center border border-dashed border-gray-200 dark:border-gray-800 rounded-xl text-gray-400 text-xs'>
              No income streams recorded yet. Click "+ Add Income Source" to record salary or freelance.
            </div>
          ) : (
            incomes.map((item) => (
              <div
                key={item.id}
                className='group flex items-center justify-between rounded-xl border border-gray-100 bg-white/60 p-4 transition-all hover:border-emerald-200 hover:shadow-xs dark:border-gray-800 dark:bg-gray-800/40'
              >
                <div className='space-y-1'>
                  <div className='flex items-center gap-2'>
                    <span className='font-bold text-gray-900 dark:text-white text-sm sm:text-base'>{item.name}</span>
                    <span className='rounded-md bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 uppercase'>
                      {item.type}
                    </span>
                  </div>
                  <p className='text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1'>
                    <Calendar className='h-3 w-3' /> Frequency: {item.frequency.toLowerCase()}
                  </p>
                </div>

                <div className='flex items-center gap-3'>
                  <div className='text-right'>
                    <span className='font-mono font-bold text-emerald-600 dark:text-emerald-400 text-base sm:text-lg'>
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

      <AddIncomeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={refreshData} />
    </div>
  );
}
