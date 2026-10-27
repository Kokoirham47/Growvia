'use client'

import React, { useState, useMemo, useEffect, useRef } from 'react'

import {
  ExternalLink,
  Calendar,
  Building2,
  Sparkles,
  Search,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Award,
  FileText,
  RotateCcw,
  X
} from 'lucide-react'

import type { EvidenceDetail } from '@/types/skills'
import ExperienceEvidenceDetailModal, {
  type GroupedExperienceEvidence
} from './ExperienceEvidenceDetailModal'

interface EvidenceViewProps {
  evidences: EvidenceDetail[]
  onOpenAddSkill: () => void
  highlightedSkillName?: string
  highlightedExperienceKey?: string
  onClearHighlight?: () => void
}

interface FilterOption {
  key: string
  label: string
  aliases: string[]
}

const TYPE_FILTERS: FilterOption[] = [
  { key: 'all', label: 'Semua Tipe', aliases: [] },
  { key: 'project', label: 'Proyek', aliases: ['project', 'proyek'] },
  { key: 'internship', label: 'Magang', aliases: ['internship', 'magang'] },
  { key: 'organisation', label: 'Organisasi', aliases: ['organisation', 'organization', 'organisasi'] },
  { key: 'committee', label: 'Kepanitiaan', aliases: ['committee', 'kepanitiaan'] },
  { key: 'competition', label: 'Kompetisi', aliases: ['competition', 'kompetisi', 'lomba'] },
  { key: 'freelance', label: 'Freelance', aliases: ['freelance'] }
]

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

function getPaginationRange(current: number, total: number): (number | string)[] {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  if (current <= 3) {
    return [1, 2, 3, 4, '...', total]
  }

  if (current >= total - 2) {
    return [1, '...', total - 3, total - 2, total - 1, total]
  }

  return [1, '...', current - 1, current, current + 1, '...', total]
}

export default function EvidenceView({
  evidences,
  highlightedSkillName,
  highlightedExperienceKey,
  onClearHighlight
}: EvidenceViewProps) {
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [isMobile, setIsMobile] = useState(false)

  const [selectedExperienceForDetail, setSelectedExperienceForDetail] =
    useState<GroupedExperienceEvidence | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)

  // Responsive screen detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 1. Group raw evidences by Experience
  const groupedExperiences: GroupedExperienceEvidence[] = useMemo(() => {
    const map = new Map<string, GroupedExperienceEvidence>()

    evidences.forEach(ev => {
      const key =
        ev.experienceId ||
        `${ev.experienceTitle.trim().toLowerCase()}__${ev.institutionName.trim().toLowerCase()}__${ev.experienceRole.trim().toLowerCase()}`

      if (!map.has(key)) {
        map.set(key, {
          key,
          experienceId: ev.experienceId,
          experienceTitle: ev.experienceTitle,
          experienceRole: ev.experienceRole,
          institutionName: ev.institutionName,
          period: ev.period,
          type: ev.type,
          proofUrl: ev.proofUrl,
          aiExtracted: ev.aiExtracted,
          skills: []
        })
      }

      const group = map.get(key)!

      if (ev.aiExtracted) {
        group.aiExtracted = true
      }

      if (ev.proofUrl && !group.proofUrl) {
        group.proofUrl = ev.proofUrl
      }

      const existingSkill = group.skills.find(
        s => s.skillId === ev.skillId || s.skillName.toLowerCase() === ev.skillName.toLowerCase()
      )

      if (!existingSkill) {
        group.skills.push({
          skillId: ev.skillId,
          skillName: ev.skillName,
          note: ev.impactNote,
          aiExtracted: ev.aiExtracted
        })
      } else if (ev.impactNote && !existingSkill.note) {
        existingSkill.note = ev.impactNote
      }
    })

    return Array.from(map.values())
  }, [evidences])

  // 2. Filter grouped experiences by search and type
  const filteredExperiences = useMemo(() => {
    return groupedExperiences.filter(group => {
      const q = search.toLowerCase().trim()

      const matchesSearch =
        !q ||
        group.experienceTitle.toLowerCase().includes(q) ||
        group.experienceRole.toLowerCase().includes(q) ||
        group.institutionName.toLowerCase().includes(q) ||
        group.skills.some(
          s => s.skillName.toLowerCase().includes(q) || (s.note && s.note.toLowerCase().includes(q))
        )

      let matchesType = true

      if (selectedType !== 'all') {
        const targetFilter = TYPE_FILTERS.find(f => f.key === selectedType)

        if (targetFilter) {
          const normType = (group.type || '').toLowerCase().trim()

          matchesType = targetFilter.aliases.some(alias => normType === alias || normType.includes(alias))
        }
      }

      return matchesSearch && matchesType
    })
  }, [groupedExperiences, search, selectedType])

  // 3. Responsive Pagination (6 on desktop, 4 on mobile)
  const itemsPerPage = isMobile ? 4 : 6
  const totalPages = Math.max(1, Math.ceil(filteredExperiences.length / itemsPerPage))

  // If a skill or experience is highlighted, ensure we jump to the page that contains it!
  useEffect(() => {
    if (highlightedExperienceKey || highlightedSkillName) {
      // Clear filters so target experience isn't hidden
      setSelectedType('all')
      setSearch('')

      const targetIdx = groupedExperiences.findIndex(
        g =>
          (highlightedExperienceKey && g.key === highlightedExperienceKey) ||
          (highlightedSkillName &&
            g.skills.some(
              s => s.skillName.toLowerCase() === highlightedSkillName.toLowerCase()
            ))
      )

      if (targetIdx !== -1) {
        const targetPage = Math.floor(targetIdx / itemsPerPage) + 1

        setCurrentPage(targetPage)

        const targetGroup = groupedExperiences[targetIdx]

        // Smooth scroll to the target card after DOM renders
        const scrollTimer = setTimeout(() => {
          const cardEl = document.getElementById(`exp-card-${targetGroup.key}`)

          if (cardEl) {
            cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        }, 250)

        return () => clearTimeout(scrollTimer)
      }
    }
  }, [highlightedExperienceKey, highlightedSkillName, groupedExperiences, itemsPerPage])

  // Clamp current page
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const paginatedExperiences = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage

    return filteredExperiences.slice(startIdx, startIdx + itemsPerPage)
  }, [filteredExperiences, currentPage, itemsPerPage])

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)

    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const startIdx = (currentPage - 1) * itemsPerPage
  const endIdx = Math.min(startIdx + itemsPerPage, filteredExperiences.length)

  return (
    <div ref={containerRef} className='flex flex-col gap-5 w-full scroll-mt-24'>
      {/* Active Highlight Banner if navigating from a Skill Matrix Card */}
      {highlightedSkillName && (
        <div className='flex items-center justify-between gap-3 p-3.5 px-4 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 shadow-xs animate-in slide-in-from-top-2 duration-200'>
          <div className='flex items-center gap-2.5 text-xs text-blue-900 dark:text-blue-200'>
            <span className='w-2 h-2 rounded-full bg-blue-600 animate-ping' />
            <span>
              Menampilkan pengalaman yang memvalidasi skill:{' '}
              <span className='font-bold text-[#1E3A8A] dark:text-blue-300'>
                &ldquo;{highlightedSkillName}&rdquo;
              </span>
            </span>
          </div>

          <button
            type='button'
            onClick={onClearHighlight}
            className='inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-800 transition-all cursor-pointer shadow-2xs'
          >
            <span>Hapus Sorotan</span>
            <X className='w-3 h-3' />
          </button>
        </div>
      )}

      {/* Top Filter and Search Control Bar */}
      <div className='flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5 p-3.5 sm:p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs'>
        {/* Search input */}
        <div className='relative w-full lg:max-w-md'>
          <Search className='w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2' />
          <input
            type='text'
            value={search}
            onChange={e => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            placeholder='Cari bukti berdasarkan skill, institusi, atau peran...'
            className='w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all'
          />
        </div>

        {/* Filter chips with responsive horizontal scroll */}
        <div className='flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs font-medium'>
          {TYPE_FILTERS.map(filter => {
            const isActive = selectedType === filter.key

            return (
              <button
                key={filter.key}
                type='button'
                onClick={() => {
                  setSelectedType(filter.key)
                  setCurrentPage(1)
                }}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#1E3A8A] text-white font-semibold shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {filter.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Empty State */}
      {filteredExperiences.length === 0 ? (
        <div className='p-12 rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center gap-3'>
          <div className='w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-[#2563EB] mb-1'>
            <FileText className='w-7 h-7' />
          </div>
          <h4 className='text-base font-bold text-slate-800 dark:text-slate-200'>
            Tidak Ada Bukti Pengalaman Ditemukan
          </h4>
          <p className='text-xs text-slate-500 dark:text-slate-400 max-w-md'>
            {search || selectedType !== 'all'
              ? 'Tidak ada pengalaman yang cocok dengan kriteria pencarian atau filter yang dipilih.'
              : 'Belum ada bukti pengalaman yang terhubung ke profil skill Anda.'}
          </p>

          {(search || selectedType !== 'all') && (
            <button
              type='button'
              onClick={() => {
                setSearch('')
                setSelectedType('all')
                setCurrentPage(1)
              }}
              className='mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#2563EB] dark:text-blue-300 text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-all cursor-pointer'
            >
              <RotateCcw className='w-3.5 h-3.5' />
              <span>Reset Filter & Pencarian</span>
            </button>
          )}
        </div>
      ) : (

        /* Grouped Experience Cards Grid with Uniform Heights */
        <div className='flex flex-col gap-5'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 items-stretch'>
            {paginatedExperiences.map(group => {
              const typeConfig = getTypeBadgeConfig(group.type)

              const isHighlighted =
                Boolean(highlightedExperienceKey && group.key === highlightedExperienceKey) ||
                Boolean(
                  highlightedSkillName &&
                    group.skills.some(
                      s => s.skillName.toLowerCase() === highlightedSkillName.toLowerCase()
                    )
                )

              return (
                <div
                  key={group.key}
                  id={`exp-card-${group.key}`}
                  className={`p-5 sm:p-6 rounded-[22px] bg-white dark:bg-slate-900 border transition-all duration-300 flex flex-col justify-between gap-4 h-full ${
                    isHighlighted
                      ? 'ring-4 ring-blue-500/85 ring-offset-2 ring-offset-white dark:ring-offset-slate-950 border-blue-500 shadow-xl shadow-blue-500/20 animate-pulse'
                      : 'border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900/60'
                  }`}
                >
                  <div className='flex flex-col flex-1'>
                    {/* Header: Experience Type Badge, Highlight Indicator & AI Verified Badge */}
                    <div className='flex items-start justify-between gap-2 flex-wrap'>
                      <div className='flex items-center gap-2 flex-wrap'>
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${typeConfig.badgeClass}`}>
                          {typeConfig.label}
                        </span>

                        {isHighlighted && (
                          <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#2563EB] text-white shadow-xs animate-bounce'>
                            <Sparkles className='w-2.5 h-2.5' />
                            <span>Terkait Skill Terpilih</span>
                          </span>
                        )}
                      </div>

                      {group.aiExtracted && (
                        <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#EEF2FF] text-[#6366F1] dark:bg-indigo-950/60 dark:text-indigo-300 border border-[#E0E7FF] dark:border-indigo-900/60 shrink-0'>
                          <span>Tervalidasi AI</span>
                          <Sparkles className='w-2.5 h-2.5' />
                        </span>
                      )}
                    </div>

                    {/* Experience Title & Role */}
                    <h4 className='text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-3 leading-snug line-clamp-2'>
                      {group.experienceTitle}
                    </h4>

                    <p className='text-xs sm:text-[13px] font-semibold text-[#2563EB] dark:text-blue-400 mt-0.5 truncate'>
                      {group.experienceRole}
                    </p>

                    {/* Institution Name & Period */}
                    <div className='flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-2 flex-wrap'>
                      <span className='flex items-center gap-1.5'>
                        <Building2 className='w-3.5 h-3.5 text-slate-400 shrink-0' />
                        <span className='truncate max-w-[200px] sm:max-w-none'>{group.institutionName}</span>
                      </span>
                      <span>•</span>
                      <span className='flex items-center gap-1.5'>
                        <Calendar className='w-3.5 h-3.5 text-slate-400 shrink-0' />
                        <span>{group.period}</span>
                      </span>
                    </div>

                    {/* Clean Skill Trigger Button - Replaces irregular cards with consistent uniform trigger */}
                    <div className='mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800'>
                      <button
                        type='button'
                        onClick={() => setSelectedExperienceForDetail(group)}
                        className='w-full py-2.5 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-blue-50/80 dark:hover:bg-blue-950/50 border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-300 dark:hover:border-blue-800/80 text-slate-700 dark:text-slate-200 hover:text-[#2563EB] dark:hover:text-blue-400 text-xs font-semibold flex items-center justify-between transition-all group/btn cursor-pointer shadow-2xs'
                      >
                        <div className='flex items-center gap-2'>
                          <Award className='w-4 h-4 text-[#2563EB] dark:text-blue-400 shrink-0' />
                          <span>{group.skills.length} Skill Terverifikasi</span>
                        </div>
                        <div className='flex items-center gap-1 text-[11px] text-slate-400 group-hover/btn:text-[#2563EB] dark:group-hover/btn:text-blue-400 font-medium'>
                          <span>Lihat Rincian Skill</span>
                          <ChevronRight className='w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform' />
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Bottom Verification & Document Link */}
                  <div className='pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs'>
                    <div className='flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium'>
                      <CheckCircle2 className='w-3.5 h-3.5 shrink-0' />
                      <span>Bukti Terverifikasi</span>
                    </div>

                    {group.proofUrl && (
                      <a
                        href={group.proofUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-flex items-center gap-1 text-[#2563EB] hover:underline font-semibold cursor-pointer'
                      >
                        <span>Lihat Dokumen</span>
                        <ExternalLink className='w-3 h-3' />
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pagination Controls & Count Summary Bar */}
          <div className='flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 pb-1 border-t border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400'>
            <div>
              Menampilkan <span className='font-bold text-slate-800 dark:text-slate-200'>{startIdx + 1}</span> -{' '}
              <span className='font-bold text-slate-800 dark:text-slate-200'>{endIdx}</span> dari{' '}
              <span className='font-bold text-slate-800 dark:text-slate-200'>{filteredExperiences.length}</span>{' '}
              Pengalaman
            </div>

            {totalPages > 1 && (
              <div className='flex items-center gap-1.5'>
                {/* Previous Page Button */}
                <button
                  type='button'
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  aria-label='Halaman Sebelumnya'
                  className='inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium cursor-pointer shadow-2xs text-xs'
                >
                  <ChevronLeft className='w-4 h-4' />
                  <span className='hidden sm:inline'>Sebelumnya</span>
                </button>

                {/* Numbered Page Buttons */}
                <div className='flex items-center gap-1'>
                  {getPaginationRange(currentPage, totalPages).map((p, idx) => {
                    if (p === '...') {
                      return (
                        <span
                          key={`ellipsis-${idx}`}
                          className='w-8 h-8 flex items-center justify-center text-slate-400 dark:text-slate-500 text-xs select-none'
                        >
                          ...
                        </span>
                      )
                    }

                    const pageNum = Number(p)
                    const isActive = pageNum === currentPage

                    return (
                      <button
                        key={pageNum}
                        type='button'
                        onClick={() => handlePageChange(pageNum)}
                        aria-label={`Ke halaman ${pageNum}`}
                        aria-current={isActive ? 'page' : undefined}
                        className={`w-8 h-8 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center ${
                          isActive
                            ? 'bg-[#2563EB] text-white shadow-xs'
                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>

                {/* Next Page Button */}
                <button
                  type='button'
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  aria-label='Halaman Selanjutnya'
                  className='inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium cursor-pointer shadow-2xs text-xs'
                >
                  <span className='hidden sm:inline'>Selanjutnya</span>
                  <ChevronRight className='w-4 h-4' />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detail Modal: Displays clean and readable list of skills and notes */}
      <ExperienceEvidenceDetailModal
        isOpen={Boolean(selectedExperienceForDetail)}
        experience={selectedExperienceForDetail}
        highlightedSkillName={highlightedSkillName}
        onClose={() => setSelectedExperienceForDetail(null)}
      />
    </div>
  )
}
