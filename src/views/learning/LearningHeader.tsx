'use client'

import React from 'react'

import { Sparkles, GraduationCap } from 'lucide-react'

interface LearningHeaderProps {
  careerTarget?: string
  selectedModulesCount?: number
  priorityGapsCount?: number
}

export default function LearningHeader({
  careerTarget = 'AI Engineer',
  selectedModulesCount = 4,
  priorityGapsCount = 3
}: LearningHeaderProps) {
  return (
    <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pt-1'>
      {/* Left Column: Badges + H1 + Sub-text */}
      <div className='flex flex-col gap-2'>
        {/* Badges Row */}
        <div className='flex flex-wrap items-center gap-2'>
          {/* AI Badge: Growvia AI · Diperbarui hari ini */}
          <div className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800/60 shadow-2xs'>
            <Sparkles className='w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 animate-pulse' />
            <span>Growvia AI · Diperbarui hari ini</span>
          </div>

          {/* Career Target Badge */}
          <div className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/70 dark:border-blue-800/60 shadow-2xs'>
            <span className='w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400' />
            <span>Target: {careerTarget}</span>
          </div>
        </div>

        {/* Title H1 */}
        <h1 className='text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight'>
          Rekomendasi Belajar
        </h1>

        {/* Sub-text */}
        <p className='text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed'>
          Dipersonalisasi berdasarkan kesenjangan kompetensi (skill gap) kamu menuju standar industri {careerTarget}.
        </p>
      </div>

      {/* Right Column: Stat Badge / Card (4 Modul Terpilih - Menutup 3 prioritas skill gap) */}
      <div className='shrink-0 self-start lg:self-center'>
        <div className='flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs'>
          <div className='w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-300 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-900/60'>
            <GraduationCap className='w-5 h-5' />
          </div>
          <div className='flex flex-col'>
            <span className='text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight'>
              {selectedModulesCount} Modul Terpilih
            </span>
            <span className='text-[11px] text-slate-500 dark:text-slate-400'>
              Menutup {priorityGapsCount} prioritas skill gap
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
