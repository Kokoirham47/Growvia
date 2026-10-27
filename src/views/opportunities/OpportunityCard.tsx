'use client'

import React from 'react'

import {
  MapPin,
  CheckCircle2,
  AlertCircle,
  Bookmark,
  ExternalLink,
  ChevronRight,
  Flame,
  Clock
} from 'lucide-react'

import type { OpportunityItem, OpportunityType } from '@/types/opportunities'

interface OpportunityCardProps {
  item: OpportunityItem
  onSelect: (item: OpportunityItem) => void
  onToggleSave: (item: OpportunityItem) => void
  onApply: (item: OpportunityItem) => void
  isSaving?: boolean
}

// Helper untuk styling perusahaan (Warna Monogram & Initial)
function getCompanyStyle(company: string) {
  const comp = company.toLowerCase()

  if (comp.includes('goto') || comp.includes('tokopedia') || comp.includes('gojek')) {
    return { bg: 'bg-[#00AA13]/10 text-[#00AA13] border-[#00AA13]/30', initial: 'GT' }
  }

  if (comp.includes('traveloka')) {
    return { bg: 'bg-[#0194F3]/10 text-[#0194F3] border-[#0194F3]/30', initial: 'TV' }
  }

  if (comp.includes('bca')) {
    return { bg: 'bg-[#0060AF]/10 text-[#0060AF] border-[#0060AF]/30', initial: 'BCA' }
  }

  if (comp.includes('shopee')) {
    return { bg: 'bg-[#EE4D2D]/10 text-[#EE4D2D] border-[#EE4D2D]/30', initial: 'SH' }
  }

  if (comp.includes('dicoding')) {
    return { bg: 'bg-slate-900/10 dark:bg-slate-700 text-slate-800 dark:text-white border-slate-300 dark:border-slate-600', initial: 'DC' }
  }

  if (comp.includes('astra')) {
    return { bg: 'bg-[#E52320]/10 text-[#E52320] border-[#E52320]/30', initial: 'AS' }
  }

  if (comp.includes('blibli')) {
    return { bg: 'bg-[#0095DA]/10 text-[#0095DA] border-[#0095DA]/30', initial: 'BL' }
  }

  if (comp.includes('bangkit')) {
    return { bg: 'bg-amber-500/10 text-amber-600 border-amber-500/30', initial: 'BK' }
  }

  if (comp.includes('kredivo')) {
    return { bg: 'bg-orange-500/10 text-orange-600 border-orange-500/30', initial: 'KR' }
  }

  if (comp.includes('telkom')) {
    return { bg: 'bg-rose-500/10 text-rose-600 border-rose-500/30', initial: 'TL' }
  }

  // Fallback styling
  const initials = company
    .split(' ')
    .map(w => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  return { bg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800', initial: initials || 'CO' }
}

// Label & warna jenis peluang
function getTypeInfo(type: OpportunityType) {
  switch (type) {
    case 'internship':
      return {
        label: 'Magang',
        className: 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
      }
    case 'full_time':
      return {
        label: 'Full-time',
        className: 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
      }
    case 'part_time':
      return {
        label: 'Part-time',
        className: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
      }
    case 'freelance':
      return {
        label: 'Freelance',
        className: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
      }
    case 'competition':
      return {
        label: 'Kompetisi',
        className: 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
      }
    default:
      return {
        label: 'Peluang',
        className: 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
      }
  }
}

// Format sisa hari deadline
function formatDeadline(dateString: string | null) {
  if (!dateString) return 'Terbuka'
  const deadline = new Date(dateString)
  const now = new Date()
  const diffTime = deadline.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  const dateFormatted = deadline.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })

  if (diffDays < 0) {
    return `Telah Ditutup (${dateFormatted})`
  }

  if (diffDays === 0) {
    return `Hari Terakhir! (${dateFormatted})`
  }

  if (diffDays <= 7) {
    return `${diffDays} hari lagi (${dateFormatted})`
  }

  
return dateFormatted
}

export default function OpportunityCard({
  item,
  onSelect,
  onToggleSave,
  onApply,
  isSaving = false
}: OpportunityCardProps) {
  const companyStyle = getCompanyStyle(item.company)
  const typeInfo = getTypeInfo(item.type)
  const deadlineText = formatDeadline(item.deadline)

  // Tentukan badge match score
  const isHighMatch = item.matchScore >= 75
  const isMediumMatch = item.matchScore >= 50 && item.matchScore < 75

  const matchColorClass = isHighMatch
    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800'
    : isMediumMatch
    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800'
    : 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800'

  const visibleMatched = item.matchedSkills.slice(0, 3)
  const visibleMissing = item.missingSkills.slice(0, 2)

  const remainingSkillsCount =
    item.allSkills.length - (visibleMatched.length + visibleMissing.length)

  return (
    <div className='flex flex-col justify-between bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-2xs hover:shadow-md hover:border-blue-300 dark:hover:border-blue-800/80 transition-all group'>
      {/* Upper Content */}
      <div className='flex flex-col gap-4'>
        {/* Header: Company Monogram + Type Badge + Save Bookmark Button */}
        <div className='flex items-start justify-between gap-3'>
          <div className='flex items-center gap-3'>
            {/* Company Monogram Avatar */}
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-sm border shadow-2xs shrink-0 ${companyStyle.bg}`}
            >
              {companyStyle.initial}
            </div>

            <div className='flex flex-col min-w-0'>
              <span className='text-xs font-semibold text-slate-500 dark:text-slate-400 truncate'>
                {item.company}
              </span>
              <h3
                onClick={() => onSelect(item)}
                className='text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 cursor-pointer'
              >
                {item.title}
              </h3>
            </div>
          </div>

          {/* Bookmark Button */}
          <button
            type='button'
            onClick={() => onToggleSave(item)}
            disabled={isSaving}
            title={item.isSaved ? 'Hapus dari Tersimpan' : 'Simpan Lowongan'}
            className={`p-2 rounded-xl border transition-all cursor-pointer shrink-0 ${
              item.isSaved
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-500'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-amber-500 hover:border-amber-200 dark:hover:border-amber-800'
            }`}
          >
            <Bookmark
              className={`w-4 h-4 transition-transform ${item.isSaved ? 'fill-current scale-110' : ''}`}
            />
          </button>
        </div>

        {/* Location & Opportunity Type Row */}
        <div className='flex flex-wrap items-center gap-2 text-xs'>
          <span
            className={`px-2.5 py-0.5 rounded-full font-semibold border ${typeInfo.className}`}
          >
            {typeInfo.label}
          </span>

          {item.location && (
            <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'>
              <MapPin className='w-3 h-3 text-slate-400' />
              <span>{item.location}</span>
            </span>
          )}

          {/* Match Score Gauge */}
          <div
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold border ml-auto ${matchColorClass}`}
          >
            {isHighMatch && <Flame className='w-3 h-3 fill-current' />}
            <span>{item.matchScore}% Match</span>
          </div>
        </div>

        {/* Description snippet */}
        {item.description && (
          <p className='text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed'>
            {item.description}
          </p>
        )}

        {/* Skills Comparison Section */}
        <div className='flex flex-col gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/70'>
          <div className='flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400'>
            <span>Kesesuaian Skill:</span>
            <span>
              <strong className='text-emerald-600 dark:text-emerald-400'>{item.matchedSkills.length}</strong> dikuasai ·{' '}
              <strong className='text-amber-600 dark:text-amber-400'>{item.missingSkills.length}</strong> perlu dipelajari
            </span>
          </div>

          <div className='flex flex-wrap items-center gap-1.5'>
            {/* Matched skills */}
            {visibleMatched.map(sk => (
              <span
                key={sk.id}
                className='inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50'
              >
                <CheckCircle2 className='w-3 h-3 text-emerald-500 shrink-0' />
                <span>{sk.name}</span>
              </span>
            ))}

            {/* Missing skills */}
            {visibleMissing.map(sk => (
              <span
                key={sk.id}
                className='inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60'
              >
                <AlertCircle className='w-3 h-3 text-amber-500 shrink-0' />
                <span>{sk.name}</span>
              </span>
            ))}

            {/* Remaining pill */}
            {remainingSkillsCount > 0 && (
              <span className='px-1.5 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'>
                +{remainingSkillsCount} lagi
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer: Deadline & Action Buttons */}
      <div className='flex flex-col gap-3 pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/70'>
        {/* Deadline text */}
        <div className='flex items-center justify-between text-xs text-slate-500 dark:text-slate-400'>
          <div className='flex items-center gap-1.5'>
            <Clock className='w-3.5 h-3.5 text-slate-400' />
            <span>Tenggat:</span>
            <span className='font-semibold text-slate-700 dark:text-slate-300'>{deadlineText}</span>
          </div>
        </div>

        {/* CTA Buttons Row */}
        <div className='grid grid-cols-2 gap-2'>
          <button
            type='button'
            onClick={() => onSelect(item)}
            className='inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-750 transition-colors cursor-pointer'
          >
            <span>Detail & Gap</span>
            <ChevronRight className='w-3.5 h-3.5' />
          </button>

          <button
            type='button'
            onClick={() => onApply(item)}
            className='inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs hover:shadow-sm transition-all cursor-pointer'
          >
            <span>Lamar Sekarang</span>
            <ExternalLink className='w-3.5 h-3.5' />
          </button>
        </div>
      </div>
    </div>
  )
}
