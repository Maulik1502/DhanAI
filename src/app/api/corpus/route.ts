import { db } from '@/lib/db';
import { calcCorpusProjections, CORPUS_RETURNS } from '@/lib/calculators';
import { fail, ok, readJson, requireUserId } from '@/lib/api/responses';

export async function GET() {
  const auth = await requireUserId();
  if ('error' in auth) return auth.error;
  const user = await db.user.findUnique({ where: { id: auth.userId }, select: { riskLevel: true } });
  const allocation = CORPUS_RETURNS[user?.riskLevel || 'MODERATE'];
  const corpus = await db.corpus.upsert({
    where: { userId: auth.userId },
    create: {
      userId: auth.userId,
      projections: JSON.stringify(calcCorpusProjections(0, 0, allocation.expectedReturn)),
      allocation: JSON.stringify(allocation),
      expectedReturn: allocation.expectedReturn,
    },
    update: {},
  });
  return ok({ corpus, allocation: JSON.parse(corpus.allocation), projections: JSON.parse(corpus.projections) });
}

export async function PATCH(request: Request) {
  const auth = await requireUserId();
  if ('error' in auth) return auth.error;

  try {
    const body = await readJson<Record<string, unknown>>(request);
    const expectedReturn = Number(body.expectedReturn || 11);
    const currentValue = Number(body.currentValue || 0);
    const monthlyInvestment = Number(body.monthlyInvestment || 0);
    const projections = calcCorpusProjections(monthlyInvestment, currentValue, expectedReturn);
    const corpus = await db.corpus.upsert({
      where: { userId: auth.userId },
      create: {
        userId: auth.userId,
        targetAmount: Number(body.targetAmount || 10000000),
        currentValue,
        monthlyInvestment,
        expectedReturn,
        timelineYears: Number(body.timelineYears || 20),
        projections: JSON.stringify(projections),
        allocation: JSON.stringify({ equity: 0.5, debt: 0.4, gold: 0.1, expectedReturn }),
      },
      update: {
        targetAmount: Number(body.targetAmount || 10000000),
        currentValue,
        monthlyInvestment,
        expectedReturn,
        timelineYears: Number(body.timelineYears || 20),
        projections: JSON.stringify(projections),
      },
    });
    return ok({ corpus, projections }, 'Corpus updated');
  } catch (error) {
    return fail(error);
  }
}


