'use client'

import React from 'react'
import { Pencil, Link2, Sparkles, Trash2 } from 'lucide-react'
import type { SkillItem } from '@/types/skills'

interface SkillCardProps {
  skill: SkillItem
  onEdit: (skill: SkillItem) => void
  onViewEvidence?: (skill: SkillItem) => void
  onDelete?: (skill: SkillItem) => void
}

export default function SkillCard({ skill, onEdit, onViewEvidence, onDelete }: SkillCardProps) {
  // Level badge styling as per design system
  const getLevelBadge = (level: SkillItem['level']) => {
    switch (level) {
      case 'advanced':
      case 'expert':
        return (
          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#15803D] dark:bg-emerald-950/50 dark:text-emerald-400 border border-[#BBF7D0] dark:border-emerald-900/60'>
            Advanced
          </span>
        )
      case 'intermediate':
        return (
          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#B45309] dark:bg-amber-950/50 dark:text-amber-400 border border-[#FDE68A] dark:border-amber-900/60'>
            Intermediate
          </span>
        )
      case 'beginner':
      default:
        return (
          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F1F5F9] text-[#475569] dark:bg-slate-800 dark:text-slate-300 border border-[#E2E8F0] dark:border-slate-700'>
            Beginner
          </span>
        )
    }
  }

  return (
    <div className='group relative bg-white dark:bg-slate-900 rounded-[16px] p-5 border border-[#E2E8F0] dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900/60 transition-all duration-200 flex flex-col justify-between'>
      {/* Top Header Row */}
      <div>
        <div className='flex items-start justify-between gap-2'>
          <div className='flex-1 min-w-0'>
            <h4 className='text-base font-bold text-[#1E293B] dark:text-white truncate tracking-tight group-hover:text-[#2563EB] transition-colors'>
              {skill.name}
            </h4>
            {skill.subCategory && (
              <p className='text-xs text-[#64748B] dark:text-slate-400 truncate mt-0.5 font-normal'>
                {skill.subCategory}
              </p>
            )}
          </div>

          {/* Top Right: AI badge and Actions (Edit & Delete) */}
          <div className='flex items-center gap-1.5 shrink-0'>
            {skill.source === 'ai_extracted' && (
              <span
                title='Diekstrak otomatis oleh AI dari bukti pengalaman'
                className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#EEF2FF] text-[#6366F1] dark:bg-indigo-950/60 dark:text-indigo-300 border border-[#E0E7FF] dark:border-indigo-900/60'
              >
                <span>AI</span>
                <Sparkles className='w-2.5 h-2.5' />
              </span>
            )}

            {/* Actions on Hover */}
            <div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
              <button
                type='button'
                onClick={() => onEdit(skill)}
                title='Edit skill'
                aria-label={`Edit ${skill.name}`}
                className='p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors'
              >
                <Pencil className='w-3.5 h-3.5' />
              </button>

              {onDelete && (
                <button
                  type='button'
                  onClick={() => onDelete(skill)}
                  title='Hapus skill'
                  aria-label={`Hapus ${skill.name}`}
                  className='p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer transition-colors'
                >
                  <Trash2 className='w-3.5 h-3.5' />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Level and Score Row */}
        <div className='flex items-center justify-between gap-2 mt-3.5'>
          {getLevelBadge(skill.level)}
          <span className='text-xs font-semibold text-slate-700 dark:text-slate-300'>
            {skill.score}% Kemahiran
          </span>
        </div>

        {/* Progress Bar (Color: #2563EB) */}
        <div className='mt-2 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden'>
          <div
            className='bg-[#2563EB] h-full rounded-full transition-all duration-700'
            style={{ width: `${Math.min(100, Math.max(5, skill.score))}%` }}
          />
        </div>
      </div>

      {/* Bottom Evidence Row */}
      <div className='mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 text-xs'>
        <button
          type='button'
          onClick={() => onViewEvidence?.(skill)}
          className='inline-flex items-center gap-1.5 text-[#64748B] dark:text-slate-400 hover:text-[#2563EB] dark:hover:text-blue-400 transition-colors font-medium cursor-pointer'
        >
          <Link2 className='w-3.5 h-3.5 text-slate-400' />
          <span>Dari {skill.evidenceCount} pengalaman</span>
        </button>

        {/* Evidence Tags Summary */}
        {skill.evidenceTags && skill.evidenceTags.length > 0 && (
          <span
            className='text-[11px] text-[#94A3B8] dark:text-slate-500 font-normal truncate max-w-[140px] text-right'
            title={skill.evidenceTags.join(', ')}
          >
            {skill.evidenceTags.join(', ')}
          </span>
        )}
      </div>
    </div>
  )
}
