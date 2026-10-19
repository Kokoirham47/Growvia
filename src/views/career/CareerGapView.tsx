'use client'

import React, { useState } from 'react'
import {
  TrendingUp,
  Briefcase,
  ChevronDown,
  CheckCircle2,
  Calendar,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react'
import HeroMatchCard from './HeroMatchCard'
import DetailedSkillMatrix from './DetailedSkillMatrix'
import GrowthRoadmap from './GrowthRoadmap'
import ChangeTargetModal from './ChangeTargetModal'
import ReanalyzeModal from './ReanalyzeModal'
import LearningResourcesModal from './LearningResourcesModal'
import SkillDetailModal from './SkillDetailModal'
import { CAREER_TARGETS } from './careerData'
import { CareerTargetProfile, SkillChipItem } from '@/types/career'

export default function CareerGapView() {
  // Current active career profile (default to 'associate-product-designer' matching the screenshot)
  const [career, setCareer] = useState<CareerTargetProfile>(
    CAREER_TARGETS['associate-product-designer']
  )

  // Modals state
  const [isChangeTargetOpen, setIsChangeTargetOpen] = useState(false)
  const [isReanalyzeOpen, setIsReanalyzeOpen] = useState(false)
  const [isLearningModalOpen, setIsLearningModalOpen] = useState(false)
  const [selectedSkillForDetail, setSelectedSkillForDetail] = useState<SkillChipItem | null>(null)
  const [learningSkillFilter, setLearningSkillFilter] = useState<string | undefined>(undefined)

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Handle career switch
  const handleSelectCareer = (newCareer: CareerTargetProfile) => {
    setCareer(newCareer)
    showToast(`Target karier dialihkan ke ${newCareer.title}`)
  }

  // Handle re-analyze completion
  const handleReanalyzeComplete = () => {
    setCareer(prev => ({
      ...prev,
      readinessScore: 82,
      lastUpdated: 'Baru saja dianalisis ulang',
      aiInsight:
        'Kalkulasi ulang selesai! Portofolio Telkom dan studi kasus kamu terverifikasi. Kesiapan kamu kini 82% siap melamar tier 1.'
    }))
    showToast('Analisis ulang AI berhasil! Skor kesiapan naik menjadi 82%.')
  }

  // Open learning modal with specific skill
  const handleOpenLearningWithSkill = (skillName?: string) => {
    setLearningSkillFilter(skillName)
    setIsLearningModalOpen(true)
  }

  return (
    <div
      style={{ fontFamily: "'Poppins', sans-serif" }}
      className='flex flex-col gap-6 w-full max-w-[1440px] mx-auto pb-12 font-["Poppins",sans-serif]'
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className='fixed bottom-6 right-6 z-[9999] animate-in fade-in slide-in-from-bottom-4 duration-300'>
          <div className='flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white shadow-xl border border-slate-700 text-xs sm:text-sm font-medium'>
            <div className='w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0'>
              <CheckCircle2 className='w-3.5 h-3.5 stroke-[2.8]' />
            </div>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* 1. PAGE HEADER (Exact match to screenshot) */}
      <section className='flex flex-col md:flex-row md:items-start md:justify-between gap-4 pt-1'>
        <div className='flex flex-col gap-1'>
          {/* Micro tag: ↗ ANALISIS PASAR & KESIAPAN */}
          <div className='inline-flex items-center gap-1.5 text-[#2563EB] dark:text-blue-400 text-xs font-bold tracking-wider uppercase'>
            <TrendingUp className='w-3.5 h-3.5' />
            <span>Analisis Pasar & Kesiapan</span>
          </div>

          {/* Title (H1): Karier & Analisis Skill Gap */}
          <h1 className='text-2xl sm:text-3xl font-extrabold text-[#1E293B] dark:text-white tracking-tight mt-0.5'>
            Karier & Analisis Skill Gap
          </h1>

          {/* Subtitle */}
          <p className='text-xs sm:text-sm text-[#64748B] dark:text-slate-400 max-w-2xl leading-relaxed'>
            Bandingkan skill yang kamu miliki dengan standar industri untuk posisi impianmu.
          </p>
        </div>

        {/* Right side: Target Posisi selector card & Readiness Badge */}
        <div className='flex items-center gap-3 shrink-0 self-start md:self-auto'>
          {/* Target Position Dropdown Card */}
          <button
            type='button'
            onClick={() => setIsChangeTargetOpen(true)}
            className='inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 transition-all text-left shadow-xs cursor-pointer group'
          >
            <div className='w-7 h-7 rounded-lg bg-[#EFF6FF] dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 flex items-center justify-center shrink-0'>
              <Briefcase className='w-4 h-4' />
            </div>
            <div className='flex flex-col pr-1'>
              <span className='text-[10px] text-slate-400 uppercase font-medium'>
                Target Posisi
              </span>
              <span className='text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight group-hover:text-blue-600 transition-colors'>
                {career.title}
              </span>
            </div>
            <ChevronDown className='w-3.5 h-3.5 text-slate-400 group-hover:translate-y-0.5 transition-transform' />
          </button>

          {/* Green Pill Badge: 78% Siap Melamar */}
          <div className='inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#ECFDF5] dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-[#16A34A] dark:text-emerald-400 text-xs font-bold shadow-xs'>
            <CheckCircle2 className='w-4 h-4 text-[#16A34A]' />
            <span>{career.readinessScore}% Siap Melamar</span>
          </div>
        </div>
      </section>

      {/* 2. CALIBRATION NOTIFICATION BAR (Exact match to screenshot) */}
      <div className='w-full px-4 py-2.5 rounded-xl bg-[#F0F5FF] dark:bg-blue-950/30 border border-[#DBEAFE] dark:border-blue-900/50 flex items-center gap-2.5 text-xs text-[#1E40AF] dark:text-blue-300'>
        <Calendar className='w-4 h-4 text-[#2563EB] shrink-0' />
        <span className='font-medium'>
          Dikalibrasi dengan {career.verifiedJobsCount}+ lowongan fresh graduate terverifikasi di {career.companyType} Indonesia ({career.lastUpdated})
        </span>
      </div>

      {/* 3. HERO MATCH SECTION (Donut Match Index 78% + 3 Metric Cards + AI Insight Banner) */}
      <HeroMatchCard career={career} />

      {/* 4. DETAIL PEMETAAN SKILL MATRIX (Hard Skills Industri + Soft Skills & Kolaborasi Cards) */}
      <DetailedSkillMatrix
        career={career}
        onOpenLearning={skillName => handleOpenLearningWithSkill(skillName)}
      />

      {/* 5. RUTE PERTUMBUHAN 30 HARI (3 Cards with Est. 3 Hari, Est. 5 Hari, Target Akhir + AI Button) */}
      <GrowthRoadmap
        career={career}
        onGeneratePersonalized={() => {
          showToast('Rencana belajar personalisasi AI berhasil diperbarui sesuai target 30 hari!')
        }}
      />

      {/* Modals */}
      <ChangeTargetModal
        isOpen={isChangeTargetOpen}
        currentCareerId={career.id}
        onClose={() => setIsChangeTargetOpen(false)}
        onSelectCareer={handleSelectCareer}
      />

      <ReanalyzeModal
        isOpen={isReanalyzeOpen}
        careerTitle={career.title}
        onClose={() => setIsReanalyzeOpen(false)}
        onComplete={handleReanalyzeComplete}
      />

      <LearningResourcesModal
        isOpen={isLearningModalOpen}
        initialSkillFilter={learningSkillFilter}
        onClose={() => setIsLearningModalOpen(false)}
      />

      <SkillDetailModal
        skill={selectedSkillForDetail}
        onClose={() => setSelectedSkillForDetail(null)}
        onOpenLearningForSkill={skillName => handleOpenLearningWithSkill(skillName)}
      />
    </div>
  )
}
