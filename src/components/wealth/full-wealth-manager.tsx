'use client';

import { useState } from 'react';
import {
  Wallet,
  Building2,
  Landmark,
  CreditCard,
  TrendingUp,
  Plus,
  Trash2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { formatINR } from '@/lib/calculators';

type WealthAccount = {
  id: string;
  name: string;
  category: 'CASH' | 'SAVINGS' | 'FD' | 'INVESTMENT' | 'CREDIT_CARD';
  balance: number;
  institution?: string;
  accountNo?: string;
};

const initialAccounts: WealthAccount[] = [
  { id: 'acc-1', name: 'Physical Cash (Wallet / Home)', category: 'CASH', balance: 85000, institution: 'Cash in Pocket' },
  { id: 'acc-2', name: 'HDFC Salary Savings A/c', category: 'SAVINGS', balance: 240000, institution: 'HDFC Bank', accountNo: '••• 4829' },
  { id: 'acc-3', name: 'ICICI Emergency Savings A/c', category: 'SAVINGS', balance: 110000, institution: 'ICICI Bank', accountNo: '••• 1024' },
  { id: 'acc-4', name: 'SBI High-Yield 7.1% Fixed Deposit', category: 'FD', balance: 350000, institution: 'State Bank of India' },
  { id: 'acc-5', name: 'Equity & Mutual Fund Holdings', category: 'INVESTMENT', balance: 520000, institution: 'Zerodha / MF Central' },
  { id: 'acc-6', name: 'HDFC Regalia Credit Card', category: 'CREDIT_CARD', balance: -18500, institution: 'HDFC Bank', accountNo: '••• 9912' },
];

export function FullWealthManager() {
  const [accounts, setAccounts] = useState<WealthAccount[]>(initialAccounts);
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'CASH' | 'SAVINGS' | 'FD' | 'INVESTMENT' | 'CREDIT_CARD'>('SAVINGS');
  const [balance, setBalance] = useState('');
  const [institution, setInstitution] = useState('');

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(balance);
    if (!name.trim() || isNaN(val)) return;

    const item: WealthAccount = {
      id: Date.now().toString(),
      name: name.trim(),
      category,
      balance: category === 'CREDIT_CARD' ? -Math.abs(val) : val,
      institution: institution.trim() || undefined,
    };

    setAccounts([...accounts, item]);
    setName('');
    setBalance('');
    setInstitution('');
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    setAccounts(accounts.filter((a) => a.id !== id));
  };

  const totalAssets = accounts.filter((a) => a.balance > 0).reduce((sum, a) => sum + a.balance, 0);
  const totalLiabilities = Math.abs(accounts.filter((a) => a.balance < 0).reduce((sum, a) => sum + a.balance, 0));
  const netWealth = totalAssets - totalLiabilities;

  return (
    <div className='glass-card p-6 border border-emerald-200/80 dark:border-emerald-900/60 bg-white dark:bg-gray-900 rounded-2xl shadow-xs space-y-6'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-800'>
        <div>
          <div className='flex items-center gap-2'>
            <span className='rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 flex items-center gap-1'>
              <Landmark className='h-3 w-3' /> MULTI-ACCOUNT WALLET MANAGER
            </span>
          </div>
          <h2 className='text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight mt-1'>
            Total Net Wealth: <span className='font-mono text-emerald-600 dark:text-emerald-400'>{formatINR(netWealth)}</span>
          </h2>
          <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
            Combined liquidity across pocket cash, bank savings, FDs, investments & credit cards
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className='inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 text-white px-4 py-2 text-xs font-bold shadow-md shadow-emerald-500/20 hover:bg-emerald-500 transition-all self-start sm:self-auto'
        >
          <Plus className='h-3.5 w-3.5' />
          <span>Add Account / Wallet</span>
        </button>
      </div>

      {/* Breakdown Strip */}
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs'>
        <div className='p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800'>
          <span className='text-[10px] text-gray-400 font-bold uppercase'>Physical Cash</span>
          <p className='font-mono font-bold text-gray-900 dark:text-white text-base mt-0.5'>
            {formatINR(accounts.filter((a) => a.category === 'CASH').reduce((s, a) => s + a.balance, 0))}
          </p>
        </div>
        <div className='p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800'>
          <span className='text-[10px] text-gray-400 font-bold uppercase'>Bank Savings</span>
          <p className='font-mono font-bold text-gray-900 dark:text-white text-base mt-0.5'>
            {formatINR(accounts.filter((a) => a.category === 'SAVINGS').reduce((s, a) => s + a.balance, 0))}
          </p>
        </div>
        <div className='p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800'>
          <span className='text-[10px] text-gray-400 font-bold uppercase'>FDs & Investments</span>
          <p className='font-mono font-bold text-gray-900 dark:text-white text-base mt-0.5'>
            {formatINR(accounts.filter((a) => a.category === 'FD' || a.category === 'INVESTMENT').reduce((s, a) => s + a.balance, 0))}
          </p>
        </div>
        <div className='p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800'>
          <span className='text-[10px] text-gray-400 font-bold uppercase'>Credit Card Outstandings</span>
          <p className='font-mono font-bold text-rose-600 dark:text-rose-400 text-base mt-0.5'>
            -{formatINR(totalLiabilities)}
          </p>
        </div>
      </div>

      {/* Form Dialog */}
      {showAddForm && (
        <form
          onSubmit={handleAddAccount}
          className='p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 space-y-3 animate-in fade-in duration-150'
        >
          <div className='grid grid-cols-1 sm:grid-cols-4 gap-3'>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Account Name (e.g. HDFC Salary, SBI FD, Cash)'
              className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3.5 py-2 text-xs text-gray-900 dark:text-white'
              required
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs font-bold text-gray-900 dark:text-white'
            >
              <option value='CASH'>Physical Cash</option>
              <option value='SAVINGS'>Savings Account</option>
              <option value='FD'>Fixed Deposit (FD/RD)</option>
              <option value='INVESTMENT'>Mutual Fund / Stocks</option>
              <option value='CREDIT_CARD'>Credit Card Balance</option>
            </select>
            <input
              type='number'
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              placeholder='Balance Amount (₹)'
              className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3.5 py-2 text-xs font-mono font-bold text-gray-900 dark:text-white'
              required
            />
            <input
              type='text'
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder='Bank / Institution (Optional)'
              className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3.5 py-2 text-xs text-gray-900 dark:text-white'
            />
          </div>
          <div className='flex justify-end gap-2'>
            <button
              type='button'
              onClick={() => setShowAddForm(false)}
              className='px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-500'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs hover:bg-emerald-500'
            >
              Add Money Source
            </button>
          </div>
        </form>
      )}

      {/* Account Cards List */}
      <div className='space-y-3'>
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className='flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white/60 dark:bg-gray-800/40 hover:border-emerald-200 transition-all'
          >
            <div className='flex items-center gap-3'>
              <div
                className={`p-2.5 rounded-xl text-xs ${
                  acc.category === 'CASH'
                    ? 'bg-emerald-500/10 text-emerald-600'
                    : acc.category === 'SAVINGS'
                    ? 'bg-blue-500/10 text-blue-600'
                    : acc.category === 'FD'
                    ? 'bg-amber-500/10 text-amber-600'
                    : acc.category === 'CREDIT_CARD'
                    ? 'bg-rose-500/10 text-rose-600'
                    : 'bg-purple-500/10 text-purple-600'
                }`}
              >
                {acc.category === 'CASH' ? (
                  <Wallet className='h-4 w-4' />
                ) : acc.category === 'SAVINGS' ? (
                  <Building2 className='h-4 w-4' />
                ) : acc.category === 'FD' ? (
                  <Landmark className='h-4 w-4' />
                ) : acc.category === 'CREDIT_CARD' ? (
                  <CreditCard className='h-4 w-4' />
                ) : (
                  <TrendingUp className='h-4 w-4' />
                )}
              </div>

              <div>
                <div className='flex items-center gap-2'>
                  <h3 className='font-bold text-gray-900 dark:text-white text-sm'>{acc.name}</h3>
                  <span className='rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase'>
                    {acc.category.replace('_', ' ')}
                  </span>
                </div>
                {acc.institution && (
                  <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
                    {acc.institution} {acc.accountNo && `· ${acc.accountNo}`}
                  </p>
                )}
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <span
                className={`font-mono font-extrabold text-base ${
                  acc.balance < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {formatINR(acc.balance)}
              </span>
              <button
                onClick={() => handleDelete(acc.id)}
                className='p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-all'
                title='Remove account'
              >
                <Trash2 className='h-3.5 w-3.5' />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
