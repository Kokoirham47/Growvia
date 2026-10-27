'use client'

import React from 'react'

import Link from 'next/link'

import {
  Mail,
  ShieldCheck,
  Sparkles
} from 'lucide-react'

import type {
  PublicPortfolioData,
  PortfolioTheme,
  PortfolioSectionVisibility
} from '@/types/portfolio'
import PublicPortfolioHero from './PublicPortfolioHero'
import PublicPortfolioSkills from './PublicPortfolioSkills'
import PublicPortfolioExperiences from './PublicPortfolioExperiences'

interface PublicPortfolioContentProps {
  data: PublicPortfolioData
  theme?: PortfolioTheme
  sections?: PortfolioSectionVisibility
  isPreviewMode?: boolean
  isMobileView?: boolean
}

export default function PublicPortfolioContent({
  data,
  theme = 'royal-blue',
  sections = {
    work: true,
    projects: true,
    organisations: true,
    competitions: true,
    skills: true,
    education: true
  },
  isMobileView = false
}: PublicPortfolioContentProps) {
  // Filter experiences berdasarkan visibilitas seksi
  const visibleExperiences = data.experiences.filter(exp => {
    if (exp.type === 'internship' && !sections.work) return false
    if (exp.type === 'project' && !sections.projects) return false
    if (exp.type === 'organisation' && !sections.organisations) return false
    if (exp.type === 'competition' && !sections.competitions) return false
    
return true
  })

  const getThemeFooterCta = () => {
    switch (theme) {
      case 'emerald-modern':
        return 'from-emerald-600 to-teal-700 text-white'
      case 'sleek-slate':
        return 'from-slate-900 to-zinc-900 text-white'
      case 'royal-blue':
      default:
        return 'from-blue-600 to-indigo-700 text-white'
    }
  }

  return (
    <div
      style={{ fontFamily: "'Poppins', sans-serif" }}
      className={`w-full flex flex-col min-h-screen bg-slate-50/50 dark:bg-slate-950 font-["Poppins",sans-serif] text-slate-900 dark:text-slate-100 transition-colors ${
        isMobileView ? 'text-xs' : ''
      }`}
    >
      {/* 1. Hero Section */}
      <PublicPortfolioHero data={data} theme={theme} isMobileView={isMobileView} />

      {/* 2. Evidence-Backed Skills Section */}
      {sections.skills && data.skills.length > 0 && (
        <PublicPortfolioSkills skills={data.skills} theme={theme} isMobileView={isMobileView} />
      )}

      {/* 3. Experiences Section */}
      {visibleExperiences.length > 0 && (
        <PublicPortfolioExperiences experiences={visibleExperiences} theme={theme} isMobileView={isMobileView} />
      )}

      {/* 4. Recruiter Contact & Growvia Verification Banner */}
      <section className={`w-full ${isMobileView ? 'py-6' : 'py-10 sm:py-14'}`}>
        <div className={`mx-auto ${isMobileView ? 'px-3 w-full' : 'max-w-5xl px-4 sm:px-6'}`}>
          <div
            className={`rounded-3xl bg-gradient-to-r shadow-xl flex flex-col gap-5 ${
              isMobileView
                ? 'p-5 items-start text-left'
                : 'p-7 sm:p-10 md:flex-row items-center justify-between gap-6'
            } ${getThemeFooterCta()}`}
          >
            <div className='flex flex-col items-start text-left gap-2'>
              <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white'>
                <ShieldCheck className='w-3.5 h-3.5' />
                <span>Terbuka Untuk Peluang Tech & Magang</span>
              </div>
              <h3 className={`font-extrabold tracking-tight text-white ${isMobileView ? 'text-base' : 'text-xl sm:text-2xl'}`}>
                Tertarik Merekrut atau Berkolaborasi dengan {data.user.name.split(' ')[0]}?
              </h3>
              <p className={`text-white/85 leading-relaxed ${isMobileView ? 'text-xs' : 'text-xs sm:text-sm max-w-lg'}`}>
                Profil ini terverifikasi secara resmi di platform Growvia dengan kapabilitas keahlian dan rekam jejak pengalaman yang tervalidasi.
              </p>
            </div>

            {data.user.email && (
              <div className={`shrink-0 ${isMobileView ? 'w-full' : ''}`}>
                <a
                  href={`mailto:${data.user.email}?subject=Tawaran Peluang Karier untuk ${encodeURIComponent(data.user.name)}`}
                  className={`inline-flex items-center justify-center gap-2 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-xs shadow-md transition-all cursor-pointer ${
                    isMobileView ? 'w-full py-3 px-4' : 'px-6 py-3.5 sm:text-sm hover:shadow-lg'
                  }`}
                >
                  <Mail className='w-4 h-4 text-blue-600' />
                  <span>Kirim Email Langsung</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. Minimalist Footer */}
      <footer className='w-full py-8 text-center border-t border-slate-200/60 dark:border-slate-800 text-xs text-slate-400 print:hidden'>
        <div className='max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3'>
          <span>© 2026 {data.user.name}. Verified by Growvia AI Engine.</span>
          <Link
            href='/'
            className='inline-flex items-center gap-1.5 font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors'
          >
            <Sparkles className='w-3.5 h-3.5 text-blue-600' />
            <span>Buat Portofolio Terverifikasi Kamu</span>
          </Link>
        </div>
      </footer>
    </div>
  )
}
