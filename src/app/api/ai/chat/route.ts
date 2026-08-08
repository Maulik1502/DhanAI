import { db } from '@/lib/db';
import { getAIAdvisorResponse } from '@/lib/ai/advisor';
import { fail, ok, readJson, requireUserId } from '@/lib/api/responses';

export async function GET() {
  const auth = await requireUserId();
  if ('error' in auth) return auth.error;
  const messages = await db.chatMessage.findMany({ where: { userId: auth.userId }, orderBy: { createdAt: 'asc' }, take: 50 });
  return ok(messages);
}

export async function POST(request: Request) {
  const auth = await requireUserId();
  if ('error' in auth) return auth.error;

  try {
    const body = await readJson<{ message?: string }>(request);
    const message = body.message || 'Review my finances';
    const [user, incomes, expenses, goals] = await Promise.all([
      db.user.findUnique({ where: { id: auth.userId } }),
      db.income.findMany({ where: { userId: auth.userId, isActive: true } }),
      db.expense.findMany({ where: { userId: auth.userId, isActive: true } }),
      db.goal.findMany({ where: { userId: auth.userId, status: 'ACTIVE' } }),
    ]);

    await db.chatMessage.create({ data: { userId: auth.userId, role: 'user', content: message } });
    
    const { response: reply, providerUsed, cached } = await getAIAdvisorResponse(message, { user, incomes, expenses, goals }, auth.userId);

    const assistant = await db.chatMessage.create({ data: { userId: auth.userId, role: 'assistant', content: reply } });
    return ok({ ...assistant, providerUsed, cached });
  } catch (error) {
    return fail(error);
  }
}
