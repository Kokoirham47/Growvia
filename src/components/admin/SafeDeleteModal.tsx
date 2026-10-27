'use client'

import React from 'react'

import { AlertTriangle, Trash2, X, AlertCircle } from 'lucide-react'

interface SafeDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void> | void
  title: string
  itemName: string
  warningMessage?: string | null
  isBlocked?: boolean
  loading?: boolean
}

export default function SafeDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
  warningMessage,
  isBlocked = false,
  loading = false
}: SafeDeleteModalProps) {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in'>
      <div className='relative w-full max-w-md rounded-2xl bg-white dark:bg-[#121829] border border-slate-200 dark:border-slate-800 p-6 shadow-2xl'>
        {/* Header */}
        <div className='flex items-start justify-between mb-4'>
          <div className='w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center shrink-0'>
            <AlertTriangle className='w-5 h-5' />
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className='p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Content */}
        <h3 className='text-base font-bold text-slate-900 dark:text-white mb-2'>
          {title}
        </h3>
        <p className='text-xs text-slate-600 dark:text-slate-300 mb-4'>
          Apakah Anda yakin ingin menghapus <strong className='text-slate-900 dark:text-white'>&quot;{itemName}&quot;</strong>?
        </p>

        {/* Warning or Blocked Message */}
        {warningMessage && (
          <div className='mb-5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs flex items-start gap-2.5'>
            <AlertCircle className='w-4 h-4 shrink-0 text-amber-500 mt-0.5' />
            <span>{warningMessage}</span>
          </div>
        )}

        {/* Actions */}
        <div className='flex items-center justify-end gap-2.5 pt-2'>
          <button
            type='button'
            onClick={onClose}
            disabled={loading}
            className='px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
          >
            Batal
          </button>

          {!isBlocked && (
            <button
              type='button'
              onClick={onConfirm}
              disabled={loading}
              className='px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-900/30 transition-all flex items-center gap-1.5 disabled:opacity-50'
            >
              <Trash2 className='w-3.5 h-3.5' />
              <span>{loading ? 'Menghapus...' : 'Ya, Hapus'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
