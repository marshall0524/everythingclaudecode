import { useState, useEffect } from 'react'
import { Clock, Menu, X, ArrowRight } from 'lucide-react'
import RollButton from './components/RollButton'
import StarburstSVG from './components/StarburstSVG'

/* ── live London clock ─────────────────────────────────────── */
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

/* ── expanding hover pill button for cards ─────────────────── */
interface PillProps {
  label: string
  light?: boolean
}
function ExpandingPill({ label, light = false }: PillProps) {
  return (
    <div
      className={`
        group/pill absolute bottom-4 left-4 z-10
        flex items-center overflow-hidden rounded-full cursor-pointer
        h-9 w-9 hover:w-[148px] transition-all duration-300 ease-in-out
        ${light ? 'bg-white' : 'bg-gray-900'}
      `}
    >
      <span
        className={`
          ml-4 whitespace-nowrap text-[13px] font-medium opacity-0
          group-hover/pill:opacity-100 transition-opacity delay-100 duration-200
          ${light ? 'text-gray-900' : 'text-white'}
        `}
      >
        {label}
      </span>
      <span className="ml-auto mr-2 flex-shrink-0">
        <ArrowRight
          size={14}
          className={`
            transition-transform duration-300
            -rotate-45 group-hover/pill:rotate-0
            ${light ? 'text-gray-900' : 'text-white'}
          `}
        />
      </span>
    </div>
  )
}

/* ── badge row helper ──────────────────────────────────────── */
function SectionBadge({ num, label, lightBorder }: { num: string; label: string; lightBorder?: boolean }) {
  return (
    <div className="flex items-center gap-3 mb-6 sm:mb-8">
      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
        <span className="text-white font-semibold" style={{ fontSize: '11px' }}>{num}</span>
      </div>
      <span
        className={`text-[12px] sm:text-[13px] font-medium border rounded-full px-3 sm:px-4 py-1 sm:py-1.5 ${
          lightBorder ? 'border-gray-300' : 'border-gray-200'
        }`}
      >
        {label}
      </span>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────── */

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const londonTime = useLondonTime()

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">

      {/* ══ SECTION 1 — HERO ══════════════════════════════════ */}
      <section className="min-h-screen bg-[#EFEFEF] relative flex flex-col">

        {/* Animated shader background */}
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          <div className="hero-shader" />
          <div className="hero-shader-extra" />
          <div className="hero-grain" />
        </div>

        {/* ── NAV ─────────────────────────────────────────── */}
        <div className="relative z-20 max-w-[1440px] mx-auto w-full p-2 sm:p-3">
          <nav className="bg-white rounded-full flex items-center justify-between" style={{ padding: '5px' }}>

            {/* Left: logo + links */}
            <div className="flex items-center gap-4 sm:gap-6 pl-1">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold tracking-tight" style={{ fontSize: '10px' }}>GN</span>
              </div>
              <div className="hidden md:flex items-center gap-6">
                {['Plans', 'Coverage', 'Advisors', 'Contact'].map(l => (
                  <a key={l} href="#" className="text-[14px] text-gray-900 hover:text-gray-500 transition-colors duration-300">{l}</a>
                ))}
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
                onClick={() => document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <div className="overflow-hidden" style={{ height: '20px' }}>
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

        {/* ── HERO CONTENT ────────────────────────────────── */}
        <div className="flex-1 flex items-end relative z-20">
          <div className="max-w-[1440px] mx-auto w-full px-5 sm:px-8 lg:px-12 pb-14 sm:pb-16 lg:pb-20">
            <p className="text-[13px] sm:text-[14px] text-gray-900 tracking-wide mb-5 sm:mb-8">
              Gnocchi Insurance
            </p>
            <h1
              className="font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 mb-8 sm:mb-12"
              style={{ fontSize: 'clamp(1.75rem, 7vw, 4.2rem)' }}
            >
              Business insurance
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              built for founders,
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              not legacy businesses.
            </h1>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
              {/* Primary CTA */}
              <RollButton text="Get my quote" variant="green" size="md" />

              {/* FCA badge */}
              <div
                className="flex items-center gap-2 bg-white rounded-[4px] px-3 sm:px-4 py-2 cursor-default select-none transition-shadow duration-200"
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)')}
              >
                <StarburstSVG className="w-5 h-5 sm:w-6 sm:h-6 fill-current text-[#1D6B42]" />
                <span className="text-[13px] sm:text-[14px] font-medium text-gray-900">FCA Authorised</span>
                <span className="text-[10px] sm:text-[11px] bg-gray-900 text-white px-1.5 sm:px-2 py-0.5 rounded font-medium">
                  UK &amp; EU
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MOBILE MENU OVERLAY ─────────────────────────── */}
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
            {['Plans', 'Coverage', 'Advisors', 'Contact'].map(l => (
              <li key={l}>
                <a
                  href="#"
                  className="text-[28px] sm:text-[32px] font-medium text-gray-900 hover:text-[#1D6B42] transition-colors duration-200"
                  onClick={() => setMenuOpen(false)}
                >
                  {l}
                </a>
              </li>
            ))}
          </ul>
          <RollButton text="Get a quote" variant="green" size="md" onClick={() => setMenuOpen(false)} />
        </div>
      </div>

      {/* ══ SECTION 2 — ABOUT ═════════════════════════════════ */}
      <section className="bg-white pt-16 sm:pt-20 lg:pt-32 pb-12 sm:pb-16 lg:pb-24 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">

          <SectionBadge num="1" label="Introducing Gnocchi" />

          <h2
            className="font-medium leading-[1.12] tracking-[-0.02em] text-gray-900 mb-12 sm:mb-16 lg:mb-28"
            style={{ fontSize: 'clamp(1.5rem, 4vw, 3.2rem)' }}
          >
            Tailored protection for
            <br />
            the founders building tomorrow.
          </h2>

          {/* Mobile / tablet layout */}
          <div className="lg:hidden space-y-8">
            <div>
              <p className="text-[15px] sm:text-[17px] leading-[1.6] font-medium text-gray-900 mb-7">
                Through deep understanding of startup risk, regulatory requirements and growth stage, we help UK and EU founders build their companies with complete confidence and the cover they actually need.
              </p>
              <RollButton text="Our story" variant="green" size="md" />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 mt-8">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80"
                alt="Startup founders collaborating"
                className="sm:w-[45%] aspect-[438/346] object-cover rounded-xl sm:rounded-2xl"
              />
              <img
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&q=80"
                alt="Modern office workspace"
                className="sm:w-[55%] aspect-[900/600] object-cover rounded-xl sm:rounded-2xl"
              />
            </div>
          </div>

          {/* Desktop layout */}
          <div className="hidden lg:grid grid-cols-[26%_1fr_48%] items-end gap-6 xl:gap-8">
            <div className="self-end">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80"
                alt="Startup founders collaborating"
                className="aspect-[438/346] object-cover rounded-2xl w-full"
              />
            </div>
            <div className="self-start flex flex-col justify-end pb-4">
              <p className="text-[16px] sm:text-[18px] leading-[1.65] font-medium text-gray-900 whitespace-nowrap mb-8">
                Through deep understanding of<br />
                startup risk, regulatory requirements<br />
                and growth stage, we help UK and<br />
                EU founders build with confidence<br />
                and the cover they actually need.
              </p>
              <RollButton text="Our story" variant="green" size="md" />
            </div>
            <div className="self-end">
              <img
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&q=80"
                alt="Modern office workspace"
                className="aspect-[3/2] object-cover rounded-2xl w-full"
              />
            </div>
          </div>

        </div>
      </section>

      {/* ══ SECTION 3 — PACKAGES ══════════════════════════════ */}
      <section id="quote" className="bg-[#F5F5F5] pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 lg:pb-28">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">

          <SectionBadge num="2" label="Coverage plans" lightBorder />

          <h2
            className="font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 mb-10 sm:mb-14 lg:mb-16"
            style={{ fontSize: 'clamp(1.75rem, 7vw, 4.2rem)' }}
          >
            Our packages
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-7">

            {/* ── Card 1: Essentials ───────────────────────── */}
            <div>
              <div className="aspect-[329/246] rounded-2xl overflow-hidden bg-[#EBF5EE] group cursor-pointer relative flex items-center justify-center p-6">
                {/* Mini plan card inside */}
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
                    {['Professional indemnity', 'Cyber incident cover', 'Employers\' liability'].map(f => (
                      <li key={f} className="flex items-center gap-2 text-[12px] text-gray-600">
                        <span className="w-4 h-4 rounded-full bg-[#EBF5EE] flex items-center justify-center flex-shrink-0">
                          <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5l2 2 4-4" stroke="#1D6B42" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <ExpandingPill label="View plan" />
              </div>
              <p className="text-[13px] text-gray-600 mt-4 leading-relaxed">
                Core protection for early-stage teams. Professional indemnity, cyber, and public liability from day one.
              </p>
              <p className="text-[14px] sm:text-[15px] font-semibold text-gray-900 mt-1">Essentials — Pre-Seed</p>
            </div>

            {/* ── Card 2: Growth ───────────────────────────── */}
            <div>
              <div className="aspect-square rounded-2xl overflow-hidden bg-[#0F2419] group cursor-pointer relative flex items-center justify-center p-6">
                {/* Mini plan card inside */}
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
                          <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5l2 2 4-4" stroke="#A8D4B8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* White pill */}
                <div
                  className="group/pill absolute bottom-4 left-4 z-10 flex items-center overflow-hidden rounded-full cursor-pointer h-9 w-9 hover:w-[168px] transition-all duration-300 ease-in-out bg-white"
                >
                  <span className="ml-4 whitespace-nowrap text-[13px] font-medium text-gray-900 opacity-0 group-hover/pill:opacity-100 transition-opacity delay-100 duration-200">
                    View plan
                  </span>
                  <span className="ml-auto mr-2 flex-shrink-0">
                    <ArrowRight size={14} className="text-gray-900 transition-transform duration-300 -rotate-45 group-hover/pill:rotate-0" />
                  </span>
                </div>
              </div>
              <p className="text-[13px] text-gray-600 mt-4 leading-relaxed">
                The all-in-one growth plan for funded startups. D&amp;O cover, enhanced cyber, and investor due diligence support.
              </p>
              <p className="text-[14px] sm:text-[15px] font-semibold text-gray-900 mt-1">Growth — Seed</p>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}
