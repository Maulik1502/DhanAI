'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  Landmark,
  Menu,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const mobileNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/income', label: 'Income', icon: TrendingUp },
  { href: '/expenses', label: 'Expenses', icon: TrendingDown },
  { href: '/wealth', label: 'Networth', icon: Landmark },
];

export function BottomNav() {
  const pathname = usePathname();
  const { setSidebarOpen } = useAppStore();

  return (
    <div className='fixed bottom-0 left-0 z-40 w-full border-t border-gray-200/80 bg-white/90 backdrop-blur-lg dark:border-gray-800/80 dark:bg-gray-900/90 lg:hidden px-2 py-1.5 shadow-lg'>
      <div className='flex items-center justify-around'>
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white font-medium'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'scale-110' : ''}`} />
              <span className='text-[10px] tracking-tight'>{item.label}</span>
            </Link>
          );
        })}

        <button
          onClick={() => setSidebarOpen(true)}
          className='flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white font-medium'
        >
          <Menu className='h-5 w-5' />
          <span className='text-[10px] tracking-tight'>More</span>
        </button>
      </div>
    </div>
  );
}
