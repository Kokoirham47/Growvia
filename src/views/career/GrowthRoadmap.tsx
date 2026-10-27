'use client'

import React from 'react'

import { useRouter } from 'next/navigation'

import {
  ArrowRight,
  BookOpen,
  Layers,
  Briefcase,
  Clock,
  CheckCircle2
} from 'lucide-react'

import type { CareerTargetProfile } from '@/types/career'

interface GrowthRoadmapProps {
  career: CareerTargetProfile
  onOpenLearning?: (skillName?: string) => void
}

export default function GrowthRoadmap({
  career,
  onOpenLearning
}: GrowthRoadmapProps) {
  const router = useRouter()

  // Dynamic fallback steps if backend roadmap not yet filled
  const topGapSkill =
    career.missingSkills[0]?.name ||
    career.developSkills[0]?.name ||
    'Kompetensi Spesialisasi'

  const secondaryGapSkill =
    career.missingSkills[1]?.name ||
    career.developSkills[1]?.name ||
    'Studi Kasus Portofolio'

  const totalGap = Math.max(10, 100 - career.readinessScore)
  const step1Gain = Math.max(6, Math.min(22, Math.round(totalGap * 0.45)))
  const step2Gain = Math.max(5, Math.min(18, Math.round(totalGap * 0.35)))

  const defaultSteps = [
    {
      step: 1,
      title: `Kuasai Fondasi & Praktik '${topGapSkill}'`,
      estDays: 'Est. 3-5 Hari',
      description: `Pelajari modul terstruktur dan lab praktis ${topGapSkill} untuk menutup gap kompetensi paling kritis pada posisi ${career.title}.`,
      footerLabel: 'Buka Modul Belajar',
      gainLabel: `+${step1Gain}% Kesiapan`,
      type: 'course' as const,
      actionType: 'learning_modal' as const,
      targetSkill: topGapSkill
    },
    {
      step: 2,
      title: `Update Studi Kasus Portofolio ${career.title}`,
      estDays: 'Est. 5-7 Hari',
      description: `Unggah bukti artefak proyek nyata yang mengintegrasikan ${secondaryGapSkill} dengan metrik hasil bisnis yang terukur.`,
      footerLabel: 'Buka Portofolio AI',
      gainLabel: `+${step2Gain}% Kesiapan`,
      type: 'portfolio' as const,
      actionType: 'portfolio' as const,
      actionUrl: '/dashboard/portfolio'
    },
    {
      step: 3,
      title: `Kirim Lamaran ke Mitra Lowongan ${career.title}`,
      estDays: 'Target Akhir (Hari 15-30)',
      description: `Gunakan fitur Fast-Track Apply Growvia untuk lowongan terverifikasi dengan probabilitas kecocokan kualifikasi di atas 85%+.`,
      footerLabel: 'Jelajahi Lowongan',
      gainLabel: 'Siap Kerja 95%+',
      type: 'application' as const,
      actionType: 'opportunities' as const,
      actionUrl: '/dashboard/opportunities'
    }
  ]

  const roadmapSteps =
    career.growthRoadmap && career.growthRoadmap.length >= 3
      ? career.growthRoadmap
      : defaultSteps

  // Handle action button clicks per step
  const handleStepAction = (stepItem: typeof roadmapSteps[0]) => {
    if (stepItem.actionType === 'learning_modal' || stepItem.type === 'course') {
      if (onOpenLearning) {
        onOpenLearning(stepItem.targetSkill || topGapSkill)
      } else {
        router.push('/dashboard/learning')
      }
    } else if (stepItem.actionType === 'portfolio' || stepItem.type === 'portfolio') {
      router.push(stepItem.actionUrl || '/dashboard/portfolio')
    } else {
      router.push(stepItem.actionUrl || '/dashboard/opportunities')
    }
  }

  return (
    <div className='flex flex-col gap-5 w-full'>
      {/* Header section */}
      <div className='flex flex-col gap-0.5'>
        <h2 className='text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight'>
          Rute Pertumbuhan 30 Hari
        </h2>
        <p className='text-xs sm:text-sm text-slate-500 dark:text-slate-400'>
          Tiga langkah strategis terukur untuk mengakselerasi kesiapan Anda dari{' '}
          <strong className='text-blue-600 dark:text-blue-400 font-bold'>
            {career.readinessScore}%
          </strong>{' '}
          menuju target kerja optimal{' '}
          <strong className='text-emerald-600 dark:text-emerald-400 font-bold'>
            95%+
          </strong>
          .
        </p>
      </div>

      {/* Connected 3-Step Roadmap Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-5 relative'>
        {roadmapSteps.map((stepItem, index) => {
          const isStep1 = index === 0
          const isStep2 = index === 1

          // Visual badges and color accents
          const stepTheme = isStep1
            ? {
                badgeBg: 'bg-blue-600 text-white shadow-blue-500/25',
                ring: 'ring-4 ring-blue-100 dark:ring-blue-950/70',
                borderAccent: 'border-t-4 border-t-blue-500',
                chipBg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60',
                btnBg: 'bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-600 text-blue-700 dark:text-blue-300 hover:text-white border-blue-100 dark:border-blue-900/50',
                gainColor: 'text-[#16A34A] dark:text-emerald-400',
                icon: BookOpen,
                phaseLabel: 'Fase 1: Belajar'
              }
            : isStep2
            ? {
                badgeBg: 'bg-indigo-600 text-white shadow-indigo-500/25',
                ring: 'ring-4 ring-indigo-100 dark:ring-indigo-950/70',
                borderAccent: 'border-t-4 border-t-indigo-500',
                chipBg: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60',
                btnBg: 'bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-600 text-indigo-700 dark:text-indigo-300 hover:text-white border-indigo-100 dark:border-indigo-900/50',
                gainColor: 'text-[#16A34A] dark:text-emerald-400',
                icon: Layers,
                phaseLabel: 'Fase 2: Praktik'
              }
            : {
                badgeBg: 'bg-[#202282] text-white shadow-indigo-950/30',
                ring: 'ring-4 ring-slate-200 dark:ring-slate-800',
                borderAccent: 'border-t-4 border-t-[#202282]',
                chipBg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
                btnBg: 'bg-[#202282]/10 dark:bg-indigo-950/50 hover:bg-[#202282] text-[#202282] dark:text-indigo-300 hover:text-white border-indigo-200/60 dark:border-indigo-900/50',
                gainColor: 'text-[#202282] dark:text-indigo-400 font-extrabold',
                icon: Briefcase,
                phaseLabel: 'Fase 3: Melamar'
              }

          const ActionIcon = stepTheme.icon

          return (
            <div
              key={stepItem.step || index}
              className={`relative bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-5 group ${stepTheme.borderAccent}`}
            >
              {/* Connector arrow badge between cards on desktop */}
              {index < 2 && (
                <div
                  aria-hidden='true'
                  className='hidden md:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-md items-center justify-center text-slate-400 group-hover:border-blue-400 group-hover:text-blue-600 transition-colors pointer-events-none'
                >
                  <ArrowRight className='w-3.5 h-3.5 stroke-[2.5]' />
                </div>
              )}

              {/* Card Body */}
              <div className='flex flex-col gap-3.5'>
                {/* Step Top Bar: Node Number, Phase Tag, and Days Estimate */}
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2.5'>
                    <div
                      className={`w-7 h-7 rounded-full ${stepTheme.badgeBg} ${stepTheme.ring} flex items-center justify-center text-xs font-bold shrink-0 transition-transform group-hover:scale-105`}
                    >
                      {stepItem.step || index + 1}
                    </div>
                    <span className='text-[11px] font-semibold text-slate-500 dark:text-slate-400'>
                      {stepTheme.phaseLabel}
                    </span>
                  </div>

                  {/* Estimated Days Badge */}
                  <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'>
                    <Clock className='w-3 h-3 text-slate-400' />
                    <span>{stepItem.estDays}</span>
                  </span>
                </div>

                {/* Step Title & Personalized Description */}
                <div>
                  <h3 className='text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
                    {stepItem.title}
                  </h3>
                  <p className='text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed'>
                    {stepItem.description}
                  </p>
                </div>
              </div>

              {/* Card Footer: Clickable Action Button & Impact/Gain Badge */}
              <div className='pt-3.5 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3'>
                {/* Gain Readiness Percentage */}
                <div className='flex items-center justify-between text-xs'>
                  <span className='text-[11px] font-medium text-slate-400 dark:text-slate-500'>
                    Dampak Peningkatan:
                  </span>
                  <span className={`font-bold inline-flex items-center gap-1 ${stepTheme.gainColor}`}>
                    <CheckCircle2 className='w-3.5 h-3.5' />
                    <span>{stepItem.gainLabel}</span>
                  </span>
                </div>

                {/* Interactive Clickable Action Button */}
                <button
                  type='button'
                  onClick={() => handleStepAction(stepItem)}
                  className={`w-full py-2.5 px-3.5 rounded-xl border transition-all flex items-center justify-between text-xs font-semibold cursor-pointer shadow-2xs group/btn ${stepTheme.btnBg}`}
                >
                  <span className='inline-flex items-center gap-2'>
                    <ActionIcon className='w-4 h-4 shrink-0' />
                    <span>{stepItem.footerLabel}</span>
                  </span>
                  <ArrowRight className='w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform' />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
