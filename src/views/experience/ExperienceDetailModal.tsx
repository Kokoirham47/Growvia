'use client'

import React from 'react'
import {
  X,
  Building2,
  Calendar,
  ExternalLink,
  Sparkles,
  Pencil,
  Trash2,
  CheckCircle2,
  Clock,
  Layers
} from 'lucide-react'
import {
  ExperienceItem,
  EXPERIENCE_TYPE_CONFIG,
  formatExperiencePeriod
} from './experienceUtils'

interface ExperienceDetailModalProps {
  isOpen: boolean
  onClose: () => void
  experience: ExperienceItem | null
  onEdit: (exp: ExperienceItem) => void
  onDelete: (exp: ExperienceItem) => void
}

export default function ExperienceDetailModal({
  isOpen,
  onClose,
  experience,
  onEdit,
  onDelete
}: ExperienceDetailModalProps) {
  if (!isOpen || !experience) return null

  const config =
    EXPERIENCE_TYPE_CONFIG[experience.type] || EXPERIENCE_TYPE_CONFIG.other
  const IconComponent = config.icon

  const periodText = formatExperiencePeriod(
    experience.startDate,
    experience.endDate,
    experience.isOngoing
  )

  const skillEvidences = experience.skillEvidences || []
  const latestAiJob = experience.aiAnalysisJobs?.[0]

  return (
    <div className='fixed inset-0 z-[1400] flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-hidden'>
      <div className='relative w-full max-w-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] my-auto animate-in zoom-in-95 duration-200'>
        {/* Header (Pinned) */}
        <div className='flex items-start justify-between p-6 pb-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 backdrop-blur-xs shrink-0'>
          <div className='flex items-start gap-3.5'>
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${config.bgClass} ${config.colorClass} border ${config.borderClass}`}
            >
              <IconComponent className='w-5 h-5' />
            </div>
            <div>
              <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold mb-1.5 ${config.badgeClass}`}
              >
                <span>{config.label}</span>
              </div>
              <h2 className='text-base sm:text-xl font-bold text-slate-900 dark:text-white leading-snug'>
                {experience.title}
              </h2>
            </div>
          </div>
          <button
            type='button'
            onClick={onClose}
            className='p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Content Body (Scrollable with custom-scrollbar) */}
        <div className='flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar'>
          {/* Metadata Cards */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800'>
            <div>
              <span className='text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block'>
                Peran / Posisi
              </span>
              <span className='text-sm font-semibold text-slate-800 dark:text-slate-200'>
                {experience.role}
              </span>
            </div>

            <div>
              <span className='text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block'>
                Nama Institusi / Lembaga
              </span>
              <span className='text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1'>
                <Building2 className='w-3.5 h-3.5 text-slate-400 shrink-0' />
                <span>{experience.institutionName || '-'}</span>
              </span>
            </div>

            <div className='sm:col-span-2 pt-1 border-t border-slate-200/60 dark:border-slate-800'>
              <span className='text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block'>
                Periode Pelaksanaan
              </span>
              <span className='text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mt-0.5'>
                <Calendar className='w-4 h-4 text-blue-500 shrink-0' />
                <span>{periodText}</span>
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className='text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2'>
              Deskripsi Aktivitas & Tanggung Jawab
            </h4>
            <div className='p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line'>
              {experience.description || 'Tidak ada deskripsi yang dicantumkan.'}
            </div>
          </div>

          {/* Proof Link */}
          {experience.proofUrl && (
            <div>
              <h4 className='text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2'>
                Tautan Bukti Pendukung
              </h4>
              <a
                href={experience.proofUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors'
              >
                <ExternalLink className='w-4 h-4' />
                <span className='truncate max-w-sm'>{experience.proofUrl}</span>
              </a>
            </div>
          )}

          {/* Extracted Skills Section */}
          <div>
            <div className='flex items-center justify-between mb-2.5'>
              <h4 className='text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5'>
                <Sparkles className='w-3.5 h-3.5 text-blue-500' />
                <span>Bukti Skill Tervalidasi (AI Extraction)</span>
              </h4>
              {skillEvidences.length > 0 && (
                <span className='text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'>
                  {skillEvidences.length} Skill Terhubung
                </span>
              )}
            </div>

            {skillEvidences.length > 0 ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-2.5'>
                {skillEvidences.map(evidence => (
                  <div
                    key={evidence.id}
                    className='p-3 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-2'
                  >
                    <div>
                      <div className='flex items-center gap-1.5'>
                        <CheckCircle2 className='w-4 h-4 text-emerald-500 shrink-0' />
                        <span className='text-sm font-semibold text-slate-800 dark:text-slate-200'>
                          {evidence.userSkill.skill.name}
                        </span>
                      </div>
                      <span className='text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5 block pl-5 capitalize'>
                        Kategori: {evidence.userSkill.skill.category.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-3'>
                <Sparkles className='w-5 h-5 text-blue-500 shrink-0 mt-0.5 animate-pulse' />
                <div>
                  <p className='font-semibold text-blue-800 dark:text-blue-300'>
                    Status Analisis AI: {latestAiJob ? latestAiJob.status : 'Menunggu antrean'}
                  </p>
                  <p className='mt-0.5 leading-relaxed'>
                    AI akan mengekstrak keterampilan secara otomatis dari deskripsi
                    pengalaman ini pada fitur Skill Extraction (F04).
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className='p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between gap-3'>
          <button
            type='button'
            onClick={() => {
              onClose()
              onDelete(experience)
            }}
            className='inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors'
          >
            <Trash2 className='w-4 h-4' />
            <span>Hapus</span>
          </button>

          <div className='flex items-center gap-2'>
            <button
              type='button'
              onClick={() => {
                onClose()
                onEdit(experience)
              }}
              className='inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors'
            >
              <Pencil className='w-4 h-4' />
              <span>Edit</span>
            </button>
            <button
              type='button'
              onClick={onClose}
              className='px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm'
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
