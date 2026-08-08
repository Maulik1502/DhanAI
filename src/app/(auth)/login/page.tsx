'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Bot,
  CheckCircle2,
  Lock,
  ArrowRight,
  Receipt,
  PiggyBank,
  Target,
} from 'lucide-react';

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      const isOnboarded = (session.user as any)?.onboarded;
      router.push(isOnboarded ? '/dashboard' : '/onboarding');
    }
  }, [session, router]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await signIn('google', { callbackUrl: '/dashboard' });
  };

  const handleDemoSignIn = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user');
      if (res.ok) {
        const userData = await res.json();
        if (userData?.onboarded) {
          router.push('/dashboard');
        } else {
          router.push('/onboarding');
        }
      } else {
        router.push('/onboarding');
      }
    } catch {
      router.push('/onboarding');
    }
  };

  return (
    <div className='min-h-screen lg:h-screen lg:overflow-hidden w-full bg-gradient-to-br from-slate-900 via-gray-950 to-blue-950 text-white flex flex-col justify-between relative overflow-y-auto lg:overflow-y-hidden'>
      {/* Decorative ambient background glows */}
      <div className='absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[120px] pointer-events-none' />
      <div className='absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-purple-600/15 blur-[120px] pointer-events-none' />

      {/* Top Header */}
      <header className='relative z-10 mx-auto w-full max-w-7xl flex items-center justify-between px-6 py-4 lg:py-4 shrink-0'>
        <div className='flex items-center gap-2.5'>
          <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-dhan-gradient text-white shadow-lg shadow-blue-500/25'>
            <Sparkles className='h-4 w-4' />
          </div>
          <span className='text-lg font-bold tracking-tight text-white'>DhanAI</span>
        </div>
        <div className='flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full backdrop-blur-md'>
          <ShieldCheck className='h-3.5 w-3.5' />
          <span>SEBI Aligned • FY 2025-26</span>
        </div>
      </header>

      {/* Main Content Body */}
      <main className='relative z-10 mx-auto w-full max-w-7xl px-6 py-2 lg:py-2 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center flex-1 my-auto'>
        {/* Left Side: Product Value Propositions */}
        <div className='lg:col-span-7 space-y-4 lg:space-y-5'>
          <div className='inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-400 backdrop-blur-md'>
            <Bot className='h-3.5 w-3.5 text-blue-400' />
            <span>AI-Powered Personal Finance Engine</span>
          </div>

          <h1 className='text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight leading-[1.15] text-white'>
            Manage every rupee intelligently, from <span className='bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent'>salary to corpus.</span>
          </h1>

          <p className='text-gray-300 text-xs sm:text-sm leading-relaxed max-w-2xl'>
            Stop guessing your investments. DhanAI automates your money priority order, calculates exact Old vs New tax savings, and builds long-term wealth—tailored for Indian salaried professionals & investors.
          </p>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1'>
            <div className='flex items-start gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm'>
              <div className='p-1.5 rounded-lg bg-blue-500/20 text-blue-400 shrink-0 mt-0.5'>
                <Receipt className='h-3.5 w-3.5' />
              </div>
              <div>
                <h3 className='text-xs font-bold text-white'>Tax Optimization</h3>
                <p className='text-[11px] text-gray-400 mt-0.5 leading-snug'>Live Old vs New regime calculator with 80C & 80D trackers.</p>
              </div>
            </div>

            <div className='flex items-start gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm'>
              <div className='p-1.5 rounded-lg bg-amber-500/20 text-amber-400 shrink-0 mt-0.5'>
                <ShieldCheck className='h-3.5 w-3.5' />
              </div>
              <div>
                <h3 className='text-xs font-bold text-white'>Emergency Baseline</h3>
                <p className='text-[11px] text-gray-400 mt-0.5 leading-snug'>6-month liquid fund buffer managed before equity investing.</p>
              </div>
            </div>

            <div className='flex items-start gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm'>
              <div className='p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5'>
                <Target className='h-3.5 w-3.5' />
              </div>
              <div>
                <h3 className='text-xs font-bold text-white'>Goal-Based SIPs</h3>
                <p className='text-[11px] text-gray-400 mt-0.5 leading-snug'>Exact monthly SIP calculation & recommended mutual funds.</p>
              </div>
            </div>

            <div className='flex items-start gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm'>
              <div className='p-1.5 rounded-lg bg-purple-500/20 text-purple-400 shrink-0 mt-0.5'>
                <PiggyBank className='h-3.5 w-3.5' />
              </div>
              <div>
                <h3 className='text-xs font-bold text-white'>Wealth Corpus</h3>
                <p className='text-[11px] text-gray-400 mt-0.5 leading-snug'>5/10/20-year compound wealth projections per risk profile.</p>
              </div>
            </div>
          </div>

          <div className='flex items-center gap-6 pt-1 text-[11px] text-gray-400 border-t border-white/10'>
            <div className='flex items-center gap-1.5'>
              <CheckCircle2 className='h-3.5 w-3.5 text-emerald-400' />
              <span>₹ INR Currency</span>
            </div>
            <div className='flex items-center gap-1.5'>
              <CheckCircle2 className='h-3.5 w-3.5 text-emerald-400' />
              <span>No Password Needed</span>
            </div>
            <div className='flex items-center gap-1.5'>
              <CheckCircle2 className='h-3.5 w-3.5 text-emerald-400' />
              <span>Instant Dashboard Setup</span>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form Card */}
        <div className='lg:col-span-5 w-full max-w-md mx-auto'>
          <div className='rounded-2xl lg:rounded-3xl bg-gray-900/85 border border-white/15 p-6 lg:p-6 shadow-2xl backdrop-blur-xl space-y-4 lg:space-y-5 relative'>
            <div className='space-y-1.5 text-center sm:text-left'>
              <span className='inline-block rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-blue-400 border border-blue-500/20'>
                Secure Auth Portal
              </span>
              <h2 className='text-xl lg:text-2xl font-extrabold text-white tracking-tight'>Get Started Free</h2>
              <p className='text-[11px] text-gray-400'>Access your full AI financial dashboard in seconds.</p>
            </div>

            <div className='space-y-2.5 pt-1'>
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className='w-full h-11 rounded-xl bg-white text-gray-900 font-semibold text-xs lg:text-sm flex items-center justify-center gap-2.5 hover:bg-gray-100 transition-all shadow-md shadow-white/10 disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]'
              >
                <svg className='h-4 w-4' viewBox='0 0 24 24'>
                  <path
                    fill='#4285F4'
                    d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                  />
                  <path
                    fill='#34A853'
                    d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                  />
                  <path
                    fill='#FBBC05'
                    d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z'
                  />
                  <path
                    fill='#EA4335'
                    d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z'
                  />
                </svg>
                <span>{loading ? 'Authenticating...' : 'Sign in with Google'}</span>
              </button>

              <div className='relative flex items-center justify-center py-1'>
                <div className='w-full border-t border-gray-800' />
                <span className='absolute bg-gray-900 px-2.5 text-[9px] font-semibold text-gray-500 uppercase tracking-widest'>OR</span>
              </div>

              <button
                onClick={handleDemoSignIn}
                disabled={loading}
                className='w-full h-10 rounded-xl bg-gray-800/80 border border-gray-700/80 text-gray-200 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-gray-800 hover:text-white transition-all'
              >
                <span>Preview Demo Account</span>
                <ArrowRight className='h-3.5 w-3.5 text-blue-400' />
              </button>
            </div>

            <div className='rounded-xl bg-blue-950/40 border border-blue-500/20 p-2.5 text-center text-[10px] text-blue-200 flex items-center justify-center gap-2'>
              <Lock className='h-3 w-3 text-blue-400 shrink-0' />
              <span>AES-256 encrypted OAuth2 authentication</span>
            </div>

            <p className='text-[10px] text-center text-gray-500 leading-tight'>
              DhanAI provides educational financial assistance. SEBI disclaimer applies.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className='relative z-10 border-t border-white/10 py-2.5 px-6 text-center text-xs text-gray-500 shrink-0'>
        <div className='mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-1'>
          <p>© 2026 DhanAI Platform. All rights reserved.</p>
          <p className='text-[10px] text-gray-500'>Educational information — Not SEBI-regulated investment advice.</p>
        </div>
      </footer>
    </div>
  );
}
