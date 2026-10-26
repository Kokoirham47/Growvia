'use client'

import React, { useState, useMemo, useEffect } from 'react'

import {
  Award,
  CheckCircle2,
  ShieldCheck,
  X,
  Briefcase,
  Sparkles,
  ChevronRight,
  ChevronLeft
} from 'lucide-react'

import type { PortfolioSkillItem, PortfolioTheme } from '@/types/portfolio'

interface PublicPortfolioSkillsProps {
  skills: PortfolioSkillItem[]
  theme?: PortfolioTheme
  isMobileView?: boolean
}

export default function PublicPortfolioSkills({
  skills,
  theme = 'royal-blue',
  isMobileView = false
}: PublicPortfolioSkillsProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [selectedSkill, setSelectedSkill] = useState<PortfolioSkillItem | null>(null)
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

  const categories = useMemo(() => {
    return [
      { key: 'all', label: 'Semua Keahlian', count: skills.length },
      {
        key: 'technical',
        label: 'Teknis & Framework',
        count: skills.filter(s => s.category === 'technical').length
      },
      {
        key: 'hard_skill',
        label: 'Hard Skills',
        count: skills.filter(s => s.category === 'hard_skill').length
      },
      {
        key: 'soft_skill',
        label: 'Soft Skills',
        count: skills.filter(s => s.category === 'soft_skill').length
      },
      {
        key: 'leadership',
        label: 'Kepemimpinan',
        count: skills.filter(s => s.category === 'leadership').length
      }
    ].filter(c => c.key === 'all' || c.count > 0)
  }, [skills])

  const filteredSkills = useMemo(() => {
    if (activeCategory === 'all') return skills

    return skills.filter(s => s.category === activeCategory)
  }, [skills, activeCategory])

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat)
    setCurrentPage(1)
  }

  // 6 per page on mobile (3 rows of 2 compact cards), 9 on desktop (3 rows of 3)
  const isCompact = isMobileView || isSmallScreen
  const itemsPerPage = isCompact ? 6 : 9
  const totalPages = Math.ceil(filteredSkills.length / itemsPerPage)

  const paginatedSkills = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage

    return filteredSkills.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredSkills, currentPage, itemsPerPage])

  const getThemeColor = () => {
    switch (theme) {
      case 'emerald-modern':
        return {
          bar: 'bg-emerald-600',
          hoverBorder: 'hover:border-emerald-400 dark:hover:border-emerald-600',
          activeTab: 'bg-emerald-600 text-white'
        }
      case 'sleek-slate':
        return {
          bar: 'bg-slate-800 dark:bg-slate-200',
          hoverBorder: 'hover:border-slate-500 dark:hover:border-slate-400',
          activeTab: 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
        }
      case 'royal-blue':
      default:
        return {
          bar: 'bg-blue-600',
          hoverBorder: 'hover:border-blue-400 dark:hover:border-blue-600',
          activeTab: 'bg-blue-600 text-white'
        }
    }
  }

  const themeColors = getThemeColor()

  const getLevelBadge = (level: string) => {
    switch (level.toLowerCase()) {
      case 'expert':
        return 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800'
      case 'advanced':
        return 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200/80 dark:border-blue-800'
      case 'intermediate':
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-700'
    }
  }

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'technical':
        return 'Teknis'
      case 'hard_skill':
        return 'Hard Skill'
      case 'soft_skill':
        return 'Soft Skill'
      case 'leadership':
        return 'Leadership'
      default:
        return cat
    }
  }

  if (skills.length === 0) return null

  return (
    <section className={`w-full border-b border-slate-200/80 dark:border-slate-800 transition-colors ${isMobileView ? 'py-5' : 'py-8 sm:py-12'}`}>
      <div className={`flex flex-col gap-5 ${isMobileView ? 'w-full px-3' : 'max-w-5xl mx-auto px-4 sm:px-6'}`}>
        {/* Section Heading */}
        <div className={`flex justify-between gap-2.5 ${isMobileView ? 'flex-col items-start' : 'flex-col sm:flex-row sm:items-end'}`}>
          <div className='flex flex-col gap-1'>
            <div className='flex items-center gap-2'>
              <Award className='w-5 h-5 text-blue-600 dark:text-blue-400' />
              <h2 className={`font-bold text-slate-900 dark:text-white tracking-tight ${isMobileView ? 'text-lg' : 'text-xl sm:text-2xl'}`}>
                Keahlian Berbasis Bukti Nyata
              </h2>
            </div>
            <p className='text-xs sm:text-sm text-slate-500 dark:text-slate-400'>
              Setiap keahlian terverifikasi secara objektif dari rekam jejak proyek dan pengalaman kerja nyata.
            </p>
          </div>

          <span className='text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700 self-start sm:self-auto shrink-0'>
            {skills.length} Keahlian Terverifikasi
          </span>
        </div>

        {/* Category Filter Chips */}
        <div className='flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar'>
          {categories.map(cat => {
            const isActive = activeCategory === cat.key

            return (
              <button
                key={cat.key}
                type='button'
                onClick={() => handleCategoryChange(cat.key)}
                className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? `${themeColors.activeTab} shadow-xs`
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Skills Cards Grid - 2 compact columns on mobile, 2-3 columns on desktop */}
        <div
          className={
            isMobileView
              ? 'grid grid-cols-2 gap-2.5 w-full'
              : 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4'
          }
        >
          {paginatedSkills.map(skill => {
            const hasEvidences = skill.evidences && skill.evidences.length > 0

            return (
              <div
                key={skill.id}
                onClick={() => hasEvidences && setSelectedSkill(skill)}
                className={`rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex flex-col justify-between shadow-2xs transition-all ${
                  isMobileView ? 'p-3 gap-2.5' : 'p-3 sm:p-5 gap-2.5 sm:gap-3.5'
                } ${
                  hasEvidences
                    ? `${themeColors.hoverBorder} hover:shadow-md cursor-pointer group`
                    : ''
                }`}
              >
                {/* Card Top: Title, Category & AI Badge */}
                <div className='flex items-start justify-between gap-1.5'>
                  <div className='flex flex-col gap-0.5 overflow-hidden flex-1'>
                    <h3
                      className={`font-bold text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ${
                        isMobileView ? 'text-xs line-clamp-2' : 'text-xs sm:text-base line-clamp-2 sm:line-clamp-1'
                      }`}
                    >
                      {skill.name}
                    </h3>
                    <div className='flex items-center gap-1.5 pt-0.5'>
                      <span className='text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 truncate'>
                        {getCategoryLabel(skill.category)}
                      </span>
                      <span
                        className={`text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.2 rounded border capitalize ${getLevelBadge(
                          skill.level
                        )}`}
                      >
                        {skill.level}
                      </span>
                    </div>
                  </div>

                  {skill.source === 'ai_extracted' && (
                    <span
                      title='Divalidasi Growvia AI'
                      className='p-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900 shrink-0'
                    >
                      <Sparkles className='w-3 h-3' />
                    </span>
                  )}
                </div>

                {/* Score & Meter */}
                <div className='flex flex-col gap-1'>
                  <div className='flex items-center justify-between text-[11px] sm:text-xs'>
                    <span className='font-medium text-slate-400 text-[10px] sm:text-[11px]'>Skor</span>
                    <span className='font-bold text-slate-900 dark:text-white text-[11px] sm:text-xs'>
                      {skill.score}
                      <span className='text-slate-400 font-normal'>/100</span>
                    </span>
                  </div>
                  <div className='w-full bg-slate-100 dark:bg-slate-800 h-1.5 sm:h-2 rounded-full overflow-hidden'>
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${themeColors.bar}`}
                      style={{ width: `${Math.min(100, Math.max(10, skill.score))}%` }}
                    />
                  </div>
                </div>

                {/* Card Bottom: Evidence Validation Affordance */}
                <div className='pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] sm:text-xs'>
                  {hasEvidences ? (
                    <div className='inline-flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400 truncate'>
                      <CheckCircle2 className='w-3 h-3 text-emerald-600 shrink-0' />
                      <span className='truncate'>{skill.evidences.length} Bukti</span>
                    </div>
                  ) : (
                    <span className='text-slate-400 font-normal text-[10px]'>Mandiri</span>
                  )}

                  {hasEvidences && (
                    <span className='inline-flex items-center gap-0.5 text-[10px] sm:text-[11px] font-bold text-blue-600 dark:text-blue-400 group-hover:underline shrink-0'>
                      <span>Lihat</span>
                      <ChevronRight className='w-3 h-3 group-hover:translate-x-0.5 transition-transform' />
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className={`flex items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 ${isMobileView ? 'flex-col sm:flex-row' : ''}`}>
            <span className='text-[11px] sm:text-xs text-slate-500 dark:text-slate-400'>
              Hal {currentPage} dari {totalPages} · {filteredSkills.length} Total Keahlian
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
                    className={`min-w-[30px] sm:min-w-[32px] h-7 sm:h-8 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? `${themeColors.activeTab} shadow-xs`
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

      {/* Evidence Modal Popover */}
      {selectedSkill && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200'>
          <div className='bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200'>
            {/* Header */}
            <div className='p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-850'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200/80 dark:border-emerald-800'>
                  <ShieldCheck className='w-5 h-5' />
                </div>
                <div className='flex flex-col'>
                  <h3 className='text-base font-bold text-slate-900 dark:text-white'>
                    Validasi Keahlian: {selectedSkill.name}
                  </h3>
                  <div className='flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5'>
                    <span>Level {selectedSkill.level}</span>
                    <span>•</span>
                    <span className='font-semibold text-slate-700 dark:text-slate-300'>
                      Skor {selectedSkill.score}/100
                    </span>
                  </div>
                </div>
              </div>

              <button
                type='button'
                onClick={() => setSelectedSkill(null)}
                className='p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer'
              >
                <X className='w-5 h-5' />
              </button>
            </div>

            {/* Evidence List */}
            <div className='p-5 sm:p-6 overflow-y-auto space-y-4'>
              <div className='p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/60 flex items-center gap-2.5 text-xs text-blue-700 dark:text-blue-300'>
                <Sparkles className='w-4 h-4 shrink-0 text-blue-600' />
                <span>
                  Keahlian ini telah diekstraksi dan divalidasi oleh AI dari riwayat pengalaman nyata berikut:
                </span>
              </div>

              {selectedSkill.evidences.map((ev, idx) => (
                <div
                  key={ev.id || idx}
                  className='p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2.5'
                >
                  <div className='flex items-start gap-2.5'>
                    <div className='w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5'>
                      <Briefcase className='w-3.5 h-3.5' />
                    </div>
                    <div className='flex flex-col'>
                      <span className='text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug'>
                        {ev.experienceTitle}
                      </span>
                      <span className='text-[11px] font-semibold text-slate-500 dark:text-slate-400'>
                        {ev.institutionName}
                      </span>
                    </div>
                  </div>

                  {ev.note && (
                    <div className='p-3 rounded-xl bg-white dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800 leading-relaxed'>
                      {ev.note}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className='p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end'>
              <button
                type='button'
                onClick={() => setSelectedSkill(null)}
                className='px-4 py-2 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer'
              >
                Tutup Validasi
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
