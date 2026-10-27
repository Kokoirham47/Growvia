'use client'

import React, { useState } from 'react'

import {
  Monitor,
  Smartphone,
  ExternalLink
} from 'lucide-react'

import type {
  PublicPortfolioData,
  PortfolioTheme,
  PortfolioSectionVisibility
} from '@/types/portfolio'
import PublicPortfolioContent from './public/PublicPortfolioContent'

interface PortfolioLivePreviewFrameProps {
  data: PublicPortfolioData
  theme: PortfolioTheme
  sections: PortfolioSectionVisibility
  slug: string
}

export default function PortfolioLivePreviewFrame({
  data,
  theme,
  sections,
  slug
}: PortfolioLivePreviewFrameProps) {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop')

  // Prepare updated data with the live edits
  const livePreviewData: PublicPortfolioData = {
    ...data,
    theme,
    sections
  }

  return (
    <div className='flex flex-col h-full w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-hidden'>
      {/* Top Frame Control Bar */}
      <div className='px-4 sm:px-6 py-3.5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-850 backdrop-blur-xs shrink-0'>
        {/* Left: Device Switcher */}
        <div className='flex items-center gap-1.5 p-1 rounded-xl bg-slate-200/60 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80'>
          <button
            type='button'
            onClick={() => setDeviceMode('desktop')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              deviceMode === 'desktop'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Monitor className='w-3.5 h-3.5' />
            <span className='hidden sm:inline'>Desktop</span>
          </button>

          <button
            type='button'
            onClick={() => setDeviceMode('mobile')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              deviceMode === 'mobile'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Smartphone className='w-3.5 h-3.5' />
            <span className='hidden sm:inline'>Mobile</span>
          </button>
        </div>

        {/* Center: Mock URL Bar */}
        <div className='hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 font-mono max-w-xs truncate'>
          <span className='truncate'>growvia.app/u/{slug}</span>
        </div>

        {/* Right: Live Sync Indicator & Open link */}
        <div className='flex items-center gap-2'>
          <a
            href={`/u/${slug}`}
            target='_blank'
            rel='noopener noreferrer'
            title='Buka di tab baru'
            className='p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
          >
            <ExternalLink className='w-4 h-4' />
          </a>
        </div>
      </div>

      {/* Frame Screen Canvas Container */}
      <div className='flex-1 bg-slate-100 dark:bg-slate-950/60 p-2 sm:p-4 overflow-y-auto flex justify-center items-start'>
        {deviceMode === 'desktop' ? (

          // Desktop Screen
          <div className='w-full min-h-[600px] bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-md overflow-hidden'>
            <PublicPortfolioContent
              data={livePreviewData}
              theme={theme}
              sections={sections}
              isPreviewMode={true}
              isMobileView={false}
            />
          </div>
        ) : (

          // Mobile Phone Device Frame
          <div className='w-[380px] max-w-full my-4 bg-white dark:bg-slate-950 rounded-[40px] border-[10px] border-slate-800 dark:border-slate-700 shadow-2xl overflow-hidden flex flex-col relative'>
            {/* Phone Notch */}
            <div className='w-full bg-slate-800 dark:border-slate-700 h-5 flex items-center justify-center shrink-0'>
              <div className='w-20 h-3 rounded-full bg-slate-900' />
            </div>

            {/* Mobile Screen Scrollable */}
            <div className='overflow-y-auto max-h-[700px]'>
              <PublicPortfolioContent
                data={livePreviewData}
                theme={theme}
                sections={sections}
                isPreviewMode={true}
                isMobileView={true}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
