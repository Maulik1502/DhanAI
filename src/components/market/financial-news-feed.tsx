'use client';

import { Newspaper, ExternalLink, TrendingUp, Sparkles, Filter, Globe } from 'lucide-react';

type NewsArticle = {
  id: string;
  title: string;
  summary: string;
  source: string;
  category: 'TAX' | 'MARKETS' | 'MUTUAL_FUNDS' | 'BANKING' | 'REGULATORY';
  timestamp: string;
  impact: 'HIGH' | 'MEDIUM' | 'INFO';
  url: string;
};

const fullNewsArticles: NewsArticle[] = [
  {
    id: 'n-1',
    title: 'RBI Monetary Policy: Repo Rate Kept Unchanged at 6.5% for 7th Consecutive Meeting',
    summary: 'The Reserve Bank of India governor announced no change in key interest rates. High-yield Bank FDs (7.5% - 8.1%) remain highly attractive for conservative investors.',
    source: 'Reserve Bank of India Press Release',
    category: 'BANKING',
    timestamp: 'Today, 11:30 AM',
    impact: 'HIGH',
    url: 'https://rbi.org.in',
  },
  {
    id: 'n-2',
    title: 'FY 2025-26 Tax Planning: New Tax Regime Threshold Reaches ₹7.75 Lakhs Exemption',
    summary: 'Salaried taxpayers under the New Tax Regime benefit from standard deduction of ₹75,000, bringing tax-free income threshold up to ₹7.75 Lakhs.',
    source: 'Ministry of Finance / CBDT',
    category: 'TAX',
    timestamp: 'Today, 09:15 AM',
    impact: 'HIGH',
    url: 'https://incometax.gov.in',
  },
  {
    id: 'n-3',
    title: 'SEBI Streamlines Mutual Fund Scheme Classification & Expense Ratio Caps',
    summary: 'SEBI issues new guidelines to ensure lower total expense ratios (TER) for direct mutual fund schemes, boosting investor net XIRR returns by 0.35% annually.',
    source: 'SEBI Circular',
    category: 'MUTUAL_FUNDS',
    timestamp: 'Yesterday, 04:45 PM',
    impact: 'MEDIUM',
    url: 'https://sebi.gov.in',
  },
  {
    id: 'n-4',
    title: 'Sovereign Gold Bonds (SGB) 2025 Series Yielding 2.5% Annual Fixed Interest Plus Capital Gains Exemption',
    summary: 'RBI announces new tranche of SGBs. Investors holding SGBs to maturity enjoy 100% tax-free capital gains upon redemption.',
    source: 'RBI Financial Markets',
    category: 'REGULATORY',
    timestamp: 'Yesterday, 02:00 PM',
    impact: 'INFO',
    url: 'https://rbi.org.in',
  },
  {
    id: 'n-5',
    title: 'Nifty 50 & Sensex Cross Milestones Driven by Domestic SIP Inflows of ₹21,200 Crore / Month',
    summary: 'Indian retail investor participation in monthly SIPs touches record highs, driving strong fundamentals across Nifty 50 Flexicap and Midcap benchmarks.',
    source: 'AMFI India Monthly Report',
    category: 'MARKETS',
    timestamp: '2 days ago',
    impact: 'INFO',
    url: 'https://amfiindia.com',
  },
];

export function FinancialNewsFeed() {
  return (
    <div className='glass-card p-6 border border-gray-200/80 dark:border-gray-800/80 shadow-xs space-y-6 rounded-2xl'>
      <div className='flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800'>
        <div className='flex items-center gap-2.5'>
          <div className='p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400'>
            <Newspaper className='h-5 w-5' />
          </div>
          <div>
            <h2 className='font-bold text-gray-900 dark:text-white text-lg tracking-tight'>
              Live Financial Market & Regulatory News
            </h2>
            <p className='text-xs text-gray-500 dark:text-gray-400'>
              Real-time updates from RBI, SEBI, CBDT, AMFI, and major financial publications
            </p>
          </div>
        </div>
      </div>

      <div className='space-y-4'>
        {fullNewsArticles.map((article) => (
          <div
            key={article.id}
            className='p-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/70 dark:bg-gray-800/40 hover:border-blue-200 dark:hover:border-blue-900/50 transition-all space-y-2'
          >
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <span className='rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-extrabold px-2.5 py-0.5 uppercase'>
                  {article.category}
                </span>
                {article.impact === 'HIGH' && (
                  <span className='rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[10px] font-bold px-2 py-0.5'>
                    HIGH IMPACT
                  </span>
                )}
              </div>
              <span className='text-xs text-gray-400 font-mono'>{article.timestamp}</span>
            </div>

            <h3 className='font-bold text-gray-900 dark:text-white text-base leading-snug'>{article.title}</h3>
            <p className='text-xs text-gray-600 dark:text-gray-300 leading-relaxed'>{article.summary}</p>

            <div className='pt-2 flex items-center justify-between text-xs border-t border-gray-100 dark:border-gray-800/60'>
              <span className='text-gray-400 italic'>Source: {article.source}</span>
              <a
                href={article.url}
                target='_blank'
                rel='noreferrer'
                className='text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1'
              >
                <span>Read Circular</span> <ExternalLink className='h-3 w-3' />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
