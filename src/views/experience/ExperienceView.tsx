'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Sparkles,
  Clock,
  Award,
  Layers,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  X,
  Users,
  Calendar,
  Laptop,
  FolderGit2,
  Trophy,
  Bookmark,
  TrendingUp
} from 'lucide-react'
import ExperienceCard from './ExperienceCard'
import ExperienceFormModal from './ExperienceFormModal'
import ExperienceDetailModal from './ExperienceDetailModal'
import DeleteExperienceModal from './DeleteExperienceModal'
import AiSmartExtractorPreview from './AiSmartExtractorPreview'
import AISkillReviewModal from './AISkillReviewModal'
import {
  ExperienceItem,
  ExperienceStats,
  EXPERIENCE_TYPE_CONFIG
} from './experienceUtils'

const FILTER_TABS = [
  { key: 'all', label: 'Semua', icon: Layers },
  { key: 'organisation', label: 'Organisasi', icon: Users },
  { key: 'committee', label: 'Kepanitiaan', icon: Calendar },
  { key: 'internship', label: 'Magang', icon: Laptop },
  { key: 'freelance', label: 'Freelance', icon: Briefcase },
  { key: 'project', label: 'Proyek', icon: FolderGit2 },
  { key: 'competition', label: 'Kompetisi', icon: Trophy },
  { key: 'other', label: 'Lainnya', icon: Bookmark }
]

export default function ExperienceView() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([])
  const [stats, setStats] = useState<ExperienceStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formInitialData, setFormInitialData] = useState<ExperienceItem | null>(null)

  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [detailExperience, setDetailExperience] = useState<ExperienceItem | null>(null)

  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deleteTargetExperience, setDeleteTargetExperience] = useState<ExperienceItem | null>(null)

  // AI Skill Review Modal State (F04 Core)
  const [isAiReviewOpen, setIsAiReviewOpen] = useState(false)
  const [aiReviewExperience, setAiReviewExperience] = useState<ExperienceItem | null>(null)
  const [aiCustomText, setAiCustomText] = useState<string | null>(null)

  const handleOpenAiReview = (exp: ExperienceItem) => {
    setAiReviewExperience(exp)
    setAiCustomText(null)
    setIsAiReviewOpen(true)
  }

  const handleOpenAiReviewCustomText = (text: string) => {
    setAiReviewExperience(null)
    setAiCustomText(text)
    setIsAiReviewOpen(true)
  }

  const handleAiReviewSuccess = (savedCount: number) => {
    fetchExperiences()
    setToastMessage(`🎉 Berhasil memvalidasi ${savedCount} skill baru ke profil Anda!`)
  }

  // Fetch experiences from API
  const fetchExperiences = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/experiences')
      const json = await res.json()

      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Gagal memuat daftar pengalaman')
      }

      setExperiences(json.data.experiences || [])
      setStats(json.data.stats || null)
    } catch (err: any) {
      console.error('Fetch experiences error:', err)
      setError(err.message || 'Terjadi kesalahan saat mengambil data pengalaman')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchExperiences()
  }, [fetchExperiences])

  // Toast auto-dismiss
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null)
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [toastMessage])

  // Client-side filtering for fast, snappy search
  const filteredExperiences = useMemo(() => {
    return experiences.filter(exp => {
      // Filter by type tab
      if (activeTab !== 'all' && exp.type !== activeTab) {
        return false
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchTitle = exp.title?.toLowerCase().includes(q)
        const matchRole = exp.role?.toLowerCase().includes(q)
        const matchInst = exp.institutionName?.toLowerCase().includes(q)
        const matchDesc = exp.description?.toLowerCase().includes(q)
        return matchTitle || matchRole || matchInst || matchDesc
      }

      return true
    })
  }, [experiences, activeTab, searchQuery])

  // Handlers for Modals
  const handleOpenAdd = () => {
    setFormInitialData(null)
    setIsFormOpen(true)
  }

  const handleOpenEdit = (exp: ExperienceItem) => {
    setFormInitialData(exp)
    setIsFormOpen(true)
  }

  const handleOpenDetail = (exp: ExperienceItem) => {
    setDetailExperience(exp)
    setIsDetailOpen(true)
  }

  const handleOpenDelete = (exp: ExperienceItem) => {
    setDeleteTargetExperience(exp)
    setIsDeleteOpen(true)
  }

  const handleFormSuccess = (savedExp: ExperienceItem, isEdit: boolean) => {
    fetchExperiences()
    setToastMessage(
      isEdit
        ? `Pengalaman "${savedExp.title}" berhasil diperbarui.`
        : `Pengalaman "${savedExp.title}" berhasil ditambahkan.`
    )

    // Otomatis buka dialog ekstraksi AI jika baru ditambahkan dan memiliki narasi deskripsi
    if (!isEdit && savedExp.description && savedExp.description.trim().length >= 30) {
      setTimeout(() => {
        handleOpenAiReview(savedExp)
      }, 500)
    }
  }

  const handleDeleteSuccess = (deletedId: string) => {
    fetchExperiences()
    setToastMessage('Pengalaman berhasil dihapus.')
  }

  // Find dominant experience type for stat
  const dominantType = useMemo(() => {
    if (!stats?.typeBreakdown) return null
    let maxCount = 0
    let dominantKey = ''
    for (const [key, count] of Object.entries(stats.typeBreakdown)) {
      if (key !== 'all' && count > maxCount) {
        maxCount = count
        dominantKey = key
      }
    }
    return dominantKey ? EXPERIENCE_TYPE_CONFIG[dominantKey]?.label : '-'
  }, [stats])

  return (
    <div className='min-h-screen space-y-6 pb-12'>
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className='fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300'>
          <div className='flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xl border border-slate-700 dark:border-slate-200 text-xs sm:text-sm font-semibold'>
            <CheckCircle2 className='w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0' />
            <span>{toastMessage}</span>
            <button
              type='button'
              onClick={() => setToastMessage(null)}
              className='ml-2 p-1 hover:opacity-75 transition-opacity cursor-pointer'
            >
              <X className='w-3.5 h-3.5' />
            </button>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <div className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/60 mb-2'>
            <Briefcase className='w-3.5 h-3.5' />
            <span>Rekam Jejak & Portofolio Aktivitas</span>
          </div>
          <h1 className='text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight'>
            Manajemen Pengalaman
          </h1>
          <p className='text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl'>
            Kelola pengalaman organisasi, kepanitiaan, magang, dan proyek Anda.
            AI akan mengekstrak skill dan bukti relevan untuk memperkuat portofolio Anda.
          </p>
        </div>

        {/* CTA Button */}
        <div className='shrink-0'>
          <button
            type='button'
            onClick={handleOpenAdd}
            className='inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
          >
            <Plus className='w-4 h-4' />
            <span>Tambah Pengalaman</span>
          </button>
        </div>
      </div>

      {/* Metrics Stat Cards (Consistent with Dashboard View) */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4'>
        {/* Card 1: Total Pengalaman */}
        <div className='bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all'>
          <div>
            <div className='flex items-center justify-between'>
              <span className='text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider'>
                Total Pengalaman
              </span>
              <div className='w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center'>
                <Briefcase className='w-4 h-4' />
              </div>
            </div>

            <div className='flex items-baseline gap-2 mt-3'>
              <span className='text-3xl font-extrabold text-[#1E293B] dark:text-white tracking-tight'>
                {stats?.total ?? 0}
              </span>
              <span className='inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'>
                <span>Tercatat Rapi</span>
              </span>
            </div>

            <div className='w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden'>
              <div
                className='bg-blue-600 h-full rounded-full transition-all duration-500'
                style={{ width: `${Math.min(100, Math.max(10, (stats?.total ?? 0) * 20))}%` }}
              />
            </div>
          </div>

          <p className='text-xs text-slate-500 dark:text-slate-400 mt-3 font-normal'>
            Riwayat aktivitas terdata di profil
          </p>
        </div>

        {/* Card 2: Sedang Aktif */}
        <div className='bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all'>
          <div>
            <div className='flex items-center justify-between'>
              <span className='text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider'>
                Sedang Aktif
              </span>
              <div className='w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center'>
                <Clock className='w-4 h-4' />
              </div>
            </div>

            <div className='flex items-baseline gap-2 mt-3'>
              <span className='text-3xl font-extrabold text-[#1E293B] dark:text-white tracking-tight'>
                {stats?.ongoing ?? 0}
              </span>
              <span className='inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'>
                <span>Sedang Berjalan</span>
              </span>
            </div>

            <div className='w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden'>
              <div
                className='bg-emerald-500 h-full rounded-full transition-all duration-500'
                style={{
                  width: `${
                    stats?.total && stats.total > 0
                      ? Math.min(100, Math.round(((stats.ongoing ?? 0) / stats.total) * 100))
                      : (stats?.ongoing ?? 0) > 0
                      ? 100
                      : 0
                  }%`
                }}
              />
            </div>
          </div>

          <p className='text-xs text-slate-500 dark:text-slate-400 mt-3 font-normal'>
            Aktivitas saat ini ditekuni
          </p>
        </div>

        {/* Card 3: Validasi Skill */}
        <div className='bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all'>
          <div>
            <div className='flex items-center justify-between'>
              <span className='text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider'>
                Validasi Skill
              </span>
              <div className='w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center'>
                <Award className='w-4 h-4' />
              </div>
            </div>

            <div className='flex items-baseline gap-2 mt-3'>
              <span className='text-3xl font-extrabold text-[#1E293B] dark:text-white tracking-tight'>
                {stats?.skillsExtracted ?? 0}
              </span>
              <span className='inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'>
                <span>Bukti Konkret</span>
              </span>
            </div>

            <div className='w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden'>
              <div
                className='bg-purple-600 h-full rounded-full transition-all duration-500'
                style={{
                  width: `${Math.min(100, Math.max(15, (stats?.skillsExtracted ?? 0) * 12))}%`
                }}
              />
            </div>
          </div>

          <p className='text-xs text-slate-500 dark:text-slate-400 mt-3 font-normal'>
            Terhubung bukti kegiatan
          </p>
        </div>

        {/* Card 4: Fokus Utama */}
        <div className='bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all'>
          <div>
            <div className='flex items-center justify-between'>
              <span className='text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider'>
                Fokus Utama
              </span>
              <div className='w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center'>
                <TrendingUp className='w-4 h-4' />
              </div>
            </div>

            <div className='flex items-baseline gap-2 mt-3 min-w-0'>
              <span className='text-xl sm:text-2xl font-extrabold text-[#1E293B] dark:text-white tracking-tight truncate'>
                {dominantType || '-'}
              </span>
              <span className='inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 shrink-0'>
                <span>Porsi Terbanyak</span>
              </span>
            </div>

            <div className='w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden'>
              <div
                className='bg-amber-500 h-full rounded-full transition-all duration-500'
                style={{ width: stats?.total ? '75%' : '0%' }}
              />
            </div>
          </div>

          <p className='text-xs text-slate-500 dark:text-slate-400 mt-3 font-normal'>
            Kategori paling dominan
          </p>
        </div>
      </div>

      {/* AI Smart Extractor Preview Component */}
      <AiSmartExtractorPreview
        onOpenLiveAiModal={handleOpenAiReviewCustomText}
        onConfirmSkills={(count) => {
          setToastMessage(`🎉 ${count} rekomendasi skill AI berhasil dikonfirmasi ke profil!`)
          fetchExperiences()
        }}
      />

      {/* Unified Search & Filter Card */}
      <div className='bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-4'>
        {/* Top Row: Search Input (Bounded Width) + Counter Indicator */}
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
          <div className='relative w-full sm:max-w-md'>
            <Search className='w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none' />
            <input
              type='text'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder='Cari judul, peran, institusi, atau kata kunci...'
              className='w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-900/60 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all'
            />
            {searchQuery && (
              <button
                type='button'
                onClick={() => setSearchQuery('')}
                className='absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer'
              >
                <X className='w-3.5 h-3.5' />
              </button>
            )}
          </div>

          <div className='text-xs text-slate-500 dark:text-slate-400 font-medium shrink-0 flex items-center gap-1.5'>
            <span>Menampilkan</span>
            <span className='font-bold text-slate-900 dark:text-white'>{filteredExperiences.length}</span>
            <span>dari</span>
            <span className='font-bold text-slate-900 dark:text-white'>{experiences.length}</span>
            <span>pengalaman</span>
          </div>
        </div>

        {/* Separator Line */}
        <div className='border-t border-slate-100 dark:border-slate-800/80' />

        {/* Bottom Row: Type Filter Tabs Pills */}
        <div className='flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar'>
          {FILTER_TABS.map(tab => {
            const isActive = activeTab === tab.key
            const TabIcon = tab.icon
            const count = stats?.typeBreakdown?.[tab.key] ?? 0

            return (
              <button
                key={tab.key}
                type='button'
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800'
                }`}
              >
                <TabIcon className='w-3.5 h-3.5 shrink-0' />
                <span>{tab.label}</span>
                {count > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {[1, 2, 3, 4].map(n => (
            <div
              key={n}
              className='p-6 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 animate-pulse space-y-3'
            >
              <div className='w-24 h-6 bg-slate-200 dark:bg-slate-800 rounded-full' />
              <div className='w-3/4 h-5 bg-slate-200 dark:bg-slate-800 rounded-lg' />
              <div className='w-1/2 h-4 bg-slate-200 dark:bg-slate-800 rounded-lg' />
              <div className='w-full h-12 bg-slate-100 dark:bg-slate-800/50 rounded-lg mt-3' />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className='p-8 rounded-3xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-center space-y-3'>
          <AlertCircle className='w-8 h-8 text-rose-500 mx-auto' />
          <h3 className='text-base font-bold text-rose-800 dark:text-rose-300'>
            Gagal Memuat Pengalaman
          </h3>
          <p className='text-xs text-rose-600 dark:text-rose-400 max-w-md mx-auto'>
            {error}
          </p>
          <button
            type='button'
            onClick={fetchExperiences}
            className='inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 transition-colors cursor-pointer'
          >
            <RotateCcw className='w-3.5 h-3.5' />
            <span>Coba Lagi</span>
          </button>
        </div>
      ) : experiences.length === 0 ? (
        /* Empty State: 0 Experiences in DB */
        <div className='p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-center space-y-4'>
          <div className='w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/60 flex items-center justify-center mx-auto shadow-sm'>
            <Briefcase className='w-8 h-8' />
          </div>
          <div className='max-w-md mx-auto'>
            <h3 className='text-lg font-bold text-slate-900 dark:text-white'>
              Belum Ada Pengalaman yang Ditambahkan
            </h3>
            <p className='text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed'>
              Dokumentasikan kepanitiaan kampus, organisasi mahasiswa, magang industri,
              atau proyek kuliah pertama Anda. AI kami akan mengekstrak skill secara
              otomatis!
            </p>
          </div>
          <button
            type='button'
            onClick={handleOpenAdd}
            className='inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
          >
            <Plus className='w-4 h-4' />
            <span>Tambah Pengalaman Pertama</span>
          </button>
        </div>
      ) : filteredExperiences.length === 0 ? (
        /* Empty State: Search / Filter yields 0 results */
        <div className='p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-center space-y-3'>
          <Search className='w-10 h-10 text-slate-400 mx-auto' />
          <h3 className='text-base font-bold text-slate-900 dark:text-white'>
            Tidak Ada Pengalaman yang Cocok
          </h3>
          <p className='text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto'>
            Tidak ditemukan pengalaman dengan kata kunci &quot;{searchQuery}&quot; pada filter
            tipe &quot;{activeTab}&quot;.
          </p>
          <button
            type='button'
            onClick={() => {
              setSearchQuery('')
              setActiveTab('all')
            }}
            className='inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750 transition-colors cursor-pointer'
          >
            <RotateCcw className='w-3.5 h-3.5' />
            <span>Reset Pencarian & Filter</span>
          </button>
        </div>
      ) : (
        /* Experiences Card Grid */
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5'>
          {filteredExperiences.map(exp => (
            <ExperienceCard
              key={exp.id}
              experience={exp}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
              onViewDetail={handleOpenDetail}
              onTriggerAI={handleOpenAiReview}
            />
          ))}
        </div>
      )}

      {/* Form Modal (Add & Edit) */}
      <ExperienceFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleFormSuccess}
        initialData={formInitialData}
      />

      {/* Detail Modal */}
      <ExperienceDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        experience={detailExperience}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        onTriggerAI={handleOpenAiReview}
      />

      {/* Delete Confirmation Modal */}
      <DeleteExperienceModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onSuccess={handleDeleteSuccess}
        experience={deleteTargetExperience}
      />

      {/* AI Skill Review Modal (F04 Core) */}
      <AISkillReviewModal
        isOpen={isAiReviewOpen}
        onClose={() => setIsAiReviewOpen(false)}
        onSuccess={handleAiReviewSuccess}
        experienceId={aiReviewExperience?.id || null}
        experienceData={aiReviewExperience}
        customText={aiCustomText}
      />
    </div>
  )
}
