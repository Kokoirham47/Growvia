'use client'

import React from 'react'
import { Sparkles, Building2, RefreshCw, Briefcase, ChevronRight, CheckCircle2 } from 'lucide-react'
import { CareerTargetProfile } from '@/types/career'

interface CareerTargetCardProps {
  career: CareerTargetProfile
  onOpenChangeTarget: () => void
  onOpenReanalyze: () => void
  isReanalyzing?: boolean
}

export default function CareerTargetCard({
  career,
  onOpenChangeTarget,
  onOpenReanalyze,
  isReanalyzing = false
}: CareerTargetCardProps) {
  // Circular gauge calculation for 80px size
  const size = 80
  const strokeWidth = 7
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (career.readinessScore / 100) * circumference

  return (
    <div className='w-full bg-white dark:bg-slate-900 rounded-[16px] p-6 shadow-sm border border-slate-100 dark:border-slate-800/80 transition-all hover:shadow-md'>
      <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-6'>
        
        {/* Left Column: Career title & company type */}
        <div className='flex flex-col gap-2 min-w-[240px]'>
          <div className='flex items-center gap-2'>
            <span className='inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/40'>
              <span className='w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse' />
              Target Karier Aktif
            </span>
            <span className='text-xs text-slate-400 dark:text-slate-500'>
              • Level Junior / Entry
            </span>
          </div>

          <div className='flex flex-col'>
            <h2 className='text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight'>
              {career.title}
            </h2>
            <div className='flex items-center gap-2 mt-1.5 text-slate-600 dark:text-slate-400 text-sm'>
              <Building2 className='w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0' />
              <span className='font-medium text-slate-700 dark:text-slate-300'>{career.companyType}</span>
              <span className='text-slate-300 dark:text-slate-700'>•</span>
              <span className='text-xs text-slate-500 dark:text-slate-400'>{career.salaryRange}</span>
            </div>
          </div>

          <p className='text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5'>
            {career.summary}
          </p>
        </div>

        {/* Middle Column: Circular gauge (80px, green arc) + "Developing" amber badge below */}
        <div className='flex flex-col items-center justify-center gap-2 py-1 px-4 lg:border-x lg:border-slate-100 dark:lg:border-slate-800/80 shrink-0'>
          <div className='relative w-[80px] h-[80px] flex items-center justify-center'>
            <svg
              className='w-[80px] h-[80px] -rotate-90 transform'
              viewBox={`0 0 ${size} ${size}`}
            >
              {/* Background circle track */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                className='text-slate-100 dark:text-slate-800'
                strokeWidth={strokeWidth}
                stroke='currentColor'
                fill='transparent'
              />
              {/* Green arc progress */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                className='text-[#16A34A] transition-all duration-1000 ease-out'
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap='round'
                stroke='currentColor'
                fill='transparent'
              />
            </svg>

            {/* Gauge Center Text */}
            <div className='absolute flex flex-col items-center justify-center text-center'>
              <span className='text-lg sm:text-xl font-bold text-slate-800 dark:text-white leading-none tracking-tight'>
                {career.readinessScore}%
              </span>
              <span className='text-[9px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5'>
                Readiness
              </span>
            </div>
          </div>

          {/* Label below: Amber badge "Developing" */}
          <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 shadow-xs'>
            <span className='w-1.5 h-1.5 rounded-full bg-amber-500' />
            <span>{career.readinessStatus}</span>
          </div>
        </div>

        {/* Right Column: Outline button + AI button (#6366F1) */}
        <div className='flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center gap-3 shrink-0'>
          {/* Outline Button: Ganti Target Karier */}
          <button
            type='button'
            onClick={onOpenChangeTarget}
            className='inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-600 active:scale-[0.98] transition-all shadow-xs cursor-pointer'
          >
            <Briefcase className='w-4 h-4 text-slate-500 dark:text-slate-400' />
            <span>Ganti Target Karier</span>
          </button>

          {/* AI Button: Analisis Ulang (#6366F1) */}
          <button
            type='button'
            onClick={onOpenReanalyze}
            disabled={isReanalyzing}
            style={{ backgroundColor: '#6366F1' }}
            className='inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:brightness-110 active:scale-[0.98] transition-all shadow-md shadow-indigo-500/25 disabled:opacity-75 cursor-pointer'
          >
            {isReanalyzing ? (
              <RefreshCw className='w-4 h-4 animate-spin' />
            ) : (
              <Sparkles className='w-4 h-4 text-indigo-100' />
            )}
            <span>{isReanalyzing ? 'Menganalisis...' : 'Analisis Ulang'}</span>
          </button>
        </div>

      </div>
    </div>
  )
}
