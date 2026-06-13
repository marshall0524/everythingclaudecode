import React from 'react'
import RollButton from './RollButton'

const AboutSection: React.FC = () => {
  return (
    <section className="bg-white pt-16 sm:pt-20 lg:pt-32 pb-12 sm:pb-16 lg:pb-24 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Badge */}
        <div className="flex items-center gap-2.5 mb-10 sm:mb-14 lg:mb-16">
          <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold" style={{ fontSize: '11px' }}>1</span>
          </div>
          <span className="text-[12px] text-gray-600 border border-gray-300 rounded-full px-3 py-1">
            Introducing Gnocchi
          </span>
        </div>

        {/* Heading */}
        <h2
          className="font-medium text-gray-900 leading-[1.12] mb-10 sm:mb-12 lg:mb-0"
          style={{
            fontSize: 'clamp(1.5rem, 4vw, 3.2rem)',
            letterSpacing: '-0.02em',
          }}
        >
          Tailored protection for
          <br />
          the founders building tomorrow.
        </h2>

        {/* MOBILE layout (lg:hidden) */}
        <div className="lg:hidden mt-10">
          <p className="text-[16px] text-gray-600 leading-relaxed mb-8 max-w-xl">
            Through deep understanding of startup risk, regulatory requirements and growth stage,
            we help UK and EU founders build their companies with complete confidence and the
            cover they actually need.
          </p>
          <div className="mb-8">
            <RollButton text="Our story" variant="green" size="md" />
          </div>
          {/* Two images stacked */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80"
                alt="Startup team"
                className="w-full object-cover"
                style={{ aspectRatio: '438/346' }}
              />
            </div>
            <div className="rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&q=80"
                alt="Founders meeting"
                className="w-full object-cover"
                style={{ aspectRatio: '3/2' }}
              />
            </div>
          </div>
        </div>

        {/* DESKTOP layout (hidden lg:grid) */}
        <div
          className="hidden lg:grid items-end gap-8 mt-10"
          style={{ gridTemplateColumns: '26% 1fr 48%' }}
        >
          {/* Left: small image */}
          <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '438/346' }}>
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80"
              alt="Startup team"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Center: paragraph + button */}
          <div className="px-8 xl:px-10 pb-2">
            <p className="text-[16px] text-gray-600 leading-relaxed whitespace-nowrap mb-8">
              Through deep understanding of startup risk,<br />
              regulatory requirements and growth stage,<br />
              we help UK and EU founders build their<br />
              companies with complete confidence and<br />
              the cover they actually need.
            </p>
            <RollButton text="Our story" variant="green" size="md" />
          </div>

          {/* Right: large image */}
          <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '3/2' }}>
            <img
              src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&q=80"
              alt="Founders meeting"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
