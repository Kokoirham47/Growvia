'use client'

import React from 'react'
import { Users, Target, Code, Trophy, Sparkles } from 'lucide-react'
import { SkillCategoryType, SkillCategorySummary } from '@/types/skills'

interface SkillCategoryRowProps {
  summaries: SkillCategorySummary[]
  activeCategory: SkillCategoryType | 'all'
  onSelectCategory: (category: SkillCategoryType | 'all') => void
}

export default function SkillCategoryRow({
  summaries,
  activeCategory,
  onSelectCategory
}: SkillCategoryRowProps) {
  // Render matching icon
  const getCategoryIcon = (category: SkillCategoryType) => {
    switch (category) {
      case 'soft_skill':
        return <Users className='w-5 h-5 text-[#2563EB]' />
      case 'hard_skill':
        return <Target className='w-5 h-5 text-[#6366F1]' />
      case 'technical':
        return <Code className='w-5 h-5 text-[#10B981]' />
      case 'leadership':
        return <Trophy className='w-5 h-5 text-[#F59E0B]' />
    }
  }

  const getPillStyle = (category: SkillCategoryType) => {
    switch (category) {
      case 'soft_skill':
        return 'bg-[#EFF6FF] text-[#2563EB] dark:bg-blue-950/40 dark:text-blue-400 border-[#DBEAFE] dark:border-blue-900/60'
      case 'hard_skill':
        return 'bg-[#EEF2FF] text-[#6366F1] dark:bg-indigo-950/40 dark:text-indigo-400 border-[#E0E7FF] dark:border-indigo-900/60'
      case 'technical':
        return 'bg-[#ECFDF5] text-[#10B981] dark:bg-emerald-950/40 dark:text-emerald-400 border-[#D1FAE5] dark:border-emerald-900/60'
      case 'leadership':
        return 'bg-[#FEF3C7] text-[#D97706] dark:bg-amber-950/40 dark:text-amber-400 border-[#FDE68A] dark:border-amber-900/60'
    }
  }

  const getIconBg = (category: SkillCategoryType) => {
    switch (category) {
      case 'soft_skill':
        return 'bg-[#EFF6FF] dark:bg-blue-950/50'
      case 'hard_skill':
        return 'bg-[#EEF2FF] dark:bg-indigo-950/50'
      case 'technical':
        return 'bg-[#ECFDF5] dark:bg-emerald-950/50'
      case 'leadership':
        return 'bg-[#FEF3C7] dark:bg-amber-950/50'
    }
  }

  return (
    <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
      {summaries.map(item => {
        const isSelected = activeCategory === item.category

        return (
          <button
            key={item.category}
            type='button'
            onClick={() => onSelectCategory(isSelected ? 'all' : item.category)}
            className={`text-left p-5 rounded-[16px] bg-white dark:bg-slate-900 border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
              isSelected
                ? 'border-[#2563EB] ring-2 ring-blue-500/15 shadow-sm'
                : 'border-[#E2E8F0] dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm'
            }`}
          >
            {/* Top row: Icon and Percentage badge */}
            <div className='flex items-center justify-between gap-2 w-full'>
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${getIconBg(
                  item.category
                )}`}
              >
                {getCategoryIcon(item.category)}
              </div>

              <span
                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getPillStyle(
                  item.category
                )}`}
              >
                {item.percentage}% dari total
              </span>
            </div>

            {/* Bottom: Number count and Label */}
            <div className='mt-4'>
              <div className='text-3xl font-bold text-[#1E293B] dark:text-white tracking-tight leading-none'>
                {item.count}
              </div>
              <div className='text-sm font-medium text-[#64748B] dark:text-slate-400 mt-1.5'>
                {item.label}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
