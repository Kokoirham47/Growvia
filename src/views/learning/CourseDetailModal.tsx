'use client'

import React from 'react'

import {
  X,
  Clock,
  BarChart2,
  Star,
  ExternalLink,
  Award,
  CheckCircle2,
  Briefcase
} from 'lucide-react'

import type { LearningCardItem } from '@/types/learning'

interface CourseDetailModalProps {
  item: LearningCardItem | null
  isOpen: boolean
  onClose: () => void
  onEnroll: (item: LearningCardItem) => void
}

export default function CourseDetailModal({
  item,
  isOpen,
  onClose,
  onEnroll
}: CourseDetailModalProps) {
  if (!isOpen || !item) return null

  return (
    <div className='fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200'>
      <div className='bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]'>
        {/* Header */}
        <div className='p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-gradient-to-r from-indigo-50/50 via-white to-white dark:from-indigo-950/20 dark:to-slate-900'>
          <div className='flex flex-col gap-2 pr-4'>
            <div className='flex flex-wrap items-center gap-2'>
              <span className='px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300'>
                {item.skillTag}
              </span>
              <span className='px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'>
                {item.platform}
              </span>
              <span className='px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'>
                {item.matchPercent}% Match
              </span>
            </div>

            <h3 className='text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug'>
              {item.title}
            </h3>

            {item.instructor && (
              <p className='text-xs text-slate-500 dark:text-slate-400'>
                Instruktur: <span className='font-medium text-slate-700 dark:text-slate-300'>{item.instructor}</span>
              </p>
            )}
          </div>

          <button
            type='button'
            onClick={onClose}
            className='p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className='p-5 sm:p-6 overflow-y-auto space-y-6'>
          {/* Metadata badges row */}
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
            <div className='p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col gap-1'>
              <div className='flex items-center gap-1.5 text-slate-400 text-xs'>
                <Clock className='w-3.5 h-3.5' />
                <span>Durasi</span>
              </div>
              <span className='text-xs sm:text-sm font-bold text-slate-900 dark:text-white'>{item.duration}</span>
            </div>

            <div className='p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col gap-1'>
              <div className='flex items-center gap-1.5 text-slate-400 text-xs'>
                <BarChart2 className='w-3.5 h-3.5' />
                <span>Level</span>
              </div>
              <span className='text-xs sm:text-sm font-bold text-slate-900 dark:text-white'>{item.difficulty}</span>
            </div>

            <div className='p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col gap-1'>
              <div className='flex items-center gap-1.5 text-slate-400 text-xs'>
                <Star className='w-3.5 h-3.5 text-amber-500 fill-amber-500' />
                <span>Rating</span>
              </div>
              <span className='text-xs sm:text-sm font-bold text-slate-900 dark:text-white'>
                {item.rating} {item.reviewsCount ? `(${item.reviewsCount})` : ''}
              </span>
            </div>

            <div className='p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col gap-1'>
              <div className='flex items-center gap-1.5 text-slate-400 text-xs'>
                <Award className='w-3.5 h-3.5 text-indigo-500' />
                <span>Sertifikasi</span>
              </div>
              <span className='text-xs sm:text-sm font-bold text-slate-900 dark:text-white'>
                {item.hasCertificate ? 'Terverifikasi' : 'Tidak Ada'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className='flex flex-col gap-1.5'>
            <h4 className='text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
              Deskripsi Modul
            </h4>
            <p className='text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed'>
              {item.description}
            </p>
          </div>

          {/* Syllabus Section (If available) */}
          {item.syllabus && item.syllabus.length > 0 && (
            <div className='flex flex-col gap-3'>
              <div className='flex items-center justify-between'>
                <h4 className='text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
                  Silabus & Proyek Praktis ({item.syllabus.length} Modul)
                </h4>
                {item.portfolioProjectsCount && (
                  <span className='text-xs font-semibold text-amber-600 dark:text-amber-400 inline-flex items-center gap-1'>
                    <Briefcase className='w-3 h-3' />
                    {item.portfolioProjectsCount} Proyek Portofolio Siap Kerja
                  </span>
                )}
              </div>

              <div className='space-y-3'>
                {item.syllabus.map(mod => (
                  <div
                    key={mod.moduleNumber}
                    className='p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800'
                  >
                    <div className='flex items-center justify-between mb-2'>
                      <span className='text-xs font-bold text-slate-900 dark:text-white'>
                        Modul {mod.moduleNumber}: {mod.title}
                      </span>
                      <span className='text-[11px] font-medium text-slate-500 dark:text-slate-400'>
                        {mod.duration}
                      </span>
                    </div>

                    <ul className='space-y-1'>
                      {mod.topics.map((topic, idx) => (
                        <li
                          key={idx}
                          className='flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300'
                        >
                          <CheckCircle2 className='w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0' />
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className='p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/40'>
          <button
            type='button'
            onClick={onClose}
            className='px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer'
          >
            Tutup
          </button>

          <div className='flex items-center gap-2'>
            <a
              href={item.url}
              target='_blank'
              rel='noopener noreferrer'
              onClick={() => onEnroll(item)}
              className='inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-600/25 transition-all cursor-pointer'
            >
              <span>Buka di {item.platform}</span>
              <ExternalLink className='w-4 h-4' />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
