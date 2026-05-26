'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Shield,
  Heart,
  Plane,
  Car,
  Home,
  AlertTriangle,
  Clock,
  Upload,
  MessageCircle,
  FileWarning,
  ChevronRight,
  TrendingUp,
} from 'lucide-react'
import { mockPolicies, mockCoverageGaps, USER_NAME } from '@/lib/mock-data'
import { Policy } from '@/lib/types'

const TODAY = new Date()
const HOUR = TODAY.getHours()
const GREETING = HOUR < 12 ? 'Good morning' : HOUR < 17 ? 'Good afternoon' : 'Good evening'
const DATE_STR = TODAY.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

function policyIcon(type: Policy['type']) {
  const props = { size: 18, strokeWidth: 2 }
  switch (type) {
    case 'health': return <Heart {...props} />
    case 'travel': return <Plane {...props} />
    case 'auto':   return <Car {...props} />
    case 'home':   return <Home {...props} />
    case 'life':   return <Shield {...props} />
    default:       return <Shield {...props} />
  }
}

function policyColor(type: Policy['type']) {
  switch (type) {
    case 'health': return '#EF4444'
    case 'travel': return '#4F6EF7'
    case 'auto':   return '#10B981'
    case 'home':   return '#F59E0B'
    case 'life':   return '#8B5CF6'
    default:       return '#6B7280'
  }
}

function daysUntilExpiry(dateStr: string) {
  const expiry = new Date(dateStr)
  return Math.ceil((expiry.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24))
}

function PolicyCard({ policy }: { policy: Policy }) {
  const color = policyColor(policy.type)
  const days = daysUntilExpiry(policy.expiryDate)
  const expiringSoon = days < 60

  return (
    <div
      className="card flex-shrink-0 w-56 p-4 flex flex-col gap-3 transition-all active:scale-95"
      style={{ boxShadow: `0 4px 20px color-mix(in srgb, ${color} 15%, transparent)` }}
    >
      <div className="flex items-start justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `color-mix(in srgb, ${color} 18%, transparent)`, color }}
        >
          {policyIcon(policy.type)}
        </div>
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
          style={{
            background: policy.status === 'active' ? 'var(--covered-bg)' : 'var(--danger-bg)',
            color: policy.status === 'active' ? 'var(--covered)' : 'var(--danger)',
          }}
        >
          {policy.status}
        </span>
      </div>

      <div>
        <p className="font-semibold text-sm leading-tight" style={{ color: 'var(--text)' }}>
          {policy.name}
        </p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
          {policy.provider}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px]" style={{ color: 'var(--text-faint)' }}>Monthly</p>
          <p className="text-base font-bold" style={{ color: 'var(--text)' }}>
            ${policy.premiumFrequency === 'monthly' ? policy.premium : Math.round(policy.premium / 12)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px]" style={{ color: 'var(--text-faint)' }}>Expires</p>
          <p
            className="text-xs font-semibold"
            style={{ color: expiringSoon ? 'var(--warning)' : 'var(--text-muted)' }}
          >
            {expiringSoon ? `${days}d left` : new Date(policy.expiryDate).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [_dismissed, setDismissed] = useState<string[]>([])

  const totalMonthly = mockPolicies.reduce((sum, p) => {
    return sum + (p.premiumFrequency === 'monthly' ? p.premium : Math.round(p.premium / 12))
  }, 0)

  const activePolicies = mockPolicies.filter((p) => p.status === 'active')
  const coverageScore = Math.round(
    (mockPolicies.reduce((sum, p) => {
      const covered = p.coverageItems.filter((c) => c.covered).length
      return sum + covered / p.coverageItems.length
    }, 0) /
      mockPolicies.length) *
      100,
  )

  const expiringPolicies = mockPolicies.filter((p) => daysUntilExpiry(p.expiryDate) < 90 && p.status === 'active')
  const highGaps = mockCoverageGaps.filter((g) => g.severity === 'high')

  return (
    <div className="animate-fade">
      {/* Header */}
      <div
        className="px-4 pt-6 pb-8"
        style={{
          background: 'linear-gradient(160deg, var(--primary-bg) 0%, var(--bg) 100%)',
        }}
      >
        <p className="text-xs font-medium" style={{ color: 'var(--text-faint)' }}>
          {DATE_STR}
        </p>
        <h1 className="text-xl font-bold mt-1" style={{ color: 'var(--text)' }}>
          {GREETING}, {USER_NAME}
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Your insurance is up to date.
        </p>
      </div>

      {/* Stats Row */}
      <div className="px-4 -mt-4">
        <div
          className="card p-4 grid grid-cols-3 gap-0"
          style={{ boxShadow: '0 8px 32px rgba(79, 110, 247, 0.12)' }}
        >
          {[
            { label: 'Policies', value: activePolicies.length.toString(), sub: 'active' },
            { label: 'Monthly', value: `$${totalMonthly}`, sub: 'premium' },
            { label: 'Score', value: `${coverageScore}%`, sub: 'covered', color: coverageScore > 70 ? 'var(--covered)' : 'var(--warning)' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="flex flex-col items-center text-center py-1"
              style={{
                borderRight: i < 2 ? '1px solid var(--border-subtle)' : undefined,
              }}
            >
              <p className="text-xl font-bold" style={{ color: stat.color || 'var(--text)' }}>
                {stat.value}
              </p>
              <p className="text-[10px] font-medium mt-0.5" style={{ color: 'var(--text-faint)' }}>
                {stat.label}
              </p>
              <p className="text-[10px]" style={{ color: 'var(--text-faint)' }}>
                {stat.sub}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Alerts */}
      {(expiringPolicies.length > 0 || highGaps.length > 0) && (
        <div className="px-4 mt-4 flex flex-col gap-2">
          {expiringPolicies.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-3 p-3 rounded-2xl"
              style={{ background: 'var(--warning-bg)', border: '1px solid color-mix(in srgb, var(--warning) 25%, transparent)' }}
            >
              <Clock size={16} style={{ color: 'var(--warning)', flexShrink: 0 }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold" style={{ color: 'var(--warning)' }}>
                  Expiring Soon
                </p>
                <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                  {p.name} — {daysUntilExpiry(p.expiryDate)} days left
                </p>
              </div>
              <ChevronRight size={14} style={{ color: 'var(--warning)', flexShrink: 0 }} />
            </div>
          ))}
          {highGaps.map((gap) => (
            <div
              key={gap.category}
              className="flex items-center gap-3 p-3 rounded-2xl"
              style={{ background: 'var(--danger-bg)', border: '1px solid color-mix(in srgb, var(--danger) 25%, transparent)' }}
            >
              <AlertTriangle size={16} style={{ color: 'var(--danger)', flexShrink: 0 }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold" style={{ color: 'var(--danger)' }}>
                  Coverage Gap
                </p>
                <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                  {gap.category} — {gap.description.slice(0, 55)}...
                </p>
              </div>
              <button
                onClick={() => setDismissed((d) => [...d, gap.category])}
                className="text-[10px] px-2 py-0.5 rounded-full"
                style={{ background: 'var(--danger)', color: '#fff' }}
              >
                Fix
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Policy Cards */}
      <div className="mt-5">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
            My Policies
          </h2>
          <Link href="/coverage" className="text-xs font-medium" style={{ color: 'var(--primary)' }}>
            View All
          </Link>
        </div>
        <div className="flex gap-3 px-4 overflow-x-auto no-scrollbar pb-2">
          {mockPolicies.map((policy) => (
            <PolicyCard key={policy.id} policy={policy} />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mt-5 mb-2">
        <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { href: '/documents', icon: Upload,         label: 'Upload Doc',    sub: 'Add policy document',  color: '#4F6EF7', bg: 'var(--primary-bg)' },
            { href: '/chat',      icon: MessageCircle,  label: 'Ask AI',        sub: 'Get policy answers',   color: '#10B981', bg: 'var(--covered-bg)' },
            { href: '/claims',    icon: FileWarning,    label: 'File Claim',    sub: 'Start claim process',  color: '#F59E0B', bg: 'var(--warning-bg)' },
            { href: '/coverage',  icon: TrendingUp,     label: 'View Coverage', sub: 'Check your gaps',      color: '#8B5CF6', bg: 'color-mix(in srgb, #8B5CF6 15%, transparent)' },
          ].map(({ href, icon: Icon, label, sub, color, bg }) => (
            <Link
              key={href}
              href={href}
              className="card p-4 flex flex-col gap-2 transition-all active:scale-95"
              style={{ minHeight: 88 }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: bg }}
              >
                <Icon size={18} style={{ color }} strokeWidth={2} />
              </div>
              <div>
                <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>
                  {label}
                </p>
                <p className="text-[10px]" style={{ color: 'var(--text-faint)' }}>
                  {sub}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
