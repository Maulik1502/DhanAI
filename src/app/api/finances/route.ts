import { z } from 'zod';
import { db } from '@/lib/db';
import { fail, ok, requireUserId, validateJson } from '@/lib/api/responses';
import { toMonthly } from '@/lib/calculators';

const frequency = z.enum(['MONTHLY', 'QUARTERLY', 'YEARLY', 'ONE_TIME']);
const incomeType = z.enum(['SALARY', 'FREELANCE', 'BUSINESS', 'RENTAL', 'CAPITAL_GAINS', 'DIVIDEND', 'OTHER']);
const expenseCategory = z.enum(['RENT', 'FOOD', 'TRANSPORT', 'EMI_HOME', 'EMI_CAR', 'EMI_PERSONAL', 'EMI_EDUCATION', 'INSURANCE', 'SUBSCRIPTION', 'EDUCATION', 'MEDICAL', 'UTILITIES', 'OTHER']);
const incomeSchema = z.object({ kind: z.literal('income'), type: incomeType.optional(), name: z.string().min(1), amount: z.number().nonnegative(), frequency: frequency.optional(), note: z.string().optional() });
const expenseSchema = z.object({ kind: z.literal('expense'), category: expenseCategory.optional(), name: z.string().min(1), amount: z.number().nonnegative(), frequency: frequency.optional(), isEMI: z.boolean().optional(), emiMonthsLeft: z.number().int().nonnegative().optional(), loanType: z.string().optional(), bankName: z.string().optional(), note: z.string().optional() });
const createSchema = z.discriminatedUnion('kind', [incomeSchema, expenseSchema]);
const updateIncomeSchema = incomeSchema.partial().extend({ kind: z.literal('income'), id: z.string().min(1) });
const updateExpenseSchema = expenseSchema.partial().extend({ kind: z.literal('expense'), id: z.string().min(1) });
const updateSchema = z.discriminatedUnion('kind', [updateIncomeSchema, updateExpenseSchema]);
const deleteSchema = z.object({ kind: z.enum(['income', 'expense']), id: z.string().min(1) });

export async function GET() {
  const auth = await requireUserId();
  if ('error' in auth) return auth.error;
  const [incomes, expenses] = await Promise.all([
    db.income.findMany({ where: { userId: auth.userId, isActive: true }, orderBy: { createdAt: 'desc' } }),
    db.expense.findMany({ where: { userId: auth.userId, isActive: true }, orderBy: { createdAt: 'desc' } }),
  ]);
  const monthlyIncome = incomes.reduce((sum, item) => sum + toMonthly(item.amount, item.frequency), 0);
  const monthlyExpenses = expenses.reduce((sum, item) => sum + toMonthly(item.amount, item.frequency), 0);
  const monthlyEmi = expenses.filter((item) => item.isEMI).reduce((sum, item) => sum + toMonthly(item.amount, item.frequency), 0);
  return ok({ incomes, expenses, summary: { monthlyIncome, monthlyExpenses, monthlyEmi, surplus: monthlyIncome - monthlyExpenses } });
}

export async function POST(request: Request) {
  const auth = await requireUserId();
  if ('error' in auth) return auth.error;
  try {
    const body = await validateJson(request, createSchema);
    if (body.kind === 'income') {
      return ok(await db.income.create({ data: { userId: auth.userId, type: body.type ?? 'SALARY', name: body.name, amount: body.amount, frequency: body.frequency ?? 'MONTHLY', note: body.note } }), 'Income added', 201);
    }
    return ok(await db.expense.create({ data: { userId: auth.userId, category: body.category ?? 'OTHER', name: body.name, amount: body.amount, frequency: body.frequency ?? 'MONTHLY', isEMI: body.isEMI ?? false, emiMonthsLeft: body.emiMonthsLeft, loanType: body.loanType, bankName: body.bankName, note: body.note } }), 'Expense added', 201);
  } catch (error) { return fail(error, 400); }
}

export async function PATCH(request: Request) {
  const auth = await requireUserId();
  if ('error' in auth) return auth.error;
  try {
    const body = await validateJson(request, updateSchema);
    if (body.kind === 'income') {
      const updated = await db.income.updateMany({ where: { id: body.id, userId: auth.userId }, data: { type: body.type, name: body.name, amount: body.amount, frequency: body.frequency, note: body.note } });
      if (!updated.count) return fail('Income not found', 404);
      return ok({ id: body.id }, 'Income updated');
    }
    const updated = await db.expense.updateMany({ where: { id: body.id, userId: auth.userId }, data: { category: body.category, name: body.name, amount: body.amount, frequency: body.frequency, isEMI: body.isEMI, emiMonthsLeft: body.emiMonthsLeft, loanType: body.loanType, bankName: body.bankName, note: body.note } });
    if (!updated.count) return fail('Expense not found', 404);
    return ok({ id: body.id }, 'Expense updated');
  } catch (error) { return fail(error, 400); }
}

export async function DELETE(request: Request) {
  const auth = await requireUserId();
  if ('error' in auth) return auth.error;
  try {
    const body = await validateJson(request, deleteSchema);
    const updated = body.kind === 'income'
      ? await db.income.updateMany({ where: { id: body.id, userId: auth.userId }, data: { isActive: false } })
      : await db.expense.updateMany({ where: { id: body.id, userId: auth.userId }, data: { isActive: false } });
    if (!updated.count) return fail(`${body.kind} not found`, 404);
    return ok({ id: body.id }, `${body.kind} deleted`);
  } catch (error) { return fail(error, 400); }
}
