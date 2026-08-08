import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { Header } from '@/components/shared/header';
import { Sidebar } from '@/components/shared/sidebar';
import { BottomNav } from '@/components/shared/bottom-nav';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col'>
      <Header userName={user.name || 'User'} userInitial={(user.name || 'U').charAt(0)} isAdmin={user.isAdmin} />
      <div className='w-full flex-1 flex gap-6 px-4 py-6 sm:px-6 lg:px-8 pb-20 lg:pb-6'>
        <Sidebar />
        <main className='min-w-0 flex-1 w-full'>{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}

