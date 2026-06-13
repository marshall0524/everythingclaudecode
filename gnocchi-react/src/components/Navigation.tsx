import React, { useState, useEffect } from 'react'
import { Clock, Menu, X, ArrowRight } from 'lucide-react'

const navLinks = ['Plans', 'Coverage', 'Advisors', 'Contact']

function getLondonTime(): string {
  const now = new Date()
  return now.toLocaleTimeString('en-GB', {
    timeZone: 'Europe/London',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

const Navigation: React.FC = () => {
  const [time, setTime] = useState(getLondonTime())
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuVisible, setMenuVisible] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getLondonTime())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const openMenu = () => {
    setMenuOpen(true)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setMenuVisible(true)
      })
    })
  }

  const closeMenu = () => {
    setMenuVisible(false)
    setTimeout(() => setMenuOpen(false), 500)
  }

  return (
    <>
      <div className="relative z-20 w-full">
        <div className="max-w-[1440px] mx-auto w-full p-2 sm:p-3">
          <nav
            className="bg-white rounded-full flex items-center justify-between"
            style={{ padding: '5px' }}
          >
            {/* LEFT: Logo + nav links */}
            <div className="flex items-center gap-1">
              {/* Logo circle */}
              <div className="w-9 h-9 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold" style={{ fontSize: '10px' }}>
                  GN
                </span>
              </div>

              {/* Nav links — desktop only */}
              <div className="hidden md:flex items-center gap-0.5 ml-1">
                {navLinks.map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="px-3 py-2 text-[14px] text-gray-900 hover:text-gray-500 transition-colors duration-200 rounded-full"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>

            {/* RIGHT: desktop actions */}
            <div className="hidden md:flex items-center gap-3">
              {/* Tagline — large screens only */}
              <span className="hidden lg:block text-[13px] text-gray-600 whitespace-nowrap">
                Now covering UK &amp; EU founders
              </span>

              {/* Clock */}
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-gray-600" />
                <span className="text-[13px] text-gray-600 whitespace-nowrap tabular-nums">
                  {time} in London
                </span>
              </div>

              {/* CTA button */}
              <button
                className="group inline-flex items-center gap-3 bg-gray-900 hover:bg-gray-800 text-white text-[13px] font-medium pl-5 pr-2 py-2 rounded-full transition-colors duration-300"
              >
                {/* Text roll */}
                <span className="relative flex flex-col overflow-hidden" style={{ height: '20px' }}>
                  <span className="block transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-full">
                    Get a free quote
                  </span>
                  <span className="block absolute top-full left-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-full">
                    Get a free quote
                  </span>
                </span>

                {/* Arrow circle */}
                <span className="inline-flex items-center justify-center w-6 h-6 bg-white/20 rounded-full">
                  <ArrowRight
                    className="text-white transition-transform duration-300 group-hover:-rotate-45"
                    size={12}
                    strokeWidth={2.5}
                  />
                </span>
              </button>
            </div>

            {/* MOBILE: menu toggle */}
            <button
              onClick={openMenu}
              className="md:hidden inline-flex items-center gap-2 bg-gray-900 text-white text-[13px] font-medium pl-3 pr-2 py-1.5 rounded-full"
            >
              <span>Menu</span>
              <span className="inline-flex items-center justify-center w-6 h-6 bg-white/20 rounded-full">
                <Menu size={12} className="text-white" />
              </span>
            </button>
          </nav>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-50"
          style={{ background: menuVisible ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0)', transition: 'background 0.3s ease' }}
          onClick={closeMenu}
        >
          <div
            className="absolute inset-x-3 bottom-3 bg-white rounded-2xl overflow-hidden"
            style={{
              transform: menuVisible ? 'translateY(0)' : 'translateY(100%)',
              transition: 'transform 0.5s cubic-bezier(0.32, 0.72, 0, 1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-gray-600" />
                <span className="text-[13px] text-gray-600 tabular-nums">{time} in London</span>
              </div>
              <button
                onClick={closeMenu}
                className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full"
              >
                <X size={14} className="text-gray-900" />
              </button>
            </div>

            {/* Nav links */}
            <div className="px-5 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="block py-3 text-[28px] font-medium text-gray-900 hover:text-gray-500 transition-colors"
                  onClick={closeMenu}
                >
                  {link}
                </a>
              ))}
            </div>

            {/* CTA */}
            <div className="px-5 pb-6 pt-2">
              <button className="group w-full inline-flex items-center justify-between bg-gray-900 text-white text-[15px] font-medium px-5 py-3.5 rounded-full transition-colors duration-300 hover:bg-gray-800">
                <span>Get a quote</span>
                <span className="inline-flex items-center justify-center w-8 h-8 bg-white/20 rounded-full">
                  <ArrowRight size={14} className="text-white transition-transform duration-300 group-hover:-rotate-45" strokeWidth={2.5} />
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Navigation
