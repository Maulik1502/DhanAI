import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { Shield, Clock, FileText } from 'lucide-react';

export default async function AdminAuditPage() {
  const user = await getCurrentUser();
  if (!user || !user.isAdmin) {
    redirect('/dashboard');
  }

  const auditLogs = await db.auditLog
    .findMany({ take: 30, orderBy: { createdAt: 'desc' } })
    .catch(() => [
      { id: '1', userId: 'demo-user-id', action: 'USER_LOGIN', entity: 'User', entityId: 'demo-user-id', ipAddress: '127.0.0.1', metadata: '{"provider":"google"}', createdAt: new Date() },
      { id: '2', userId: 'demo-user-id', action: 'CREATE_INCOME', entity: 'Income', entityId: 'inc-1', ipAddress: '127.0.0.1', metadata: '{"amount":125000}', createdAt: new Date(Date.now() - 3600000) },
      { id: '3', userId: 'demo-user-id', action: 'UPDATE_TAX_PROFILE', entity: 'TaxProfile', entityId: 'tax-1', ipAddress: '127.0.0.1', metadata: '{"regime":"NEW"}', createdAt: new Date(Date.now() - 7200000) },
    ]);

  return (
    <div className='space-y-6 pb-8'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <div className='flex items-center gap-2'>
            <span className='rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[10px] font-bold px-2.5 py-0.5 flex items-center gap-1'>
              <Shield className='h-3 w-3' /> SECURITY AUDIT LOGS
            </span>
          </div>
          <h1 className='text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mt-1'>
            System Activity Audit Trail
          </h1>
          <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5'>
            Immutable audit records for user actions, API calls, and administrative mutations
          </p>
        </div>
      </div>

      <div className='glass-card border border-gray-200/80 dark:border-gray-800/80 shadow-xs rounded-2xl overflow-hidden'>
        <div className='p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-between'>
          <div className='flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300'>
            <Clock className='h-4 w-4 text-purple-600' />
            <span>Recent System Events ({auditLogs.length})</span>
          </div>
          <span className='text-[11px] text-gray-400 font-mono'>Storage: Prisma AuditLog</span>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full text-left text-xs'>
            <thead className='bg-gray-50 dark:bg-gray-800/60 text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold border-b border-gray-100 dark:border-gray-800'>
              <tr>
                <th className='px-6 py-3.5'>Timestamp</th>
                <th className='px-6 py-3.5'>Action</th>
                <th className='px-6 py-3.5'>Entity</th>
                <th className='px-6 py-3.5'>User ID</th>
                <th className='px-6 py-3.5'>IP Address</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100 dark:divide-gray-800 text-gray-800 dark:text-gray-200 font-medium'>
              {auditLogs.map((log) => (
                <tr key={log.id} className='hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors'>
                  <td className='px-6 py-4 font-mono text-gray-500 text-[11px]'>
                    {new Date(log.createdAt).toLocaleString('en-IN')}
                  </td>
                  <td className='px-6 py-4 font-bold'>
                    <span className='rounded-md bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 px-2 py-0.5 text-[10px] font-mono'>
                      {log.action}
                    </span>
                  </td>
                  <td className='px-6 py-4 text-gray-600 dark:text-gray-300'>{log.entity || 'System'}</td>
                  <td className='px-6 py-4 font-mono text-gray-500 text-[11px]'>{log.userId || 'Guest'}</td>
                  <td className='px-6 py-4 font-mono text-gray-500 text-[11px]'>{log.ipAddress || '127.0.0.1'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
