'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  TrendingUp,
  Plus,
  ChevronRight,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Award,
  AlertTriangle,
  Share2,
  FolderOpen,
  Target,
  BarChart2,
  Briefcase,
  CheckCircle2,
  Sliders,
  Laptop,
  Users,
  Flag,
  Zap,
  Clock,
  Download,
  AlertCircle,
  X,
  Loader2,
  RefreshCw,
  Compass
} from 'lucide-react'

interface DashboardSummaryData {
  user: {
    name: string
    headline: string
    avatarUrl?: string | null
    dateFormatted: string
    semesterTag: string
  }
  statCards: {
    careerReadiness: {
      percentage: number
      trend: string
      targetRole: string
      note: string
    }
    totalSkills: {
      count: number
      hardSkillsCount: number
      softSkillsCount: number
    }
    skillGaps: {
      count: number
      label: string
      targetRole: string
    }
    publicPortfolio: {
      completeness: number
      status: string
      previewUrl: string
    }
  }
  metodologi: {
    experiencesCount: number
    skillsCount: number
    gapCount: number
    opportunitiesCount: number
  }
  aiInsight: {
    projectName: string
    skills: string[]
    level: string
  }
  recentExperiences: Array<{
    id: string
    role?: string
    company?: string
    title: string
    dateFormatted: string
    validatedSkillsCount: number
    skills: string[]
    type: string
  }>
  targetCareer: {
    roleName: string
    industry: string
    matchPercent: number
    threshold: number
    missingSkillsCount: number
    gaps: Array<{
      name: string
      status: 'missing' | 'develop' | string
    }>
  }
  rapidModules: Array<{
    id: string
    type: string
    duration: string
    title: string
    description: string
    gapTag: string
    ctaText: string
    url: string
  }>
}

export default function DashboardView() {
  const [data, setData] = useState<DashboardSummaryData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Interactive AI Insight state
  const [insightStatus, setInsightStatus] = useState<'idle' | 'accepted' | 'dismissed'>('idle')
  const [isInsightSaving, setIsInsightSaving] = useState(false)

  // Quick Add Experience Modal
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false)
  const [isSubmittingExp, setIsSubmittingExp] = useState(false)
  const [expForm, setExpForm] = useState({
    title: '',
    institutionName: '',
    type: 'internship',
    description: ''
  })

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const res = await fetch('/api/dashboard/summary')
      const json = await res.json()

      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Gagal memuat data dashboard dari Supabase.')
      }

      setData(json.data)
    } catch (err: unknown) {
      console.error('Error fetching dashboard summary:', err)
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan sistem saat mengambil data Supabase.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const handleQuickAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!expForm.title || !expForm.institutionName) return

    try {
      setIsSubmittingExp(true)
      const res = await fetch('/api/experiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: expForm.title,
          role: expForm.title,
          institutionName: expForm.institutionName,
          type: expForm.type,
          startDate: new Date().toISOString(),
          isOngoing: true,
          description: expForm.description
        })
      })

      if (res.ok) {
        setIsQuickAddOpen(false)
        setExpForm({
          title: '',
          institutionName: '',
          type: 'internship',
          description: ''
        })
        await fetchDashboardData()
      } else {
        const errJson = await res.json()
        alert(errJson.message || 'Gagal menyimpan pengalaman ke Supabase.')
      }
    } catch (err) {
      console.error('Error quick adding experience:', err)
      alert('Terjadi kesalahan koneksi ke Supabase.')
    } finally {
      setIsSubmittingExp(false)
    }
  }

  const handleAcceptInsight = async () => {
    try {
      setIsInsightSaving(true)
      // Simulate quick acceptance feedback or post to api
      setTimeout(() => {
        setIsInsightSaving(false)
        setInsightStatus('accepted')
      }, 400)
    } catch (err) {
      setIsInsightSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className='flex flex-col gap-6 w-full max-w-[1440px] mx-auto p-8 bg-[#F5F6F8] font-["Poppins",sans-serif] animate-pulse'>
        {/* Skeleton Greeting Hero */}
        <div className='h-40 rounded-2xl bg-slate-200' />

        {/* Skeleton Top Row 4 Stat Cards */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className='h-36 rounded-2xl bg-white border border-[#E8ECF2] p-5' />
          ))}
        </div>

        {/* Skeleton 2-Column Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
          <div className='lg:col-span-8 flex flex-col gap-6'>
            <div className='h-48 rounded-2xl bg-white border border-[#E8ECF2] p-6' />
            <div className='h-40 rounded-2xl bg-[#EEF2FF] border border-[#E0E7FF] p-6' />
            <div className='h-64 rounded-2xl bg-white border border-[#E8ECF2] p-6' />
          </div>
          <div className='lg:col-span-4 flex flex-col gap-6'>
            <div className='h-80 rounded-2xl bg-white border border-[#E8ECF2] p-6' />
            <div className='h-64 rounded-2xl bg-white border border-[#E8ECF2] p-6' />
          </div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[500px] gap-4 text-center p-8 bg-[#F5F6F8] font-["Poppins",sans-serif]'>
        <div className='w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center'>
          <AlertCircle className='w-7 h-7' />
        </div>
        <h3 className='text-xl font-bold text-[#0F172A]'>Gagal Memuat Data Supabase</h3>
        <p className='text-sm text-slate-500 max-w-md'>{error}</p>
        <button
          type='button'
          onClick={fetchDashboardData}
          className='inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold transition-all shadow-sm'
        >
          <RefreshCw className='w-4 h-4' />
          <span>Coba Muat Ulang</span>
        </button>
      </div>
    )
  }

  const userFirstName = data.user.name ? data.user.name.split(' ')[0] : 'Nabila'

  return (
    <div
      style={{ fontFamily: "'Poppins', sans-serif" }}
      className='flex flex-col gap-6 w-full max-w-[1440px] mx-auto p-6 md:p-8 bg-[#F5F6F8] text-slate-800'
    >
      {/* 1. TOP GREETING HERO CARD */}
      <section className='relative overflow-hidden rounded-2xl border border-[#EEF2FF] bg-gradient-to-r from-[#F4F7FF] via-[#F8FAFF] to-[#FAF5FF] p-6 sm:p-7 shadow-xs'>
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
          {/* Left Greeting Text */}
          <div className='flex flex-col gap-2 max-w-2xl'>
            <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-semibold border border-[#DBEAFE] w-fit shadow-2xs'>
              <Compass className='w-3.5 h-3.5' />
              <span>{data.user.semesterTag || 'Semester 7 Ready • Target Q3 2025'}</span>
            </div>

            <h1 className='text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight flex items-center gap-2'>
              <span>Halo, {userFirstName}!</span>
              <span className='inline-block origin-[70%_70%] animate-wave'>👋</span>
            </h1>

            <p className='text-xs sm:text-sm text-slate-600 leading-relaxed'>
              Kamu sudah mendokumentasikan <strong className='font-semibold text-slate-900'>{data.metodologi.experiencesCount} pengalaman</strong>. Growvia AI menemukan <strong className='font-semibold text-[#2563EB]'>{data.metodologi.skillsCount} skill terverifikasi</strong> dan 2 potensi jalur karier impianmu.
            </p>
          </div>

          {/* Right Action Buttons */}
          <div className='flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0'>
            <button
              type='button'
              onClick={() => setIsQuickAddOpen(true)}
              className='inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all active:scale-[0.98] cursor-pointer'
            >
              <Plus className='w-4 h-4' />
              <span>Tambah Pengalaman Baru</span>
            </button>

            <Link
              href='/career'
              className='inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs hover:shadow-xs transition-all'
            >
              <TrendingUp className='w-4 h-4 text-[#2563EB]' />
              <span>Eksplor Skill Gap</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. ROW OF 4 STAT CARDS */}
      <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {/* Stat Card 1: Skor Kesiapan Karier */}
        <div className='bg-white rounded-2xl border border-[#E8ECF2] p-5 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between'>
          <div>
            <div className='flex items-center justify-between'>
              <span className='text-xs font-semibold text-slate-600'>Skor Kesiapan Karier</span>
              <div className='w-7 h-7 rounded-full bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shadow-2xs'>
                <ShieldCheck className='w-4 h-4' />
              </div>
            </div>

            <div className='flex items-baseline gap-2 mt-2'>
              <h2 className='text-3xl font-extrabold text-[#0F172A] tracking-tight'>
                {data.statCards.careerReadiness.percentage}%
              </h2>
              <span className='text-[11px] font-semibold text-[#16A34A] leading-tight flex items-center gap-0.5'>
                <TrendingUp className='w-3 h-3' />
                <span>{data.statCards.careerReadiness.trend}</span>
              </span>
            </div>

            {/* Progress bar */}
            <div className='w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden'>
              <div
                className='h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-1000'
                style={{ width: `${data.statCards.careerReadiness.percentage}%` }}
              />
            </div>
          </div>

          <p className='text-xs text-slate-500 mt-2.5 font-normal'>
            {data.statCards.careerReadiness.note}
          </p>
        </div>

        {/* Stat Card 2: Skill Tervalidasi */}
        <div className='bg-white rounded-2xl border border-[#E8ECF2] p-5 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between'>
          <div>
            <div className='flex items-center justify-between'>
              <span className='text-xs font-semibold text-slate-600'>Skill Tervalidasi</span>
              <div className='w-7 h-7 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shadow-2xs'>
                <Award className='w-4 h-4' />
              </div>
            </div>

            <div className='flex items-baseline gap-1 mt-2'>
              <h2 className='text-3xl font-extrabold text-[#0F172A] tracking-tight'>
                {data.statCards.totalSkills.count}
              </h2>
              <span className='text-sm font-semibold text-slate-500 ml-1'>Skill</span>
            </div>
          </div>

          <div className='mt-3'>
            <span className='inline-flex items-center px-2.5 py-1 rounded-lg bg-[#F8FAFC] border border-slate-100 text-xs font-medium text-slate-600'>
              {data.statCards.totalSkills.hardSkillsCount} Hard Skill • {data.statCards.totalSkills.softSkillsCount} Soft Skill
            </span>
          </div>
        </div>

        {/* Stat Card 3: Skill Gap Terdeteksi */}
        <div className='bg-white rounded-2xl border border-[#E8ECF2] p-5 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between'>
          <div>
            <div className='flex items-center justify-between'>
              <span className='text-xs font-semibold text-slate-600'>Skill Gap Terdeteksi</span>
              <div className='w-7 h-7 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shadow-2xs'>
                <AlertTriangle className='w-4 h-4' />
              </div>
            </div>

            <div className='flex items-baseline gap-1 mt-2'>
              <h2 className='text-3xl font-extrabold text-[#D97706] tracking-tight'>
                {data.statCards.skillGaps.count}
              </h2>
              <span className='text-sm font-semibold text-slate-700 ml-1'>
                {data.statCards.skillGaps.label}
              </span>
            </div>
          </div>

          <p className='text-xs text-slate-500 mt-3 font-normal'>
            Dibutuhkan untuk Target: {data.statCards.skillGaps.targetRole}
          </p>
        </div>

        {/* Stat Card 4: Portofolio Publik */}
        <div className='bg-white rounded-2xl border border-[#E8ECF2] p-5 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between'>
          <div>
            <div className='flex items-center justify-between'>
              <span className='text-xs font-semibold text-slate-600'>Portofolio Publik</span>
              <div className='w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shadow-2xs'>
                <Share2 className='w-4 h-4' />
              </div>
            </div>

            <div className='flex items-baseline gap-1 mt-2'>
              <h2 className='text-3xl font-extrabold text-[#0F172A] tracking-tight'>
                {data.statCards.publicPortfolio.completeness}%
              </h2>
              <span className='text-xs font-semibold text-slate-500 ml-1'>Kelengkapan</span>
            </div>
          </div>

          <div className='flex items-center justify-between mt-3 pt-1'>
            <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D] text-[11px] font-semibold'>
              <span className='w-1.5 h-1.5 rounded-full bg-[#15803D]' />
              <span>{data.statCards.publicPortfolio.status}</span>
            </span>

            <Link
              href={data.statCards.publicPortfolio.previewUrl}
              className='inline-flex items-center gap-0.5 text-xs font-semibold text-[#2563EB] hover:underline'
            >
              <span>Preview</span>
              <ExternalLink className='w-3 h-3' />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. TWO-COLUMN MAIN GRID (65% Left : 35% Right) */}
      <section className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
        {/* LEFT COLUMN (65% width) */}
        <div className='lg:col-span-8 flex flex-col gap-6'>
          {/* Block 1: Metodologi Growvia */}
          <div className='bg-white rounded-2xl border border-[#E8ECF2] p-6 shadow-xs'>
            {/* Header */}
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3'>
              <div>
                <span className='text-[10px] font-bold text-slate-400 tracking-wider uppercase'>
                  METODOLOGI GROWVIA
                </span>
                <h3 className='text-lg font-bold text-[#0F172A] tracking-tight mt-0.5'>
                  Alur Ekosistem Karier Kamu
                </h3>
              </div>

              <span className='px-3 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-semibold w-fit self-start sm:self-center'>
                Siklus Berkelanjutan
              </span>
            </div>

            {/* 4 Process Cards */}
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4'>
              {/* Step 1: Pengalaman */}
              <div className='bg-[#F8FAFC] rounded-xl p-3.5 border border-slate-100 flex flex-col justify-between hover:border-blue-200 transition-all'>
                <div>
                  <div className='flex items-center justify-between'>
                    <div className='inline-flex items-center gap-1.5 text-xs font-bold text-[#0F172A]'>
                      <FolderOpen className='w-3.5 h-3.5 text-[#2563EB]' />
                      <span>Pengalaman</span>
                    </div>
                    <span className='text-xs font-bold text-slate-300'>1</span>
                  </div>

                  <div className='text-2xl font-bold text-[#0F172A] mt-2'>
                    {data.metodologi.experiencesCount}
                  </div>
                  <div className='text-[11px] text-slate-500 mt-0.5'>Tercatat rapi</div>
                </div>

                <div className='h-1 w-full bg-[#2563EB] rounded-full mt-3' />
              </div>

              {/* Step 2: Ekstraksi AI */}
              <div className='bg-[#F8FAFC] rounded-xl p-3.5 border border-slate-100 flex flex-col justify-between hover:border-blue-200 transition-all'>
                <div>
                  <div className='flex items-center justify-between'>
                    <div className='inline-flex items-center gap-1.5 text-xs font-bold text-[#0F172A]'>
                      <Target className='w-3.5 h-3.5 text-[#2563EB]' />
                      <span>Ekstraksi AI</span>
                    </div>
                    <span className='text-xs font-bold text-slate-300'>2</span>
                  </div>

                  <div className='text-2xl font-bold text-[#0F172A] mt-2'>
                    {data.metodologi.skillsCount}
                  </div>
                  <div className='text-[11px] text-slate-500 mt-0.5'>Skill aktif terpetakan</div>
                </div>

                <div className='h-1 w-full bg-[#2563EB] rounded-full mt-3' />
              </div>

              {/* Step 3: Analisis Gap */}
              <div className='bg-[#F8FAFC] rounded-xl p-3.5 border border-slate-100 flex flex-col justify-between hover:border-amber-200 transition-all'>
                <div>
                  <div className='flex items-center justify-between'>
                    <div className='inline-flex items-center gap-1.5 text-xs font-bold text-[#0F172A]'>
                      <BarChart2 className='w-3.5 h-3.5 text-[#F59E0B]' />
                      <span>Analisis Gap</span>
                    </div>
                    <span className='text-xs font-bold text-slate-300'>3</span>
                  </div>

                  <div className='text-2xl font-bold text-[#D97706] mt-2'>
                    {data.metodologi.gapCount}
                  </div>
                  <div className='text-[11px] text-slate-500 mt-0.5'>Target belajar aktif</div>
                </div>

                <div className='h-1 w-full bg-[#F59E0B] rounded-full mt-3' />
              </div>

              {/* Step 4: Peluang Karier */}
              <div className='bg-[#F8FAFC] rounded-xl p-3.5 border border-slate-100 flex flex-col justify-between hover:border-emerald-200 transition-all'>
                <div>
                  <div className='flex items-center justify-between'>
                    <div className='inline-flex items-center gap-1.5 text-xs font-bold text-[#0F172A]'>
                      <Compass className='w-3.5 h-3.5 text-[#10B981]' />
                      <span>Peluang Karier</span>
                    </div>
                    <span className='text-xs font-bold text-slate-300'>4</span>
                  </div>

                  <div className='text-2xl font-bold text-[#10B981] mt-2'>
                    {data.metodologi.opportunitiesCount}
                  </div>
                  <div className='text-[11px] text-slate-500 mt-0.5 leading-snug'>
                    Lowongan cocok match &gt; 80%
                  </div>
                </div>

                <div className='h-1 w-full bg-[#10B981] rounded-full mt-3' />
              </div>
            </div>
          </div>

          {/* Block 2: Insight AI Growvia Card */}
          {insightStatus !== 'dismissed' && (
            <div className='bg-[#F0F5FF] rounded-2xl border border-[#DCE7FF] p-6 shadow-xs relative'>
              {/* Header */}
              <div className='flex items-center justify-between gap-2 pb-1'>
                <div className='inline-flex items-center gap-2'>
                  <div className='w-6 h-6 rounded-lg bg-[#2563EB] text-white flex items-center justify-center shadow-2xs'>
                    <Sparkles className='w-3.5 h-3.5' />
                  </div>
                  <span className='text-[11px] font-bold text-[#2563EB] tracking-wider uppercase'>
                    INSIGHT AI GROWVIA
                  </span>
                </div>

                <span className='px-2.5 py-0.5 rounded-full bg-white text-[#2563EB] border border-[#BFDBFE] text-[11px] font-semibold'>
                  Baru Teranalisis
                </span>
              </div>

              <h4 className='text-base font-bold text-[#0F172A] tracking-tight mt-2'>
                Penemuan Skill Baru Otomatis
              </h4>

              <p className='text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed'>
                Berdasarkan proyek <strong className='font-semibold text-slate-900'>{data.aiInsight.projectName}</strong> kamu, kami mendeteksi bukti konkret penerapan skill{' '}
                <span className='inline-flex items-center px-2 py-0.5 rounded-md bg-white border border-[#BFDBFE] text-[#2563EB] font-semibold text-xs mx-0.5'>
                  {data.aiInsight.skills[0] || 'Product Discovery'}
                </span>{' '}
                dan{' '}
                <span className='inline-flex items-center px-2 py-0.5 rounded-md bg-white border border-[#BFDBFE] text-[#2563EB] font-semibold text-xs mx-0.5'>
                  {data.aiInsight.skills[1] || 'User Interview'}
                </span>{' '}
                pada level <em className='italic text-slate-800 font-medium'>{data.aiInsight.level}</em>. Tambahkan ke matriks portofoliomu?
              </p>

              {/* Action Buttons */}
              <div className='flex flex-wrap items-center justify-between gap-3 mt-4 pt-1'>
                {insightStatus === 'accepted' ? (
                  <div className='inline-flex items-center gap-1.5 text-xs font-semibold text-[#16A34A] bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200'>
                    <CheckCircle2 className='w-4 h-4' />
                    <span>Skill berhasil ditambahkan ke matriks portofolio!</span>
                  </div>
                ) : (
                  <div className='flex items-center gap-2.5'>
                    <button
                      type='button'
                      onClick={handleAcceptInsight}
                      disabled={isInsightSaving}
                      className='inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs hover:shadow-xs transition-all active:scale-[0.98] cursor-pointer'
                    >
                      {isInsightSaving ? (
                        <Loader2 className='w-3.5 h-3.5 animate-spin' />
                      ) : (
                        <CheckCircle2 className='w-3.5 h-3.5' />
                      )}
                      <span>Terima &amp; Simpan</span>
                    </button>

                    <Link
                      href='/skills'
                      className='inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold transition-all'
                    >
                      <Sliders className='w-3.5 h-3.5 text-slate-500' />
                      <span>Edit Skill</span>
                    </Link>
                  </div>
                )}

                {insightStatus !== 'accepted' && (
                  <button
                    type='button'
                    onClick={() => setInsightStatus('dismissed')}
                    className='text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors cursor-pointer'
                  >
                    Abaikan
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Block 3: Rekam Jejak: Pengalaman Terakhir */}
          <div className='bg-white rounded-2xl border border-[#E8ECF2] p-6 shadow-xs flex flex-col gap-4'>
            {/* Header */}
            <div className='flex items-center justify-between pb-1'>
              <div>
                <span className='text-[10px] font-bold text-slate-400 tracking-wider uppercase'>
                  REKAM JEJAK
                </span>
                <h3 className='text-lg font-bold text-[#0F172A] tracking-tight mt-0.5'>
                  Pengalaman Terakhir
                </h3>
              </div>

              <Link
                href='/experience'
                className='inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:underline'
              >
                <span>Lihat Semua ({data.metodologi.experiencesCount})</span>
                <ChevronRight className='w-3.5 h-3.5' />
              </Link>
            </div>

            {/* Stacked Experience Cards */}
            <div className='flex flex-col gap-3.5'>
              {data.recentExperiences.slice(0, 2).map((exp, idx) => {
                const isFirst = idx === 0

                return (
                  <div
                    key={exp.id || idx}
                    className='bg-[#F8FAFC] border border-slate-100 hover:border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all'
                  >
                    {/* Left Icon & Details */}
                    <div className='flex items-start gap-3.5'>
                      <div className='w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#2563EB] shadow-2xs shrink-0 mt-0.5'>
                        {isFirst ? (
                          <Laptop className='w-5 h-5' />
                        ) : (
                          <Users className='w-5 h-5' />
                        )}
                      </div>

                      <div className='flex flex-col gap-1'>
                        <h4 className='text-sm font-bold text-[#0F172A] leading-snug'>
                          {exp.role || exp.title.split(' • ')[0]} •{' '}
                          <span className='font-normal text-slate-600'>
                            {exp.company || exp.title.split(' • ')[1] || ''}
                          </span>
                        </h4>

                        <p className='text-xs text-slate-500 font-normal'>
                          {exp.dateFormatted}
                        </p>

                        {/* Skill Badges */}
                        <div className='flex flex-wrap items-center gap-1.5 mt-1.5'>
                          {exp.skills.slice(0, 3).map((skillName, sIdx) => (
                            <span
                              key={sIdx}
                              className='px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs font-medium text-[#2563EB]'
                            >
                              {skillName}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Badge & Link */}
                    <div className='flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200/60'>
                      <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#DCFCE7] text-[#16A34A] text-xs font-semibold'>
                        <CheckCircle2 className='w-3 h-3' />
                        <span>{exp.validatedSkillsCount} Skill Tervalidasi</span>
                      </span>

                      <Link
                        href={`/experience`}
                        className='text-xs font-semibold text-slate-400 hover:text-[#2563EB] transition-colors inline-flex items-center gap-0.5'
                      >
                        <span>Detail Log</span>
                        <ChevronRight className='w-3 h-3' />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (35% width) */}
        <div className='lg:col-span-4 flex flex-col gap-6'>
          {/* Card 1: Prioritas Utama */}
          <div className='bg-white rounded-2xl border border-[#E8ECF2] p-6 shadow-xs flex flex-col justify-between'>
            <div>
              {/* Header */}
              <div className='flex items-center justify-between pb-1'>
                <span className='text-[10px] font-bold text-slate-400 tracking-wider uppercase'>
                  PRIORITAS UTAMA
                </span>
                <Flag className='w-4 h-4 text-[#2563EB]' />
              </div>

              <span className='text-xs text-slate-500 font-normal mt-1 block'>
                Peran Sasaran
              </span>

              <h3 className='text-xl font-extrabold text-[#0F172A] tracking-tight mt-0.5 leading-snug'>
                {data.targetCareer.roleName}
              </h3>

              <p className='text-xs text-slate-500 mt-1 font-normal'>
                Industri: {data.targetCareer.industry}
              </p>

              {/* Match Box */}
              <div className='bg-[#F8FAFC] rounded-xl p-3.5 border border-slate-100 mt-4'>
                <div className='flex items-center justify-between text-xs'>
                  <span className='font-semibold text-slate-700'>Kecocokan Profil</span>
                  <span className='font-extrabold text-[#2563EB]'>
                    {data.targetCareer.matchPercent}% Match
                  </span>
                </div>

                <div className='w-full h-2 bg-slate-200 rounded-full my-2 overflow-hidden'>
                  <div
                    className='h-full bg-[#2563EB] rounded-full transition-all duration-1000'
                    style={{ width: `${data.targetCareer.matchPercent}%` }}
                  />
                </div>

                <p className='text-xs text-slate-500 leading-snug mt-1.5'>
                  Tinggal {data.targetCareer.missingSkillsCount} skill kunci untuk mencapai ambang {data.targetCareer.threshold}% siap rekrut.
                </p>
              </div>

              {/* Gap Skill Harus Dikejar */}
              <div className='mt-4'>
                <h5 className='text-xs font-bold text-[#0F172A] mb-2.5'>
                  Gap Skill Harus Dikejar:
                </h5>

                <div className='flex flex-col gap-2'>
                  {data.targetCareer.gaps.map((gap, gIdx) => {
                    const isMissing = gap.status === 'missing'

                    return (
                      <div
                        key={gIdx}
                        className={`p-2.5 rounded-xl border flex items-center justify-between ${
                          isMissing
                            ? 'bg-white border-rose-100'
                            : 'bg-white border-amber-100'
                        }`}
                      >
                        <div className='flex items-center gap-2'>
                          <div
                            className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                              isMissing ? 'text-rose-500' : 'text-amber-500'
                            }`}
                          >
                            {isMissing ? '🚫' : '⚠️'}
                          </div>
                          <span className='text-xs font-semibold text-slate-800'>
                            {gap.name}
                          </span>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isMissing
                              ? 'bg-[#FEE2E2] text-[#DC2626]'
                              : 'bg-[#FEF3C7] text-[#D97706]'
                          }`}
                        >
                          {isMissing ? 'Missing' : 'Develop'}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Link
              href='/learning'
              className='mt-5 w-full py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-2xs hover:shadow-xs transition-all active:scale-[0.98]'
            >
              <Award className='w-4 h-4' />
              <span>Lihat Rekomendasi Belajar</span>
            </Link>
          </div>

          {/* Card 2: Modul Kilat AI */}
          <div className='bg-white rounded-2xl border border-[#E8ECF2] p-6 shadow-xs flex flex-col gap-4'>
            {/* Header */}
            <div>
              <div className='flex items-center gap-1.5'>
                <Zap className='w-4 h-4 text-[#2563EB] fill-[#2563EB]' />
                <h3 className='text-base font-bold text-[#0F172A] tracking-tight'>
                  Modul Kilat AI
                </h3>
              </div>
              <p className='text-xs text-slate-500 mt-1 leading-snug'>
                Dipilih secara presisi untuk menutup gap dalam waktu kurang dari 1 minggu.
              </p>
            </div>

            {/* Stacked 2 Modules */}
            <div className='flex flex-col gap-3'>
              {data.rapidModules.map((module, mIdx) => {
                const isMiniCourse = module.type === 'Mini Course'

                return (
                  <div
                    key={module.id || mIdx}
                    className='bg-[#F8FAFC] border border-slate-100 hover:border-blue-200 rounded-xl p-3.5 flex flex-col gap-2 transition-all'
                  >
                    {/* Top Tag Row */}
                    <div className='flex items-center justify-between'>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          isMiniCourse
                            ? 'bg-white border border-blue-200 text-[#2563EB]'
                            : 'bg-white border border-slate-200 text-slate-700'
                        }`}
                      >
                        {module.type}
                      </span>

                      <div className='flex items-center gap-1 text-[11px] text-slate-500 font-medium'>
                        {isMiniCourse ? (
                          <Clock className='w-3 h-3 text-slate-400' />
                        ) : (
                          <Download className='w-3 h-3 text-slate-400' />
                        )}
                        <span>{module.duration}</span>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h4 className='text-xs font-bold text-[#0F172A] leading-snug hover:text-[#2563EB] transition-colors'>
                        <a href={module.url} target='_blank' rel='noopener noreferrer'>
                          {module.title}
                        </a>
                      </h4>
                      <p className='text-[11px] text-slate-500 mt-1 leading-relaxed'>
                        {module.description}
                      </p>
                    </div>

                    {/* Bottom Link Row */}
                    <div className='flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]'>
                      <span className='font-semibold text-[#2563EB]'>
                        Tutup Gap: {module.gapTag}
                      </span>

                      <a
                        href={module.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='font-bold text-[#2563EB] hover:text-blue-700 hover:underline flex items-center gap-0.5'
                      >
                        <span>{module.ctaText}</span>
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* QUICK ADD EXPERIENCE MODAL */}
      {isQuickAddOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200'>
          <div className='bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-md p-6 overflow-hidden'>
            <div className='flex items-center justify-between pb-3 border-b border-slate-100'>
              <h4 className='text-base font-bold text-slate-900'>
                Tambah Pengalaman Baru
              </h4>
              <button
                type='button'
                onClick={() => setIsQuickAddOpen(false)}
                className='text-slate-400 hover:text-slate-600 rounded-lg p-1'
              >
                <X className='w-5 h-5' />
              </button>
            </div>

            <form onSubmit={handleQuickAddSubmit} className='flex flex-col gap-3.5 mt-4'>
              <div>
                <label className='text-xs font-semibold text-slate-700 block mb-1'>
                  Judul Pengalaman / Posisi
                </label>
                <input
                  type='text'
                  required
                  placeholder='cth: Product Design Intern'
                  value={expForm.title}
                  onChange={e => setExpForm({ ...expForm, title: e.target.value })}
                  className='w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#2563EB]'
                />
              </div>

              <div>
                <label className='text-xs font-semibold text-slate-700 block mb-1'>
                  Institusi / Perusahaan
                </label>
                <input
                  type='text'
                  required
                  placeholder='cth: GoTo Financial'
                  value={expForm.institutionName}
                  onChange={e => setExpForm({ ...expForm, institutionName: e.target.value })}
                  className='w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#2563EB]'
                />
              </div>

              <div>
                <label className='text-xs font-semibold text-slate-700 block mb-1'>
                  Tipe Pengalaman
                </label>
                <select
                  value={expForm.type}
                  onChange={e => setExpForm({ ...expForm, type: e.target.value })}
                  className='w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#2563EB] bg-white'
                >
                  <option value='internship'>Magang Industri</option>
                  <option value='organisation'>Organisasi Kampus</option>
                  <option value='project'>Proyek Independen</option>
                  <option value='competition'>Kompetisi</option>
                  <option value='committee'>Kepanitiaan</option>
                </select>
              </div>

              <div>
                <label className='text-xs font-semibold text-slate-700 block mb-1'>
                  Deskripsi / Tanggung Jawab Singkat
                </label>
                <textarea
                  rows={3}
                  placeholder='Ceritakan ringkas apa yang kamu kerjakan...'
                  value={expForm.description}
                  onChange={e => setExpForm({ ...expForm, description: e.target.value })}
                  className='w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#2563EB]'
                />
              </div>

              <div className='flex items-center justify-end gap-2.5 mt-2 pt-2 border-t border-slate-100'>
                <button
                  type='button'
                  onClick={() => setIsQuickAddOpen(false)}
                  className='px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-all'
                >
                  Batal
                </button>

                <button
                  type='submit'
                  disabled={isSubmittingExp}
                  className='inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold transition-all'
                >
                  {isSubmittingExp ? (
                    <Loader2 className='w-3.5 h-3.5 animate-spin' />
                  ) : (
                    <Plus className='w-3.5 h-3.5' />
                  )}
                  <span>Simpan Pengalaman</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
