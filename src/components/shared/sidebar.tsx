'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  X,
  LayoutDashboard,
  Wallet,
  Receipt,
  ShieldAlert,
  ShieldCheck,
  Target,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  BarChart3,
  Bell,
  FileText,
  Sparkles,
  Users,
  Shield,
  Landmark,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const userNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/income', label: 'Income Sources', icon: TrendingUp },
  { href: '/expenses', label: 'Expenses & EMIs', icon: TrendingDown },
  { href: '/wealth', label: 'Networth & Wealth', icon: Landmark },
  { href: '/tax', label: 'Tax Planner', icon: Receipt },
  { href: '/emergency', label: 'Emergency Fund', icon: ShieldAlert },
  { href: '/insurance', label: 'Insurance Protection', icon: ShieldCheck },
  { href: '/goals', label: 'Goals Tracker', icon: Target },
  { href: '/investments', label: 'Investments Portfolio', icon: PiggyBank },
  { href: '/corpus', label: 'Corpus Builder', icon: Wallet },
  { href: '/market', label: 'Market & News', icon: BarChart3 },
  { href: '/alerts', label: 'Alerts', icon: Bell },
  { href: '/reports', label: 'CA Reports', icon: FileText },
  { href: '/profile', label: 'Profile & Settings', icon: Users },
];

const adminNavItems = [
  { href: '/admin/dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'User Management', icon: Users },
  { href: '/admin/analytics', label: 'Platform Analytics', icon: BarChart3 },
  { href: '/admin/audit', label: 'System Audit Logs', icon: Shield },
  { href: '/alerts', label: 'System Alerts', icon: Bell },
  { href: '/dashboard', label: 'Exit to User Portal', icon: Wallet },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen, adminMode } = useAppStore();
  const currentNavItems = adminMode ? adminNavItems : userNavItems;

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-gray-950/40 backdrop-blur-xs transition-opacity lg:hidden ${
          sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setSidebarOpen(false)}
      />
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-72 border-r border-gray-200/80 bg-white/95 p-4 shadow-2xl backdrop-blur-md transition-transform dark:border-gray-800/80 dark:bg-gray-900/95 lg:sticky lg:top-20 lg:z-0 lg:h-[calc(100vh-6rem)] lg:w-64 lg:shrink-0 lg:rounded-2xl lg:border lg:shadow-xs lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className='mb-6 flex items-center justify-between lg:hidden'>
          <div className='flex items-center gap-2'>
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-white ${
                adminMode ? 'bg-purple-600' : 'bg-dhan-gradient'
              }`}
            >
              <Sparkles className='h-4 w-4' />
            </div>
            <span className='font-bold text-gray-900 dark:text-white'>
              {adminMode ? 'Admin Portal' : 'Navigation'}
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className='inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-100 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800'
          >
            <X className='h-4 w-4' />
          </button>
        </div>

        {adminMode && (
          <div className='mb-3 p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-900/50 text-[11px] font-bold text-purple-700 dark:text-purple-300 flex items-center gap-2'>
            <Shield className='h-4 w-4 shrink-0' />
            <span>Admin Control Panel Mode</span>
          </div>
        )}

        <div className='space-y-1 overflow-y-auto max-h-[calc(100vh-8rem)] pr-1'>
          {currentNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && item.href !== '/admin/dashboard' && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all ${
                  isActive
                    ? adminMode
                      ? 'bg-purple-600 text-white font-semibold shadow-md shadow-purple-500/20'
                      : 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-500/20'
                    : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800/80 dark:hover:text-white'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
}
