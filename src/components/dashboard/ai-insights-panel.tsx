import { Sparkles, AlertTriangle, ShieldCheck, Target, TrendingUp, CheckCircle2 } from 'lucide-react';
import { formatINR, toMonthly } from '@/lib/calculators';

type AIInsightsPanelProps = {
  user: any;
  incomes: any[];
  expenses: any[];
  emergencyFund?: any;
  taxProfile?: any;
  goals?: any[];
};

export function AIInsightsPanel({ user, incomes, expenses, emergencyFund, taxProfile, goals }: AIInsightsPanelProps) {
  const monthlyIncome = incomes.reduce((sum, item) => sum + toMonthly(item.amount, item.frequency), 0);
  const monthlyExpenses = expenses.reduce((sum, item) => sum + toMonthly(item.amount, item.frequency), 0);
  const emiTotal = expenses.filter((e) => e.isEMI).reduce((sum, item) => sum + toMonthly(item.amount, item.frequency), 0);
  const surplus = monthlyIncome - monthlyExpenses;
  const emiRatio = monthlyIncome > 0 ? (emiTotal / monthlyIncome) * 100 : 0;
  const emergencyCurrent = emergencyFund?.currentAmount || 0;
  const emergencyTarget = emergencyFund?.targetAmount || monthlyExpenses * 6 || 100000;
  const emergencyCoveragePct = emergencyTarget > 0 ? Math.min(100, Math.round((emergencyCurrent / emergencyTarget) * 100)) : 0;

  // Build priority recommendations
  const insights = [];

  // Priority 1: Cashflow / Debt ratio
  if (surplus < 0) {
    insights.push({
      priority: 'CRITICAL',
      title: 'Monthly Cashflow Deficit Alert',
      description: `Outflows exceed income by ${formatINR(Math.abs(surplus))}/mo. Pause non-essential spends immediately to preserve liquidity.`,
      icon: AlertTriangle,
      color: 'rose',
    });
  } else if (emiRatio > 35) {
    insights.push({
      priority: 'HIGH',
      title: 'EMI Burden Exceeds Safe Band (35%)',
      description: `Your monthly EMIs consume ${Math.round(emiRatio)}% of income (${formatINR(emiTotal)}). Consider prepaying high-interest loans before equity investments.`,
      icon: AlertTriangle,
      color: 'amber',
    });
  } else {
    insights.push({
      priority: 'POSITIVE',
      title: 'Healthy Cashflow Surplus',
      description: `You have an estimated monthly surplus of ${formatINR(surplus)}. EMI load is at a safe ${Math.round(emiRatio)}% of income.`,
      icon: CheckCircle2,
      color: 'emerald',
    });
  }

  // Priority 2: Emergency Fund
  if (emergencyCoveragePct < 100) {
    insights.push({
      priority: 'HIGH',
      title: 'Emergency Fund Below 6-Month Baseline',
      description: `Liquid reserve is at ${emergencyCoveragePct}% of required ${formatINR(emergencyTarget)} target. Direct surplus to Liquid Mutual Funds first.`,
      icon: ShieldCheck,
      color: 'blue',
    });
  } else {
    insights.push({
      priority: 'POSITIVE',
      title: '6-Month Emergency Cushion Complete',
      description: `Your ${formatINR(emergencyCurrent)} liquid reserve covers full 6 months of essential living expenses.`,
      icon: CheckCircle2,
      color: 'emerald',
    });
  }

  // Priority 3: Tax Regime Recommendation
  const recommendedRegime = taxProfile?.regime || 'NEW';
  insights.push({
    priority: 'INFO',
    title: `Optimal Tax Strategy: FY 2025-26 ${recommendedRegime} Regime`,
    description: `Under current tax rules, the ${recommendedRegime} regime maximizes take-home pay. Ensure 80C (£1.5L) limit is utilized if using Old Regime.`,
    icon: Target,
    color: 'indigo',
  });

  return (
    <div className='glass-card p-6 border border-blue-200/80 dark:border-blue-900/60 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950/40 rounded-2xl shadow-sm space-y-4'>
      <div className='flex items-center justify-between pb-3 border-b border-blue-100 dark:border-gray-800'>
        <div className='flex items-center gap-2.5'>
          <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-dhan-gradient text-white shadow-md shadow-blue-500/20'>
            <Sparkles className='h-4 w-4' />
          </div>
          <div>
            <h2 className='font-extrabold text-gray-900 dark:text-white text-base tracking-tight'>
              DhanAI Autonomous Advisor Insights
            </h2>
            <p className='text-[11px] text-gray-500 dark:text-gray-400'>
              Auto-generated financial priorities based on real cashflow, debt ratio & tax limits
            </p>
          </div>
        </div>
        <span className='rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold px-2.5 py-1 flex items-center gap-1'>
          <span className='h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse' /> AUTO-UPDATED
        </span>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-3.5'>
        {insights.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all ${
                item.color === 'rose'
                  ? 'bg-rose-50/70 border-rose-200/80 dark:bg-rose-950/30 dark:border-rose-900/60'
                  : item.color === 'amber'
                  ? 'bg-amber-50/70 border-amber-200/80 dark:bg-amber-950/30 dark:border-amber-900/60'
                  : item.color === 'emerald'
                  ? 'bg-emerald-50/70 border-emerald-200/80 dark:bg-emerald-950/30 dark:border-emerald-900/60'
                  : 'bg-blue-50/70 border-blue-200/80 dark:bg-blue-950/30 dark:border-blue-900/60'
              }`}
            >
              <div className='flex items-center gap-2 mb-1.5'>
                <Icon
                  className={`h-4 w-4 ${
                    item.color === 'rose'
                      ? 'text-rose-600 dark:text-rose-400'
                      : item.color === 'amber'
                      ? 'text-amber-600 dark:text-amber-400'
                      : item.color === 'emerald'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-blue-600 dark:text-blue-400'
                  }`}
                />
                <h3 className='font-bold text-gray-900 dark:text-white text-xs tracking-tight'>{item.title}</h3>
              </div>
              <p className='text-xs text-gray-600 dark:text-gray-300 leading-relaxed'>{item.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
