import { db } from '@/lib/db';
import { fail, ok, readJson, requireUserId } from '@/lib/api/responses';
import type { OnboardingData } from '@/types';

export async function POST(request: Request) {
  const auth = await requireUserId();
  if ('error' in auth) return auth.error;

  try {
    const body = (await readJson<OnboardingData>(request));
    await db.user.update({
      where: { id: auth.userId },
      data: {
        occupation: body.basicInfo.occupation,
        age: body.basicInfo.age,
        dependents: body.basicInfo.dependents,
        riskLevel: body.riskTax.riskLevel,
        taxRegime: body.riskTax.taxRegime,
        onboarded: true,
      },
    });

    await db.income.create({
      data: {
        userId: auth.userId,
        type: body.income.type ?? 'SALARY',
        name: body.income.name ?? 'Primary income',
        amount: body.income.amount,
        frequency: 'MONTHLY',
      },
    });

    if (body.expenses.length > 0) {
      await db.expense.createMany({
        data: body.expenses.map((expense) => ({
          userId: auth.userId,
          category: expense.category,
          name: expense.name,
          amount: expense.amount,
          frequency: 'MONTHLY',
          isEMI: expense.isEMI ?? false,
        })),
      });
    }

    if (body.investments?.length) {
      await db.investment.createMany({
        data: body.investments.map((investment) => ({
          userId: auth.userId,
          type: investment.type,
          name: investment.name,
          amount: investment.amount,
          startDate: new Date(),
        })),
      });
    }

    return ok({ onboarded: true }, 'Onboarding complete');
  } catch (error) {
    return fail(error);
  }
}
