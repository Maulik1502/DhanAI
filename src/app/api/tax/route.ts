import { z } from 'zod';
import type { TaxRegime } from '@prisma/client';
import { db } from '@/lib/db';
import { compareTaxRegimes } from '@/lib/calculators';
import { fail, ok, requireUserId, validateJson } from '@/lib/api/responses';

const taxSchema = z.object({ regime: z.enum(['OLD', 'NEW']).optional(), grossIncome: z.number().nonnegative().optional(), deductions80C: z.number().nonnegative().optional(), deductions80D: z.number().nonnegative().optional(), npsAdditional: z.number().nonnegative().optional(), hraDeduction: z.number().nonnegative().optional(), homeLoanInterest: z.number().nonnegative().optional(), otherDeductions: z.number().nonnegative().optional() });

export async function GET() {
  const auth = await requireUserId();
  if ('error' in auth) return auth.error;
  const profile = await db.taxProfile.upsert({ where: { userId: auth.userId }, create: { userId: auth.userId, financialYear: '2025-26' }, update: {} });
  const comparison = compareTaxRegimes(profile.grossIncome, { section80C: profile.deductions80C, section80D: profile.deductions80D, npsAdditional: profile.npsAdditional, hra: profile.hraDeduction, homeLoanInterest: profile.homeLoanInterest });
  return ok({ profile, comparison });
}

export async function POST(request: Request) {
  const auth = await requireUserId();
  if ('error' in auth) return auth.error;
  try {
    const body = await validateJson(request, taxSchema);
    const grossIncome = body.grossIncome ?? 0;
    const deductions80C = body.deductions80C ?? 0;
    const deductions80D = body.deductions80D ?? 0;
    const npsAdditional = body.npsAdditional ?? 0;
    const hraDeduction = body.hraDeduction ?? 0;
    const homeLoanInterest = body.homeLoanInterest ?? 0;
    const otherDeductions = body.otherDeductions ?? 0;
    const comparison = compareTaxRegimes(grossIncome, { section80C: deductions80C, section80D: deductions80D, npsAdditional, hra: hraDeduction, homeLoanInterest });
    const regime: TaxRegime = (body.regime ?? comparison.recommended) as TaxRegime;
    const taxResult = regime === 'OLD' ? comparison.oldResult : comparison.newResult;
    const data = { regime, grossIncome, taxableIncome: taxResult.taxableIncome, taxLiability: taxResult.totalTax, deductions80C, deductions80D, npsAdditional, hraDeduction, homeLoanInterest, otherDeductions, taxSaved: comparison.savings, remainingLimit80C: Math.max(0, 150000 - deductions80C) };
    const profile = await db.taxProfile.upsert({ where: { userId: auth.userId }, create: { userId: auth.userId, ...data }, update: data });
    return ok({ profile, comparison }, 'Tax profile updated');
  } catch (error) { return fail(error, 400); }
}

export const PATCH = POST;

