import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { FullWealthManager } from '@/components/wealth/full-wealth-manager';

export default async function WealthPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  return (
    <div className='space-y-6 pb-8'>
      <FullWealthManager />
    </div>
  );
}
