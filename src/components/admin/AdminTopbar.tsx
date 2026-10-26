'use client'

import React, { useState, useEffect } from 'react'

import { usePathname } from 'next/navigation'

import { Menu, Sun, Moon } from 'lucide-react'

interface AdminTopbarProps {
  onToggleSidebar: () => void
  adminName?: string
}

const titlesMap: Record<string, { title: string; subtitle: string }> = {
  '/admin/dashboard': {
    title: 'Dashboard Overview',
    subtitle: 'Ringkasan metrik statistik master data sistem Growvia'
  },
  '/admin/skills': {
    title: 'Skill Taxonomy',
    subtitle: 'Katalog keahlian global untuk ekstraksi AI dan analisis gap'
  },
  '/admin/career-roles': {
    title: 'Career Paths & Roles',
    subtitle: 'Peran karier sasaran dan pemetaan keahlian yang dipersyaratkan'
  },
  '/admin/learning-resources': {
    title: 'Learning Resources',
    subtitle: 'Katalog rekomendasi materi belajar, kursus, dan sertifikasi'
  },
  '/admin/opportunities': {
    title: 'Career Opportunities',
    subtitle: 'Daftar lowongan kerja, magang, dan proyek karier'
  }
}

export default function AdminTopbar({ onToggleSidebar, adminName = 'Super Admin' }: AdminTopbarProps) {
  const pathname = usePathname()
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const isDarkMode =
        document.documentElement.classList.contains('dark') ||
        document.documentElement.getAttribute('data-theme') === 'dark' ||
        document.documentElement.getAttribute('data-mui-color-scheme') === 'dark'

      setIsDark(isDarkMode)
    }
  }, [])

  const currentMeta = titlesMap[pathname] || {
    title: 'Admin Console',
    subtitle: 'Growvia Master Data Management'
  }

  const toggleTheme = () => {
    const nextDark = !isDark

    setIsDark(nextDark)

    if (typeof document !== 'undefined') {
      const modeStr = nextDark ? 'dark' : 'light'

      if (nextDark) {
        document.documentElement.classList.add('dark')
        document.documentElement.setAttribute('data-theme', 'dark')
        document.documentElement.setAttribute('data-mui-color-scheme', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        document.documentElement.setAttribute('data-theme', 'light')
        document.documentElement.setAttribute('data-mui-color-scheme', 'light')
      }

      document.cookie = `settings={"mode":"${modeStr}"}; path=/; max-age=31536000`
    }
  }

  return (
    <header className='sticky top-0 z-30 h-18 bg-white/80 dark:bg-[#0B0F1C]/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-colors'>
      <div className='flex items-center gap-3 sm:gap-4'>
        {/* Mobile menu trigger */}
        <button
          onClick={onToggleSidebar}
          className='lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors'
          aria-label='Toggle Sidebar'
        >
          <Menu className='w-5 h-5' />
        </button>

        {/* Page Title & Breadcrumb */}
        <div>
          <h1 className='text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight'>
            {currentMeta.title}
          </h1>
          <p className='text-xs text-slate-500 dark:text-slate-400 hidden sm:block'>
            {currentMeta.subtitle}
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className='flex items-center gap-2.5 sm:gap-3.5'>
        {/* Theme Toggle Pill Switch */}
        <button
          type='button'
          onClick={toggleTheme}
          aria-label={isDark ? 'Beralih ke Light mode' : 'Beralih ke Dark mode'}
          title={isDark ? 'Mode Gelap (Klik untuk Light Mode)' : 'Mode Terang (Klik untuk Dark Mode)'}
          className={`relative inline-flex h-8 w-[60px] sm:h-9 sm:w-[68px] shrink-0 cursor-pointer items-center rounded-full p-1 border transition-colors duration-300 ease-in-out shadow-xs ${
            isDark ? 'bg-[#111827] border-[#1F2937]' : 'bg-white border-slate-200'
          }`}
        >
          <div className='absolute inset-0 flex items-center justify-between px-1.5 sm:px-2 pointer-events-none'>
            <Sun className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-opacity duration-200 ${isDark ? 'opacity-30 text-slate-400' : 'opacity-80 text-amber-500'}`} />
            <Moon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-opacity duration-200 ${isDark ? 'opacity-80 text-blue-400' : 'opacity-30 text-slate-400'}`} />
          </div>

          <span
            className={`pointer-events-none flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full shadow-md transition-transform duration-300 ease-in-out ${
              isDark
                ? 'translate-x-[28px] sm:translate-x-[32px] bg-[#1E293B] text-blue-400 border border-slate-700'
                : 'translate-x-0 bg-white text-amber-500 border border-slate-100 shadow-xs'
            }`}
          >
            {isDark ? <Moon className='w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current' /> : <Sun className='w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current' />}
          </span>
        </button>

        {/* Active Badge */}
        <div className='hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-300 text-xs font-semibold'>
          <span className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse' />
          <span>Active Session</span>
        </div>

        {/* Admin Avatar Pill */}
        <div className='flex items-center gap-2 pl-2 sm:border-l border-slate-200 dark:border-slate-800'>
          <div className='w-8 h-8 rounded-full bg-purple-600/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 flex items-center justify-center font-bold text-xs'>
            {adminName.slice(0, 2).toUpperCase()}
          </div>
          <span className='text-xs font-semibold text-slate-700 dark:text-slate-200 hidden md:inline'>
            {adminName}
          </span>
        </div>
      </div>
    </header>
  )
}
