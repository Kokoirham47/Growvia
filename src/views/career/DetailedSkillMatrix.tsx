'use client'

import React from 'react'

import {
  Code2,
  Users2,
  CheckCircle2,
  GraduationCap,
  Play
} from 'lucide-react'

import type { CareerTargetProfile } from '@/types/career'

interface DetailedSkillMatrixProps {
  career: CareerTargetProfile
  onOpenLearning: (skillName?: string) => void
}

export default function DetailedSkillMatrix({ career, onOpenLearning }: DetailedSkillMatrixProps) {
  const getBadge = (status: 'strong' | 'develop' | 'missing') => {
    switch (status) {
      case 'strong':
        return (
          <span className='px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#ECFDF5] dark:bg-emerald-950/40 text-[#16A34A]'>
            Strong
          </span>
        )
      case 'develop':
        return (
          <span className='px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#FFFBEB] dark:bg-amber-950/40 text-[#F59E0B]'>
            Develop
          </span>
        )
      case 'missing':
        return (
          <span className='px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#FEF2F2] dark:bg-rose-950/40 text-[#DC2626]'>
            Missing
          </span>
        )
    }
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-[#16A34A]'
    if (score >= 40) return 'bg-[#F59E0B]'

    return 'bg-[#DC2626]'
  }

  // Soft skills matching screenshot
  const softSkills = career.softSkills ?? [
    {
      id: 'soft-1',
      name: 'Cross-functional Comm.',
      badge: 'Strong',
      badgeType: 'strong' as const,
      description: 'Mampu menjembatani diskusi desain dengan tim Developer.',
      score: 88
    },
    {
      id: 'soft-2',
      name: 'Agile / Scrum Methodology',
      badge: 'Intermediate',
      badgeType: 'intermediate' as const,
      description: 'Familiar dengan Sprint Planning dan retrospeksi mingguan.',
      score: 70
    },
    {
      id: 'soft-3',
      name: 'Presentation & Pitching',
      badge: 'Strong',
      badgeType: 'strong' as const,
      description: 'Percaya diri mempresentasikan data temuan riset ke user.',
      score: 85
    }
  ]

  const hardSkillsCategory = career.detailedMatrix?.[0]

  return (
    <div className='flex flex-col gap-4 w-full'>
      {/* Matrix Section Title & Legend */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1'>
        <div className='flex items-center gap-2'>
          <h2 className='text-lg font-bold text-slate-900 dark:text-white tracking-tight'>
            Detail Pemetaan Skill Matrix
          </h2>
        </div>

        {/* Legend */}
        <div className='flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400'>
          <span className='flex items-center gap-1.5'>
            <span className='w-2 h-2 rounded-full bg-[#16A34A]' />
            <span>80–100% Siap</span>
          </span>
          <span className='flex items-center gap-1.5'>
            <span className='w-2 h-2 rounded-full bg-[#F59E0B]' />
            <span>40–79% Develop</span>
          </span>
          <span className='flex items-center gap-1.5'>
            <span className='w-2 h-2 rounded-full bg-[#DC2626]' />
            <span>&lt;40% Missing</span>
          </span>
        </div>
      </div>

      {/* CARD 1: Hard Skills Industri (Distinct white card as in screenshot) */}
      {hardSkillsCategory && (
        <div className='bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col gap-4'>
          {/* Sub-header */}
          <div className='flex items-center justify-between pb-1'>
            <div className='flex items-center gap-2.5'>
              <div className='w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] flex items-center justify-center shrink-0'>
                <Code2 className='w-4 h-4' />
              </div>
              <div className='flex flex-col'>
                <h3 className='text-sm font-bold text-slate-900 dark:text-white'>
                  {hardSkillsCategory.category}
                </h3>
                <p className='text-[11px] text-slate-400 dark:text-slate-500'>
                  {hardSkillsCategory.description}
                </p>
              </div>
            </div>

            <span className='text-xs text-slate-400 dark:text-slate-500'>
              {hardSkillsCategory.skillsCountLabel || `${hardSkillsCategory.skills.length} Skill Dievaluasi`}
            </span>
          </div>

          {/* Rows */}
          <div className='flex flex-col divide-y divide-slate-50 dark:divide-slate-800/60'>
            {hardSkillsCategory.skills.map(item => {
              const isQualified = item.score >= 80

              const effectiveStatus: 'strong' | 'develop' | 'missing' =
                item.score >= 80 ? 'strong' : item.score >= 40 ? 'develop' : 'missing'

              const effectiveActionType =
                effectiveStatus === 'strong'
                  ? 'qualified'
                  : effectiveStatus === 'develop'
                  ? 'recommend'
                  : 'intro_module'

              return (
                <div
                  key={item.id}
                  className='py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3'
                >
                  {/* Left: Name, Badge & Evidence note */}
                  <div className='flex flex-col sm:flex-row sm:items-center gap-2 min-w-[320px]'>
                    <div className='flex items-center gap-2'>
                      <span
                        className={`text-xs sm:text-sm font-bold transition-colors ${
                          isQualified
                            ? 'text-[#16A34A] dark:text-emerald-400'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {item.name}
                      </span>
                      {getBadge(effectiveStatus)}
                    </div>
                    <span
                      className={`text-[11px] ${
                        effectiveStatus === 'strong'
                          ? 'text-emerald-600 dark:text-emerald-400/80 font-medium'
                          : effectiveStatus === 'develop'
                          ? 'text-amber-500'
                          : effectiveStatus === 'missing'
                          ? 'text-rose-500'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {item.evidenceNote}
                    </span>
                  </div>

                  {/* Middle: Progress Bar & Percentage */}
                  <div className='flex items-center gap-3 flex-1 max-w-sm w-full'>
                    <div className='flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden'>
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${getProgressColor(item.score)}`}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                    <span
                      className={`text-xs font-bold w-8 text-right ${
                        isQualified
                          ? 'text-[#16A34A] dark:text-emerald-400'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {item.score}%
                    </span>
                  </div>

                  {/* Right: Action Button */}
                  <div className='shrink-0 flex items-center justify-end min-w-[200px]'>
                    {effectiveActionType === 'qualified' ? (
                      <span className='inline-flex items-center gap-1.5 text-xs font-semibold text-[#16A34A] dark:text-emerald-400'>
                        <CheckCircle2 className='w-4 h-4' />
                        <span>Kualifikasi Tercapai</span>
                      </span>
                    ) : effectiveActionType === 'recommend' ? (
                      <button
                        type='button'
                        onClick={() => onOpenLearning(item.name)}
                        className='inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:text-blue-700 transition-colors cursor-pointer'
                      >
                        <GraduationCap className='w-4 h-4' />
                        <span>Lihat Rekomendasi Belajar</span>
                      </button>
                    ) : (
                      <button
                        type='button'
                        onClick={() => onOpenLearning(item.name)}
                        className='inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#991B1B] hover:bg-red-900 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer'
                      >
                        <div className='w-3.5 h-3.5 rounded-full border border-white flex items-center justify-center'>
                          <Play className='w-2 h-2 fill-white text-white ml-0.5' />
                        </div>
                        <span>Ambil Modul Pengantar</span>
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* CARD 2: Soft Skills & Kolaborasi (Separate distinct white card matching screenshot) */}
      <div className='bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col gap-4'>
        {/* Sub-header */}
        <div className='flex items-center justify-between pb-1'>
          <div className='flex items-center gap-2.5'>
            <div className='w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] flex items-center justify-center shrink-0'>
              <Users2 className='w-4 h-4' />
            </div>
            <div className='flex flex-col'>
              <h3 className='text-sm font-bold text-slate-900 dark:text-white'>
                Soft Skills & Kolaborasi
              </h3>
              <p className='text-[11px] text-slate-400 dark:text-slate-500'>
                Pola pikir kerja tim, komunikasi lintas divisi, dan adaptasi kultur
              </p>
            </div>
          </div>

          <span className='text-xs text-slate-400 dark:text-slate-500'>
            {softSkills.length} Skill Dievaluasi
          </span>
        </div>

        {/* 3 Columns Card Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-1'>
          {softSkills.map(card => (
            <div
              key={card.id}
              className='bg-[#F8FAFC] dark:bg-slate-800/40 rounded-xl p-4 border border-slate-100 dark:border-slate-800/60 flex flex-col justify-between gap-3'
            >
              <div>
                <div className='flex items-center justify-between gap-2'>
                  <h4
                    className={`text-xs font-bold transition-colors ${
                      card.score >= 80 || card.badgeType === 'strong'
                        ? 'text-[#16A34A] dark:text-emerald-400'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {card.name}
                  </h4>
                  {card.score >= 80 || card.badgeType === 'strong' ? (
                    <span className='px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#ECFDF5] text-[#16A34A]'>
                      {card.badge}
                    </span>
                  ) : (
                    <span className='px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#EFF6FF] text-[#2563EB]'>
                      {card.badge}
                    </span>
                  )}
                </div>
                <p className='text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed'>
                  {card.description}
                </p>
              </div>

              <div className='pt-2 flex items-center justify-between text-xs'>
                <span className='text-[11px] text-slate-400'>Kesiapan</span>
                <div className='flex items-center gap-2 flex-1 max-w-[140px] px-2'>
                  <div className='flex-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden'>
                    <div
                      className={`h-full rounded-full ${
                        card.badgeType === 'strong' ? 'bg-[#16A34A]' : 'bg-[#2563EB]'
                      }`}
                      style={{ width: `${card.score}%` }}
                    />
                  </div>
                </div>
                <span className='font-bold text-slate-800 dark:text-slate-200 text-xs'>
                  {card.score}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
