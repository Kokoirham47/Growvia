'use client'

import React, { useState, useMemo } from 'react'
import {
  Sparkles,
  Plus,
  FileDown,
  LayoutGrid,
  Network,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  ChevronRight,
  Info,
  Check
} from 'lucide-react'
import SkillCategoryRow from './SkillCategoryRow'
import CompetencyBanner from './CompetencyBanner'
import SkillCard from './SkillCard'
import SkillMapGraph from './SkillMapGraph'
import EvidenceView from './EvidenceView'
import AddSkillModal from './AddSkillModal'
import EditSkillModal from './EditSkillModal'
import BenchmarkModal from './BenchmarkModal'
import {
  INITIAL_SKILLS,
  CATEGORY_SUMMARIES,
  SKILL_MAP_NODES,
  SKILL_MAP_EDGES,
  EVIDENCE_DETAILS
} from './skillsData'
import { SkillItem, SkillCategoryType } from '@/types/skills'

export default function SkillProfileView() {
  // Navigation tab state: 'overview' | 'skill_map' | 'evidence'
  const [activeTab, setActiveTab] = useState<'overview' | 'skill_map' | 'evidence'>('overview')

  // Skills State
  const [skills, setSkills] = useState<SkillItem[]>(INITIAL_SKILLS)
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<SkillCategoryType | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedSkillForEdit, setSelectedSkillForEdit] = useState<SkillItem | null>(null)
  const [isBenchmarkModalOpen, setIsBenchmarkModalOpen] = useState(false)

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Calculate dynamic category summaries
  const categorySummaries = useMemo(() => {
    const total = skills.length || 1
    const counts: Record<SkillCategoryType, number> = {
      soft_skill: 0,
      hard_skill: 0,
      technical: 0,
      leadership: 0
    }

    skills.forEach(s => {
      counts[s.category] = (counts[s.category] || 0) + 1
    })

    return CATEGORY_SUMMARIES.map(summary => ({
      ...summary,
      count: counts[summary.category] || 0,
      percentage: Math.round(((counts[summary.category] || 0) / total) * 100)
    }))
  }, [skills])

  // Filter skills based on search & category
  const filteredSkills = useMemo(() => {
    return skills.filter(item => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.subCategory && item.subCategory.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.evidenceTags && item.evidenceTags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))

      const matchesCategory =
        activeCategoryFilter === 'all' || item.category === activeCategoryFilter

      return matchesSearch && matchesCategory
    })
  }, [skills, searchQuery, activeCategoryFilter])

  // Handler: Add Skill
  const handleAddSkill = (newSkillData: Omit<SkillItem, 'id'>) => {
    const newSkill: SkillItem = {
      ...newSkillData,
      id: `skill-${Date.now()}`
    }
    setSkills(prev => [newSkill, ...prev])
    showToast(`🎉 Berhasil menambahkan skill "${newSkill.name}"!`)
  }

  // Handler: Edit Skill
  const handleOpenEdit = (skill: SkillItem) => {
    setSelectedSkillForEdit(skill)
    setIsEditModalOpen(true)
  }

  const handleUpdateSkill = (updated: SkillItem) => {
    setSkills(prev => prev.map(s => (s.id === updated.id ? updated : s)))
    showToast(`✅ Skill "${updated.name}" berhasil diperbarui.`)
  }

  const handleDeleteSkill = (skillId: string) => {
    setSkills(prev => prev.filter(s => s.id !== skillId))
    showToast('🗑️ Skill berhasil dihapus.')
  }

  // Handler: Download PDF Matrix
  const handleDownloadPdf = () => {
    window.print()
    showToast('📄 Menyiapkan dokumen matriks skill untuk dicetak / disimpan PDF...')
  }

  return (
    <div className="w-full max-w-[1100px] mx-auto px-4 sm:px-6 py-6 font-['Poppins',sans-serif] flex flex-col gap-6 text-slate-800 dark:text-slate-100">
      {/* Toast Notification */}
      {toastMessage && (
        <div className='fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 text-white shadow-xl border border-slate-800 text-xs sm:text-sm animate-in slide-in-from-bottom-3 duration-200'>
          <Check className='w-4 h-4 text-emerald-400 shrink-0' />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. PAGE HEADER */}
      <header className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-1'>
        {/* Title & Sub-text */}
        <div className='flex flex-col gap-1'>
          <div className='flex items-center gap-2.5 flex-wrap'>
            <h1 className='text-3xl sm:text-[34px] font-bold text-[#1E3A8A] dark:text-blue-400 tracking-tight'>
              Skill Profile
            </h1>

            {/* AI Verified Pill Badge */}
            <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2FF] text-[#6366F1] dark:bg-indigo-950/60 dark:text-indigo-300 border border-[#E0E7FF] dark:border-indigo-900/60 text-xs font-semibold'>
              <Sparkles className='w-3.5 h-3.5' />
              <span>Terverifikasi AI</span>
            </div>
          </div>

          <p className='text-sm text-[#64748B] dark:text-slate-400 font-normal'>
            {skills.length} skill terverifikasi dari 5 pengalaman organisasi & magang
          </p>
        </div>

        {/* Right Buttons: Unduh Matriks (PDF) & + Tambah Skill (outline style) */}
        <div className='flex items-center gap-3 shrink-0'>
          <button
            type='button'
            onClick={handleDownloadPdf}
            className='inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold transition-all shadow-xs hover:border-slate-300 dark:hover:border-slate-700 active:scale-[0.98] cursor-pointer'
          >
            <FileDown className='w-4 h-4 text-[#2563EB]' />
            <span>Unduh Matriks (PDF)</span>
          </button>

          {/* "+ Tambah Skill" button (outline style as specified) */}
          <button
            type='button'
            onClick={() => setIsAddModalOpen(true)}
            className='inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-[#2563EB] bg-transparent hover:bg-blue-50 dark:hover:bg-blue-950/40 text-[#2563EB] dark:text-blue-400 text-xs sm:text-sm font-bold transition-all shadow-xs hover:shadow active:scale-[0.98] cursor-pointer'
          >
            <Plus className='w-4 h-4 stroke-[2.5]' />
            <span>+ Tambah Skill</span>
          </button>
        </div>
      </header>

      {/* 2. TAB NAVIGATION */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-200/80 dark:border-slate-800'>
        {/* Navigation Tabs */}
        <div className='flex items-center gap-2'>
          <button
            type='button'
            onClick={() => setActiveTab('overview')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-blue-50 dark:bg-blue-950/50 text-[#2563EB] dark:text-blue-400 border border-blue-200/80 dark:border-blue-900/60 shadow-xs'
                : 'text-[#64748B] dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <LayoutGrid className='w-4 h-4' />
            <span>Overview</span>
          </button>

          <button
            type='button'
            onClick={() => setActiveTab('skill_map')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'skill_map'
                ? 'bg-blue-50 dark:bg-blue-950/50 text-[#2563EB] dark:text-blue-400 border border-blue-200/80 dark:border-blue-900/60 shadow-xs'
                : 'text-[#64748B] dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Network className='w-4 h-4' />
            <span>Skill Map</span>
          </button>

          <button
            type='button'
            onClick={() => setActiveTab('evidence')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'evidence'
                ? 'bg-blue-50 dark:bg-blue-950/50 text-[#2563EB] dark:text-blue-400 border border-blue-200/80 dark:border-blue-900/60 shadow-xs'
                : 'text-[#64748B] dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className='w-4 h-4' />
            <span>Evidence & Bukti</span>
          </button>
        </div>

        {/* Right Status Indicator: Sinkronisasi Portofolio Aktif */}
        <div className='flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400'>
          <span className='relative flex h-2.5 w-2.5'>
            <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75'></span>
            <span className='relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500'></span>
          </span>
          <span>Sinkronisasi Portofolio Aktif</span>
        </div>
      </div>

      {/* 3. TAB CONTENT */}
      {/* ============================================================ */}
      {/* TAB: OVERVIEW */}
      {/* ============================================================ */}
      {activeTab === 'overview' && (
        <div className='flex flex-col gap-6 animate-in fade-in duration-200'>
          {/* 1. Skill category summary row (4 stat mini-cards) */}
          <section>
            <SkillCategoryRow
              summaries={categorySummaries}
              activeCategory={activeCategoryFilter}
              onSelectCategory={setActiveCategoryFilter}
            />
          </section>

          {/* Competency Distribution Benchmark Banner */}
          <section>
            <CompetencyBanner onOpenBenchmark={() => setIsBenchmarkModalOpen(true)} />
          </section>

          {/* Filter & Search Bar */}
          <div className='flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1'>
            <div className='relative flex-1 max-w-sm'>
              <Search className='w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2' />
              <input
                type='text'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder='Cari nama skill atau pengalaman...'
                className='w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs'
              />
            </div>

            {/* Active category filter feedback */}
            {activeCategoryFilter !== 'all' && (
              <div className='flex items-center gap-2 text-xs'>
                <span className='text-slate-500'>Filter kategori:</span>
                <span className='font-semibold text-[#2563EB] bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-900/60'>
                  {categorySummaries.find(c => c.category === activeCategoryFilter)?.label}
                </span>
                <button
                  type='button'
                  onClick={() => setActiveCategoryFilter('all')}
                  className='text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 underline ml-1 cursor-pointer'
                >
                  Reset
                </button>
              </div>
            )}
          </div>

          {/* 2. Skill list (card grid, 3 columns) */}
          <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
            {filteredSkills.map(skill => (
              <SkillCard
                key={skill.id}
                skill={skill}
                onEdit={handleOpenEdit}
                onViewEvidence={() => setActiveTab('evidence')}
              />
            ))}
          </section>

          {/* Empty state if search doesn't match */}
          {filteredSkills.length === 0 && (
            <div className='text-center py-12 px-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'>
              <Search className='w-8 h-8 text-slate-300 mx-auto mb-2' />
              <h4 className='font-bold text-slate-700 dark:text-slate-200 text-sm'>
                Tidak ada skill yang cocok dengan pencarian
              </h4>
              <p className='text-xs text-slate-400 mt-1'>
                Coba gunakan kata kunci lain atau reset filter kategori.
              </p>
              <button
                type='button'
                onClick={() => {
                  setSearchQuery('')
                  setActiveCategoryFilter('all')
                }}
                className='mt-3 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer'
              >
                Reset Pencarian
              </button>
            </div>
          )}

          {/* Bottom Recommendation Banner */}
          <section className='p-5 rounded-[16px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
            <div className='flex items-center gap-3.5'>
              <div className='w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-[#2563EB] shrink-0'>
                <TrendingUp className='w-6 h-6' />
              </div>
              <div>
                <h4 className='font-bold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight'>
                  Lengkapi 1 Skill Tambahan
                </h4>
                <p className='text-xs sm:text-[13px] text-[#64748B] dark:text-slate-400 mt-0.5 leading-relaxed'>
                  Tambahkan bukti sertifikasi untuk Data Analytics untuk membuka kecocokan 94% pada posisi Associate Product Manager.
                </p>
              </div>
            </div>

            <a
              href='/learning'
              className='inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-[#2563EB] dark:text-blue-300 border border-[#DBEAFE] dark:border-blue-900/60 text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer'
            >
              <span>Cari Rekomendasi Modul</span>
              <ChevronRight className='w-4 h-4' />
            </a>
          </section>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB: SKILL MAP */}
      {/* ============================================================ */}
      {activeTab === 'skill_map' && (
        <div className='flex flex-col gap-5 animate-in fade-in duration-200'>
          <div className='flex flex-col gap-1'>
            <h3 className='text-lg font-bold text-[#1E3A8A] dark:text-blue-400 tracking-tight'>
              Skill Map Visualizer
            </h3>
            <p className='text-xs text-[#64748B] dark:text-slate-400'>
              Peta korelasi kompetensi interaktif berdasarkan akumulasi bukti pengalaman empiris
            </p>
          </div>

          <SkillMapGraph
            nodes={SKILL_MAP_NODES}
            edges={SKILL_MAP_EDGES}
            onSelectSkill={skillId => {
              const matched = skills.find(s => s.id === skillId)
              if (matched) {
                handleOpenEdit(matched)
              }
            }}
          />
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB: EVIDENCE */}
      {/* ============================================================ */}
      {activeTab === 'evidence' && (
        <div className='flex flex-col gap-5 animate-in fade-in duration-200'>
          <div className='flex flex-col gap-1'>
            <h3 className='text-lg font-bold text-[#1E3A8A] dark:text-blue-400 tracking-tight'>
              Katalog Bukti Empiris & Rekam Jejak
            </h3>
            <p className='text-xs text-[#64748B] dark:text-slate-400'>
              Setiap skill tervalidasi didukung oleh catatan kinerja pada organisasi, kepanitiaan, atau magang
            </p>
          </div>

          <EvidenceView
            evidences={EVIDENCE_DETAILS}
            onOpenAddSkill={() => setIsAddModalOpen(true)}
          />
        </div>
      )}

      {/* 4. INTERACTIVE MODALS */}
      <AddSkillModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddSkill={handleAddSkill}
      />

      <EditSkillModal
        isOpen={isEditModalOpen}
        skill={selectedSkillForEdit}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedSkillForEdit(null)
        }}
        onUpdateSkill={handleUpdateSkill}
        onDeleteSkill={handleDeleteSkill}
      />

      <BenchmarkModal
        isOpen={isBenchmarkModalOpen}
        onClose={() => setIsBenchmarkModalOpen(false)}
      />
    </div>
  )
}
