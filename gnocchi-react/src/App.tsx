import { useState, useEffect, useRef, useCallback } from 'react'
import { Clock, Menu, X, ArrowRight, Send, Shield, Check } from 'lucide-react'
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

/* ── Expanding pill hover button (card overlay) ─────────────── */
function ExpandPill({ label, light = false, wide = false, onClick }: { label: string; light?: boolean; wide?: boolean; onClick?: () => void }) {
  const w = wide ? 'hover:w-[168px]' : 'hover:w-[148px]'
  return (
    <div
      onClick={onClick}
      className={`
      group/pill absolute bottom-4 left-4 z-10
      flex items-center overflow-hidden rounded-full cursor-pointer
      h-9 w-9 ${w} transition-all duration-300 ease-in-out
      ${light ? 'bg-white' : 'bg-gray-900'}
    `}>
      <span className={`
        ml-4 whitespace-nowrap text-[13px] font-medium
        opacity-0 group-hover/pill:opacity-100 transition-opacity delay-100 duration-200
        ${light ? 'text-gray-900' : 'text-white'}
      `}>{label}</span>
      <span className="ml-auto mr-2 flex-shrink-0">
        <ArrowRight
          size={14}
          className={`transition-transform duration-300 -rotate-45 group-hover/pill:rotate-0 ${light ? 'text-gray-900' : 'text-white'}`}
        />
      </span>
    </div>
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

/* ── Chat helpers ───────────────────────────────────────────── */
const ADVISOR_SYSTEM = `You are a friendly and knowledgeable coverage advisor at Gnocchi, a startup and SME insurance provider for UK and EU businesses. Your role is to help founders understand their insurance needs and provide a personalised coverage recommendation with indicative pricing.

When a founder describes their startup:
1. Ask one or two clarifying questions if needed (sector, team size, jurisdiction, revenue stage, any funding)
2. Recommend specific insurance types relevant to their business, explaining each clearly in plain language
3. Suggest the most fitting Gnocchi plan:
   - Essentials at £79/mo — pre-seed, 1–15 people, core cover
   - Growth at £229/mo — seed stage, 15–60 people, includes D&O and enhanced cyber
   - Scale at £575/mo — Series A+, 60+ people, multi-jurisdiction
4. Give an indicative monthly price range and note it's subject to a full assessment within 48 hours

Tone: warm, direct, knowledgeable, zero jargon. Never mention AI or automated systems. Always reference FCA authorisation and UK/EU regulatory compliance (GDPR, ICO) where relevant.`

type Message = { role: 'user' | 'assistant'; content: string }

function formatMsg(text: string): string {
  let t = text
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/£[\d,]+(?:\/month|\/mo)?(?:\s*[-–]\s*£[\d,]+(?:\/month|\/mo)?)?/g,
      m => `<span style="background:#EBF5EE;color:#1D6B42;font-weight:600;padding:0 5px;border-radius:4px;font-size:.75rem">${m}</span>`)
  const lines = t.split('\n')
  let out = '', inList = false
  for (const ln of lines) {
    const bullet = ln.match(/^[-•]\s+(.*)/)
    if (bullet) {
      if (!inList) { out += '<ul style="padding-left:1.2em;margin:.25rem 0">'; inList = true }
      out += `<li style="margin-bottom:.2rem">${bullet[1]}</li>`
    } else {
      if (inList) { out += '</ul>'; inList = false }
      if (ln.trim()) out += `<p style="margin-bottom:.25rem">${ln}</p>`
    }
  }
  if (inList) out += '</ul>'
  return out
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
        {/* Close */}
        <button onClick={onClose} className="absolute top-5 right-5 z-10 text-gray-400 hover:text-gray-700 transition-colors">
          <X size={20} />
        </button>

        {/* Progress dots */}
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

        {/* Step content */}
        <div
          className={`px-8 pt-5 pb-4 transition-all duration-[180ms] ease-out ${slideClass}`}
          style={{ minHeight: 320 }}
        >
          {step === 0 && (
            <div>
              <h3 className="text-[20px] font-semibold text-gray-900 mb-1">What does your startup do?</h3>
              <p className="text-[13px] text-gray-500 mb-5">This helps us recommend the right cover.</p>
              <div className="grid grid-cols-2 gap-2.5 mb-5">
                {SECTORS.map(s => (
                  <button
                    key={s}
                    onClick={() => setSector(s)}
                    className={`text-left text-[13px] font-medium px-4 py-2.5 rounded-xl border transition-all duration-150 ${
                      sector === s
                        ? 'border-[#1D6B42] bg-[#EBF5EE] text-[#1D6B42]'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={sectorDesc}
                onChange={e => setSectorDesc(e.target.value)}
                placeholder="Describe what you build (optional)"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-[#1D6B42] transition-colors"
              />
            </div>
          )}

          {step === 1 && (
            <div>
              <h3 className="text-[20px] font-semibold text-gray-900 mb-5">How many people are on your team?</h3>
              <div className="grid grid-cols-1 gap-3">
                {TEAM_SIZES.map(ts => (
                  <button
                    key={ts.id}
                    onClick={() => setTeamSize(ts.id)}
                    className={`flex items-center justify-between px-5 py-4 rounded-xl border transition-all duration-150 text-left ${
                      teamSize === ts.id
                        ? 'border-[#1D6B42] bg-[#EBF5EE]'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
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
                  <button
                    key={st.id}
                    onClick={() => setStage(st.id)}
                    className={`flex items-center px-5 py-4 rounded-xl border transition-all duration-150 text-left ${
                      stage === st.id
                        ? 'border-[#1D6B42] bg-[#EBF5EE]'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
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
                  <button
                    key={r.id}
                    onClick={() => setRegion(r.id)}
                    className={`flex items-center justify-between px-5 py-4 rounded-xl border transition-all duration-150 text-left ${
                      region === r.id
                        ? 'border-[#1D6B42] bg-[#EBF5EE]'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <span className={`text-[14px] font-medium ${region === r.id ? 'text-[#1D6B42]' : 'text-gray-900'}`}>{r.label}</span>
                    {r.popular && (
                      <span className="text-[11px] font-semibold bg-[#1D6B42] text-white px-2 py-0.5 rounded-full">Most popular</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <form onSubmit={handleSubmit}>
              <h3 className="text-[20px] font-semibold text-gray-900 mb-1">Last step — where should we send your quote?</h3>
              <p className="text-[13px] text-gray-500 mb-5">You'll hear from us within 48 hours.</p>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                autoFocus
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#1D6B42] transition-colors mb-4"
              />
              <button
                type="submit"
                disabled={!email.includes('@')}
                className="w-full bg-[#1D6B42] hover:bg-[#155232] disabled:opacity-40 text-white text-[14px] font-semibold rounded-xl py-3.5 transition-colors"
              >
                Get my tailored quote →
              </button>
            </form>
          )}
        </div>

        {/* Nav buttons */}
        {step < 4 && (
          <div className="flex items-center justify-between px-8 pb-7 pt-2">
            <button
              onClick={goPrev}
              disabled={step === 0}
              className="text-[13px] text-gray-400 hover:text-gray-700 disabled:opacity-0 transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={goNext}
              disabled={!canNext()}
              className="bg-[#1D6B42] hover:bg-[#155232] disabled:opacity-40 text-white text-[13px] font-semibold rounded-full px-6 py-2.5 transition-colors"
            >
              Next →
            </button>
          </div>
        )}
        {step === 4 && (
          <div className="flex items-center justify-start px-8 pb-7 pt-2">
            <button onClick={goPrev} className="text-[13px] text-gray-400 hover:text-gray-700 transition-colors">
              ← Back
            </button>
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors">
          <X size={20} />
        </button>
        {submitted ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-[#EBF5EE] flex items-center justify-center mx-auto mb-4">
              <Check size={22} className="text-[#1D6B42]" />
            </div>
            <p className="text-[15px] font-medium text-gray-900">You're on the list — we'll be in touch.</p>
          </div>
        ) : (
          <>
            <h3 className="text-[22px] font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-[14px] text-gray-500 mb-6 leading-[1.6]">
              Be first to know when Gnocchi launches in your region.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                value={wEmail}
                onChange={e => setWEmail(e.target.value)}
                placeholder="your@email.com"
                autoFocus
                className="border border-gray-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#1D6B42] transition-colors"
              />
              <button
                type="submit"
                disabled={!wEmail.includes('@')}
                className="bg-[#1D6B42] hover:bg-[#155232] disabled:opacity-40 text-white text-[14px] font-semibold rounded-xl py-3 transition-colors"
              >
                Join waitlist
              </button>
            </form>
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
        <div className="flex-shrink-0 pl-5 sm:pl-8 lg:pl-12 pr-6 text-[12px] text-gray-400 font-medium whitespace-nowrap">
          Trusted by founders from
        </div>
        <div className="flex-1 overflow-hidden min-w-0">
          <div className="marquee-track">
            {allLogos.map((logo, i) => (
              <span
                key={i}
                className="inline-block mx-8 text-[14px] font-semibold text-gray-300 hover:text-gray-500 transition-colors duration-200 whitespace-nowrap cursor-default select-none"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── 3D Hero Card ───────────────────────────────────────────── */
interface HeroCard3DProps {
  tiltX: number
  tiltY: number
}

function HeroCard3D({ tiltX, tiltY }: HeroCard3DProps) {
  const cardStyle: React.CSSProperties = {
    transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
    transition: 'transform 0.15s ease-out',
    boxShadow: `${tiltY * 1.5}px ${-tiltX * 1.5 + 8}px ${20 + Math.abs(tiltX) + Math.abs(tiltY)}px rgba(0,0,0,0.28)`,
  }
  const badge1Style: React.CSSProperties = {
    transform: `perspective(1000px) rotateX(${tiltX * 0.5}deg) rotateY(${tiltY * 0.5}deg)`,
    transition: 'transform 0.15s ease-out',
  }
  const badge2Style: React.CSSProperties = {
    transform: `perspective(1000px) rotateX(${tiltX * 0.5}deg) rotateY(${tiltY * 0.5}deg)`,
    transition: 'transform 0.15s ease-out',
  }

  return (
    <div className="relative flex flex-col items-center" style={{ width: 300 }}>
      {/* Badge 1 — top right offset */}
      <div
        className="absolute -top-4 -right-6 bg-white rounded-xl px-3.5 py-2.5 shadow-lg z-10 card-3d"
        style={badge1Style}
      >
        <span className="text-[12px] font-semibold text-gray-900">£229/mo</span>
        <span className="text-[11px] text-gray-400 ml-1.5">Growth plan</span>
      </div>

      {/* Main card */}
      <div
        className="w-full rounded-2xl overflow-hidden card-3d"
        style={{ ...cardStyle, background: 'linear-gradient(145deg, #0F2419 0%, #1A3D2A 100%)' }}
      >
        {/* Card header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[12px] font-medium text-white/80">Active</span>
          </div>
          <span className="text-[12px] font-semibold text-white">Gnocchi Coverage</span>
        </div>
        {/* Card body */}
        <div className="px-5 py-4">
          <p className="text-[11px] text-white/50 uppercase tracking-wider mb-3">Coverage overview</p>
          <ul className="space-y-2.5 mb-4">
            {[
              { label: 'Professional indemnity', active: true },
              { label: 'Cyber & data breach', active: true },
              { label: 'Directors & officers', active: true },
            ].map(item => (
              <li key={item.label} className="flex items-center gap-2.5">
                <span className="w-4 h-4 rounded-full bg-[#1D6B42] flex items-center justify-center flex-shrink-0">
                  <Check size={9} className="text-white" />
                </span>
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
            <div className="flex justify-between">
              <span className="text-[11px] text-white/40">Plan</span>
              <span className="text-[11px] text-white/70 font-medium">Growth (Seed)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[11px] text-white/40">Team</span>
              <span className="text-[11px] text-white/70 font-medium">18 people</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[11px] text-white/40">Next renewal</span>
              <span className="text-[11px] text-white/70 font-medium">Jan 2027</span>
            </div>
          </div>
          <button className="mt-4 w-full flex items-center justify-center gap-1.5 text-[12px] text-[#A8D4B8] border border-[#A8D4B8]/30 rounded-lg py-2 hover:bg-white/5 transition-colors">
            View policy
            <ArrowRight size={11} />
          </button>
        </div>
      </div>

      {/* Badge 2 — bottom left offset */}
      <div
        className="absolute -bottom-4 -left-6 bg-white rounded-xl px-3.5 py-2.5 shadow-lg z-10 card-3d"
        style={badge2Style}
      >
        <span className="text-[12px] font-semibold text-[#1D6B42]">FCA Authorised</span>
        <span className="text-[11px] text-gray-400 ml-1">✓</span>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────── */
/*  MAIN APP                                                       */
/* ────────────────────────────────────────────────────────────── */

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [showQuote, setShowQuote] = useState(false)
  const [showWaitlist, setShowWaitlist] = useState(false)
  const [waitlistTitle, setWaitlistTitle] = useState('Get early access.')
  const londonTime = useLondonTime()

  /* 3D card tilt state */
  const [tiltX, setTiltX] = useState(0)
  const [tiltY, setTiltY] = useState(0)
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
  }, [])

  const handleHeroMouseLeave = useCallback(() => {
    setTiltX(0)
    setTiltY(0)
  }, [])

  function openWaitlist(t?: string) {
    setWaitlistTitle(t || 'Get early access.')
    setShowWaitlist(true)
  }

  /* chat state */
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm your Gnocchi coverage advisor. Tell me about your startup — what you do, your team size, and where you're based — and I'll walk you through exactly the cover you need." }
  ])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gno_k') || '')
  const [showKeyModal, setShowKeyModal] = useState(false)
  const [keyDraft, setKeyDraft] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)
  const historyRef = useRef<Message[]>([])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, chatLoading])

  async function sendChat(text?: string) {
    const msg = (text ?? chatInput).trim()
    if (!msg) return
    const key = apiKey || localStorage.getItem('gno_k') || ''
    if (!key) { setShowKeyModal(true); return }
    setChatInput('')
    const userMsg: Message = { role: 'user', content: msg }
    historyRef.current = [...historyRef.current, userMsg]
    setMessages(prev => [...prev, userMsg])
    setChatLoading(true)
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-fable-5',
          max_tokens: 1200,
          stream: true,
          system: ADVISOR_SYSTEM,
          messages: historyRef.current,
        }),
      })
      if (!res.ok) {
        setChatLoading(false)
        setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please check your API key and try again.' }])
        return
      }
      setChatLoading(false)
      let full = ''
      setMessages(prev => [...prev, { role: 'assistant', content: '' }])
      const reader = res.body!.getReader()
      const dec = new TextDecoder()
      let buf = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buf += dec.decode(value, { stream: true })
        const lines = buf.split('\n'); buf = lines.pop() ?? ''
        for (const line of lines) {
          if (!line.startsWith('data:')) continue
          const data = line.slice(5).trim()
          if (data === '[DONE]') continue
          try {
            const ev = JSON.parse(data)
            if (ev.type === 'content_block_delta' && ev.delta?.text) {
              full += ev.delta.text
              setMessages(prev => {
                const updated = [...prev]
                updated[updated.length - 1] = { role: 'assistant', content: full }
                return updated
              })
            }
          } catch { /* ignore parse errors */ }
        }
      }
      historyRef.current = [...historyRef.current, { role: 'assistant', content: full }]
    } catch {
      setChatLoading(false)
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }])
    }
  }

  function saveKey() {
    if (!keyDraft.startsWith('sk-ant-')) { alert('Please enter a valid Anthropic API key starting with sk-ant-'); return }
    localStorage.setItem('gno_k', keyDraft)
    setApiKey(keyDraft)
    setShowKeyModal(false)
  }

  /* ── RENDER ──────────────────────────────────────────────── */
  return (
    <div className="bg-white min-h-screen overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════ */}
      {/* SECTION 1 — HERO                                    */}
      {/* ═══════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="min-h-screen bg-[#EFEFEF] relative flex flex-col overflow-hidden"
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
      >
        {/* ── Shader stack ──────────────────────────────── */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute inset-0">
            <MeshGradient
              colors={['#EFEFEF', '#f2f5f0', '#d6e8db', '#eaf3ee']}
              speed={0.08}
              distortion={0.55}
              swirl={0.18}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          <div className="absolute inset-0" style={{ opacity: 0.22, mixBlendMode: 'multiply' }}>
            <Swirl
              colors={['#c8e0d0', '#EBF5EE', '#f0f7f3']}
              colorBack="#EFEFEF"
              bandCount={3}
              twist={0.12}
              center={0.15}
              speed={0.1}
              noise={0.18}
              noiseFrequency={0.35}
              softness={0.6}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          <div className="absolute inset-0" style={{ opacity: 0.35 }}>
            <FlutedGlass
              colorBack="#00000000"
              colorShadow="#1D6B42"
              colorHighlight="#ffffff"
              size={0.1}
              angle={31}
              distortion={0.28}
              highlights={0.09}
              shadows={0.06}
              shape="lines"
              speed={0.08}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>

        {/* ── NAV ─────────────────────────────────────── */}
        <div className="relative z-20 max-w-[1440px] mx-auto w-full p-2 sm:p-3">
          <nav className="bg-white rounded-full flex items-center justify-between" style={{ padding: '5px' }}>
            {/* Left */}
            <div className="flex items-center gap-4 sm:gap-6 pl-1">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold tracking-tight" style={{ fontSize: 10 }}>GN</span>
              </div>
              <div className="hidden md:flex items-center gap-6">
                <button onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })} className="text-[14px] text-gray-900 hover:text-gray-500 transition-colors duration-300">Plans</button>
                <button onClick={() => document.getElementById('coverage')?.scrollIntoView({ behavior: 'smooth' })} className="text-[14px] text-gray-900 hover:text-gray-500 transition-colors duration-300">Coverage</button>
                <button onClick={() => document.getElementById('advisor')?.scrollIntoView({ behavior: 'smooth' })} className="text-[14px] text-gray-900 hover:text-gray-500 transition-colors duration-300">Advisors</button>
                <button onClick={() => openWaitlist('Get in touch')} className="text-[14px] text-gray-900 hover:text-gray-500 transition-colors duration-300">Contact</button>
              </div>
            </div>
            {/* Right: desktop */}
            <div className="hidden md:flex items-center gap-4 pr-0.5">
              <span className="hidden lg:block text-[13px] text-gray-600">Now covering UK &amp; EU founders</span>
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-gray-600" />
                <span className="text-[13px] text-gray-600">{londonTime} in London</span>
              </div>
              <button
                className="group flex items-center gap-2 bg-gray-900 hover:bg-[#1D6B42] text-white text-[13px] font-medium rounded-full pl-5 pr-2 py-2 transition-colors duration-300"
                onClick={() => setShowQuote(true)}
              >
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
            {/* Right: mobile */}
            <div className="flex md:hidden items-center pr-0.5">
              <button
                className="flex items-center gap-1.5 bg-gray-900 text-white text-[13px] font-medium rounded-full pl-3 pr-2 py-1.5"
                onClick={() => setMenuOpen(v => !v)}
              >
                {menuOpen ? <X size={15} /> : <Menu size={15} />}
                <span>{menuOpen ? 'Close' : 'Menu'}</span>
              </button>
            </div>
          </nav>
        </div>

        {/* ── Hero content ──────────────────────────── */}
        <div className="flex-1 flex items-end relative z-20">
          <div className="max-w-[1440px] mx-auto w-full px-5 sm:px-8 lg:px-12 pb-14 sm:pb-16 lg:pb-20">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12 lg:gap-0">
              {/* Left: copy */}
              <div className="max-w-xl">
                {/* Label pill */}
                <div className="inline-flex items-center gap-2 border border-[#1D6B42]/40 rounded-full px-3.5 py-1.5 mb-6 sm:mb-8">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1D6B42]" />
                  <span className="text-[12px] sm:text-[13px] font-medium text-[#1D6B42]">Now active — UK &amp; EU startup cover</span>
                </div>
                <h1
                  className="font-medium leading-[1.06] tracking-[-0.03em] text-gray-900 mb-6 sm:mb-8"
                  style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: 'clamp(2.4rem, 7vw, 5rem)' }}
                >
                  Stop worrying<br />about insurance.
                </h1>
                <p className="text-[15px] sm:text-[16px] leading-[1.68] text-gray-600 mb-8 sm:mb-10 max-w-md">
                  Tailored cover for UK &amp; EU founders. Pre-seed to Series A+. Get the right protection in 48 hours — without the broker, the jargon, or the hassle.
                </p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
                  <RollButton
                    text="Start cover"
                    variant="green"
                    size="md"
                    onClick={() => setShowQuote(true)}
                  />
                  {/* FCA badge */}
                  <div
                    className="flex items-center gap-2 bg-white rounded-[4px] px-3 sm:px-4 py-2 cursor-default select-none transition-shadow duration-200"
                    style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)')}
                  >
                    <Starburst className="w-5 h-5 sm:w-6 sm:h-6 fill-current text-[#1D6B42]" />
                    <span className="text-[13px] sm:text-[14px] font-medium text-gray-900">FCA Authorised</span>
                    <span className="text-[10px] sm:text-[11px] bg-gray-900 text-white px-1.5 sm:px-2 py-0.5 rounded font-medium">UK &amp; EU</span>
                  </div>
                </div>
              </div>

              {/* Right: 3D card (desktop only) */}
              <div className="hidden lg:flex items-end justify-end pb-8 pr-4">
                <HeroCard3D tiltX={tiltX} tiltY={tiltY} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMenuOpen(false)}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>
      <div
        className={`fixed left-0 right-0 bottom-0 z-[60] mx-3 mb-3 transition-transform duration-500 ${menuOpen ? 'translate-y-0' : 'translate-y-[110%]'}`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.32,0.72,0,1)' }}
      >
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
            ].map(item => (
              <li key={item.label}>
                <button onClick={item.action} className="text-[28px] sm:text-[32px] font-medium text-gray-900 hover:text-[#1D6B42] transition-colors duration-200">{item.label}</button>
              </li>
            ))}
          </ul>
          <RollButton text="Get a quote" variant="green" size="md" onClick={() => { setMenuOpen(false); setShowQuote(true) }} />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* MARQUEE — Trusted by founders                       */}
      {/* ═══════════════════════════════════════════════════ */}
      <MarqueeSection />

      {/* ═══════════════════════════════════════════════════ */}
      {/* SECTION 2 — ABOUT                                   */}
      {/* ═══════════════════════════════════════════════════ */}
      <section id="coverage" className="bg-white pt-16 sm:pt-20 lg:pt-32 pb-12 sm:pb-16 lg:pb-24 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <Badge num="1" label="Why Gnocchi" />
          <h2
            className="font-medium leading-[1.12] tracking-[-0.02em] text-gray-900 mb-12 sm:mb-16 lg:mb-28"
            style={{ fontSize: 'clamp(1.5rem, 4vw, 3.2rem)' }}
          >
            Insurance that works<br />as hard as you do.
          </h2>

          {/* Mobile / tablet */}
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

          {/* Desktop */}
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

      {/* ═══════════════════════════════════════════════════ */}
      {/* SECTION 3 — PACKAGES                                */}
      {/* ═══════════════════════════════════════════════════ */}
      <section id="plans" className="bg-[#F5F5F5] pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 lg:pb-28">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <Badge num="2" label="Coverage plans" light />
          <h2
            className="font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 mb-4"
            style={{ fontSize: 'clamp(1.75rem, 7vw, 4.2rem)' }}
          >
            Cover that grows<br />with you.
          </h2>
          <p className="text-[15px] sm:text-[16px] text-gray-500 mb-10 sm:mb-14 lg:mb-16 max-w-md leading-[1.6]">
            Start with the essentials. Upgrade as you scale. No re-application, no admin.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-7">
            {/* Essentials */}
            <div>
              <div className="aspect-[329/246] rounded-2xl overflow-hidden bg-[#EBF5EE] group cursor-pointer relative flex items-center justify-center p-6">
                <div className="bg-white rounded-xl p-5 w-full max-w-[260px] shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold tracking-wider uppercase text-[#1D6B42] bg-[#EBF5EE] px-2.5 py-1 rounded-full">Pre-Seed</span>
                    <span className="text-[11px] font-medium text-gray-400">Monthly</span>
                  </div>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-900 tracking-tight">£79</span>
                    <span className="text-sm text-gray-400 ml-1">/mo</span>
                  </div>
                  <ul className="space-y-2">
                    {['Professional indemnity', 'Cyber incident cover', "Employers' liability"].map(f => (
                      <li key={f} className="flex items-center gap-2 text-[12px] text-gray-600">
                        <span className="w-4 h-4 rounded-full bg-[#EBF5EE] flex items-center justify-center flex-shrink-0">
                          <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="#1D6B42" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <ExpandPill label="View plan" onClick={() => setShowQuote(true)} />
              </div>
              <p className="text-[13px] text-gray-600 mt-4 leading-relaxed">Core protection for early-stage teams. Professional indemnity, cyber, and public liability from day one.</p>
              <p className="text-[14px] sm:text-[15px] font-semibold text-gray-900 mt-1">Essentials — Pre-Seed</p>
              <div className="mt-4">
                <RollButton text="Start with Essentials" variant="green" size="sm" onClick={() => setShowQuote(true)} />
              </div>
            </div>

            {/* Growth */}
            <div>
              <div className="aspect-square rounded-2xl overflow-hidden bg-[#0F2419] group cursor-pointer relative flex items-center justify-center p-6">
                <div className="bg-[#1A3D2A] rounded-xl p-5 w-full max-w-[260px] border border-[#2A5C3A]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold tracking-wider uppercase text-[#A8D4B8] bg-[#1D6B42]/30 px-2.5 py-1 rounded-full">Seed</span>
                    <span className="text-[11px] font-medium text-[#5A8A6A]">Most popular</span>
                  </div>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-white tracking-tight">£229</span>
                    <span className="text-sm text-[#5A8A6A] ml-1">/mo</span>
                  </div>
                  <ul className="space-y-2">
                    {['D&O cover', 'Enhanced cyber £2M', 'Investor DD support'].map(f => (
                      <li key={f} className="flex items-center gap-2 text-[12px] text-[#A8D4B8]">
                        <span className="w-4 h-4 rounded-full bg-[#1D6B42]/40 flex items-center justify-center flex-shrink-0">
                          <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="#A8D4B8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* White expand pill */}
                <div
                  className="group/pill absolute bottom-4 left-4 z-10 flex items-center overflow-hidden rounded-full cursor-pointer h-9 w-9 hover:w-[168px] transition-all duration-300 ease-in-out bg-white"
                  onClick={() => setShowQuote(true)}
                >
                  <span className="ml-4 whitespace-nowrap text-[13px] font-medium text-gray-900 opacity-0 group-hover/pill:opacity-100 transition-opacity delay-100 duration-200">View plan</span>
                  <span className="ml-auto mr-2 flex-shrink-0">
                    <ArrowRight size={14} className="text-gray-900 transition-transform duration-300 -rotate-45 group-hover/pill:rotate-0" />
                  </span>
                </div>
              </div>
              <p className="text-[13px] text-gray-600 mt-4 leading-relaxed">The all-in-one growth plan for funded startups. D&amp;O cover, enhanced cyber, and investor due diligence support.</p>
              <p className="text-[14px] sm:text-[15px] font-semibold text-gray-900 mt-1">Growth — Seed</p>
              <div className="mt-4">
                <RollButton text="Start with Growth" variant="dark" size="sm" onClick={() => setShowQuote(true)} />
              </div>
            </div>
          </div>

          {/* Compare link */}
          <div className="mt-8 sm:mt-10 text-center">
            <button
              onClick={() => openWaitlist('Get full plan comparison')}
              className="text-[14px] font-medium text-[#1D6B42] hover:text-[#155232] underline underline-offset-2 transition-colors"
            >
              Compare all plans →
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ */}
      {/* SECTION 4 — COVERAGE ADVISOR (claude-fable-5)       */}
      {/* ═══════════════════════════════════════════════════ */}
      <section id="advisor" className="bg-white pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 lg:pb-28">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <Badge num="3" label="Talk to an advisor" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Left: copy */}
            <div className="lg:pt-2">
              <h2
                className="font-medium leading-[1.1] tracking-[-0.03em] text-gray-900 mb-5"
                style={{ fontSize: 'clamp(1.75rem, 4.5vw, 3.5rem)' }}
              >
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

            {/* Right: chat UI */}
            <div className="flex flex-col border border-gray-100 rounded-2xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.06)]" style={{ height: 520 }}>
              {/* Header */}
              <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 bg-white flex-shrink-0">
                <div className="w-9 h-9 rounded-xl bg-gray-900 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold" style={{ fontSize: 9 }}>GN</span>
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-gray-900">Gnocchi advisor</div>
                  <div className="flex items-center gap-1.5 text-[12px] text-gray-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                    Online now
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50" style={{ scrollbarWidth: 'thin' }}>
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[84%] px-4 py-3 rounded-2xl text-[13px] leading-[1.6] ${
                        m.role === 'user'
                          ? 'bg-gray-900 text-white rounded-br-sm'
                          : 'bg-white text-gray-800 rounded-bl-sm border border-gray-100 shadow-sm'
                      }`}
                      dangerouslySetInnerHTML={{ __html: m.role === 'user' ? m.content : formatMsg(m.content) }}
                    />
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex gap-1 items-center">
                      {[0, 0.2, 0.4].map((d, i) => (
                        <span key={i} className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: `${d}s` }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Suggestion chips */}
              {messages.length <= 2 && (
                <div className="flex gap-2 px-4 py-2.5 border-t border-gray-100 overflow-x-auto flex-shrink-0 bg-white" style={{ scrollbarWidth: 'none' }}>
                  {['SaaS B2B, 8-person team', 'Fintech startup, 20 people', 'E-commerce, just me and co-founder', 'What does Gnocchi cover?'].map(s => (
                    <button key={s} onClick={() => sendChat(s)} className="flex-shrink-0 text-[12px] font-medium text-gray-600 border border-gray-200 bg-gray-50 hover:bg-[#EBF5EE] hover:border-[#A8D4B8] hover:text-[#1D6B42] rounded-full px-3 py-1.5 transition-colors duration-150 whitespace-nowrap">
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="flex gap-2 px-4 py-3 border-t border-gray-100 bg-white flex-shrink-0">
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendChat()}
                  placeholder="Describe your startup..."
                  className="flex-1 text-[13px] bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#1D6B42] focus:bg-white transition-colors"
                />
                <button
                  onClick={() => sendChat()}
                  disabled={chatLoading}
                  className="w-10 h-10 rounded-xl bg-gray-900 hover:bg-[#1D6B42] flex items-center justify-center flex-shrink-0 transition-colors disabled:opacity-40"
                >
                  <Send size={15} className="text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── API key modal ────────────────────────────────── */}
      {showKeyModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setShowKeyModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-[16px] font-semibold text-gray-900 mb-2">Add your Anthropic API key</h3>
            <p className="text-[13px] text-gray-500 leading-[1.6] mb-4">
              To use the live coverage advisor, paste your Anthropic API key. It's stored only in your browser and never sent to our servers.
            </p>
            <input
              type="password"
              placeholder="sk-ant-..."
              value={keyDraft}
              onChange={e => setKeyDraft(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveKey()}
              autoFocus
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-[#1D6B42] mb-3"
            />
            <button onClick={saveKey} className="w-full bg-gray-900 hover:bg-[#1D6B42] text-white text-[13px] font-medium rounded-xl py-3 transition-colors">
              Save &amp; start chatting
            </button>
          </div>
        </div>
      )}

      {/* ── Quote Form Modal ─────────────────────────────── */}
      {showQuote && <QuoteFormModal onClose={() => setShowQuote(false)} />}

      {/* ── Waitlist Modal ───────────────────────────────── */}
      {showWaitlist && <WaitlistModal onClose={() => setShowWaitlist(false)} title={waitlistTitle} />}

    </div>
  )
}
