'use client'

import React from 'react'

import Link from 'next/link'

import { TrendingUp, CheckSquare, ChevronRight } from 'lucide-react'

interface ImpactSimulationBannerProps {
  currentScore?: number
  potentialScore?: number
  improvement?: number
  targetScore?: number
  moduleCount?: number
}

export default function ImpactSimulationBanner({
  currentScore = 68,
  potentialScore = 89,
  improvement = 21,
  targetScore = 80,
  moduleCount = 4
}: ImpactSimulationBannerProps) {
  return (
    <div className='flex flex-col gap-4 w-full pt-3'>
      {/* 1. Main Impact Simulation Card */}
      <div className='w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs'>
        <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-6'>
          {/* Left: Icon + Simulation Headings */}
          <div className='flex items-start gap-4'>
            <div className='w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/50 shadow-2xs'>
              <TrendingUp className='w-5 h-5' />
            </div>

            <div className='flex flex-col gap-1'>
              <span className='text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400'>
                SIMULASI DAMPAK BELAJAR
              </span>

              <h3 className='text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight'>
                Potensi AI Readiness Score: {currentScore}% → {potentialScore}%
              </h3>

              <p className='text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed'>
                Selesaikan {moduleCount} modul rekomendasi ini untuk melompat ke tier kandidat yang siap kerja ({potentialScore}%).
              </p>
            </div>
          </div>

          {/* Right: Progress Leap Bar */}
          <div className='lg:w-80 shrink-0 flex flex-col gap-2'>
            <div className='flex items-center justify-between text-xs font-semibold'>
              <span className='text-slate-600 dark:text-slate-300'>Peningkatan Match</span>
              <span className='text-blue-600 dark:text-blue-400 font-bold'>+{improvement}%</span>
            </div>

            {/* Custom Multi-stage Progress Bar */}
            <div className='relative w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden'>
              {/* Baseline Current Score (68%) */}
              <div
                className='absolute top-0 bottom-0 left-0 bg-slate-400 dark:bg-slate-600 rounded-l-full'
                style={{ width: `${currentScore}%` }}
              />
              {/* Growth Potential (+21% to 89%) */}
              <div
                className='absolute top-0 bottom-0 bg-blue-600 dark:bg-blue-500 rounded-r-full'
                style={{ left: `${currentScore}%`, width: `${potentialScore - currentScore}%` }}
              />
            </div>

            {/* Target Marker Label */}
            <div className='flex items-center justify-end text-[11px] text-slate-500 dark:text-slate-400'>
              <span>Target minimum magang: {targetScore}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Secondary Sync Notice Bar */}
      <div className='w-full rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 p-4 px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 rounded-lg bg-blue-100/80 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0'>
            <CheckSquare className='w-4 h-4' />
          </div>
          <p className='text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 leading-snug'>
            Menyelesaikan modul ini akan otomatis memperbarui skor AI Readiness dan memperkaya portofolio kamu di Dashboard utama.
          </p>
        </div>

        <Link
          href='/career'
          className='inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 whitespace-nowrap self-end sm:self-center transition-colors'
        >
          <span>Lihat Matriks Gap</span>
          <ChevronRight className='w-3.5 h-3.5' />
        </Link>
      </div>
    </div>
  )
}
