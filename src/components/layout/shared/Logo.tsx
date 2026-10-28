'use client'

// React Imports
import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'
import { useSettings } from '@core/hooks/useSettings'

const Logo = ({ color }: { color?: CSSProperties['color'] }) => {
  // Refs
  const logoTextRef = useRef<HTMLDivElement>(null)

  // Hooks
  const { isHovered, isBreakpointReached } = useVerticalNav()
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
    <div className='flex items-center gap-2.5 font-poppins group'>
      <img
        src='/images/growvia-logo.png'
        alt='Growvia Logo'
        className='w-7 h-7 object-contain shrink-0 group-hover:scale-105 transition-transform'
      />
      <div
        ref={logoTextRef}
        style={{ color }}
        className={`flex items-center transition-opacity duration-200 ${
          !isBreakpointReached && layout === 'collapsed' && !isHovered ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <span className='font-bold text-[19px] text-slate-900 dark:text-white leading-none tracking-tight font-poppins'>
          Growvia
        </span>
      </div>
    </div>
  )
}

export default Logo
