'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  Bell,
  LogOut,
  Sparkles,
  ShieldCheck,
  UserCheck,
  Sun,
  Moon,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useAppStore } from '@/store/useAppStore';
import { useAlerts } from '@/hooks/useAlerts';

export function Header({
  userName,
  userInitial,
  isAdmin = false,
}: {
  userName: string;
  userInitial: string;
  isAdmin?: boolean;
}) {
  const pathname = usePathname();
  const { data } = useAlerts();
  const unread = data?.unread ?? 0;
  const { setSidebarOpen, adminMode, setAdminMode } = useAppStore();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setTheme('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (theme === 'dark') {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    }
  };

  return (
    <header className='sticky top-0 z-30 border-b border-gray-200/80 bg-white/85 backdrop-blur-md dark:border-gray-800/80 dark:bg-gray-900/85 transition-colors'>
      <div className='w-full flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center gap-3'>
          <button
            onClick={() => setSidebarOpen(true)}
            className='inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-gray-50/50 text-gray-700 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-200 lg:hidden transition-colors'
            aria-label='Open Menu'
          >
            <Menu className='h-5 w-5' />
          </button>
          <Link href={adminMode ? '/admin/dashboard' : '/dashboard'} className='flex items-center gap-3 group'>
            <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-dhan-gradient text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform'>
              <Sparkles className='h-5 w-5' />
            </div>
            <div>
              <div className='flex items-center gap-1.5'>
                <span className='font-extrabold text-lg text-gray-900 dark:text-white tracking-tight'>DhanAI</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                    adminMode
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                  }`}
                >
                  {adminMode ? 'ADMIN' : 'PRO'}
                </span>
              </div>
              <p className='text-xs text-gray-500 dark:text-gray-400 hidden sm:block'>
                {adminMode ? 'Platform Administration Portal' : 'Intelligent Money Engine'}
              </p>
            </div>
          </Link>
        </div>

        <div className='flex items-center gap-2.5 sm:gap-3'>
          {/* Admin Mode Switcher Toggle Pill */}
          {isAdmin && (
            <div className='flex items-center p-1 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
              <button
                onClick={() => setAdminMode(false)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  !adminMode
                    ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400'
                }`}
              >
                <UserCheck className='h-3.5 w-3.5' />
                <span className='hidden md:inline'>User View</span>
              </button>
              <button
                onClick={() => setAdminMode(true)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  adminMode
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400'
                }`}
              >
                <ShieldCheck className='h-3.5 w-3.5' />
                <span className='hidden md:inline'>Admin View</span>
              </button>
            </div>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className='inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors'
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun className='h-4 w-4 text-amber-400' /> : <Moon className='h-4 w-4 text-gray-600' />}
          </button>

          <Link
            href='/alerts'
            className='relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-blue-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 transition-colors'
            title='Notifications'
          >
            <Bell className='h-4 w-4' />
            {unread > 0 && (
              <span className='absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs ring-2 ring-white dark:ring-gray-900 animate-pulse'>
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </Link>

          <div className='h-6 w-[1px] bg-gray-200 dark:bg-gray-800 hidden sm:block' />

          <Link href='/profile' className='flex items-center gap-2.5 group hover:opacity-90 transition-opacity' title='View Profile & Settings'>
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full font-bold text-white text-sm shadow-xs ring-2 ${
                adminMode ? 'bg-purple-600 ring-purple-500/20' : 'bg-dhan-gradient ring-blue-500/20'
              }`}
            >
              {userInitial}
            </div>
            <div className='hidden text-left sm:block'>
              <p className='text-xs font-semibold text-gray-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>{userName}</p>
              <p className='text-[10px] text-emerald-600 dark:text-emerald-400 font-medium'>
                {isAdmin ? (adminMode ? 'System Administrator' : 'Verified Admin') : 'Verified User'}
              </p>
            </div>
          </Link>

          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className='inline-flex h-9 items-center gap-1.5 rounded-xl border border-gray-200 px-3 text-xs font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-red-600 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-red-400 transition-all'
            title='Sign out'
          >
            <LogOut className='h-3.5 w-3.5' />
            <span className='hidden md:inline'>Exit</span>
          </button>
        </div>
      </div>
    </header>
  );
}
