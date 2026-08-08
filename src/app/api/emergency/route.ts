import { z } from 'zod';
import { db } from '@/lib/db';
import { calcEmergencyFund, toMonthly } from '@/lib/calculators';
import { fail, ok, requireUserId, validateJson } from '@/lib/api/responses';

const updateSchema = z.object({ currentAmount: z.number().nonnegative(), targetAmount: z.number().positive().optional(), monthlyAlloc: z.number().nonnegative().optional() });

async function getRecommendation(userId: string) {
  const [user, expenses] = await Promise.all([db.user.findUnique({ where: { id: userId }, select: { occupation: true } }), db.expense.findMany({ where: { userId, isActive: true } })]);
  const monthlyExpenses = expenses.reduce((sum, item) => sum + toMonthly(item.amount, item.frequency), 0);
  return calcEmergencyFund(monthlyExpenses, user?.occupation || 'SALARY');
}

export async function GET() {
  const auth = await requireUserId();
  if ('error' in auth) return auth.error;
  const recommendation = await getRecommendation(auth.userId);
  const fund = await db.emergencyFund.upsert({ where: { userId: auth.userId }, create: { userId: auth.userId, targetAmount: recommendation.target, monthlyAlloc: recommendation.monthlyAlloc, monthsCovered: 0 }, update: {} });
  return ok({ fund, recommendation });
}

export async function PATCH(request: Request) {
  const auth = await requireUserId();
  if ('error' in auth) return auth.error;
  try {
    const body = await validateJson(request, updateSchema);
    const existing = await db.emergencyFund.findUnique({ where: { userId: auth.userId } });
    const targetAmount = body.targetAmount ?? existing?.targetAmount ?? (await getRecommendation(auth.userId)).target;
    const monthlyBase = targetAmount / 6;
    const fund = await db.emergencyFund.upsert({ where: { userId: auth.userId }, create: { userId: auth.userId, targetAmount, currentAmount: body.currentAmount, monthlyAlloc: body.monthlyAlloc || 0, monthsCovered: monthlyBase ? body.currentAmount / monthlyBase : 0, status: body.currentAmount >= targetAmount ? 'COMPLETE' : 'BUILDING' }, update: { targetAmount, currentAmount: body.currentAmount, monthlyAlloc: body.monthlyAlloc, monthsCovered: monthlyBase ? body.currentAmount / monthlyBase : 0, status: body.currentAmount >= targetAmount ? 'COMPLETE' : 'BUILDING' } });
    return ok(fund, 'Emergency fund updated');
  } catch (error) { return fail(error, 400); }
}
