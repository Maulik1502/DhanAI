export type RiskLevel = 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE';
export type TaxRegime = 'OLD' | 'NEW';
export type UserPlan = 'FREE' | 'PRO' | 'ELITE';
export type Frequency = 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'ONE_TIME';
export type GoalStatus = 'ACTIVE' | 'COMPLETED' | 'PAUSED' | 'CANCELLED';
export type InvestmentType = 'MUTUAL_FUND' | 'STOCK' | 'FD' | 'BOND' | 'PPF' | 'NPS' | 'SGB' | 'ELSS' | 'RD' | 'OTHER';
export type InvestmentStatus = 'ACTIVE' | 'MATURED' | 'SOLD';
export type FundStatus = 'BUILDING' | 'COMPLETE' | 'USED';
export type InsuranceType = 'TERM' | 'HEALTH' | 'MOTOR' | 'HOME' | 'LOAN_PROTECTION' | 'CRITICAL_ILLNESS';
export type InsurancePriority = 'CRITICAL' | 'RECOMMENDED' | 'OPTIONAL';
export type InsuranceStatus = 'SUGGESTED' | 'ACTIVE' | 'LAPSED';
export type IncomeType = 'SALARY' | 'FREELANCE' | 'BUSINESS' | 'RENTAL' | 'CAPITAL_GAINS' | 'DIVIDEND' | 'OTHER';
export type ExpenseCategory = 'RENT' | 'FOOD' | 'TRANSPORT' | 'EMI_HOME' | 'EMI_CAR' | 'EMI_PERSONAL' | 'EMI_EDUCATION' | 'INSURANCE' | 'SUBSCRIPTION' | 'EDUCATION' | 'MEDICAL' | 'UTILITIES' | 'OTHER';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface TaxCalculationResult {
  taxableIncome: number;
  taxBeforeCess: number;
  surcharge: number;
  cess: number;
  totalTax: number;
  effectiveRate: number;
  monthlyTax: number;
}

export interface HealthScore {
  score: number;
  grade: 'Excellent' | 'Good' | 'Average' | 'Needs Attention' | 'Critical';
  breakdown: Record<string, number>;
}

export interface GoalAISuggestion {
  monthlySIP: number;
  instrument: string;
  schemeName: string;
  schemeCode?: string;
  expectedReturn: number;
  isAffordable: boolean;
  adjustedMonths?: number;
  adjustedSIP?: number;
  riskFactors: string[];
  aiNote: string;
}

export interface OnboardingData {
  basicInfo: {
    age: number;
    occupation: string;
    dependents: number;
  };
  income: {
    amount: number;
    type?: IncomeType;
    name?: string;
  };
  expenses: Array<{
    name: string;
    amount: number;
    category: ExpenseCategory;
    isEMI?: boolean;
  }>;
  riskTax: {
    riskLevel: RiskLevel;
    taxRegime: TaxRegime;
  };
  investments?: Array<{
    name: string;
    type: InvestmentType;
    amount: number;
  }>;
}

export interface CorpusProjections {
  5: number;
  10: number;
  15: number;
  20: number;
  30: number;
}

export interface MarketDataRow {
  type: string;
  code: string;
  name: string;
  data: string;
}
