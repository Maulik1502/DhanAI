import { db } from '@/lib/db';
import { buildFinancialAdvice, buildTaxSuggestion } from '@/lib/ai/advisor';
import { ok, readJson, requireUserId } from '@/lib/api/responses';

export async function POST(request: Request) {
  const auth = await requireUserId();
  if ('error' in auth) return auth.error;

  const body = await readJson<{ type?: string; grossIncome?: number; deductions?: Record<string, number> }>(request);
  if (body.type === 'tax') {
    return ok(buildTaxSuggestion(body.grossIncome || 0, body.deductions || {}));
  }

  const [user, incomes, expenses, goals] = await Promise.all([
    db.user.findUnique({ where: { id: auth.userId } }),
    db.income.findMany({ where: { userId: auth.userId, isActive: true } }),
    db.expense.findMany({ where: { userId: auth.userId, isActive: true } }),
    db.goal.findMany({ where: { userId: auth.userId, status: 'ACTIVE' } }),
  ]);
  return ok({ suggestion: buildFinancialAdvice({ user, incomes, expenses, goals }) });
}


