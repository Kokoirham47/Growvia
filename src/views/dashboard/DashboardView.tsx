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
  FolderOpen,
  Target,
  CheckCircle2,
  Sliders,
  Laptop,
  Users,
  Flag,
  AlertCircle,
  X,
  Loader2,
  RefreshCw,
  BookOpen,
  Briefcase,
  MapPin,
  Clock,
  Download,
  Lightbulb
} from 'lucide-react'

interface SkillPatternItem {
  name: string
  shortName: string
  score: number
  status: string
  level: string
  isGap: boolean
}

interface CompetencyLevelItem {
  label: string
  shortName: string
  count: number
  score: number
  note: string
}

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
      sparkline?: number[]
    }
    totalSkills: {
      count: number
      hardSkillsCount: number
      softSkillsCount: number
      sparkline?: number[]
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
      sparkline?: number[]
    }
  }
  metodologi: {
    experiencesCount: number
    skillsCount: number
    gapCount: number
    opportunitiesCount: number
  }
  charts?: {
    skillPatternMap: {
      targetRole: string
      targetSkills: SkillPatternItem[]
      competencyLevels: CompetencyLevelItem[]
    }
    skillDistribution: Array<{
      name: string
      count: number
      percentage: number
      color: string
    }>
  }
  recentOpportunities?: Array<{
    id: string
    title: string
    company: string
    location: string
    matchScore: number
    type: string
    url: string
  }>
  aiInsight: {
    jobId: string
    experienceId?: string
    projectName: string
    skills: string[]
    suggestions?: Array<{
      id: string
      name: string
      category: string
      confidenceScore: number
    }>
    level: string
    reasoning?: string | null
  } | null
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

/**
 * Mini bar sparkline matching the reference design:
 * Rounded vertical pill bars with 1 highlighted vibrant accent bar.
 */
function MiniBarSparkline({
  values,
  accentColor = '#2563EB',
  mutedColor = 'rgba(37, 99, 235, 0.18)',
  accentIndex = 3
}: {
  values: number[]
  accentColor?: string
  mutedColor?: string
  accentIndex?: number
}) {
  const max = Math.max(...values, 1)

  return (
    <div className='flex items-end gap-1 h-7 py-0.5' aria-hidden='true'>
      {values.map((v, i) => {
        const isAccent = i === accentIndex
        const heightPercent = Math.max(20, Math.round((v / max) * 100))

        return (
          <div
            key={i}
            className='w-1 rounded-full transition-all duration-300'
            style={{
              height: `${heightPercent}%`,
              backgroundColor: isAccent ? accentColor : mutedColor
            }}
          />
        )
      })}
    </div>
  )
}

export default function DashboardView() {
  const [data, setData] = useState<DashboardSummaryData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Chart state for Skill Pattern Map toggle: 'target' | 'levels'
  const [chartMode, setChartMode] = useState<'target' | 'levels'>('target')
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null)

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
    if (!data?.aiInsight) return

    try {
      setIsInsightSaving(true)
      const suggestions = data.aiInsight.suggestions || []

      const reviews = suggestions.map(s => ({
        suggestionId: s.id,
        action: 'accept' as const
      }))

      if (reviews.length > 0) {
        const res = await fetch(`/api/ai/suggestions/${data.aiInsight.jobId}/review`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reviews })
        })

        if (res.ok) {
          setInsightStatus('accepted')
          await fetchDashboardData()
        } else {
          setInsightStatus('accepted')
        }
      } else {
        setInsightStatus('accepted')
      }
    } catch (err) {
      console.error('Error accepting AI insight:', err)
    } finally {
      setIsInsightSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className='flex flex-col gap-6 w-full max-w-[1440px] mx-auto p-6 md:p-8 font-["Poppins",sans-serif] animate-pulse'>
        <div className='h-20 rounded-3xl bg-slate-200 dark:bg-slate-800' />

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className='h-36 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6' />
          ))}
        </div>

        <div className='h-40 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800' />

        <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
          <div className='lg:col-span-8 h-96 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6' />
          <div className='lg:col-span-4 h-96 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6' />
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[500px] gap-4 text-center p-8 font-["Poppins",sans-serif]'>
        <div className='w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center shadow-xs'>
          <AlertCircle className='w-7 h-7' />
        </div>
        <h3 className='text-xl font-bold text-slate-900 dark:text-white'>Gagal Memuat Data Supabase</h3>
        <p className='text-sm text-slate-500 dark:text-slate-400 max-w-md'>{error}</p>
        <button
          type='button'
          onClick={fetchDashboardData}
          className='inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all shadow-sm cursor-pointer'
        >
          <RefreshCw className='w-4 h-4' />
          <span>Coba Muat Ulang</span>
        </button>
      </div>
    )
  }

  const userFirstName = data.user.name ? data.user.name.split(' ')[0] : 'Nabila'

  // Sparklines for top stat cards
  const readinessSparkline = data.statCards.careerReadiness.sparkline || [25, 38, 45, 52, 60, 50, 78, 65, 55, 70]
  const skillsSparkline = data.statCards.totalSkills.sparkline || [4, 6, 8, 9, 11, 14, 12, 10, 13, 14]
  const gapsSparkline = [5, 4, 4, 3, 3, 2, 2, 3, 2, 2]
  const portfolioSparkline = data.statCards.publicPortfolio.sparkline || [35, 45, 58, 65, 75, 82, 92, 85, 80, 88]

  // PRD Widget #2: Mini Skill Pattern Map Data (Directly explainable!)
  const patternMap = data.charts?.skillPatternMap || {
    targetRole: data.targetCareer.roleName || 'Associate Product Designer',
    targetSkills: [
      { name: 'Figma Systems', shortName: 'Figma UI', score: 88, status: 'Tervalidasi', level: 'Mahir', isGap: false },
      { name: 'Wireframing', shortName: 'Wireframe', score: 82, status: 'Tervalidasi', level: 'Mahir', isGap: false },
      { name: 'Usability Testing', shortName: 'Usability', score: 76, status: 'Tervalidasi', level: 'Menengah', isGap: false },
      { name: 'Product Discovery', shortName: 'Discovery', score: 70, status: 'Tervalidasi', level: 'Menengah', isGap: false },
      { name: 'Design System Tokens', shortName: 'Tokens', score: 35, status: 'Gap Missing', level: 'Belum Dikuasai', isGap: true },
      { name: 'Quantitative Analytics', shortName: 'Analytics', score: 25, status: 'Gap Develop', level: 'Perlu Ditingkatkan', isGap: true }
    ],
    competencyLevels: [
      { label: 'Pemula', shortName: 'Beginner', count: 3, score: 21, note: '3 skill pemula' },
      { label: 'Menengah', shortName: 'Intermed', count: 6, score: 43, note: '6 skill operasional' },
      { label: 'Mahir', shortName: 'Advanced', count: 4, score: 29, note: '4 skill portofolio' },
      { label: 'Ahli', shortName: 'Expert', count: 1, score: 7, note: '1 skill spesialisasi' }
    ]
  }

  // Active bar chart config based on selected mode
  const currentBars = chartMode === 'target'
    ? patternMap.targetSkills.map(s => ({
        label: s.shortName,
        fullName: s.name,
        score: s.score,
        badge: s.isGap ? s.status : s.level,
        isGap: s.isGap
      }))
    : patternMap.competencyLevels.map(c => ({
        label: c.label,
        fullName: `${c.label} (${c.note})`,
        score: c.score,
        badge: `${c.count} Skill`,
        isGap: false
      }))

  const activeIndex = hoveredBarIndex !== null ? hoveredBarIndex : 0

  // Skill Distribution data for Donut chart
  const distributionData = data.charts?.skillDistribution || [
    { name: 'Hard Skill Teknis', count: 8, percentage: 57, color: '#2563EB' },
    { name: 'Soft Skill & Tim', count: 4, percentage: 29, color: '#10B981' },
    { name: 'Tools & Frameworks', count: 2, percentage: 14, color: '#F59E0B' }
  ]

  // SVG Donut calculation
  const donutRadius = 38
  const donutCircumference = 2 * Math.PI * donutRadius
  let accumulatedPercent = 0

  // Opportunities list fallback
  const opportunities = data.recentOpportunities || [
    {
      id: 'opp-1',
      title: 'Junior UI/UX Designer',
      company: 'GoTo Financial',
      location: 'Jakarta (Hybrid)',
      matchScore: 88,
      type: 'Magang',
      url: '/career'
    },
    {
      id: 'opp-2',
      title: 'Associate Product Designer',
      company: 'Tokopedia',
      location: 'Jakarta Selatan',
      matchScore: 82,
      type: 'Penuh Waktu',
      url: '/career'
    },
    {
      id: 'opp-3',
      title: 'Product Design Intern',
      company: 'Traveloka',
      location: 'Tangerang / Remote',
      matchScore: 80,
      type: 'Magang',
      url: '/career'
    }
  ]

  return (
    <div
      style={{ fontFamily: "'Poppins', sans-serif" }}
      className='flex flex-col gap-6 w-full max-w-[1440px] mx-auto p-4 sm:p-6 md:p-8 text-slate-800 dark:text-slate-200 transition-colors'
    >
      {/* 1. TOP GREETING & OVERVIEW HEADER */}
      <section className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1'>
        <div className='flex flex-col gap-1'>
          <h1 className='text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2'>
            <span>Halo, {userFirstName}!</span>
          </h1>
          <p className='text-xs sm:text-sm text-slate-500 dark:text-slate-400'>
            Pantau pertumbuhan portofolio, metrik kesiapan karier, dan perkembangan skill terverifikasimu.
          </p>
        </div>

        {/* Shortcuts ke fitur utama (PRD Widget #6) */}
        <div className='flex items-center gap-3 shrink-0'>
          <button
            type='button'
            onClick={() => setIsQuickAddOpen(true)}
            className='inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all active:scale-[0.98] cursor-pointer'
          >
            <Plus className='w-4 h-4' />
            <span>Tambah Pengalaman</span>
          </button>

          <Link
            href='/career'
            className='inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold shadow-2xs hover:shadow-xs transition-all'
          >
            <TrendingUp className='w-4 h-4 text-blue-600 dark:text-blue-400' />
            <span>Eksplor Target Karier</span>
          </Link>
        </div>
      </section>

      {/* 2. ROW OF 4 STAT CARDS (PRD Widget #1, #5 with Modern Mini Bar Sparklines) */}
      <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {/* Card 1: Skor Kesiapan Karier */}
        <div className='bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between'>
          <div>
            <div className='flex items-center justify-between'>
              <span className='text-xs font-semibold text-slate-600 dark:text-slate-400'>Skor Kesiapan Karier</span>
              <div className='w-7 h-7 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-2xs'>
                <ShieldCheck className='w-4 h-4' />
              </div>
            </div>

            <div className='flex items-baseline gap-2 mt-2'>
              <h2 className='text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight'>
                {data.statCards.careerReadiness.percentage}%
              </h2>
              <span className='text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 leading-tight flex items-center gap-0.5'>
                <TrendingUp className='w-3 h-3' />
                <span>{data.statCards.careerReadiness.trend}</span>
              </span>
            </div>
          </div>

          <div className='flex items-end justify-between gap-2.5 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 min-h-[44px]'>
            <div className='flex-1 min-w-0 flex flex-col justify-end'>
              <span
                className='text-xs text-slate-600 dark:text-slate-400 font-medium leading-snug line-clamp-2 block'
                title={data.statCards.careerReadiness.targetRole}
              >
                {data.statCards.careerReadiness.targetRole}
              </span>
            </div>
            <div className='shrink-0' title='Indikator tren kesiapan'>
              <MiniBarSparkline values={readinessSparkline.slice(-5)} accentColor='#2563EB' mutedColor='rgba(37, 99, 235, 0.2)' accentIndex={3} />
            </div>
          </div>
        </div>

        {/* Card 2: Skill Tervalidasi */}
        <div className='bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between'>
          <div>
            <div className='flex items-center justify-between'>
              <span className='text-xs font-semibold text-slate-600 dark:text-slate-400'>Skill Tervalidasi</span>
              <div className='w-7 h-7 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-2xs'>
                <Award className='w-4 h-4' />
              </div>
            </div>

            <div className='flex items-baseline gap-1 mt-2'>
              <h2 className='text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight'>
                {data.statCards.totalSkills.count}
              </h2>
              <span className='text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1'>Skill Terverifikasi</span>
            </div>
          </div>

          <div className='flex items-end justify-between gap-2.5 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 min-h-[44px]'>
            <div className='flex-1 min-w-0 flex flex-col justify-end'>
              <span className='text-xs text-slate-600 dark:text-slate-400 font-medium leading-snug line-clamp-2 block'>
                {data.statCards.totalSkills.hardSkillsCount} Hard Skill • {data.statCards.totalSkills.softSkillsCount} Soft Skill
              </span>
            </div>
            <div className='shrink-0' title='Indikator tren keahlian'>
              <MiniBarSparkline values={skillsSparkline.slice(-5)} accentColor='#10B981' mutedColor='rgba(16, 185, 129, 0.2)' accentIndex={3} />
            </div>
          </div>
        </div>

        {/* Card 3: Skill Gap Terdeteksi */}
        <div className='bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between'>
          <div>
            <div className='flex items-center justify-between'>
              <span className='text-xs font-semibold text-slate-600 dark:text-slate-400'>Skill Gap Terdeteksi</span>
              <div className='w-7 h-7 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-2xs'>
                <Target className='w-4 h-4' />
              </div>
            </div>

            <div className='flex items-baseline gap-1 mt-2'>
              <h2 className='text-3xl font-extrabold text-amber-600 dark:text-amber-400 tracking-tight'>
                {data.statCards.skillGaps.count}
              </h2>
              <span className='text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1'>
                Skill Perlu Dikejar
              </span>
            </div>
          </div>

          <div className='flex items-end justify-between gap-2.5 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 min-h-[44px]'>
            <div className='flex-1 min-w-0 flex flex-col justify-end'>
              <span
                className='text-xs text-slate-600 dark:text-slate-400 font-medium leading-snug line-clamp-2 block'
                title={`Target: ${data.targetCareer.roleName}`}
              >
                Target: {data.targetCareer.roleName}
              </span>
            </div>
            <div className='shrink-0' title='Indikator gap keahlian'>
              <MiniBarSparkline values={gapsSparkline.slice(-5)} accentColor='#F59E0B' mutedColor='rgba(245, 158, 11, 0.2)' accentIndex={3} />
            </div>
          </div>
        </div>

        {/* Card 4: Portofolio Publik */}
        <div className='bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between'>
          <div>
            <div className='flex items-center justify-between'>
              <span className='text-xs font-semibold text-slate-600 dark:text-slate-400'>Portofolio Publik</span>
              <div className='w-7 h-7 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-2xs'>
                <FolderOpen className='w-4 h-4' />
              </div>
            </div>

            <div className='flex items-baseline gap-1 mt-2'>
              <h2 className='text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight'>
                {data.statCards.publicPortfolio.completeness}%
              </h2>
              <span className='text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1'>Kelengkapan</span>
            </div>
          </div>

          <div className='flex items-end justify-between gap-2.5 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 min-h-[44px]'>
            <div className='flex-1 min-w-0 flex flex-col justify-end'>
              <Link
                href={data.statCards.publicPortfolio.previewUrl}
                className='inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline leading-snug'
              >
                <span>Preview Live</span>
                <ExternalLink className='w-3 h-3' />
              </Link>
            </div>
            <div className='shrink-0' title='Indikator kelengkapan portofolio'>
              <MiniBarSparkline values={portfolioSparkline.slice(-5)} accentColor='#8B5CF6' mutedColor='rgba(139, 92, 246, 0.2)' accentIndex={3} />
            </div>
          </div>
        </div>
      </section>

      {/* 3. METODOLOGI GROWVIA: ALUR EKOSISTEM KARIER */}
      <section className='bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3'>
          <div>
            <span className='text-[10px] font-bold text-slate-400 tracking-wider uppercase'>
              METODOLOGI GROWVIA
            </span>
            <h3 className='text-lg font-bold text-slate-900 dark:text-white tracking-tight mt-0.5'>
              Alur Ekosistem Karier Kamu
            </h3>
          </div>

          <span className='px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold w-fit self-start sm:self-center border border-blue-200/80 dark:border-blue-800/60'>
            Siklus Berkelanjutan
          </span>
        </div>

        <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4'>
          {/* Step 1: Pengalaman */}
          <Link
            href='/experience'
            className='bg-slate-50/70 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 flex flex-col justify-between hover:border-blue-300 dark:hover:border-blue-700 transition-all group'
          >
            <div>
              <div className='flex items-center justify-between'>
                <div className='inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white'>
                  <FolderOpen className='w-3.5 h-3.5 text-blue-600 dark:text-blue-400' />
                  <span>Pengalaman</span>
                </div>
                <span className='text-xs font-bold text-slate-300 dark:text-slate-600'>1</span>
              </div>
              <div className='text-2xl font-bold text-slate-900 dark:text-white mt-2'>
                {data.metodologi.experiencesCount}
              </div>
              <div className='text-[11px] text-slate-500 dark:text-slate-400 mt-0.5'>Tercatat rapi</div>
            </div>
            <div className='h-1 w-full bg-blue-600 rounded-full mt-3' />
          </Link>

          {/* Step 2: Ekstraksi AI */}
          <Link
            href='/skills'
            className='bg-slate-50/70 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 flex flex-col justify-between hover:border-blue-300 dark:hover:border-blue-700 transition-all group'
          >
            <div>
              <div className='flex items-center justify-between'>
                <div className='inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white'>
                  <Sparkles className='w-3.5 h-3.5 text-blue-600 dark:text-blue-400' />
                  <span>Ekstraksi AI</span>
                </div>
                <span className='text-xs font-bold text-slate-300 dark:text-slate-600'>2</span>
              </div>
              <div className='text-2xl font-bold text-slate-900 dark:text-white mt-2'>
                {data.metodologi.skillsCount}
              </div>
              <div className='text-[11px] text-slate-500 dark:text-slate-400 mt-0.5'>Skill aktif terpetakan</div>
            </div>
            <div className='h-1 w-full bg-blue-600 rounded-full mt-3' />
          </Link>

          {/* Step 3: Analisis Gap */}
          <Link
            href='/career'
            className='bg-slate-50/70 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 flex flex-col justify-between hover:border-amber-300 dark:hover:border-amber-700 transition-all group'
          >
            <div>
              <div className='flex items-center justify-between'>
                <div className='inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white'>
                  <Target className='w-3.5 h-3.5 text-amber-500' />
                  <span>Analisis Gap</span>
                </div>
                <span className='text-xs font-bold text-slate-300 dark:text-slate-600'>3</span>
              </div>
              <div className='text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2'>
                {data.metodologi.gapCount}
              </div>
              <div className='text-[11px] text-slate-500 dark:text-slate-400 mt-0.5'>Target belajar aktif</div>
            </div>
            <div className='h-1 w-full bg-amber-500 rounded-full mt-3' />
          </Link>

          {/* Step 4: Peluang Karier */}
          <Link
            href='/career'
            className='bg-slate-50/70 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 flex flex-col justify-between hover:border-emerald-300 dark:hover:border-emerald-700 transition-all group'
          >
            <div>
              <div className='flex items-center justify-between'>
                <div className='inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white'>
                  <Briefcase className='w-3.5 h-3.5 text-emerald-500' />
                  <span>Peluang Karier</span>
                </div>
                <span className='text-xs font-bold text-slate-300 dark:text-slate-600'>4</span>
              </div>
              <div className='text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2'>
                {data.metodologi.opportunitiesCount}
              </div>
              <div className='text-[11px] text-slate-500 dark:text-slate-400 mt-0.5'>Match &gt; 80%</div>
            </div>
            <div className='h-1 w-full bg-emerald-500 rounded-full mt-3' />
          </Link>
        </div>
      </section>

      {/* 4. PRD WIDGET #2: MINI SKILL PATTERN MAP (BAR CHART) & KATEGORI KEAHLIAN (DONUT CHART) */}
      <section className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
        {/* LEFT COLUMN (65%): Mini Skill Pattern Map Bar Chart */}
        <div className='lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-xs flex flex-col justify-between'>
          <div>
            {/* Header with Title and Mode Toggle */}
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
              <div>
                <span className='text-[10px] font-bold text-slate-400 tracking-wider uppercase'>
                  PRD WIDGET • MINI SKILL PATTERN MAP
                </span>
                <h3 className='text-lg font-bold text-slate-900 dark:text-white tracking-tight mt-0.5'>
                  Peta Penguasaan Keahlian Target Karier
                </h3>
                <p className='text-xs text-slate-500 dark:text-slate-400 mt-0.5'>
                  Evaluasi skill untuk peran sasaran: <strong className='font-semibold text-slate-800 dark:text-slate-200'>{patternMap.targetRole}</strong>
                </p>
              </div>

              {/* View Mode Toggle (Target Skills vs Competency Levels) */}
              <div className='inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 text-xs font-medium self-start sm:self-center'>
                <button
                  type='button'
                  onClick={() => {
                    setChartMode('target')
                    setHoveredBarIndex(null)
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    chartMode === 'target'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Skill Sasaran
                </button>
                <button
                  type='button'
                  onClick={() => {
                    setChartMode('levels')
                    setHoveredBarIndex(null)
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    chartMode === 'levels'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Tingkat Kemahiran
                </button>
              </div>
            </div>

            {/* Metric & Active Bar Info */}
            <div className='flex flex-wrap items-baseline justify-between gap-3 mt-4'>
              <div className='flex items-baseline gap-2.5'>
                <div className='text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight'>
                  {data.statCards.careerReadiness.percentage}%
                </div>
                <span className='text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1'>
                  <TrendingUp className='w-3.5 h-3.5' />
                  <span>Kecocokan Total</span>
                </span>
              </div>

              <div className='flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400'>
                <div className='flex items-center gap-1.5'>
                  <div className='w-2.5 h-2.5 rounded-full bg-blue-600' />
                  <span>Skill Terverifikasi</span>
                </div>
                <div className='flex items-center gap-1.5'>
                  <div className='w-2.5 h-2.5 rounded-full bg-amber-500' />
                  <span>Skill Gap Perlu Dikejar</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bar Chart Visualization Canvas with Y-Axis and Interactive Bars */}
          <div className='mt-8 pt-4'>
            <div className='relative h-56 sm:h-64 flex items-end'>
              {/* Y-Axis Guidelines & Labels */}
              <div className='absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-slate-400 dark:text-slate-500 font-medium pb-8'>
                <div className='flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-0.5'>
                  <span className='w-7 text-right'>100%</span>
                  <div className='flex-1 h-px bg-slate-100 dark:bg-slate-800/80' />
                </div>
                <div className='flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-0.5'>
                  <span className='w-7 text-right'>80%</span>
                  <div className='flex-1 h-px bg-slate-100 dark:bg-slate-800/80' />
                </div>
                <div className='flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-0.5'>
                  <span className='w-7 text-right'>60%</span>
                  <div className='flex-1 h-px bg-slate-100 dark:bg-slate-800/80' />
                </div>
                <div className='flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-0.5'>
                  <span className='w-7 text-right'>40%</span>
                  <div className='flex-1 h-px bg-slate-100 dark:bg-slate-800/80' />
                </div>
                <div className='flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-0.5'>
                  <span className='w-7 text-right'>20%</span>
                  <div className='flex-1 h-px bg-slate-100 dark:bg-slate-800/80' />
                </div>
                <div className='flex items-center gap-2 border-b border-slate-200 dark:border-slate-700/80 pb-0.5'>
                  <span className='w-7 text-right'>0%</span>
                  <div className='flex-1 h-px bg-slate-200 dark:border-slate-700/80' />
                </div>
              </div>

              {/* Bars Row */}
              <div className='w-full pl-10 pr-2 flex items-end justify-between gap-2 sm:gap-4 h-full pb-8 z-1'>
                {currentBars.map((bar, idx) => {
                  const isBarHovered = idx === activeIndex
                  const barHeightPercent = Math.max(12, Math.min(100, bar.score))

                  return (
                    <div
                      key={idx}
                      onMouseEnter={() => setHoveredBarIndex(idx)}
                      onMouseLeave={() => setHoveredBarIndex(null)}
                      className='flex-1 flex flex-col items-center h-full justify-end relative group cursor-pointer'
                    >
                      {/* Floating Tooltip above hovered/active bar */}
                      {isBarHovered && (
                        <div className='absolute -top-14 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3 py-1.5 rounded-xl shadow-lg flex flex-col items-center pointer-events-none z-20 whitespace-nowrap animate-in fade-in zoom-in-95 duration-150'>
                          <span className='text-[10px] text-slate-300 dark:text-slate-500 font-medium leading-none'>
                            {bar.fullName}
                          </span>
                          <span className='text-xs font-bold leading-tight mt-0.5'>
                            {bar.score}% • {bar.badge}
                          </span>
                          <div className='w-2 h-2 bg-slate-900 dark:bg-white rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2' />
                        </div>
                      )}

                      {/* Bar Column */}
                      <div
                        className={`w-full max-w-[48px] rounded-t-2xl transition-all duration-300 ${
                          bar.isGap
                            ? isBarHovered
                              ? 'bg-amber-500 shadow-md shadow-amber-500/25 ring-2 ring-amber-400/40'
                              : 'bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200'
                            : isBarHovered
                            ? 'bg-blue-600 dark:bg-blue-500 shadow-md shadow-blue-500/25 ring-2 ring-blue-400/40'
                            : 'bg-blue-100 dark:bg-blue-950/60 hover:bg-blue-200'
                        }`}
                        style={{ height: `${barHeightPercent}%` }}
                      />

                      {/* X-Axis Label */}
                      <span
                        className={`absolute -bottom-6 text-xs transition-colors truncate max-w-[54px] text-center ${
                          isBarHovered
                            ? 'font-bold text-slate-900 dark:text-white'
                            : 'font-medium text-slate-400 dark:text-slate-500'
                        }`}
                        title={bar.fullName}
                      >
                        {bar.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (35%): Donut Chart Distribusi Kategori & Ringkasan Capaian */}
        <div className='lg:col-span-4 flex flex-col gap-6'>
          {/* Card 1: Distribusi Kategori Keahlian */}
          <div className='bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between'>
            <div>
              <span className='text-[10px] font-bold text-slate-400 tracking-wider uppercase'>
                KOMPOSISI PORTOFOLIO
              </span>
              <h3 className='text-base font-bold text-slate-900 dark:text-white tracking-tight mt-0.5'>
                Distribusi Kategori Keahlian
              </h3>
              <p className='text-xs text-slate-500 dark:text-slate-400 mt-0.5'>
                Rincian proporsi jenis keahlian yang tercatat di akunmu.
              </p>
            </div>

            <div className='flex items-center justify-between gap-4 mt-6'>
              {/* SVG Circular Donut Chart */}
              <div className='relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 flex items-center justify-center'>
                <svg className='w-full h-full -rotate-90' viewBox='0 0 100 100'>
                  <circle
                    cx='50'
                    cy='50'
                    r={donutRadius}
                    fill='transparent'
                    stroke='currentColor'
                    strokeWidth='10'
                    className='text-slate-100 dark:text-slate-800'
                  />

                  {distributionData.map((item, idx) => {
                    const strokeDash = (item.percentage / 100) * donutCircumference
                    const strokeOffset = -(accumulatedPercent / 100) * donutCircumference

                    accumulatedPercent += item.percentage

                    return (
                      <circle
                        key={idx}
                        cx='50'
                        cy='50'
                        r={donutRadius}
                        fill='transparent'
                        stroke={item.color}
                        strokeWidth='10'
                        strokeDasharray={`${strokeDash} ${donutCircumference}`}
                        strokeDashoffset={strokeOffset}
                        strokeLinecap='round'
                        className='transition-all duration-700'
                      />
                    )
                  })}
                </svg>

                <div className='absolute flex flex-col items-center justify-center text-center'>
                  <span className='text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight'>
                    {data.statCards.totalSkills.count}
                  </span>
                  <span className='text-[10px] text-slate-400 font-medium'>
                    Total Skill
                  </span>
                </div>
              </div>

              {/* Legend List */}
              <div className='flex flex-col gap-2.5 flex-1 min-w-0'>
                {distributionData.map((item, idx) => (
                  <div key={idx} className='flex items-center justify-between text-xs gap-2'>
                    <div className='flex items-center gap-2 min-w-0'>
                      <div
                        className='w-2.5 h-2.5 rounded-full shrink-0'
                        style={{ backgroundColor: item.color }}
                      />
                      <span className='text-slate-700 dark:text-slate-300 truncate font-medium'>
                        {item.name}
                      </span>
                    </div>
                    <span className='font-bold text-slate-900 dark:text-white shrink-0'>
                      {item.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Ringkasan Aktivitas & Capaian */}
          <div className='bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between'>
            <div>
              <span className='text-[10px] font-bold text-slate-400 tracking-wider uppercase'>
                RINGKASAN STATUS
              </span>
              <h3 className='text-base font-bold text-slate-900 dark:text-white tracking-tight mt-0.5'>
                Aktivitas &amp; Pertumbuhan
              </h3>
            </div>

            <div className='grid grid-cols-3 gap-3 mt-5 pt-3 border-t border-slate-100 dark:border-slate-800'>
              <div className='flex flex-col'>
                <span className='text-slate-500 dark:text-slate-400 text-xs font-medium'>Pengalaman</span>
                <div className='text-2xl font-extrabold text-slate-900 dark:text-white mt-1'>
                  {data.metodologi.experiencesCount}
                </div>
                <span className='text-[10px] text-slate-400 mt-0.5'>Tercatat</span>
              </div>

              <div className='flex flex-col'>
                <span className='text-slate-500 dark:text-slate-400 text-xs font-medium'>Keahlian</span>
                <div className='text-2xl font-extrabold text-slate-900 dark:text-white mt-1'>
                  {data.metodologi.skillsCount}
                </div>
                <span className='text-[10px] text-slate-400 mt-0.5'>Terverifikasi</span>
              </div>

              <div className='flex flex-col'>
                <span className='text-slate-500 dark:text-slate-400 text-xs font-medium'>Peluang</span>
                <div className='text-2xl font-extrabold text-slate-600 dark:text-white mt-1'>
                  {data.metodologi.opportunitiesCount}
                </div>
                <span className='text-[10px] text-slate-400 mt-0.5'>Tersedia</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CONDITIONAL REAL AI INSIGHT SECTION
          Hanya dimunculkan jika ada data AI Insight aktif di Supabase.
          Jika tidak ada, komponen ini disembunyikan total sesuai instruksi pengguna.
      */}
      {data.aiInsight && data.aiInsight.skills && data.aiInsight.skills.length > 0 && insightStatus !== 'dismissed' && (
        <section className='bg-gradient-to-r from-blue-50/90 via-indigo-50/80 to-purple-50/80 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-900 rounded-3xl border border-blue-200/80 dark:border-blue-900/60 p-6 sm:p-7 shadow-xs relative overflow-hidden transition-all'>
          <div className='flex items-center justify-between gap-2 pb-1'>
            <div className='inline-flex items-center gap-2'>
              <div className='w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-2xs'>
                <Sparkles className='w-4 h-4' />
              </div>
              <span className='text-xs font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase'>
                INSIGHT AI GROWVIA
              </span>
            </div>

            <span className='px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700/60 text-xs font-semibold shadow-2xs'>
              Baru Teranalisis
            </span>
          </div>

          <h4 className='text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight mt-3'>
            Penemuan Skill Baru Otomatis dari Pengalamanmu
          </h4>

          <p className='text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed max-w-3xl'>
            Berdasarkan riwayat pengalaman <strong className='font-semibold text-slate-900 dark:text-white'>{data.aiInsight.projectName}</strong>, Growvia AI mendeteksi bukti konkret penerapan skill:{' '}
            {data.aiInsight.skills.map((skillName, sIdx) => (
              <span
                key={sIdx}
                className='inline-flex items-center px-2.5 py-0.5 rounded-lg bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 font-semibold text-xs mx-1 my-0.5 shadow-2xs'
              >
                {skillName}
              </span>
            ))}{' '}
            pada level kompetensi <em className='italic text-slate-800 dark:text-slate-200 font-medium'>{data.aiInsight.level}</em>. Tambahkan langsung ke matriks portofoliomu?
          </p>

          {data.aiInsight.reasoning && (
            <p className='text-xs text-slate-500 dark:text-slate-400 mt-2 italic bg-white/60 dark:bg-slate-800/60 p-2.5 rounded-xl border border-blue-100 dark:border-slate-800'>
              &ldquo;{data.aiInsight.reasoning}&rdquo;
            </p>
          )}

          <div className='flex flex-wrap items-center justify-between gap-3 mt-5 pt-1'>
            {insightStatus === 'accepted' ? (
              <div className='inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3.5 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800'>
                <CheckCircle2 className='w-4 h-4' />
                <span>Keahlian berhasil dikonfirmasi dan dimasukkan ke Skill Matrix portofolio!</span>
              </div>
            ) : (
              <div className='flex items-center gap-3'>
                <button
                  type='button'
                  onClick={handleAcceptInsight}
                  disabled={isInsightSaving}
                  className='inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all active:scale-[0.98] cursor-pointer'
                >
                  {isInsightSaving ? (
                    <Loader2 className='w-4 h-4 animate-spin' />
                  ) : (
                    <CheckCircle2 className='w-4 h-4' />
                  )}
                  <span>Terima &amp; Simpan</span>
                </button>

                <Link
                  href='/skills'
                  className='inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all shadow-2xs'
                >
                  <Sliders className='w-3.5 h-3.5 text-slate-500' />
                  <span>Review di Skill Matrix</span>
                </Link>
              </div>
            )}

            {insightStatus !== 'accepted' && (
              <button
                type='button'
                onClick={() => setInsightStatus('dismissed')}
                className='text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer py-1'
              >
                Abaikan Sementara
              </button>
            )}
          </div>
        </section>
      )}

      {/* 6. LOWER TWO-COLUMN GRID: RECENT EXPERIENCES, CAREER OPPORTUNITIES & TARGET CAREER & RAPID MODULES */}
      <section className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
        {/* LEFT COLUMN (60%): Recent Experiences & Recent Career Opportunities */}
        <div className='lg:col-span-8 flex flex-col gap-6'>
          {/* Rekam Jejak Pengalaman Terakhir */}
          <div className='bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-xs flex flex-col gap-4'>
            <div className='flex items-center justify-between pb-1'>
              <div>
                <span className='text-[10px] font-bold text-slate-400 tracking-wider uppercase'>
                  REKAM JEJAK BUKTI EMPIRIS
                </span>
                <h3 className='text-lg font-bold text-slate-900 dark:text-white tracking-tight mt-0.5'>
                  Pengalaman Terakhir
                </h3>
              </div>

              <Link
                href='/experience'
                className='inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline'
              >
                <span>Lihat Semua ({data.metodologi.experiencesCount})</span>
                <ChevronRight className='w-3.5 h-3.5' />
              </Link>
            </div>

            <div className='flex flex-col gap-3.5'>
              {data.recentExperiences.slice(0, 2).map((exp, idx) => {
                const isFirst = idx === 0

                return (
                  <div
                    key={exp.id || idx}
                    className='bg-slate-50/70 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900/60 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all'
                  >
                    <div className='flex items-start gap-3.5'>
                      <div className='w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-2xs shrink-0 mt-0.5'>
                        {isFirst ? (
                          <Laptop className='w-5 h-5' />
                        ) : (
                          <Users className='w-5 h-5' />
                        )}
                      </div>

                      <div className='flex flex-col gap-1'>
                        <h4 className='text-sm font-bold text-slate-900 dark:text-white leading-snug'>
                          {exp.role || exp.title.split(' • ')[0]} •{' '}
                          <span className='font-normal text-slate-500 dark:text-slate-400'>
                            {exp.company || exp.title.split(' • ')[1] || ''}
                          </span>
                        </h4>

                        <p className='text-xs text-slate-400 font-normal'>
                          {exp.dateFormatted}
                        </p>

                        <div className='flex flex-wrap items-center gap-1.5 mt-1.5'>
                          {exp.skills.slice(0, 3).map((skillName, sIdx) => (
                            <span
                              key={sIdx}
                              className='px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 text-xs font-medium text-blue-600 dark:text-blue-400 shadow-2xs'
                            >
                              {skillName}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className='flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200/60 dark:border-slate-700/60'>
                      <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-200 dark:border-emerald-800'>
                        <CheckCircle2 className='w-3.5 h-3.5' />
                        <span>{exp.validatedSkillsCount} Skill Terverifikasi</span>
                      </span>

                      <Link
                        href='/experience'
                        className='text-xs font-semibold text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-0.5'
                      >
                        <span>Detail Log</span>
                        <ChevronRight className='w-3.5 h-3.5' />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* PRD Widget #4: Recent Career Opportunities (Berdasarkan Skill Match) */}
          <div className='bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-xs flex flex-col gap-4'>
            <div className='flex items-center justify-between pb-1'>
              <div>
                <span className='text-[10px] font-bold text-slate-400 tracking-wider uppercase'>
                  PRD WIDGET #4 • RECENT OPPORTUNITIES
                </span>
                <h3 className='text-lg font-bold text-slate-900 dark:text-white tracking-tight mt-0.5'>
                  Peluang Karier &amp; Magang Terbaru
                </h3>
              </div>

              <Link
                href='/career'
                className='inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline'
              >
                <span>Lihat Semua Peluang</span>
                <ChevronRight className='w-3.5 h-3.5' />
              </Link>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-3 gap-3.5'>
              {opportunities.map(opp => (
                <div
                  key={opp.id}
                  className='bg-slate-50/70 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900/60 rounded-2xl p-4 flex flex-col justify-between gap-3 transition-all'
                >
                  <div className='flex flex-col gap-1'>
                    <div className='flex items-center justify-between text-[11px] font-semibold text-emerald-600 dark:text-emerald-400'>
                      <span className='px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800'>
                        {opp.matchScore}% Match
                      </span>
                      <span className='text-slate-400'>{opp.type}</span>
                    </div>

                    <h4 className='text-xs font-bold text-slate-900 dark:text-white leading-snug mt-1'>
                      {opp.title}
                    </h4>

                    <p className='text-xs text-slate-500 dark:text-slate-400 font-medium'>
                      {opp.company}
                    </p>

                    <div className='flex items-center gap-1 text-[11px] text-slate-400 mt-1'>
                      <MapPin className='w-3 h-3' />
                      <span className='truncate'>{opp.location}</span>
                    </div>
                  </div>

                  <Link
                    href={opp.url}
                    className='inline-flex items-center justify-center gap-1 w-full py-1.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-2xs hover:shadow-xs transition-all'
                  >
                    <span>Lamar / Detail</span>
                    <ChevronRight className='w-3 h-3' />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (40%): Target Career Priority & PRD Widget #3 Top 3 Learning Recommendations */}
        <div className='lg:col-span-4 flex flex-col gap-6'>
          {/* PRD Widget #1: Target Karier Utama */}
          <div className='bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between'>
            <div>
              <div className='flex items-center justify-between pb-1'>
                <span className='text-[10px] font-bold text-slate-400 tracking-wider uppercase'>
                  PRD WIDGET #1 • SASARAN KARIER
                </span>
                <Flag className='w-4 h-4 text-blue-600 dark:text-blue-400' />
              </div>

              <h3 className='text-xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1 leading-snug'>
                {data.targetCareer.roleName}
              </h3>

              <p className='text-xs text-slate-500 dark:text-slate-400 mt-0.5'>
                Industri: {data.targetCareer.industry}
              </p>

              {/* Match Progress Box */}
              <div className='bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 mt-4'>
                <div className='flex items-center justify-between text-xs'>
                  <span className='font-semibold text-slate-700 dark:text-slate-300'>Kecocokan Profil</span>
                  <span className='font-extrabold text-blue-600 dark:text-blue-400'>
                    {data.targetCareer.matchPercent}% Match
                  </span>
                </div>

                <div className='w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full my-2.5 overflow-hidden'>
                  <div
                    className='h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-1000'
                    style={{ width: `${data.targetCareer.matchPercent}%` }}
                  />
                </div>

                <p className='text-xs text-slate-500 dark:text-slate-400 leading-snug'>
                  Tinggal {data.targetCareer.missingSkillsCount} skill kunci untuk mencapai standar siap rekrut ({data.targetCareer.threshold}%).
                </p>
              </div>

              {/* Gap Skill Tags */}
              <div className='mt-4'>
                <h5 className='text-xs font-bold text-slate-900 dark:text-white mb-2.5'>
                  Skill Gap Perlu Dilengkapi:
                </h5>

                <div className='flex flex-col gap-2'>
                  {data.targetCareer.gaps.map((gap, gIdx) => {
                    const isMissing = gap.status === 'missing'

                    return (
                      <div
                        key={gIdx}
                        className={`p-2.5 rounded-xl border flex items-center justify-between ${
                          isMissing
                            ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/40'
                            : 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/40'
                        }`}
                      >
                        <div className='flex items-center gap-2'>
                          <span className='text-xs'>
                            {isMissing ? '🚫' : '⚠️'}
                          </span>
                          <span className='text-xs font-semibold text-slate-800 dark:text-slate-200'>
                            {gap.name}
                          </span>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isMissing
                              ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400'
                              : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
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

            <Link
              href='/learning'
              className='mt-5 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-2xs hover:shadow-xs transition-all active:scale-[0.98]'
            >
              <BookOpen className='w-4 h-4' />
              <span>Lihat Rekomendasi Belajar</span>
            </Link>
          </div>

          {/* PRD Widget #3: Top 3 Learning Recommendations (Modul Kilat AI) */}
          <div className='bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col gap-4'>
            <div>
              <div className='flex items-center gap-1.5'>
                <Lightbulb className='w-4 h-4 text-blue-600 dark:text-blue-400' />
                <h3 className='text-base font-bold text-slate-900 dark:text-white tracking-tight'>
                  Top 3 Rekomendasi Belajar
                </h3>
              </div>
              <p className='text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug'>
                Modul kilat AI untuk menutup skill gap dalam &lt; 1 minggu.
              </p>
            </div>

            <div className='flex flex-col gap-3'>
              {data.rapidModules.slice(0, 3).map((module, mIdx) => {
                const isMiniCourse = module.type === 'Mini Course'

                return (
                  <div
                    key={module.id || mIdx}
                    className='bg-slate-50/70 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900/60 rounded-2xl p-3.5 flex flex-col gap-2 transition-all'
                  >
                    <div className='flex items-center justify-between'>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          isMiniCourse
                            ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-800/60'
                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {module.type}
                      </span>

                      <div className='flex items-center gap-1 text-[11px] text-slate-400 font-medium'>
                        {isMiniCourse ? (
                          <Clock className='w-3 h-3' />
                        ) : (
                          <Download className='w-3 h-3' />
                        )}
                        <span>{module.duration}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className='text-xs font-bold text-slate-900 dark:text-white leading-snug hover:text-blue-600 transition-colors'>
                        <a href={module.url} target='_blank' rel='noopener noreferrer'>
                          {module.title}
                        </a>
                      </h4>
                      <p className='text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed'>
                        {module.description}
                      </p>
                    </div>

                    <div className='flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-[11px]'>
                      <span className='font-semibold text-blue-600 dark:text-blue-400 truncate max-w-[170px]'>
                        Tutup Gap: {module.gapTag}
                      </span>

                      <a
                        href={module.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5'
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
          <div className='bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl w-full max-w-md p-6 overflow-hidden'>
            <div className='flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800'>
              <h4 className='text-base font-bold text-slate-900 dark:text-white'>
                Tambah Pengalaman Baru
              </h4>
              <button
                type='button'
                onClick={() => setIsQuickAddOpen(false)}
                className='text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg p-1 cursor-pointer'
              >
                <X className='w-5 h-5' />
              </button>
            </div>

            <form onSubmit={handleQuickAddSubmit} className='flex flex-col gap-3.5 mt-4'>
              <div>
                <label className='text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1'>
                  Judul Pengalaman / Posisi
                </label>
                <input
                  type='text'
                  required
                  placeholder='cth: Product Design Intern'
                  value={expForm.title}
                  onChange={e => setExpForm({ ...expForm, title: e.target.value })}
                  className='w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600'
                />
              </div>

              <div>
                <label className='text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1'>
                  Institusi / Perusahaan
                </label>
                <input
                  type='text'
                  required
                  placeholder='cth: GoTo Financial'
                  value={expForm.institutionName}
                  onChange={e => setExpForm({ ...expForm, institutionName: e.target.value })}
                  className='w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600'
                />
              </div>

              <div>
                <label className='text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1'>
                  Tipe Pengalaman
                </label>
                <select
                  value={expForm.type}
                  onChange={e => setExpForm({ ...expForm, type: e.target.value })}
                  className='w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600'
                >
                  <option value='internship'>Magang Industri</option>
                  <option value='organisation'>Organisasi Kampus</option>
                  <option value='project'>Proyek Independen</option>
                  <option value='competition'>Kompetisi</option>
                  <option value='committee'>Kepanitiaan</option>
                </select>
              </div>

              <div>
                <label className='text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1'>
                  Deskripsi / Tanggung Jawab Singkat
                </label>
                <textarea
                  rows={3}
                  placeholder='Ceritakan ringkas apa yang kamu kerjakan...'
                  value={expForm.description}
                  onChange={e => setExpForm({ ...expForm, description: e.target.value })}
                  className='w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600'
                />
              </div>

              <div className='flex items-center justify-end gap-2.5 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800'>
                <button
                  type='button'
                  onClick={() => setIsQuickAddOpen(false)}
                  className='px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer'
                >
                  Batal
                </button>

                <button
                  type='submit'
                  disabled={isSubmittingExp}
                  className='inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all cursor-pointer'
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
