'use client'

import React from 'react'

import { GraduationCap } from 'lucide-react'

interface LearningHeaderProps {
  careerTarget?: string
  savedModulesCount?: number
  priorityGapsCount?: number
  onOpenSavedModal?: () => void
}

export default function LearningHeader({
  careerTarget = 'AI Engineer',
  savedModulesCount = 0,
  priorityGapsCount = 3,
  onOpenSavedModal
}: LearningHeaderProps) {
  return (
    <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pt-1'>
      {/* Left Column: Title & Sub-text */}
      <div className='flex flex-col gap-1.5'>
        {/* Title H1 */}
        <h1 className='text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight'>
          Rekomendasi Belajar
        </h1>

        {/* Sub-text */}
        <p className='text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed'>
          Kurasi materi dan pelatihan dari berbagai platform edukasi eksternal terpercaya, dipersonalisasi berdasarkan kesenjangan kompetensi (skill gap) Anda menuju standar industri {careerTarget}.
        </p>
      </div>

      {/* Right Column: Clickable Saved Modules Button */}
      <div className='shrink-0 self-start lg:self-center'>
        <button
          type='button'
          onClick={onOpenSavedModal}
          className='flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 shadow-2xs hover:shadow-md transition-all cursor-pointer group text-left'
        >
          <div className='w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-300 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-900/60 group-hover:bg-blue-600 group-hover:text-white transition-colors'>
            <GraduationCap className='w-5 h-5' />
          </div>
          <div className='flex flex-col'>
            <span className='text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
              {savedModulesCount} Modul Tersimpan
            </span>
            <span className='text-[11px] text-slate-500 dark:text-slate-400'>
              {savedModulesCount > 0 ? 'Klik untuk melihat modul tersimpan' : `Menutup ${priorityGapsCount} prioritas skill gap`}
            </span>
          </div>
        </button>
      </div>
    </div>
  )
}
