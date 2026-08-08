import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { InteractiveOnboarding } from '@/components/onboarding/interactive-onboarding';

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  return (
    <div className='min-h-[calc(100vh-6rem)] w-full flex flex-col items-center justify-center py-4'>
      <InteractiveOnboarding user={user} />
    </div>
  );
}
