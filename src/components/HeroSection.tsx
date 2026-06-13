import React from 'react'
import RollButton from './RollButton'
import StarburstSVG from './StarburstSVG'

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-[#F2EFEA]">
      {/* Animated background shader blobs */}
      <div className="hero-shader" aria-hidden="true" />
      <div className="hero-shader-extra" aria-hidden="true" />
      {/* Film grain overlay */}
      <div className="hero-grain" aria-hidden="true" />

      {/* Hero content — pushed to bottom */}
      <div className="relative z-20 flex-1 flex flex-col justify-end">
        <div className="max-w-[1440px] mx-auto w-full px-5 sm:px-8 lg:px-12 pb-14 sm:pb-16 lg:pb-20">
          {/* Label */}
          <p
            className="text-[13px] sm:text-[14px] text-gray-900 tracking-wide mb-5 sm:mb-8 font-medium"
          >
            Gnocchi Insurance
          </p>

          {/* Headline */}
          <h1
            className="font-medium text-gray-900 leading-[1.08]"
            style={{
              fontSize: 'clamp(1.75rem, 7vw, 4.2rem)',
              letterSpacing: '-0.03em',
            }}
          >
            Business insurance
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            built for founders,
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            not legacy businesses.
          </h1>

          {/* CTA row */}
          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
            {/* Green quote button */}
            <RollButton
              text="Get my quote"
              variant="green"
              size="md"
            />

            {/* FCA badge pill */}
            <div className="inline-flex items-center gap-2 bg-white px-3 py-2 rounded-[4px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-300 cursor-pointer">
              <StarburstSVG className="w-5 h-5 sm:w-6 sm:h-6 fill-current text-[#1D6B42] flex-shrink-0" />
              <span className="text-[13px] sm:text-[14px] font-medium text-gray-900 whitespace-nowrap">
                FCA Authorised
              </span>
              <span className="text-[10px] sm:text-[11px] bg-gray-900 text-white px-1.5 sm:px-2 py-0.5 rounded font-medium whitespace-nowrap">
                UK &amp; EU
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
