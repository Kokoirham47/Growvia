'use client'

import React from 'react'

import { ChevronDown, SlidersHorizontal } from 'lucide-react'

import type { LearningCategory, DifficultyLevel, SortOption } from '@/types/learning'

interface LearningFilterBarProps {
  selectedCategory: LearningCategory
  onSelectCategory: (cat: LearningCategory) => void
  selectedDifficulty: DifficultyLevel
  onSelectDifficulty: (diff: DifficultyLevel) => void
  selectedSort: SortOption
  onSelectSort: (sort: SortOption) => void
  counts: {
    semua: number
    course: number
    artikel: number
    video: number
    bootcamp: number
  }
}

export default function LearningFilterBar({
  selectedCategory,
  onSelectCategory,
  selectedDifficulty,
  onSelectDifficulty,
  selectedSort,
  onSelectSort,
  counts
}: LearningFilterBarProps) {
  const categoryChips: { key: LearningCategory; label: string; count: number }[] = [
    { key: 'semua', label: 'Semua', count: counts.semua },
    { key: 'course', label: 'Course', count: counts.course },
    { key: 'artikel', label: 'Artikel', count: counts.artikel },
    { key: 'video', label: 'Video', count: counts.video },
    { key: 'bootcamp', label: 'Bootcamp', count: counts.bootcamp }
  ]

  return (
    <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-3 w-full'>
      {/* Category Chips: Horizontal Scroll */}
      <div className='flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar'>
        {categoryChips.map(chip => {
          const isActive = selectedCategory === chip.key

          
return (
            <button
              key={chip.key}
              type='button'
              onClick={() => onSelectCategory(chip.key)}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span>{chip.label}</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-blue-500/60 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                {chip.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Right Controls: Difficulty Dropdown + Sort Dropdown */}
      <div className='flex items-center gap-2.5 shrink-0 self-stretch md:self-auto'>
        {/* Difficulty Dropdown */}
        <div className='relative flex-1 md:flex-initial'>
          <select
            value={selectedDifficulty}
            onChange={e => onSelectDifficulty(e.target.value as DifficultyLevel)}
            className='w-full appearance-none px-3.5 py-2 pr-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer'
          >
            <option value='all'>Semua Level</option>
            <option value='Beginner'>Beginner</option>
            <option value='Intermediate'>Intermediate</option>
            <option value='Advanced'>Advanced</option>
          </select>
          <ChevronDown className='w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none' />
        </div>

        {/* Sort Dropdown */}
        <div className='relative flex-1 md:flex-initial'>
          <select
            value={selectedSort}
            onChange={e => onSelectSort(e.target.value as SortOption)}
            className='w-full appearance-none px-3.5 py-2 pr-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer'
          >
            <option value='match'>Kesesuaian AI Tertinggi</option>
            <option value='rating'>Rating Tertinggi</option>
            <option value='duration'>Durasi Tercepat</option>
          </select>
          <SlidersHorizontal className='w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none' />
        </div>
      </div>
    </div>
  )
}
