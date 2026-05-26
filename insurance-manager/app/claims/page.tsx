'use client'

import { useState } from 'react'
import {
  Plane,
  Briefcase,
  Heart,
  Car,
  Home,
  CheckSquare,
  Square,
  Phone,
  Globe,
  Mail,
  Clock,
  ChevronRight,
  FileText,
  Plus,
} from 'lucide-react'
import { mockClaims, mockPolicies } from '@/lib/mock-data'
import { Claim } from '@/lib/types'

type ClaimType = {
  id: string
  label: string
  icon: React.ReactNode
  policyType: string
  description: string
  steps: string[]
  requiredDocs: string[]
  timeline: string
  contacts: { label: string; value: string; type: 'phone' | 'email' | 'web' }[]
  draftLetter: string
}

const CLAIM_TYPES: ClaimType[] = [
  {
    id: 'flight-delay',
    label: 'Flight Delay',
    icon: <Plane size={20} />,
    policyType: 'travel',
    description: 'Eligible if your flight was delayed 3+ hours. You can claim meal, transport, and accommodation costs.',
    steps: [
      'Confirm delay was 3+ hours (check boarding pass or airline app)',
      'Collect all receipts for meals, transport, and accommodation during delay',
      'Request a written delay certificate from the airline desk',
      'Take photos of departure board showing delay',
      'Submit claim within 60 days of return date',
      'Include your policy number ATZ-2024-887634 on all forms',
    ],
    requiredDocs: [
      'Boarding pass (original or digital)',
      'Airline delay certificate or email confirmation',
      'Itemised receipts for all expenses',
      'Bank/credit card statement for expenses',
      'Travel itinerary',
    ],
    timeline: 'Claims typically processed in 5–10 business days',
    contacts: [
      { label: 'Claims Hotline', value: '+1-800-284-8300', type: 'phone' },
      { label: 'Online Claims', value: 'allianztravelinsurance.com/claims', type: 'web' },
      { label: 'Claims Email', value: 'claims@allianz.com', type: 'email' },
    ],
    draftLetter: `Dear Allianz Claims Team,

I am writing to submit a claim under Policy No. ATZ-2024-887634 for a flight delay that occurred on [DATE].

My flight [FLIGHT NUMBER] from [ORIGIN] to [DESTINATION] was delayed by [X] hours due to [REASON]. This delay caused me to incur the following expenses:
- Meals: $[AMOUNT]
- Transport: $[AMOUNT]
- Accommodation: $[AMOUNT]

Total claimed: $[TOTAL]

I have enclosed all supporting documentation including receipts and the airline's delay certificate.

Please process this claim at your earliest convenience.

Yours sincerely,
[YOUR NAME]
Member ID: [MEMBER ID]
Contact: [PHONE/EMAIL]`,
  },
  {
    id: 'lost-luggage',
    label: 'Lost Luggage',
    icon: <Briefcase size={20} />,
    policyType: 'travel',
    description: 'File within 24 hours of arrival. Report to the airline first, then to Allianz Travel.',
    steps: [
      'Report missing luggage to airline desk immediately upon arrival',
      'Obtain a Property Irregularity Report (PIR) from the airline',
      'File a police report if luggage was stolen (within 24 hours)',
      'Document all contents that were in the luggage',
      'Keep receipts for any emergency replacement items purchased',
      'Contact Allianz within 48 hours of discovering the loss',
      'Submit full claim within 31 days of your return',
    ],
    requiredDocs: [
      'Property Irregularity Report (PIR) from airline',
      'Police report (if stolen)',
      'Baggage claim receipts',
      'Receipts for emergency replacement purchases',
      'List of luggage contents with estimated values',
      'Purchase receipts for high-value items if available',
    ],
    timeline: 'Emergency advance payment possible within 24hrs. Full settlement 7–14 days.',
    contacts: [
      { label: 'Emergency Line', value: '+1-800-654-1908', type: 'phone' },
      { label: 'Claims Portal', value: 'allianztravelinsurance.com/claims', type: 'web' },
    ],
    draftLetter: `Dear Allianz Claims Team,

I am submitting a lost/stolen luggage claim under Policy No. ATZ-2024-887634.

My luggage was [lost/stolen] on [DATE] during my journey from [ORIGIN] to [DESTINATION] on flight [FLIGHT NUMBER].

I reported this immediately to [AIRLINE NAME] and received Property Irregularity Report No. [PIR NUMBER].

The estimated value of lost items totals $[AMOUNT], itemised as follows:
[LIST YOUR ITEMS AND ESTIMATED VALUES]

I have enclosed all required documentation for your review.

Yours sincerely,
[YOUR NAME]
Policy: ATZ-2024-887634`,
  },
  {
    id: 'medical',
    label: 'Medical Claim',
    icon: <Heart size={20} />,
    policyType: 'health',
    description: 'Submit within 90 days of treatment. Always check if pre-authorisation was required.',
    steps: [
      'Verify the service is covered under your BCBS PPO plan',
      'Check if pre-authorisation was required (some specialist referrals)',
      'Request an itemised bill from your provider (not just the summary)',
      'Ensure the provider has your correct insurance information on file',
      'If in-network: claim is usually submitted automatically by provider',
      'If out-of-network: complete BCBS Claim Form and submit manually',
      'Attach itemised bill and any referral documentation',
      'Submit within 90 days of service date',
    ],
    requiredDocs: [
      'Itemised bill from provider',
      'Explanation of Benefits (EOB) if applicable',
      'Pre-authorisation number (if required)',
      'Referral from primary care physician (if required)',
      'Proof of payment if already paid',
    ],
    timeline: 'In-network claims: 14–30 days. Out-of-network: 30–45 days.',
    contacts: [
      { label: 'Member Services', value: '1-800-892-2803', type: 'phone' },
      { label: 'Member Portal', value: 'member.bcbsil.com', type: 'web' },
      { label: 'Pre-Auth Line', value: '1-800-892-2803 ext 3', type: 'phone' },
    ],
    draftLetter: `Dear BCBS Claims Department,

I am submitting a claim for medical services received on [DATE].

Member ID: BCBS-IL-4421988
Group Number: GRP-78834
Patient Name: [YOUR NAME]
Date of Service: [DATE]
Provider: [DOCTOR/HOSPITAL NAME]
Service Rendered: [DESCRIPTION]
Total Amount: $[AMOUNT]

I have attached the itemised bill and all supporting documentation. Please process this claim under my current coverage.

Sincerely,
[YOUR NAME]`,
  },
  {
    id: 'auto-accident',
    label: 'Auto Accident',
    icon: <Car size={20} />,
    policyType: 'auto',
    description: 'Report within 24 hours. Collect the other driver\'s details and document the scene.',
    steps: [
      'Call 911 if anyone is injured — safety first',
      'Move to a safe location and turn on hazard lights',
      'Exchange insurance and contact info with all involved parties',
      'Photograph the scene: both vehicles, damage, road conditions, any skid marks',
      'Get witness names and contact information',
      'File a police report (required for claims over $1,000 in most states)',
      'Call State Farm claims line 1-800-732-5246 within 24 hours',
      'Do not admit fault — let insurance adjusters determine liability',
      'Your $1,000 collision deductible applies for at-fault accidents',
    ],
    requiredDocs: [
      'Police report number',
      'Photos of damage and scene',
      'Other driver\'s insurance details',
      'Witness statements/contacts',
      'Medical reports (if injured)',
      'Repair shop estimates',
    ],
    timeline: 'Damage assessment within 48–72 hours. Repair authorisation 2–5 business days.',
    contacts: [
      { label: 'State Farm Claims', value: '1-800-732-5246', type: 'phone' },
      { label: 'Online Claim', value: 'statefarm.com/claims', type: 'web' },
      { label: 'Agent David Chen', value: '(312) 555-0183', type: 'phone' },
    ],
    draftLetter: `Dear State Farm Claims,

I am reporting an accident involving my vehicle covered under Policy No. SF-IL-9928847733.

Date of Accident: [DATE]
Location: [ADDRESS/INTERSECTION]
Police Report No.: [NUMBER]
Vehicle: 2021 Toyota Camry, VIN 4T1B11HK3MU558234
Description of Incident: [BRIEF DESCRIPTION]
Other Vehicle: [MAKE/MODEL/PLATE]
Other Driver: [NAME/PHONE/INSURANCE]

[Injuries: None / List if applicable]
Estimated Damage: $[AMOUNT]

I am requesting a damage assessment at your earliest convenience.

Sincerely,
[YOUR NAME]
Policy: SF-IL-9928847733
Phone: [YOUR PHONE]`,
  },
  {
    id: 'property',
    label: 'Property Damage',
    icon: <Home size={20} />,
    policyType: 'home',
    description: 'No home policy detected. Consider adding home/renters insurance.',
    steps: [
      'Note: No home or renters insurance found in your policies',
      'For any existing property: document damage with photos/video immediately',
      'Prevent further damage where safe to do so (cover broken windows, etc.)',
      'Do not throw away damaged items until assessed by adjuster',
      'Get repair estimates from licensed contractors',
      'Contact your insurer immediately — most require prompt notification',
    ],
    requiredDocs: [
      'Photos and video of all damage',
      'Police report (if theft or vandalism)',
      'Contractor repair estimates (at least 2)',
      'Receipts for emergency repairs',
      'Inventory of damaged/lost contents',
    ],
    timeline: 'Contact insurer immediately — delays can void coverage.',
    contacts: [
      { label: 'Get a Quote', value: 'statefarm.com', type: 'web' },
    ],
    draftLetter: `To Whom It May Concern,

I am writing to report property damage that occurred on [DATE].

Property Address: [ADDRESS]
Type of Damage: [FIRE/WATER/THEFT/ETC]
Description: [BRIEF DESCRIPTION]
Estimated Value of Loss: $[AMOUNT]

I have attached photographs and contractor estimates for your review.

Sincerely,
[YOUR NAME]`,
  },
]

function statusColor(status: Claim['status']) {
  switch (status) {
    case 'approved':   return { bg: 'var(--covered-bg)', text: 'var(--covered)' }
    case 'denied':     return { bg: 'var(--danger-bg)',  text: 'var(--danger)' }
    case 'processing': return { bg: 'var(--primary-bg)', text: 'var(--primary)' }
    case 'submitted':  return { bg: 'var(--warning-bg)', text: 'var(--warning)' }
    default:           return { bg: 'var(--bg-elevated)', text: 'var(--text-muted)' }
  }
}

function ClaimRow({ claim }: { claim: Claim }) {
  const { bg, text } = statusColor(claim.status)
  const policy = mockPolicies.find((p) => p.id === claim.policyId)

  return (
    <div className="card p-3 mb-2 flex items-center gap-3">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: 'var(--bg-elevated)' }}
      >
        <FileText size={18} style={{ color: 'var(--text-muted)' }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{claim.type}</p>
        <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
          {policy?.provider} · {new Date(claim.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
          style={{ background: bg, color: text }}
        >
          {claim.status}
        </span>
        {claim.amount && (
          <p className="text-xs font-semibold mt-1" style={{ color: 'var(--text)' }}>
            ${claim.amount}
          </p>
        )}
      </div>
    </div>
  )
}

function ChecklistItem({ text, checked, onToggle }: { text: string; checked: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="flex items-start gap-2 w-full text-left py-1.5 transition-all active:scale-98"
    >
      {checked
        ? <CheckSquare size={16} style={{ color: 'var(--covered)', flexShrink: 0, marginTop: 1 }} />
        : <Square size={16} style={{ color: 'var(--text-faint)', flexShrink: 0, marginTop: 1 }} />
      }
      <p
        className="text-sm"
        style={{
          color: checked ? 'var(--text-faint)' : 'var(--text)',
          textDecoration: checked ? 'line-through' : 'none',
        }}
      >
        {text}
      </p>
    </button>
  )
}

export default function ClaimsPage() {
  const [selected, setSelected] = useState<ClaimType | null>(null)
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [showLetter, setShowLetter] = useState(false)
  const [showNew, setShowNew] = useState(false)

  const toggleCheck = (key: string) => {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const selectType = (ct: ClaimType) => {
    setSelected(ct)
    setChecked({})
    setShowLetter(false)
    setShowNew(false)
  }

  return (
    <div className="animate-fade">
      {/* Header */}
      <div
        className="px-4 pt-6 pb-5"
        style={{ background: 'linear-gradient(160deg, var(--warning-bg) 0%, var(--bg) 100%)' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Claims</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Step-by-step assistance
            </p>
          </div>
          <button
            onClick={() => { setShowNew((v) => !v); setSelected(null) }}
            className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-xl transition-all active:scale-90"
            style={{ background: 'var(--primary)', color: '#fff' }}
          >
            <Plus size={16} />
            New Claim
          </button>
        </div>
      </div>

      {/* Claim type selector */}
      {showNew && !selected && (
        <div className="px-4 mb-4 animate-up">
          <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-muted)' }}>
            SELECT CLAIM TYPE
          </p>
          <div className="grid grid-cols-1 gap-2">
            {CLAIM_TYPES.map((ct) => (
              <button
                key={ct.id}
                onClick={() => selectType(ct)}
                className="card flex items-center gap-3 p-4 text-left transition-all active:scale-98"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--primary-bg)', color: 'var(--primary)' }}
                >
                  {ct.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{ct.label}</p>
                  <p className="text-xs mt-0.5 line-clamp-1" style={{ color: 'var(--text-muted)' }}>
                    {ct.description.slice(0, 60)}...
                  </p>
                </div>
                <ChevronRight size={16} style={{ color: 'var(--text-faint)', flexShrink: 0 }} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Claim detail */}
      {selected && (
        <div className="px-4 animate-up">
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => { setSelected(null); setShowNew(true) }}
              className="text-xs font-medium px-2 py-1 rounded-lg"
              style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}
            >
              ← Back
            </button>
            <p className="text-base font-bold" style={{ color: 'var(--text)' }}>{selected.label}</p>
          </div>

          {/* Description */}
          <div
            className="p-3 rounded-2xl mb-4"
            style={{ background: 'var(--primary-bg)', border: '1px solid color-mix(in srgb, var(--primary) 20%, transparent)' }}
          >
            <p className="text-sm" style={{ color: 'var(--text)' }}>{selected.description}</p>
          </div>

          {/* Action Steps */}
          <div className="card p-4 mb-3">
            <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>
              Action Plan
            </p>
            <div className="flex flex-col gap-1">
              {selected.steps.map((step, i) => (
                <ChecklistItem
                  key={i}
                  text={`${i + 1}. ${step}`}
                  checked={!!checked[`step-${i}`]}
                  onToggle={() => toggleCheck(`step-${i}`)}
                />
              ))}
            </div>
            <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
              <p className="text-xs" style={{ color: 'var(--text-faint)' }}>
                {selected.steps.filter((_, i) => checked[`step-${i}`]).length} of {selected.steps.length} steps completed
              </p>
            </div>
          </div>

          {/* Required Docs */}
          <div className="card p-4 mb-3">
            <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>
              Documents Needed
            </p>
            {selected.requiredDocs.map((doc, i) => (
              <ChecklistItem
                key={i}
                text={doc}
                checked={!!checked[`doc-${i}`]}
                onToggle={() => toggleCheck(`doc-${i}`)}
              />
            ))}
          </div>

          {/* Timeline */}
          <div
            className="flex items-start gap-2 p-3 rounded-2xl mb-3"
            style={{ background: 'var(--covered-bg)' }}
          >
            <Clock size={14} style={{ color: 'var(--covered)', flexShrink: 0, marginTop: 2 }} />
            <p className="text-xs" style={{ color: 'var(--covered)' }}>{selected.timeline}</p>
          </div>

          {/* Contacts */}
          <div className="card p-4 mb-3">
            <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>
              Contact Details
            </p>
            {selected.contacts.map((c, i) => (
              <div key={i} className="flex items-center gap-3 py-2" style={i > 0 ? { borderTop: '1px solid var(--border-subtle)' } : {}}>
                {c.type === 'phone' && <Phone size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />}
                {c.type === 'email' && <Mail size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />}
                {c.type === 'web'   && <Globe size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px]" style={{ color: 'var(--text-faint)' }}>{c.label}</p>
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--primary)' }}>{c.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Draft Letter */}
          <button
            onClick={() => setShowLetter((v) => !v)}
            className="w-full flex items-center justify-between p-4 card mb-3 transition-all active:scale-98"
          >
            <div className="flex items-center gap-2">
              <FileText size={16} style={{ color: 'var(--warning)' }} />
              <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                Pre-drafted Claim Letter
              </span>
            </div>
            <ChevronRight
              size={16}
              style={{
                color: 'var(--text-faint)',
                transform: showLetter ? 'rotate(90deg)' : 'none',
                transition: 'transform 0.2s',
              }}
            />
          </button>

          {showLetter && (
            <div
              className="rounded-2xl p-4 mb-3 animate-up"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--text-faint)' }}>
                Template — replace bracketed values
              </p>
              <pre
                className="text-xs whitespace-pre-wrap font-mono leading-relaxed"
                style={{ color: 'var(--text)', fontFamily: 'monospace' }}
              >
                {selected.draftLetter}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Active Claims */}
      {!showNew && !selected && (
        <div className="px-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Recent Claims</p>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}
            >
              {mockClaims.length}
            </span>
          </div>
          {mockClaims.map((claim) => (
            <ClaimRow key={claim.id} claim={claim} />
          ))}
        </div>
      )}
    </div>
  )
}
