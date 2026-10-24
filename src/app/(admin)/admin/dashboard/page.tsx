'use client'

import React, { useState, useEffect } from 'react'

import Link from 'next/link'

import {
  Layers,
  Briefcase,
  GraduationCap,
  Sparkles,
  Plus,
  ArrowRight,
  Database,
  Cpu,
  Clock,
  ShieldCheck,
  RefreshCw
} from 'lucide-react'

import AdminStatCard from '@/components/admin/AdminStatCard'

interface OverviewData {
  counts: {
    skills: number
    careerRoles: number
    learningResources: number
    opportunities: number
  }
  recent: {
    skills: Array<{ id: string; name: string; category: string; createdAt: string }>
    roles: Array<{ id: string; name: string; industry: string | null; createdAt: string }>
  }
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<OverviewData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchOverview = async () => {
    setLoading(true)

    try {
      const res = await fetch('/api/admin/overview')
      const json = await res.json()

      if (json.success && json.data) {
        setData(json.data)
      }
    } catch (err) {
      console.error('Failed to load overview data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOverview()
  }, [])

  return (
    <div className='space-y-8 animate-fade-in'>
      {/* Welcome Hero Banner */}
      <div className='relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900/90 via-indigo-900/90 to-slate-900/90 border border-purple-500/30 p-6 sm:p-8 text-white shadow-xl shadow-purple-950/30'>
        <div className='absolute -top-24 -right-24 w-80 h-80 rounded-full bg-purple-500/20 blur-3xl pointer-events-none' />

        <div className='relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6'>
          <div className='space-y-2 max-w-2xl'>
            <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-xs font-semibold'>
              <ShieldCheck className='w-3.5 h-3.5 text-purple-300' />
              <span>Admin Management Hub</span>
            </div>
            <h2 className='text-2xl sm:text-3xl font-extrabold tracking-tight text-white'>
              Master Data Intelligence Console
            </h2>
            <p className='text-xs sm:text-sm text-purple-200/80 leading-relaxed'>
              Kelola seluruh taksonomi skill, target karier, rekomendasi belajar, dan peluang kerja yang menggerakkan mesin rekomendasi AI Growvia.
            </p>
          </div>

          <div className='flex items-center gap-3 shrink-0'>
            <button
              onClick={fetchOverview}
              disabled={loading}
              className='px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50'
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Muat Ulang</span>
            </button>
            <Link
              href='/admin/skills'
              className='px-4 py-2.5 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/40 transition-all flex items-center gap-1.5'
            >
              <Plus className='w-4 h-4' />
              <span>Tambah Skill</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5'>
        <AdminStatCard
          title='Master Skills'
          value={loading ? '...' : data?.counts.skills ?? 0}
          subtitle='Taksonomi keahlian aktif'
          icon={Layers}
          href='/admin/skills'
          gradient='bg-purple-500'
          color='text-purple-600 dark:text-purple-400'
        />
        <AdminStatCard
          title='Career Paths'
          value={loading ? '...' : data?.counts.careerRoles ?? 0}
          subtitle='Peran karier sasaran'
          icon={Briefcase}
          href='/admin/career-roles'
          gradient='bg-indigo-500'
          color='text-indigo-600 dark:text-indigo-400'
        />
        <AdminStatCard
          title='Learning Resources'
          value={loading ? '...' : data?.counts.learningResources ?? 0}
          subtitle='Kursus & materi belajar'
          icon={GraduationCap}
          href='/admin/learning-resources'
          gradient='bg-sky-500'
          color='text-sky-600 dark:text-sky-400'
        />
        <AdminStatCard
          title='Opportunities'
          value={loading ? '...' : data?.counts.opportunities ?? 0}
          subtitle='Lowongan magang & kerja'
          icon={Sparkles}
          href='/admin/opportunities'
          gradient='bg-amber-500'
          color='text-amber-600 dark:text-amber-400'
        />
      </div>

      {/* Quick Action Shortcuts & System Architecture */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Quick Actions Panel */}
        <div className='lg:col-span-2 rounded-2xl bg-white dark:bg-[#0F1424] border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-sm'>
          <h3 className='text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4'>
            Aksi Cepat Pengelolaan Master Data
          </h3>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3.5'>
            <Link
              href='/admin/skills'
              className='p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-purple-500/50 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-all flex items-center justify-between group'
            >
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold'>
                  <Layers className='w-5 h-5' />
                </div>
                <div>
                  <h4 className='text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors'>
                    Kelola Skill Taxonomy
                  </h4>
                  <p className='text-[11px] text-slate-500 dark:text-slate-400'>
                    Tambah & perbarui keahlian
                  </p>
                </div>
              </div>
              <ArrowRight className='w-4 h-4 text-slate-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all' />
            </Link>

            <Link
              href='/admin/career-roles'
              className='p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-all flex items-center justify-between group'
            >
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold'>
                  <Briefcase className='w-5 h-5' />
                </div>
                <div>
                  <h4 className='text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors'>
                    Kelola Career Paths
                  </h4>
                  <p className='text-[11px] text-slate-500 dark:text-slate-400'>
                    Atur peran & required skills
                  </p>
                </div>
              </div>
              <ArrowRight className='w-4 h-4 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all' />
            </Link>

            <Link
              href='/admin/learning-resources'
              className='p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-sky-500/50 hover:bg-sky-50/50 dark:hover:bg-sky-950/20 transition-all flex items-center justify-between group'
            >
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold'>
                  <GraduationCap className='w-5 h-5' />
                </div>
                <div>
                  <h4 className='text-xs font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors'>
                    Kelola Materi Belajar
                  </h4>
                  <p className='text-[11px] text-slate-500 dark:text-slate-400'>
                    Input kursus & tautkan skill tags
                  </p>
                </div>
              </div>
              <ArrowRight className='w-4 h-4 text-slate-400 group-hover:text-sky-500 group-hover:translate-x-1 transition-all' />
            </Link>

            <Link
              href='/admin/opportunities'
              className='p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-amber-500/50 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 transition-all flex items-center justify-between group'
            >
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold'>
                  <Sparkles className='w-5 h-5' />
                </div>
                <div>
                  <h4 className='text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors'>
                    Kelola Lowongan Karier
                  </h4>
                  <p className='text-[11px] text-slate-500 dark:text-slate-400'>
                    Input magang & kualifikasi
                  </p>
                </div>
              </div>
              <ArrowRight className='w-4 h-4 text-slate-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-all' />
            </Link>
          </div>
        </div>

        {/* System Status Panel */}
        <div className='rounded-2xl bg-white dark:bg-[#0F1424] border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-sm flex flex-col justify-between'>
          <div>
            <h3 className='text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4'>
              Status Sistem & Database
            </h3>

            <div className='space-y-4'>
              <div className='flex items-start gap-3'>
                <div className='w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0'>
                  <Database className='w-4 h-4' />
                </div>
                <div>
                  <p className='text-xs font-semibold text-slate-900 dark:text-white'>
                    Database PostgreSQL (Supabase)
                  </p>
                  <p className='text-[11px] text-emerald-600 dark:text-emerald-400 font-medium'>
                    ● Terkoneksi & Prisma ORM Ready
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-3'>
                <div className='w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0'>
                  <Cpu className='w-4 h-4' />
                </div>
                <div>
                  <p className='text-xs font-semibold text-slate-900 dark:text-white'>
                    AI Extractor & Match Engine
                  </p>
                  <p className='text-[11px] text-purple-600 dark:text-purple-400 font-medium'>
                    ● Google Gemini & Groq Hybrid
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-3'>
                <div className='w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0'>
                  <Clock className='w-4 h-4' />
                </div>
                <div>
                  <p className='text-xs font-semibold text-slate-900 dark:text-white'>
                    Sesi Keamanan Admin
                  </p>
                  <p className='text-[11px] text-slate-500 dark:text-slate-400'>
                    Masa aktif 8 Jam (HTTP-Only Token)
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className='mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400'>
            Growvia Admin Portal v1.0 • Sprint 6 Release
          </div>
        </div>
      </div>
    </div>
  )
}
