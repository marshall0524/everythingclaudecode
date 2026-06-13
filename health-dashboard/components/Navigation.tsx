'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Brain, RefreshCw, ClipboardList, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/',      label: 'Dashboard', icon: Home },
  { href: '/gp',    label: 'Records',   icon: ClipboardList },
  { href: '/coach', label: 'Coach',     icon: Brain },
  { href: '/sync',  label: 'Sync',      icon: RefreshCw },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-950/95 backdrop-blur-md border-b border-gray-800">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <Activity className="text-primary-400" size={20} />
            <span className="font-semibold text-white text-sm tracking-wide">HealthOS</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex h-2 w-2 rounded-full bg-green-400 animate-pulse-slow" />
            <span className="text-xs text-gray-400">Live</span>
          </div>
        </div>
      </header>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gray-950/95 backdrop-blur-md border-t border-gray-800 safe-area-pb">
        <div className="flex items-center justify-around px-2 py-2 max-w-lg mx-auto">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all',
                  active ? 'text-primary-400' : 'text-gray-500 hover:text-gray-300'
                )}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
