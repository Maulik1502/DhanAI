'use client';

import { useState } from 'react';
import {
  Calendar,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Clock,
  Plus,
  Receipt,
  CheckCircle2,
  AlertCircle,
  Bell,
  Sparkles,
} from 'lucide-react';
import { formatINR } from '@/lib/calculators';

type ActivityItem = {
  id: string;
  type: 'INCOME' | 'EXPENSE' | 'BILL' | 'EMI' | 'INTEREST';
  title: string;
  amount: number;
  date: string;
  account: string;
  status: 'COMPLETED' | 'PENDING' | 'DUE_SOON';
  category?: string;
};

const initialActivities: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'INCOME',
    title: 'Monthly Salary Credit (Tech Corp)',
    amount: 125000,
    date: 'Today, 09:30 AM',
    account: 'HDFC Salary A/c',
    status: 'COMPLETED',
  },
  {
    id: 'act-2',
    type: 'EXPENSE',
    title: 'Extra Outing / Dining & Groceries',
    amount: 3450,
    date: 'Today, 02:15 PM',
    account: 'ICICI Amazon Card',
    status: 'COMPLETED',
    category: 'Food & Dining',
  },
  {
    id: 'act-3',
    type: 'BILL',
    title: 'HDFC Regalia Credit Card Statement Generated',
    amount: 18500,
    date: 'Statement Date: Today',
    account: 'HDFC Credit Card',
    status: 'DUE_SOON',
  },
  {
    id: 'act-4',
    type: 'INTEREST',
    title: 'Quarterly FD Interest Credit',
    amount: 4200,
    date: 'Yesterday, 06:00 PM',
    account: 'SBI FD A/c',
    status: 'COMPLETED',
  },
  {
    id: 'act-5',
    type: 'EMI',
    title: 'HDFC Home Loan Auto-Debit Scheduled',
    amount: 28000,
    date: 'Due in 3 days (1st of month)',
    account: 'HDFC Bank',
    status: 'PENDING',
  },
];

export function DailyActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newType, setNewType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');

  const handleAddExtra = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newAmount);
    if (!newTitle.trim() || isNaN(val) || val <= 0) return;

    const item: ActivityItem = {
      id: Date.now().toString(),
      type: newType,
      title: newTitle.trim(),
      amount: val,
      date: 'Just now',
      account: 'Cash / Card',
      status: 'COMPLETED',
    };

    setActivities([item, ...activities]);
    setNewTitle('');
    setNewAmount('');
    setShowAddForm(false);
  };

  return (
    <div className='glass-card p-6 border border-gray-200/80 dark:border-gray-800/80 shadow-xs space-y-4 rounded-2xl'>
      <div className='flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800'>
        <div className='flex items-center gap-2.5'>
          <div className='p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400'>
            <Clock className='h-5 w-5' />
          </div>
          <div>
            <h2 className='font-bold text-gray-900 dark:text-white text-base tracking-tight'>
              Daily Financial Activity Stream
            </h2>
            <p className='text-xs text-gray-500 dark:text-gray-400'>
              Track today's extra variable expenses, salary credits, interest & credit card bill dates
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className='inline-flex items-center gap-1.5 rounded-xl bg-blue-600 text-white px-3 py-1.5 text-xs font-bold shadow-xs hover:bg-blue-500 transition-all'
        >
          <Plus className='h-3.5 w-3.5' />
          <span>Record Extra Spend / Income</span>
        </button>
      </div>

      {/* Quick Add Extra Spend Inline Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddExtra}
          className='p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 space-y-3 animate-in fade-in duration-150'
        >
          <div className='flex items-center gap-3'>
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value as any)}
              className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs font-bold text-gray-900 dark:text-white'
            >
              <option value='EXPENSE'>Extra Expense</option>
              <option value='INCOME'>Extra Inflow</option>
            </select>
            <input
              type='text'
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder='e.g., Dining out, Petrol, Cash withdrawal'
              className='flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3.5 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-400'
              required
            />
            <div className='relative w-36'>
              <span className='absolute left-3 top-2 text-xs font-bold text-gray-400'>₹</span>
              <input
                type='number'
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                placeholder='1500'
                className='w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 pl-7 pr-3 py-2 text-xs font-mono font-bold text-gray-900 dark:text-white'
                required
              />
            </div>
            <button
              type='submit'
              className='rounded-xl bg-blue-600 text-white px-4 py-2 text-xs font-bold hover:bg-blue-500 shrink-0'
            >
              Save
            </button>
          </div>
        </form>
      )}

      {/* Activity Items List */}
      <div className='space-y-3'>
        {activities.map((item) => (
          <div
            key={item.id}
            className='flex items-center justify-between p-3.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-white/60 dark:bg-gray-800/40 hover:border-gray-200 transition-all'
          >
            <div className='flex items-center gap-3'>
              <div
                className={`p-2.5 rounded-xl text-xs ${
                  item.type === 'INCOME' || item.type === 'INTEREST'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : item.type === 'BILL'
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                }`}
              >
                {item.type === 'INCOME' || item.type === 'INTEREST' ? (
                  <TrendingUp className='h-4 w-4' />
                ) : item.type === 'BILL' ? (
                  <CreditCard className='h-4 w-4' />
                ) : (
                  <TrendingDown className='h-4 w-4' />
                )}
              </div>

              <div>
                <div className='flex items-center gap-2'>
                  <h3 className='font-bold text-gray-900 dark:text-white text-xs sm:text-sm'>{item.title}</h3>
                  <span className='rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300'>
                    {item.account}
                  </span>
                </div>
                <p className='text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-0.5'>
                  <Calendar className='h-3 w-3' /> {item.date}
                </p>
              </div>
            </div>

            <div className='text-right'>
              <span
                className={`font-mono font-extrabold text-sm ${
                  item.type === 'INCOME' || item.type === 'INTEREST'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {item.type === 'INCOME' || item.type === 'INTEREST' ? '+' : '-'}
                {formatINR(item.amount)}
              </span>
              <p className='text-[10px] font-bold text-gray-400 capitalize'>{item.status.replace('_', ' ')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
