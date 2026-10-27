'use client'

import React, { useState, useEffect } from 'react'

import Link from 'next/link'
import Image from 'next/image'

import { Share2, Sun, Moon } from 'lucide-react'

import type { PortfolioTheme } from '@/types/portfolio'
import { useSettings } from '@core/hooks/useSettings'

interface PublicPortfolioHeaderProps {
  userName?: string
  userEmail?: string
  theme?: PortfolioTheme
  onShare: () => void
  onPrint?: () => void
}

export default function PublicPortfolioHeader({
  theme = 'royal-blue',
  onShare
}: PublicPortfolioHeaderProps) {
  const [mounted, setMounted] = useState<boolean>(false)
  const [localDark, setLocalDark] = useState<boolean>(false)

  let settingsMode = 'light'
  let updateSettings: ((newSettings: { mode: 'light' | 'dark' | 'system' }) => void) | null = null

  try {
    const settingsContext = useSettings()

    if (settingsContext) {
      settingsMode = settingsContext.settings.mode || 'light'
      updateSettings = settingsContext.updateSettings
    }
  } catch {
    // Fallback if rendered outside SettingsProvider
  }

  useEffect(() => {
    setMounted(true)

    const isDark =
      document.documentElement.getAttribute('data-mui-color-scheme') === 'dark' ||
      document.documentElement.getAttribute('data-theme') === 'dark' ||
      document.documentElement.classList.contains('dark') ||
      settingsMode === 'dark'

    setLocalDark(isDark)
  }, [settingsMode])

  const handleToggleTheme = () => {
    const nextDark = !localDark
    const nextMode = nextDark ? 'dark' : 'light'

    setLocalDark(nextDark)

    if (updateSettings) {
      updateSettings({ mode: nextMode })
    }

    document.documentElement.setAttribute('data-mui-color-scheme', nextMode)
    document.documentElement.setAttribute('data-theme', nextMode)

    if (nextDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    try {
      document.cookie = `mode=${nextMode}; path=/; max-age=31536000`
      localStorage.setItem('growvia-mode', nextMode)
    } catch {
      // ignore
    }
  }

  const getThemeButtonClass = () => {
    switch (theme) {
      case 'emerald-modern':
        return 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
      case 'sleek-slate':
        return 'bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
      case 'royal-blue':
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
    }
  }

  return (
    <header className='sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors print:hidden'>
      <div className='max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4'>
        {/* Left: Minimal Clean Growvia Brand */}
        <Link href='/' className='flex items-center gap-2.5 group'>
          <div className='relative w-8 h-8 rounded-xl overflow-hidden shadow-xs group-hover:scale-105 transition-transform'>
            <Image
              src='/images/growvia-logo.png'
              alt='Growvia'
              fill
              className='object-contain'
              sizes='32px'
              priority
            />
          </div>
          <div className='flex flex-col'>
            <span className='font-extrabold text-base tracking-tight text-slate-900 dark:text-white leading-none'>
              Growvia
            </span>
          </div>
        </Link>

        {/* Right: Clean Actions (Theme Toggle & Share) */}
        <div className='flex items-center gap-2.5'>
          {/* Dark Mode / Light Mode Toggle Button */}
          <button
            type='button'
            onClick={handleToggleTheme}
            title={localDark ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
            aria-label='Toggle Dark Mode / Light Mode'
            className='w-9 h-9 rounded-xl flex items-center justify-center border border-slate-200/80 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 transition-all shadow-2xs cursor-pointer'
          >
            {mounted && localDark ? (
              <Sun className='w-4 h-4 text-amber-400 hover:rotate-45 transition-transform' />
            ) : (
              <Moon className='w-4 h-4 text-slate-600 hover:-rotate-12 transition-transform' />
            )}
          </button>

          {/* Share Button */}
          <button
            type='button'
            onClick={onShare}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${getThemeButtonClass()}`}
          >
            <Share2 className='w-4 h-4' />
            <span>Bagikan</span>
          </button>
        </div>
      </div>
    </header>
  )
}
