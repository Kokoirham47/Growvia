'use client'

import React from 'react'

import Image from 'next/image'

import {
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Mail,
  MapPin,
  Award,
  Briefcase,
  Copy,
  Check
} from 'lucide-react'

import type { PublicPortfolioData, PortfolioTheme } from '@/types/portfolio'

interface PublicPortfolioHeroProps {
  data: PublicPortfolioData
  theme?: PortfolioTheme
  isMobileView?: boolean
}

export default function PublicPortfolioHero({
  data,
  theme = 'royal-blue',
  isMobileView = false
}: PublicPortfolioHeroProps) {
  const { user, profile, careerTarget, skills, experiences } = data
  const [copiedEmail, setCopiedEmail] = React.useState<boolean>(false)

  const getThemeAccent = () => {
    switch (theme) {
      case 'emerald-modern':
        return {
          ring: 'ring-emerald-500/20',
          gradient: 'from-emerald-600 to-teal-700',
          coverBanner: 'from-emerald-600/15 via-teal-600/10 to-slate-100/50 dark:from-emerald-950/40 dark:via-teal-950/20 dark:to-slate-900',
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
          textAccent: 'text-emerald-700 dark:text-emerald-300',
          buttonPrimary: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs',
          progressBar: 'bg-emerald-600',
          metricBorder: 'hover:border-emerald-300 dark:hover:border-emerald-700'
        }
      case 'sleek-slate':
        return {
          ring: 'ring-slate-500/20',
          gradient: 'from-slate-800 to-zinc-900',
          coverBanner: 'from-slate-800/15 via-zinc-800/10 to-slate-100/50 dark:from-slate-800/40 dark:via-zinc-900/30 dark:to-slate-950',
          badge: 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700',
          textAccent: 'text-slate-900 dark:text-white',
          buttonPrimary: 'bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 shadow-xs',
          progressBar: 'bg-slate-800 dark:bg-slate-200',
          metricBorder: 'hover:border-slate-400 dark:hover:border-slate-600'
        }
      case 'royal-blue':
      default:
        return {
          ring: 'ring-blue-500/20',
          gradient: 'from-blue-600 to-indigo-700',
          coverBanner: 'from-blue-600/15 via-indigo-600/10 to-slate-100/50 dark:from-blue-950/40 dark:via-indigo-950/20 dark:to-slate-900',
          badge: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800',
          textAccent: 'text-blue-600 dark:text-blue-400',
          buttonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs',
          progressBar: 'bg-blue-600',
          metricBorder: 'hover:border-blue-300 dark:hover:border-blue-700'
        }
    }
  }

  const themeStyle = getThemeAccent()

  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault()

    if (user.email) {
      navigator.clipboard.writeText(user.email)
      setCopiedEmail(true)
      setTimeout(() => setCopiedEmail(false), 2000)
    }
  }

  return (
    <section className={`w-full border-b border-slate-200/80 dark:border-slate-800 transition-colors ${isMobileView ? 'pt-2 pb-5' : 'pt-4 sm:pt-6 pb-8'}`}>
      <div className={`flex flex-col gap-5 ${isMobileView ? 'w-full px-3' : 'max-w-5xl mx-auto px-4 sm:px-6'}`}>
        {/* Main Card Container */}
        <div className='relative w-full rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden transition-all'>
          {/* Cover Banner */}
          <div
            className={`w-full bg-gradient-to-r ${themeStyle.coverBanner} border-b border-slate-200/60 dark:border-slate-800 relative ${
              isMobileView ? 'h-24' : 'h-32 sm:h-40'
            }`}
          >
            {/* Subtle Grid Accent */}
            <div className='absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px] opacity-25 dark:opacity-15' />

            {/* Availability Pill on Top Right */}
            <div className={`absolute ${isMobileView ? 'top-3 right-3' : 'top-4 right-4 sm:top-5 sm:right-6'}`}>
              <div className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700 shadow-2xs'>
                <span className='relative flex h-2 w-2'>
                  <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75'></span>
                  <span className='relative inline-flex rounded-full h-2 w-2 bg-emerald-500'></span>
                </span>
                <span>Terbuka untuk Peluang</span>
              </div>
            </div>
          </div>

          {/* Profile Identity Area */}
          <div className={`${isMobileView ? 'px-4 pb-5 pt-0 gap-4' : 'px-6 sm:px-8 pb-8 pt-0 gap-6'} flex flex-col`}>
            {/* Avatar & Header Alignment */}
            <div
              className={`flex justify-between gap-3 ${
                isMobileView
                  ? 'flex-col items-start -mt-10'
                  : 'flex-col sm:flex-row items-start sm:items-end -mt-16 sm:-mt-20'
              }`}
            >
              {/* Avatar Photo */}
              <div className='relative shrink-0'>
                {user.avatarUrl ? (
                  <div
                    className={`relative rounded-3xl overflow-hidden ring-4 ring-white dark:ring-slate-900 shadow-lg bg-white dark:bg-slate-800 ${
                      isMobileView ? 'w-20 h-20' : 'w-28 h-28 sm:w-36 sm:h-36'
                    }`}
                  >
                    <Image
                      src={user.avatarUrl}
                      alt={user.name}
                      fill
                      unoptimized
                      className='object-cover'
                      sizes='(max-width: 640px) 112px, 144px'
                      priority
                    />
                  </div>
                ) : (
                  <div
                    className={`rounded-3xl bg-gradient-to-tr ${themeStyle.gradient} text-white flex items-center justify-center font-extrabold ring-4 ring-white dark:ring-slate-900 shadow-lg ${
                      isMobileView ? 'w-20 h-20 text-2xl' : 'w-28 h-28 sm:w-36 sm:h-36 text-3xl sm:text-4xl'
                    }`}
                  >
                    {initials}
                  </div>
                )}

                {/* Verified Check Badge */}
                <div
                  title='Kandidat Terverifikasi Growvia AI'
                  className={`absolute -bottom-0.5 -right-0.5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md border-2 border-white dark:border-slate-900 ${
                    isMobileView ? 'w-6 h-6' : 'w-8 h-8'
                  }`}
                >
                  <CheckCircle2 className={`${isMobileView ? 'w-3 h-3' : 'w-4 h-4'} stroke-[3]`} />
                </div>
              </div>

              {/* Verified Pill on Desktop / Non-mobile */}
              {!isMobileView && (
                <div className='flex items-center gap-2 self-start sm:self-auto sm:mb-2'>
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${themeStyle.badge}`}
                  >
                    <ShieldCheck className='w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400' />
                    <span>Verified Talent by Growvia AI</span>
                  </div>
                </div>
              )}
            </div>

            {/* Name, Headline, and Institutional Metadata */}
            <div className='flex flex-col gap-1.5'>
              <h1
                className={`font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight ${
                  isMobileView ? 'text-xl' : 'text-2xl sm:text-4xl'
                }`}
              >
                {user.name}
              </h1>

              {profile.headline && (
                <p className={`font-bold leading-snug ${isMobileView ? 'text-xs' : 'text-base sm:text-xl'} ${themeStyle.textAccent}`}>
                  {profile.headline}
                </p>
              )}

              {/* Metadata Badges Row */}
              <div className='flex flex-wrap items-center gap-y-1 gap-x-2.5 text-xs text-slate-600 dark:text-slate-400 font-medium pt-0.5'>
                {(profile.institution || profile.major) && (
                  <div className='flex items-center gap-1.5'>
                    <GraduationCap className='w-3.5 h-3.5 text-slate-400 shrink-0' />
                    <span>
                      {profile.institution}
                      {profile.major ? ` · ${profile.major}` : ''}
                    </span>
                  </div>
                )}

                {profile.graduationYear && (
                  <span className='px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold'>
                    Lulus {profile.graduationYear}
                  </span>
                )}

                <div className='flex items-center gap-1 text-slate-500 dark:text-slate-400'>
                  <MapPin className='w-3 h-3 text-slate-400' />
                  <span>Indonesia</span>
                </div>
              </div>
            </div>

            {/* Bio Narrative */}
            {profile.bio && (
              <p className={`text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line ${isMobileView ? 'text-xs' : 'text-xs sm:text-sm max-w-3xl'}`}>
                {profile.bio}
              </p>
            )}

            {/* Recruiter Action Strip */}
            <div className={`pt-1 flex gap-2.5 ${isMobileView ? 'flex-col w-full' : 'flex-wrap items-center'}`}>
              {user.email && (
                <a
                  href={`mailto:${user.email}?subject=Tawaran Peluang Kerja untuk ${encodeURIComponent(user.name)}`}
                  className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    isMobileView ? 'w-full' : 'sm:text-sm'
                  } ${themeStyle.buttonPrimary}`}
                >
                  <Mail className='w-4 h-4' />
                  <span>Hubungi via Email</span>
                </a>
              )}

              {user.email && (
                <button
                  type='button'
                  onClick={handleCopyEmail}
                  className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl font-semibold text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 transition-all cursor-pointer ${
                    isMobileView ? 'w-full' : 'sm:text-sm'
                  }`}
                >
                  {copiedEmail ? (
                    <>
                      <Check className='w-3.5 h-3.5 text-emerald-600' />
                      <span className='text-emerald-700 dark:text-emerald-300'>Email Disalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className='w-3.5 h-3.5 text-slate-500' />
                      <span>Salin Email</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 3-Second Recruiter Snapshot (Bento Grid) - 2 cols on mobile (Card 1 spans 2 cols), 3 cols on desktop */}
        <div className={isMobileView ? 'grid grid-cols-2 gap-2.5 w-full' : 'grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4'}>
          {/* Card 1: Target Karier & Readiness */}
          <div
            className={`p-3.5 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs transition-all flex flex-col justify-between gap-3 ${
              isMobileView ? 'col-span-2' : 'col-span-2 sm:col-span-1'
            } ${themeStyle.metricBorder}`}
          >
            <div className='flex items-center justify-between'>
              <span className='text-xs font-semibold text-slate-500 dark:text-slate-400'>
                Target Karier Incaran
              </span>
              <div className='w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0'>
                <TrendingUp className='w-3.5 h-3.5 sm:w-4 sm:h-4' />
              </div>
            </div>

            <div className='flex flex-col gap-1.5'>
              <h4 className='text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-tight'>
                {careerTarget?.roleName || 'Software Engineer'}
              </h4>

              {careerTarget ? (
                <div className='flex flex-col gap-1 mt-0.5'>
                  <div className='flex items-center justify-between text-xs'>
                    <span className='font-medium text-slate-500 dark:text-slate-400'>
                      Kesiapan Profil
                    </span>
                    <span className='font-bold text-slate-900 dark:text-white'>
                      {careerTarget.readinessScore}%
                    </span>
                  </div>
                  <div className='w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden'>
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${themeStyle.progressBar}`}
                      style={{ width: `${Math.min(100, Math.max(5, careerTarget.readinessScore))}%` }}
                    />
                  </div>
                </div>
              ) : (
                <span className='text-xs text-slate-400'>Profil Karier Terbuka</span>
              )}
            </div>
          </div>

          {/* Card 2: Keahlian Tervalidasi */}
          <div
            className={`p-3 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs transition-all flex flex-col justify-between gap-2.5 col-span-1 ${themeStyle.metricBorder}`}
          >
            <div className='flex items-center justify-between'>
              <span className='text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 truncate'>
                Keahlian
              </span>
              <div className='w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0'>
                <Award className='w-3.5 h-3.5 sm:w-4 sm:h-4' />
              </div>
            </div>

            <div className='flex flex-col'>
              <div className='flex items-baseline gap-1.5'>
                <span className='text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white'>
                  {skills.length}
                </span>
                <span className='text-xs font-semibold text-slate-500 dark:text-slate-400'>
                  Skill
                </span>
              </div>
              <p className='text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-tight line-clamp-2'>
                Bukti konkret portofolio
              </p>
            </div>
          </div>

          {/* Card 3: Rekam Jejak Pengalaman */}
          <div
            className={`p-3 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs transition-all flex flex-col justify-between gap-2.5 col-span-1 ${themeStyle.metricBorder}`}
          >
            <div className='flex items-center justify-between'>
              <span className='text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 truncate'>
                Pengalaman
              </span>
              <div className='w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0'>
                <Briefcase className='w-3.5 h-3.5 sm:w-4 sm:h-4' />
              </div>
            </div>

            <div className='flex flex-col'>
              <div className='flex items-baseline gap-1.5'>
                <span className='text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white'>
                  {experiences.length}
                </span>
                <span className='text-xs font-semibold text-slate-500 dark:text-slate-400'>
                  Jejak
                </span>
              </div>
              <p className='text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-tight line-clamp-2'>
                Magang, proyek, & organisasi
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
