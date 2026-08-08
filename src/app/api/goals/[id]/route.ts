import { db } from '@/lib/db';
import { fail, ok, requireUserId } from '@/lib/api/responses';
import { sipFutureValue } from '@/lib/calculators';

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireUserId();
  if ('error' in auth) return auth.error;
  const goal = await db.goal.findFirst({ where: { id: (await context.params).id, userId: auth.userId } });
  if (!goal) return fail('Goal not found', 404);
  const projection = Array.from({ length: 12 }, (_, index) => ({ month: index + 1, projectedValue: Math.round(goal.currentAmount + sipFutureValue(goal.monthlySIP, goal.expectedReturn, index + 1)) }));
  const sipHistory = projection.slice(0, 3).map((item) => ({ month: item.month, amount: goal.monthlySIP, status: 'mock-paid' }));
  return ok({ goal, projection, sipHistory });
}

