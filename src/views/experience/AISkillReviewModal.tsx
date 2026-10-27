'use client'

import React, { useState, useEffect, useCallback } from 'react'

import {
  Sparkles,
  X,
  CheckCircle2,
  AlertCircle,
  RotateCcw
} from 'lucide-react'

import type { SkillLevel } from '@prisma/client'

import type { SuggestionChipData } from './SkillSuggestionChip';
import SkillSuggestionChip from './SkillSuggestionChip'
import ExtractionLoadingSkeleton from './ExtractionLoadingSkeleton'


interface AISkillReviewModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (count: number) => void
  experienceId?: string | null
  experienceData?: {
    title: string
    role: string
    institutionName: string
    description?: string | null
  } | null
  customText?: string | null
}

export default function AISkillReviewModal({
  isOpen,
  onClose,
  onSuccess,
  experienceId,
  experienceData,
  customText
}: AISkillReviewModalProps) {
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [jobId, setJobId] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<SuggestionChipData[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Trigger or fetch AI Analysis
  const runAnalysis = useCallback(async () => {
    if (!experienceId && !customText) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/ai/analyze-experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          experienceId: experienceId || undefined,
          customText: customText || undefined
        })
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Gagal memproses analisis AI')
      }

      const receivedJobId = json.data?.jobId
      const list: SuggestionChipData[] = json.data?.suggestions || []

      setJobId(receivedJobId)
      setSuggestions(list)

      // Auto-select skills dengan confidence >= 40% (sesuai PRD)
      const initialSelected = new Set<string>()

      list.forEach(s => {
        if (s.confidenceScore >= 40) {
          initialSelected.add(s.id)
        }
      })
      setSelectedIds(initialSelected)

    } catch (err: any) {
      console.error('AI Analysis error:', err)
      setError(err?.message || 'Terjadi kesalahan saat memproses ekstraksi AI')
    } finally {
      setLoading(false)
    }
  }, [experienceId, customText])

  useEffect(() => {
    if (isOpen) {
      runAnalysis()
    } else {
      // Reset state on close
      setSuggestions([])
      setSelectedIds(new Set())
      setError(null)
      setJobId(null)
    }
  }, [isOpen, runAnalysis])

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    
return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Handlers for Chip Actions
  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)

      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }

      
return next
    })
  }

  const handleSelectAll = () => {
    const all = new Set(suggestions.map(s => s.id))

    setSelectedIds(all)
  }

  const handleDeselectAll = () => {
    setSelectedIds(new Set())
  }

  const handleUpdateName = (id: string, newName: string) => {
    setSuggestions(prev =>
      prev.map(s => (s.id === id ? { ...s, finalName: newName } : s))
    )
  }

  const handleUpdateLevel = (id: string, newLevel: SkillLevel) => {
    setSuggestions(prev =>
      prev.map(s => (s.id === id ? { ...s, level: newLevel } : s))
    )
  }

  const handleRejectSuggestion = (id: string) => {
    // Unselect and remove from list
    setSelectedIds(prev => {
      const next = new Set(prev)

      next.delete(id)
      
return next
    })
    setSuggestions(prev => prev.filter(s => s.id !== id))
  }

  // Submit Review to Backend
  const handleConfirmReview = async () => {
    if (!jobId) return

    setSubmitting(true)
    setError(null)

    try {
      const reviews = suggestions.map(item => {
        const isAccepted = selectedIds.has(item.id)
        const isEdited = Boolean(item.finalName && item.finalName !== item.suggestedName)

        return {
          suggestionId: item.id,
          action: isAccepted ? (isEdited ? 'edit' : 'accept') : 'reject',
          finalName: item.finalName || item.suggestedName,
          level: item.level || 'intermediate'
        }
      })

      const res = await fetch(`/api/ai/suggestions/${jobId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviews })
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Gagal menyimpan hasil review')
      }

      onSuccess(json.data?.acceptedCount || selectedIds.size)
      onClose()

    } catch (err: any) {
      console.error('Submit review error:', err)
      setError(err?.message || 'Terjadi kesalahan saat menyimpan review')
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  // Segmentation
  const regularSuggestions = suggestions.filter(s => s.confidenceScore >= 40)
  const lowConfidenceSuggestions = suggestions.filter(s => s.confidenceScore < 40)

  return (
    <div
      role='dialog'
      aria-modal='true'
      className='experience-page font-poppins fixed inset-0 z-[1400] flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200'
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Full Backdrop Blur */}
      <div
        className='fixed inset-0 bg-slate-950/65 backdrop-blur-md transition-opacity'
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className='relative w-full max-w-2xl bg-white dark:bg-[#0F172A] rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10 animate-in zoom-in-95 duration-200'>
        {/* Pinned Header */}
        <div className='px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-sm z-10'>
          <div className='flex items-center gap-3 min-w-0'>
            <div className='w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/25'>
              <Sparkles className='w-5 h-5' />
            </div>
            <div className='min-w-0'>
              <div className='flex items-center gap-2 flex-wrap'>
                <h3 className='text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight truncate'>
                  Review Ekstraksi Skill AI
                </h3>
              </div>
              <p className='text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate'>
                {experienceData?.title ? (
                  <>Untuk: <strong className='text-slate-700 dark:text-slate-300'>{experienceData.title}</strong> ({experienceData.role})</>
                ) : (
                  'Validasi dan pilih keahlian yang relevan sebelum dimasukkan ke Skill Matrix.'
                )}
              </p>
            </div>
          </div>

          <button
            type='button'
            onClick={onClose}
            aria-label='Tutup modal review'
            className='p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0 ml-2'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className='p-6 overflow-y-auto custom-scrollbar flex-1 space-y-5'>
          {/* Error Banner */}
          {error && (
            <div className='p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 flex items-start gap-3 text-xs'>
              <AlertCircle className='w-4 h-4 shrink-0 mt-0.5' />
              <div className='flex-1'>
                <strong className='font-bold block'>Terjadi Kendala:</strong>
                <span>{error}</span>
              </div>
              <button
                type='button'
                onClick={runAnalysis}
                className='px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold hover:bg-rose-700 transition-colors shrink-0 cursor-pointer'
              >
                Coba Lagi
              </button>
            </div>
          )}

          {/* Loading Skeleton View */}
          {loading ? (
            <ExtractionLoadingSkeleton />
          ) : suggestions.length === 0 ? (

            /* Empty State */
            <div className='py-12 text-center space-y-3'>
              <div className='w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center'>
                <Sparkles className='w-6 h-6' />
              </div>
              <h4 className='text-sm font-bold text-slate-800 dark:text-slate-200'>
                Tidak Ada Skill Baru yang Ditemukan
              </h4>
              <p className='text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto'>
                Deskripsi pengalaman mungkin terlalu singkat atau semua saran telah dihapus. Klik tombol di bawah untuk mencoba kembali.
              </p>
              <button
                type='button'
                onClick={runAnalysis}
                className='inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs cursor-pointer'
              >
                <RotateCcw className='w-3.5 h-3.5' />
                <span>Analisis Ulang Teks</span>
              </button>
            </div>
          ) : (

            /* Results View */
            <div className='space-y-4'>
              {/* Quick Toolbar / Counter & Bulk Select */}
              <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800/80'>
                <div className='text-xs text-slate-600 dark:text-slate-400 font-medium'>
                  Ditemukan <strong className='text-slate-900 dark:text-white'>{suggestions.length} rekomendasi skill</strong> (<span className='font-bold text-blue-600 dark:text-blue-400'>{selectedIds.size}</span> terpilih)
                </div>

                <div className='flex items-center gap-2 self-start sm:self-auto text-xs font-semibold'>
                  <button
                    type='button'
                    onClick={handleSelectAll}
                    className='text-blue-600 dark:text-blue-400 hover:underline cursor-pointer'
                  >
                    Pilih Semua
                  </button>
                  <span className='text-slate-300 dark:text-slate-700'>•</span>
                  <button
                    type='button'
                    onClick={handleDeselectAll}
                    className='text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer'
                  >
                    Batal Pilih
                  </button>
                </div>
              </div>

              {/* Regular High & Medium Confidence Suggestions */}
              <div className='space-y-3'>
                {regularSuggestions.map(item => (
                  <SkillSuggestionChip
                    key={item.id}
                    data={item}
                    isSelected={selectedIds.has(item.id)}
                    onToggleSelect={() => handleToggleSelect(item.id)}
                    onUpdateName={newName => handleUpdateName(item.id, newName)}
                    onUpdateLevel={newLevel => handleUpdateLevel(item.id, newLevel)}
                    onReject={() => handleRejectSuggestion(item.id)}
                  />
                ))}
              </div>

              {/* Low Confidence Section (PRD F04.3 Requirement: Ditampilkan terpisah) */}
              {lowConfidenceSuggestions.length > 0 && (
                <div className='mt-6 pt-5 border-t border-dashed border-amber-200 dark:border-amber-900/40 space-y-3'>
                  <div className='flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400'>
                    <AlertCircle className='w-4 h-4 text-amber-500' />
                    <span>Perlu Konfirmasi Teliti (Keyakinan &lt; 40%)</span>
                  </div>
                  <p className='text-[11px] text-slate-500 dark:text-slate-400'>
                    Skill berikut memiliki indikasi bukti yang lebih minim dalam deskripsi. Silakan periksa kembali sebelum menyetujui.
                  </p>

                  <div className='space-y-3'>
                    {lowConfidenceSuggestions.map(item => (
                      <SkillSuggestionChip
                        key={item.id}
                        data={item}
                        isSelected={selectedIds.has(item.id)}
                        onToggleSelect={() => handleToggleSelect(item.id)}
                        onUpdateName={newName => handleUpdateName(item.id, newName)}
                        onUpdateLevel={newLevel => handleUpdateLevel(item.id, newLevel)}
                        onReject={() => handleRejectSuggestion(item.id)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pinned Footer Actions */}
        <div className='px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-sm z-10'>
          <button
            type='button'
            onClick={onClose}
            disabled={submitting}
            className='px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50'
          >
            Tutup
          </button>

          <div className='flex items-center gap-2'>
            <button
              type='button'
              onClick={handleConfirmReview}
              disabled={submitting || selectedIds.size === 0 || loading}
              className='inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {submitting ? (
                <>
                  <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                  <span>Menyimpan ke Profil...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className='w-4 h-4' />
                  <span>Konfirmasi & Simpan {selectedIds.size} Skill</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
