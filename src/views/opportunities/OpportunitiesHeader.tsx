'use client'

import React from 'react'

import { Bookmark } from 'lucide-react'

interface OpportunitiesHeaderProps {
  savedOpportunitiesCount?: number
  onOpenSavedModal?: () => void
}

export default function OpportunitiesHeader({
  savedOpportunitiesCount = 0,
  onOpenSavedModal
}: OpportunitiesHeaderProps) {
  return (
    <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 pt-1'>
      {/* Left Column: H1 + Sub-text */}
      <div className='flex flex-col gap-1.5 max-w-3xl'>
        {/* Title H1 */}
        <h1 className='text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight'>
          Peluang Karier & Magang
        </h1>

        {/* Sub-text */}
        <p className='text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed'>
          Daftar lowongan kerja, magang, dan kompetisi yang dicocokkan langsung secara matematis dengan portofolio keahlian Anda. Ketahui tingkat kesiapan sebelum melamar.
        </p>
      </div>

      {/* Right Column: Clickable Saved Opportunities Button */}
      <div className='shrink-0 self-start lg:self-center'>
        <button
          type='button'
          onClick={onOpenSavedModal}
          className='flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 shadow-2xs hover:shadow-md transition-all cursor-pointer group text-left'
        >
          <div className='w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-300 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-900/60 group-hover:bg-blue-600 group-hover:text-white transition-colors'>
            <Bookmark className='w-5 h-5' />
          </div>
          <div className='flex flex-col'>
            <span className='text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
              {savedOpportunitiesCount} Peluang Tersimpan
            </span>
            <span className='text-[11px] text-slate-500 dark:text-slate-400'>
              {savedOpportunitiesCount > 0 ? 'Klik untuk melihat & kelola lowongan' : 'Belum ada lowongan tersimpan'}
            </span>
          </div>
        </button>
      </div>
    </div>
  )
}
