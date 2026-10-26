'use client'

import React, { useState, useEffect } from 'react'
import { Sparkles, Check, RefreshCw, X, ShieldCheck, Zap } from 'lucide-react'

interface ReanalyzeModalProps {
  isOpen: boolean
  careerTitle: string
  onClose: () => void
  onComplete: () => void
}

export default function ReanalyzeModal({
  isOpen,
  careerTitle,
  onClose,
  onComplete
}: ReanalyzeModalProps) {
  const [step, setStep] = useState(0)

  const steps = [
    { title: 'Memindai 6 Portofolio & Dokumen', desc: 'Membaca repositori GitHub, proyek akademik, dan sertifikasi terverifikasi' },
    { title: 'Benchmark 140+ Lowongan Tech Industry', desc: 'Sinkronisasi standar requirements lowongan AI Engineer terverifikasi' },
    { title: 'Mengukur Bobot Gap Kompetensi & ATS', desc: 'Kalkulasi kesiapan Model Deployment, Cloud Computing, dan MLOps' },
    { title: 'Analisis Selesai', desc: 'Data gap skill dan skor kesiapan telah diperbarui' }
  ]

  useEffect(() => {
    if (!isOpen) {
      setStep(0)
      return
    }

    const t1 = setTimeout(() => setStep(1), 900)
    const t2 = setTimeout(() => setStep(2), 1900)
    const t3 = setTimeout(() => setStep(3), 2800)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [isOpen])

  if (!isOpen) return null

  const isFinished = step === 3

  return (
    <div className='fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200'>
      <div className='bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col'>
        {/* Header */}
        <div className='p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div
              style={{ backgroundColor: '#6366F1' }}
              className='w-9 h-9 rounded-xl text-white flex items-center justify-center shrink-0 shadow-sm'
            >
              <Sparkles className='w-5 h-5 text-indigo-100' />
            </div>
            <div>
              <h3 className='text-base font-bold text-slate-900 dark:text-white'>
                Analisis Ulang AI
              </h3>
              <p className='text-xs text-slate-500 dark:text-slate-400'>
                Posisi: <strong className='text-slate-700 dark:text-slate-300'>{careerTitle}</strong>
              </p>
            </div>
          </div>
          <button
            type='button'
            onClick={onClose}
            className='p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Stepper Body */}
        <div className='p-6 flex flex-col gap-4'>
          {steps.map((s, idx) => {
            const isDone = idx < step || isFinished
            const isCurrent = idx === step && !isFinished

            return (
              <div key={idx} className='flex items-start gap-3.5'>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 transition-all ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-indigo-600 text-white animate-pulse'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  {isDone ? (
                    <Check className='w-3.5 h-3.5 stroke-[3]' />
                  ) : isCurrent ? (
                    <RefreshCw className='w-3 h-3 animate-spin' />
                  ) : (
                    idx + 1
                  )}
                </div>

                <div className='flex flex-col'>
                  <span
                    className={`text-xs sm:text-sm font-semibold ${
                      isDone
                        ? 'text-slate-900 dark:text-white'
                        : isCurrent
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {s.title}
                  </span>
                  <span className='text-[11px] text-slate-500 dark:text-slate-400 leading-normal'>
                    {s.desc}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className='p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-end gap-3'>
          <button
            type='button'
            disabled={!isFinished}
            onClick={() => {
              onComplete()
              onClose()
            }}
            className='px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white disabled:opacity-50 transition-all shadow-md shadow-indigo-600/25 cursor-pointer'
          >
            {isFinished ? 'Terapkan Hasil Analisis' : 'Sedang Memproses...'}
          </button>
        </div>
      </div>
    </div>
  )
}
