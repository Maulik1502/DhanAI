'use client';

import { useState } from 'react';
import { X, Plus, TrendingDown, CreditCard, Loader2 } from 'lucide-react';

type AddExpenseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

const EXPENSE_CATEGORIES = [
  { value: 'RENT', label: 'House Rent' },
  { value: 'FOOD', label: 'Groceries & Food' },
  { value: 'TRANSPORT', label: 'Transport & Fuel' },
  { value: 'EMI_HOME', label: 'Home Loan EMI' },
  { value: 'EMI_CAR', label: 'Car Loan EMI' },
  { value: 'EMI_PERSONAL', label: 'Personal Loan EMI' },
  { value: 'EMI_EDUCATION', label: 'Education Loan EMI' },
  { value: 'INSURANCE', label: 'Insurance Premium' },
  { value: 'SUBSCRIPTION', label: 'Subscriptions & Bills' },
  { value: 'EDUCATION', label: 'School / College Fees' },
  { value: 'MEDICAL', label: 'Medical & Healthcare' },
  { value: 'UTILITIES', label: 'Electricity & Gas Utilities' },
  { value: 'OTHER', label: 'Other Outflow' },
];

const FREQUENCIES = [
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'QUARTERLY', label: 'Quarterly' },
  { value: 'YEARLY', label: 'Yearly' },
  { value: 'ONE_TIME', label: 'One-time Expense' },
];

export function AddExpenseModal({ isOpen, onClose, onSuccess }: AddExpenseModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('RENT');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState('MONTHLY');
  const [isEMI, setIsEMI] = useState(false);
  const [emiMonthsLeft, setEmiMonthsLeft] = useState('');
  const [bankName, setBankName] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const numAmount = parseFloat(amount);
    if (!name.trim()) {
      setError('Please enter an expense name.');
      return;
    }
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid positive amount.');
      return;
    }

    let parsedEmiMonths: number | undefined = undefined;
    if (isEMI) {
      parsedEmiMonths = parseInt(emiMonthsLeft, 10);
      if (isNaN(parsedEmiMonths) || parsedEmiMonths < 0) {
        setError('Please enter remaining EMI months.');
        return;
      }
    }

    setLoading(true);

    try {
      const res = await fetch('/api/finances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'expense',
          name: name.trim(),
          category,
          amount: numAmount,
          frequency,
          isEMI,
          emiMonthsLeft: isEMI ? parsedEmiMonths : undefined,
          bankName: isEMI && bankName.trim() ? bankName.trim() : undefined,
          note: note.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to add expense');
      }

      // Reset form
      setName('');
      setAmount('');
      setIsEMI(false);
      setEmiMonthsLeft('');
      setBankName('');
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
      <div className='relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-6 overflow-hidden max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800'>
          <div className='flex items-center gap-2.5'>
            <div className='p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400'>
              <TrendingDown className='h-5 w-5' />
            </div>
            <div>
              <h2 className='font-bold text-gray-900 dark:text-white text-lg tracking-tight'>Add Expense / EMI</h2>
              <p className='text-xs text-gray-500 dark:text-gray-400'>Record a recurring expense or active loan EMI</p>
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
              Expense Title / Vendor Name *
            </label>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='e.g., HDFC Home Loan EMI, Apartment Rent'
              className='w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-rose-500 focus:bg-white focus:outline-none dark:focus:bg-gray-800 transition-all'
              required
            />
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className='block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1'>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  if (e.target.value.startsWith('EMI_')) {
                    setIsEMI(true);
                  }
                }}
                className='w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2.5 text-xs font-medium text-gray-900 dark:text-white focus:border-rose-500 focus:outline-none transition-all'
              >
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
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
                className='w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2.5 text-xs font-medium text-gray-900 dark:text-white focus:border-rose-500 focus:outline-none transition-all'
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
              Outflow Amount (₹) *
            </label>
            <div className='relative'>
              <span className='absolute left-3.5 top-2.5 font-bold text-gray-400 text-sm'>₹</span>
              <input
                type='number'
                step='any'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder='28000'
                className='w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 pl-8 pr-3.5 py-2.5 text-sm font-mono font-bold text-gray-900 dark:text-white placeholder-gray-400 focus:border-rose-500 focus:bg-white focus:outline-none dark:focus:bg-gray-800 transition-all'
                required
              />
            </div>
          </div>

          {/* EMI Toggle Box */}
          <div className='p-3.5 rounded-xl border border-rose-100 dark:border-rose-950 bg-rose-50/40 dark:bg-rose-950/20 space-y-3'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <CreditCard className='h-4 w-4 text-rose-600 dark:text-rose-400' />
                <span className='text-xs font-bold text-gray-900 dark:text-white'>Is this a Loan EMI?</span>
              </div>
              <label className='relative inline-flex items-center cursor-pointer'>
                <input
                  type='checkbox'
                  checked={isEMI}
                  onChange={(e) => setIsEMI(e.target.checked)}
                  className='sr-only peer'
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:peer-focus:ring-rose-800 peer-checked:bg-rose-600"></div>
              </label>
            </div>

            {isEMI && (
              <div className='grid grid-cols-2 gap-3 pt-2 animate-in fade-in duration-200'>
                <div>
                  <label className='block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1'>
                    Months Remaining *
                  </label>
                  <input
                    type='number'
                    value={emiMonthsLeft}
                    onChange={(e) => setEmiMonthsLeft(e.target.value)}
                    placeholder='120'
                    className='w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs font-mono font-bold text-gray-900 dark:text-white placeholder-gray-400 focus:border-rose-500 focus:outline-none'
                    required={isEMI}
                  />
                </div>
                <div>
                  <label className='block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1'>
                    Lender Bank (Optional)
                  </label>
                  <input
                    type='text'
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder='HDFC / SBI'
                    className='w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:border-rose-500 focus:outline-none'
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className='block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1'>
              Notes / Remarks (Optional)
            </label>
            <input
              type='text'
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder='e.g., Auto-debited on 5th of every month'
              className='w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3.5 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:border-rose-500 focus:outline-none transition-all'
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
              className='inline-flex items-center gap-1.5 rounded-xl bg-rose-600 text-white px-5 py-2.5 text-xs font-bold shadow-md shadow-rose-500/20 hover:bg-rose-500 disabled:opacity-50 transition-all'
            >
              {loading ? (
                <>
                  <Loader2 className='h-3.5 w-3.5 animate-spin' />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Plus className='h-3.5 w-3.5' />
                  <span>Save Expense</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
