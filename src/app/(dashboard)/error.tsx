'use client';

import { ErrorScreen } from '@/components/shared/error-screen';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorScreen
      title='Dashboard is temporarily unavailable'
      message='We hit a problem while loading your finances. Try again in a moment, or head back to the dashboard home.'
      error={error}
      onRetry={reset}
      primaryHref='/dashboard'
      primaryLabel='Dashboard home'
      secondaryHref='/login'
      secondaryLabel='Sign in again'
    />
  );
}
