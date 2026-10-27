'use client'

import React from 'react'

import {
  X,
  Bookmark,
  Trash2,
  ExternalLink,
  MapPin,
  Clock,
  Briefcase
} from 'lucide-react'

import type { OpportunityItem } from '@/types/opportunities'

interface SavedOpportunitiesModalProps {
  isOpen: boolean
  onClose: () => void
  savedItems: OpportunityItem[]
  onSelect: (item: OpportunityItem) => void
  onToggleSave: (item: OpportunityItem) => void
  onApply: (item: OpportunityItem) => void
}

export default function SavedOpportunitiesModal({
  isOpen,
  onClose,
  savedItems,
  onSelect,
  onToggleSave,
  onApply
}: SavedOpportunitiesModalProps) {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200'>
      <div className='bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]'>
        {/* Header */}
        <div className='p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-gradient-to-r from-indigo-50/50 via-white to-white dark:from-indigo-950/20 dark:to-slate-900'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm'>
              <Bookmark className='w-5 h-5 text-indigo-100' />
            </div>
            <div>
              <h3 className='text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight'>
                Peluang Tersimpan ({savedItems.length})
              </h3>
              <p className='text-xs text-slate-500 dark:text-slate-400 mt-0.5'>
                Daftar lowongan kerja, magang, dan program yang telah Anda simpan.
              </p>
            </div>
          </div>

          <button
            type='button'
            onClick={onClose}
            className='p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className='p-5 sm:p-6 overflow-y-auto space-y-4'>
          {savedItems.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-12 px-4 text-center gap-3'>
              <div className='w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center'>
                <Briefcase className='w-6 h-6' />
              </div>
              <h4 className='text-sm sm:text-base font-bold text-slate-900 dark:text-white'>
                Belum Ada Lowongan yang Disimpan
              </h4>
              <p className='text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed'>
                Klik ikon bookmark pada kartu lowongan pekerjaan atau magang untuk menyimpannya di sini.
              </p>
            </div>
          ) : (
            savedItems.map(item => (
              <div
                key={item.id}
                className='p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-indigo-200 dark:hover:border-indigo-900/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs'
              >
                <div className='flex flex-col gap-1.5 flex-1 min-w-0'>
                  <div className='flex flex-wrap items-center gap-2'>
                    <span className='px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200/70 dark:border-blue-800/60'>
                      {item.company}
                    </span>
                    <span className='inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400'>
                      <MapPin className='w-3 h-3 text-slate-400' />
                      <span>{item.location}</span>
                    </span>
                    <span className='px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60'>
                      {item.matchScore}% Match
                    </span>
                  </div>

                  <h4
                    onClick={() => onSelect(item)}
                    className='text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
                  >
                    {item.title}
                  </h4>

                  {item.deadline && (
                    <div className='flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400'>
                      <Clock className='w-3 h-3 text-slate-400' />
                      <span>Tenggat: {new Date(item.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className='flex items-center gap-2 shrink-0 self-end sm:self-center'>
                  <button
                    type='button'
                    onClick={() => onSelect(item)}
                    className='px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer'
                  >
                    Detail & Gap
                  </button>

                  <button
                    type='button'
                    onClick={() => onApply(item)}
                    className='inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer'
                  >
                    <span>Lamar</span>
                    <ExternalLink className='w-3.5 h-3.5' />
                  </button>

                  <button
                    type='button'
                    onClick={() => onToggleSave(item)}
                    className='p-1.5 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer'
                    title='Hapus dari Tersimpan'
                  >
                    <Trash2 className='w-4 h-4' />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className='p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/40'>
          <span className='text-xs text-slate-500 dark:text-slate-400'>
            {savedItems.length} lowongan tersimpan di akun Anda
          </span>

          <button
            type='button'
            onClick={onClose}
            className='px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer'
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}
