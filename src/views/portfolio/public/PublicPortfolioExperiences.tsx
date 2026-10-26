'use client'

import React, { useState, useMemo, useEffect } from 'react'

import {
  Briefcase,
  ExternalLink,
  FolderGit2,
  Users,
  Trophy,
  Calendar,
  Building2,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

import type { PortfolioExperienceItem, PortfolioTheme } from '@/types/portfolio'

interface PublicPortfolioExperiencesProps {
  experiences: PortfolioExperienceItem[]
  theme?: PortfolioTheme
  isMobileView?: boolean
}

function getExperienceTypeBadge(type: string) {
  switch (type) {
    case 'internship':
      return {
        label: 'Magang Kerja',
        icon: Briefcase,
        className: 'bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800'
      }
    case 'project':
      return {
        label: 'Proyek Portofolio',
        icon: FolderGit2,
        className: 'bg-indigo-50 text-indigo-700 border-indigo-200/80 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800'
      }
    case 'organisation':
      return {
        label: 'Organisasi & Komunitas',
        icon: Users,
        className: 'bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800'
      }
    case 'competition':
      return {
        label: 'Prestasi & Kompetisi',
        icon: Trophy,
        className: 'bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800'
      }
    default:
      return {
        label: 'Pengalaman',
        icon: Briefcase,
        className: 'bg-slate-50 text-slate-700 border-slate-200/80 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
      }
  }
}

function formatDateRange(startDateStr: string, endDateStr?: string | null, isOngoing?: boolean) {
  const start = new Date(startDateStr)
  const startFormatted = start.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })

  if (isOngoing || !endDateStr) {
    return {
      range: `${startFormatted} — Sekarang`,
      isOngoing: true
    }
  }

  const end = new Date(endDateStr)
  const endFormatted = end.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })

  return {
    range: `${startFormatted} — ${endFormatted}`,
    isOngoing: false
  }
}

export default function PublicPortfolioExperiences({
  experiences,
  theme = 'royal-blue',
  isMobileView = false
}: PublicPortfolioExperiencesProps) {
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false)

  useEffect(() => {
    const checkScreen = () => {
      setIsSmallScreen(window.innerWidth < 640)
    }

    checkScreen()
    window.addEventListener('resize', checkScreen)

    return () => window.removeEventListener('resize', checkScreen)
  }, [])

  const filterTabs = useMemo(() => {
    return [
      { key: 'all', label: 'Semua Pengalaman', count: experiences.length },
      {
        key: 'internship',
        label: 'Magang',
        count: experiences.filter(e => e.type === 'internship').length
      },
      {
        key: 'project',
        label: 'Proyek',
        count: experiences.filter(e => e.type === 'project').length
      },
      {
        key: 'organisation',
        label: 'Organisasi',
        count: experiences.filter(e => e.type === 'organisation').length
      },
      {
        key: 'competition',
        label: 'Kompetisi',
        count: experiences.filter(e => e.type === 'competition').length
      }
    ].filter(tab => tab.key === 'all' || tab.count > 0)
  }, [experiences])

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return experiences

    return experiences.filter(e => e.type === activeFilter)
  }, [experiences, activeFilter])

  const handleFilterChange = (key: string) => {
    setActiveFilter(key)
    setCurrentPage(1)
  }

  // 3 items per page on mobile, 4 on desktop
  const isCompact = isMobileView || isSmallScreen
  const itemsPerPage = isCompact ? 3 : 4
  const totalPages = Math.ceil(filtered.length / itemsPerPage)

  const paginatedExperiences = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage

    return filtered.slice(startIndex, startIndex + itemsPerPage)
  }, [filtered, currentPage, itemsPerPage])

  const getThemeDot = () => {
    switch (theme) {
      case 'emerald-modern':
        return 'bg-emerald-600 ring-emerald-500/20'
      case 'sleek-slate':
        return 'bg-slate-800 dark:bg-slate-200 ring-slate-500/20'
      case 'royal-blue':
      default:
        return 'bg-blue-600 ring-blue-500/20'
    }
  }

  const getThemeActiveTab = () => {
    switch (theme) {
      case 'emerald-modern':
        return 'bg-emerald-600 text-white'
      case 'sleek-slate':
        return 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
      case 'royal-blue':
      default:
        return 'bg-blue-600 text-white'
    }
  }

  if (experiences.length === 0) return null

  return (
    <section className={`w-full border-b border-slate-200/80 dark:border-slate-800 transition-colors ${isMobileView ? 'py-5' : 'py-8 sm:py-12'}`}>
      <div className={`flex flex-col gap-5 ${isMobileView ? 'w-full px-3' : 'max-w-5xl mx-auto px-4 sm:px-6'}`}>
        {/* Section Heading */}
        <div className={`flex justify-between gap-2.5 ${isMobileView ? 'flex-col items-start' : 'flex-col sm:flex-row sm:items-end'}`}>
          <div className='flex flex-col gap-1'>
            <div className='flex items-center gap-2'>
              <Briefcase className='w-5 h-5 text-blue-600 dark:text-blue-400' />
              <h2 className={`font-bold text-slate-900 dark:text-white tracking-tight ${isMobileView ? 'text-lg' : 'text-xl sm:text-2xl'}`}>
                Rekam Jejak Pengalaman & Pencapaian
              </h2>
            </div>
            <p className='text-xs sm:text-sm text-slate-500 dark:text-slate-400'>
              Pengalaman kerja magang, kepemimpinan organisasi, serta proyek inovatif dengan bukti nyata.
            </p>
          </div>

          <span className='text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700 self-start sm:self-auto shrink-0'>
            {experiences.length} Rekam Jejak
          </span>
        </div>

        {/* Filter Tabs */}
        <div className='flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar'>
          {filterTabs.map(tab => {
            const isActive = activeFilter === tab.key

            return (
              <button
                key={tab.key}
                type='button'
                onClick={() => handleFilterChange(tab.key)}
                className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? `${getThemeActiveTab()} shadow-xs`
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Timeline List */}
        <div className={`relative border-l-2 border-slate-200 dark:border-slate-800 my-2 ${isMobileView ? 'pl-4 space-y-4' : 'pl-4 sm:pl-8 space-y-6 sm:space-y-8'}`}>
          {paginatedExperiences.map(exp => {
            const badge = getExperienceTypeBadge(exp.type)
            const BadgeIcon = badge.icon
            const dateInfo = formatDateRange(exp.startDate, exp.endDate, exp.isOngoing)

            return (
              <div key={exp.id} className='relative group'>
                {/* Timeline Dot */}
                <div
                  className={`absolute top-4 w-4 h-4 rounded-full ring-4 ${getThemeDot()} border-2 border-white dark:border-slate-900 shadow-xs transition-transform group-hover:scale-125 ${
                    isMobileView ? '-left-[25px]' : '-left-[25px] sm:-left-[41px]'
                  }`}
                />

                {/* Card Container */}
                <div className={`rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-blue-300 dark:hover:border-blue-700/80 hover:shadow-md transition-all ${
                  isMobileView ? 'p-3.5 space-y-2.5' : 'p-4 sm:p-6 space-y-3 sm:space-y-4'
                }`}>
                  {/* Top Line: Title & Badges */}
                  <div className={`flex justify-between gap-2.5 ${isMobileView ? 'flex-col items-start' : 'flex-col sm:flex-row sm:items-start'}`}>
                    <div className='flex flex-col gap-1'>
                      <div className='flex flex-wrap items-center gap-2'>
                        <h3 className={`font-extrabold text-slate-900 dark:text-white leading-snug ${isMobileView ? 'text-sm' : 'text-base sm:text-lg'}`}>
                          {exp.title}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badge.className}`}
                        >
                          <BadgeIcon className='w-3 h-3' />
                          <span>{badge.label}</span>
                        </span>
                      </div>

                      {/* Institution & Role */}
                      <div className='flex flex-wrap items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 pt-0.5'>
                        <div className='flex items-center gap-1.5 text-blue-600 dark:text-blue-400'>
                          <Building2 className='w-3.5 h-3.5 text-blue-500' />
                          <span>{exp.institutionName}</span>
                        </div>
                        {exp.role && (
                          <>
                            <span className='text-slate-300 dark:text-slate-700'>•</span>
                            <span className='text-slate-600 dark:text-slate-400 font-medium'>
                              {exp.role}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Date Badge */}
                    <div className='flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/80 text-xs text-slate-600 dark:text-slate-300 font-medium self-start shrink-0'>
                      <Calendar className='w-3.5 h-3.5 text-slate-400' />
                      <span>{dateInfo.range}</span>
                      {dateInfo.isOngoing && (
                        <span className='ml-1 px-1.5 py-0.2 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold'>
                          Aktif
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {exp.description && (
                    <p className='text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line border-t border-slate-100 dark:border-slate-800/80 pt-2.5 sm:pt-3'>
                      {exp.description}
                    </p>
                  )}

                  {/* Proof Link Button */}
                  {exp.proofUrl && (
                    <div className='pt-1'>
                      <a
                        href={exp.proofUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200/60 dark:border-blue-900 transition-all cursor-pointer'
                      >
                        <ExternalLink className='w-3.5 h-3.5' />
                        <span>Lihat Bukti Tautan / Dokumen</span>
                        <ArrowUpRight className='w-3 h-3 opacity-70' />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className='flex items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80'>
            <span className='text-[11px] sm:text-xs text-slate-500 dark:text-slate-400'>
              Hal {currentPage} dari {totalPages} · {filtered.length} Total Rekam Jejak
            </span>

            <div className='flex items-center gap-1.5'>
              <button
                type='button'
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className='p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer'
                aria-label='Halaman Sebelumnya'
              >
                <ChevronLeft className='w-4 h-4' />
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1
                const isActive = pageNum === currentPage

                return (
                  <button
                    key={pageNum}
                    type='button'
                    onClick={() => setCurrentPage(pageNum)}
                    className={`min-w-[28px] sm:min-w-[32px] h-7 sm:h-8 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? `${getThemeActiveTab()} shadow-xs`
                        : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}

              <button
                type='button'
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className='p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer'
                aria-label='Halaman Berikutnya'
              >
                <ChevronRight className='w-4 h-4' />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
