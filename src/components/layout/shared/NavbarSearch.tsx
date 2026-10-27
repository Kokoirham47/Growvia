'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'

import { useRouter } from 'next/navigation'

import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import {
  Search,
  X,
  Sparkles,
  Briefcase,
  Award,
  Compass,
  BookOpen,
  LayoutDashboard,
  ArrowRight,
  Loader2,
  CornerDownLeft
} from 'lucide-react'

export interface SearchResultItem {
  id: string
  title: string
  subtitle: string
  category: 'skill' | 'opportunity' | 'experience' | 'career_role' | 'learning' | 'navigation' | string
  url: string
}

export interface SearchResponseData {
  query: string
  results: {
    skills: SearchResultItem[]
    opportunities: SearchResultItem[]
    experiences: SearchResultItem[]
    careerRoles: SearchResultItem[]
    learningResources: SearchResultItem[]
    navigation: SearchResultItem[]
  }
}

export default function NavbarSearch() {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)

  const [searchData, setSearchData] = useState<SearchResponseData['results']>({
    skills: [],
    opportunities: [],
    experiences: [],
    careerRoles: [],
    learningResources: [],
    navigation: []
  })

  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Flattened items for keyboard navigation
  const allItems: SearchResultItem[] = [
    ...searchData.skills,
    ...searchData.opportunities,
    ...searchData.experiences,
    ...searchData.careerRoles,
    ...searchData.learningResources,
    ...searchData.navigation
  ]

  const totalResultsCount = allItems.length

  // Fetch search data
  const performSearch = useCallback(async (q: string) => {
    try {
      setIsLoading(true)

      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)

      if (res.ok) {
        const json = await res.json()

        if (json.success && json.data) {
          setSearchData(json.data.results)
          setSelectedIndex(-1)
        }
      }
    } catch (err) {
      console.error('Navbar search error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Debounced search on query change
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query)
    }, 200)

    return () => clearTimeout(timer)
  }, [query, performSearch])

  // Global keyboard shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        setIsOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSelectResult = (item: SearchResultItem) => {
    setIsOpen(false)
    inputRef.current?.blur()
    router.push(item.url)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true)
      }

      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev < totalResultsCount - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : totalResultsCount - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()

      if (selectedIndex >= 0 && selectedIndex < totalResultsCount) {
        handleSelectResult(allItems[selectedIndex])
      } else if (totalResultsCount > 0) {
        handleSelectResult(allItems[0])
      } else if (query.trim()) {
        // Fallback: navigate to opportunities search
        setIsOpen(false)
        router.push(`/opportunities?search=${encodeURIComponent(query.trim())}`)
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  const handleClear = () => {
    setQuery('')
    inputRef.current?.focus()
  }

  const getItemIcon = (category: string) => {
    switch (category) {
      case 'skill':
        return (
          <div className='w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-900/60'>
            <Sparkles className='w-4 h-4' />
          </div>
        )
      case 'opportunity':
        return (
          <div className='w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/60'>
            <Briefcase className='w-4 h-4' />
          </div>
        )
      case 'experience':
        return (
          <div className='w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-900/60'>
            <Award className='w-4 h-4' />
          </div>
        )
      case 'career_role':
        return (
          <div className='w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-100 dark:border-purple-900/60'>
            <Compass className='w-4 h-4' />
          </div>
        )
      case 'learning':
        return (
          <div className='w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-100 dark:border-amber-900/60'>
            <BookOpen className='w-4 h-4' />
          </div>
        )
      case 'navigation':
      default:
        return (
          <div className='w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/70 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 border border-sky-100 dark:border-sky-900/60'>
            <LayoutDashboard className='w-4 h-4' />
          </div>
        )
    }
  }

  // Render a category section
  let globalItemIndex = 0

  const renderSection = (title: string, items: SearchResultItem[], badgeColor = 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300') => {
    if (!items || items.length === 0) return null

    return (
      <div className='space-y-1 mb-2'>
        <div className='flex items-center justify-between px-3 py-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider'>
          <span>{title}</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${badgeColor}`}>
            {items.length}
          </span>
        </div>

        <div className='space-y-0.5'>
          {items.map(item => {
            const currentIndex = globalItemIndex++
            const isSelected = selectedIndex === currentIndex

            return (
              <button
                key={item.id}
                type='button'
                onClick={() => handleSelectResult(item)}
                onMouseEnter={() => setSelectedIndex(currentIndex)}
                className={`w-full flex items-center justify-between p-2 rounded-2xl text-left transition-all cursor-pointer group ${
                  isSelected
                    ? 'bg-blue-50/80 dark:bg-blue-950/40 text-blue-900 dark:text-white border border-blue-200/60 dark:border-blue-800/60 shadow-2xs'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200 border border-transparent'
                }`}
              >
                <div className='flex items-center gap-3 min-w-0 flex-1'>
                  {getItemIcon(item.category)}
                  <div className='flex flex-col min-w-0 flex-1'>
                    <span className='text-xs font-bold truncate leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
                      {item.title}
                    </span>
                    <span className='text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5'>
                      {item.subtitle}
                    </span>
                  </div>
                </div>

                <div className='flex items-center gap-1.5 shrink-0 ps-2'>
                  {isSelected && (
                    <span className='hidden sm:inline-flex items-center gap-1 text-[10px] text-blue-500 dark:text-blue-400 font-semibold'>
                      <CornerDownLeft className='w-3 h-3' />
                    </span>
                  )}
                  <ArrowRight className='w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all' />
                </div>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className='relative flex items-center is-full'>
      {/* Search Input Box */}
      <div className='relative flex items-center is-full'>
        <div className='absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-slate-400 dark:text-slate-500'>
          {isLoading ? (
            <Loader2 className='w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin' />
          ) : (
            <Search className='w-4 h-4' />
          )}
        </div>

        <input
          ref={inputRef}
          type='text'
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={e => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onKeyDown={handleKeyDown}
          placeholder='Cari skill, peran karier, atau pengalaman...'
          className='bg-[#F8FAFC] dark:bg-slate-900/60 border border-[#E2E8F0] dark:border-slate-800 text-slate-800 dark:text-white text-xs sm:text-sm rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block is-full ps-10 pe-16 sm:pe-20 py-2 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-900 outline-none shadow-2xs'
        />

        {/* Right actions inside input */}
        <div className='absolute inset-y-0 end-0 flex items-center pe-2.5 gap-1.5'>
          {query ? (
            <button
              type='button'
              onClick={handleClear}
              className='w-5 h-5 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors cursor-pointer'
              title='Bersihkan pencarian'
            >
              <X className='w-3 h-3' />
            </button>
          ) : (
            <kbd className='hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-md select-none'>
              <span>Ctrl</span>
              <span>K</span>
            </kbd>
          )}
        </div>
      </div>

      {/* Search Overlay Popper */}
      <Popper
        open={isOpen}
        anchorEl={containerRef.current}
        placement='bottom-start'
        transition
        disablePortal={false}
        className='z-[9999] w-full max-w-[560px]'
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 8]
            }
          }
        ]}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={180}>
            <Paper className='!bg-transparent !shadow-none w-full'>
              <ClickAwayListener
                onClickAway={e => {
                  if (containerRef.current && containerRef.current.contains(e.target as HTMLElement)) {
                    return
                  }

                  setIsOpen(false)
                }}
              >
                <div className='w-full rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl p-2.5 flex flex-col backdrop-blur-xl animate-in zoom-in-95 duration-150'>
                  {/* Results Scroll Area */}
                  <div className='max-h-[420px] overflow-y-auto px-1 py-1'>
                    {/* Reset counter before rendering sections */}
                    {(() => {
                      globalItemIndex = 0

                      return null
                    })()}

                    {renderSection('Skill & Keahlian Terverifikasi', searchData.skills, 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300')}
                    {renderSection('Peluang & Lowongan Karier', searchData.opportunities, 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300')}
                    {renderSection('Pengalaman Terdokumentasi', searchData.experiences, 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300')}
                    {renderSection('Peran Karier Sasaran', searchData.careerRoles, 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300')}
                    {renderSection('Materi Pembelajaran AI', searchData.learningResources, 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300')}
                    {renderSection('Navigasi & Menu Cepat', searchData.navigation, 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300')}

                    {totalResultsCount === 0 && !isLoading && (
                      <div className='flex flex-col items-center justify-center p-8 text-center'>
                        <div className='w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-2.5'>
                          <Search className='w-5 h-5' />
                        </div>
                        <span className='font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200'>
                          Tidak ada hasil untuk &ldquo;{query}&rdquo;
                        </span>
                        <span className='text-[11px] text-slate-400 dark:text-slate-500 mt-1 max-w-[280px]'>
                          Coba kata kunci lain seperti React, Magang, Frontend, UI/UX, atau nama pengalamanmu.
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Footer Helper */}
                  <div className='pt-2 mt-1 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between px-3 text-[11px] text-slate-400 dark:text-slate-500'>
                    <div className='flex items-center gap-1.5'>
                      <span className='w-1.5 h-1.5 rounded-full bg-blue-500' />
                      <span>{query ? `Hasil pencarian untuk "${query}"` : 'Saran pencarian cepat'}</span>
                    </div>

                    <div className='hidden sm:flex items-center gap-2 text-[10px] font-medium'>
                      <span>Navigasi <kbd className='px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono'>↑</kbd> <kbd className='px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono'>↓</kbd></span>
                      <span>Pilih <kbd className='px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono'>↵</kbd></span>
                    </div>
                  </div>
                </div>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </div>
  )
}
