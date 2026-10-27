'use client'

import React from 'react'

import {
  X,
  Award,
  Calendar,
  Building2,
  Sparkles,
  CheckCircle2,
  ExternalLink
} from 'lucide-react'

export interface GroupedSkillItem {
  skillId: string
  skillName: string
  note?: string
  aiExtracted?: boolean
}

export interface GroupedExperienceEvidence {
  key: string
  experienceId?: string
  experienceTitle: string
  experienceRole: string
  institutionName: string
  period: string
  type: string
  proofUrl?: string
  aiExtracted: boolean
  skills: GroupedSkillItem[]
}

interface ExperienceEvidenceDetailModalProps {
  isOpen: boolean
  experience: GroupedExperienceEvidence | null
  highlightedSkillName?: string
  onClose: () => void
}

function getTypeBadgeConfig(rawType: string) {
  const norm = (rawType || '').toLowerCase().trim()

  if (norm.includes('project') || norm.includes('proyek')) {
    return {
      label: 'Proyek',
      badgeClass:
        'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/40'
    }
  }

  if (norm.includes('intern') || norm.includes('magang')) {
    return {
      label: 'Magang',
      badgeClass:
        'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/40'
    }
  }

  if (norm.includes('organis') || norm.includes('organiz')) {
    return {
      label: 'Organisasi',
      badgeClass:
        'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/40'
    }
  }

  if (norm.includes('committ') || norm.includes('panitia')) {
    return {
      label: 'Kepanitiaan',
      badgeClass:
        'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200/60 dark:border-purple-900/40'
    }
  }

  if (norm.includes('compet') || norm.includes('kompet') || norm.includes('lomba')) {
    return {
      label: 'Kompetisi',
      badgeClass:
        'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/40'
    }
  }

  if (norm.includes('freelance')) {
    return {
      label: 'Freelance',
      badgeClass:
        'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border border-cyan-200/60 dark:border-cyan-900/40'
    }
  }

  return {
    label: rawType || 'Pengalaman',
    badgeClass:
      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
  }
}

export default function ExperienceEvidenceDetailModal({
  isOpen,
  experience,
  highlightedSkillName,
  onClose
}: ExperienceEvidenceDetailModalProps) {
  if (!isOpen || !experience) return null

  const typeConfig = getTypeBadgeConfig(experience.type)

  return (
    <div className='fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200'>
      <div className='bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col gap-5 max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200'>
        {/* Header */}
        <div className='flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4'>
          <div className='flex flex-col gap-1.5 flex-1 min-w-0'>
            <div className='flex items-center gap-2 flex-wrap'>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${typeConfig.badgeClass}`}>
                {typeConfig.label}
              </span>

              {experience.aiExtracted && (
                <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#EEF2FF] text-[#6366F1] dark:bg-indigo-950/60 dark:text-indigo-300 border border-[#E0E7FF] dark:border-indigo-900/60'>
                  <span>Tervalidasi AI</span>
                  <Sparkles className='w-2.5 h-2.5' />
                </span>
              )}
            </div>

            <h3 className='text-lg font-bold text-slate-900 dark:text-white leading-snug mt-1'>
              {experience.experienceTitle}
            </h3>

            <p className='text-xs sm:text-sm font-semibold text-[#2563EB] dark:text-blue-400'>
              {experience.experienceRole}
            </p>

            <div className='flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap'>
              <span className='flex items-center gap-1.5'>
                <Building2 className='w-3.5 h-3.5 text-slate-400 shrink-0' />
                <span>{experience.institutionName}</span>
              </span>
              <span>•</span>
              <span className='flex items-center gap-1.5'>
                <Calendar className='w-3.5 h-3.5 text-slate-400 shrink-0' />
                <span>{experience.period}</span>
              </span>
            </div>
          </div>

          <button
            type='button'
            onClick={onClose}
            aria-label='Tutup modal'
            className='p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Modal Body: List of Skills & Evidence Notes */}
        <div className='flex flex-col gap-3 overflow-hidden flex-1'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Award className='w-4 h-4 text-[#2563EB] dark:text-blue-400' />
              <h4 className='font-bold text-sm text-slate-900 dark:text-white'>
                Daftar Skill & Bukti Empiris ({experience.skills.length})
              </h4>
            </div>
            <span className='text-[11px] text-slate-400 font-medium'>
              Tervalidasi Portofolio
            </span>
          </div>

          {/* Scrollable list */}
          <div className='overflow-y-auto max-h-[380px] pr-1 flex flex-col gap-3 no-scrollbar'>
            {experience.skills.map(s => {
              const isTargetSkill =
                Boolean(highlightedSkillName) &&
                s.skillName.toLowerCase() === highlightedSkillName?.toLowerCase()

              return (
                <div
                  key={s.skillId || s.skillName}
                  className={`p-4 rounded-2xl border transition-all ${
                    isTargetSkill
                      ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 ring-2 ring-blue-500/30'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  <div className='flex items-center justify-between gap-2 flex-wrap'>
                    <div className='flex items-center gap-2'>
                      <span className='font-bold text-sm text-[#1E3A8A] dark:text-blue-300'>
                        {s.skillName}
                      </span>
                      {isTargetSkill && (
                        <span className='px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#2563EB] text-white shadow-2xs'>
                          Skill Terpilih
                        </span>
                      )}
                    </div>

                    {s.aiExtracted && (
                      <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EEF2FF] text-[#6366F1] dark:bg-indigo-950/60 dark:text-indigo-300 border border-[#E0E7FF] dark:border-indigo-900/60'>
                        <span>AI Verified</span>
                        <Sparkles className='w-2.5 h-2.5' />
                      </span>
                    )}
                  </div>

                  {s.note ? (
                    <div className='mt-2.5 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal'>
                      <p className='italic'>&ldquo;{s.note}&rdquo;</p>
                    </div>
                  ) : (
                    <p className='mt-2 text-[11px] text-slate-400 italic'>
                      Tidak ada catatan bukti spesifik tambahan.
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className='pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs'>
          <div className='flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium'>
            <CheckCircle2 className='w-4 h-4 shrink-0' />
            <span>Bukti Terverifikasi Sistem</span>
          </div>

          <div className='flex items-center gap-2'>
            {experience.proofUrl && (
              <a
                href={experience.proofUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-[#2563EB] dark:text-blue-300 font-semibold transition-all cursor-pointer'
              >
                <span>Lihat Dokumen</span>
                <ExternalLink className='w-3 h-3' />
              </a>
            )}

            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold transition-all cursor-pointer'
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
