'use client'

// React Imports
import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'

// Component Imports
import GrowviaLogo from '@core/svg/Logo'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'
import { useSettings } from '@core/hooks/useSettings'

const Logo = ({ color }: { color?: CSSProperties['color'] }) => {
  // Refs
  const logoTextRef = useRef<HTMLDivElement>(null)

  // Hooks
  const { isHovered, transitionDuration, isBreakpointReached } = useVerticalNav()
  const { settings } = useSettings()

  // Vars
  const { layout } = settings

  useEffect(() => {
    if (layout !== 'collapsed') {
      return
    }

    if (logoTextRef && logoTextRef.current) {
      if (!isBreakpointReached && layout === 'collapsed' && !isHovered) {
        logoTextRef.current?.classList.add('hidden')
      } else {
        logoTextRef.current.classList.remove('hidden')
      }
    }
  }, [isHovered, layout, isBreakpointReached])

  return (
    <div className='flex items-center gap-2.5'>
      <GrowviaLogo className='text-[30px] shrink-0' />
      <div
        ref={logoTextRef}
        style={{ color }}
        className={`flex flex-col transition-opacity duration-200 ${
          !isBreakpointReached && layout === 'collapsed' && !isHovered ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <span className='font-bold text-[18px] text-[#1E293B] leading-tight tracking-tight'>
          Growvia
        </span>
        <span className='text-[10px] font-medium text-[#64748B] tracking-normal leading-tight'>
          Career Compass
        </span>
      </div>
    </div>
  )
}

export default Logo
