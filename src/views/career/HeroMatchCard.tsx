'use client'

import React from 'react'

import { Check, Sliders, Sparkles } from 'lucide-react'

import type { CareerTargetProfile } from '@/types/career'

interface HeroMatchCardProps {
  career: CareerTargetProfile
}

export default function HeroMatchCard({ career }: HeroMatchCardProps) {
  // SVG Donut calculation for 136px size
  const size = 136
  const strokeWidth = 14
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (career.readinessScore / 100) * circumference

  const compCount = career.competentCount ?? 9
  const totalCount = career.totalSkillsCount ?? 12
  const devCount = career.developCount ?? 2
  const missCount = career.missingCount ?? 1

  return (
    <div className='w-full bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-xs transition-all hover:shadow-sm'>
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 items-center'>
        
        {/* Left: Donut Chart & Legend (lg:col-span-4) */}
        <div className='lg:col-span-4 flex flex-col items-center justify-center lg:border-r lg:border-slate-100 dark:lg:border-slate-800/80 pr-0 lg:pr-6'>
          <div className='relative w-[136px] h-[136px] flex items-center justify-center'>
            <svg
              className='w-[136px] h-[136px] -rotate-90 transform'
              viewBox={`0 0 ${size} ${size}`}
            >
              {/* Background circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                className='text-slate-100 dark:text-slate-800'
                strokeWidth={strokeWidth}
                stroke='currentColor'
                fill='transparent'
              />
              {/* Blue progress arc */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                className='text-[#2563EB] transition-all duration-1000 ease-out'
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap='round'
                stroke='currentColor'
                fill='transparent'
              />
            </svg>

            {/* Donut Center */}
            <div className='absolute flex flex-col items-center justify-center text-center'>
              <span className='text-3xl font-extrabold text-slate-900 dark:text-white leading-none tracking-tight'>
                {career.readinessScore}%
              </span>
              <span className='text-[11px] font-semibold text-slate-400 dark:text-slate-500 mt-1'>
                Match Index
              </span>
            </div>
          </div>

          {/* Legend below donut */}
          <div className='flex items-center gap-4 mt-4 text-xs text-slate-600 dark:text-slate-400'>
            <span className='flex items-center gap-1.5'>
              <span className='w-2.5 h-2.5 rounded-full bg-[#2563EB]' />
              <span>Skill Dikuasai</span>
            </span>
          </div>
        </div>

        {/* Right: 3 Metric Cards + AI Insight Banner (lg:col-span-8) */}
        <div className='lg:col-span-8 flex flex-col gap-4'>
          {/* Row of 3 mini metric cards */}
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-3.5'>
            {/* Card 1: Kompeten */}
            <div className='bg-[#F8FAFC] dark:bg-slate-800/40 rounded-xl p-3.5 border border-slate-100 dark:border-slate-800/60 flex flex-col justify-between'>
              <div className='flex items-center justify-between'>
                <div className='w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center'>
                  <Check className='w-3.5 h-3.5 stroke-[2.8]' />
                </div>
                <span className='text-[10px] font-bold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase'>
                  KOMPETEN
                </span>
              </div>
              <div className='mt-2'>
                <div className='flex items-baseline gap-0.5'>
                  <span className='text-2xl font-bold text-slate-900 dark:text-white'>
                    {compCount}
                  </span>
                  <span className='text-xs text-slate-400'>
                    /{totalCount}
                  </span>
                </div>
                <p className='text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5'>
                  Skill Utama Terpenuhi
                </p>
                <p className='text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 leading-snug'>
                  Sudah memenuhi kualifikasi lowongan tier 1.
                </p>
              </div>
            </div>

            {/* Card 2: Asah Lagi */}
            <div className='bg-[#F8FAFC] dark:bg-slate-800/40 rounded-xl p-3.5 border border-slate-100 dark:border-slate-800/60 flex flex-col justify-between'>
              <div className='flex items-center justify-between'>
                <div className='w-6 h-6 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center'>
                  <Sliders className='w-3.5 h-3.5' />
                </div>
                <span className='text-[10px] font-bold text-amber-600 dark:text-amber-400 tracking-wider uppercase'>
                  ASAH LAGI
                </span>
              </div>
              <div className='mt-2'>
                <span className='text-2xl font-bold text-slate-900 dark:text-white'>
                  {devCount}
                </span>
                <p className='text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5'>
                  Perlu Ditingkatkan
                </p>
                <p className='text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 leading-snug'>
                  Cukup tambah 1 proyek terapan mini.
                </p>
              </div>
            </div>

            {/* Card 3: Kritis */}
            <div className='bg-[#F8FAFC] dark:bg-slate-800/40 rounded-xl p-3.5 border border-slate-100 dark:border-slate-800/60 flex flex-col justify-between'>
              <div className='flex items-center justify-between'>
                <div className='w-6 h-6 rounded-md bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-xs'>
                  !
                </div>
                <span className='text-[10px] font-bold text-rose-600 dark:text-rose-400 tracking-wider uppercase'>
                  KRITIS
                </span>
              </div>
              <div className='mt-2'>
                <span className='text-2xl font-bold text-slate-900 dark:text-white'>
                  {missCount}
                </span>
                <p className='text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5'>
                  Belum Terdeteksi
                </p>
                <p className='text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 leading-snug'>
                  Wajib dipelajari untuk lolos ATS scanner.
                </p>
              </div>
            </div>
          </div>

          {/* AI Career Insight Box */}
          <div className='bg-[#F8FAFC] dark:bg-slate-800/40 rounded-xl p-3.5 border border-slate-100 dark:border-slate-800/60 flex items-start gap-3'>
            <div className='w-8 h-8 rounded-xl bg-[#312E81] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs'>
              <Sparkles className='w-4 h-4 text-indigo-200' />
            </div>
            <div className='flex flex-col gap-0.5 w-full'>
              <div className='flex items-center gap-2'>
                <span className='text-xs font-bold text-slate-900 dark:text-white'>
                  Growvia AI Career Insight
                </span>
              </div>
              <p className='text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-0.5'>
                &ldquo;
                {career.aiInsight ? (
                  career.aiInsight.split(/(['"][^'"]+['"])/g).map((part, idx) => {
                    if ((part.startsWith("'") && part.endsWith("'")) || (part.startsWith('"') && part.endsWith('"'))) {
                      return (
                        <strong key={idx} className='font-bold text-slate-900 dark:text-white underline decoration-indigo-400/40 underline-offset-2'>
                          {part}
                        </strong>
                      )
                    }

                    return <span key={idx}>{part}</span>
                  })
                ) : (
                  <span>Analisis AI siap dikalibrasikan dengan target karier Anda.</span>
                )}
                &rdquo;
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
