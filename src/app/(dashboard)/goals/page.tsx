import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { EmptyState } from '@/components/shared/empty-state';
import { GoalCard } from '@/components/goals/goal-card';
import { redirect } from 'next/navigation';
import { Target, Sparkles, Plus } from 'lucide-react';
import Link from 'next/link';

export default async function GoalsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const goals = await db.goal
    .findMany({ where: { userId: user.id }, orderBy: { deadline: 'asc' } })
    .catch(() => [
      {
        id: 'g1',
        userId: user.id,
        emoji: '🏠',
        name: 'Dream Home Down Payment',
        targetAmount: 2500000,
        currentAmount: 650000,
        deadline: new Date(Date.now() + 86400000 * 365 * 2),
        monthlySIP: 35000,
        instrument: 'Flexi Cap Fund',
        expectedReturn: 12,
        priority: 1,
        status: 'ACTIVE' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'g2',
        userId: user.id,
        emoji: '⚡',
        name: 'New Electric SUV',
        targetAmount: 800000,
        currentAmount: 320000,
        deadline: new Date(Date.now() + 86400000 * 180),
        monthlySIP: 15000,
        instrument: 'Short Term Debt Fund',
        expectedReturn: 7.5,
        priority: 2,
        status: 'ACTIVE' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'g3',
        userId: user.id,
        emoji: '✈️',
        name: 'Europe Family Vacation',
        targetAmount: 400000,
        currentAmount: 180000,
        deadline: new Date(Date.now() + 86400000 * 240),
        monthlySIP: 10000,
        instrument: 'Balanced Advantage Fund',
        expectedReturn: 10,
        priority: 3,
        status: 'ACTIVE' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

  return (
    <div className='space-y-6 pb-8'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight'>User Financial Goals</h1>
          <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5'>
            <Sparkles className='h-3.5 w-3.5 text-blue-500' />
            Goal-based investing with reverse SIP calculation and instrument selection
          </p>
        </div>
        <Link
          href='/chat?prompt=I%20want%20to%20create%20a%20new%20financial%20goal.%20Help%20me%20calculate%20SIP%20and%20instrument.'
          className='inline-flex items-center gap-2 rounded-xl bg-dhan-gradient px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-500/20 hover:opacity-95 transition-all self-start sm:self-auto'
        >
          <Plus className='h-4 w-4' />
          <span>Create New Goal</span>
        </Link>
      </div>

      {goals.length ? (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3'>
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      ) : (
        <EmptyState title='No goals created yet' description='Use the AI Advisor to set up your first goal with computed monthly SIPs.' />
      )}
    </div>
  );
}


