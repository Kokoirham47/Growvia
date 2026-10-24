'use client'

import React, { useState, useEffect, useMemo } from 'react'

import Link from 'next/link'

import {
  TrendingUp,
  Award,
  Briefcase,
  Plus,
  ExternalLink,
  ChevronRight,
  Clock,
  Star,
  Sparkles,
  Calendar,
  MapPin,
  CheckCircle2,
  RefreshCw,
  AlertCircle
} from 'lucide-react'

interface DashboardData {
  user: {
    name: string
    email: string
    avatarUrl?: string | null
    dateFormatted: string
  }
  statCards: {
    careerReadiness: {
      percentage: number
      targetRole: string
      targetScoreBenchmark: number
    }
    totalSkills: {
      count: number
      recentCount: number
      hardSkillsCount: number
      softSkillsCount: number
    }
    experiences: {
      count: number
    }
  }
  skillPatternMap: {
    nodes: Array<{
      id: string
      name: string
      category: string
      level: string
      x: number
      y: number
    }>
    edges: Array<{
      source: string
      target: string
    }>
  }
  learningRecommendations: Array<{
    id: string
    title: string
    platform: string
    url: string
    skillTag: string
    duration: string
    difficulty: string
    rating: number
    matchPercent: number
  }>
  careerOpportunities: Array<{
    id: string
    title: string
    company: string
    location: string
    type: string
    sourceUrl: string
    matchPercent: number
    skillTags: string[]
  }>
  growthProgress: {
    months: Array<{
      month: string
      count: number
      percentage: number
    }>
    growthPercentage: number
  }
}

export default function DashboardView() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Interactive Node selection for Skill Pattern Map
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [skillCategoryFilter, setSkillCategoryFilter] = useState<'all' | 'hard' | 'soft'>('all')

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
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan sistem.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Filter nodes on map based on category filter
  const filteredNodes = useMemo(() => {
    if (!data?.skillPatternMap.nodes) return []
    if (skillCategoryFilter === 'all') return data.skillPatternMap.nodes

    if (skillCategoryFilter === 'hard') {
      return data.skillPatternMap.nodes.filter(
        n => n.category === 'hard_skill' || n.category === 'technical'
      )
    }

    return data.skillPatternMap.nodes.filter(
      n => n.category === 'soft_skill' || n.category === 'leadership'
    )
  }, [data?.skillPatternMap.nodes, skillCategoryFilter])

  const filteredNodeIds = useMemo(() => {
    return new Set(filteredNodes.map(n => n.id))
  }, [filteredNodes])

  const filteredEdges = useMemo(() => {
    if (!data?.skillPatternMap.edges) return []

    return data.skillPatternMap.edges.filter(
      e => filteredNodeIds.has(e.source) && filteredNodeIds.has(e.target)
    )
  }, [data?.skillPatternMap.edges, filteredNodeIds])

  const selectedNode = useMemo(() => {
    if (!selectedNodeId || !data) return null

    return data.skillPatternMap.nodes.find(n => n.id === selectedNodeId) || null
  }, [selectedNodeId, data])

  if (isLoading) {
    return (
      <div className='flex flex-col gap-6 w-full max-w-[1440px] mx-auto p-4 sm:p-6 lg:p-8 animate-pulse font-["Poppins",sans-serif]'>
        {/* Skeleton Greeting */}
        <div className='flex items-center justify-between'>
          <div className='h-9 w-72 bg-slate-200 dark:bg-slate-800 rounded-xl' />
          <div className='h-8 w-44 bg-slate-200 dark:bg-slate-800 rounded-xl' />
        </div>

        {/* Skeleton Top Row Stat Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className='h-40 rounded-2xl bg-white dark:bg-slate-900 border border-[#E8ECF2] dark:border-slate-800 p-6'
            />
          ))}
        </div>

        {/* Skeleton Middle Row */}
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
          <div className='lg:col-span-8 h-96 rounded-2xl bg-white dark:bg-slate-900 border border-[#E8ECF2] dark:border-slate-800 p-6' />
          <div className='lg:col-span-4 h-96 rounded-2xl bg-indigo-50/60 dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 p-6' />
        </div>

        {/* Skeleton Bottom Row */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div className='h-64 rounded-2xl bg-white dark:bg-slate-900 border border-[#E8ECF2] dark:border-slate-800 p-6' />
          <div className='h-64 rounded-2xl bg-white dark:bg-slate-900 border border-[#E8ECF2] dark:border-slate-800 p-6' />
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[500px] gap-4 text-center p-6 font-["Poppins",sans-serif]'>
        <div className='w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 flex items-center justify-center'>
          <AlertCircle className='w-7 h-7' />
        </div>
        <h3 className='text-xl font-bold text-slate-900 dark:text-white'>
          Gagal Memuat Dashboard
        </h3>
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

  // Circular progress math
  const readinessPct = data.statCards.careerReadiness.percentage
  const radius = 34
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (readinessPct / 100) * circumference

  return (
    <div
      style={{ fontFamily: "'Poppins', sans-serif" }}
      className='flex flex-col gap-6 w-full max-w-[1440px] mx-auto p-4 sm:p-6 lg:p-8 bg-[#F5F6F8] dark:bg-[#0B1120] text-slate-800 dark:text-slate-100 font-["Poppins",sans-serif]'
    >
      {/* 1. GREETING BAR */}
      <section className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-1'>
        <div className='flex flex-col gap-1'>
          <h3 className='text-2xl sm:text-3xl font-extrabold text-[#1E3A8A] dark:text-white tracking-tight flex items-center gap-2'>
            <span>Selamat datang kembali, {data.user.name.split(' ')[0]}!</span>
            <span className='inline-block origin-[70%_70%] animate-wave'>👋</span>
          </h3>
          <p className='text-xs sm:text-sm text-slate-500 dark:text-slate-400'>
            Pantau perkembangan kesiapan karier dan kemajuan skill portofoliomu hari ini.
          </p>
        </div>

        {/* Date right-aligned */}
        <div className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-[#E8ECF2] dark:border-slate-800 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 shadow-xs self-start sm:self-center'>
          <Calendar className='w-4 h-4 text-[#2563EB]' />
          <span>{data.user.dateFormatted}</span>
        </div>
      </section>

      {/* 2. TOP ROW — 3 STAT CARDS */}
      <section className='grid grid-cols-1 md:grid-cols-3 gap-5'>
        {/* Stat Card 1: Career Readiness */}
        <div className='bg-white dark:bg-slate-900 rounded-2xl border border-[#E8ECF2] dark:border-slate-800 p-6 shadow-sm flex items-center justify-between hover:border-blue-200 dark:hover:border-blue-900 transition-all'>
          <div className='flex flex-col gap-2'>
            <span className='text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500'>
              Career Readiness
            </span>

            <div className='flex items-baseline gap-2'>
              <h2 className='text-3xl sm:text-4xl font-extrabold text-[#1E3A8A] dark:text-white tracking-tight'>
                {readinessPct}%
              </h2>
            </div>

            <div className='flex items-center gap-1.5 mt-0.5'>
              <span className='px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60'>
                {data.statCards.careerReadiness.targetRole}
              </span>
            </div>

            <Link
              href='/career'
              className='inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:text-blue-700 transition-colors mt-2'
            >
              <span>Lihat Detail Gap</span>
              <ChevronRight className='w-3.5 h-3.5' />
            </Link>
          </div>

          {/* Circular Progress Gauge */}
          <div className='relative w-24 h-24 flex items-center justify-center shrink-0'>
            <svg className='w-full h-full transform -rotate-90' viewBox='0 0 88 88'>
              {/* Background circle */}
              <circle
                cx='44'
                cy='44'
                r={radius}
                className='stroke-slate-100 dark:stroke-slate-800 fill-none'
                strokeWidth='8'
              />
              {/* Green arc stroke */}
              <circle
                cx='44'
                cy='44'
                r={radius}
                className='stroke-emerald-500 fill-none transition-all duration-1000 ease-out'
                strokeWidth='8'
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap='round'
              />
            </svg>
            <div className='absolute flex flex-col items-center justify-center text-center'>
              <span className='text-xs font-bold text-slate-800 dark:text-white'>
                {readinessPct}%
              </span>
              <span className='text-[9px] text-slate-400'>Kesiapan</span>
            </div>
          </div>
        </div>

        {/* Stat Card 2: Total Skills */}
        <div className='bg-white dark:bg-slate-900 rounded-2xl border border-[#E8ECF2] dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between hover:border-blue-200 dark:hover:border-blue-900 transition-all'>
          <div>
            <div className='flex items-center justify-between'>
              <span className='text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500'>
                Total Skills
              </span>
              <div className='w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] flex items-center justify-center'>
                <Award className='w-4 h-4' />
              </div>
            </div>

            <div className='flex items-baseline gap-2.5 mt-2'>
              <h2 className='text-3xl sm:text-4xl font-extrabold text-[#1E3A8A] dark:text-white tracking-tight'>
                {data.statCards.totalSkills.count}
              </h2>
              <span className='text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 flex items-center gap-1'>
                <TrendingUp className='w-3 h-3' />
                <span>+{data.statCards.totalSkills.recentCount} bulan ini</span>
              </span>
            </div>

            <p className='text-xs text-slate-500 dark:text-slate-400 mt-2'>
              {data.statCards.totalSkills.hardSkillsCount} Hard Skill • {data.statCards.totalSkills.softSkillsCount} Soft Skill tervalidasi
            </p>
          </div>

          <Link
            href='/skills'
            className='inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:text-blue-700 transition-colors mt-4'
          >
            <span>Buka Skill Matrix</span>
            <ChevronRight className='w-3.5 h-3.5' />
          </Link>
        </div>

        {/* Stat Card 3: Experience Added */}
        <div className='bg-white dark:bg-slate-900 rounded-2xl border border-[#E8ECF2] dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between hover:border-blue-200 dark:hover:border-blue-900 transition-all'>
          <div>
            <div className='flex items-center justify-between'>
              <span className='text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500'>
                Experience Added
              </span>
              <div className='w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-[#6366F1] flex items-center justify-center'>
                <Briefcase className='w-4 h-4' />
              </div>
            </div>

            <div className='flex items-baseline gap-2 mt-2'>
              <h2 className='text-3xl sm:text-4xl font-extrabold text-[#1E3A8A] dark:text-white tracking-tight'>
                {data.statCards.experiences.count}
              </h2>
              <span className='text-sm text-slate-500 font-medium'>pengalaman</span>
            </div>

            <p className='text-xs text-slate-500 dark:text-slate-400 mt-2'>
              Terdokumentasi & siap diekstrak menjadi bukti portofolio.
            </p>
          </div>

          <Link
            href='/experience'
            className='inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold transition-all shadow-xs active:scale-[0.98] mt-4'
          >
            <Plus className='w-4 h-4' />
            <span>Tambah Pengalaman</span>
          </Link>
        </div>
      </section>

      {/* 3. MIDDLE ROW: SKILL PATTERN MAP (65%) + LEARNING RECOMMENDATIONS (35%) */}
      <section className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
        {/* Left: Skill Pattern Map (large card, 65% width) */}
        <div className='lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-[#E8ECF2] dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between'>
          {/* Card Header & Controls */}
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800'>
            <div>
              <div className='flex items-center gap-2'>
                <h3 className='text-lg font-bold text-[#1E3A8A] dark:text-white tracking-tight'>
                  Skill Pattern Map
                </h3>
                <span className='px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-[#6366F1] border border-indigo-100 dark:border-indigo-900/40'>
                  Node Graph
                </span>
              </div>
              <p className='text-xs text-slate-500 dark:text-slate-400 mt-0.5'>
                Visualisasi interaktif relasi dan kluster keahlian berbasis bukti portofoliomu.
              </p>
            </div>

            {/* Filter buttons */}
            <div className='flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 self-start sm:self-center'>
              <button
                type='button'
                onClick={() => setSkillCategoryFilter('all')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  skillCategoryFilter === 'all'
                    ? 'bg-white dark:bg-slate-700 text-[#2563EB] shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Semua
              </button>
              <button
                type='button'
                onClick={() => setSkillCategoryFilter('hard')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  skillCategoryFilter === 'hard'
                    ? 'bg-white dark:bg-slate-700 text-[#2563EB] shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Hard Skill
              </button>
              <button
                type='button'
                onClick={() => setSkillCategoryFilter('soft')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  skillCategoryFilter === 'soft'
                    ? 'bg-white dark:bg-slate-700 text-[#2563EB] shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Soft Skill
              </button>
            </div>
          </div>

          {/* SVG Node Graph Canvas */}
          <div className='relative w-full h-[320px] my-3 rounded-xl bg-slate-50/60 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/70 overflow-hidden flex items-center justify-center'>
            <svg className='w-full h-full' viewBox='0 0 600 320'>
              <defs>
                <linearGradient id='edgeGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
                  <stop offset='0%' stopColor='#2563EB' stopOpacity='0.4' />
                  <stop offset='100%' stopColor='#6366F1' stopOpacity='0.4' />
                </linearGradient>
                <filter id='nodeGlow' x='-20%' y='-20%' width='140%' height='140%'>
                  <feGaussianBlur stdDeviation='3' result='blur' />
                  <feComposite in='SourceGraphic' in2='blur' operator='over' />
                </filter>
              </defs>

              {/* Connecting Edges */}
              {filteredEdges.map((edge, idx) => {
                const sNode = filteredNodes.find(n => n.id === edge.source)
                const tNode = filteredNodes.find(n => n.id === edge.target)

                if (!sNode || !tNode) return null

                return (
                  <line
                    key={idx}
                    x1={sNode.x}
                    y1={sNode.y}
                    x2={tNode.x}
                    y2={tNode.y}
                    stroke='url(#edgeGradient)'
                    strokeWidth='1.8'
                    strokeDasharray='4 3'
                    className='transition-all duration-300'
                  />
                )
              })}

              {/* Skill Nodes */}
              {filteredNodes.map(node => {
                const isSelected = selectedNodeId === node.id

                const isLeadershipOrSoft =
                  node.category === 'soft_skill' || node.category === 'leadership'

                // Blue (#2563EB) for technical, Indigo (#6366F1) for soft/leadership
                const nodeColor = isLeadershipOrSoft ? '#6366F1' : '#2563EB'

                const haloColor = isLeadershipOrSoft
                  ? 'rgba(99, 102, 241, 0.25)'
                  : 'rgba(37, 99, 235, 0.25)'

                return (
                  <g
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id === selectedNodeId ? null : node.id)}
                    className='cursor-pointer transition-transform duration-200 hover:scale-110'
                  >
                    {/* Outer halo on select or hover */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isSelected ? 26 : 20}
                      fill={haloColor}
                      className='transition-all duration-300'
                    />

                    {/* Core node */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isSelected ? 16 : 13}
                      fill={nodeColor}
                      stroke='#FFFFFF'
                      strokeWidth='2.5'
                      filter='url(#nodeGlow)'
                    />

                    {/* Skill Label */}
                    <text
                      x={node.x}
                      y={node.y + 25}
                      textAnchor='middle'
                      className='fill-slate-700 dark:fill-slate-200 font-semibold text-[11px] pointer-events-none'
                    >
                      {node.name}
                    </text>
                  </g>
                )
              })}
            </svg>

            {/* Selected Node Tooltip Overlay */}
            {selectedNode && (
              <div className='absolute bottom-3 left-3 z-10 px-3.5 py-2 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border border-slate-200 dark:border-slate-800 shadow-md flex items-center gap-2.5 text-xs animate-in fade-in duration-200'>
                <div
                  className='w-3 h-3 rounded-full'
                  style={{
                    backgroundColor:
                      selectedNode.category === 'soft_skill' || selectedNode.category === 'leadership'
                        ? '#6366F1'
                        : '#2563EB'
                  }}
                />
                <div>
                  <span className='font-bold text-slate-900 dark:text-white'>{selectedNode.name}</span>
                  <span className='text-slate-400 mx-1.5'>•</span>
                  <span className='text-slate-500 capitalize'>Level: {selectedNode.level}</span>
                </div>
              </div>
            )}
          </div>

          {/* Map Footer legend */}
          <div className='flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800'>
            <div className='flex items-center gap-4'>
              <div className='inline-flex items-center gap-1.5'>
                <span className='w-2.5 h-2.5 rounded-full bg-[#2563EB]' />
                <span>Hard & Technical Skill</span>
              </div>
              <div className='inline-flex items-center gap-1.5'>
                <span className='w-2.5 h-2.5 rounded-full bg-[#6366F1]' />
                <span>Soft & Leadership</span>
              </div>
            </div>
            <Link
              href='/skills'
              className='inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:text-blue-700 transition-colors'
            >
              <span>Detail Skill Matrix</span>
              <ExternalLink className='w-3.5 h-3.5' />
            </Link>
          </div>
        </div>

        {/* Right: Learning Recommendations (35% width, background #EEF2FF) */}
        <div className='lg:col-span-4 rounded-2xl bg-[#EEF2FF] dark:bg-indigo-950/30 border border-indigo-100/90 dark:border-indigo-900/50 p-6 shadow-sm flex flex-col justify-between'>
          <div>
            {/* Header */}
            <div className='flex items-center justify-between pb-3'>
              <div className='flex items-center gap-2'>
                <div className='w-7 h-7 rounded-lg bg-[#6366F1] text-white flex items-center justify-center shadow-xs'>
                  <Sparkles className='w-4 h-4' />
                </div>
                <h3 className='text-base font-bold text-[#1E3A8A] dark:text-indigo-200 tracking-tight'>
                  Learning Recommendations
                </h3>
              </div>
              <span className='text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300'>
                AI Curated
              </span>
            </div>

            <p className='text-xs text-indigo-950/70 dark:text-indigo-300/80 mb-4'>
              Materi terpilih untuk menutup gap skill prioritasmu:
            </p>

            {/* Stacked 3 Resource Cards */}
            <div className='flex flex-col gap-3'>
              {data.learningRecommendations.map((resource, idx) => (
                <div
                  key={resource.id || idx}
                  className='rounded-xl bg-white dark:bg-slate-900 border border-indigo-100/80 dark:border-indigo-900/40 p-3.5 shadow-2xs hover:shadow-sm transition-all'
                >
                  <div className='flex items-center justify-between gap-2 mb-1.5'>
                    <span className='px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/80 text-[#6366F1] dark:text-indigo-400'>
                      {resource.skillTag}
                    </span>
                    <span className='text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.2 rounded'>
                      {resource.matchPercent}% Match
                    </span>
                  </div>

                  <h5 className='text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug hover:text-[#2563EB] transition-colors'>
                    <a href={resource.url} target='_blank' rel='noopener noreferrer'>
                      {resource.title}
                    </a>
                  </h5>

                  <div className='flex items-center justify-between mt-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400'>
                    <span className='font-medium text-slate-600 dark:text-slate-300 truncate max-w-[120px]'>
                      {resource.platform}
                    </span>
                    <div className='flex items-center gap-2 shrink-0'>
                      <div className='inline-flex items-center gap-1'>
                        <Clock className='w-3 h-3 text-slate-400' />
                        <span>{resource.duration}</span>
                      </div>
                      <div className='inline-flex items-center gap-0.5 text-amber-500 font-bold'>
                        <Star className='w-3 h-3 fill-amber-500' />
                        <span>{resource.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link
            href='/learning'
            className='inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all shadow-xs mt-4'
          >
            <span>Buka Semua Rekomendasi Belajar</span>
            <ChevronRight className='w-3.5 h-3.5' />
          </Link>
        </div>
      </section>

      {/* 4. BOTTOM ROW: CAREER OPPORTUNITIES (50%) + GROWTH PROGRESS (50%) */}
      <section className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Left: Career Opportunities (50%) */}
        <div className='bg-white dark:bg-slate-900 rounded-2xl border border-[#E8ECF2] dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between'>
          <div>
            <div className='flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800'>
              <div>
                <h3 className='text-lg font-bold text-[#1E3A8A] dark:text-white tracking-tight'>
                  Career Opportunities
                </h3>
                <p className='text-xs text-slate-500 dark:text-slate-400 mt-0.5'>
                  Peluang magang & kerja dengan kecocokan skill profil kamu.
                </p>
              </div>
              <span className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse' />
            </div>

            {/* 2 Job Cards */}
            <div className='flex flex-col gap-3.5 mt-4'>
              {data.careerOpportunities.map(job => (
                <div
                  key={job.id}
                  className='p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900 bg-slate-50/50 dark:bg-slate-800/40 transition-all flex flex-col gap-2'
                >
                  <div className='flex items-start justify-between gap-3'>
                    <div>
                      <h4 className='text-sm font-bold text-slate-900 dark:text-white leading-snug'>
                        {job.title}
                      </h4>
                      <p className='text-xs text-slate-500 mt-0.5 flex items-center gap-1.5'>
                        <span className='font-semibold text-slate-700 dark:text-slate-300'>
                          {job.company}
                        </span>
                        <span>•</span>
                        <span className='inline-flex items-center gap-0.5'>
                          <MapPin className='w-3 h-3 text-slate-400' />
                          {job.location}
                        </span>
                      </p>
                    </div>

                    {/* Skill Match Badge */}
                    <span className='px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 shrink-0'>
                      {job.matchPercent}% Match
                    </span>
                  </div>

                  {/* Skill tags */}
                  <div className='flex flex-wrap items-center gap-1.5 mt-1'>
                    <span className='text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-[#2563EB]'>
                      {job.type}
                    </span>
                    {job.skillTags.map((tag, sIdx) => (
                      <span
                        key={sIdx}
                        className='text-[10px] font-medium px-2 py-0.5 rounded bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link
            href='/career'
            className='inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:text-blue-700 transition-colors mt-4'
          >
            <span>Eksplor Lowongan Lainnya di Menu Karier</span>
            <ChevronRight className='w-3.5 h-3.5' />
          </Link>
        </div>

        {/* Right: Growth Progress (50%) */}
        <div className='bg-white dark:bg-slate-900 rounded-2xl border border-[#E8ECF2] dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between'>
          <div>
            <div className='flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800'>
              <div>
                <h3 className='text-lg font-bold text-[#1E3A8A] dark:text-white tracking-tight'>
                  Growth Progress
                </h3>
                <p className='text-xs text-slate-500 dark:text-slate-400 mt-0.5'>
                  Perkembangan akumulasi skill selama 3 bulan terakhir.
                </p>
              </div>

              <div className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-[#2563EB]'>
                <TrendingUp className='w-3.5 h-3.5' />
                <span>+{data.growthProgress.growthPercentage}% Kecepatan</span>
              </div>
            </div>

            {/* 3 Months Bar Chart */}
            <div className='mt-6 flex flex-col gap-5'>
              <div className='grid grid-cols-3 gap-4 items-end h-36 px-4 pt-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800'>
                {data.growthProgress.months.map((m, idx) => (
                  <div key={idx} className='flex flex-col items-center gap-2 h-full justify-end'>
                    <span className='text-xs font-bold text-slate-800 dark:text-slate-200'>
                      {m.count}
                    </span>
                    <div className='w-full max-w-[48px] bg-slate-200 dark:bg-slate-700 h-24 rounded-t-lg relative overflow-hidden'>
                      <div
                        className={`absolute bottom-0 left-0 right-0 rounded-t-lg transition-all duration-1000 ${
                          idx === 2 ? 'bg-[#2563EB]' : 'bg-blue-400 dark:bg-blue-500'
                        }`}
                        style={{ height: `${m.percentage}%` }}
                      />
                    </div>
                    <span className='text-xs font-medium text-slate-500 pb-2'>{m.month}</span>
                  </div>
                ))}
              </div>

              {/* Progress Summary Milestone Banner */}
              <div className='p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 flex items-center gap-3'>
                <div className='w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 flex items-center justify-center shrink-0'>
                  <CheckCircle2 className='w-4 h-4' />
                </div>
                <div className='flex flex-col'>
                  <span className='text-xs font-bold text-emerald-900 dark:text-emerald-200 leading-snug'>
                    Level Kompetensi Meningkat
                  </span>
                  <span className='text-[11px] text-emerald-700 dark:text-emerald-300'>
                    Kamu telah menyelesaikan 3 tonggak milestone portofolio sejak bulan lalu.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Link
            href='/skills'
            className='inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:text-blue-700 transition-colors mt-4'
          >
            <span>Lihat Riwayat & Progres Lengkap</span>
            <ChevronRight className='w-3.5 h-3.5' />
          </Link>
        </div>
      </section>
    </div>
  )
}
