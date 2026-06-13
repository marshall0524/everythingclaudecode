import React from 'react'
import { ArrowRight } from 'lucide-react'

interface RollButtonProps {
  text: string
  variant?: 'green' | 'dark'
  size?: 'sm' | 'md'
  onClick?: () => void
  className?: string
}

const RollButton: React.FC<RollButtonProps> = ({
  text,
  variant = 'dark',
  size = 'md',
  onClick,
  className = '',
}) => {
  const isGreen = variant === 'green'
  const isSm = size === 'sm'

  const bgClass = isGreen ? 'bg-[#1D6B42] hover:bg-[#155232]' : 'bg-gray-900 hover:bg-gray-800'
  const textClass = 'text-white'
  const arrowBg = isGreen
    ? 'bg-white'
    : 'bg-white/20'
  const arrowColor = isGreen ? 'text-[#1D6B42]' : 'text-white'

  const circleSize = isSm
    ? 'w-6 h-6'
    : 'w-7 h-7 sm:w-8 sm:h-8'

  const fontSize = isSm ? 'text-[13px]' : 'text-[13px] sm:text-[14px]'
  const paddingL = isSm ? 'pl-4 pr-1.5 py-1.5' : 'pl-5 sm:pl-6 pr-2 py-2'

  return (
    <button
      onClick={onClick}
      className={`group inline-flex items-center gap-3 ${bgClass} ${textClass} ${fontSize} font-medium ${paddingL} rounded-full transition-colors duration-300 ${className}`}
    >
      {/* Text roll */}
      <span className="relative flex flex-col overflow-hidden" style={{ height: isSm ? '18px' : '20px' }}>
        <span
          className="transition-transform duration-500"
          style={{
            transitionTimingFunction: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
          }}
        >
          <span className="block group-hover:-translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]">
            {text}
          </span>
          <span className="block absolute top-full left-0 group-hover:-translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]">
            {text}
          </span>
        </span>
      </span>

      {/* Arrow circle */}
      <span
        className={`inline-flex items-center justify-center ${circleSize} ${arrowBg} rounded-full transition-transform duration-300`}
      >
        <ArrowRight
          className={`${arrowColor} transition-transform duration-300 group-hover:-rotate-45`}
          size={isSm ? 12 : 14}
          strokeWidth={2.5}
        />
      </span>
    </button>
  )
}

export default RollButton
