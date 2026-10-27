'use client'

import React, { useState, useEffect } from 'react'

import { Sparkles, CheckCircle2, Loader2 } from 'lucide-react'

const PIPELINE_STEPS = [
  'Mengekstraksi kata kunci kompetensi & metrik narasi...',
  'Menstandarisasi nama ke taksonomi industri terstruktur...',
  'Mengklasifikasikan domain (Hard, Soft, Technical, Leadership)...',
  'Menghitung skor keyakinan & relevansi bukti empiris...'
]

export default function ExtractionLoadingSkeleton() {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev < PIPELINE_STEPS.length - 1 ? prev + 1 : prev))
    }, 1200)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className='py-8 px-4 sm:px-6 rounded-2xl font-poppins bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/50 dark:from-slate-900/60 dark:via-[#0F172A] dark:to-slate-900/60 border border-blue-200/60 dark:border-blue-900/40 text-center space-y-6'>
      <div className='relative w-16 h-16 mx-auto'>
        <div className='absolute inset-0 rounded-2xl bg-blue-500/20 dark:bg-blue-600/30 blur-xl animate-pulse' />
        <div className='relative w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 border border-blue-200 dark:border-slate-700 flex items-center justify-center shadow-md'>
          <Sparkles className='w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin-slow' />
        </div>
      </div>

      <div className='space-y-1.5 max-w-md mx-auto'>
        <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300'>
          <Loader2 className='w-3.5 h-3.5 animate-spin' />
          <span>Pipeline AI Sedang Berjalan</span>
        </div>
        <h3 className='text-base sm:text-lg font-extrabold text-slate-900 dark:text-white'>
          Menganalisis Bukti Pengalaman Anda
        </h3>
        <p className='text-xs sm:text-sm text-slate-500 dark:text-slate-400'>
          AI Growvia sedang membedah narasi kegiatan Anda untuk mendeteksi keahlian terukur secara otomatis.
        </p>
      </div>

      {/* Steps progress list */}
      <div className='max-w-md mx-auto space-y-2 text-left'>
        {PIPELINE_STEPS.map((step, idx) => {
          const isDone = idx < currentStep
          const isCurrent = idx === currentStep

          return (
            <div
              key={idx}
              className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all text-xs font-semibold ${
                isDone
                  ? 'bg-emerald-50/60 border-emerald-200/60 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-900/40 dark:text-emerald-300'
                  : isCurrent
                  ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/50 dark:border-blue-900/60 dark:text-blue-300 shadow-2xs'
                  : 'bg-white/60 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-600'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className='w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0' />
              ) : isCurrent ? (
                <Loader2 className='w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin shrink-0' />
              ) : (
                <div className='w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 shrink-0' />
              )}
              <span className='truncate'>{step}</span>
            </div>
          )
        })}
      </div>

      {/* Shimmer placeholders */}
      <div className='space-y-2.5 max-w-lg mx-auto pt-2'>
        {[1, 2, 3].map(n => (
          <div
            key={n}
            className='h-14 rounded-xl bg-slate-200/60 dark:bg-slate-800/60 animate-pulse'
          />
        ))}
      </div>
    </div>
  )
}
