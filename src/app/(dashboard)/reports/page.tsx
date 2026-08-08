import { FileText, Receipt, TrendingUp, Download, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const reportTypes = [
  {
    id: 'tax-statement',
    title: 'Annual Tax Statement (ITR-Ready)',
    description: 'Complete breakdown of 80C, 80D, EPF, ELSS investments and Old vs New regime tax calculations.',
    badge: 'FY 2025-26 Tax',
    icon: Receipt,
    color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  },
  {
    id: 'monthly-summary',
    title: 'Monthly Financial Health Summary',
    description: 'Income vs Expense ratio, EMI debt load, surplus breakdown, and financial health score trajectory.',
    badge: 'Monthly',
    icon: FileText,
    color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  },
  {
    id: 'portfolio-performance',
    title: 'Portfolio & XIRR Performance Report',
    description: 'Comprehensive XIRR returns across Mutual Funds, Stocks, FDs, and benchmark comparisons.',
    badge: 'Quarterly',
    icon: TrendingUp,
    color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  },
  {
    id: 'goal-progress',
    title: 'Financial Goals & SIP Audit',
    description: 'Track SIP completion percentage, projected completion timelines, and catch-up allocations.',
    badge: 'On-Demand',
    icon: ShieldCheck,
    color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
];

export default function ReportsPage() {
  return (
    <div className='space-y-6 pb-8'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight'>CA-Ready Reports & Analytics</h1>
          <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5'>
            <Sparkles className='h-3.5 w-3.5 text-blue-500' />
            Generate financial summaries, tax statements, and capital gains reports
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {reportTypes.map((report) => {
          const Icon = report.icon;
          return (
            <div
              key={report.id}
              className='glass-card p-6 border border-gray-200/80 dark:border-gray-800/80 shadow-xs flex flex-col justify-between space-y-4 group transition-all duration-200 hover:shadow-md hover:-translate-y-0.5'
            >
              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${report.color}`}>
                    <Icon className='h-5 w-5' />
                  </div>
                  <span className='rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-[10px] font-bold text-gray-600 dark:text-gray-300'>
                    {report.badge}
                  </span>
                </div>

                <h2 className='text-base font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
                  {report.title}
                </h2>
                <p className='text-xs text-gray-500 dark:text-gray-400 leading-relaxed'>{report.description}</p>
              </div>

              <div className='pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between'>
                <span className='text-[11px] text-gray-400 flex items-center gap-1'>
                  <CheckCircle2 className='h-3.5 w-3.5 text-emerald-500' /> Format: PDF & JSON
                </span>
                <button
                  onClick={() => alert(`Generating ${report.title}...`)}
                  className='inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-all'
                >
                  <Download className='h-3.5 w-3.5' />
                  <span>Generate Report</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


