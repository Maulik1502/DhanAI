import { db } from '@/lib/db';
import { buildFinancialAdvice, summarizeFinances } from '@/lib/ai/advisor';
import { ok, requireUserId } from '@/lib/api/responses';

export async function POST() {
  const auth = await requireUserId();
  if ('error' in auth) return auth.error;
  const [user, incomes, expenses, goals] = await Promise.all([
    db.user.findUnique({ where: { id: auth.userId } }),
    db.income.findMany({ where: { userId: auth.userId, isActive: true } }),
    db.expense.findMany({ where: { userId: auth.userId, isActive: true } }),
    db.goal.findMany({ where: { userId: auth.userId, status: 'ACTIVE' } }),
  ]);
  const snapshot = { user, incomes, expenses, goals };
  return ok({ summary: summarizeFinances(snapshot), advice: buildFinancialAdvice(snapshot) });
}


