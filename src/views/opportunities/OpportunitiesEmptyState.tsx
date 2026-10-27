'use client'

import React from 'react'

import { Briefcase, RotateCcw, Search } from 'lucide-react'

interface OpportunitiesEmptyStateProps {
  onResetFilters: () => void
  hasFilters: boolean
}

export default function OpportunitiesEmptyState({
  onResetFilters,
  hasFilters
}: OpportunitiesEmptyStateProps) {
  return (
    <div className='flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 my-4'>
      <div className='w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 shadow-xs'>
        {hasFilters ? <Search className='w-8 h-8' /> : <Briefcase className='w-8 h-8' />}
      </div>

      <h3 className='text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1.5'>
        {hasFilters
          ? 'Tidak ada lowongan yang sesuai filter'
          : 'Belum ada peluang karier aktif saat ini'}
      </h3>

      <p className='text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6 leading-relaxed'>
        {hasFilters
          ? 'Coba ubah kata kunci pencarian, sesuaikan filter tipe atau lokasi, atau reset filter untuk menampilkan semua peluang.'
          : 'Tim kurasi Growvia terus memperbarui lowongan kerja dan program magang tech terkini setiap hari.'}
      </p>

      {hasFilters && (
        <button
          type='button'
          onClick={onResetFilters}
          className='inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors cursor-pointer'
        >
          <RotateCcw className='w-4 h-4' />
          <span>Reset Semua Filter</span>
        </button>
      )}
    </div>
  )
}
