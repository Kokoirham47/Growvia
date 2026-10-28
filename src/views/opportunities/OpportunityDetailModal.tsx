'use client'

import React from 'react'

import Link from 'next/link'

import {
  X,
  MapPin,
  Clock,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Bookmark,
  Sparkles,
  Building2,
  Layers,
  ArrowRight
} from 'lucide-react'

import type { OpportunityItem, OpportunityType } from '@/types/opportunities'

interface OpportunityDetailModalProps {
  item: OpportunityItem | null
  isOpen: boolean
  onClose: () => void
  onToggleSave: (item: OpportunityItem) => void
  onApply: (item: OpportunityItem) => void
  isSaving?: boolean
}

// Label & warna jenis peluang
function getTypeLabel(type: OpportunityType) {
  switch (type) {
    case 'internship':
      return 'Magang'
    case 'full_time':
      return 'Full-time'
    case 'part_time':
      return 'Part-time'
    case 'freelance':
      return 'Freelance'
    case 'competition':
      return 'Kompetisi'
    default:
      return 'Lowongan'
  }
}

export default function OpportunityDetailModal({
  item,
  isOpen,
  onClose,
  onToggleSave,
  onApply,
  isSaving = false
}: OpportunityDetailModalProps) {
  if (!isOpen || !item) return null

  const isHighMatch = item.matchScore >= 75
  const isMediumMatch = item.matchScore >= 50 && item.matchScore < 75

  const matchColorBg = isHighMatch
    ? 'from-emerald-500/10 to-emerald-500/5 border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300'
    : isMediumMatch
    ? 'from-blue-500/10 to-blue-500/5 border-blue-200 dark:border-blue-800/80 text-blue-700 dark:text-blue-300'
    : 'from-amber-500/10 to-amber-500/5 border-amber-200 dark:border-amber-800/80 text-amber-700 dark:text-amber-300'

  const formattedDeadline = item.deadline
    ? new Date(item.deadline).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : 'Terbuka'

  return (
    <div className='fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200'>
      <div className='bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200'>
        {/* Header */}
        <div className='p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-gradient-to-r from-blue-50/40 via-white to-white dark:from-blue-950/20 dark:via-slate-900 dark:to-slate-900'>
          <div className='flex items-start gap-4 pr-3'>
            <div className='w-12 h-12 rounded-2xl bg-blue-600 text-white font-extrabold text-base flex items-center justify-center shrink-0 shadow-sm'>
              {item.company.substring(0, 2).toUpperCase()}
            </div>

            <div className='flex flex-col gap-1'>
              <div className='flex flex-wrap items-center gap-2'>
                <span className='text-xs font-bold text-blue-600 dark:text-blue-400'>
                  {item.company}
                </span>
                <span className='px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'>
                  {getTypeLabel(item.type)}
                </span>
                {item.location && (
                  <span className='inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400'>
                    <MapPin className='w-3 h-3' />
                    <span>{item.location}</span>
                  </span>
                )}
              </div>

              <h2 className='text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug'>
                {item.title}
              </h2>
            </div>
          </div>

          <div className='flex items-center gap-1.5 shrink-0'>
            <button
              type='button'
              onClick={() => onToggleSave(item)}
              disabled={isSaving}
              title={item.isSaved ? 'Hapus Simpanan' : 'Simpan Lowongan'}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                item.isSaved
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-500'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-amber-500'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${item.isSaved ? 'fill-current' : ''}`} />
            </button>

            <button
              type='button'
              onClick={onClose}
              className='p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer'
            >
              <X className='w-5 h-5' />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className='p-6 overflow-y-auto space-y-6'>
          {/* Match Score Banner */}
          <div
            className={`p-4 rounded-2xl bg-gradient-to-r border flex items-center justify-between gap-4 ${matchColorBg}`}
          >
            <div className='flex items-center gap-3.5'>
              <div className='w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 shadow-xs flex flex-col items-center justify-center shrink-0 border border-slate-200/60 dark:border-slate-700'>
                <span className='text-base font-extrabold leading-none'>{item.matchScore}%</span>
                <span className='text-[9px] font-semibold text-slate-400 mt-0.5 uppercase tracking-wider'>Match</span>
              </div>
              <div className='flex flex-col'>
                <h4 className='text-sm font-bold text-slate-900 dark:text-white'>
                  {isHighMatch
                    ? 'Profil Kamu Sangat Cocok!'
                    : isMediumMatch
                    ? 'Kecocokan Kompetensi Cukup Baik'
                    : 'Peluang Pengembangan Karier'}
                </h4>
                <p className='text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-snug'>
                  Kamu telah menguasai {item.matchedSkills.length} dari {item.allSkills.length} kualifikasi skill yang dibutuhkan.
                </p>
              </div>
            </div>

            <div className='text-right shrink-0 hidden sm:block'>
              <span className='text-xs font-semibold px-2.5 py-1 rounded-full bg-white/80 dark:bg-slate-800/80 border border-current'>
                {item.matchedSkills.length}/{item.allSkills.length} Skill Terpenuhi
              </span>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
            <div className='p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col gap-1'>
              <div className='flex items-center gap-1.5 text-slate-400 text-xs font-medium'>
                <Clock className='w-3.5 h-3.5' />
                <span>Batas Lamaran</span>
              </div>
              <span className='text-xs sm:text-sm font-bold text-slate-800 dark:text-white'>
                {formattedDeadline}
              </span>
            </div>

            <div className='p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col gap-1'>
              <div className='flex items-center gap-1.5 text-slate-400 text-xs font-medium'>
                <Building2 className='w-3.5 h-3.5' />
                <span>Format Kerja</span>
              </div>
              <span className='text-xs sm:text-sm font-bold text-slate-800 dark:text-white'>
                {item.location?.toLowerCase().includes('remote') ? 'Full Remote' : 'On-site / Hybrid'}
              </span>
            </div>

            <div className='p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col gap-1 col-span-2 sm:col-span-1'>
              <div className='flex items-center gap-1.5 text-slate-400 text-xs font-medium'>
                <Layers className='w-3.5 h-3.5' />
                <span>Tipe Kontrak</span>
              </div>
              <span className='text-xs sm:text-sm font-bold text-slate-800 dark:text-white'>
                {getTypeLabel(item.type)}
              </span>
            </div>
          </div>

          {/* Job Description */}
          {item.description && (
            <div className='space-y-2'>
              <h4 className='text-sm font-bold text-slate-900 dark:text-white'>
                Deskripsi & Tanggung Jawab
              </h4>
              <div className='text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800'>
                {item.description}
              </div>
            </div>
          )}

          {/* Skill Breakdown Grid */}
          <div className='space-y-3'>
            <h4 className='text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between'>
              <span>Analisis Kebutuhan Skill</span>
              <span className='text-xs font-normal text-slate-400'>
                Berdasarkan portofolio profil Growvia kamu
              </span>
            </h4>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {/* Matched Skills */}
              <div className='p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-800/50 flex flex-col gap-3'>
                <div className='flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs'>
                  <CheckCircle2 className='w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0' />
                  <span>Keahlian Dikuasai ({item.matchedSkills.length})</span>
                </div>

                {item.matchedSkills.length > 0 ? (
                  <div className='flex flex-wrap gap-1.5'>
                    {item.matchedSkills.map(sk => (
                      <span
                        key={sk.id}
                        className='inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-100/70 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 border border-emerald-200/80 dark:border-emerald-800'
                      >
                        <CheckCircle2 className='w-3 h-3 text-emerald-600 dark:text-emerald-400' />
                        <span>{sk.name}</span>
                        {sk.importance === 'required' && (
                          <span className='text-[9px] px-1 py-0.2 rounded bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 font-bold'>
                            Wajib
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className='text-xs text-slate-500 italic'>
                    Belum ada skill yang cocok dengan profil kamu saat ini.
                  </p>
                )}
              </div>

              {/* Missing Skills */}
              <div className='p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-800/50 flex flex-col gap-3'>
                <div className='flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs'>
                  <AlertCircle className='w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0' />
                  <span>Keahlian Perlu Dipelajari ({item.missingSkills.length})</span>
                </div>

                {item.missingSkills.length > 0 ? (
                  <div className='flex flex-wrap gap-1.5'>
                    {item.missingSkills.map(sk => (
                      <span
                        key={sk.id}
                        className='inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-100/70 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 border border-amber-200/80 dark:border-amber-800'
                      >
                        <AlertCircle className='w-3 h-3 text-amber-600 dark:text-amber-400' />
                        <span>{sk.name}</span>
                        {sk.importance === 'required' && (
                          <span className='text-[9px] px-1 py-0.2 rounded bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 font-bold'>
                            Wajib
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className='text-xs text-emerald-700 dark:text-emerald-400 font-medium'>
                    🎉 Luar biasa! Kamu sudah menguasai seluruh skill yang dipersyaratkan.
                  </p>
                )}
              </div>
            </div>

            {/* Rekomendasi Belajar Link */}
            {item.missingSkills.length > 0 && (
              <div className='p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/50 flex items-center justify-between gap-3'>
                <div className='flex items-center gap-2.5 text-xs text-blue-800 dark:text-blue-300'>
                  <Sparkles className='w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0' />
                  <span>
                    Ingin menutup skill gap di atas? Pelajari modul terkait di Rekomendasi Belajar.
                  </span>
                </div>
                <Link
                  href='/learning'
                  className='inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline shrink-0'
                >
                  <span>Buka Belajar</span>
                  <ArrowRight className='w-3.5 h-3.5' />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className='p-5 sm:p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between gap-3'>
          <button
            type='button'
            onClick={onClose}
            className='px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer'
          >
            Tutup
          </button>

          <div className='flex items-center gap-2'>
            <button
              type='button'
              onClick={() => onApply(item)}
              className='inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all cursor-pointer'
            >
              <span>Lamar di Situs Resmi</span>
              <ExternalLink className='w-4 h-4' />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
