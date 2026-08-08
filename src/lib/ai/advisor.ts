import { compareTaxRegimes, formatINR, toMonthly } from '@/lib/calculators';
import { queryMultiAI } from '@/lib/ai/multi-provider';

type FinanceSnapshot = {
  incomes?: Array<{ amount: number; frequency: string }>;
  expenses?: Array<{ amount: number; frequency: string; isEMI?: boolean }>;
  goals?: Array<{ name: string; targetAmount: number; currentAmount: number; monthlySIP: number }>;
  user?: { name?: string | null; riskLevel?: string; occupation?: string | null } | null;
};

export const DHANAI_SYSTEM_PROMPT = `You are DhanAI, an India-first personal finance advisor. Follow this priority order: emergency fund, insurance, debt/EMI stability, tax optimisation, goals, investments, corpus. Be practical, rupee-denominated, and never promise guaranteed market returns.`;

export function summarizeFinances(snapshot: FinanceSnapshot) {
  const monthlyIncome = (snapshot.incomes ?? []).reduce((sum, item) => sum + toMonthly(item.amount, item.frequency), 0);
  const monthlyExpenses = (snapshot.expenses ?? []).reduce((sum, item) => sum + toMonthly(item.amount, item.frequency), 0);
  const emi = (snapshot.expenses ?? []).filter((item) => item.isEMI).reduce((sum, item) => sum + toMonthly(item.amount, item.frequency), 0);
  const surplus = monthlyIncome - monthlyExpenses;
  const savingsRate = monthlyIncome > 0 ? Math.round((surplus / monthlyIncome) * 100) : 0;

  return { monthlyIncome, monthlyExpenses, emi, surplus, savingsRate };
}

export function buildFinancialAdvice(snapshot: FinanceSnapshot) {
  const summary = summarizeFinances(snapshot);
  if (summary.monthlyIncome <= 0) {
    return 'Start by adding income and fixed expenses. Once your monthly cashflow is visible, DhanAI can prioritise emergency fund, insurance, tax and goal SIPs.';
  }

  const steps = [
    summary.surplus < 0
      ? `Your monthly cashflow is negative by ${formatINR(Math.abs(summary.surplus))}. Pause new investments and reduce variable spends first.`
      : `You have an estimated monthly surplus of ${formatINR(summary.surplus)} with a ${summary.savingsRate}% savings rate.`,
    summary.emi > summary.monthlyIncome * 0.35
      ? 'EMIs are above the safe 35% income band. Consider prepayment or restructuring before increasing market exposure.'
      : 'EMI load looks manageable against income.',
    'Build or maintain 6 months of essential expenses before aggressive investing.',
    'Review term and health insurance before goal-linked SIP allocation.',
  ];

  return steps.join(' ');
}

export function buildTaxSuggestion(grossIncome: number, deductions: Record<string, number>) {
  const comparison = compareTaxRegimes(grossIncome, {
    section80C: deductions.deductions80C,
    section80D: deductions.deductions80D,
    npsAdditional: deductions.npsAdditional,
    hra: deductions.hraDeduction,
    homeLoanInterest: deductions.homeLoanInterest,
  });

  return {
    comparison,
    suggestion: `Based on current inputs, the ${comparison.recommended} regime looks better by ${formatINR(comparison.savings)}. Recheck after adding HRA, 80C, 80D and NPS details.`,
  };
}

/**
 * Universal Multi-AI Query Dispatcher
 * Calls Gemini, ChatGPT, Claude, Local AI, or Offline Rule Engine depending on API availability and caching.
 */
export async function getAIAdvisorResponse(
  userQuery: string,
  snapshot: FinanceSnapshot,
  userId: string = 'default_user'
): Promise<{ response: string; providerUsed: string; cached: boolean }> {
  const contextSummary = summarizeFinances(snapshot);
  const prompt = `User Query: ${userQuery}\n\nFinancial Context: Monthly Income=${formatINR(contextSummary.monthlyIncome)}, Expenses=${formatINR(contextSummary.monthlyExpenses)}, Surplus=${formatINR(contextSummary.surplus)}, EMI Load=${formatINR(contextSummary.emi)}.`;

  return await queryMultiAI({
    prompt,
    systemPrompt: DHANAI_SYSTEM_PROMPT,
    userKey: userId,
  });
}
