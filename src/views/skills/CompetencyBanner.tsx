'use client'

import React from 'react'
import { Sparkles, ArrowRight, BarChart2 } from 'lucide-react'

interface CompetencyBannerProps {
  onOpenBenchmark: () => void
}

export default function CompetencyBanner({ onOpenBenchmark }: CompetencyBannerProps) {
  return (
    <div className='relative overflow-hidden rounded-[16px] p-4 sm:p-5 bg-gradient-to-r from-[#F5F7FF] via-[#EEF2FF] to-[#F8FAFC] dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900 border border-[#E0E7FF] dark:border-indigo-900/40 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
      {/* Left content with icon badge */}
      <div className='flex items-center gap-3.5'>
        <div className='w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-[#E0E7FF] dark:border-indigo-900/60 shadow-xs flex items-center justify-center text-[#6366F1] shrink-0'>
          <Sparkles className='w-5 h-5 text-[#6366F1]' />
        </div>

        <div>
          <div className='flex items-center gap-2'>
            <span className='font-bold text-sm text-[#1E3A8A] dark:text-blue-300 tracking-tight'>
              Analisis Distribusi Kompetensi
            </span>
          </div>
          <p className='text-xs sm:text-[13px] text-[#64748B] dark:text-slate-400 mt-0.5 leading-relaxed'>
            Skill kepemimpinan & visual design kamu berada pada kuadran <span className='font-semibold text-slate-800 dark:text-slate-200'>top 10%</span> lulusan satu angkatan.
          </p>
        </div>
      </div>

      {/* Right button */}
      <button
        type='button'
        onClick={onOpenBenchmark}
        className='inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-[#1E3A8A] dark:text-blue-300 border border-[#DBEAFE] dark:border-indigo-900/50 text-xs sm:text-sm font-semibold transition-all shadow-xs hover:shadow active:scale-[0.98] shrink-0 cursor-pointer'
      >
        <BarChart2 className='w-4 h-4 text-[#2563EB]' />
        <span>Lihat Benchmark</span>
      </button>
    </div>
  )
}
