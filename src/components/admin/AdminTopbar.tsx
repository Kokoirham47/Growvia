'use client'

import React from 'react'

import { usePathname } from 'next/navigation'

import { Menu, Sun, Moon } from 'lucide-react'

import { useSettings } from '@core/hooks/useSettings'

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
  const { settings, updateSettings } = useSettings()

  const currentMeta = titlesMap[pathname] || {
    title: 'Admin Console',
    subtitle: 'Growvia Master Data Management'
  }

  const isDark = settings.mode === 'dark'

  const toggleTheme = () => {
    updateSettings({ mode: isDark ? 'light' : 'dark' })
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
        {/* Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          className='p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors'
          title={`Ganti ke mode ${isDark ? 'Terang' : 'Gelap'}`}
        >
          {isDark ? <Sun className='w-4 h-4 text-amber-400' /> : <Moon className='w-4 h-4 text-purple-600' />}
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
