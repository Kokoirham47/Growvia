'use client'

import React, { useState } from 'react'
import {
  Building2,
  Calendar,
  ExternalLink,
  Sparkles,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  Eye
} from 'lucide-react'
import {
  ExperienceItem,
  EXPERIENCE_TYPE_CONFIG,
  formatExperiencePeriod
} from './experienceUtils'

interface ExperienceCardProps {
  experience: ExperienceItem
  onEdit: (exp: ExperienceItem) => void
  onDelete: (exp: ExperienceItem) => void
  onViewDetail: (exp: ExperienceItem) => void
}

export default function ExperienceCard({
  experience,
  onEdit,
  onDelete,
  onViewDetail
}: ExperienceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

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
    <div className='group relative flex flex-col justify-between bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 transition-all duration-200 hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-600 hover:-translate-y-0.5'>
      {/* Top Header: Type Badge & Quick Actions */}
      <div>
        <div className='flex items-start justify-between gap-3 mb-3.5'>
          {/* Type Badge */}
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.badgeClass}`}
          >
            <IconComponent className='w-3.5 h-3.5 shrink-0' />
            <span>{config.label}</span>
          </div>

          {/* Action Buttons */}
          <div className='flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity'>
            <button
              type='button'
              onClick={() => onViewDetail(experience)}
              title='Lihat Detail'
              className='p-1.5 bg-transparent border-0 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-colors cursor-pointer'
            >
              <Eye className='w-4 h-4' />
            </button>
            <button
              type='button'
              onClick={() => onEdit(experience)}
              title='Edit Pengalaman'
              className='p-1.5 bg-transparent border-0 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/50 rounded-lg transition-colors cursor-pointer'
            >
              <Pencil className='w-4 h-4' />
            </button>
            <button
              type='button'
              onClick={() => onDelete(experience)}
              title='Hapus Pengalaman'
              className='p-1.5 bg-transparent border-0 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors cursor-pointer'
            >
              <Trash2 className='w-4 h-4' />
            </button>
          </div>
        </div>

        {/* Title & Role */}
        <h3 className='text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
          {experience.title}
        </h3>

        {/* Role & Institution */}
        <div className='flex flex-wrap items-center gap-x-2 gap-y-1 text-sm mt-1.5'>
          <span className='font-semibold text-blue-600 dark:text-blue-400'>
            {experience.role}
          </span>
          {experience.institutionName && experience.institutionName !== '-' && (
            <>
              <span className='text-slate-300 dark:text-slate-700'>•</span>
              <span className='inline-flex items-center gap-1 text-slate-600 dark:text-slate-400 font-medium'>
                <Building2 className='w-3.5 h-3.5 shrink-0 text-slate-400' />
                <span>{experience.institutionName}</span>
              </span>
            </>
          )}
        </div>

        {/* Period */}
        <div className='inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium'>
          <Calendar className='w-3.5 h-3.5 shrink-0 text-slate-400' />
          <span>{periodText}</span>
        </div>

        {/* Description */}
        {experience.description && (
          <div className='mt-3.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed'>
            <p className={isExpanded ? '' : 'line-clamp-2'}>
              {experience.description}
            </p>
            {experience.description.length > 140 && (
              <button
                type='button'
                onClick={() => setIsExpanded(!isExpanded)}
                className='inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline mt-1 bg-transparent border-0 cursor-pointer p-0'
              >
                <span>{isExpanded ? 'Perkecil' : 'Baca selengkapnya'}</span>
                {isExpanded ? (
                  <ChevronUp className='w-3 h-3' />
                ) : (
                  <ChevronDown className='w-3 h-3' />
                )}
              </button>
            )}
          </div>
        )}

        {/* Extracted Skills Chips */}
        {skillEvidences.length > 0 && (
          <div className='mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/80'>
            <div className='flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-2'>
              <CheckCircle2 className='w-3.5 h-3.5' />
              <span>{skillEvidences.length} Skill Tervalidasi</span>
            </div>
            <div className='flex flex-wrap gap-1.5'>
              {skillEvidences.slice(0, 4).map(evidence => (
                <span
                  key={evidence.id}
                  className='inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                >
                  {evidence.userSkill.skill.name}
                </span>
              ))}
              {skillEvidences.length > 4 && (
                <span className='text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'>
                  +{skillEvidences.length - 4} lainnya
                </span>
              )}
            </div>
          </div>
        )}

        {/* AI Analysis Pending State if no skills yet */}
        {skillEvidences.length === 0 && latestAiJob && (
          <div className='mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/80'>
            <div className='inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/60'>
              <Sparkles className='w-3.5 h-3.5 text-blue-500 animate-pulse' />
              <span>
                {latestAiJob.status === 'queued'
                  ? 'Menunggu antrean ekstraksi skill AI'
                  : latestAiJob.status === 'processing'
                  ? 'Sedang diekstrak oleh AI...'
                  : 'Siap dianalisis oleh AI'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Footer: Proof link & Quick View */}
      <div className='mt-4 pt-3 flex items-center justify-between gap-3 text-xs border-t border-slate-100 dark:border-slate-800/60'>
        {experience.proofUrl ? (
          <a
            href={experience.proofUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors'
          >
            <ExternalLink className='w-3.5 h-3.5' />
            <span>Bukti Kegiatan</span>
          </a>
        ) : (
          <span className='text-slate-400 dark:text-slate-500'>
            Belum ada tautan bukti
          </span>
        )}

        <button
          type='button'
          onClick={() => onViewDetail(experience)}
          className='font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors bg-transparent border-0 cursor-pointer p-0'
        >
          Lihat Detail →
        </button>
      </div>
    </div>
  )
}
