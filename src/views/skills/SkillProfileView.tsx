'use client'

import React, { useState, useMemo, useEffect, useCallback } from 'react'

import Link from 'next/link'

import {
  Sparkles,
  Plus,
  FileDown,
  LayoutGrid,
  Network,
  ShieldCheck,
  Search,
  ChevronRight,
  TrendingUp,
  Check,
  RefreshCw,
  Loader2
} from 'lucide-react'

import SkillCategoryRow from './SkillCategoryRow'
import CompetencyBanner from './CompetencyBanner'
import SkillCard from './SkillCard'
import SkillMapGraph from './SkillMapGraph'
import EvidenceView from './EvidenceView'
import AddSkillModal from './AddSkillModal'
import EditSkillModal from './EditSkillModal'
import BenchmarkModal from './BenchmarkModal'
import type { SkillItem, SkillCategoryType, SkillCategorySummary, SkillMapNode, SkillMapEdge, EvidenceDetail } from '@/types/skills'

const CATEGORY_CONFIGS: { category: SkillCategoryType; label: string; color: string; bgLight: string; iconName: string }[] = [
  { category: 'soft_skill', label: 'Soft Skills', color: '#2563EB', bgLight: '#EFF6FF', iconName: 'Users' },
  { category: 'hard_skill', label: 'Hard Skills', color: '#6366F1', bgLight: '#EEF2FF', iconName: 'Target' },
  { category: 'technical', label: 'Technical', color: '#10B981', bgLight: '#ECFDF5', iconName: 'Code' },
  { category: 'leadership', label: 'Leadership', color: '#F59E0B', bgLight: '#FEF3C7', iconName: 'Trophy' }
]

export default function SkillProfileView() {
  // Navigation tab state: 'overview' | 'skill_map' | 'evidence'
  const [activeTab, setActiveTab] = useState<'overview' | 'skill_map' | 'evidence'>('overview')

  // Live Skills & Evidences State from Supabase
  const [skills, setSkills] = useState<SkillItem[]>([])
  const [evidences, setEvidences] = useState<EvidenceDetail[]>([])
  const [isLoading, setIsLoading] = useState(true)
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

  // Fetch skills & evidences from Supabase database via /api/skills
  const fetchSkills = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/skills')

      if (!res.ok) {
        if (res.status === 401) {
          return
        }

        return
      }

      const json = await res.json()

      if (json.success && json.data) {
        setSkills(json.data.skills || [])
        setEvidences(json.data.evidences || [])
      }
    } catch (err) {
      console.error('Gagal mengambil data skill dari database Supabase:', err)
      showToast('Gagal memuat data skill dari Supabase.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSkills()
  }, [fetchSkills])

  // Calculate dynamic category summaries from live skills
  const categorySummaries: SkillCategorySummary[] = useMemo(() => {
    const total = skills.length
    const counts: Record<SkillCategoryType, number> = {
      soft_skill: 0,
      hard_skill: 0,
      technical: 0,
      leadership: 0
    }

    skills.forEach(s => {
      if (counts[s.category] !== undefined) {
        counts[s.category]++
      }
    })

    return CATEGORY_CONFIGS.map(cfg => ({
      category: cfg.category,
      label: cfg.label,
      count: counts[cfg.category] || 0,
      percentage: total > 0 ? Math.round(((counts[cfg.category] || 0) / total) * 100) : 0,
      color: cfg.color,
      bgLight: cfg.bgLight,
      iconName: cfg.iconName
    }))
  }, [skills])

  // Dynamically compute SkillMapNodes from live skills
  const skillMapNodes: SkillMapNode[] = useMemo(() => {
    const total = skills.length

    if (total === 0) return []

    const centerX = 500
    const centerY = 260
    const radiusX = Math.min(360, 200 + total * 12)
    const radiusY = Math.min(180, 100 + total * 6)

    return skills.map((s, idx) => {
      let colorType: SkillMapNode['colorType'] = 'orange'

      if (s.score >= 85) colorType = 'green'
      else if (s.category === 'hard_skill') colorType = 'blue'
      else if (s.source === 'ai_extracted') colorType = 'indigo'

      const angle = (idx / total) * 2 * Math.PI - Math.PI / 2
      const x = Math.round(centerX + radiusX * Math.cos(angle))
      const y = Math.round(centerY + radiusY * Math.sin(angle))

      return {
        id: s.id,
        name: s.name,
        category: s.category,
        colorType,
        level: s.level,
        score: s.score,
        evidenceCount: s.evidenceCount,
        evidenceTags: s.evidenceTags,
        x,
        y
      }
    })
  }, [skills])

  // Dynamically compute SkillMapEdges from live skills
  const skillMapEdges: SkillMapEdge[] = useMemo(() => {
    if (skills.length < 2) return []

    const edges: SkillMapEdge[] = []
    const added = new Set<string>()

    for (let i = 0; i < skills.length; i++) {
      for (let j = i + 1; j < skills.length; j++) {
        const s1 = skills[i]
        const s2 = skills[j]
        const pairKey = [s1.id, s2.id].sort().join('--')

        if (added.has(pairKey)) continue

        const commonTag = s1.evidenceTags?.find(t => s2.evidenceTags?.includes(t))

        if (commonTag) {
          edges.push({
            source: s1.id,
            target: s2.id,
            relation: `Korelasi ${commonTag}`
          })
          added.add(pairKey)
        } else if (s1.category === s2.category && edges.length < skills.length * 1.5) {
          edges.push({
            source: s1.id,
            target: s2.id,
            relation: `Domain ${s1.category}`
          })
          added.add(pairKey)
        }
      }
    }

    if (edges.length === 0 && skills.length > 1) {
      for (let i = 0; i < skills.length; i++) {
        const next = (i + 1) % skills.length

        edges.push({
          source: skills[i].id,
          target: skills[next].id,
          relation: 'Jalur Kompetensi'
        })
      }
    }

    return edges
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

  // Handler: Add Skill (Saves to Supabase)
  const handleAddSkill = async (newSkillData: Omit<SkillItem, 'id'>) => {
    try {
      const res = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSkillData)
      })

      const json = await res.json()

      if (json.success && json.data) {
        setSkills(prev => [json.data, ...prev])
        showToast(`🎉 Berhasil menyimpan skill "${json.data.name}"!`)
      } else {
        showToast(`❌ ${json.message || 'Gagal menambahkan skill'}`)
      }
    } catch (err) {
      console.error('Error adding skill:', err)
      showToast('❌ Terjadi kesalahan saat menyimpan skill.')
    }
  }

  // Handler: Edit Skill Modal Open
  const handleOpenEdit = (skill: SkillItem) => {
    setSelectedSkillForEdit(skill)
    setIsEditModalOpen(true)
  }

  // Handler: Update Skill (Updates in Supabase)
  const handleUpdateSkill = async (updated: SkillItem) => {
    try {
      const res = await fetch('/api/skills', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      })

      const json = await res.json()

      if (json.success && json.data) {
        setSkills(prev => prev.map(s => (s.id === updated.id ? json.data : s)))
        showToast(`✅ Skill "${updated.name}" berhasil diperbarui di Supabase.`)
      } else {
        showToast(`❌ ${json.message || 'Gagal memperbarui skill'}`)
      }
    } catch (err) {
      console.error('Error updating skill:', err)
      showToast('❌ Terjadi kesalahan saat memperbarui skill.')
    }
  }

  // Handler: Delete Skill (Deletes from Supabase)
  const handleDeleteSkill = async (skillId: string) => {
    try {
      const res = await fetch(`/api/skills?id=${skillId}`, {
        method: 'DELETE'
      })

      const json = await res.json()

      if (json.success) {
        setSkills(prev => prev.filter(s => s.id !== skillId))
        setEvidences(prev => prev.filter(e => e.skillId !== skillId))
        showToast('🗑️ Skill berhasil dihapus dari Supabase.')
      } else {
        showToast(`❌ ${json.message || 'Gagal menghapus skill'}`)
      }
    } catch (err) {
      console.error('Error deleting skill:', err)
      showToast('❌ Terjadi kesalahan saat menghapus skill.')
    }
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
        <div>
          <div className='flex items-center gap-2.5'>
            <h1 className='text-2xl sm:text-3xl font-bold tracking-tight text-[#1E3A8A] dark:text-blue-400'>
              Skill Profile
            </h1>
            <span className='px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1'>
              <ShieldCheck className='w-3 h-3' />
              <span>Live Supabase</span>
            </span>
          </div>
          <p className='text-xs sm:text-sm text-[#64748B] dark:text-slate-400 mt-1'>
            {isLoading
              ? 'Memuat data skill dari database Supabase...'
              : `${skills.length} skill terverifikasi dari portofolio Anda dengan analisis distribusi kompetensi.`}
          </p>
        </div>

        {/* Action Buttons */}
        <div className='flex items-center gap-2.5 shrink-0'>
          <button
            type='button'
            onClick={fetchSkills}
            disabled={isLoading}
            className='inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer disabled:opacity-50'
            title='Muat Ulang dari Supabase'
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className='hidden sm:inline'>Refresh</span>
          </button>

          <button
            type='button'
            onClick={handleDownloadPdf}
            className='inline-flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-[#1E3A8A] dark:text-blue-300 border border-[#E2E8F0] dark:border-slate-700 text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer'
          >
            <FileDown className='w-4 h-4 text-[#2563EB]' />
            <span>Ekspor PDF</span>
          </button>

          <button
            type='button'
            onClick={() => setIsAddModalOpen(true)}
            className='inline-flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-xs hover:shadow-md cursor-pointer'
          >
            <Plus className='w-4 h-4' />
            <span>Tambah Skill</span>
          </button>
        </div>
      </header>

      {/* 2. SUB-NAVIGATION TABS */}
      <nav className='flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl w-fit text-xs sm:text-sm font-semibold border border-slate-200/80 dark:border-slate-700'>
        <button
          type='button'
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-white dark:bg-slate-900 text-[#1E3A8A] dark:text-blue-400 shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <LayoutGrid className='w-4 h-4' />
          <span>Matriks Skill</span>
        </button>

        <button
          type='button'
          onClick={() => setActiveTab('skill_map')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'skill_map'
              ? 'bg-white dark:bg-slate-900 text-[#1E3A8A] dark:text-blue-400 shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Network className='w-4 h-4' />
          <span>Skill Map (Graf)</span>
        </button>

        <button
          type='button'
          onClick={() => setActiveTab('evidence')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'evidence'
              ? 'bg-white dark:bg-slate-900 text-[#1E3A8A] dark:text-blue-400 shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <ShieldCheck className='w-4 h-4' />
          <span>Bukti Pengalaman ({evidences.length})</span>
        </button>
      </nav>

      {/* 3. TAB CONTENT */}
      {/* OVERVIEW / MATRIX */}
      {activeTab === 'overview' && (
        <div className='flex flex-col gap-6 animate-in fade-in duration-200'>
          {/* Top 4 Category Cards */}
          <SkillCategoryRow
            summaries={categorySummaries}
            activeCategory={activeCategoryFilter}
            onSelectCategory={cat => setActiveCategoryFilter(cat)}
          />

          {/* Competency Benchmark Highlight Banner */}
          <CompetencyBanner
            skills={skills}
            onOpenBenchmark={() => setIsBenchmarkModalOpen(true)}
          />

          {/* Search & Category Filter Toolbar */}
          <div className='flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs'>
            {/* Search Input */}
            <div className='relative flex-1 max-w-md'>
              <Search className='w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2' />
              <input
                type='text'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder='Cari skill atau tag portofolio...'
                className='w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all'
              />
            </div>

            {/* Filter Pills */}
            <div className='flex items-center gap-1.5 overflow-x-auto text-xs font-medium'>
              <button
                type='button'
                onClick={() => setActiveCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeCategoryFilter === 'all'
                    ? 'bg-[#1E3A8A] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Semua ({skills.length})
              </button>

              <button
                type='button'
                onClick={() => setActiveCategoryFilter('soft_skill')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeCategoryFilter === 'soft_skill'
                    ? 'bg-[#2563EB] text-white'
                    : 'bg-blue-50 text-[#2563EB] dark:bg-blue-950/40 dark:text-blue-300 hover:bg-blue-100'
                }`}
              >
                Soft Skills
              </button>

              <button
                type='button'
                onClick={() => setActiveCategoryFilter('hard_skill')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeCategoryFilter === 'hard_skill'
                    ? 'bg-[#6366F1] text-white'
                    : 'bg-indigo-50 text-[#6366F1] dark:bg-indigo-950/40 dark:text-indigo-300 hover:bg-indigo-100'
                }`}
              >
                Hard Skills
              </button>

              <button
                type='button'
                onClick={() => setActiveCategoryFilter('technical')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeCategoryFilter === 'technical'
                    ? 'bg-[#10B981] text-white'
                    : 'bg-emerald-50 text-[#10B981] dark:bg-emerald-950/40 dark:text-emerald-300 hover:bg-emerald-100'
                }`}
              >
                Technical
              </button>

              <button
                type='button'
                onClick={() => setActiveCategoryFilter('leadership')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeCategoryFilter === 'leadership'
                    ? 'bg-[#F59E0B] text-white'
                    : 'bg-amber-50 text-[#D97706] dark:bg-amber-950/40 dark:text-amber-300 hover:bg-amber-100'
                }`}
              >
                Leadership
              </button>
            </div>
          </div>

          {/* Loading State Skeleton */}
          {isLoading ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div
                  key={n}
                  className='p-5 rounded-[16px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-3 animate-pulse'
                >
                  <div className='flex items-center justify-between'>
                    <div className='h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-32' />
                    <div className='h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-16' />
                  </div>
                  <div className='h-3 bg-slate-100 dark:bg-slate-800/60 rounded-md w-24' />
                  <div className='h-2 bg-slate-100 dark:bg-slate-800 rounded-full w-full mt-2' />
                  <div className='flex gap-2 mt-2'>
                    <div className='h-5 bg-slate-100 dark:bg-slate-800 rounded-full w-14' />
                    <div className='h-5 bg-slate-100 dark:bg-slate-800 rounded-full w-14' />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredSkills.length === 0 ? (
            /* Empty State */
            <div className='flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 shadow-xs'>
              <div className='w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4'>
                <Sparkles className='w-7 h-7' />
              </div>
              <h3 className='font-bold text-base sm:text-lg text-slate-900 dark:text-white'>
                {searchQuery || activeCategoryFilter !== 'all'
                  ? 'Tidak Ada Skill yang Cocok'
                  : 'Belum Ada Skill di Profil Anda'}
              </h3>
              <p className='text-xs sm:text-sm text-slate-500 max-w-md mt-1 mb-6'>
                {searchQuery || activeCategoryFilter !== 'all'
                  ? 'Coba sesuaikan kata kunci pencarian atau ubah filter kategori skill Anda.'
                  : 'Data profil skill Anda di Supabase masih kosong. Tambahkan skill manual atau ekstrak otomatis dari pengalaman Anda menggunakan AI.'}
              </p>
              <div className='flex items-center gap-3'>
                <button
                  type='button'
                  onClick={() => setIsAddModalOpen(true)}
                  className='px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer shadow-xs'
                >
                  <Plus className='w-4 h-4' />
                  Tambah Skill
                </button>
                <Link
                  href='/experience'
                  className='px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all'
                >
                  <Sparkles className='w-4 h-4 text-amber-500' />
                  Ekstrak via Pengalaman
                </Link>
              </div>
            </div>
          ) : (
            /* Skills Grid */
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              {filteredSkills.map(skill => (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  onEdit={handleOpenEdit}
                  onViewEvidence={() => setActiveTab('evidence')}
                />
              ))}
            </div>
          )}

          {/* Bottom Career Upskilling Recommendation Card */}
          <section className='p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
            <div className='flex items-center gap-3.5'>
              <div className='w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-[#2563EB] shrink-0 font-bold'>
                <TrendingUp className='w-5 h-5' />
              </div>
              <div>
                <h4 className='font-bold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight'>
                  Eksplorasi Gap Kompetensi & Rekomendasi Modul
                </h4>
                <p className='text-xs sm:text-[13px] text-[#64748B] dark:text-slate-400 mt-0.5 leading-relaxed'>
                  Bandingkan profil skill ini dengan target karier impian Anda untuk menemukan rekomendasi belajar yang presisi.
                </p>
              </div>
            </div>

            <Link
              href='/career'
              className='inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-[#2563EB] dark:text-blue-300 border border-[#DBEAFE] dark:border-blue-900/60 text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer'
            >
              <span>Analisis Career Gap</span>
              <ChevronRight className='w-4 h-4' />
            </Link>
          </section>
        </div>
      )}

      {/* SKILL MAP TAB */}
      {activeTab === 'skill_map' && (
        <div className='flex flex-col gap-5 animate-in fade-in duration-200'>
          <div className='flex flex-col gap-1'>
            <h3 className='text-lg font-bold text-[#1E3A8A] dark:text-blue-400 tracking-tight'>
              Skill Map Visualizer
            </h3>
            <p className='text-xs text-[#64748B] dark:text-slate-400'>
              Peta korelasi kompetensi interaktif berdasarkan data Supabase dan bukti portofolio
            </p>
          </div>

          {isLoading ? (
            <div className='h-[450px] flex items-center justify-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800'>
              <Loader2 className='w-8 h-8 animate-spin text-blue-600' />
            </div>
          ) : skillMapNodes.length === 0 ? (
            <div className='h-[350px] flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800'>
              <Network className='w-12 h-12 text-slate-300 dark:text-slate-700 mb-3' />
              <h4 className='font-bold text-slate-800 dark:text-slate-200 text-sm'>
                Belum Ada Node Graf Skill
              </h4>
              <p className='text-xs text-slate-500 mt-1 max-w-sm'>
                Tambahkan skill ke profil Anda untuk melihat visualisasi relasi jaringan kompetensi secara otomatis.
              </p>
            </div>
          ) : (
            <SkillMapGraph
              nodes={skillMapNodes}
              edges={skillMapEdges}
              onSelectSkill={skillId => {
                const matched = skills.find(s => s.id === skillId)

                if (matched) {
                  handleOpenEdit(matched)
                }
              }}
            />
          )}
        </div>
      )}

      {/* EVIDENCE TAB */}
      {activeTab === 'evidence' && (
        <div className='flex flex-col gap-5 animate-in fade-in duration-200'>
          <div className='flex flex-col gap-1'>
            <h3 className='text-lg font-bold text-[#1E3A8A] dark:text-blue-400 tracking-tight'>
              Katalog Bukti Empiris & Rekam Jejak
            </h3>
            <p className='text-xs text-[#64748B] dark:text-slate-400'>
              Daftar bukti autentik dari data pengalaman yang tercatat di Supabase
            </p>
          </div>

          {isLoading ? (
            <div className='h-[300px] flex items-center justify-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800'>
              <Loader2 className='w-8 h-8 animate-spin text-blue-600' />
            </div>
          ) : (
            <EvidenceView
              evidences={evidences}
              onOpenAddSkill={() => setIsAddModalOpen(true)}
            />
          )}
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
        skills={skills}
        onClose={() => setIsBenchmarkModalOpen(false)}
      />
    </div>
  )
}
