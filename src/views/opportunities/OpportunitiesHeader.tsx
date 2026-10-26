'use client'

import React from 'react'

import { Compass, Award, Zap } from 'lucide-react'

interface OpportunitiesHeaderProps {
  userTargetRole?: string | null
  averageMatchScore?: number
  userSkillsCount?: number
  totalOpportunities?: number
  onQuickFilterHighMatch?: () => void
}

export default function OpportunitiesHeader({
  userTargetRole = 'Software Engineer',
  averageMatchScore = 75,
  userSkillsCount = 0,
  totalOpportunities = 0,
  onQuickFilterHighMatch
}: OpportunitiesHeaderProps) {
  const displayTarget = userTargetRole || 'Software Engineer'

  return (
    <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 pt-1'>
      {/* Left Column: Badges + H1 + Sub-text */}
      <div className='flex flex-col gap-2.5 max-w-3xl'>
        {/* Badges Row */}
        <div className='flex flex-wrap items-center gap-2'>
          {/* Engine Badge */}
          <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/70 dark:border-blue-800/60 shadow-2xs'>
            <Compass className='w-3.5 h-3.5 text-blue-600 dark:text-blue-400' />
            <span>Karier Terkurasi · Ekosistem Tech Indonesia</span>
          </div>

          {/* Career Target Badge */}
          <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800/60 shadow-2xs'>
            <span className='w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-ping' />
            <span>Target: {displayTarget}</span>
          </div>
        </div>

        {/* Title H1 */}
        <h1 className='text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight'>
          Peluang Karier & Magang
        </h1>

        {/* Sub-text */}
        <p className='text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed'>
          Daftar lowongan kerja, magang, dan kompetisi yang dicocokkan langsung secara matematis dengan portofolio keahlianmu. Ketahui tingkat kesiapanmu sebelum melamar.
        </p>
      </div>

      {/* Right Column: Stat Cards */}
      <div className='flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0'>
        {/* Average Match Stat Card */}
        <div
          onClick={onQuickFilterHighMatch}
          title='Klik untuk memfilter peluang dengan kecocokan tinggi'
          className='flex items-center gap-3 px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-blue-300 dark:hover:border-blue-800 transition-all cursor-pointer group'
        >
          <div className='w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/60 group-hover:scale-105 transition-transform'>
            <Zap className='w-5 h-5 fill-current' />
          </div>
          <div className='flex flex-col'>
            <div className='flex items-center gap-1.5'>
              <span className='text-lg font-extrabold text-slate-900 dark:text-white leading-tight'>
                {averageMatchScore}%
              </span>
              <span className='text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50'>
                Avg Match
              </span>
            </div>
            <span className='text-[11px] text-slate-500 dark:text-slate-400 font-medium'>
              Tingkat Kecocokan Skill
            </span>
          </div>
        </div>

        {/* Skills & Opps Count Card */}
        <div className='flex items-center gap-3 px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs'>
          <div className='w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-900/60'>
            <Award className='w-5 h-5' />
          </div>
          <div className='flex flex-col'>
            <span className='text-lg font-extrabold text-slate-900 dark:text-white leading-tight'>
              {userSkillsCount} <span className='text-xs font-semibold text-slate-500 dark:text-slate-400'>Skill</span>
            </span>
            <span className='text-[11px] text-slate-500 dark:text-slate-400 font-medium'>
              {totalOpportunities} Peluang Terbuka
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
