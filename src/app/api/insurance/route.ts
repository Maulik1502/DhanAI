import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { db } from '@/lib/db';
import { fail, ok, requireUserId, validateJson } from '@/lib/api/responses';

const postSchema = z.object({ id: z.string().min(1), provider: z.string().optional(), policyNo: z.string().optional(), premium: z.number().nonnegative().optional() });
const patchSchema = postSchema.partial().extend({ id: z.string().min(1), nextDueDate: z.string().optional(), status: z.enum(['SUGGESTED', 'ACTIVE', 'LAPSED']).optional() });

async function ensureSuggestions(userId: string) {
  const existing = await db.insurance.count({ where: { userId } });
  if (existing > 0) return;
  const [user, expenses, goals] = await Promise.all([db.user.findUnique({ where: { id: userId } }), db.expense.findMany({ where: { userId, isActive: true } }), db.goal.findMany({ where: { userId, status: 'ACTIVE' } })]);
  const income = await db.income.aggregate({ where: { userId, isActive: true }, _sum: { amount: true } });
  const annualIncome = (income._sum.amount || 0) * 12;
  const totalEmi = expenses.filter((expense) => expense.isEMI).reduce((sum, expense) => sum + expense.amount, 0);
  const rows: Prisma.InsuranceCreateManyInput[] = [
    { userId, type: 'HEALTH' as const, coverAmount: user?.dependents ? 1000000 : 500000, premium: user?.dependents ? 18000 : 10000, priority: 'CRITICAL' as const, reason: 'Health cover protects your emergency fund from medical shocks.' },
  ];
  if ((user?.dependents || 0) > 0) rows.push({ userId, type: 'TERM', coverAmount: Math.max(5000000, annualIncome * 15), premium: 12000, priority: 'CRITICAL', reason: 'Term cover protects dependents and should come before long-term investing.' });
  if ((user?.age || 0) > 40) rows.push({ userId, type: 'CRITICAL_ILLNESS', coverAmount: 2500000, premium: 9000, priority: 'RECOMMENDED', reason: 'Critical illness cover is useful as health risks rise after 40.' });
  if (goals.some((goal) => /car/i.test(goal.name))) rows.push({ userId, type: 'MOTOR', coverAmount: 800000, premium: 15000, priority: 'RECOMMENDED', reason: 'A car-related goal should include motor insurance planning.' });
  if (totalEmi > 10000) rows.push({ userId, type: 'LOAN_PROTECTION', coverAmount: totalEmi * 120, premium: 7000, priority: 'OPTIONAL', reason: 'Loan protection can reduce family risk while EMIs are high.' });
  await db.insurance.createMany({ data: rows });
}

export async function GET() {
  const auth = await requireUserId();
  if ('error' in auth) return auth.error;
  await ensureSuggestions(auth.userId);
  return ok(await db.insurance.findMany({ where: { userId: auth.userId }, orderBy: [{ priority: 'asc' }, { createdAt: 'desc' }] }));
}

export async function POST(request: Request) {
  const auth = await requireUserId();
  if ('error' in auth) return auth.error;
  try {
    const body = await validateJson(request, postSchema);
    const insurance = await db.insurance.findFirst({ where: { id: body.id, userId: auth.userId } });
    if (!insurance) return fail('Insurance suggestion not found', 404);
    const updated = await db.insurance.update({ where: { id: body.id }, data: { status: 'ACTIVE', provider: body.provider, policyNo: body.policyNo, premium: body.premium ?? insurance.premium } });
    await db.expense.create({ data: { userId: auth.userId, category: 'INSURANCE', name: `${insurance.type.replaceAll('_', ' ')} premium`, amount: body.premium ?? insurance.premium, frequency: 'YEARLY', isActive: true } });
    return ok(updated, 'Insurance activated');
  } catch (error) { return fail(error, 400); }
}

export async function PATCH(request: Request) {
  const auth = await requireUserId();
  if ('error' in auth) return auth.error;
  try {
    const body = await validateJson(request, patchSchema);
    const updated = await db.insurance.updateMany({ where: { id: body.id, userId: auth.userId }, data: { provider: body.provider, policyNo: body.policyNo, premium: body.premium, status: body.status, nextDueDate: body.nextDueDate ? new Date(body.nextDueDate) : undefined } });
    if (!updated.count) return fail('Insurance not found', 404);
    return ok({ id: body.id }, 'Insurance updated');
  } catch (error) { return fail(error, 400); }
}

