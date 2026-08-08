import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { isAdminEmail } from '@/lib/config/admin';
import { Users, Search, ShieldCheck, UserCheck } from 'lucide-react';

export default async function AdminUsersPage() {
  const user = await getCurrentUser();
  if (!user || !user.isAdmin) {
    redirect('/dashboard');
  }

  const users = await db.user
    .findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        plan: true,
        riskLevel: true,
        onboarded: true,
        createdAt: true,
      },
    })
    .catch(() => [
      { id: '1', name: 'Demo Investor', email: 'demo@dhanai.com', plan: 'PRO', role: 'ADMIN', riskLevel: 'MODERATE', onboarded: true, createdAt: new Date() },
      { id: '2', name: 'Rajesh Kumar', email: 'rajesh@example.com', plan: 'PRO', role: 'USER', riskLevel: 'AGGRESSIVE', onboarded: true, createdAt: new Date() },
      { id: '3', name: 'Priya Sharma', email: 'priya@example.com', plan: 'FREE', role: 'USER', riskLevel: 'CONSERVATIVE', onboarded: false, createdAt: new Date() },
    ]);

  return (
    <div className='space-y-6 pb-8'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <div className='flex items-center gap-2'>
            <span className='rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[10px] font-bold px-2.5 py-0.5 flex items-center gap-1'>
              <ShieldCheck className='h-3 w-3' /> USER MANAGEMENT
            </span>
          </div>
          <h1 className='text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mt-1'>
            Registered Users ({users.length})
          </h1>
          <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5'>
            Manage platform users, roles, plan tiers, and onboarding status
          </p>
        </div>
      </div>

      <div className='glass-card border border-gray-200/80 dark:border-gray-800/80 shadow-xs rounded-2xl overflow-hidden'>
        <div className='p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-between'>
          <div className='relative w-full max-w-xs'>
            <Search className='absolute left-3 top-2.5 h-4 w-4 text-gray-400' />
            <input
              type='text'
              placeholder='Search user by name or email...'
              className='w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 pl-9 pr-3 py-1.5 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none'
              disabled
            />
          </div>
          <span className='text-xs text-gray-500'>Total: {users.length} users</span>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full text-left text-xs'>
            <thead className='bg-gray-50 dark:bg-gray-800/60 text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold border-b border-gray-100 dark:border-gray-800'>
              <tr>
                <th className='px-6 py-3.5'>User</th>
                <th className='px-6 py-3.5'>Email</th>
                <th className='px-6 py-3.5'>Role</th>
                <th className='px-6 py-3.5'>Plan</th>
                <th className='px-6 py-3.5'>Risk Level</th>
                <th className='px-6 py-3.5'>Onboarded</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100 dark:divide-gray-800 text-gray-800 dark:text-gray-200 font-medium'>
              {users.map((u) => {
                const uRole = isAdminEmail(u.email) ? 'ADMIN' : 'USER';
                return (
                  <tr key={u.id} className='hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors'>
                    <td className='px-6 py-4 font-bold flex items-center gap-2'>
                      <div className='flex h-7 w-7 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-xs'>
                        {(u.name || 'U').charAt(0)}
                      </div>
                      <span>{u.name || 'Investor'}</span>
                    </td>
                    <td className='px-6 py-4 font-mono text-gray-600 dark:text-gray-400'>{u.email}</td>
                    <td className='px-6 py-4'>
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          uRole === 'ADMIN'
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                        }`}
                      >
                        {uRole}
                      </span>
                    </td>
                  <td className='px-6 py-4'>
                    <span className='rounded-md bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 px-2 py-0.5 text-[10px] font-bold'>
                      {u.plan}
                    </span>
                  </td>
                  <td className='px-6 py-4 text-gray-600 dark:text-gray-400'>{u.riskLevel}</td>
                  <td className='px-6 py-4'>
                    {u.onboarded ? (
                      <span className='text-emerald-600 dark:text-emerald-400 font-bold text-[11px] flex items-center gap-1'>
                        <UserCheck className='h-3.5 w-3.5' /> Yes
                      </span>
                    ) : (
                      <span className='text-amber-600 dark:text-amber-400 font-bold text-[11px]'>Pending</span>
                    )}
                  </td>
                </tr>
              );
            })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
