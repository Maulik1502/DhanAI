'use client';

import { ErrorScreen } from '@/components/shared/error-screen';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang='en'>
      <body>
        <ErrorScreen
          title='DhanAI ran into an error'
          message='The app could not complete this request. Please try again, or go back to the login page and reopen the app.'
          error={error}
          onRetry={reset}
          primaryHref='/dashboard'
          primaryLabel='Go to dashboard'
          secondaryHref='/login'
          secondaryLabel='Back to login'
        />
      </body>
    </html>
  );
}
