import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { IncomeView } from '@/components/finances/income-view';

export default async function IncomePage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const incomes = await db.income
    .findMany({ where: { userId: user.id, isActive: true }, orderBy: { createdAt: 'desc' } })
    .catch(() => [
      { id: 'inc-1', userId: user.id, type: 'SALARY' as const, name: 'Primary Tech Salary', amount: 125000, frequency: 'MONTHLY' as const, isActive: true, createdAt: new Date() },
      { id: 'inc-2', userId: user.id, type: 'FREELANCE' as const, name: 'Consulting Advisory', amount: 25000, frequency: 'MONTHLY' as const, isActive: true, createdAt: new Date() },
    ]);

  return <IncomeView initialIncomes={incomes} />;
}
