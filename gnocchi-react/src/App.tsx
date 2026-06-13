import { useState, useEffect, useRef, useCallback } from 'react'
import { Clock, Menu, X, ArrowRight, Shield, Check, Lock, ChevronDown, ChevronUp } from 'lucide-react'
import { Swirl, MeshGradient, FlutedGlass } from '@paper-design/shaders-react'

/* ── Live London clock ──────────────────────────────────────── */
function useLondonTime() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString('en-GB', {
          timeZone: 'Europe/London',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      )
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

/* ── Gnocchi Pasta Logo ─────────────────────────────────────── */
function GnocchiLogo({ size = 28 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <svg width={size} height={Math.round(size * 0.71)} viewBox="0 0 28 20" fill="none">
        <rect x="1" y="3" width="26" height="14" rx="7" fill="#1D6B42"/>
        <path d="M9 4.5 Q10.5 10 9 15.5" stroke="white" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.55"/>
        <path d="M14 3.5 Q15.5 10 14 16.5" stroke="white" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.55"/>
        <path d="M19 4.5 Q20.5 10 19 15.5" stroke="white" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.55"/>
      </svg>
      <span style={{ fontWeight: 600, fontSize: size === 28 ? '1.0625rem' : '0.875rem', letterSpacing: '-0.02em', color: '#0F0E0C' }}>
        gnocchi
      </span>
    </div>
  )
}

/* ── Roll-text button ───────────────────────────────────────── */
interface RollButtonProps {
  text: string
  onClick?: () => void
  variant?: 'green' | 'dark'
  size?: 'sm' | 'md'
  className?: string
}
function RollButton({ text, onClick, variant = 'green', size = 'md', className = '' }: RollButtonProps) {
  const bg = variant === 'green'
    ? 'bg-[#1D6B42] hover:bg-[#155232] text-white'
    : 'bg-gray-900 hover:bg-[#1D6B42] text-white'
  const pad = size === 'sm' ? 'pl-4 pr-1.5 py-1.5 text-[12px]' : 'pl-5 sm:pl-6 pr-2 py-2 text-[13px] sm:text-[14px]'
  const circle = size === 'sm' ? 'w-6 h-6' : 'w-7 h-7 sm:w-8 sm:h-8'
  const icon = size === 'sm' ? 12 : 14
  return (
    <button
      onClick={onClick}
      className={`group flex items-center gap-2 font-medium rounded-full transition-colors duration-300 cursor-pointer ${bg} ${pad} ${className}`}
    >
      <div className="overflow-hidden" style={{ height: 20 }}>
        <div className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-1/2">
          <span>{text}</span>
          <span>{text}</span>
        </div>
      </div>
      <div className={`${circle} rounded-full bg-white flex items-center justify-center flex-shrink-0`}>
        <ArrowRight
          size={icon}
          className="text-[#1D6B42] transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45"
        />
      </div>
    </button>
  )
}


/* ── Section badge ──────────────────────────────────────────── */
function Badge({ num, label, light }: { num: string; label: string; light?: boolean }) {
  return (
    <div className="flex items-center gap-3 mb-6 sm:mb-8">
      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
        <span className="text-white font-semibold" style={{ fontSize: 11 }}>{num}</span>
      </div>
      <span className={`text-[12px] sm:text-[13px] font-medium border rounded-full px-3 sm:px-4 py-1 sm:py-1.5 ${light ? 'border-gray-300' : 'border-gray-200'}`}>
        {label}
      </span>
    </div>
  )
}

/* ── Starburst SVG ──────────────────────────────────────────── */
function Starburst({ className = '' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className={className}>
      <path d="m19.6 66.5 19.7-11 .3-1-.3-.5h-1l-3.3-.2-11.2-.3L14 53l-9.5-.5-2.4-.5L0 49l.2-1.5 2-1.3 2.9.2 6.3.5 9.5.6 6.9.4L38 49.1h1.6l.2-.7-.5-.4-.4-.4L29 41l-10.6-7-5.6-4.1-3-2-1.5-2-.6-4.2 2.7-3 3.7.3.9.2 3.7 2.9 8 6.1L37 36l1.5 1.2.6-.4.1-.3-.7-1.1L33 25l-6-10.4-2.7-4.3-.7-2.6c-.3-1-.4-2-.4-3l3-4.2L28 0l4.2.6L33.8 2l2.6 6 4.1 9.3L47 29.9l2 3.8 1 3.4.3 1h.7v-.5l.5-7.2 1-8.7 1-11.2.3-3.2 1.6-3.8 3-2L61 2.6l2 2.9-.3 1.8-1.1 7.7L59 27.1l-1.5 8.2h.9l1-1.1 4.1-5.4 6.9-8.6 3-3.5L77 13l2.3-1.8h4.3l3.1 4.7-1.4 4.9-4.4 5.6-3.7 4.7-5.3 7.1-3.2 5.7.3.4h.7l12-2.6 6.4-1.1 7.6-1.3 3.5 1.6.4 1.6-1.4 3.4-8.2 2-9.6 2-14.3 3.3-.2.1.2.3 6.4.6 2.8.2h6.8l12.6 1 3.3 2 1.9 2.7-.3 2-5.1 2.6-6.8-1.6-16-3.8-5.4-1.3h-.8v.4l4.6 4.5 8.3 7.5L89 80.1l.5 2.4-1.3 2-1.4-.2-9.2-7-3.6-3-8-6.8h-.5v.7l1.8 2.7 9.8 14.7.5 4.5-.7 1.4-2.6 1-2.7-.6-5.8-8-6-9-4.7-8.2-.5.4-2.9 30.2-1.3 1.5-3 1.2-2.5-2-1.4-3 1.4-6.2 1.6-8 1.3-6.4 1.2-7.9.7-2.6v-.2H49L43 72l-9 12.3-7.2 7.6-1.7.7-3-1.5.3-2.8L24 86l10-12.8 6-7.9 4-4.6-.1-.5h-.3L17.2 77.4l-4.7.6-2-2 .2-3 1-1 8-5.5Z"/>
    </svg>
  )
}


/* ── Quote Form Modal ───────────────────────────────────────── */
const SECTORS = [
  'SaaS / B2B', 'Fintech', 'E-commerce', 'Marketplace',
  'Health Tech', 'EdTech', 'Hardware / Deep Tech', 'Other',
]
const TEAM_SIZES = [
  { id: 'solo', label: 'Solo / co-founder', sub: '1–2 people' },
  { id: 'small', label: 'Small team', sub: '3–10 people' },
  { id: 'growing', label: 'Growing', sub: '11–30 people' },
  { id: 'scaling', label: 'Scaling', sub: '31+ people' },
]
const STAGES = [
  { id: 'preseed', label: 'Pre-seed / Bootstrapped' },
  { id: 'seed', label: 'Seed / Angel-backed' },
  { id: 'seriesa', label: 'Series A' },
  { id: 'seriesb', label: 'Series B+' },
]
const REGIONS = [
  { id: 'uk', label: 'UK only', popular: false },
  { id: 'eu', label: 'EU only', popular: false },
  { id: 'ukeu', label: 'UK & EU', popular: true },
]

interface QuoteFormModalProps {
  onClose: () => void
}

function QuoteFormModal({ onClose }: QuoteFormModalProps) {
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  const [sector, setSector] = useState('')
  const [sectorDesc, setSectorDesc] = useState('')
  const [teamSize, setTeamSize] = useState('')
  const [stage, setStage] = useState('')
  const [region, setRegion] = useState('')
  const [email, setEmail] = useState('')
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')
  const [animating, setAnimating] = useState(false)

  const totalSteps = 5

  function goNext() {
    if (animating) return
    setDirection('forward')
    setAnimating(true)
    setTimeout(() => {
      if (step < totalSteps - 1) setStep(s => s + 1)
      setAnimating(false)
    }, 180)
  }

  function goPrev() {
    if (animating || step === 0) return
    setDirection('back')
    setAnimating(true)
    setTimeout(() => {
      setStep(s => s - 1)
      setAnimating(false)
    }, 180)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setDone(true)
  }

  const canNext = () => {
    if (step === 0) return sector !== ''
    if (step === 1) return teamSize !== ''
    if (step === 2) return stage !== ''
    if (step === 3) return region !== ''
    if (step === 4) return email.includes('@')
    return false
  }

  const slideClass = animating
    ? direction === 'forward' ? 'opacity-0 translate-x-4' : 'opacity-0 -translate-x-4'
    : 'opacity-100 translate-x-0'

  if (done) {
    return (
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-[#0F2419] rounded-3xl shadow-2xl w-full max-w-lg p-10 flex flex-col items-center text-center relative">
          <button onClick={onClose} className="absolute top-5 right-5 text-white/40 hover:text-white transition-colors">
            <X size={20} />
          </button>
          <div className="w-16 h-16 rounded-full bg-[#1D6B42] flex items-center justify-center mb-6">
            <Check size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-white mb-3">You're on the list.</h2>
          <p className="text-[#A8D4B8] text-[15px] leading-[1.65] mb-8">
            We'll have your personalised quote ready within 48 hours. Check your inbox at <span className="text-white font-medium">{email}</span>.
          </p>
          <button
            onClick={() => {
              onClose()
              setTimeout(() => document.getElementById('advisor')?.scrollIntoView({ behavior: 'smooth' }), 100)
            }}
            className="group flex items-center gap-2 bg-[#1D6B42] hover:bg-[#155232] text-white text-[14px] font-medium rounded-full pl-5 pr-2 py-2.5 transition-colors"
          >
            <span>While you wait, talk to our advisor</span>
            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center flex-shrink-0">
              <ArrowRight size={13} className="text-[#1D6B42] transition-transform duration-300 group-hover:-rotate-45" />
            </div>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative overflow-hidden" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-5 right-5 z-10 text-gray-400 hover:text-gray-700 transition-colors">
          <X size={20} />
        </button>
        <div className="flex items-center justify-center gap-2 pt-6 pb-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`transition-all duration-300 flex items-center justify-center ${
                i < step
                  ? 'w-5 h-5 rounded-full bg-[#1D6B42]'
                  : i === step
                    ? 'w-5 h-5 rounded-full bg-[#1D6B42] ring-4 ring-[#EBF5EE]'
                    : 'w-2.5 h-2.5 rounded-full bg-gray-200'
              }`}
            >
              {i < step && <Check size={10} className="text-white" />}
            </div>
          ))}
        </div>
        <div className={`px-8 pt-5 pb-4 transition-all duration-[180ms] ease-out ${slideClass}`} style={{ minHeight: 320 }}>
          {step === 0 && (
            <div>
              <h3 className="text-[20px] font-semibold text-gray-900 mb-1">What does your startup do?</h3>
              <p className="text-[13px] text-gray-500 mb-5">This helps us recommend the right cover.</p>
              <div className="grid grid-cols-2 gap-2.5 mb-5">
                {SECTORS.map(s => (
                  <button key={s} onClick={() => setSector(s)}
                    className={`text-left text-[13px] font-medium px-4 py-2.5 rounded-xl border transition-all duration-150 ${sector === s ? 'border-[#1D6B42] bg-[#EBF5EE] text-[#1D6B42]' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}>
                    {s}
                  </button>
                ))}
              </div>
              <input type="text" value={sectorDesc} onChange={e => setSectorDesc(e.target.value)}
                placeholder="Describe what you build (optional)"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-[#1D6B42] transition-colors" />
            </div>
          )}
          {step === 1 && (
            <div>
              <h3 className="text-[20px] font-semibold text-gray-900 mb-5">How many people are on your team?</h3>
              <div className="grid grid-cols-1 gap-3">
                {TEAM_SIZES.map(ts => (
                  <button key={ts.id} onClick={() => setTeamSize(ts.id)}
                    className={`flex items-center justify-between px-5 py-4 rounded-xl border transition-all duration-150 text-left ${teamSize === ts.id ? 'border-[#1D6B42] bg-[#EBF5EE]' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                    <span className={`text-[14px] font-medium ${teamSize === ts.id ? 'text-[#1D6B42]' : 'text-gray-900'}`}>{ts.label}</span>
                    <span className={`text-[12px] ${teamSize === ts.id ? 'text-[#1D6B42]/70' : 'text-gray-400'}`}>{ts.sub}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {step === 2 && (
            <div>
              <h3 className="text-[20px] font-semibold text-gray-900 mb-5">What stage are you at?</h3>
              <div className="grid grid-cols-1 gap-3">
                {STAGES.map(st => (
                  <button key={st.id} onClick={() => setStage(st.id)}
                    className={`flex items-center px-5 py-4 rounded-xl border transition-all duration-150 text-left ${stage === st.id ? 'border-[#1D6B42] bg-[#EBF5EE]' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                    <span className={`text-[14px] font-medium ${stage === st.id ? 'text-[#1D6B42]' : 'text-gray-900'}`}>{st.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {step === 3 && (
            <div>
              <h3 className="text-[20px] font-semibold text-gray-900 mb-5">Where do you operate?</h3>
              <div className="grid grid-cols-1 gap-3">
                {REGIONS.map(r => (
                  <button key={r.id} onClick={() => setRegion(r.id)}
                    className={`flex items-center justify-between px-5 py-4 rounded-xl border transition-all duration-150 text-left ${region === r.id ? 'border-[#1D6B42] bg-[#EBF5EE]' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                    <span className={`text-[14px] font-medium ${region === r.id ? 'text-[#1D6B42]' : 'text-gray-900'}`}>{r.label}</span>
                    {r.popular && <span className="text-[11px] font-semibold bg-[#1D6B42] text-white px-2 py-0.5 rounded-full">Most popular</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
          {step === 4 && (
            <form onSubmit={handleSubmit}>
              <h3 className="text-[20px] font-semibold text-gray-900 mb-1">Last step — where should we send your quote?</h3>
              <p className="text-[13px] text-gray-500 mb-5">You'll hear from us within 48 hours.</p>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com" autoFocus
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#1D6B42] transition-colors mb-4" />
              <button type="submit" disabled={!email.includes('@')}
                className="w-full bg-[#1D6B42] hover:bg-[#155232] disabled:opacity-40 text-white text-[14px] font-semibold rounded-xl py-3.5 transition-colors">
                Get my tailored quote →
              </button>
            </form>
          )}
        </div>
        {step < 4 && (
          <div className="flex items-center justify-between px-8 pb-7 pt-2">
            <button onClick={goPrev} disabled={step === 0} className="text-[13px] text-gray-400 hover:text-gray-700 disabled:opacity-0 transition-colors">← Back</button>
            <button onClick={goNext} disabled={!canNext()} className="bg-[#1D6B42] hover:bg-[#155232] disabled:opacity-40 text-white text-[13px] font-semibold rounded-full px-6 py-2.5 transition-colors">Next →</button>
          </div>
        )}
        {step === 4 && (
          <div className="flex items-center justify-start px-8 pb-7 pt-2">
            <button onClick={goPrev} className="text-[13px] text-gray-400 hover:text-gray-700 transition-colors">← Back</button>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Waitlist Modal ─────────────────────────────────────────── */
interface WaitlistModalProps {
  onClose: () => void
  title?: string
}

function WaitlistModal({ onClose, title = 'Get early access.' }: WaitlistModalProps) {
  const [wEmail, setWEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  function handleSubmit(e: React.FormEvent) { e.preventDefault(); setSubmitted(true) }
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"><X size={20} /></button>
        {submitted ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-[#EBF5EE] flex items-center justify-center mx-auto mb-4"><Check size={22} className="text-[#1D6B42]" /></div>
            <p className="text-[15px] font-medium text-gray-900">You're on the list — we'll be in touch.</p>
          </div>
        ) : (
          <>
            <h3 className="text-[22px] font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-[14px] text-gray-500 mb-6 leading-[1.6]">Be first to know when Gnocchi launches in your region.</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input type="email" value={wEmail} onChange={e => setWEmail(e.target.value)} placeholder="your@email.com" autoFocus
                className="border border-gray-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#1D6B42] transition-colors" />
              <button type="submit" disabled={!wEmail.includes('@')} className="bg-[#1D6B42] hover:bg-[#155232] disabled:opacity-40 text-white text-[14px] font-semibold rounded-xl py-3 transition-colors">Join waitlist</button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

/* ── Webinar Modal ──────────────────────────────────────────── */
function WebinarModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-700 transition-colors"><X size={20} /></button>
        <div className="bg-[#0F2419] aspect-video rounded-t-3xl flex flex-col items-center justify-center gap-3">
          <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
            <svg width="20" height="22" viewBox="0 0 20 22" fill="white"><path d="M2 2l16 9-16 9V2z"/></svg>
          </div>
          <span className="text-white/60 text-[12px]">Watch preview</span>
        </div>
        <div className="p-6">
          <h3 className="text-[20px] font-semibold text-gray-900 mb-1">Raising your Series A: The CFO Playbook</h3>
          <p className="text-[13px] text-gray-400 mb-4">Featuring Alex Chen, CFO · Acme Capital, Series E · Moderated by Gnocchi</p>
          {submitted ? (
            <div className="flex items-center gap-3 bg-[#EBF5EE] rounded-2xl px-4 py-3 mb-4">
              <Check size={18} className="text-[#1D6B42] flex-shrink-0" />
              <span className="text-[14px] text-[#1D6B42] font-medium">Check your inbox — recording on its way.</span>
            </div>
          ) : (
            <>
              <ul className="space-y-2 mb-5">
                {[
                  'What investors really look for in your financial model',
                  'How to structure your cap table before a raise',
                  'Insurance and risk — what due diligence teams check',
                ].map(b => (
                  <li key={b} className="flex items-start gap-2.5 text-[13px] text-gray-600">
                    <span className="w-4 h-4 rounded-full bg-[#EBF5EE] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="#1D6B42" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
                  className="flex-1 border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13px] outline-none focus:border-[#1D6B42] transition-colors" />
                <button onClick={() => email.includes('@') && setSubmitted(true)}
                  className="bg-[#1D6B42] hover:bg-[#155232] text-white text-[13px] font-medium rounded-xl px-4 py-2.5 transition-colors whitespace-nowrap">
                  Send me the recording →
                </button>
              </div>
              <p className="text-[11px] text-gray-400 mt-2">We'll email you the link + slides immediately.</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── API Access Modal ───────────────────────────────────────── */
function ApiAccessModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ company: '', email: '', platformType: '', mau: '', description: '' })
  const [submitted, setSubmitted] = useState(false)
  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))
  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"><X size={20} /></button>
        {submitted ? (
          <div className="text-center py-8">
            <div className="w-14 h-14 rounded-full bg-[#EBF5EE] flex items-center justify-center mx-auto mb-4"><Check size={26} className="text-[#1D6B42]" /></div>
            <h3 className="text-[20px] font-semibold text-gray-900 mb-2">Application received.</h3>
            <p className="text-[14px] text-gray-500">We'll be in touch within 2 business days.</p>
          </div>
        ) : (
          <>
            <h3 className="text-[20px] font-semibold text-gray-900 mb-5">Apply for API access</h3>
            <div className="flex flex-col gap-3">
              <input value={form.company} onChange={e => update('company', e.target.value)} placeholder="Company name"
                className="border border-gray-200 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-[#1D6B42] transition-colors" />
              <input value={form.email} onChange={e => update('email', e.target.value)} placeholder="Work email" type="email"
                className="border border-gray-200 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-[#1D6B42] transition-colors" />
              <select value={form.platformType} onChange={e => update('platformType', e.target.value)}
                className="border border-gray-200 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-[#1D6B42] transition-colors bg-white text-gray-700">
                <option value="">Platform type</option>
                {['SaaS', 'Marketplace', 'Fintech', 'Gig economy', 'Other'].map(t => <option key={t}>{t}</option>)}
              </select>
              <select value={form.mau} onChange={e => update('mau', e.target.value)}
                className="border border-gray-200 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-[#1D6B42] transition-colors bg-white text-gray-700">
                <option value="">Monthly active users</option>
                {['< 1,000', '1,000–10,000', '10,000–100,000', '100,000+'].map(t => <option key={t}>{t}</option>)}
              </select>
              <textarea value={form.description} onChange={e => update('description', e.target.value)} placeholder="Brief description of your platform and use case" rows={3}
                className="border border-gray-200 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-[#1D6B42] transition-colors resize-none" />
              <button onClick={() => form.company && form.email.includes('@') && setSubmitted(true)}
                className="bg-[#1D6B42] hover:bg-[#155232] text-white text-[14px] font-semibold rounded-xl py-3 transition-colors">
                Submit application →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/* ── Marquee Section ────────────────────────────────────────── */
const MARQUEE_LOGOS = [
  'Techstars', 'Seedcamp', 'Entrepreneur First', 'Antler',
  'Notion Capital', 'Y Combinator', 'Backed VC', 'LocalGlobe',
]
function MarqueeSection() {
  const allLogos = [...MARQUEE_LOGOS, ...MARQUEE_LOGOS]
  return (
    <div className="border-y border-gray-100 py-5 bg-white overflow-hidden">
      <div className="flex items-center">
        <div className="flex-shrink-0 pl-5 sm:pl-8 lg:pl-12 pr-6 text-[12px] text-gray-400 font-medium whitespace-nowrap">Trusted by founders from</div>
        <div className="flex-1 overflow-hidden min-w-0">
          <div className="marquee-track">
            {allLogos.map((logo, i) => (
              <span key={i} className="inline-block mx-8 text-[14px] font-semibold text-gray-300 hover:text-gray-500 transition-colors duration-200 whitespace-nowrap cursor-default select-none">{logo}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── 3D Hero Card ───────────────────────────────────────────── */
interface HeroCard3DProps { tiltX: number; tiltY: number }
function HeroCard3D({ tiltX, tiltY }: HeroCard3DProps) {
  const cardStyle: React.CSSProperties = {
    transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
    transition: 'transform 0.15s ease-out',
    boxShadow: `${tiltY * 1.5}px ${-tiltX * 1.5 + 8}px ${20 + Math.abs(tiltX) + Math.abs(tiltY)}px rgba(0,0,0,0.28)`,
  }
  const badgeStyle: React.CSSProperties = {
    transform: `perspective(1000px) rotateX(${tiltX * 0.5}deg) rotateY(${tiltY * 0.5}deg)`,
    transition: 'transform 0.15s ease-out',
  }
  return (
    <div className="relative flex flex-col items-center" style={{ width: 300 }}>
      <div className="absolute -top-4 -right-6 bg-white rounded-xl px-3.5 py-2.5 shadow-lg z-10 card-3d" style={badgeStyle}>
        <span className="text-[12px] font-semibold text-gray-900">£249/mo</span>
        <span className="text-[11px] text-gray-400 ml-1.5">Scale-up plan</span>
      </div>
      <div className="w-full rounded-2xl overflow-hidden card-3d" style={{ ...cardStyle, background: 'linear-gradient(145deg, #0F2419 0%, #1A3D2A 100%)' }}>
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[12px] font-medium text-white/80">Active</span>
          </div>
          <span className="text-[12px] font-semibold text-white">Gnocchi Coverage</span>
        </div>
        <div className="px-5 py-4">
          <p className="text-[11px] text-white/50 uppercase tracking-wider mb-3">Coverage overview</p>
          <ul className="space-y-2.5 mb-4">
            {[{ label: 'Professional indemnity', active: true }, { label: 'Cyber & data breach', active: true }, { label: 'Directors & officers', active: true }].map(item => (
              <li key={item.label} className="flex items-center gap-2.5">
                <span className="w-4 h-4 rounded-full bg-[#1D6B42] flex items-center justify-center flex-shrink-0"><Check size={9} className="text-white" /></span>
                <span className="text-[12px] text-[#A8D4B8]">{item.label}</span>
              </li>
            ))}
            <li className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0" />
                <span className="text-[12px] text-white/40">Product liability</span>
              </div>
              <span className="text-[11px] text-[#1D6B42] font-medium bg-[#1D6B42]/20 px-2 py-0.5 rounded-full">+ Add</span>
            </li>
          </ul>
          <div className="border-t border-white/10 pt-3.5 space-y-1.5">
            <div className="flex justify-between"><span className="text-[11px] text-white/40">Plan</span><span className="text-[11px] text-white/70 font-medium">Scale-up (Seed)</span></div>
            <div className="flex justify-between"><span className="text-[11px] text-white/40">Team</span><span className="text-[11px] text-white/70 font-medium">18 people</span></div>
            <div className="flex justify-between"><span className="text-[11px] text-white/40">Next renewal</span><span className="text-[11px] text-white/70 font-medium">Jan 2027</span></div>
          </div>
          <button className="mt-4 w-full flex items-center justify-center gap-1.5 text-[12px] text-[#A8D4B8] border border-[#A8D4B8]/30 rounded-lg py-2 hover:bg-white/5 transition-colors">
            View policy <ArrowRight size={11} />
          </button>
        </div>
      </div>
      <div className="absolute -bottom-4 -left-6 bg-white rounded-xl px-3.5 py-2.5 shadow-lg z-10 card-3d" style={badgeStyle}>
        <span className="text-[12px] font-semibold text-[#1D6B42]">FCA Authorised</span>
        <span className="text-[11px] text-gray-400 ml-1">✓</span>
      </div>
    </div>
  )
}

/* ── Pricing Section ────────────────────────────────────────── */
function PricingSection({ onQuote, onWaitlist }: { onQuote: () => void; onWaitlist: (t?: string) => void }) {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')

  const plans = [
    {
      name: 'Founder',
      price: billing === 'monthly' ? 89 : 85,
      period: '/mo',
      annualNote: billing === 'annual' ? 'billed annually · save 5%' : null,
      forLine: 'Solo founders, pre-seed, 1–10 people',
      badge: null,
      dark: false,
      features: [
        'PI £500k · PL £10M · EL £10M',
        'Basic cyber £100k',
        'FCA & ICO compliance docs',
        'Policy portal access',
        '48h quote turnaround',
      ],
      cta: 'Start with Founder',
      variant: 'green' as const,
    },
    {
      name: 'Scale-up',
      price: billing === 'monthly' ? 249 : 237,
      period: '/mo',
      annualNote: billing === 'annual' ? 'billed annually · save 5%' : null,
      forLine: 'Seed stage, 10–60 people',
      badge: 'Most popular',
      dark: true,
      features: [
        'Everything in Founder',
        'D&O cover £2M',
        'Enhanced cyber £2M',
        'GDPR breach legal support',
        'Investor DD document pack',
        'IP & contract defence £500k',
        'Priority claims team',
      ],
      cta: 'Start with Scale-up',
      variant: 'dark' as const,
    },
  ]

  const tableRows = [
    { label: 'Professional indemnity', founder: '£500k', scaleup: '£2M', custom: 'Bespoke' },
    { label: 'Public liability', founder: '£10M', scaleup: '£10M', custom: 'Bespoke' },
    { label: "Employers' liability", founder: '£10M', scaleup: '£10M', custom: 'Bespoke' },
    { label: 'Cyber cover', founder: '£100k', scaleup: '£2M', custom: 'Bespoke' },
    { label: 'D&O', founder: '—', scaleup: '£2M', custom: 'Bespoke' },
    { label: 'GDPR support', founder: '—', scaleup: true, custom: true },
    { label: 'Investor DD pack', founder: '—', scaleup: true, custom: true },
    { label: 'IP defence', founder: 'Add-on', scaleup: '£500k', custom: 'Bespoke' },
    { label: 'Key person', founder: 'Add-on', scaleup: 'Add-on', custom: true },
    { label: 'Multi-jurisdiction', founder: '—', scaleup: 'Add-on', custom: true },
    { label: 'White-label API', founder: '—', scaleup: '—', custom: true },
    { label: 'Dedicated manager', founder: '—', scaleup: '—', custom: true },
  ]

  function cellRender(val: string | boolean) {
    if (val === true) return <span className="text-[#1D6B42] font-semibold text-[15px]">✓</span>
    if (val === '—') return <span className="text-gray-300 text-[15px]">—</span>
    if (val === 'Add-on') return <span className="text-[11px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Add-on</span>
    return <span className="text-[13px] text-gray-700 font-medium">{val}</span>
  }

  return (
    <section id="plans" className="bg-[#F5F5F5] pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 lg:pb-28">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        <Badge num="2" label="Coverage plans" light />
        <h2 className="font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 mb-4" style={{ fontSize: 'clamp(1.75rem, 7vw, 4.2rem)' }}>
          Cover that grows<br />with you.
        </h2>
        <p className="text-[15px] sm:text-[16px] text-gray-500 mb-8 max-w-md leading-[1.6]">
          Start with the essentials. Upgrade as you scale. No re-application, no admin.
        </p>

        {/* Billing toggle */}
        <div className="flex items-center gap-3 mb-10 sm:mb-14">
          <button onClick={() => setBilling('monthly')}
            className={`text-[13px] font-medium px-4 py-2 rounded-full border transition-all ${billing === 'monthly' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>
            Monthly
          </button>
          <button onClick={() => setBilling('annual')}
            className={`flex items-center gap-2 text-[13px] font-medium px-4 py-2 rounded-full border transition-all ${billing === 'annual' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>
            Annual
            {billing === 'annual' && <span className="text-[11px] bg-[#EBF5EE] text-[#1D6B42] px-2 py-0.5 rounded-full font-semibold">Save 5%</span>}
            {billing === 'monthly' && <span className="text-[11px] bg-[#EBF5EE] text-[#1D6B42] px-2 py-0.5 rounded-full font-semibold">Save 5%</span>}
          </button>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-10">
          {plans.map(plan => (
            <div key={plan.name} className={`rounded-2xl p-6 flex flex-col ${plan.dark ? 'bg-[#0F2419]' : 'bg-white border border-gray-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[12px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full ${plan.dark ? 'text-[#A8D4B8] bg-[#1D6B42]/30' : 'text-[#1D6B42] bg-[#EBF5EE]'}`}>
                  {plan.name}
                </span>
                {plan.badge && <span className="text-[11px] font-semibold bg-[#1D6B42] text-white px-2 py-0.5 rounded-full">{plan.badge}</span>}
              </div>
              <div className="mb-1">
                <span className={`text-4xl font-bold tracking-tight ${plan.dark ? 'text-white' : 'text-gray-900'}`}>£{plan.price}</span>
                <span className={`text-sm ml-1 ${plan.dark ? 'text-[#5A8A6A]' : 'text-gray-400'}`}>{plan.period}</span>
              </div>
              {plan.annualNote && <p className="text-[11px] text-[#A8D4B8] mb-3">{plan.annualNote}</p>}
              <p className={`text-[12px] mb-5 mt-2 ${plan.dark ? 'text-[#5A8A6A]' : 'text-gray-400'}`}>{plan.forLine}</p>
              <ul className="space-y-2.5 flex-1 mb-6">
                {plan.features.map(f => (
                  <li key={f} className={`flex items-center gap-2 text-[13px] ${plan.dark ? 'text-[#A8D4B8]' : 'text-gray-600'}`}>
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${plan.dark ? 'bg-[#1D6B42]/40' : 'bg-[#EBF5EE]'}`}>
                      <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke={plan.dark ? '#A8D4B8' : '#1D6B42'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <RollButton text={plan.cta} variant={plan.dark ? 'dark' : 'green'} size="sm" onClick={onQuote} />
            </div>
          ))}

          {/* Custom card */}
          <div className="rounded-2xl p-6 flex flex-col bg-gray-900 border border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] font-bold tracking-wider uppercase text-gray-300 bg-gray-800 px-2.5 py-1 rounded-full">Custom</span>
            </div>
            <div className="mb-1">
              <span className="text-2xl font-bold tracking-tight text-white">Talk to us</span>
            </div>
            <p className="text-[12px] text-gray-500 mb-5 mt-2">Series B+, 60+ people, multi-jurisdiction</p>
            <ul className="space-y-2.5 flex-1 mb-6">
              {['Bespoke underwriting', 'White-label option for platforms', 'Dedicated account manager', 'SLA guarantees', 'Multi-jurisdiction coverage'].map(f => (
                <li key={f} className="flex items-center gap-2 text-[13px] text-gray-400">
                  <span className="w-4 h-4 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <RollButton text="Get in touch" variant="green" size="sm" onClick={() => onWaitlist('Get in touch')} />
          </div>
        </div>

        {/* Comparison table */}
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 mb-6">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-4 text-[12px] font-semibold text-gray-400 uppercase tracking-wider w-[40%]">Feature</th>
                  <th className="px-4 py-4 text-center text-[13px] font-semibold text-gray-900">Founder</th>
                  <th className="px-4 py-4 text-center text-[13px] font-semibold text-[#1D6B42]">Scale-up</th>
                  <th className="px-4 py-4 text-center text-[13px] font-semibold text-gray-900">Custom</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, i) => (
                  <tr key={row.label} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                    <td className="px-6 py-3.5 text-[13px] text-gray-700 font-medium">{row.label}</td>
                    <td className="px-4 py-3.5 text-center">{cellRender(row.founder)}</td>
                    <td className="px-4 py-3.5 text-center">{cellRender(row.scaleup)}</td>
                    <td className="px-4 py-3.5 text-center">{cellRender(row.custom)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  )
}

/* ── API Docs Page ──────────────────────────────────────────── */
function ApiDocsPage({ onBack, onApiAccess }: { onBack: () => void; onApiAccess: () => void }) {
  const [activeSection, setActiveSection] = useState('overview')

  const sidebarSections = [
    { title: 'Getting started', items: [
      { id: 'overview', label: 'Overview' },
      { id: 'auth', label: 'Authentication' },
      { id: 'rate-limits', label: 'Rate limits' },
    ]},
    { title: 'Core APIs', items: [
      { id: 'quote-api', label: 'Quote API' },
      { id: 'policy-api', label: 'Policy API' },
      { id: 'claims-api', label: 'Claims API' },
      { id: 'webhooks', label: 'Webhooks' },
    ]},
    { title: 'Distribution', items: [
      { id: 'partner-setup', label: 'Partner setup' },
      { id: 'user-flows', label: 'User flows' },
      { id: 'white-label', label: 'White-label' },
    ]},
    { title: 'SDKs', items: [
      { id: 'nodejs', label: 'Node.js' },
      { id: 'python', label: 'Python' },
      { id: 'go', label: 'Go' },
      { id: 'rest', label: 'REST' },
    ]},
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-56 fixed top-[68px] bottom-0 left-0 bg-white border-r border-gray-100 overflow-y-auto py-6 px-4 z-10">
          {sidebarSections.map(section => (
            <div key={section.title} className="mb-6">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">{section.title}</p>
              {section.items.map(item => (
                <button key={item.id} onClick={() => setActiveSection(item.id)}
                  className={`w-full text-left px-2 py-1.5 rounded-lg text-[13px] transition-colors mb-0.5 ${activeSection === item.id ? 'bg-[#EBF5EE] text-[#1D6B42] font-medium' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </aside>

        {/* Main content */}
        <main className="md:ml-56 flex-1 px-5 sm:px-8 lg:px-12 py-10 max-w-4xl">
          <button onClick={onBack} className="flex items-center gap-1.5 text-[13px] text-gray-400 hover:text-gray-700 transition-colors mb-8">
            <ArrowRight size={14} className="rotate-180" /> Back
          </button>

          {/* Hero */}
          <div className="mb-12">
            <span className="text-[12px] font-semibold text-[#1D6B42] bg-[#EBF5EE] px-3 py-1 rounded-full">Developer API — Beta</span>
            <h1 className="text-[2.5rem] sm:text-[3.5rem] font-medium tracking-tight text-gray-900 mt-4 mb-4 leading-[1.08]">Distribute insurance<br />at scale.</h1>
            <p className="text-[16px] text-gray-500 leading-[1.7] max-w-xl mb-8">
              Embed Gnocchi's underwriting engine directly into your platform. Power insurance for your users — freelancers, founders, gig workers — without building it yourself.
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[12px] text-gray-400 mr-2">Used by platforms like</span>
              {['Stripe Connect', 'Deel', 'DoorDash', 'Contra', 'Rippling'].map(p => (
                <span key={p} className="text-[12px] font-semibold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{p}</span>
              ))}
            </div>
          </div>

          {/* Blurred code sections */}
          <div className="relative mb-12">
            <h2 className="text-[22px] font-semibold text-gray-900 mb-4">Authentication</h2>
            <div className="relative rounded-2xl overflow-hidden">
              <div className="filter blur-[3px] select-none pointer-events-none">
                <div className="bg-[#1a1a2e] rounded-2xl p-6 font-mono text-[13px] leading-[1.8]">
                  <div className="text-[#7c85c7]">POST</div>
                  <div className="text-[#a8d4b8] mb-3">https://api.gnocchi.insure/v1/quote</div>
                  <div className="text-gray-500 mb-1">Authorization: <span className="text-[#ffd700]">Bearer gno_live_...</span></div>
                  <div className="text-gray-500 mt-3">{'{'}</div>
                  <div className="pl-4 text-[#a8d4b8]">"sector": <span className="text-[#ffd700]">"fintech"</span>,</div>
                  <div className="pl-4 text-[#a8d4b8]">"team_size": <span className="text-white">12</span>,</div>
                  <div className="pl-4 text-[#a8d4b8]">"stage": <span className="text-[#ffd700]">"seed"</span>,</div>
                  <div className="pl-4 text-[#a8d4b8]">"jurisdiction": <span className="text-white">["GB", "NL"]</span>,</div>
                  <div className="pl-4 text-[#a8d4b8]">"coverage_types": <span className="text-white">["pi", "cyber", "do"]</span></div>
                  <div className="text-gray-500">{'}'}</div>
                </div>
              </div>
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center rounded-2xl">
                <div className="bg-white rounded-2xl shadow-xl p-6 max-w-xs w-full text-center mx-4">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                    <Lock size={20} className="text-gray-600" />
                  </div>
                  <h3 className="text-[16px] font-semibold text-gray-900 mb-2">API access is invite-only during beta.</h3>
                  <p className="text-[13px] text-gray-500 mb-4 leading-[1.6]">Apply for access to get your API key, sandbox environment, and integration docs.</p>
                  <button onClick={onApiAccess} className="w-full bg-[#1D6B42] hover:bg-[#155232] text-white text-[13px] font-semibold rounded-xl py-3 transition-colors">
                    Apply for API access
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quote API - also blurred */}
          <div className="relative mb-12">
            <h2 className="text-[22px] font-semibold text-gray-900 mb-4">Quote API</h2>
            <div className="relative rounded-2xl overflow-hidden">
              <div className="filter blur-[3px] select-none pointer-events-none">
                <div className="bg-[#1a1a2e] rounded-2xl p-6 font-mono text-[13px] leading-[1.8]">
                  <div className="text-[#7c85c7] mb-1">GET <span className="text-[#a8d4b8]">/v1/quotes/{'{quote_id}'}</span></div>
                  <div className="text-[#7c85c7] mb-1">POST <span className="text-[#a8d4b8]">/v1/quotes</span></div>
                  <div className="text-[#7c85c7]">PATCH <span className="text-[#a8d4b8]">/v1/quotes/{'{quote_id}'}/accept</span></div>
                </div>
              </div>
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] rounded-2xl" />
            </div>
          </div>

          {/* Benefits */}
          <div className="mb-12">
            <h2 className="text-[22px] font-semibold text-gray-900 mb-6">Platform benefits</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { title: 'Real-time quotes', desc: 'Sub-second pricing engine for any UK/EU startup profile' },
                { title: 'Instant policy issuance', desc: 'Automate policy creation and delivery for your users' },
                { title: 'Webhook events', desc: 'Get notified on policy changes, renewals, and claims' },
              ].map(b => (
                <div key={b.title} className="bg-[#F5F5F5] rounded-2xl p-5">
                  <h3 className="text-[15px] font-semibold text-gray-900 mb-2">{b.title}</h3>
                  <p className="text-[13px] text-gray-500 leading-[1.6]">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Partners */}
          <div className="bg-[#0F2419] rounded-2xl p-8">
            <h2 className="text-[22px] font-semibold text-white mb-2">Built for platforms</h2>
            <p className="text-[14px] text-[#5A8A6A] mb-6">Embed insurance into any platform that serves knowledge workers or businesses.</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'Freelancer marketplaces (Contra, Deel)',
                'Gig economy platforms',
                'Startup accelerators & communities',
                'Banking-as-a-service providers',
                'HR and payroll platforms',
              ].map(u => (
                <li key={u} className="flex items-center gap-2.5 text-[13px] text-[#A8D4B8]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1D6B42] flex-shrink-0" />{u}
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </div>
  )
}

/* ── FAQ Page ───────────────────────────────────────────────── */
function FaqPage({ onBack }: { onBack: () => void }) {
  const [openFaq, setOpenFaq] = useState<string | null>(null)

  const sections = [
    {
      title: 'How it works',
      faqs: [
        { id: 'how-works', q: 'How does Gnocchi work?', a: 'We work with FCA-authorised underwriters to provide startup-focused business insurance. You describe your company, we recommend the right cover, you get a policy.' },
        { id: 'underwriters', q: 'Who underwrites my policy?', a: "We partner with Lloyd's of London market underwriters and specialist UK carriers. Gnocchi is an FCA-registered insurance intermediary (firm reference XXXXXX)." },
        { id: 'how-long', q: 'How long does it take to get covered?', a: 'Most founders receive their policy documentation within 48 hours of accepting a quote.' },
        { id: 'cancel', q: 'Can I cancel anytime?', a: 'Yes. Policies are monthly rolling with 30 days notice, or annual with a pro-rata refund.' },
      ],
    },
    {
      title: 'Quotes & pricing',
      faqs: [
        { id: 'quote-calc', q: 'How is my quote calculated?', a: 'Based on your sector, team size, funding stage, and jurisdiction. Our underwriters assess your risk profile and return a personalised price.' },
        { id: 'prices-exact', q: 'Are the prices on the website exact?', a: 'The prices shown (£89, £249/mo) are indicative starting prices. Your final quote may vary based on your specific profile.' },
        { id: 'annual', q: 'Do you offer annual billing?', a: 'Yes, and you save 5% vs monthly. Annual policies also lock in your rate for 12 months.' },
        { id: 'bundle', q: 'Can I bundle multiple products?', a: 'Yes — bundle 2 or more cover types and receive 5% off your total premium automatically.' },
      ],
    },
    {
      title: 'Coverage & claims',
      faqs: [
        { id: 'pi', q: 'What is professional indemnity insurance?', a: 'It covers claims that your work caused financial loss to a client — e.g. a software bug that cost a customer revenue.' },
        { id: 'el', q: "Do I need employers' liability?", a: "If you have employees in the UK, yes — it's a legal requirement. Fines for non-compliance are up to £2,500/day." },
        { id: 'cyber', q: 'What does cyber cover include?', a: 'Data breach response costs, ransomware recovery, regulatory fines (including ICO), and third-party liability from a cyber event.' },
        { id: 'claim', q: 'How do I make a claim?', a: 'Contact your claims team via the policy portal. Scale-up plan holders get a dedicated claims handler within 4 hours.' },
      ],
    },
    {
      title: 'Regulation & compliance',
      faqs: [
        { id: 'fca', q: 'Is Gnocchi FCA regulated?', a: 'Yes. Gnocchi Insurance Ltd is authorised and regulated by the Financial Conduct Authority (FCA).' },
        { id: 'gdpr', q: 'Is my data GDPR compliant?', a: 'All data is processed in accordance with UK GDPR and the Data Protection Act 2018. We are registered with the ICO.' },
        { id: 'eu', q: 'Can you cover EU operations?', a: 'Yes. We offer cover across the EU through our partnerships with EU-authorised carriers. Policies are dual-jurisdiction where required.' },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-10 max-w-3xl">
        <button onClick={onBack} className="flex items-center gap-1.5 text-[13px] text-gray-400 hover:text-gray-700 transition-colors mb-10">
          <ArrowRight size={14} className="rotate-180" /> Back
        </button>
        <h1 className="text-[2.5rem] sm:text-[3.5rem] font-medium tracking-tight text-gray-900 mb-3 leading-[1.08]">Common questions.</h1>
        <p className="text-[16px] text-gray-500 mb-12">Everything founders ask us, answered plainly.</p>
        <div className="space-y-10">
          {sections.map(section => (
            <div key={section.title}>
              <h2 className="text-[13px] font-semibold text-gray-400 uppercase tracking-wider mb-4">{section.title}</h2>
              <div className="border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-100">
                {section.faqs.map(faq => (
                  <div key={faq.id}>
                    <button
                      onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                      className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-[15px] font-medium text-gray-900 pr-4">{faq.q}</span>
                      {openFaq === faq.id ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
                    </button>
                    {openFaq === faq.id && (
                      <div className="px-6 pb-5 bg-gray-50/50">
                        <p className="text-[14px] text-gray-600 leading-[1.7]">{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Nav component (shared across pages) ────────────────────── */
function Nav({
  currentPage, setCurrentPage, londonTime, onQuote, onWaitlist, menuOpen, setMenuOpen,
}: {
  currentPage: 'home' | 'api' | 'faq'
  setCurrentPage: (p: 'home' | 'api' | 'faq') => void
  londonTime: string
  onQuote: () => void
  onWaitlist: (t?: string) => void
  menuOpen: boolean
  setMenuOpen: (v: boolean | ((prev: boolean) => boolean)) => void
}) {
  const isHome = currentPage === 'home'
  return (
    <div className="relative z-20 max-w-[1440px] mx-auto w-full p-2 sm:p-3">
      <nav className="bg-white rounded-full flex items-center justify-between" style={{ padding: '5px' }}>
        <div className="flex items-center gap-4 sm:gap-6 pl-1">
          <button onClick={() => setCurrentPage('home')} className="flex-shrink-0">
            <GnocchiLogo size={28} />
          </button>
          {isHome && (
            <div className="hidden md:flex items-center gap-6">
              <button onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })} className="text-[14px] text-gray-900 hover:text-gray-500 transition-colors duration-300">Plans</button>
              <button onClick={() => document.getElementById('coverage')?.scrollIntoView({ behavior: 'smooth' })} className="text-[14px] text-gray-900 hover:text-gray-500 transition-colors duration-300">Coverage</button>
              <button onClick={() => document.getElementById('advisor')?.scrollIntoView({ behavior: 'smooth' })} className="text-[14px] text-gray-900 hover:text-gray-500 transition-colors duration-300">Advisors</button>
              <button onClick={() => onWaitlist('Get in touch')} className="text-[14px] text-gray-900 hover:text-gray-500 transition-colors duration-300">Contact</button>
              <button onClick={() => setCurrentPage('api')} className="text-[14px] text-gray-900 hover:text-gray-500 transition-colors duration-300">API</button>
              <button onClick={() => setCurrentPage('faq')} className="text-[14px] text-gray-900 hover:text-gray-500 transition-colors duration-300">FAQ</button>
            </div>
          )}
          {!isHome && (
            <div className="hidden md:flex items-center gap-4">
              <button onClick={() => setCurrentPage('home')} className="flex items-center gap-1.5 text-[14px] text-gray-600 hover:text-gray-900 transition-colors duration-300">
                <ArrowRight size={13} className="rotate-180" /> Home
              </button>
              <button onClick={() => setCurrentPage('api')} className={`text-[14px] transition-colors duration-300 ${currentPage === 'api' ? 'text-[#1D6B42] font-semibold' : 'text-gray-500 hover:text-gray-900'}`}>API</button>
              <button onClick={() => setCurrentPage('faq')} className={`text-[14px] transition-colors duration-300 ${currentPage === 'faq' ? 'text-[#1D6B42] font-semibold' : 'text-gray-500 hover:text-gray-900'}`}>FAQ</button>
            </div>
          )}
        </div>
        <div className="hidden md:flex items-center gap-4 pr-0.5">
          <span className="hidden lg:block text-[13px] text-gray-600">Now covering UK &amp; EU founders</span>
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-gray-600" />
            <span className="text-[13px] text-gray-600">{londonTime} in London</span>
          </div>
          <button className="group flex items-center gap-2 bg-gray-900 hover:bg-[#1D6B42] text-white text-[13px] font-medium rounded-full pl-5 pr-2 py-2 transition-colors duration-300" onClick={onQuote}>
            <div className="overflow-hidden" style={{ height: 20 }}>
              <div className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-1/2">
                <span>Get a free quote</span>
                <span>Get a free quote</span>
              </div>
            </div>
            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0">
              <ArrowRight size={12} className="text-[#1D6B42] transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45" />
            </div>
          </button>
        </div>
        <div className="flex md:hidden items-center pr-0.5">
          <button className="flex items-center gap-1.5 bg-gray-900 text-white text-[13px] font-medium rounded-full pl-3 pr-2 py-1.5" onClick={() => setMenuOpen(v => !v)}>
            {menuOpen ? <X size={15} /> : <Menu size={15} />}
            <span>{menuOpen ? 'Close' : 'Menu'}</span>
          </button>
        </div>
      </nav>
    </div>
  )
}

/* ── Advisor Chat (guided flow — no API key required) ────────── */
type AnswerMap = { sector?: string; teamSize?: string; stage?: string }

interface FlowOption {
  label: string
  answerKey?: keyof AnswerMap
  answerValue?: string
  next: string
}

interface FlowMsg {
  role: 'advisor' | 'user'
  text: string
  options?: FlowOption[]
  planCard?: { name: string; price: number; features: string[]; dark: boolean }
  isEmail?: boolean
}

function getRecommendation(answers: AnswerMap): { name: string; price: number; features: string[]; dark: boolean } {
  const isScaleUp =
    answers.teamSize === 'growing' ||
    answers.teamSize === 'scaling' ||
    answers.stage === 'seriesa' ||
    answers.stage === 'seriesb'
  if (isScaleUp) {
    return {
      name: 'Scale-up', price: 249, dark: true,
      features: [
        'Everything in Founder',
        'D&O cover £2M',
        'Enhanced cyber £2M',
        'GDPR breach legal support',
        'Investor DD document pack',
      ],
    }
  }
  return {
    name: 'Founder', price: 89, dark: false,
    features: [
      'PI £500k · PL £10M · EL £10M',
      'Basic cyber £100k',
      'FCA & ICO compliance docs',
      'Policy portal access',
      '48h quote turnaround',
    ],
  }
}

function getNextMessages(nextStep: string, selectedLabel: string, answers: AnswerMap): FlowMsg[] {
  const userMsg: FlowMsg = { role: 'user', text: selectedLabel }

  if (nextStep === 'team') {
    return [userMsg, {
      role: 'advisor',
      text: `Got it — ${answers.sector}. How many people are on your team right now?`,
      options: [
        { label: 'Solo / co-founder', answerKey: 'teamSize', answerValue: 'solo', next: 'stage' },
        { label: 'Small team (3–10)', answerKey: 'teamSize', answerValue: 'small', next: 'stage' },
        { label: 'Growing (11–30)', answerKey: 'teamSize', answerValue: 'growing', next: 'stage' },
        { label: 'Scaling (31+)', answerKey: 'teamSize', answerValue: 'scaling', next: 'stage' },
      ],
    }]
  }

  if (nextStep === 'stage') {
    return [userMsg, {
      role: 'advisor',
      text: 'Perfect. What stage are you at?',
      options: [
        { label: 'Pre-seed / Bootstrapped', answerKey: 'stage', answerValue: 'preseed', next: 'result' },
        { label: 'Seed / Angel-backed', answerKey: 'stage', answerValue: 'seed', next: 'result' },
        { label: 'Series A', answerKey: 'stage', answerValue: 'seriesa', next: 'result' },
        { label: 'Series B+', answerKey: 'stage', answerValue: 'seriesb', next: 'result' },
      ],
    }]
  }

  if (nextStep === 'result') {
    const rec = getRecommendation(answers)
    return [userMsg, {
      role: 'advisor',
      text: `Based on your profile, here's what I'd recommend:`,
      planCard: rec,
      options: [
        { label: 'Get a full quote →', next: 'email' },
        { label: 'Tell me more first', next: 'moreinfo' },
      ],
    }]
  }

  if (nextStep === 'moreinfo') {
    const rec = getRecommendation(answers)
    const detail = rec.name === 'Scale-up'
      ? `The Scale-up plan at £249/mo covers Directors & Officers up to £2M, enhanced cyber up to £2M, GDPR breach legal support, and an Investor Due Diligence document pack — everything you'd need going into a raise.`
      : `The Founder plan at £89/mo covers professional indemnity up to £500k, public and employers' liability at £10M, plus basic cyber cover, FCA compliance docs, and portal access — solid all-round cover for early-stage teams.`
    return [userMsg, {
      role: 'advisor',
      text: detail,
      options: [
        { label: 'Yes, get my quote', next: 'email' },
        { label: 'Maybe later', next: 'done_soft' },
      ],
    }]
  }

  if (nextStep === 'email') {
    return [userMsg, {
      role: 'advisor',
      text: `Perfect — drop your email below and we'll have your personalised quote ready within 48 hours.`,
      isEmail: true,
    }]
  }

  if (nextStep === 'done_soft') {
    return [userMsg, {
      role: 'advisor',
      text: `No problem at all! When you're ready, just tap "Get a quote" at the top. We're here whenever you need us.`,
    }]
  }

  return [userMsg]
}

function AdvisorChat({ onQuote }: { onQuote: () => void }) {
  const [messages, setMessages] = useState<FlowMsg[]>([{
    role: 'advisor',
    text: "Hi! I'm your Gnocchi coverage advisor. Let's find the right cover for your startup in a few quick steps. What best describes what you do?",
    options: [
      { label: 'SaaS / B2B', answerKey: 'sector', answerValue: 'SaaS / B2B', next: 'team' },
      { label: 'Fintech', answerKey: 'sector', answerValue: 'Fintech', next: 'team' },
      { label: 'E-commerce', answerKey: 'sector', answerValue: 'E-commerce', next: 'team' },
      { label: 'Health Tech', answerKey: 'sector', answerValue: 'Health Tech', next: 'team' },
      { label: 'Hardware / Deep Tech', answerKey: 'sector', answerValue: 'Hardware / Deep Tech', next: 'team' },
      { label: 'Other', answerKey: 'sector', answerValue: 'Other', next: 'team' },
    ],
  }])
  const [answers, setAnswers] = useState<AnswerMap>({})
  const [emailInput, setEmailInput] = useState('')
  const [emailDone, setEmailDone] = useState(false)
  const [disabledIdxs, setDisabledIdxs] = useState<Set<number>>(new Set())
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleOption(msgIdx: number, opt: FlowOption) {
    if (disabledIdxs.has(msgIdx)) return
    setDisabledIdxs(prev => new Set([...prev, msgIdx]))
    if (opt.next === 'quote_form') { onQuote(); return }
    const newAnswers = opt.answerKey ? { ...answers, [opt.answerKey]: opt.answerValue } : answers
    setAnswers(newAnswers)
    const nextMsgs = getNextMessages(opt.next, opt.label, newAnswers)
    setTimeout(() => setMessages(prev => [...prev, ...nextMsgs]), 280)
  }

  function submitEmail(e: React.FormEvent) {
    e.preventDefault()
    const safe = emailInput.trim()
    if (!safe.includes('@') || safe.includes('<') || safe.includes('>')) return
    try { localStorage.setItem('gno_lead_email', safe) } catch { /* ignore */ }
    setEmailDone(true)
    setTimeout(() => setMessages(prev => [
      ...prev,
      { role: 'user', text: safe },
      {
        role: 'advisor',
        text: `You're on the list! We'll be in touch at ${safe} within 48 hours.`,
        options: [{ label: 'View full quote form →', next: 'quote_form' }],
      },
    ]), 300)
  }

  return (
    <div className="flex flex-col border border-gray-100 rounded-2xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.06)]" style={{ height: 520 }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 bg-white flex-shrink-0">
        <div className="flex-shrink-0"><GnocchiLogo size={22} /></div>
        <div>
          <div className="text-[13px] font-semibold text-gray-900">Gnocchi advisor</div>
          <div className="flex items-center gap-1.5 text-[12px] text-gray-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            Online now
          </div>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-[11px] text-gray-400 border border-gray-100 rounded-full px-3 py-1">
          <Shield size={10} />
          <span>Secure</span>
        </div>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50" style={{ scrollbarWidth: 'thin' }}>
        {messages.map((msg, idx) => (
          <div key={idx}>
            <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
              <div className={`max-w-[84%] px-4 py-3 rounded-2xl text-[13px] leading-[1.6] ${
                msg.role === 'user'
                  ? 'bg-gray-900 text-white rounded-br-sm'
                  : 'bg-white text-gray-800 rounded-bl-sm border border-gray-100 shadow-sm'
              }`}>
                {msg.text}
              </div>
            </div>
            {/* Inline plan card */}
            {msg.planCard && (
              <div className="flex justify-start mb-2">
                <div className={`rounded-2xl p-4 max-w-[84%] w-full ${msg.planCard.dark ? 'bg-[#0F2419]' : 'bg-white border border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full ${msg.planCard.dark ? 'text-[#A8D4B8] bg-[#1D6B42]/30' : 'text-[#1D6B42] bg-[#EBF5EE]'}`}>
                      {msg.planCard.name}
                    </span>
                    {msg.planCard.name === 'Scale-up' && (
                      <span className="text-[10px] font-semibold bg-[#1D6B42] text-white px-2 py-0.5 rounded-full">Most popular</span>
                    )}
                  </div>
                  <div className="mb-3">
                    <span className={`text-2xl font-bold ${msg.planCard.dark ? 'text-white' : 'text-gray-900'}`}>£{msg.planCard.price}</span>
                    <span className={`text-xs ml-1 ${msg.planCard.dark ? 'text-[#5A8A6A]' : 'text-gray-400'}`}>/mo</span>
                  </div>
                  <ul className="space-y-1.5">
                    {msg.planCard.features.map(f => (
                      <li key={f} className={`flex items-start gap-2 text-[12px] ${msg.planCard!.dark ? 'text-[#A8D4B8]' : 'text-gray-600'}`}>
                        <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${msg.planCard!.dark ? 'bg-[#1D6B42]/40' : 'bg-[#EBF5EE]'}`}>
                          <svg width="7" height="7" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke={msg.planCard!.dark ? '#A8D4B8' : '#1D6B42'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {/* Email capture */}
            {msg.isEmail && !emailDone && (
              <div className="flex justify-start mb-2">
                <form onSubmit={submitEmail} className="flex gap-2 max-w-[84%] w-full">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={e => setEmailInput(e.target.value)}
                    placeholder="your@email.com"
                    autoFocus
                    className="flex-1 text-[13px] bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#1D6B42] transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!emailInput.includes('@')}
                    className="text-[13px] font-medium bg-[#1D6B42] hover:bg-[#155232] disabled:opacity-40 text-white rounded-xl px-4 py-2.5 transition-colors whitespace-nowrap"
                  >
                    Send →
                  </button>
                </form>
              </div>
            )}
            {/* Option buttons */}
            {msg.options && msg.options.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-1">
                {msg.options.map((opt, oi) => (
                  <button
                    key={oi}
                    onClick={() => handleOption(idx, opt)}
                    disabled={disabledIdxs.has(idx)}
                    className={`text-[12px] font-medium rounded-full px-3.5 py-1.5 border transition-all duration-150 ${
                      disabledIdxs.has(idx)
                        ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-default'
                        : 'border-[#1D6B42]/40 bg-[#EBF5EE] text-[#1D6B42] hover:bg-[#1D6B42] hover:text-white cursor-pointer'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-gray-100 bg-white flex-shrink-0 flex items-center gap-2 text-[11px] text-gray-400">
        <Shield size={10} />
        <span>Tap an option above to continue · No data stored until you submit your email</span>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────── */
/*  MAIN APP                                                       */
/* ────────────────────────────────────────────────────────────── */

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'api' | 'faq'>('home')
  const [menuOpen, setMenuOpen] = useState(false)
  const [showQuote, setShowQuote] = useState(false)
  const [showWaitlist, setShowWaitlist] = useState(false)
  const [waitlistTitle, setWaitlistTitle] = useState('Get early access.')
  const [showWebinar, setShowWebinar] = useState(false)
  const [showApiAccess, setShowApiAccess] = useState(false)
  const [webinarDismissed, setWebinarDismissed] = useState(() => {
    try { return localStorage.getItem('gno_webinar_dismissed') === '1' } catch { return false }
  })
  const londonTime = useLondonTime()

  /* 3D card tilt + parallax state */
  const [tiltX, setTiltX] = useState(0)
  const [tiltY, setTiltY] = useState(0)
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const heroRef = useRef<HTMLElement>(null)

  const handleHeroMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = heroRef.current?.getBoundingClientRect()
    if (!rect) return
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) / (rect.width / 2)
    const dy = (e.clientY - cy) / (rect.height / 2)
    setTiltY(dx * 12)
    setTiltX(-dy * 12)
    setMouseX(dx)
    setMouseY(dy)
  }, [])

  const handleHeroMouseLeave = useCallback(() => {
    setTiltX(0); setTiltY(0)
    setMouseX(0); setMouseY(0)
  }, [])

  function openWaitlist(t?: string) {
    setWaitlistTitle(t || 'Get early access.')
    setShowWaitlist(true)
  }

  function dismissWebinar() {
    try { localStorage.setItem('gno_webinar_dismissed', '1') } catch { /* ignore */ }
    setWebinarDismissed(true)
  }

  const navProps = { currentPage, setCurrentPage, londonTime, onQuote: () => setShowQuote(true), onWaitlist: openWaitlist, menuOpen, setMenuOpen }

  /* ── Non-home pages ───────────────────────────────────────── */
  if (currentPage === 'api') {
    return (
      <div className="bg-white min-h-screen overflow-x-hidden">
        {/* Sticky nav wrapper */}
        <div className="sticky top-0 z-30 bg-[#EFEFEF]">
          <Nav {...navProps} />
        </div>
        <ApiDocsPage onBack={() => setCurrentPage('home')} onApiAccess={() => setShowApiAccess(true)} />
        {showApiAccess && <ApiAccessModal onClose={() => setShowApiAccess(false)} />}
        {showQuote && <QuoteFormModal onClose={() => setShowQuote(false)} />}
      </div>
    )
  }

  if (currentPage === 'faq') {
    return (
      <div className="bg-white min-h-screen overflow-x-hidden">
        <div className="sticky top-0 z-30 bg-[#F5F5F5]">
          <Nav {...navProps} />
        </div>
        <FaqPage onBack={() => setCurrentPage('home')} />
        {showQuote && <QuoteFormModal onClose={() => setShowQuote(false)} />}
      </div>
    )
  }

  /* ── HOME PAGE ────────────────────────────────────────────── */
  return (
    <div className="bg-white min-h-screen overflow-x-hidden">

      {/* Webinar announcement banner */}
      {!webinarDismissed && (
        <div className="sticky top-0 z-40 bg-[#0F2419] border-b border-white/10">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-3 flex items-center gap-3 sm:gap-5">
            {/* Left: live badge + text */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="flex-shrink-0 bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider animate-pulse">
                Live
              </span>
              <div className="min-w-0">
                <p className="text-white text-[12px] sm:text-[13px] font-semibold leading-tight truncate">
                  Raising your Series A: The CFO Playbook
                </p>
                <p className="text-white/50 text-[11px] leading-tight mt-0.5 hidden sm:block">
                  June 27 · 11:00 BST · Free to attend · Featuring Alex Chen, CFO at Acme Capital
                </p>
                <p className="text-white/50 text-[11px] leading-tight mt-0.5 sm:hidden">June 27 · 11:00 BST · Free</p>
              </div>
            </div>
            {/* Center: preview image thumbnail */}
            <div className="hidden md:flex items-center flex-shrink-0">
              <div className="relative rounded-lg overflow-hidden" style={{ width: 80, height: 50 }}>
                <img
                  src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=300&q=80"
                  alt="Webinar preview — founders raising"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center">
                    <svg width="8" height="9" viewBox="0 0 8 9" fill="#0F2419"><path d="M1 1l6 3.5-6 3.5V1z"/></svg>
                  </div>
                </div>
              </div>
            </div>
            {/* Right: CTA + dismiss */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setShowWebinar(true)}
                className="text-[12px] font-semibold text-gray-900 bg-white hover:bg-gray-100 px-3.5 py-1.5 rounded-full transition-colors whitespace-nowrap"
              >
                Save my seat →
              </button>
              <button onClick={dismissWebinar} className="text-white/40 hover:text-white transition-colors p-1">
                <X size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════ */}
      {/* SECTION 1 — HERO                                    */}
      {/* ═══════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="min-h-screen bg-[#EFEFEF] relative flex flex-col overflow-hidden"
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
      >
        {/* Shader stack — 3D parallax on mouse move */}
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          <div className="absolute inset-0" style={{ transform: `scale(1.1) translate(${mouseX * 18}px, ${mouseY * 12}px)`, transition: 'transform 0.18s ease-out' }}>
            <MeshGradient colors={['#EFEFEF', '#f2f5f0', '#d6e8db', '#eaf3ee']} speed={0.08} distortion={0.55} swirl={0.18} style={{ width: '100%', height: '100%' }} />
          </div>
          <div className="absolute inset-0" style={{ opacity: 0.22, mixBlendMode: 'multiply', transform: `scale(1.1) translate(${mouseX * 10}px, ${mouseY * 7}px)`, transition: 'transform 0.18s ease-out' }}>
            <Swirl colors={['#c8e0d0', '#EBF5EE', '#f0f7f3']} colorBack="#EFEFEF" bandCount={3} twist={0.12} center={0.15} speed={0.1} noise={0.18} noiseFrequency={0.35} softness={0.6} style={{ width: '100%', height: '100%' }} />
          </div>
          <div className="absolute inset-0" style={{ opacity: 0.35, transform: `scale(1.1) translate(${-mouseX * 6}px, ${-mouseY * 4}px)`, transition: 'transform 0.18s ease-out' }}>
            <FlutedGlass colorBack="#00000000" colorShadow="#1D6B42" colorHighlight="#ffffff" size={0.1} angle={31} distortion={0.28} highlights={0.09} shadows={0.06} shape="lines" speed={0.08} style={{ width: '100%', height: '100%' }} />
          </div>
        </div>

        {/* NAV */}
        <Nav {...navProps} />

        {/* Hero content */}
        <div className="flex-1 flex items-end relative z-20">
          <div className="max-w-[1440px] mx-auto w-full px-5 sm:px-8 lg:px-12 pb-14 sm:pb-16 lg:pb-20">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12 lg:gap-0">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 border border-[#1D6B42]/40 rounded-full px-3.5 py-1.5 mb-6 sm:mb-8">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1D6B42]" />
                  <span className="text-[12px] sm:text-[13px] font-medium text-[#1D6B42]">Now active — UK &amp; EU startup cover</span>
                </div>
                <h1 className="font-medium leading-[1.06] tracking-[-0.03em] text-gray-900 mb-6 sm:mb-8" style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: 'clamp(2.4rem, 7vw, 5rem)' }}>
                  Stop worrying<br />about insurance.
                </h1>
                <p className="text-[15px] sm:text-[16px] leading-[1.68] text-gray-600 mb-8 sm:mb-10 max-w-md">
                  Tailored cover for UK &amp; EU founders. Pre-seed to Series A+. Get the right protection in 48 hours — without the broker, the jargon, or the hassle.
                </p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
                  <RollButton text="Start cover" variant="green" size="md" onClick={() => setShowQuote(true)} />
                  <div className="flex items-center gap-2 bg-white rounded-[4px] px-3 sm:px-4 py-2 cursor-default select-none transition-shadow duration-200" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)')}>
                    <Starburst className="w-5 h-5 sm:w-6 sm:h-6 fill-current text-[#1D6B42]" />
                    <span className="text-[13px] sm:text-[14px] font-medium text-gray-900">FCA Authorised</span>
                    <span className="text-[10px] sm:text-[11px] bg-gray-900 text-white px-1.5 sm:px-2 py-0.5 rounded font-medium">UK &amp; EU</span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:flex items-end justify-end pb-8 pr-4">
                <HeroCard3D tiltX={tiltX} tiltY={tiltY} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile menu overlay */}
      <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setMenuOpen(false)}>
        <div className="absolute inset-0 bg-black/60" />
      </div>
      <div className={`fixed left-0 right-0 bottom-0 z-[60] mx-3 mb-3 transition-transform duration-500 ${menuOpen ? 'translate-y-0' : 'translate-y-[110%]'}`} style={{ transitionTimingFunction: 'cubic-bezier(0.32,0.72,0,1)' }}>
        <div className="bg-white rounded-2xl px-6 pt-6 pb-8">
          <div className="flex items-center gap-1.5 text-[13px] text-gray-500 mb-7">
            <Clock size={13} />
            <span>{londonTime} London</span>
          </div>
          <ul className="flex flex-col gap-4 mb-8">
            {[
              { label: 'Plans', action: () => { setMenuOpen(false); document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' }) } },
              { label: 'Coverage', action: () => { setMenuOpen(false); document.getElementById('coverage')?.scrollIntoView({ behavior: 'smooth' }) } },
              { label: 'Advisors', action: () => { setMenuOpen(false); document.getElementById('advisor')?.scrollIntoView({ behavior: 'smooth' }) } },
              { label: 'Contact', action: () => { setMenuOpen(false); openWaitlist('Get in touch') } },
              { label: 'API', action: () => { setMenuOpen(false); setCurrentPage('api') } },
              { label: 'FAQ', action: () => { setMenuOpen(false); setCurrentPage('faq') } },
            ].map(item => (
              <li key={item.label}>
                <button onClick={item.action} className="text-[28px] sm:text-[32px] font-medium text-gray-900 hover:text-[#1D6B42] transition-colors duration-200">{item.label}</button>
              </li>
            ))}
          </ul>
          <RollButton text="Get a quote" variant="green" size="md" onClick={() => { setMenuOpen(false); setShowQuote(true) }} />
        </div>
      </div>

      {/* MARQUEE */}
      <MarqueeSection />

      {/* ═══════════════════════════════════════════════════ */}
      {/* SECTION 2 — ABOUT                                   */}
      {/* ═══════════════════════════════════════════════════ */}
      <section id="coverage" className="bg-white pt-16 sm:pt-20 lg:pt-32 pb-12 sm:pb-16 lg:pb-24 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <Badge num="1" label="Why Gnocchi" />
          <h2 className="font-medium leading-[1.12] tracking-[-0.02em] text-gray-900 mb-12 sm:mb-16 lg:mb-28" style={{ fontSize: 'clamp(1.5rem, 4vw, 3.2rem)' }}>
            Insurance that works<br />as hard as you do.
          </h2>
          <div className="lg:hidden space-y-8">
            <div>
              <p className="text-[15px] sm:text-[17px] leading-[1.6] font-medium text-gray-900 mb-7">
                Founders don't have time for brokers, jargon, or policies built for legacy businesses. Gnocchi gives you the right cover for your stage, sector and size — without the friction.
              </p>
              <RollButton text="Our story" variant="green" size="md" onClick={() => openWaitlist('Stay updated on Gnocchi')} />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 mt-8">
              <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80" alt="Founders collaborating" className="sm:w-[45%] aspect-[438/346] object-cover rounded-xl sm:rounded-2xl" />
              <img src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&q=80" alt="Modern workspace" className="sm:w-[55%] aspect-[900/600] object-cover rounded-xl sm:rounded-2xl" />
            </div>
          </div>
          <div className="hidden lg:grid grid-cols-[26%_1fr_48%] items-end gap-6 xl:gap-8">
            <div className="self-end">
              <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80" alt="Founders collaborating" className="aspect-[438/346] object-cover rounded-2xl w-full" />
            </div>
            <div className="self-start flex flex-col justify-end pb-4">
              <p className="text-[16px] sm:text-[18px] leading-[1.65] font-medium text-gray-900 whitespace-nowrap mb-8">
                Founders don't have time for brokers,<br />
                jargon, or policies built for legacy<br />
                businesses. Gnocchi gives you the<br />
                right cover for your stage, sector<br />
                and size — without the friction.
              </p>
              <RollButton text="Our story" variant="green" size="md" onClick={() => openWaitlist('Stay updated on Gnocchi')} />
            </div>
            <div className="self-end">
              <img src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&q=80" alt="Modern workspace" className="aspect-[3/2] object-cover rounded-2xl w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <PricingSection onQuote={() => setShowQuote(true)} onWaitlist={openWaitlist} />

      {/* ═══════════════════════════════════════════════════ */}
      {/* SECTION 4 — COVERAGE ADVISOR                        */}
      {/* ═══════════════════════════════════════════════════ */}
      <section id="advisor" className="bg-white pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 lg:pb-28">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <Badge num="3" label="Talk to an advisor" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div className="lg:pt-2">
              <h2 className="font-medium leading-[1.1] tracking-[-0.03em] text-gray-900 mb-5" style={{ fontSize: 'clamp(1.75rem, 4.5vw, 3.5rem)' }}>
                Get your quote<br />in minutes.
              </h2>
              <p className="text-[15px] sm:text-[16px] leading-[1.68] text-gray-500 mb-8 max-w-md">
                No forms. No phone calls. Describe your startup and our advisor walks you through exactly what you need — with pricing.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Personalised to your sector, stage &amp; headcount',
                  'Each cover type explained in plain language',
                  'Rough estimate you can share with investors',
                  'Full quote within 48 hours, no commitment',
                ].map((b, i) => (
                  <li key={i} className="flex items-start gap-3 text-[14px] text-gray-600 leading-[1.55]">
                    <span className="w-5 h-5 rounded-full bg-[#EBF5EE] border border-[#A8D4B8] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg width="9" height="9" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="#1D6B42" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                    <span dangerouslySetInnerHTML={{ __html: b }} />
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2 text-[13px] text-gray-400 border border-gray-100 rounded-full px-4 py-2 w-fit">
                <Shield size={13} />
                <span>Secure, confidential — no data stored</span>
              </div>
            </div>
            <AdvisorChat onQuote={() => setShowQuote(true)} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F2419] pt-12 pb-8">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between mb-8">
            <GnocchiLogo size={24} />
            <p className="text-[12px] text-[#5A8A6A]">FCA Authorised · ICO Registered · UK &amp; EU</p>
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-[12px] text-[#5A8A6A]">© 2026 Gnocchi Insurance Ltd. All rights reserved.</p>
            <div className="flex gap-4">
              <button onClick={() => setCurrentPage('api')} className="text-[12px] text-[#5A8A6A] hover:text-white transition-colors">API</button>
              <button onClick={() => setCurrentPage('faq')} className="text-[12px] text-[#5A8A6A] hover:text-white transition-colors">FAQ</button>
              <button onClick={() => openWaitlist('Get in touch')} className="text-[12px] text-[#5A8A6A] hover:text-white transition-colors">Contact</button>
            </div>
          </div>
        </div>
      </footer>

      {showQuote && <QuoteFormModal onClose={() => setShowQuote(false)} />}
      {showWaitlist && <WaitlistModal onClose={() => setShowWaitlist(false)} title={waitlistTitle} />}
      {showWebinar && <WebinarModal onClose={() => setShowWebinar(false)} />}
      {showApiAccess && <ApiAccessModal onClose={() => setShowApiAccess(false)} />}
    </div>
  )
}
