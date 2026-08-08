import { z } from 'zod';
import { db } from '@/lib/db';
import { fail, ok, requireUserId, validateJson } from '@/lib/api/responses';

const typeSchema = z.enum(['MUTUAL_FUND', 'STOCK', 'FD', 'BOND', 'PPF', 'NPS', 'SGB', 'ELSS', 'RD', 'OTHER']);
const createSchema = z.object({ type: typeSchema.default('MUTUAL_FUND'), name: z.string().min(1), amount: z.number().nonnegative(), currentValue: z.number().nonnegative().optional(), units: z.number().nonnegative().optional(), buyPrice: z.number().nonnegative().optional(), schemeCode: z.string().optional(), symbol: z.string().optional(), startDate: z.string().optional(), maturityDate: z.string().optional(), goalId: z.string().optional(), isCorpus: z.boolean().default(false) });
const updateSchema = createSchema.partial().extend({ id: z.string().min(1) });
const deleteSchema = z.object({ id: z.string().min(1) });

export async function GET() {
  const auth = await requireUserId();
  if ('error' in auth) return auth.error;
  const investments = await db.investment.findMany({ where: { userId: auth.userId }, orderBy: { createdAt: 'desc' } });
  const totalValue = investments.reduce((sum, item) => sum + (item.currentValue ?? item.amount), 0);
  const grouped = investments.reduce<Record<string, typeof investments>>((acc, item) => { (acc[item.type] ||= []).push(item); return acc; }, {});
  const allocation = Object.fromEntries(Object.entries(grouped).map(([type, rows]) => [type, { value: rows.reduce((sum, item) => sum + (item.currentValue ?? item.amount), 0), percent: totalValue ? Math.round((rows.reduce((sum, item) => sum + (item.currentValue ?? item.amount), 0) / totalValue) * 100) : 0 }]));
  return ok({ investments, grouped, allocation, summary: { totalInvested: investments.reduce((sum, item) => sum + item.amount, 0), currentValue: totalValue } });
}

export async function POST(request: Request) {
  const auth = await requireUserId();
  if ('error' in auth) return auth.error;
  try {
    const body = await validateJson(request, createSchema);
    const investment = await db.investment.create({ data: { userId: auth.userId, type: body.type ?? 'MUTUAL_FUND', name: body.name, amount: body.amount, currentValue: body.currentValue, units: body.units, buyPrice: body.buyPrice, schemeCode: body.schemeCode, symbol: body.symbol, startDate: body.startDate ? new Date(body.startDate) : new Date(), maturityDate: body.maturityDate ? new Date(body.maturityDate) : undefined, goalId: body.goalId, isCorpus: body.isCorpus } });
    return ok(investment, 'Investment added', 201);
  } catch (error) { return fail(error, 400); }
}

export async function PATCH(request: Request) {
  const auth = await requireUserId();
  if ('error' in auth) return auth.error;
  try {
    const body = await validateJson(request, updateSchema);
    const updated = await db.investment.updateMany({ where: { id: body.id, userId: auth.userId }, data: { name: body.name, currentValue: body.currentValue, units: body.units, buyPrice: body.buyPrice, status: body.currentValue === 0 ? 'SOLD' : undefined } });
    if (!updated.count) return fail('Investment not found', 404);
    return ok({ id: body.id }, 'Investment updated');
  } catch (error) { return fail(error, 400); }
}

export async function DELETE(request: Request) {
  const auth = await requireUserId();
  if ('error' in auth) return auth.error;
  try {
    const body = await validateJson(request, deleteSchema);
    const updated = await db.investment.updateMany({ where: { id: body.id, userId: auth.userId }, data: { status: 'SOLD' } });
    if (!updated.count) return fail('Investment not found', 404);
    return ok({ id: body.id }, 'Investment marked sold');
  } catch (error) { return fail(error, 400); }
}

