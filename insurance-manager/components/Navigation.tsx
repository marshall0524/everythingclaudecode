'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, MessageCircle, Shield, FileWarning } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

const navItems = [
  { href: '/',          label: 'Home',     icon: LayoutDashboard },
  { href: '/documents', label: 'Docs',     icon: FileText },
  { href: '/chat',      label: 'Chat',     icon: MessageCircle },
  { href: '/coverage',  label: 'Coverage', icon: Shield },
  { href: '/claims',    label: 'Claims',   icon: FileWarning },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl"
        style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}
      >
        <div className="flex items-center justify-between px-4 py-3 max-w-[430px] mx-auto">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--primary)' }}
            >
              <Shield size={14} color="#fff" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-sm tracking-tight" style={{ color: 'var(--text)' }}>
              InsureOS
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium"
              style={{
                background: 'color-mix(in srgb, var(--covered) 15%, transparent)',
                color: 'var(--covered)',
              }}
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              3 Active
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <nav
        className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl safe-pb"
        style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)' }}
      >
        <div className="flex items-center justify-around px-1 py-2 max-w-[430px] mx-auto">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all active:scale-90"
                style={{
                  color: active ? 'var(--primary)' : 'var(--text-faint)',
                  background: active ? 'color-mix(in srgb, var(--primary) 12%, transparent)' : 'transparent',
                  minWidth: '44px',
                  minHeight: '44px',
                }}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                <span className="text-[10px] font-semibold">{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
