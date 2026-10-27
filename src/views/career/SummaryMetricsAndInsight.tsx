'use client'

import React from 'react'

import { CheckCircle2, Sliders, AlertTriangle, Brain } from 'lucide-react'

import type { CareerTargetProfile } from '@/types/career'

interface SummaryMetricsAndInsightProps {
  career: CareerTargetProfile
}

export default function SummaryMetricsAndInsight({ career }: SummaryMetricsAndInsightProps) {
  const strongCount = career.strongSkills.length
  const developCount = career.developSkills.length
  const missingCount = career.missingSkills.length
  const totalCount = strongCount + developCount + missingCount

  return (
    <div className='flex flex-col gap-4 w-full'>
      {/* 3 Metric Summary Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>

        {/* 1. Kompeten */}
        <div className='bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[#16A34A] flex items-center justify-center shrink-0'>
              <CheckCircle2 className='w-5 h-5' />
            </div>
            <div>
              <div className='flex items-baseline gap-1'>
                <span className='text-xl font-bold text-slate-900 dark:text-white'>
                  {strongCount}
                </span>
                <span className='text-xs text-slate-400 font-medium'>
                  /{totalCount}
                </span>
              </div>
              <p className='text-xs font-semibold text-slate-700 dark:text-slate-300'>
                Skill Utama Terpenuhi
              </p>
              <p className='text-[11px] text-slate-400 dark:text-slate-500 mt-0.5'>
                Memenuhi syarat tier 1 tech.
              </p>
            </div>
          </div>
          <span className='px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/50 text-[#16A34A] border border-emerald-200/60 dark:border-emerald-900/40'>
            Kompeten
          </span>
        </div>

        {/* 2. Asah Lagi */}
        <div className='bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-[#F59E0B] flex items-center justify-center shrink-0'>
              <Sliders className='w-5 h-5' />
            </div>
            <div>
              <div className='flex items-baseline gap-1'>
                <span className='text-xl font-bold text-slate-900 dark:text-white'>
                  {developCount}
                </span>
              </div>
              <p className='text-xs font-semibold text-slate-700 dark:text-slate-300'>
                Perlu Ditingkatkan
              </p>
              <p className='text-[11px] text-slate-400 dark:text-slate-500 mt-0.5'>
                Cukup tambah 1 proyek mini.
              </p>
            </div>
          </div>
          <span className='px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/50 text-[#F59E0B] border border-amber-200/60 dark:border-amber-900/40'>
            Asah Lagi
          </span>
        </div>

        {/* 3. Kritis / Belum Terdeteksi */}
        <div className='bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-[#DC2626] flex items-center justify-center shrink-0'>
              <AlertTriangle className='w-5 h-5' />
            </div>
            <div>
              <div className='flex items-baseline gap-1'>
                <span className='text-xl font-bold text-slate-900 dark:text-white'>
                  {missingCount}
                </span>
              </div>
              <p className='text-xs font-semibold text-slate-700 dark:text-slate-300'>
                Belum Terdeteksi
              </p>
              <p className='text-[11px] text-slate-400 dark:text-slate-500 mt-0.5'>
                Wajib untuk lolos ATS scanner.
              </p>
            </div>
          </div>
          <span className='px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-50 dark:bg-rose-950/50 text-[#DC2626] border border-rose-200/60 dark:border-rose-900/40'>
            Kritis
          </span>
        </div>

      </div>

      {/* AI Career Insight Box */}
      <div className='bg-gradient-to-r from-indigo-50/90 via-purple-50/50 to-blue-50/80 dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-blue-950/20 rounded-2xl p-4 border border-indigo-100 dark:border-indigo-900/50 flex flex-col sm:flex-row items-start gap-3.5 shadow-xs'>
        <div className='w-9 h-9 rounded-xl bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center shrink-0 shadow-sm'>
          <Brain className='w-5 h-5 text-indigo-100' />
        </div>
        <div className='flex flex-col gap-1'>
          <div className='flex items-center gap-2'>
            <span className='text-xs font-bold text-indigo-950 dark:text-indigo-200 tracking-tight'>
              Growvia AI Career Insight
            </span>
            <span className='px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'>
              Analisis Langsung AI
            </span>
          </div>
          <p className='text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed'>
            &ldquo;{career.aiInsight}&rdquo;
          </p>
        </div>
      </div>
    </div>
  )
}
