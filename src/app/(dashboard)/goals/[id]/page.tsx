import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { formatINR } from '@/lib/calculators';
import { ProgressBar } from '@/components/shared/progress-bar';

export default async function GoalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  const goal = await db.goal.findFirst({ where: { id, userId: user.id } });
  if (!goal) notFound();
  const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;

  return (
    <div className='space-y-6'>
      <div><p className='text-4xl'>{goal.emoji}</p><h1 className='mt-2 text-3xl font-bold text-gray-900 dark:text-white'>{goal.name}</h1><p className='mt-1 text-gray-500'>{goal.instrument} · target date {goal.deadline.toLocaleDateString('en-IN')}</p></div>
      <div className='rounded-2xl border bg-white p-6 shadow-sm dark:bg-gray-800'>
        <div className='flex items-end justify-between'><div><p className='text-sm text-gray-500'>Progress</p><p className='text-3xl font-bold'>{formatINR(goal.currentAmount)} / {formatINR(goal.targetAmount)}</p></div><p className='text-2xl font-bold text-blue-600'>{Math.round(progress)}%</p></div>
        <ProgressBar value={progress} className='mt-5' />
        <div className='mt-6 grid grid-cols-1 gap-4 md:grid-cols-3'>
          <div className='rounded-xl bg-blue-50 p-4'><p className='text-sm text-blue-700'>Monthly SIP</p><p className='text-xl font-bold'>{formatINR(goal.monthlySIP)}</p></div>
          <div className='rounded-xl bg-green-50 p-4'><p className='text-sm text-green-700'>Expected Return</p><p className='text-xl font-bold'>{goal.expectedReturn}%</p></div>
          <div className='rounded-xl bg-purple-50 p-4'><p className='text-sm text-purple-700'>Status</p><p className='text-xl font-bold'>{goal.status}</p></div>
        </div>
        {goal.aiSuggestion ? <p className='mt-5 rounded-xl bg-gray-50 p-4 text-sm text-gray-600'>{goal.aiSuggestion}</p> : null}
      </div>
    </div>
  );
}
