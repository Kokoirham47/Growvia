'use client'

import React, { useState } from 'react'

import {
  Check,
  X,
  Edit2,
  AlertTriangle,
  HelpCircle
} from 'lucide-react'
import type { SkillCategory, SkillLevel } from '@prisma/client'

export interface SuggestionChipData {
  id: string
  suggestedName: string
  finalName?: string
  suggestedCategory: SkillCategory
  confidenceScore: number
  level?: SkillLevel
  reasoning?: string
  metricTag?: string | null
  reviewStatus?: 'pending' | 'accepted' | 'edited' | 'rejected'
}

interface SkillSuggestionChipProps {
  data: SuggestionChipData
  isSelected: boolean
  onToggleSelect: () => void
  onUpdateName: (newName: string) => void
  onUpdateLevel: (newLevel: SkillLevel) => void
  onReject: () => void
}

const CATEGORY_CONFIG: Record<SkillCategory, { label: string; badgeClass: string }> = {
  hard_skill: {
    label: 'Hard Skill',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-900/60'
  },
  soft_skill: {
    label: 'Soft Skill',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-400 dark:border-purple-900/60'
  },
  technical: {
    label: 'Technical',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-900/60'
  },
  leadership: {
    label: 'Leadership',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-900/60'
  }
}

const LEVEL_OPTIONS: { key: SkillLevel; label: string }[] = [
  { key: 'beginner', label: 'Pemula' },
  { key: 'intermediate', label: 'Menengah' },
  { key: 'advanced', label: 'Mahir' },
  { key: 'expert', label: 'Ahli' }
]

export default function SkillSuggestionChip({
  data,
  isSelected,
  onToggleSelect,
  onUpdateName,
  onUpdateLevel,
  onReject
}: SkillSuggestionChipProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [nameInput, setNameInput] = useState(data.finalName || data.suggestedName)
  const [showReasoning, setShowReasoning] = useState(false)

  const conf = Math.round(data.confidenceScore)
  const isHigh = conf >= 75
  const isLow = conf < 40
  const categoryMeta = CATEGORY_CONFIG[data.suggestedCategory] || CATEGORY_CONFIG.hard_skill

  const handleSaveName = () => {
    if (nameInput.trim()) {
      onUpdateName(nameInput.trim())
    }

    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSaveName()

    if (e.key === 'Escape') {
      setNameInput(data.finalName || data.suggestedName)
      setIsEditing(false)
    }
  }

  return (
    <div
      className={`relative rounded-2xl font-poppins border transition-all p-4 ${
        isSelected
          ? 'bg-white dark:bg-[#0F172A] border-blue-500/70 dark:border-blue-500/80 shadow-xs ring-1 ring-blue-500/20'
          : 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800 opacity-60 hover:opacity-100'
      }`}
    >
      <div className='flex items-start justify-between gap-3'>
        {/* Left: Checkbox + Name & Category */}
        <div className='flex items-start gap-3 flex-1 min-w-0'>
          {/* Custom Checkbox */}
          <button
            type='button'
            onClick={onToggleSelect}
            className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-all cursor-pointer ${
              isSelected
                ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-transparent hover:border-blue-400'
            }`}
            title={isSelected ? 'Batalkan pilihan skill ini' : 'Pilih skill ini untuk disimpan'}
          >
            <Check className='w-3.5 h-3.5 stroke-[3]' />
          </button>

          <div className='flex-1 min-w-0 space-y-1.5'>
            {/* Name Row or Edit Input */}
            <div className='flex items-center gap-2 flex-wrap'>
              {isEditing ? (
                <div className='flex items-center gap-1.5 w-full max-w-xs'>
                  <input
                    type='text'
                    autoFocus
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={handleSaveName}
                    className='w-full px-2.5 py-1 text-xs sm:text-sm font-bold rounded-lg border border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20'
                  />
                  <button
                    type='button'
                    onClick={handleSaveName}
                    className='p-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-[10px] font-bold cursor-pointer shrink-0'
                  >
                    Simpan
                  </button>
                </div>
              ) : (
                <>
                  <h4 className='text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white tracking-tight truncate'>
                    {data.finalName || data.suggestedName}
                  </h4>
                  <button
                    type='button'
                    onClick={() => setIsEditing(true)}
                    title='Ubah nama skill'
                    className='p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors cursor-pointer'
                  >
                    <Edit2 className='w-3 h-3' />
                  </button>
                </>
              )}
            </div>

            {/* Badges Row */}
            <div className='flex items-center gap-1.5 flex-wrap'>
              {/* Category */}
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${categoryMeta.badgeClass}`}>
                {categoryMeta.label}
              </span>

              {/* Metric Tag if detected */}
              {data.metricTag && (
                <span className='inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-900/60'>
                  • {data.metricTag}
                </span>
              )}

              {/* Low Confidence Warning */}
              {isLow && (
                <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-900/60'>
                  <AlertTriangle className='w-2.5 h-2.5' />
                  <span>Perlu Konfirmasi</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Confidence Score & Action */}
        <div className='flex items-center gap-3 shrink-0'>
          {/* Confidence Indicator */}
          <div className='text-right'>
            <div className='flex items-center gap-1.5 justify-end'>
              <span className='text-xs font-black text-slate-900 dark:text-white'>{conf}%</span>
              <span className='text-[10px] font-medium text-slate-400 dark:text-slate-500'>Akurasi</span>
            </div>
            <div className='w-16 sm:w-20 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1'>
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isHigh ? 'bg-emerald-500' : isLow ? 'bg-amber-500' : 'bg-blue-600'
                }`}
                style={{ width: `${conf}%` }}
              />
            </div>
          </div>

          {/* Reject / Dismiss Button */}
          <button
            type='button'
            onClick={onReject}
            title='Tolak saran skill ini'
            className='p-1 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer'
          >
            <X className='w-4 h-4' />
          </button>
        </div>
      </div>

      {/* Footer Details: Level Selector & Reasoning Toggle */}
      <div className='mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-[11px]'>
        {/* Level selector pills */}
        <div className='flex items-center gap-1 flex-wrap'>
          <span className='text-slate-400 dark:text-slate-500 font-medium mr-1'>Tingkat:</span>
          {LEVEL_OPTIONS.map(lvl => {
            const isLvlActive = (data.level || 'intermediate') === lvl.key

            return (
              <button
                key={lvl.key}
                type='button'
                onClick={() => onUpdateLevel(lvl.key)}
                className={`px-2 py-0.5 rounded-md font-semibold text-[10px] transition-all cursor-pointer ${
                  isLvlActive
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-900/60'
                    : 'bg-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {lvl.label}
              </button>
            )
          })}
        </div>

        {/* Reasoning Dropdown Toggle */}
        {data.reasoning && (
          <button
            type='button'
            onClick={() => setShowReasoning(!showReasoning)}
            className='inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer self-start sm:self-auto'
          >
            <HelpCircle className='w-3 h-3' />
            <span>{showReasoning ? 'Sembunyikan Alasan AI' : 'Lihat Alasan AI'}</span>
          </button>
        )}
      </div>

      {/* Collapsible Reasoning Text */}
      {showReasoning && data.reasoning && (
        <div className='mt-2.5 p-2.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-[11px] text-slate-600 dark:text-slate-300 italic leading-relaxed animate-in fade-in duration-150'>
          &ldquo;{data.reasoning}&rdquo;
        </div>
      )}
    </div>
  )
}
