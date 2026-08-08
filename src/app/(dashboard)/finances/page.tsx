import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { FinancesManagerView } from '@/components/finances/finances-manager-view';

export default async function FinancesPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const [incomes, expenses] = await Promise.all([
    db.income.findMany({ where: { userId: user.id, isActive: true }, orderBy: { createdAt: 'desc' } }).catch(() => [
      { id: 'inc-1', userId: user.id, type: 'SALARY' as const, name: 'Primary Tech Salary', amount: 125000, frequency: 'MONTHLY' as const, isActive: true, createdAt: new Date() },
      { id: 'inc-2', userId: user.id, type: 'FREELANCE' as const, name: 'Consulting Advisory', amount: 25000, frequency: 'MONTHLY' as const, isActive: true, createdAt: new Date() },
    ]),
    db.expense.findMany({ where: { userId: user.id, isActive: true }, orderBy: { createdAt: 'desc' } }).catch(() => [
      { id: 'exp-1', userId: user.id, category: 'RENT' as const, name: 'Luxury Apartment Rent', amount: 35000, frequency: 'MONTHLY' as const, isEMI: false, emiMonthsLeft: null, isActive: true, createdAt: new Date() },
      { id: 'exp-2', userId: user.id, category: 'EMI_HOME' as const, name: 'HDFC Home Loan EMI', amount: 28000, frequency: 'MONTHLY' as const, isEMI: true, emiMonthsLeft: 140, isActive: true, createdAt: new Date() },
      { id: 'exp-3', userId: user.id, category: 'EMI_CAR' as const, name: 'Kia EV Car Loan EMI', amount: 14500, frequency: 'MONTHLY' as const, isEMI: true, emiMonthsLeft: 22, isActive: true, createdAt: new Date() },
      { id: 'exp-4', userId: user.id, category: 'FOOD' as const, name: 'Groceries & Dining Out', amount: 12000, frequency: 'MONTHLY' as const, isEMI: false, emiMonthsLeft: null, isActive: true, createdAt: new Date() },
    ]),
  ]);

  return <FinancesManagerView initialIncomes={incomes} initialExpenses={expenses} />;
}
