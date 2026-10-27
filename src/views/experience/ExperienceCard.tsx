'use client'

import React, { useState } from 'react'

import {
  Calendar,
  ExternalLink,
  Sparkles,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Eye
} from 'lucide-react'

import type {
  ExperienceItem} from './experienceUtils';
import {
  EXPERIENCE_TYPE_CONFIG,
  formatExperiencePeriod
} from './experienceUtils'

interface ExperienceCardProps {
  experience: ExperienceItem
  onEdit: (exp: ExperienceItem) => void
  onDelete: (exp: ExperienceItem) => void
  onViewDetail: (exp: ExperienceItem) => void
  onTriggerAI?: (exp: ExperienceItem) => void
}

export default function ExperienceCard({
  experience,
  onEdit,
  onDelete,
  onViewDetail,
  onTriggerAI
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
    <div className='group relative flex flex-col justify-between font-poppins bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 transition-all duration-200 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-0.5'>
      {/* Top Section */}
      <div>
        {/* Type Badge & Actions */}
        <div className='flex items-start justify-between gap-2 mb-3'>
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.badgeClass}`}
          >
            <IconComponent className='w-3.5 h-3.5 shrink-0' />
            <span>{config.label}</span>
          </div>

          {/* Action Buttons */}
          <div className='flex items-center gap-0.5 opacity-90 group-hover:opacity-100 transition-opacity'>
            {onTriggerAI && (
              <button
                type='button'
                onClick={() => onTriggerAI(experience)}
                title='Ekstrak Skill AI'
                className='p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-colors cursor-pointer'
              >
                <Sparkles className='w-4 h-4' />
              </button>
            )}
            <button
              type='button'
              onClick={() => onViewDetail(experience)}
              title='Lihat Detail'
              className='p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-lg transition-colors cursor-pointer'
            >
              <Eye className='w-4 h-4' />
            </button>
            <button
              type='button'
              onClick={() => onEdit(experience)}
              title='Edit Pengalaman'
              className='p-1.5 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/50 rounded-lg transition-colors cursor-pointer'
            >
              <Pencil className='w-4 h-4' />
            </button>
            <button
              type='button'
              onClick={() => onDelete(experience)}
              title='Hapus Pengalaman'
              className='p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors cursor-pointer'
            >
              <Trash2 className='w-4 h-4' />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className='text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2'>
          {experience.title}
        </h3>

        {/* Role & Institution */}
        <div className='flex flex-wrap items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 mt-1.5'>
          <span className='font-semibold text-blue-600 dark:text-blue-400'>
            {experience.role}
          </span>
          {experience.institutionName && experience.institutionName !== '-' && (
            <>
              <span className='text-slate-300 dark:text-slate-700'>•</span>
              <span className='font-normal text-slate-600 dark:text-slate-400 truncate max-w-[180px] sm:max-w-[220px]'>
                {experience.institutionName}
              </span>
            </>
          )}
        </div>

        {/* Period */}
        <div className='inline-flex items-center gap-1.5 text-[11.5px] text-slate-500 dark:text-slate-400 mt-1.5'>
          <Calendar className='w-3.5 h-3.5 shrink-0 text-slate-400' />
          <span>{periodText}</span>
        </div>

        {/* Description */}
        {experience.description && (
          <div className='mt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed'>
            <p className={isExpanded ? '' : 'line-clamp-2'}>
              {experience.description}
            </p>
            {experience.description.length > 110 && (
              <button
                type='button'
                onClick={() => setIsExpanded(!isExpanded)}
                className='inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline mt-1 cursor-pointer p-0'
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

        {/* Skill Evidences */}
        {skillEvidences.length > 0 && (
          <div className='mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80'>
            <div className='flex items-center justify-between mb-2 text-xs'>
              <span className='inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-emerald-700 dark:text-emerald-400'>
                <CheckCircle2 className='w-3.5 h-3.5 shrink-0' />
                <span>{skillEvidences.length} Skill Tervalidasi</span>
              </span>
              {onTriggerAI && (
                <button
                  type='button'
                  onClick={() => onTriggerAI(experience)}
                  className='text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 cursor-pointer'
                >
                  <Sparkles className='w-3 h-3' />
                  <span>Review AI</span>
                </button>
              )}
            </div>
            <div className='flex flex-wrap gap-1'>
              {skillEvidences.slice(0, 3).map(evidence => (
                <span
                  key={evidence.id}
                  className='text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                >
                  {evidence.userSkill.skill.name}
                </span>
              ))}
              {skillEvidences.length > 3 && (
                <span className='text-[11px] font-semibold px-1.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'>
                  +{skillEvidences.length - 3} lainnya
                </span>
              )}
            </div>
          </div>
        )}

        {/* If no skills yet */}
        {skillEvidences.length === 0 && (
          <div className='mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80'>
            {onTriggerAI ? (
              <button
                type='button'
                onClick={() => onTriggerAI(experience)}
                className='w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50/70 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/40 border border-blue-200/60 dark:border-blue-900/40 transition-colors cursor-pointer'
              >
                <Sparkles className='w-3.5 h-3.5 text-blue-500' />
                <span>Ekstrak Skill dengan AI</span>
              </button>
            ) : (
              <span className='text-xs text-slate-400 dark:text-slate-500'>
                {latestAiJob?.status === 'queued'
                  ? 'Menunggu antrean ekstraksi skill AI'
                  : latestAiJob?.status === 'processing'
                  ? 'Sedang diekstrak oleh AI...'
                  : 'Belum ada skill diekstrak'}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bottom Footer */}
      <div className='mt-4 pt-3 flex items-center justify-between text-xs border-t border-slate-100 dark:border-slate-800/60 text-[11.5px]'>
        {experience.proofUrl ? (
          <a
            href={experience.proofUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 hover:underline'
          >
            <ExternalLink className='w-3 h-3' />
            <span>Bukti Kegiatan</span>
          </a>
        ) : (
          <span className='text-slate-400 dark:text-slate-500'>
            Tanpa tautan bukti
          </span>
        )}

        <button
          type='button'
          onClick={() => onViewDetail(experience)}
          className='font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer p-0'
        >
          Lihat Detail →
        </button>
      </div>
    </div>
  )
}
