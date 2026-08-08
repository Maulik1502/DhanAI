import type { RiskLevel } from '@/types';

export function sipFutureValue(monthly: number, annualPct: number, months: number): number {
  const r = annualPct / 100 / 12;
  if (r === 0) return monthly * months;
  return monthly * (((Math.pow(1 + r, months) - 1) / r) * (1 + r));
}

export function sipRequired(target: number, annualPct: number, months: number): number {
  const r = annualPct / 100 / 12;
  if (r === 0) return target / months;
  return target / (((Math.pow(1 + r, months) - 1) / r) * (1 + r));
}

export function lumpsumFV(principal: number, annualPct: number, years: number): number {
  return principal * Math.pow(1 + annualPct / 100, years);
}

export function getGoalInstrument(months: number, risk: RiskLevel) {
  if (months < 12)  return { instrument: 'Liquid Mutual Fund / RD', expectedReturn: 6.5 };
  if (months < 36)  return { instrument: 'Short Term Debt Mutual Fund', expectedReturn: 7.5 };
  if (months < 60)  return { instrument: 'Hybrid Mutual Fund', expectedReturn: 10 };
  if (months < 120) return { instrument: risk === 'AGGRESSIVE' ? 'Multi Cap Fund' : 'Large Cap Index Fund', expectedReturn: risk === 'AGGRESSIVE' ? 13 : 11 };
  return { instrument: risk === 'CONSERVATIVE' ? 'Large Cap Index Fund' : 'Mid Cap / ELSS Fund', expectedReturn: risk === 'CONSERVATIVE' ? 11 : 14 };
}

export function taxNewRegime(grossIncome: number) {
  const taxableIncome = Math.max(0, grossIncome - 75000);
  let tax = taxableIncome <= 700000 ? 0 : calcNewSlabs(taxableIncome);
  const surcharge = grossIncome > 20000000 ? tax * 0.25 : grossIncome > 10000000 ? tax * 0.15 : grossIncome > 5000000 ? tax * 0.10 : 0;
  const cess = (tax + surcharge) * 0.04;
  const totalTax = tax + surcharge + cess;
  return { taxableIncome, taxBeforeCess: tax, surcharge, cess, totalTax, effectiveRate: grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0, monthlyTax: totalTax / 12 };
}

function calcNewSlabs(income: number): number {
  let tax = 0;
  const slabs: [number, number][] = [[1500000,0.30],[1200000,0.20],[900000,0.15],[600000,0.10],[300000,0.05]];
  for (const [limit, rate] of slabs) { if (income > limit) { tax += (income - limit) * rate; income = limit; } }
  return tax;
}

export function taxOldRegime(grossIncome: number, deductions: { section80C?: number; section80D?: number; npsAdditional?: number; hra?: number; homeLoanInterest?: number }) {
  const totalDed = 50000 + Math.min(deductions.section80C || 0, 150000) + Math.min(deductions.section80D || 0, 50000) + Math.min(deductions.npsAdditional || 0, 50000) + (deductions.hra || 0) + Math.min(deductions.homeLoanInterest || 0, 200000);
  const taxableIncome = Math.max(0, grossIncome - totalDed);
  let tax = taxableIncome <= 500000 ? 0 : calcOldSlabs(taxableIncome);
  const surcharge = grossIncome > 20000000 ? tax * 0.25 : grossIncome > 10000000 ? tax * 0.15 : grossIncome > 5000000 ? tax * 0.10 : 0;
  const cess = (tax + surcharge) * 0.04;
  const totalTax = tax + surcharge + cess;
  return { taxableIncome, taxBeforeCess: tax, surcharge, cess, totalTax, effectiveRate: grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0, monthlyTax: totalTax / 12 };
}

function calcOldSlabs(income: number): number {
  let tax = 0;
  if (income > 1000000) { tax += (income - 1000000) * 0.30; income = 1000000; }
  if (income > 500000)  { tax += (income - 500000)  * 0.20; income = 500000; }
  if (income > 250000)  { tax += (income - 250000)  * 0.05; }
  return tax;
}

export function compareTaxRegimes(grossIncome: number, deductions: Parameters<typeof taxOldRegime>[1]) {
  const newR = taxNewRegime(grossIncome);
  const oldR = taxOldRegime(grossIncome, deductions);
  return { recommended: newR.totalTax <= oldR.totalTax ? 'NEW' : 'OLD', newTax: newR.totalTax, oldTax: oldR.totalTax, savings: Math.abs(newR.totalTax - oldR.totalTax), newResult: newR, oldResult: oldR };
}

export function calcEmergencyFund(monthlyExpenses: number, occupation = 'SALARY') {
  const months = ['FREELANCE', 'BUSINESS'].includes(occupation) ? 9 : 6;
  return { target: monthlyExpenses * months, minimum: monthlyExpenses * 3, months, monthlyAlloc: Math.ceil((monthlyExpenses * months) / 12) };
}

export function calcCorpusProjections(monthly: number, current: number, annualReturn: number) {
  const years = [5, 10, 15, 20, 30];
  const r: Record<number, number> = {};
  for (const yr of years) r[yr] = sipFutureValue(monthly, annualReturn, yr * 12) + lumpsumFV(current, annualReturn, yr);
  return r as { 5: number; 10: number; 15: number; 20: number; 30: number };
}

export const CORPUS_RETURNS: Record<RiskLevel, { equity: number; debt: number; gold: number; expectedReturn: number }> = {
  CONSERVATIVE: { equity: 0.30, debt: 0.60, gold: 0.10, expectedReturn: 9 },
  MODERATE:     { equity: 0.50, debt: 0.40, gold: 0.10, expectedReturn: 11 },
  AGGRESSIVE:   { equity: 0.70, debt: 0.20, gold: 0.10, expectedReturn: 13 },
};

export function toMonthly(amount: number, frequency: string): number {
  return frequency === 'QUARTERLY' ? amount / 3 : frequency === 'YEARLY' ? amount / 12 : frequency === 'ONE_TIME' ? 0 : amount;
}

export function formatINR(amount: number): string {
  if (Math.abs(amount) >= 10000000) return '₹' + (amount / 10000000).toFixed(2) + ' Cr';
  if (Math.abs(amount) >= 100000) return '₹' + (amount / 100000).toFixed(2) + ' L';
  if (Math.abs(amount) >= 1000) return '₹' + Math.round(amount).toLocaleString('en-IN');
  return '₹' + amount.toLocaleString('en-IN');
}

