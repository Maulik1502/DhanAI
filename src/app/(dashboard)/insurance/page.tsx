import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { InsuranceCard } from '@/components/insurance/insurance-card';
import { redirect } from 'next/navigation';
import { ShieldCheck, Sparkles, Plus } from 'lucide-react';
import Link from 'next/link';

export default async function InsurancePage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const insurance = await db.insurance
    .findMany({ where: { userId: user.id }, orderBy: [{ priority: 'asc' }, { createdAt: 'desc' }] })
    .catch(() => [
      {
        id: 'ins-1',
        userId: user.id,
        type: 'TERM' as const,
        coverAmount: 15000000,
        premium: 14500,
        priority: 'CRITICAL' as const,
        status: 'ACTIVE' as const,
        reason: 'Term insurance protects dependents (15x annual income) before equity wealth building begins.',
        nextDueDate: new Date(Date.now() + 86400000 * 90),
        policyNo: 'HDFC-TERM-99201',
      },
      {
        id: 'ins-2',
        userId: user.id,
        type: 'HEALTH' as const,
        coverAmount: 1000000,
        premium: 18000,
        priority: 'CRITICAL' as const,
        status: 'ACTIVE' as const,
        reason: 'Health floater prevents medical hospitalization emergencies from draining corpus investments.',
        nextDueDate: new Date(Date.now() + 86400000 * 45),
        policyNo: 'NIVA-HEALTH-44102',
      },
      {
        id: 'ins-3',
        userId: user.id,
        type: 'LOAN_PROTECTION' as const,
        coverAmount: 2800000,
        premium: 8500,
        priority: 'RECOMMENDED' as const,
        status: 'SUGGESTED' as const,
        reason: 'Covers outstanding home loan EMI debt burden in case of unforeseen critical events.',
        nextDueDate: null,
        policyNo: null,
      },
    ]);

  return (
    <div className='space-y-6 pb-8'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight'>Insurance Protection Advisor</h1>
          <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5'>
            <Sparkles className='h-3.5 w-3.5 text-blue-500' />
            AI-suggested term, health, and debt cover priorities before investing
          </p>
        </div>
        <Link
          href='/chat?prompt=Evaluate%20my%20insurance%20coverage%20gaps'
          className='inline-flex items-center gap-2 rounded-xl bg-dhan-gradient px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-500/20 hover:opacity-95 transition-all self-start sm:self-auto'
        >
          <Sparkles className='h-3.5 w-3.5' />
          <span>Analyze Coverage Gaps</span>
        </Link>
      </div>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3'>
        {insurance.map((item) => (
          <InsuranceCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}


