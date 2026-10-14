'use client'

import React, { useState } from 'react'
import {
  AlertTriangle,
  Loader2,
  Trash2,
  X,
  AlertCircle
} from 'lucide-react'
import { ExperienceItem } from './experienceUtils'

interface DeleteExperienceModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (deletedId: string) => void
  experience: ExperienceItem | null
}

export default function DeleteExperienceModal({
  isOpen,
  onClose,
  onSuccess,
  experience
}: DeleteExperienceModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen || !experience) return null

  const skillEvidences = experience.skillEvidences || []
  const hasSkillEvidences = skillEvidences.length > 0

  const handleDelete = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/experiences/${experience.id}`, {
        method: 'DELETE'
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.message || 'Gagal menghapus pengalaman. Silakan coba lagi.')
        return
      }

      onSuccess(experience.id)
      onClose()
    } catch (err: any) {
      console.error('Error deleting experience:', err)
      setError('Terjadi gangguan jaringan atau server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='fixed inset-0 z-[1400] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-hidden'>
      <div className='relative w-full max-w-md bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200'>
        {/* Header Close */}
        <button
          type='button'
          onClick={onClose}
          className='absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors'
        >
          <X className='w-4 h-4' />
        </button>

        <div className='p-6 text-center'>
          {/* Icon Badge */}
          <div className='w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 flex items-center justify-center mx-auto mb-4'>
            <Trash2 className='w-7 h-7' />
          </div>

          <h3 className='text-lg font-bold text-slate-900 dark:text-white'>
            Hapus Pengalaman?
          </h3>

          <p className='text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed'>
            Apakah Anda yakin ingin menghapus pengalaman{' '}
            <strong className='text-slate-900 dark:text-white'>
              &quot;{experience.title}&quot;
            </strong>
            ? Tindakan ini tidak dapat dibatalkan.
          </p>

          {/* Warning Banner if connected to skills (PRD F03.3) */}
          {hasSkillEvidences && (
            <div className='mt-4 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-left text-xs text-amber-800 dark:text-amber-300'>
              <div className='flex items-start gap-2.5'>
                <AlertTriangle className='w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5' />
                <div className='space-y-1.5'>
                  <p className='font-bold'>
                    Peringatan: Terhubung ke {skillEvidences.length} Bukti Skill
                  </p>
                  <p className='leading-relaxed text-[11px]'>
                    Pengalaman ini menjadi sumber bukti untuk skill:{' '}
                    <strong>
                      {skillEvidences.map(e => e.userSkill.skill.name).join(', ')}
                    </strong>
                    . Jika dihapus, bukti pendukung skill ini pada profil & portofolio Anda akan ikut terhapus.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className='mt-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2 text-left'>
              <AlertCircle className='w-4 h-4 shrink-0' />
              <span>{error}</span>
            </div>
          )}

          {/* Actions */}
          <div className='mt-6 flex items-center justify-center gap-3'>
            <button
              type='button'
              onClick={onClose}
              disabled={loading}
              className='w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50'
            >
              Batal
            </button>
            <button
              type='button'
              onClick={handleDelete}
              disabled={loading}
              className='w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? (
                <>
                  <Loader2 className='w-4 h-4 animate-spin' />
                  <span>Menghapus...</span>
                </>
              ) : (
                <>
                  <Trash2 className='w-4 h-4' />
                  <span>Ya, Hapus</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
