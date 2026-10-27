'use client'

import React from 'react'

import {
  Search,
  X,
  MapPin,
  ArrowUpDown,
  Flame,
  Bookmark,
  Globe
} from 'lucide-react'

import type { OpportunityType, OpportunitiesFilterState } from '@/types/opportunities'

interface OpportunitiesFilterBarProps {
  filterState: OpportunitiesFilterState
  onSearchChange: (search: string) => void
  onTypeChange: (type: OpportunityType | 'all') => void
  onQuickFilterChange: (quick: 'all' | 'high_match' | 'saved' | 'remote') => void
  onLocationChange: (loc: string) => void
  onSortChange: (sort: 'match_desc' | 'deadline_asc' | 'newest') => void
  onResetFilters: () => void
  counts: {
    all: number
    internship: number
    full_time: number
    part_time: number
    freelance: number
    competition: number
    highMatch: number
    saved: number
  }
}

export default function OpportunitiesFilterBar({
  filterState,
  onSearchChange,
  onTypeChange,
  onQuickFilterChange,
  onLocationChange,
  onSortChange,
  onResetFilters,
  counts
}: OpportunitiesFilterBarProps) {
  const typeChips: { key: OpportunityType | 'all'; label: string; count: number }[] = [
    { key: 'all', label: 'Semua Tipe', count: counts.all },
    { key: 'internship', label: 'Magang', count: counts.internship },
    { key: 'full_time', label: 'Full-time', count: counts.full_time },
    { key: 'part_time', label: 'Part-time', count: counts.part_time },
    { key: 'freelance', label: 'Freelance', count: counts.freelance },
    { key: 'competition', label: 'Kompetisi', count: counts.competition }
  ]

  const isFiltered =
    Boolean(filterState.search) ||
    filterState.type !== 'all' ||
    filterState.quickFilter !== 'all' ||
    Boolean(filterState.location)

  return (
    <div className='flex flex-col gap-4 w-full bg-white dark:bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs backdrop-blur-md'>
      {/* Top Row: Search Input + Location Selector + Sort Selector */}
      <div className='flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full'>
        {/* Search Input */}
        <div className='relative flex-1'>
          <Search className='w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none' />
          <input
            type='text'
            value={filterState.search}
            onChange={e => onSearchChange(e.target.value)}
            placeholder='Cari posisi, perusahaan (GoTo, BCA, Traveloka...), atau skill...'
            className='w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all'
          />
          {filterState.search && (
            <button
              type='button'
              onClick={() => onSearchChange('')}
              className='absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors'
            >
              <X className='w-3.5 h-3.5' />
            </button>
          )}
        </div>

        {/* Location Dropdown */}
        <div className='relative shrink-0 sm:w-48'>
          <MapPin className='w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none' />
          <select
            value={filterState.location}
            onChange={e => onLocationChange(e.target.value)}
            className='w-full appearance-none pl-9 pr-8 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all cursor-pointer'
          >
            <option value=''>Semua Lokasi</option>
            <option value='Jakarta'>Jakarta (Jabodetabek)</option>
            <option value='Bandung'>Bandung</option>
            <option value='Surabaya'>Surabaya</option>
            <option value='Yogyakarta'>Yogyakarta</option>
            <option value='Remote'>Remote</option>
          </select>
          <div className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400'>
            ▼
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className='relative shrink-0 sm:w-52'>
          <ArrowUpDown className='w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none' />
          <select
            value={filterState.sort}
            onChange={e => onSortChange(e.target.value as any)}
            className='w-full appearance-none pl-9 pr-8 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all cursor-pointer'
          >
            <option value='match_desc'>Kecocokan Tertinggi</option>
            <option value='deadline_asc'>Tenggat Terdekat</option>
            <option value='newest'>Terbaru Diunggah</option>
          </select>
          <div className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400'>
            ▼
          </div>
        </div>
      </div>

      {/* Bottom Row: Quick Filter Pill Toggles + Type Chips */}
      <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1 border-t border-slate-100 dark:border-slate-800/70'>
        {/* Quick Filter Pill Buttons */}
        <div className='flex flex-wrap items-center gap-2'>
          <button
            type='button'
            onClick={() =>
              onQuickFilterChange(
                filterState.quickFilter === 'high_match' ? 'all' : 'high_match'
              )
            }
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterState.quickFilter === 'high_match'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/40'
            }`}
          >
            <Flame className='w-3.5 h-3.5 fill-current' />
            <span>Match Tinggi ≥70%</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                filterState.quickFilter === 'high_match'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-emerald-200/70 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200'
              }`}
            >
              {counts.highMatch}
            </span>
          </button>

          <button
            type='button'
            onClick={() =>
              onQuickFilterChange(filterState.quickFilter === 'saved' ? 'all' : 'saved')
            }
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterState.quickFilter === 'saved'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 hover:bg-amber-100 dark:hover:bg-amber-900/40'
            }`}
          >
            <Bookmark className='w-3.5 h-3.5 fill-current' />
            <span>Tersimpan</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                filterState.quickFilter === 'saved'
                  ? 'bg-amber-400 text-white'
                  : 'bg-amber-200/70 dark:bg-amber-900 text-amber-800 dark:text-amber-200'
              }`}
            >
              {counts.saved}
            </span>
          </button>

          <button
            type='button'
            onClick={() =>
              onQuickFilterChange(filterState.quickFilter === 'remote' ? 'all' : 'remote')
            }
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterState.quickFilter === 'remote'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 hover:bg-blue-100 dark:hover:bg-blue-900/40'
            }`}
          >
            <Globe className='w-3.5 h-3.5' />
            <span>Remote Saja</span>
          </button>

          {isFiltered && (
            <button
              type='button'
              onClick={onResetFilters}
              className='inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer'
            >
              <X className='w-3.5 h-3.5' />
              <span>Reset Filter</span>
            </button>
          )}
        </div>

        {/* Opportunity Type Tabs */}
        <div className='flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar'>
          {typeChips.map(chip => {
            const isActive = filterState.type === chip.key

            
return (
              <button
                key={chip.key}
                type='button'
                onClick={() => onTypeChange(chip.key)}
                className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-slate-750 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{chip.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? 'bg-slate-700 dark:bg-slate-200 text-white dark:text-slate-900'
                      : 'bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {chip.count}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
