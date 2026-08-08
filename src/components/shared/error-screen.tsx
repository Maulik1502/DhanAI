'use client';

import Link from 'next/link';
import { AlertTriangle, ArrowLeft, Home, RefreshCw } from 'lucide-react';

type ErrorScreenProps = {
  title: string;
  message: string;
  error?: Error & { digest?: string };
  onRetry?: () => void;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function ErrorScreen({
  title,
  message,
  error,
  onRetry,
  primaryHref = '/dashboard',
  primaryLabel = 'Go to dashboard',
  secondaryHref = '/login',
  secondaryLabel = 'Back to login',
}: ErrorScreenProps) {
  const showDetails = process.env.NODE_ENV !== 'production' && error;

  return (
    <main className='flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-12 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'>
      <div className='relative w-full max-w-2xl overflow-hidden rounded-3xl border bg-white/90 p-6 shadow-2xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 sm:p-8'>
        <div className='absolute inset-x-0 top-0 h-1 bg-dhan-gradient' />
        <div className='flex flex-col gap-6 sm:flex-row sm:items-start'>
          <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 ring-8 ring-red-100 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/10'>
            <AlertTriangle className='h-8 w-8' />
          </div>

          <div className='flex-1 space-y-4'>
            <div className='space-y-2'>
              <p className='text-sm font-semibold uppercase tracking-[0.24em] text-blue-600 dark:text-blue-400'>
                Something went wrong
              </p>
              <h1 className='text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl'>{title}</h1>
              <p className='max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300'>{message}</p>
            </div>

            {showDetails ? (
              <div className='rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200'>
                <p className='mb-2 font-semibold text-slate-900 dark:text-white'>Debug details</p>
                <p className='break-words font-mono text-xs leading-5'>{error?.message}</p>
                {error?.digest ? <p className='mt-2 text-xs text-slate-500'>Digest: {error.digest}</p> : null}
              </div>
            ) : null}

            <div className='flex flex-col gap-3 pt-2 sm:flex-row'>
              {onRetry ? (
                <button
                  onClick={onRetry}
                  className='inline-flex items-center justify-center gap-2 rounded-xl bg-dhan-gradient px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:opacity-95'
                >
                  <RefreshCw className='h-4 w-4' />
                  Try again
                </button>
              ) : null}

              <Link
                href={primaryHref}
                className='inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800'
              >
                <Home className='h-4 w-4' />
                {primaryLabel}
              </Link>

              <Link
                href={secondaryHref}
                className='inline-flex items-center justify-center gap-2 rounded-xl border border-transparent px-5 py-3 text-sm font-semibold text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              >
                <ArrowLeft className='h-4 w-4' />
                {secondaryLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
