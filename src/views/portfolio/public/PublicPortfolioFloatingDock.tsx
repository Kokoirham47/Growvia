'use client'

import React, { useState, useEffect } from 'react'

import { ArrowUp, Share2 } from 'lucide-react'

import type { PortfolioTheme } from '@/types/portfolio'

interface PublicPortfolioFloatingDockProps {
  onShare: () => void
  theme?: PortfolioTheme
  onPrint?: () => void
}

export default function PublicPortfolioFloatingDock({
  onShare,
  theme = 'royal-blue'
}: PublicPortfolioFloatingDockProps) {
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getThemeButtonClass = () => {
    switch (theme) {
      case 'emerald-modern':
        return 'bg-emerald-600 hover:bg-emerald-700 text-white'
      case 'sleek-slate':
        return 'bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900'
      case 'royal-blue':
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white'
    }
  }

  if (!showScrollTop) return null

  return (
    <div className='fixed bottom-6 right-6 z-40 flex items-center gap-2 print:hidden animate-in fade-in slide-in-from-bottom-4 duration-300'>
      <button
        type='button'
        onClick={scrollToTop}
        title='Kembali ke atas'
        className='p-3 rounded-2xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800 shadow-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer'
      >
        <ArrowUp className='w-4 h-4' />
      </button>

      <button
        type='button'
        onClick={onShare}
        className={`inline-flex items-center gap-2 px-4 py-3 rounded-2xl shadow-xl font-bold text-xs sm:text-sm transition-all cursor-pointer hover:scale-105 active:scale-95 ${getThemeButtonClass()}`}
      >
        <Share2 className='w-4 h-4' />
        <span>Bagikan</span>
      </button>
    </div>
  )
}
