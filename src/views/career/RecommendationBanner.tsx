'use client'

import React from 'react'
import { Sparkles, ArrowRight, BookOpen, ExternalLink, Zap } from 'lucide-react'

interface RecommendationBannerProps {
  onOpenResources: () => void
  resourceCount?: number
}

export default function RecommendationBanner({
  onOpenResources,
  resourceCount = 5
}: RecommendationBannerProps) {
  return (
    <div
      style={{ backgroundColor: '#EEF2FF' }}
      className='w-full rounded-[16px] p-5 border border-indigo-100/80 dark:border-indigo-900/50 dark:!bg-indigo-950/40 shadow-sm transition-all hover:shadow-md'
    >
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        {/* Left: Icon Sparkles + Recommendation Text */}
        <div className='flex items-start sm:items-center gap-3.5'>
          <div className='w-10 h-10 rounded-xl bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/30'>
            <Sparkles className='w-5 h-5 text-indigo-100 animate-pulse' />
          </div>

          <div className='flex flex-col gap-0.5'>
            <div className='flex items-center gap-2'>
              <span className='px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300'>
                AI Learning Match
              </span>
              <span className='text-xs text-indigo-500 dark:text-indigo-400 font-medium hidden sm:inline'>
                • Kurasi Personal
              </span>
            </div>

            <h4 className='text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug tracking-tight'>
              Growvia merekomendasikan {resourceCount} resource untuk mengisi gap kamu
            </h4>

            <p className='text-xs text-slate-600 dark:text-slate-300 leading-relaxed'>
              Fokus pada <strong className='font-semibold text-indigo-700 dark:text-indigo-300'>Model Deployment</strong>, <strong className='font-semibold text-indigo-700 dark:text-indigo-300'>Cloud Computing</strong>, dan <strong className='font-semibold text-indigo-700 dark:text-indigo-300'>MLOps</strong> untuk menaikkan kesiapan dari 68% ke 92%.
            </p>
          </div>
        </div>

        {/* Right: Indigo Button "Lihat Rekomendasi Belajar →" */}
        <div className='shrink-0 self-end md:self-center'>
          <button
            type='button'
            onClick={onOpenResources}
            className='inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-sm font-semibold transition-all shadow-md shadow-indigo-600/25 hover:shadow-indigo-600/40 cursor-pointer whitespace-nowrap'
          >
            <span>Lihat Rekomendasi Belajar</span>
            <ArrowRight className='w-4 h-4 transition-transform group-hover:translate-x-1' />
          </button>
        </div>
      </div>
    </div>
  )
}
