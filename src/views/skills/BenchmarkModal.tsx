'use client'

import React from 'react'
import { X, Trophy, BarChart3, TrendingUp, CheckCircle2, Award, Users } from 'lucide-react'

interface BenchmarkModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function BenchmarkModal({ isOpen, onClose }: BenchmarkModalProps) {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200'>
      <div className='bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col gap-5'>
        {/* Header */}
        <div className='flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800'>
          <div className='flex items-center gap-2.5'>
            <div className='w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-[#6366F1]'>
              <Trophy className='w-5 h-5' />
            </div>
            <div>
              <h3 className='font-bold text-lg text-slate-900 dark:text-white tracking-tight'>
                Benchmark Distribusi Kompetensi
              </h3>
              <p className='text-xs text-slate-500'>
                Komparasi profil skill terhadap 1.250+ talenta UI/UX & Product Design
              </p>
            </div>
          </div>

          <button
            type='button'
            onClick={onClose}
            className='p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Content */}
        <div className='flex flex-col gap-4 text-xs sm:text-sm'>
          {/* Top Highlight Card */}
          <div className='p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200/80 dark:border-blue-900/60 flex items-center gap-4'>
            <div className='w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-[#2563EB] shrink-0 font-bold text-lg'>
              Top 10%
            </div>
            <div>
              <h4 className='font-bold text-slate-900 dark:text-white text-sm'>
                Kuadran Unggul Kompetitif
              </h4>
              <p className='text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed'>
                Kombinasi <strong className='text-[#1E3A8A] dark:text-blue-300'>UI/UX Design (92%)</strong> dan{' '}
                <strong className='text-[#1E3A8A] dark:text-blue-300'>Leadership (90%)</strong> menempatkanmu pada persentil 91.4% lulusan.
              </p>
            </div>
          </div>

          {/* Benchmark Comparison Bars */}
          <div className='space-y-3.5 pt-1'>
            {[
              { label: 'UI/UX Design & Prototyping', userScore: 92, benchmarkScore: 68 },
              { label: 'Leadership & Team Steering', userScore: 90, benchmarkScore: 62 },
              { label: 'Event Planning & Operations', userScore: 88, benchmarkScore: 71 },
              { label: 'Project Management (Agile)', userScore: 78, benchmarkScore: 74 },
              { label: 'Frontend & Technical (React)', userScore: 75, benchmarkScore: 59 }
            ].map(item => (
              <div key={item.label} className='space-y-1.5'>
                <div className='flex items-center justify-between text-xs font-semibold'>
                  <span className='text-slate-800 dark:text-slate-200'>{item.label}</span>
                  <div className='flex items-center gap-3 text-[11px]'>
                    <span className='text-[#2563EB]'>Kamu: {item.userScore}%</span>
                    <span className='text-slate-400'>Rata-rata: {item.benchmarkScore}%</span>
                  </div>
                </div>

                <div className='h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative'>
                  {/* Benchmark indicator */}
                  <div
                    className='absolute top-0 bottom-0 w-0.5 bg-slate-400 z-10'
                    style={{ left: `${item.benchmarkScore}%` }}
                    title={`Rata-rata: ${item.benchmarkScore}%`}
                  />
                  {/* User score bar */}
                  <div
                    className='h-full bg-gradient-to-r from-[#2563EB] to-[#6366F1] rounded-full transition-all duration-700'
                    style={{ width: `${item.userScore}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className='flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-500'>
            <div className='flex items-center gap-2'>
              <span className='w-3 h-3 rounded-full bg-gradient-to-r from-[#2563EB] to-[#6366F1]' />
              <span>Skor Portofolio Kamu</span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='w-1.5 h-3 bg-slate-400 rounded-xs' />
              <span>Garis Median Industri (Benchmark)</span>
            </div>
          </div>
        </div>

        {/* Action */}
        <div className='flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800'>
          <button
            type='button'
            onClick={onClose}
            className='px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm cursor-pointer'
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}
