import React from 'react'
import { ArrowRight, Check } from 'lucide-react'

const essentialsBullets = [
  'Professional indemnity',
  'Cyber cover',
  "Employers' liability",
]

const growthBullets = [
  'D&O cover',
  'Enhanced cyber £2M',
  'Investor DD support',
]

const PackagesSection: React.FC = () => {
  return (
    <section className="bg-[#F5F5F5] pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 lg:pb-28">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Badge */}
        <div className="flex items-center gap-2.5 mb-10 sm:mb-14 lg:mb-16">
          <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold" style={{ fontSize: '11px' }}>2</span>
          </div>
          <span className="text-[12px] text-gray-600 border border-gray-300 rounded-full px-3 py-1">
            Coverage plans
          </span>
        </div>

        {/* Heading */}
        <h2
          className="font-medium text-gray-900 leading-[1.08] mb-10 sm:mb-12 lg:mb-14"
          style={{
            fontSize: 'clamp(1.75rem, 7vw, 4.2rem)',
            letterSpacing: '-0.03em',
          }}
        >
          Our packages
        </h2>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-7">
          {/* Card 1 — Essentials */}
          <div>
            {/* Media container */}
            <div
              className="aspect-[329/246] rounded-2xl overflow-hidden group cursor-pointer relative"
              style={{
                background: 'linear-gradient(135deg, #F5F0E8 0%, #EBF5EE 100%)',
              }}
            >
              {/* Mini plan card UI */}
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <div className="bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-5 w-full max-w-[220px]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[13px] font-semibold text-gray-900">Essentials</span>
                    <span className="text-[11px] text-[#1D6B42] bg-[#EBF5EE] px-2 py-0.5 rounded font-medium">
                      Popular
                    </span>
                  </div>
                  <div className="mb-4">
                    <span className="text-[22px] font-semibold text-gray-900">£79</span>
                    <span className="text-[12px] text-gray-500">/mo</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {essentialsBullets.map((bullet) => (
                      <div key={bullet} className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-[#EBF5EE] flex items-center justify-center flex-shrink-0">
                          <Check size={9} className="text-[#1D6B42]" strokeWidth={3} />
                        </div>
                        <span className="text-[12px] text-gray-700">{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Hover expand button */}
              <div className="absolute bottom-4 left-4">
                <div
                  className="group-hover:w-[148px] w-9 h-9 bg-gray-900 rounded-full flex items-center overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
                >
                  <span className="pl-4 text-[13px] font-medium text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    View plan
                  </span>
                  <span className="ml-auto flex-shrink-0 inline-flex items-center justify-center w-9 h-9 bg-white/20 rounded-full">
                    <ArrowRight
                      size={14}
                      className="text-white transition-transform duration-300 -rotate-45 group-hover:rotate-0"
                      strokeWidth={2.5}
                    />
                  </span>
                </div>
              </div>
            </div>

            {/* Card text */}
            <p className="text-[13px] text-gray-600 mt-4 leading-relaxed">
              Core protection for early-stage teams. Professional indemnity, cyber, and public
              liability from day one.
            </p>
            <p className="text-[14px] font-semibold text-gray-900 mt-1">
              Essentials — Pre-Seed
            </p>
          </div>

          {/* Card 2 — Growth */}
          <div>
            {/* Media container */}
            <div
              className="aspect-square rounded-2xl overflow-hidden group cursor-pointer relative bg-[#0F2419]"
            >
              {/* Mini plan card UI — dark */}
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <div
                  className="rounded-xl p-5 w-full max-w-[220px] border border-white/10"
                  style={{ background: 'rgba(255,255,255,0.07)' }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[13px] font-semibold text-white">Growth</span>
                    <span className="text-[11px] text-[#4ADE80] bg-[#1D6B42]/40 px-2 py-0.5 rounded font-medium">
                      Recommended
                    </span>
                  </div>
                  <div className="mb-4">
                    <span className="text-[22px] font-semibold text-white">£229</span>
                    <span className="text-[12px] text-white/50">/mo</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {growthBullets.map((bullet) => (
                      <div key={bullet} className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: 'rgba(74,222,128,0.2)' }}
                        >
                          <Check size={9} className="text-[#4ADE80]" strokeWidth={3} />
                        </div>
                        <span className="text-[12px] text-white/80">{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Hover expand button */}
              <div className="absolute bottom-4 left-4">
                <div
                  className="group-hover:w-[168px] w-9 h-9 bg-white rounded-full flex items-center overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
                >
                  <span className="pl-4 text-[13px] font-medium text-gray-900 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    View plan
                  </span>
                  <span className="ml-auto flex-shrink-0 inline-flex items-center justify-center w-9 h-9 bg-gray-900/10 rounded-full">
                    <ArrowRight
                      size={14}
                      className="text-gray-900 transition-transform duration-300 -rotate-45 group-hover:rotate-0"
                      strokeWidth={2.5}
                    />
                  </span>
                </div>
              </div>
            </div>

            {/* Card text */}
            <p className="text-[13px] text-gray-600 mt-4 leading-relaxed">
              The all-in-one growth plan for funded startups. D&amp;O cover, enhanced cyber, and
              investor due diligence support.
            </p>
            <p className="text-[14px] font-semibold text-gray-900 mt-1">
              Growth — Seed
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PackagesSection
