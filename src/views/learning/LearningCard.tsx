'use client'

import React from 'react'

import {
  Clock,
  BarChart2,
  Star,
  CheckCircle2,
  Bookmark,
  ExternalLink
} from 'lucide-react'

import type { LearningCardItem } from '@/types/learning'

interface LearningCardProps {
  item: LearningCardItem
  isBookmarked: boolean
  onToggleBookmark: (id: string) => void
  onStartLearning: (item: LearningCardItem) => void
}

export default function LearningCard({
  item,
  isBookmarked,
  onToggleBookmark,
  onStartLearning
}: LearningCardProps) {
  return (
    <div className='flex flex-col justify-between w-full rounded-[16px] p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/90 shadow-sm hover:shadow-md transition-all duration-200'>
      {/* Top Section */}
      <div className='flex flex-col gap-3.5'>
        {/* Row 1: Skill Tag (Left) + Platform Badge (Right) */}
        <div className='flex items-center justify-between gap-2'>
          {/* Skill Tag: Indigo Pill */}
          <span className='px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100/80 dark:border-indigo-900/40'>
            {item.skillTag}
          </span>

          {/* Platform Badge: Grey Outline Pill */}
          <span className='px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-50/80 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'>
            {item.platform}
          </span>
        </div>

        {/* Title (H4 Bold) */}
        <h4 className='text-base font-bold text-slate-900 dark:text-white leading-snug tracking-tight hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2'>
          {item.title}
        </h4>

        {/* Metadata Row: Duration · Level · Rating */}
        <div className='flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400'>
          <div className='inline-flex items-center gap-1.5'>
            <Clock className='w-3.5 h-3.5 text-slate-400' />
            <span>{item.duration}</span>
          </div>

          <span className='text-slate-300 dark:text-slate-700'>•</span>

          <div className='inline-flex items-center gap-1.5'>
            <BarChart2 className='w-3.5 h-3.5 text-slate-400' />
            <span>{item.difficulty}</span>
          </div>

          <span className='text-slate-300 dark:text-slate-700'>•</span>

          <div className='inline-flex items-center gap-1.5'>
            <Star className='w-3.5 h-3.5 text-amber-500 fill-amber-500' />
            <span className='font-bold text-slate-900 dark:text-white'>{item.rating}</span>
          </div>
        </div>

        {/* Description: 2-line excerpt */}
        <p className='text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed'>
          {item.description}
        </p>

        {/* Match with target career pill (Matches Mockup) */}
        <div className='pt-0.5'>
          <div className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60'>
            <CheckCircle2 className='w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400' />
            <span>{item.matchPercent}% Match dengan target karier</span>
          </div>
        </div>
      </div>

      {/* Footer Row: "Simpan" Button (Left) + "Mulai Belajar →" Button (Right) */}
      <div className='flex items-center justify-between gap-3 pt-5 mt-4 border-t border-slate-100 dark:border-slate-800/80'>
        {/* Left: Simpan text/button with star or bookmark */}
        <button
          type='button'
          onClick={() => onToggleBookmark(item.id)}
          className={`inline-flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer ${
            isBookmarked
              ? 'text-amber-600 dark:text-amber-400'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Bookmark
            className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`}
          />
          <span>{isBookmarked ? 'Tersimpan' : 'Simpan'}</span>
        </button>

        {/* Right: Akses Materi Primary Button */}
        <button
          type='button'
          onClick={() => onStartLearning(item)}
          className='inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-semibold transition-all shadow-xs hover:shadow-sm cursor-pointer'
        >
          <span>Akses Materi</span>
          <ExternalLink className='w-3.5 h-3.5' />
        </button>
      </div>
    </div>
  )
}
