import { z } from 'zod';
import { db } from '@/lib/db';
import { fail, ok, requireUserId, validateJson } from '@/lib/api/responses';
import { getGoalInstrument, sipRequired, toMonthly } from '@/lib/calculators';

const createGoalSchema = z.object({ name: z.string().min(1), emoji: z.string().default('🎯'), targetAmount: z.number().positive(), currentAmount: z.number().nonnegative().default(0), deadline: z.string().datetime().or(z.string().date()), priority: z.number().int().min(1).default(1) });
const updateGoalSchema = z.object({ id: z.string().min(1), name: z.string().min(1).optional(), currentAmount: z.number().nonnegative().optional(), deadline: z.string().datetime().or(z.string().date()).optional(), targetAmount: z.number().positive().optional(), status: z.enum(['ACTIVE', 'COMPLETED', 'PAUSED', 'CANCELLED']).optional() });
const deleteGoalSchema = z.object({ id: z.string().min(1) });

async function getSurplus(userId: string) {
  const [incomes, expenses] = await Promise.all([db.income.findMany({ where: { userId, isActive: true } }), db.expense.findMany({ where: { userId, isActive: true } })]);
  return incomes.reduce((sum, item) => sum + toMonthly(item.amount, item.frequency), 0) - expenses.reduce((sum, item) => sum + toMonthly(item.amount, item.frequency), 0);
}

function decorateGoal<T extends { targetAmount: number; currentAmount: number; monthlySIP: number; deadline: Date }>(goal: T) {
  const progressPct = goal.targetAmount > 0 ? Math.round((goal.currentAmount / goal.targetAmount) * 100) : 0;
  const monthsLeft = Math.max(1, Math.ceil((goal.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)));
  const expectedProgress = Math.max(0, 100 - monthsLeft * 3);
  return { ...goal, progressPct, onTrack: progressPct + 10 >= expectedProgress };
}

export async function GET() {
  const auth = await requireUserId();
  if ('error' in auth) return auth.error;
  const goals = await db.goal.findMany({ where: { userId: auth.userId, status: { not: 'CANCELLED' } }, orderBy: { deadline: 'asc' } });
  return ok(goals.map(decorateGoal));
}

export async function POST(request: Request) {
  const auth = await requireUserId();
  if ('error' in auth) return auth.error;
  try {
    const body = await validateJson(request, createGoalSchema);
    const user = await db.user.findUnique({ where: { id: auth.userId }, select: { riskLevel: true } });
    const deadline = new Date(body.deadline);
    const months = Math.max(1, Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)));
    const instrument = getGoalInstrument(months, user?.riskLevel || 'MODERATE');
    const currentAmount = body.currentAmount ?? 0;
    const priority = body.priority ?? 1;
    const emoji = body.emoji ?? '🎯';
    const remaining = Math.max(0, body.targetAmount - currentAmount);
    const monthlySIP = Math.ceil(sipRequired(remaining, instrument.expectedReturn, months));
    const surplus = await getSurplus(auth.userId);
    if (monthlySIP > surplus && surplus > 0) {
      const suggestedMonths = Math.ceil(months * (monthlySIP / surplus));
      return ok({ affordable: false, monthlySIP, surplus, suggestedMonths, suggestedDeadline: new Date(Date.now() + suggestedMonths * 30 * 24 * 60 * 60 * 1000).toISOString() }, 'Goal needs a longer timeline', 400);
    }
    const goal = await db.goal.create({ data: { userId: auth.userId, name: body.name, emoji, targetAmount: body.targetAmount, currentAmount, deadline, monthlySIP, instrument: instrument.instrument, expectedReturn: instrument.expectedReturn, priority, aiSuggestion: `Invest around Rs.${monthlySIP.toLocaleString('en-IN')} per month in ${instrument.instrument}.` } });
    return ok(decorateGoal(goal), 'Goal created', 201);
  } catch (error) { return fail(error, 400); }
}

export async function PATCH(request: Request) {
  const auth = await requireUserId();
  if ('error' in auth) return auth.error;
  try {
    const body = await validateJson(request, updateGoalSchema);
    const existing = await db.goal.findFirst({ where: { id: body.id, userId: auth.userId } });
    if (!existing) return fail('Goal not found', 404);
    const deadline = body.deadline ? new Date(body.deadline) : existing.deadline;
    const targetAmount = body.targetAmount ?? existing.targetAmount;
    const currentAmount = body.currentAmount ?? existing.currentAmount;
    const user = await db.user.findUnique({ where: { id: auth.userId }, select: { riskLevel: true } });
    const months = Math.max(1, Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)));
    const instrument = getGoalInstrument(months, user?.riskLevel || 'MODERATE');
    const monthlySIP = Math.ceil(sipRequired(Math.max(0, targetAmount - currentAmount), instrument.expectedReturn, months));
    const goal = await db.goal.update({ where: { id: body.id }, data: { name: body.name, targetAmount, currentAmount, deadline, monthlySIP, instrument: instrument.instrument, expectedReturn: instrument.expectedReturn, status: body.status } });
    return ok(decorateGoal(goal), 'Goal updated');
  } catch (error) { return fail(error, 400); }
}

export async function DELETE(request: Request) {
  const auth = await requireUserId();
  if ('error' in auth) return auth.error;
  try {
    const body = await validateJson(request, deleteGoalSchema);
    const updated = await db.goal.updateMany({ where: { id: body.id, userId: auth.userId }, data: { status: 'CANCELLED' } });
    if (!updated.count) return fail('Goal not found', 404);
    return ok({ id: body.id }, 'Goal cancelled');
  } catch (error) { return fail(error, 400); }
}


