'use client'

import React, { useState, useEffect } from 'react'
import {
  AlertTriangle,
  Loader2,
  Trash2,
  X,
  AlertCircle,
  Sparkles
} from 'lucide-react'
import type { SkillItem, SkillCategoryType } from '@/types/skills'

interface DeleteSkillModalProps {
  isOpen: boolean
  skill: SkillItem | null
  onClose: () => void
  onSuccess: (deletedSkillId: string, skillName: string) => void
}

export default function DeleteSkillModal({
  isOpen,
  skill,
  onClose,
  onSuccess
}: DeleteSkillModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Reset state whenever a new skill is opened or modal visibility changes
  useEffect(() => {
    if (isOpen) {
      setError(null)
      setLoading(false)
    }
  }, [isOpen, skill])

  // Support closing modal with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !loading) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, loading, onClose])

  if (!isOpen || !skill) return null

  const evidenceCount = skill.evidenceCount || 0
  const hasEvidences = evidenceCount > 0

  const getCategoryBadge = (category: SkillCategoryType) => {
    switch (category) {
      case 'soft_skill':
        return {
          label: 'Soft Skill',
          className:
            'bg-[#EFF6FF] text-[#2563EB] dark:bg-blue-950/50 dark:text-blue-300 border-[#DBEAFE] dark:border-blue-900/60'
        }
      case 'hard_skill':
        return {
          label: 'Hard Skill',
          className:
            'bg-[#EEF2FF] text-[#6366F1] dark:bg-indigo-950/50 dark:text-indigo-300 border-[#E0E7FF] dark:border-indigo-900/60'
        }
      case 'technical':
        return {
          label: 'Technical',
          className:
            'bg-[#ECFDF5] text-[#10B981] dark:bg-emerald-950/50 dark:text-emerald-300 border-[#D1FAE5] dark:border-emerald-900/60'
        }
      case 'leadership':
        return {
          label: 'Leadership',
          className:
            'bg-[#FEF3C7] text-[#D97706] dark:bg-amber-950/50 dark:text-amber-300 border-[#FDE68A] dark:border-amber-900/60'
        }
      default:
        return {
          label: category,
          className: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200'
        }
    }
  }

  const categoryMeta = getCategoryBadge(skill.category)

  const handleDelete = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/skills?id=${skill.id}`, {
        method: 'DELETE'
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.message || 'Gagal menghapus skill. Silakan coba lagi.')
        return
      }

      onSuccess(skill.id, skill.name)
      onClose()
    } catch (err: any) {
      console.error('Error deleting skill:', err)
      setError('Terjadi gangguan jaringan atau server saat menghapus skill.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[1400] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-hidden font-['Poppins',sans-serif]"
      onClick={e => {
        if (e.target === e.currentTarget && !loading) {
          onClose()
        }
      }}
      role='dialog'
      aria-modal='true'
      aria-labelledby='delete-skill-modal-title'
    >
      <div className='relative w-full max-w-md bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 p-6'>
        {/* Header Close Button */}
        <button
          type='button'
          onClick={onClose}
          disabled={loading}
          aria-label='Tutup modal'
          className='absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-50 cursor-pointer'
        >
          <X className='w-4 h-4' />
        </button>

        <div className='text-center'>
          {/* Danger Icon Badge */}
          <div className='w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 flex items-center justify-center mx-auto mb-4'>
            <Trash2 className='w-7 h-7' />
          </div>

          <h3
            id='delete-skill-modal-title'
            className='text-lg font-bold text-slate-900 dark:text-white tracking-tight'
          >
            Hapus Skill dari Profil?
          </h3>

          <p className='text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed'>
            Apakah Anda yakin ingin menghapus skill{' '}
            <strong className='text-slate-900 dark:text-white font-semibold'>
              &quot;{skill.name}&quot;
            </strong>
            ? Tindakan ini akan menghapus data kemahiran skill ini dari profil dan portofolio publik Anda.
          </p>

          {/* Skill Summary Chip Preview */}
          <div className='mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-left flex items-center justify-between gap-3'>
            <div className='min-w-0 flex-1'>
              <div className='flex items-center gap-1.5 flex-wrap'>
                <span className='font-bold text-sm text-slate-900 dark:text-white truncate'>
                  {skill.name}
                </span>
                {skill.source === 'ai_extracted' && (
                  <span
                    title='Diekstrak oleh AI'
                    className='inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#EEF2FF] text-[#6366F1] dark:bg-indigo-950/60 dark:text-indigo-300 border border-[#E0E7FF] dark:border-indigo-900/60'
                  >
                    <span>AI</span>
                    <Sparkles className='w-2 h-2' />
                  </span>
                )}
              </div>
              <div className='flex items-center gap-2 mt-1 text-[11px] text-slate-500 dark:text-slate-400'>
                <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${categoryMeta.className}`}>
                  {categoryMeta.label}
                </span>
                <span className='capitalize'>{skill.level}</span>
                <span>•</span>
                <span className='font-semibold text-blue-600 dark:text-blue-400'>{skill.score}% Kemahiran</span>
              </div>
            </div>
          </div>

          {/* Warning Banner if connected to evidences */}
          {hasEvidences && (
            <div className='mt-3.5 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-left text-xs text-amber-800 dark:text-amber-300'>
              <div className='flex items-start gap-2.5'>
                <AlertTriangle className='w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5' />
                <div className='space-y-1'>
                  <p className='font-bold text-xs'>
                    Peringatan: Terhubung ke {evidenceCount} Bukti Pengalaman
                  </p>
                  <p className='leading-relaxed text-[11px]'>
                    Skill ini memiliki {evidenceCount} bukti autentik yang terhubung dari pengalaman Anda
                    {skill.evidenceTags && skill.evidenceTags.length > 0
                      ? ` (${skill.evidenceTags.slice(0, 3).join(', ')}${
                          skill.evidenceTags.length > 3 ? '...' : ''
                        })`
                      : ''}
                    . Menghapus skill ini akan melepaskan keterkaitan bukti tersebut pada matriks keahlian Anda.
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
              className='w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50'
            >
              Batal
            </button>
            <button
              type='button'
              onClick={handleDelete}
              disabled={loading}
              className='w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? (
                <>
                  <Loader2 className='w-4 h-4 animate-spin' />
                  <span>Menghapus...</span>
                </>
              ) : (
                <>
                  <Trash2 className='w-4 h-4' />
                  <span>Ya, Hapus Skill</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

