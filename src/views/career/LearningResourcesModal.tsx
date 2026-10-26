'use client'

import React, { useState, useMemo } from 'react'

import {
  X,
  Sparkles,
  BookOpen,
  Clock,
  Star,
  ExternalLink,
  Bookmark,
  Search
} from 'lucide-react'

import type { LearningResourceItem } from '@/types/career'

interface LearningResourcesModalProps {
  isOpen: boolean
  onClose: () => void
  initialSkillFilter?: string
  resources?: LearningResourceItem[]
}

export default function LearningResourcesModal({
  isOpen,
  onClose,
  initialSkillFilter,
  resources = []
}: LearningResourcesModalProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>(initialSkillFilter || 'all')
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const availableTags = useMemo(() => {
    const set = new Set<string>()

    resources.forEach(r => {
      if (r.targetSkill) set.add(r.targetSkill)
    })

    return ['all', ...Array.from(set)]
  }, [resources])

  if (!isOpen) return null

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setBookmarkedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const filteredResources = resources.filter(item => {
    const matchesFilter =
      selectedFilter === 'all' ||
      item.targetSkill.toLowerCase().includes(selectedFilter.toLowerCase())

    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.targetSkill.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesFilter && matchesSearch
  })

  return (
    <div className='fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200'>
      <div className='bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]'>
        {/* Modal Header */}
        <div className='p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-50/50 to-white dark:from-indigo-950/20 dark:to-slate-900'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm'>
              <Sparkles className='w-5 h-5 text-indigo-100' />
            </div>
            <div>
              <div className='flex items-center gap-2'>
                <h3 className='text-base font-bold text-slate-900 dark:text-white'>
                  {resources.length} Rekomendasi Belajar Personal
                </h3>
                <span className='px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300'>
                  Live Supabase
                </span>
              </div>
              <p className='text-xs text-slate-500 dark:text-slate-400'>
                Kurasi modul dan lab praktis untuk menutup gap kompetensi target karier Anda
              </p>
            </div>
          </div>
          <button
            type='button'
            onClick={onClose}
            className='p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Search & Filter pills */}
        <div className='p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/40'>
          <div className='relative flex-1'>
            <Search className='w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2' />
            <input
              type='text'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder='Cari judul resource atau skill...'
              className='w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500'
            />
          </div>

          <div className='flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 sm:pb-0'>
            {availableTags.map(tag => (
              <button
                key={tag}
                type='button'
                onClick={() => setSelectedFilter(tag)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all whitespace-nowrap cursor-pointer ${
                  selectedFilter === tag
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                {tag === 'all' ? `Semua (${resources.length})` : tag}
              </button>
            ))}
          </div>
        </div>

        {/* Resource Cards list */}
        <div className='p-5 overflow-y-auto flex flex-col gap-3 custom-scrollbar'>
          {filteredResources.length === 0 ? (
            <div className='py-8 text-center text-xs text-slate-500'>
              Tidak ada modul pembelajaran yang cocok dengan filter ini.
            </div>
          ) : (
            filteredResources.map(res => {
              const isBookmarked = bookmarkedIds.includes(res.id)

              return (
                <div
                  key={res.id}
                  className='p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-800/80 transition-all shadow-xs flex flex-col gap-3 group'
                >
                  <div className='flex items-start justify-between gap-3'>
                    <div className='flex items-start gap-3'>
                      <div className='w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5'>
                        <BookOpen className='w-4 h-4' />
                      </div>
                      <div className='flex flex-col'>
                        <div className='flex items-center gap-2 flex-wrap'>
                          <span className='px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50'>
                            {res.targetSkill}
                          </span>
                          <span className='text-[11px] text-slate-400 dark:text-slate-500'>
                            • {res.type}
                          </span>
                          <span className='text-[11px] font-semibold text-emerald-600 dark:text-emerald-400'>
                            {res.isFree ? 'Gratis' : 'Partner Pass'}
                          </span>
                        </div>
                        <h4 className='text-sm font-bold text-slate-900 dark:text-white mt-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors'>
                          {res.title}
                        </h4>
                        <p className='text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2'>
                          {res.description}
                        </p>
                      </div>
                    </div>

                    <button
                      type='button'
                      onClick={e => toggleBookmark(res.id, e)}
                      className={`p-1.5 rounded-lg border transition-colors shrink-0 ${
                        isBookmarked
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                          : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <Bookmark className='w-4 h-4' fill={isBookmarked ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  <div className='pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400'>
                    <div className='flex items-center gap-3'>
                      <span className='flex items-center gap-1 text-amber-500 font-semibold'>
                        <Star className='w-3.5 h-3.5 fill-amber-500' />
                        {res.rating}
                      </span>
                      <span className='flex items-center gap-1'>
                        <Clock className='w-3.5 h-3.5' />
                        {res.duration}
                      </span>
                      <span className='hidden sm:inline text-slate-400'>
                        oleh {res.provider}
                      </span>
                    </div>

                    <a
                      href={res.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:underline cursor-pointer'
                    >
                      <span>Mulai Belajar</span>
                      <ExternalLink className='w-3 h-3' />
                    </a>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className='p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50'>
          <span className='text-xs text-slate-500 dark:text-slate-400'>
            Menampilkan {filteredResources.length} modul pilihan
          </span>
          <button
            type='button'
            onClick={onClose}
            className='px-5 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white shadow-sm transition-all cursor-pointer'
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}
