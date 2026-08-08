'use client';

import { useState } from 'react';
import { X, Plus, TrendingUp, Loader2 } from 'lucide-react';

type AddIncomeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

const INCOME_TYPES = [
  { value: 'SALARY', label: 'Primary Salary' },
  { value: 'FREELANCE', label: 'Freelance & Consulting' },
  { value: 'BUSINESS', label: 'Business Profits' },
  { value: 'RENTAL', label: 'Rental Income' },
  { value: 'CAPITAL_GAINS', label: 'Capital Gains & Dividends' },
  { value: 'DIVIDEND', label: 'Stock Dividends' },
  { value: 'OTHER', label: 'Other Inflow' },
];

const FREQUENCIES = [
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'QUARTERLY', label: 'Quarterly' },
  { value: 'YEARLY', label: 'Yearly' },
  { value: 'ONE_TIME', label: 'One-time Bonus' },
];

export function AddIncomeModal({ isOpen, onClose, onSuccess }: AddIncomeModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState('SALARY');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState('MONTHLY');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const numAmount = parseFloat(amount);
    if (!name.trim()) {
      setError('Please enter an income source name.');
      return;
    }
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid positive amount.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/finances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'income',
          name: name.trim(),
          type,
          amount: numAmount,
          frequency,
          note: note.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to add income stream');
      }

      // Reset form
      setName('');
      setAmount('');
      setNote('');
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/50 backdrop-blur-sm animate-in fade-in duration-200'>
      <div className='relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-6 overflow-hidden'>
        {/* Header */}
        <div className='flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800'>
          <div className='flex items-center gap-2.5'>
            <div className='p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'>
              <TrendingUp className='h-5 w-5' />
            </div>
            <div>
              <h2 className='font-bold text-gray-900 dark:text-white text-lg tracking-tight'>Add Income Source</h2>
              <p className='text-xs text-gray-500 dark:text-gray-400'>Record a new monthly or periodic inflow</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className='p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all'
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        {error && (
          <div className='mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-medium'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='mt-4 space-y-4'>
          <div>
            <label className='block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1'>
              Income Title / Employer Name *
            </label>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='e.g., Tech Corp Salary, Freelance UX'
              className='w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-emerald-500 focus:bg-white focus:outline-none dark:focus:bg-gray-800 transition-all'
              required
            />
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className='block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1'>
                Category Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className='w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2.5 text-xs font-medium text-gray-900 dark:text-white focus:border-emerald-500 focus:outline-none transition-all'
              >
                {INCOME_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className='block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1'>
                Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className='w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2.5 text-xs font-medium text-gray-900 dark:text-white focus:border-emerald-500 focus:outline-none transition-all'
              >
                {FREQUENCIES.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className='block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1'>
              Amount (₹) *
            </label>
            <div className='relative'>
              <span className='absolute left-3.5 top-2.5 font-bold text-gray-400 text-sm'>₹</span>
              <input
                type='number'
                step='any'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder='125000'
                className='w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 pl-8 pr-3.5 py-2.5 text-sm font-mono font-bold text-gray-900 dark:text-white placeholder-gray-400 focus:border-emerald-500 focus:bg-white focus:outline-none dark:focus:bg-gray-800 transition-all'
                required
              />
            </div>
          </div>

          <div>
            <label className='block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1'>
              Notes / Tags (Optional)
            </label>
            <input
              type='text'
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder='e.g., Post-tax net credited to HDFC'
              className='w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3.5 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none transition-all'
            />
          </div>

          <div className='pt-3 flex items-center justify-end gap-2.5 border-t border-gray-100 dark:border-gray-800'>
            <button
              type='button'
              onClick={onClose}
              className='rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={loading}
              className='inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 text-white px-5 py-2.5 text-xs font-bold shadow-md shadow-emerald-500/20 hover:bg-emerald-500 disabled:opacity-50 transition-all'
            >
              {loading ? (
                <>
                  <Loader2 className='h-3.5 w-3.5 animate-spin' />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Plus className='h-3.5 w-3.5' />
                  <span>Save Income</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
