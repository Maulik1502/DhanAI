import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { User, Mail, ShieldCheck, CreditCard, Sparkles, Sliders, CheckCircle2, UserCheck, Calendar } from 'lucide-react';
import Link from 'next/link';

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const dobFormatted = user.dateOfBirth
    ? new Date(user.dateOfBirth).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '15 May 1998';

  return (
    <div className='space-y-6 pb-8 max-w-4xl mx-auto'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <div className='flex items-center gap-2'>
            <span className='rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold px-2.5 py-0.5 flex items-center gap-1'>
              <UserCheck className='h-3 w-3' /> ACCOUNT PROFILE & SETTINGS
            </span>
          </div>
          <h1 className='text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mt-1'>
            User Profile & Preferences
          </h1>
          <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5'>
            Manage your personal financial parameters, risk tolerance, and tax choices
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Profile Identity Card */}
        <div className='glass-card p-6 border border-gray-200/80 dark:border-gray-800/80 shadow-xs space-y-4 text-center md:col-span-1 flex flex-col items-center justify-center rounded-2xl'>
          <div className='flex h-20 w-20 items-center justify-center rounded-full bg-dhan-gradient text-white text-3xl font-bold shadow-lg ring-4 ring-blue-500/20'>
            {(user.name || 'U').charAt(0)}
          </div>
          <div>
            <h2 className='font-bold text-gray-900 dark:text-white text-lg'>{user.name || 'Investor'}</h2>
            <p className='text-xs text-gray-500 font-mono'>{user.email}</p>
          </div>
          <span className='rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold px-3 py-1 flex items-center gap-1'>
            <CheckCircle2 className='h-3.5 w-3.5' /> Verified {user.plan} Account
          </span>
        </div>

        {/* Profile Details Form */}
        <div className='glass-card p-6 border border-gray-200/80 dark:border-gray-800/80 shadow-xs space-y-6 md:col-span-2 rounded-2xl'>
          <h2 className='font-bold text-gray-900 dark:text-white text-base tracking-tight pb-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2'>
            <Sliders className='h-4 w-4 text-blue-600' />
            Financial Parameters & Settings
          </h2>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs'>
            <div className='p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 space-y-1'>
              <span className='text-gray-400 font-medium flex items-center gap-1'>
                <Calendar className='h-3 w-3' /> Date of Birth
              </span>
              <p className='font-bold text-gray-900 dark:text-white text-sm'>
                {dobFormatted} <span className='text-xs text-gray-400 font-normal'>({user.age || 28} Yrs)</span>
              </p>
            </div>

            <div className='p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 space-y-1'>
              <span className='text-gray-400 font-medium'>Occupation</span>
              <p className='font-bold text-gray-900 dark:text-white text-sm'>{user.occupation || 'Salaried Professional'}</p>
            </div>

            <div className='p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 space-y-1'>
              <span className='text-gray-400 font-medium'>Financial Dependents</span>
              <p className='font-bold text-gray-900 dark:text-white text-sm'>{user.dependents || 1} Dependent(s)</p>
            </div>

            <div className='p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 space-y-1'>
              <span className='text-gray-400 font-medium'>Risk Profile</span>
              <p className='font-bold text-blue-600 dark:text-blue-400 text-sm'>{user.riskLevel || 'MODERATE'}</p>
            </div>

            <div className='p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 space-y-1'>
              <span className='text-gray-400 font-medium'>Tax Regime Preference</span>
              <p className='font-bold text-emerald-600 dark:text-emerald-400 text-sm'>FY 2025-26 {user.taxRegime || 'NEW'} Regime</p>
            </div>

            <div className='p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 space-y-1'>
              <span className='text-gray-400 font-medium'>Subscription Tier</span>
              <p className='font-bold text-purple-600 dark:text-purple-400 text-sm'>{user.plan} Active</p>
            </div>
          </div>

          <div className='pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between'>
            <span className='text-xs text-gray-400'>Need to update your details?</span>
            <Link
              href='/onboarding'
              className='inline-flex items-center gap-1.5 rounded-xl bg-blue-600 text-white px-4 py-2 text-xs font-bold shadow-xs hover:bg-blue-500 transition-all'
            >
              <span>Update Profile & Setup</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
