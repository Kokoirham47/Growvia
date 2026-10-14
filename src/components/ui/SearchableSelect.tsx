'use client'

import React, { useState, useRef, useEffect, useMemo } from 'react'
import { Check, ChevronDown, Search, X } from 'lucide-react'

export interface SelectOption {
  id: string
  label: string
  subtext?: string
  badge?: string
}

interface SearchableSelectProps {
  id?: string
  label?: string
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  icon?: React.ReactNode
  isDark?: boolean
  allowCustom?: boolean
  required?: boolean
}

export default function SearchableSelect({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = 'Pilih atau cari...',
  icon,
  isDark = false,
  allowCustom = true,
  required = false
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Auto focus search input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  // Filter options based on search query (fuzzy case-insensitive)
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options

    const q = searchQuery.toLowerCase().trim()
    return options.filter(opt => {
      const matchLabel = opt.label.toLowerCase().includes(q)
      const matchSub = opt.subtext ? opt.subtext.toLowerCase().includes(q) : false
      const matchBadge = opt.badge ? opt.badge.toLowerCase().includes(q) : false
      return matchLabel || matchSub || matchBadge
    })
  }, [options, searchQuery])

  // Check if current search query is an exact match
  const hasExactMatch = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return options.some(opt => opt.label.toLowerCase() === q)
  }, [options, searchQuery])

  const handleSelect = (selectedLabel: string) => {
    onChange(selectedLabel)
    setIsOpen(false)
    setSearchQuery('')
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange('')
    setSearchQuery('')
  }

  return (
    <div className='relative w-full' ref={containerRef}>
      {label && (
        <label
          htmlFor={id}
          className={`block text-[13px] font-medium mb-1.5 ${
            isDark ? 'text-slate-200' : 'text-[#334155]'
          }`}
        >
          {label} {required && <span className='text-rose-500'>*</span>}
        </label>
      )}

      {/* Trigger Button */}
      <div
        id={id}
        tabIndex={0}
        role='combobox'
        aria-expanded={isOpen}
        onClick={() => {
          setIsOpen(prev => !prev)
          setSearchQuery('')
        }}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setIsOpen(prev => !prev)
          }
        }}
        className={`w-full h-[44px] px-3.5 rounded-[12px] transition-all outline-none border flex items-center justify-between cursor-pointer select-none text-[14px] ${
          isOpen
            ? isDark
              ? 'border-[#3B82F6] ring-4 ring-[#3B82F6]/20 bg-[#0B0F19]'
              : 'border-[#2563EB] ring-4 ring-[#2563EB]/15 bg-white'
            : isDark
            ? 'bg-[#0B0F19] border-[#1F2937] text-white hover:border-[#374151]'
            : 'bg-white border-[#DCE3EF] text-[#1E293B] hover:border-[#CBD5E1]'
        }`}
      >
        <div className='flex items-center gap-2.5 truncate mr-2'>
          {icon && (
            <span className={value ? 'text-[#2563EB] dark:text-blue-400' : 'text-slate-400'}>
              {icon}
            </span>
          )}
          <span className={`truncate ${!value ? (isDark ? 'text-slate-500' : 'text-[#94A3B8]') : ''}`}>
            {value || placeholder}
          </span>
        </div>

        <div className='flex items-center gap-1.5 text-slate-400 shrink-0'>
          {value && (
            <button
              type='button'
              onClick={handleClear}
              className='p-0.5 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer'
              title='Hapus pilihan'
            >
              <X className='w-3.5 h-3.5' />
            </button>
          )}
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Dropdown Menu Modal/Pill */}
      {isOpen && (
        <div
          className={`absolute left-0 right-0 top-[calc(100%+6px)] z-50 rounded-[14px] border shadow-2xl overflow-hidden animate-fadeIn backdrop-blur-md ${
            isDark
              ? 'bg-[#111827] border-[#1F2937] shadow-black/60'
              : 'bg-white border-[#E2E8F0] shadow-blue-500/10'
          }`}
        >
          {/* Search Box Input */}
          <div
            className={`p-2.5 border-b flex items-center gap-2 ${
              isDark ? 'border-slate-800 bg-[#0B0F19]/50' : 'border-slate-100 bg-slate-50/70'
            }`}
          >
            <Search className='w-4 h-4 text-slate-400 shrink-0 ml-1' />
            <input
              ref={searchInputRef}
              type='text'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  e.preventDefault()
                  if (filteredOptions.length > 0) {
                    handleSelect(filteredOptions[0].label)
                  } else if (allowCustom) {
                    handleSelect(searchQuery.trim())
                  }
                }
              }}
              placeholder='Ketik untuk mencari...'
              className={`w-full bg-transparent text-[13.5px] outline-none ${
                isDark ? 'text-white placeholder:text-slate-500' : 'text-[#1E293B] placeholder:text-[#94A3B8]'
              }`}
            />
            {searchQuery && (
              <button
                type='button'
                onClick={() => setSearchQuery('')}
                className='text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              >
                <X className='w-3.5 h-3.5' />
              </button>
            )}
          </div>

          {/* Options List */}
          <div className='max-h-[240px] overflow-y-auto p-1.5 space-y-0.5 custom-scrollbar'>
            {filteredOptions.length > 0 ? (
              filteredOptions.map(opt => {
                const isSelected = value === opt.label
                return (
                  <button
                    key={opt.id}
                    type='button'
                    onClick={() => handleSelect(opt.label)}
                    className={`w-full text-left px-3 py-2 rounded-[9px] text-[13px] transition-all flex items-center justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-[#2563EB] text-white font-medium'
                        : isDark
                        ? 'text-slate-200 hover:bg-[#1E293B] active:bg-[#334155]'
                        : 'text-[#334155] hover:bg-slate-100 active:bg-slate-200'
                    }`}
                  >
                    <div className='truncate flex-1'>
                      <div className='truncate'>{opt.label}</div>
                      {opt.subtext && (
                        <div
                          className={`text-[11px] truncate mt-0.5 ${
                            isSelected ? 'text-blue-100' : isDark ? 'text-slate-400' : 'text-slate-500'
                          }`}
                        >
                          {opt.subtext}
                        </div>
                      )}
                    </div>

                    <div className='flex items-center gap-2 shrink-0'>
                      {opt.badge && (
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : isDark
                              ? 'bg-slate-800 text-slate-300'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {opt.badge}
                        </span>
                      )}
                      {isSelected && <Check className='w-4 h-4 stroke-[2.5]' />}
                    </div>
                  </button>
                )
              })
            ) : null}

            {/* Custom Option Fallback (Jika user mengetik nama kampus/jurusan yang tidak ada di list) */}
            {allowCustom && searchQuery.trim() && !hasExactMatch && (
              <button
                type='button'
                onClick={() => handleSelect(searchQuery.trim())}
                className={`w-full text-left px-3 py-2.5 rounded-[9px] text-[13px] border border-dashed transition-all flex items-center justify-between gap-2 cursor-pointer mt-1 ${
                  isDark
                    ? 'border-blue-500/40 text-blue-400 hover:bg-blue-950/40'
                    : 'border-blue-400 text-blue-600 hover:bg-blue-50'
                }`}
              >
                <div className='truncate'>
                  <span className='text-[11.5px] opacity-75 block'>Gunakan input manual:</span>
                  <span className='font-semibold'>&ldquo;{searchQuery.trim()}&rdquo;</span>
                </div>
                <span className='text-xs font-medium underline shrink-0'>Pilih</span>
              </button>
            )}

            {filteredOptions.length === 0 && (!allowCustom || !searchQuery.trim()) && (
              <div className='py-6 text-center text-xs text-slate-400'>
                Tidak ditemukan hasil yang cocok.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
