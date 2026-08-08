'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Zap,
  Landmark,
  Rocket,
  ShieldAlert,
  FileText,
  Lock,
  Check,
  Layers,
  BarChart3,
  Bot,
} from 'lucide-react';

const steps = [
  { step: 1, name: 'Product Tour', desc: 'DhanAI Core Engine', icon: Sparkles },
  { step: 2, name: 'Basic Info', desc: 'Investor Profile', icon: User },
  { step: 3, name: 'SEBI & Terms', desc: 'Compliance & Agreement', icon: ShieldCheck },
  { step: 4, name: 'Launch Portal', desc: 'Enter Dashboard', icon: Rocket },
];

export function InteractiveOnboarding({ user }: { user: any }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 2 Form State
  const [name, setName] = useState(user.name || 'Investor');
  const [dateOfBirth, setDateOfBirth] = useState(
    user.dateOfBirth
      ? new Date(user.dateOfBirth).toISOString().split('T')[0]
      : '1998-05-15'
  );
  const [occupation, setOccupation] = useState(user.occupation || 'Software Engineer');
  const [riskLevel, setRiskLevel] = useState(user.riskLevel || 'MODERATE');

  // Step 3 Compliance Checkboxes
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [acknowledgedSebi, setAcknowledgedSebi] = useState(false);

  const handleFinishOnboarding = async () => {
    if (!agreedTerms || !acknowledgedSebi) return;

    setLoading(true);
    try {
      await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || undefined,
          dateOfBirth,
          occupation: occupation.trim() || 'Professional',
          riskLevel,
          onboarded: true,
        }),
      });

      router.push('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full max-w-4xl mx-auto my-auto py-6 animate-in fade-in zoom-in-95 duration-300'>
      <div className='glass-card p-6 sm:p-10 border border-blue-200/80 dark:border-blue-900/60 bg-white/95 dark:bg-gray-900/95 shadow-2xl rounded-3xl backdrop-blur-xl space-y-8 relative overflow-hidden'>
        {/* Top Decorative Background Glows */}
        <div className='absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none' />
        <div className='absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none' />

        {/* Header Title */}
        <div className='text-center space-y-2 relative z-10'>
          <div className='inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/80 dark:to-purple-950/80 border border-blue-200/80 dark:border-blue-800/80 px-4 py-1.5 text-xs font-extrabold text-blue-700 dark:text-blue-300 shadow-xs'>
            <Sparkles className='h-3.5 w-3.5 text-blue-500 animate-pulse' />
            <span>DHANAI ONBOARDING PORTAL</span>
          </div>
          <h1 className='text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight'>
            Welcome to DhanAI
          </h1>
          <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-lg mx-auto'>
            Follow the guided steps below to configure your investor parameters and review regulatory compliance.
          </p>
        </div>

        {/* Stepper Navigation Pills */}
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10'>
          {steps.map((item) => {
            const Icon = item.icon;
            const isActive = currentStep === item.step;
            const isDone = currentStep > item.step;
            return (
              <div
                key={item.step}
                onClick={() => {
                  if (item.step < currentStep || isDone) {
                    setCurrentStep(item.step);
                  }
                }}
                className={`p-3.5 rounded-2xl border transition-all text-center ${
                  isActive
                    ? 'border-blue-500 bg-blue-500/10 shadow-md ring-2 ring-blue-500/20'
                    : isDone
                    ? 'border-emerald-300 dark:border-emerald-900 bg-emerald-50/60 dark:bg-emerald-950/30'
                    : 'border-gray-200/60 dark:border-gray-800 bg-gray-50/40 dark:bg-gray-800/20'
                }`}
              >
                <div className='flex items-center justify-center gap-1.5 text-xs font-extrabold mb-1'>
                  <span className={isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}>
                    Step {item.step}
                  </span>
                  <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600' : isDone ? 'text-emerald-500' : 'text-gray-400'}`} />
                </div>
                <h3 className='font-bold text-gray-900 dark:text-white text-xs'>{item.name}</h3>
                <p className='text-[10px] text-gray-400 hidden sm:block'>{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Step 1: Product Overview & Capabilities */}
        {currentStep === 1 && (
          <div className='space-y-6 animate-in fade-in duration-200 relative z-10'>
            <div className='text-center space-y-1'>
              <h2 className='font-extrabold text-gray-900 dark:text-white text-xl'>
                Core Product Capabilities
              </h2>
              <p className='text-xs text-gray-500'>Discover how DhanAI automates your personal finances</p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='p-5 rounded-2xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/40 dark:bg-blue-950/20 space-y-2.5 hover:border-blue-300 transition-all'>
                <div className='p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 w-fit'>
                  <Zap className='h-5 w-5' />
                </div>
                <h3 className='font-bold text-gray-900 dark:text-white text-sm'>Autonomous Money Engine</h3>
                <p className='text-xs text-gray-600 dark:text-gray-300 leading-relaxed'>
                  Auto-calculates monthly cashflow surplus, 6-month liquid emergency reserves, and FY 2025-26 tax regime optimizations.
                </p>
              </div>

              <div className='p-5 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-2.5 hover:border-emerald-300 transition-all'>
                <div className='p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 w-fit'>
                  <Landmark className='h-5 w-5' />
                </div>
                <h3 className='font-bold text-gray-900 dark:text-white text-sm'>Multi-Account Networth Wallet</h3>
                <p className='text-xs text-gray-600 dark:text-gray-300 leading-relaxed'>
                  Tracks total net wealth across pocket cash, HDFC/SBI savings accounts, FDs, mutual funds, and credit cards.
                </p>
              </div>

              <div className='p-5 rounded-2xl border border-purple-100 dark:border-purple-900/40 bg-purple-50/40 dark:bg-purple-950/20 space-y-2.5 hover:border-purple-300 transition-all'>
                <div className='p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 w-fit'>
                  <TrendingUp className='h-5 w-5' />
                </div>
                <h3 className='font-bold text-gray-900 dark:text-white text-sm'>Reverse Goal SIP Engine</h3>
                <p className='text-xs text-gray-600 dark:text-gray-300 leading-relaxed'>
                  Computes exact monthly SIP requirements to hit your long-term ₹1 Crore+ retirement and housing targets.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Investor Profile Form */}
        {currentStep === 2 && (
          <div className='space-y-5 max-w-lg mx-auto animate-in fade-in duration-200 relative z-10'>
            <div className='text-center space-y-1'>
              <h2 className='font-extrabold text-gray-900 dark:text-white text-xl'>
                Investor Profile Setup
              </h2>
              <p className='text-xs text-gray-500'>Provide your basic details to personalize calculations</p>
            </div>

            <div className='space-y-4'>
              <div>
                <label className='block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1'>
                  Investor Name *
                </label>
                <input
                  type='text'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder='e.g., Alex Sharma'
                  className='w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none'
                  required
                />
              </div>

              <div className='grid grid-cols-2 gap-3'>
                <div>
                  <label className='block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1'>Date of Birth *</label>
                  <input
                    type='date'
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className='w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3.5 py-2 text-xs font-bold text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none'
                    required
                  />
                </div>

                <div>
                  <label className='block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1'>Occupation</label>
                  <input
                    type='text'
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    placeholder='Software Engineer'
                    className='w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none'
                  />
                </div>
              </div>

              <div>
                <label className='block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1'>
                  Risk Tolerance Profile
                </label>
                <select
                  value={riskLevel}
                  onChange={(e) => setRiskLevel(e.target.value)}
                  className='w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2.5 text-xs font-bold text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none'
                >
                  <option value='CONSERVATIVE'>Conservative (Focus on capital protection & FDs/Gold)</option>
                  <option value='MODERATE'>Moderate (Balanced Flexi-Cap & Debt Allocation)</option>
                  <option value='AGGRESSIVE'>Aggressive (High-Equity SIPs & Wealth Creation)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: SEBI Guidelines & Terms Agreement */}
        {currentStep === 3 && (
          <div className='space-y-5 max-w-2xl mx-auto animate-in fade-in duration-200 relative z-10'>
            <div className='text-center space-y-1'>
              <h2 className='font-extrabold text-gray-900 dark:text-white text-xl'>
                Terms & SEBI Educational Disclaimer
              </h2>
              <p className='text-xs text-gray-500'>Please review regulatory guidelines before accessing your workspace</p>
            </div>

            {/* SEBI Disclaimer Callout Box */}
            <div className='p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-2 text-xs'>
              <div className='flex items-center gap-2 text-amber-700 dark:text-amber-300 font-extrabold'>
                <ShieldAlert className='h-4 w-4' />
                <span>SEBI Educational Disclaimer & Notice</span>
              </div>
              <p className='text-gray-700 dark:text-gray-300 leading-relaxed text-[11px]'>
                DhanAI is an AI-driven personal financial engine developed for cashflow planning, tax estimation, and educational tracking. 
                DhanAI does not act as a SEBI-registered Investment Advisor (RIA) or Portfolio Manager (PMS), and does not guarantee market returns.
              </p>
            </div>

            {/* Terms Box */}
            <div className='p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-xs space-y-2 max-h-40 overflow-y-auto'>
              <h4 className='font-bold text-gray-900 dark:text-white'>Terms of Service & Privacy Policy</h4>
              <p className='text-gray-600 dark:text-gray-300 text-[11px] leading-relaxed'>
                By accessing DhanAI, you agree that all financial figures, tax estimates (FY 2025-26), and reverse goal projections are calculated based on user inputs. Data is encrypted using 256-bit standards.
              </p>
            </div>

            {/* Mandatory Checkboxes */}
            <div className='space-y-3 pt-2 text-xs'>
              <label className='flex items-start gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer hover:border-blue-400 transition-all'>
                <input
                  type='checkbox'
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5'
                />
                <span className='font-medium text-gray-800 dark:text-gray-200'>
                  I agree to the <strong>DhanAI Terms of Service and Privacy Policy</strong>.
                </span>
              </label>

              <label className='flex items-start gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer hover:border-blue-400 transition-all'>
                <input
                  type='checkbox'
                  checked={acknowledgedSebi}
                  onChange={(e) => setAcknowledgedSebi(e.target.checked)}
                  className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5'
                />
                <span className='font-medium text-gray-800 dark:text-gray-200'>
                  I acknowledge the <strong>SEBI Educational Disclaimer</strong> and understand that recommendations are automated algorithms.
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Step 4: Final Launch Portal */}
        {currentStep === 4 && (
          <div className='space-y-5 text-center max-w-md mx-auto py-4 animate-in fade-in duration-200 relative z-10'>
            <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 ring-4 ring-emerald-500/20'>
              <CheckCircle2 className='h-8 w-8' />
            </div>

            <div>
              <h2 className='font-extrabold text-gray-900 dark:text-white text-2xl tracking-tight'>
                Profile & Agreements Completed!
              </h2>
              <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                Your workspace is configured with 256-bit encryption. Click below to launch your Dashboard.
              </p>
            </div>

            <div className='p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-xs text-left space-y-1.5'>
              <div className='flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold'>
                <Check className='h-4 w-4' /> Basic Investor Profile Saved
              </div>
              <div className='flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold'>
                <Check className='h-4 w-4' /> SEBI & Terms Checklist Accepted
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className='pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between relative z-10'>
          <button
            onClick={() => setCurrentStep((p) => Math.max(1, p - 1))}
            disabled={currentStep === 1 || loading}
            className='inline-flex items-center gap-1.5 rounded-xl border border-gray-200 dark:border-gray-800 px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 transition-all'
          >
            <ArrowLeft className='h-3.5 w-3.5' />
            <span>Previous Step</span>
          </button>

          {currentStep < 4 ? (
            <button
              onClick={() => {
                if (currentStep === 2 && !name.trim()) return;
                if (currentStep === 3 && (!agreedTerms || !acknowledgedSebi)) return;
                setCurrentStep((p) => Math.min(4, p + 1));
              }}
              disabled={
                (currentStep === 2 && !name.trim()) ||
                (currentStep === 3 && (!agreedTerms || !acknowledgedSebi))
              }
              className='inline-flex items-center gap-2 rounded-xl bg-dhan-gradient px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:opacity-95 disabled:opacity-40 transition-all'
            >
              <span>Continue</span>
              <ArrowRight className='h-4 w-4' />
            </button>
          ) : (
            <button
              onClick={handleFinishOnboarding}
              disabled={loading || !agreedTerms || !acknowledgedSebi}
              className='inline-flex items-center gap-2 rounded-xl bg-emerald-600 text-white px-8 py-3 text-xs font-extrabold shadow-lg shadow-emerald-500/25 hover:bg-emerald-500 disabled:opacity-50 transition-all'
            >
              {loading ? (
                <>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  <span>Launching Workspace...</span>
                </>
              ) : (
                <>
                  <Rocket className='h-4 w-4' />
                  <span>Launch DhanAI Workspace</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
