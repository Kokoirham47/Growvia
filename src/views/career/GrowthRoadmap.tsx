'use client'

import React from 'react'
import { Sparkles, TrendingUp, ArrowRight, Layers, FileText } from 'lucide-react'
import { CareerTargetProfile } from '@/types/career'

interface GrowthRoadmapProps {
  career: CareerTargetProfile
  onGeneratePersonalized: () => void
}

export default function GrowthRoadmap({ career, onGeneratePersonalized }: GrowthRoadmapProps) {
  return (
    <div className='flex flex-col gap-4 w-full'>
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div className='flex flex-col gap-0.5'>
          <div className='inline-flex items-center gap-1.5 text-[#2563EB] dark:text-blue-400 text-xs font-bold tracking-wide'>
            <TrendingUp className='w-3.5 h-3.5' />
            <span>Rekomendasi Berbasis Data Lowongan</span>
          </div>
          <h2 className='text-xl font-bold text-slate-900 dark:text-white tracking-tight'>
            Rute Pertumbuhan 30 Hari
          </h2>
          <p className='text-xs text-slate-500 dark:text-slate-400'>
            Tiga langkah strategis terukur untuk melonjakkan skor kesiapan dari {career.readinessScore}% menjadi 92%+.
          </p>
        </div>

        {/* Action Button: Deep Blue / Navy AI Button */}
        <button
          type='button'
          onClick={onGeneratePersonalized}
          style={{ backgroundColor: '#202282' }}
          className='inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-xs sm:text-sm font-semibold hover:brightness-110 active:scale-[0.98] transition-all shadow-sm shrink-0 cursor-pointer self-start md:self-auto'
        >
          <Sparkles className='w-4 h-4 text-indigo-200' />
          <span>Buat Rencana Belajar Personalisasi AI</span>
        </button>
      </div>

      {/* 3 Step Roadmap Cards (Exact layout from screenshot) */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {/* Step 1 */}
        <div className='bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between gap-4'>
          <div className='flex flex-col gap-3'>
            <div className='flex items-center justify-between'>
              <div className='w-6 h-6 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-xs font-bold'>
                1
              </div>
              <span className='px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-700'>
                Est. 3 Hari
              </span>
            </div>

            <div>
              <h3 className='text-sm font-bold text-slate-900 dark:text-white leading-snug'>
                Selesaikan Mini Course Design Tokens
              </h3>
              <p className='text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed'>
                Pelajari mapping token warna, typography, dan spacing di Figma Tokens plugin yang sinkron dengan GitHub developer.
              </p>
            </div>
          </div>

          <div className='pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs'>
            <span className='text-[#2563EB] font-semibold inline-flex items-center gap-1.5'>
              <ArrowRight className='w-3.5 h-3.5' />
              <span>Modul 4 Jam</span>
            </span>
            <span className='font-bold text-[#16A34A]'>
              +9% Kesiapan
            </span>
          </div>
        </div>

        {/* Step 2 */}
        <div className='bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between gap-4'>
          <div className='flex flex-col gap-3'>
            <div className='flex items-center justify-between'>
              <div className='w-6 h-6 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-xs font-bold'>
                2
              </div>
              <span className='px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-700'>
                Est. 5 Hari
              </span>
            </div>

            <div>
              <h3 className='text-sm font-bold text-slate-900 dark:text-white leading-snug'>
                Update Studi Kasus Portofolio
              </h3>
              <p className='text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed'>
                Tambahkan metrik bisnis nyata pada proyek magang Telkom (misal: rasio konversi pendaftaran naik 24% pasca-redesign).
              </p>
            </div>
          </div>

          <div className='pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs'>
            <span className='text-[#2563EB] font-semibold inline-flex items-center gap-1.5'>
              <ArrowRight className='w-3.5 h-3.5' />
              <span>Panduan Portofolio AI</span>
            </span>
            <span className='font-bold text-[#16A34A]'>
              +5% Kesiapan
            </span>
          </div>
        </div>

        {/* Step 3 */}
        <div className='bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between gap-4'>
          <div className='flex flex-col gap-3'>
            <div className='flex items-center justify-between'>
              <div className='w-6 h-6 rounded-full bg-[#202282] text-white flex items-center justify-center text-xs font-bold'>
                3
              </div>
              <span className='px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] border border-blue-100 dark:border-blue-900/40'>
                Target Akhir
              </span>
            </div>

            <div>
              <h3 className='text-sm font-bold text-[#202282] dark:text-blue-300 leading-snug'>
                Kirim Lamaran ke 5 Partner Startup
              </h3>
              <p className='text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed'>
                Gunakan fitur Fast-Track Apply Growvia untuk lowongan dengan rekomendasi kecocokan auto-match 85%+.
              </p>
            </div>
          </div>

          <div className='pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs'>
            <span className='text-slate-600 dark:text-slate-400 font-medium inline-flex items-center gap-1.5'>
              <FileText className='w-3.5 h-3.5 text-slate-400' />
              <span>Ekosistem Lowongan</span>
            </span>
            <span className='font-bold text-[#202282] dark:text-blue-400'>
              Siap Kerja 100%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
