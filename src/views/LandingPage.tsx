'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Sun,
  Moon,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Star,
  FileText,
  PieChart,
  Briefcase,
  Layers,
  ChevronRight,
  Menu,
  X,
  Target,
  Zap,
  Shield,
  TrendingUp,
  Cpu
} from 'lucide-react'
import { useSettings } from '@core/hooks/useSettings'
import type { SystemMode } from '@core/types'

interface LandingPageProps {
  mode?: SystemMode
}

export default function LandingPage({ mode: _mode }: LandingPageProps) {
  const { settings, updateSettings } = useSettings()

  // Track system preference for dark mode
  const [systemIsDark, setSystemIsDark] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeGraphNode, setActiveGraphNode] = useState<string>('core')
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      setSystemIsDark(mediaQuery.matches)

      const handler = (e: MediaQueryListEvent) => setSystemIsDark(e.matches)
      mediaQuery.addEventListener('change', handler)

      // Interactive scroll handler for dynamic navbar glass & active section
      const handleScroll = () => {
        const scrollY = window.scrollY
        setIsScrolled(scrollY > 20)

        const sections = ['features', 'how-it-works', 'testimonials', 'cta']
        const scrollPosition = scrollY + 160

        for (const sectionId of sections) {
          const el = document.getElementById(sectionId)
          if (el) {
            const top = el.offsetTop
            const height = el.offsetHeight
            if (scrollPosition >= top && scrollPosition < top + height) {
              setActiveSection(sectionId)
              break
            }
          }
        }
        if (scrollY < 200) {
          setActiveSection('')
        }
      }

      handleScroll()
      window.addEventListener('scroll', handleScroll, { passive: true })

      return () => {
        mediaQuery.removeEventListener('change', handler)
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  // Active theme calculation matching Login page
  const isDark = settings.mode === 'dark' || (settings.mode === 'system' && systemIsDark)

  const handleToggleTheme = () => {
    const nextMode = isDark ? 'light' : 'dark'
    updateSettings({ mode: nextMode })
  }

  // Smooth scroll helper
  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div
      className={`min-h-screen font-poppins selection:bg-purple-600 selection:text-white transition-colors duration-300 relative overflow-x-hidden ${
        isDark ? 'bg-[#07090E] text-[#F8FAFC]' : 'bg-[#FAFAFC] text-[#0F172A]'
      }`}
    >
      {/* =========================================================================
          BACKGROUND AMBIENT GLOW ORBS & TECH GRID (Z-0)
      ========================================================================= */}
      <div className='absolute inset-0 pointer-events-none overflow-hidden z-0' aria-hidden='true'>
        {/* 1. Tech Dot Grid Pattern */}
        <div
          className='absolute inset-0 transition-opacity duration-500'
          style={{
            backgroundImage: isDark
              ? 'radial-gradient(circle, rgba(168, 85, 247, 0.3) 1.5px, transparent 1.5px)'
              : 'radial-gradient(circle, rgba(124, 58, 237, 0.18) 1.5px, transparent 1.5px)',
            backgroundSize: '32px 32px'
          }}
        />

        {/* 2. Top-Left Hero Glow Orb */}
        <div
          className='absolute -top-24 -left-28 w-[620px] h-[620px] rounded-full pointer-events-none transition-all duration-700'
          style={{
            filter: 'blur(110px)',
            WebkitFilter: 'blur(110px)',
            background: isDark
              ? 'radial-gradient(circle, rgba(126, 34, 206, 0.5) 0%, rgba(79, 70, 229, 0.35) 45%, transparent 75%)'
              : 'radial-gradient(circle, rgba(192, 132, 252, 0.4) 0%, rgba(165, 180, 252, 0.2) 55%, transparent 75%)'
          }}
        />

        {/* 3. Hero Right Knowledge Graph Glow Orb (Massive Radiant Ambient Glow behind Card) */}
        <div
          className='absolute -top-10 right-[-60px] w-[750px] h-[750px] rounded-full pointer-events-none transition-all duration-700'
          style={{
            filter: 'blur(100px)',
            WebkitFilter: 'blur(100px)',
            background: isDark
              ? 'radial-gradient(circle, rgba(147, 51, 234, 0.6) 0%, rgba(99, 102, 241, 0.45) 40%, rgba(192, 38, 211, 0.25) 65%, transparent 85%)'
              : 'radial-gradient(circle, rgba(168, 85, 247, 0.45) 0%, rgba(129, 140, 248, 0.25) 50%, transparent 80%)'
          }}
        />

        {/* 4. Mid-Page Features Section Glow Orb */}
        <div
          className='absolute top-[36%] left-[-100px] w-[750px] h-[750px] rounded-full pointer-events-none'
          style={{
            filter: 'blur(120px)',
            WebkitFilter: 'blur(120px)',
            background: isDark
              ? 'radial-gradient(circle, rgba(147, 51, 234, 0.4) 0%, rgba(59, 130, 246, 0.2) 55%, transparent 80%)'
              : 'radial-gradient(circle, rgba(192, 132, 252, 0.3) 0%, transparent 70%)'
          }}
        />

        {/* 5. How It Works Section Glow Orb */}
        <div
          className='absolute top-[58%] right-[-100px] w-[700px] h-[700px] rounded-full pointer-events-none'
          style={{
            filter: 'blur(120px)',
            WebkitFilter: 'blur(120px)',
            background: isDark
              ? 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, rgba(168, 85, 247, 0.25) 50%, transparent 80%)'
              : 'radial-gradient(circle, rgba(129, 140, 248, 0.25) 0%, transparent 75%)'
          }}
        />

        {/* 6. Bottom CTA Section Glow Orb */}
        <div
          className='absolute -bottom-20 left-[15%] w-[850px] h-[700px] rounded-full pointer-events-none'
          style={{
            filter: 'blur(130px)',
            WebkitFilter: 'blur(130px)',
            background: isDark
              ? 'radial-gradient(circle, rgba(126, 34, 206, 0.45) 0%, rgba(79, 70, 229, 0.3) 50%, transparent 80%)'
              : 'radial-gradient(circle, rgba(192, 132, 252, 0.32) 0%, transparent 75%)'
          }}
        />

        {/* 7. Floating Sparkling Stars across the canvas */}
        <div className='absolute top-32 left-[12%] text-purple-400 text-lg select-none animate-pulse' style={{ animationDuration: '4s' }}>✦</div>
        <div className='absolute top-56 right-[18%] text-indigo-400 text-sm select-none animate-pulse' style={{ animationDuration: '6s' }}>✦</div>
        <div className='absolute top-[750px] left-[10%] text-purple-400 text-base select-none animate-pulse' style={{ animationDuration: '5s' }}>✦</div>
        <div className='absolute top-[920px] right-[12%] text-fuchsia-400 text-xl select-none animate-pulse' style={{ animationDuration: '7s' }}>✦</div>
        <div className='absolute top-[1500px] left-[16%] text-purple-300 text-sm select-none animate-pulse' style={{ animationDuration: '4.5s' }}>✦</div>
        <div className='absolute top-[2100px] right-[14%] text-indigo-300 text-base select-none animate-pulse' style={{ animationDuration: '6.5s' }}>✦</div>
      </div>

      {/* =========================================================================
          FOREGROUND CONTENT LAYER (Z-10)
      ========================================================================= */}
      <div className='relative z-10 flex flex-col min-h-screen'>

      {/* =========================================================================
          1. NAVBAR (Header)
      ========================================================================= */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-in-out ${
          isScrolled
            ? isDark
              ? 'bg-[#07090E]/90 backdrop-blur-xl border-b border-white/[0.08] shadow-xl shadow-black/30'
              : 'bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-md shadow-slate-900/5'
            : 'bg-transparent backdrop-blur-[2px] border-b border-transparent'
        }`}
      >
        <div
          className={`max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-300 ease-in-out ${
            isScrolled ? 'h-16 sm:h-18' : 'h-20 sm:h-22'
          }`}
        >
          {/* Brand Logo */}
          <Link href='/' className='flex items-center gap-3 group cursor-pointer'>
            <img
              src='/images/growvia-logo.png'
              alt='Growvia'
              className='w-10 h-10 object-contain drop-shadow-md group-hover:scale-105 transition-transform'
            />
            <div className='flex flex-col'>
              <span className={`text-xl font-bold tracking-tight transition-colors ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Growvia
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links (Clean without gray background, matching original design) */}
          <nav className='hidden md:flex items-center gap-8'>
            <button
              onClick={() => scrollToSection('features')}
              className={`text-sm font-medium transition-colors cursor-pointer hover:text-purple-500 ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className={`text-sm font-medium transition-colors cursor-pointer hover:text-purple-500 ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('testimonials')}
              className={`text-sm font-medium transition-colors cursor-pointer hover:text-purple-500 ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              Review
            </button>
            <button
              onClick={() => scrollToSection('cta')}
              className={`text-sm font-medium transition-colors cursor-pointer hover:text-purple-500 ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              Showcase
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className='flex items-center gap-2 sm:gap-3.5'>
            {/* Dark/Light Mode Pill Switch (Matching Login Page) */}
            <button
              type='button'
              onClick={handleToggleTheme}
              aria-label={isDark ? 'Beralih ke Light mode' : 'Beralih ke Dark mode'}
              title={isDark ? 'Mode Gelap (Klik untuk Light Mode)' : 'Mode Terang (Klik untuk Dark Mode)'}
              className={`relative inline-flex h-8 w-[60px] sm:h-9 sm:w-[68px] shrink-0 cursor-pointer items-center rounded-full p-1 border transition-colors duration-300 ease-in-out shadow-xs ${
                isDark ? 'bg-[#111827] border-[#1F2937]' : 'bg-white border-slate-200'
              }`}
            >
              <div className='absolute inset-0 flex items-center justify-between px-1.5 sm:px-2 pointer-events-none'>
                <Sun className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-opacity duration-200 ${isDark ? 'opacity-30 text-slate-400' : 'opacity-80 text-amber-500'}`} />
                <Moon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-opacity duration-200 ${isDark ? 'opacity-80 text-purple-400' : 'opacity-30 text-slate-400'}`} />
              </div>
              <span
                className={`pointer-events-none flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full shadow-md transition-transform duration-300 ease-in-out ${
                  isDark
                    ? 'translate-x-[28px] sm:translate-x-[32px] bg-[#1E293B] text-purple-400 border border-slate-700'
                    : 'translate-x-0 bg-white text-amber-500 border border-slate-100 shadow-xs'
                }`}
              >
                {isDark ? <Moon className='w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current' /> : <Sun className='w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current' />}
              </span>
            </button>

            {/* Login Link Button (Hidden on small mobile screens to prevent overflow, accessible in mobile menu) */}
            <Link
              href='/login'
              className={`hidden sm:inline-flex px-4 sm:px-5 py-2 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer ${
                isDark
                  ? 'text-slate-200 hover:text-white hover:bg-white/10'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Login
            </Link>

            {/* Start / Register CTA Button */}
            <Link
              href='/register'
              className='px-3.5 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm font-semibold rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-600/30 transition-all hover:scale-[1.03] active:scale-[0.98] cursor-pointer flex items-center gap-1 sm:gap-1.5 shrink-0'
            >
              <span>Start</span>
              <ArrowRight className='w-3.5 h-3.5' />
            </Link>

            {/* Mobile Hamburger Toggle Button */}
            <button
              type='button'
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                isDark
                  ? 'text-slate-200 border-white/10 bg-white/[0.04] hover:bg-white/[0.08]'
                  : 'text-slate-700 border-slate-200 bg-white hover:bg-slate-100 shadow-xs'
              }`}
              aria-label='Toggle Navigation Menu'
            >
              {mobileMenuOpen ? <X className='w-5 h-5 text-purple-400' /> : <Menu className='w-5 h-5' />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div
            className={`md:hidden px-4 pt-3 pb-6 border-b flex flex-col gap-3 shadow-2xl transition-all ${
              isDark
                ? 'bg-[#0B0F19]/95 backdrop-blur-2xl border-white/10'
                : 'bg-white/95 backdrop-blur-2xl border-slate-200'
            }`}
          >
            <button
              onClick={() => scrollToSection('features')}
              className={`text-left py-2 font-medium text-sm cursor-pointer transition-colors ${
                activeSection === 'features' ? 'text-purple-400 font-semibold' : isDark ? 'text-slate-300 hover:text-purple-400' : 'text-slate-700 hover:text-purple-600'
              }`}
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className={`text-left py-2 font-medium text-sm cursor-pointer transition-colors ${
                activeSection === 'how-it-works' ? 'text-purple-400 font-semibold' : isDark ? 'text-slate-300 hover:text-purple-400' : 'text-slate-700 hover:text-purple-600'
              }`}
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('testimonials')}
              className={`text-left py-2 font-medium text-sm cursor-pointer transition-colors ${
                activeSection === 'testimonials' ? 'text-purple-400 font-semibold' : isDark ? 'text-slate-300 hover:text-purple-400' : 'text-slate-700 hover:text-purple-600'
              }`}
            >
              Review
            </button>
            <button
              onClick={() => scrollToSection('cta')}
              className={`text-left py-2 font-medium text-sm cursor-pointer transition-colors ${
                activeSection === 'cta' ? 'text-purple-400 font-semibold' : isDark ? 'text-slate-300 hover:text-purple-400' : 'text-slate-700 hover:text-purple-600'
              }`}
            >
              Showcase
            </button>
            <div className={`pt-3 flex gap-3 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
              <Link
                href='/login'
                className='flex-1 py-2.5 text-center text-sm font-semibold rounded-lg border border-slate-700'
              >
                Login
              </Link>
              <Link
                href='/register'
                className='flex-1 py-2.5 text-center text-sm font-semibold rounded-lg bg-purple-600 text-white'
              >
                Start
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* =========================================================================
          2. HERO SECTION
      ========================================================================= */}
      <section className='relative pt-28 pb-20 sm:pt-32 sm:pb-28 lg:pt-36 lg:pb-32 overflow-hidden'>
        <div className='max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center'>
            {/* Left Hero Content (7 Cols) */}
            <div className='lg:col-span-7 flex flex-col items-start'>
              {/* Pill Badge */}
              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide mb-6 border transition-all ${
                  isDark
                    ? 'bg-purple-950/40 border-purple-500/30 text-purple-300 shadow-inner'
                    : 'bg-purple-50 border-purple-200 text-purple-700 shadow-xs'
                }`}
              >
                <Sparkles className='w-3.5 h-3.5 text-purple-400' />
                <span>AI-Powered Career Intelligence</span>
              </div>

              {/* Headline H1 */}
              <h1
                className={`text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Turn Experience <br />
                <span
                  className={`bg-clip-text text-transparent bg-gradient-to-r ${
                    isDark
                      ? 'from-purple-400 via-purple-200 to-indigo-300 drop-shadow-[0_0_24px_rgba(168,85,247,0.35)]'
                      : 'from-purple-700 via-violet-700 to-indigo-700 font-extrabold'
                  }`}
                >
                  Into Opportunity
                </span>
              </h1>

              {/* Subheadline */}
              <p
                className={`text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-xl mb-8 ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                Growvia membantumu menjadikan pengalamanmu menjadi skill yang nyata dan menemukan peluang yang tepat untuk kamu.
              </p>

              {/* CTA Buttons */}
              <div className='flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto'>
                <Link
                  href='/register'
                  className='w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-[length:200%_auto] hover:bg-right transition-all duration-300 shadow-xl shadow-purple-600/30 hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2'
                >
                  <span>Start Now</span>
                  <ArrowUpRight className='w-4 h-4' />
                </Link>

                <button
                  type='button'
                  onClick={() => scrollToSection('features')}
                  className={`w-full sm:w-auto px-7 py-3.5 rounded-full text-sm font-medium border transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                    isDark
                      ? 'border-white/15 bg-white/[0.04] text-slate-200 hover:bg-white/[0.08] hover:border-white/25'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 shadow-xs'
                  }`}
                >
                  <span>Features</span>
                </button>
              </div>

              {/* Social Proof Avatars & Stat */}
              <div className='flex items-center gap-3 pt-2'>
                <div className='flex items-center -space-x-2'>
                  <div className='w-8 h-8 rounded-full ring-2 ring-white dark:ring-[#07090E] bg-gradient-to-tr from-purple-600 to-indigo-600 text-[10px] font-bold text-white flex items-center justify-center shadow-xs'>
                    RZ
                  </div>
                  <div className='w-8 h-8 rounded-full ring-2 ring-white dark:ring-[#07090E] bg-gradient-to-tr from-indigo-600 to-blue-500 text-[10px] font-bold text-white flex items-center justify-center shadow-xs'>
                    AD
                  </div>
                  <div className='w-8 h-8 rounded-full ring-2 ring-white dark:ring-[#07090E] bg-gradient-to-tr from-pink-500 to-purple-600 text-[10px] font-bold text-white flex items-center justify-center shadow-xs'>
                    SP
                  </div>
                  <div className='w-8 h-8 rounded-full ring-2 ring-white dark:ring-[#07090E] bg-gradient-to-tr from-amber-500 to-orange-500 text-[10px] font-bold text-white flex items-center justify-center shadow-xs'>
                    BW
                  </div>
                </div>
                <div className='flex flex-col text-xs'>
                  <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    Sudah dipercaya 1,200+
                  </span>
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                    mahasiswa & fresh graduate Indonesia
                  </span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual (5 Cols - Interactive AI Knowledge Graph Card) */}
            <div className='lg:col-span-5 relative'>
              {/* Backlit Glow Halo Behind Hero Card */}
              <div
                className='absolute -inset-6 sm:-inset-10 rounded-[40px] pointer-events-none z-0 transition-opacity duration-500'
                style={{
                  filter: 'blur(75px)',
                  WebkitFilter: 'blur(75px)',
                  background: isDark
                    ? 'radial-gradient(circle, rgba(168, 85, 247, 0.6) 0%, rgba(99, 102, 241, 0.4) 45%, rgba(217, 70, 239, 0.2) 70%, transparent 100%)'
                    : 'radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, rgba(129, 140, 248, 0.15) 50%, transparent 75%)'
                }}
              />

              {/* Glass Card Container (relative z-10 on top of the glowing halo) */}
              <div
                className={`relative z-10 rounded-[28px] sm:rounded-3xl border p-5 sm:p-7 backdrop-blur-2xl transition-all shadow-xl overflow-hidden ${
                  isDark
                    ? 'bg-[#120D26]/95 border-purple-500/25 shadow-2xl shadow-purple-950/50'
                    : 'bg-white border-[#ECE6F9] shadow-[0_20px_50px_rgba(124,58,237,0.08)]'
                }`}
              >
                {/* Subtle Inner Card Background Glow centered on core orb */}
                <div
                  style={{ left: '50%', top: '42%', transform: 'translate(-50%, -50%)' }}
                  className='absolute w-36 h-36 rounded-full bg-purple-500/15 blur-2xl pointer-events-none'
                />

                {/* GRAPH CANVAS WITH CONNECTING SYNAPSE LINES */}
                <div className='relative w-full h-[310px] sm:h-[330px]'>
                  {/* SVG Connecting Lines - Mathematically aligned bilateral symmetry, non-scaling clean strokes */}
                  <svg className='absolute inset-0 w-full h-full pointer-events-none' viewBox='0 0 100 100' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'>
                    {/* 1. Line to Top: My Skills (50, 42 -> 50, 13) */}
                    <line
                      x1='50'
                      y1='33'
                      x2='50'
                      y2='18'
                      stroke={isDark ? '#A855F7' : '#C4B5FD'}
                      strokeWidth='1.5'
                      strokeDasharray='4 3'
                      strokeOpacity={isDark ? '0.75' : '0.85'}
                      vectorEffect='non-scaling-stroke'
                    />

                    {/* 2. Line to Mid-Left: Frontend Dev (50, 42 -> 19, 36) */}
                    <line
                      x1='43.5'
                      y1='41'
                      x2='31'
                      y2='36'
                      stroke={isDark ? '#A855F7' : '#C4B5FD'}
                      strokeWidth='1.5'
                      strokeDasharray='4 3'
                      strokeOpacity={isDark ? '0.75' : '0.85'}
                      vectorEffect='non-scaling-stroke'
                    />

                    {/* 3. Line to Mid-Right: Data Analysis (50, 42 -> 81, 36) */}
                    <line
                      x1='56.5'
                      y1='41'
                      x2='69'
                      y2='36'
                      stroke={isDark ? '#A855F7' : '#C4B5FD'}
                      strokeWidth='1.5'
                      strokeDasharray='4 3'
                      strokeOpacity={isDark ? '0.75' : '0.85'}
                      vectorEffect='non-scaling-stroke'
                    />

                    {/* 4. Line to Bottom-Left: Project Mgmt (50, 42 -> 23, 67) */}
                    <line
                      x1='45.5'
                      y1='48'
                      x2='33'
                      y2='61'
                      stroke={isDark ? '#A855F7' : '#C4B5FD'}
                      strokeWidth='1.5'
                      strokeDasharray='4 3'
                      strokeOpacity={isDark ? '0.75' : '0.85'}
                      vectorEffect='non-scaling-stroke'
                    />

                    {/* 5. Line to Bottom-Right: Career Match: A (50, 42 -> 77, 67) */}
                    <line
                      x1='54.5'
                      y1='48'
                      x2='67'
                      y2='61'
                      stroke={isDark ? '#A855F7' : '#C4B5FD'}
                      strokeWidth='1.5'
                      strokeDasharray='4 3'
                      strokeOpacity={isDark ? '0.75' : '0.85'}
                      vectorEffect='non-scaling-stroke'
                    />
                  </svg>

                  {/* Central Knowledge Core (Growvia Logo Orb) */}
                  <div
                    onClick={() => setActiveGraphNode('core')}
                    style={{ left: '50%', top: '42%', transform: 'translate(-50%, -50%)' }}
                    className='absolute z-20 flex items-center justify-center cursor-pointer group'
                  >
                    {/* Concentric Soft Radial Glow behind Orb */}
                    <div className='absolute -inset-4 rounded-full bg-purple-500/25 blur-lg pointer-events-none group-hover:bg-purple-500/40 transition-all duration-300' />

                    {/* Core Orb Container */}
                    <div className='relative w-14 h-14 sm:w-16 sm:h-16 rounded-full transition-transform duration-300 group-hover:scale-105 flex items-center justify-center'>
                      <img
                        src='/images/growvia-logo.png'
                        alt='Growvia Core'
                        className='w-full h-full object-contain drop-shadow-[0_8px_20px_rgba(109,40,217,0.35)] select-none'
                      />
                    </div>
                  </div>

                  {/* Node Top: My Skills */}
                  <div
                    onClick={() => setActiveGraphNode('skills')}
                    style={{ left: '50%', top: '13%', transform: 'translate(-50%, -50%)' }}
                    className={`absolute z-10 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer border transition-all duration-200 hover:scale-105 whitespace-nowrap shadow-xs ${
                      activeGraphNode === 'skills'
                        ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/30'
                        : isDark
                        ? 'bg-[#181130] border-purple-500/30 text-purple-200 hover:border-purple-400'
                        : 'bg-white border-purple-200 text-purple-700 hover:border-purple-400'
                    }`}
                  >
                    <Sparkles className='w-3 h-3 text-purple-500' />
                    <span>My Skills</span>
                  </div>

                  {/* Node Mid-Left: Frontend Dev */}
                  <div
                    onClick={() => setActiveGraphNode('frontend')}
                    style={{ left: '19%', top: '36%', transform: 'translate(-50%, -50%)' }}
                    className={`absolute z-10 px-4 py-2 rounded-full border text-xs font-medium cursor-pointer transition-all duration-200 hover:scale-105 whitespace-nowrap shadow-xs ${
                      activeGraphNode === 'frontend'
                        ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/30'
                        : isDark
                        ? 'bg-[#181130] border-purple-500/20 text-slate-200 hover:border-purple-400'
                        : 'bg-white border-slate-200/90 text-slate-700 hover:border-purple-400'
                    }`}
                  >
                    <span>Frontend Dev</span>
                  </div>

                  {/* Node Mid-Right: Data Analysis (Single line balanced pill) */}
                  <div
                    onClick={() => setActiveGraphNode('data')}
                    style={{ left: '81%', top: '36%', transform: 'translate(-50%, -50%)' }}
                    className={`absolute z-10 px-4 py-2 rounded-full border text-xs font-medium cursor-pointer transition-all duration-200 hover:scale-105 whitespace-nowrap shadow-xs ${
                      activeGraphNode === 'data'
                        ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/30'
                        : isDark
                        ? 'bg-[#181130] border-purple-500/20 text-slate-200 hover:border-purple-400'
                        : 'bg-white border-slate-200/90 text-slate-700 hover:border-purple-400'
                    }`}
                  >
                    <span>Data Analysis</span>
                  </div>

                  {/* Node Bottom-Left: Project Mgmt */}
                  <div
                    onClick={() => setActiveGraphNode('project')}
                    style={{ left: '23%', top: '67%', transform: 'translate(-50%, -50%)' }}
                    className={`absolute z-10 px-4 py-2 rounded-full border text-xs font-medium cursor-pointer transition-all duration-200 hover:scale-105 whitespace-nowrap shadow-xs ${
                      activeGraphNode === 'project'
                        ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/30'
                        : isDark
                        ? 'bg-[#181130] border-purple-500/20 text-slate-200 hover:border-purple-400'
                        : 'bg-white border-slate-200/90 text-slate-700 hover:border-purple-400'
                    }`}
                  >
                    <span>Project Mgmt</span>
                  </div>

                  {/* Node Bottom-Right: Career Match: A (Highlighted Accent Border) */}
                  <div
                    onClick={() => setActiveGraphNode('career')}
                    style={{ left: '77%', top: '67%', transform: 'translate(-50%, -50%)' }}
                    className={`absolute z-10 px-4 py-2 rounded-full border text-xs font-semibold cursor-pointer transition-all duration-200 hover:scale-105 whitespace-nowrap shadow-xs ${
                      activeGraphNode === 'career'
                        ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/30'
                        : isDark
                        ? 'bg-[#181130] border-2 border-purple-400 text-purple-200 hover:border-purple-300'
                        : 'bg-white border-2 border-purple-400/90 text-purple-700 hover:border-purple-600'
                    }`}
                  >
                    <span>Career Match: A</span>
                  </div>
                </div>

                {/* Card Bottom Meta Status Row */}
                <div
                  className={`mt-2 pt-4 border-t flex items-center justify-between text-xs ${
                    isDark ? 'border-white/[0.08] text-slate-400' : 'border-slate-100 text-slate-500'
                  }`}
                >
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                      isDark
                        ? 'bg-purple-950/40 text-purple-300 border border-purple-500/30'
                        : 'bg-purple-50 text-purple-700 border border-purple-200/80'
                    }`}
                  >
                    <CheckCircle2 className='w-3.5 h-3.5 text-purple-600 dark:text-purple-400' />
                    <span className='font-semibold'>Confidence: 92%</span>
                  </div>
                  <div className='text-[11px] opacity-75 font-normal'>
                    <span>AI Engine: Gemini & Groq</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. LOGO CLOUD / TRUSTED BY
      ========================================================================= */}
      <section
        className={`py-12 border-y transition-colors ${
          isDark
            ? 'bg-[#0A0E18]/60 border-white/[0.06]'
            : 'bg-white border-slate-200/60'
        }`}
      >
        <div className='max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <p
            className={`text-xs font-semibold uppercase tracking-widest mb-8 ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            DIPERCAYA OLEH TALENTA DARI BERBAGAI INSTITUSI TERKEMUKA
          </p>

          <div className='flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-16 opacity-75 grayscale hover:grayscale-0 transition-all'>
            <div className='flex items-center gap-2 text-sm sm:text-base font-semibold tracking-wide'>
              <span className='text-purple-500 text-lg'>▲</span>
              <span>TechNusantara</span>
            </div>
            <div className='flex items-center gap-2 text-sm sm:text-base font-semibold tracking-wide'>
              <span className='text-indigo-500 text-lg'>⫷</span>
              <span>EduFutura Lab</span>
            </div>
            <div className='flex items-center gap-2 text-sm sm:text-base font-semibold tracking-wide'>
              <span className='text-purple-400 text-lg'>✦</span>
              <span>TalentaDigital ID</span>
            </div>
            <div className='flex items-center gap-2 text-sm sm:text-base font-semibold tracking-wide'>
              <span className='text-amber-500 text-lg'>🗲</span>
              <span>InnovateHub</span>
            </div>
            <div className='flex items-center gap-2 text-sm sm:text-base font-semibold tracking-wide'>
              <span className='text-blue-500 text-lg'>❖</span>
              <span>CareerVenture</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. FEATURES SECTION (Fitur Cerdas untuk Lompatan Kariermu)
      ========================================================================= */}
      <section id='features' className='py-20 sm:py-28 relative overflow-hidden'>
        {/* Glow Orb behind Feature Cards */}
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full bg-purple-600/15 blur-[160px] pointer-events-none -z-10' />

        <div className='max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8'>
          {/* Section Header */}
          <div className='text-center max-w-3xl mx-auto mb-16 sm:mb-20'>
            <div
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide mb-4 border ${
                isDark
                  ? 'bg-purple-950/40 border-purple-500/30 text-purple-300'
                  : 'bg-purple-50 border-purple-200 text-purple-700'
              }`}
            >
              <span>Keunggulan Fitur</span>
            </div>
            <h2
              className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Fitur Cerdas untuk Lompatan Kariermu
            </h2>
            <p
              className={`text-base sm:text-lg leading-relaxed ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              Growvia menggunakan AI untuk mengekstraksi pengalaman nyatamu menjadi portofolio skill komprehensif yang siap diuji oleh recruiter kelas dunia.
            </p>
          </div>

          {/* 3 Feature Cards Grid */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8'>
            {/* Card 1: AI Experience Extractor */}
            <div
              className={`group rounded-3xl p-8 border transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between ${
                isDark
                  ? 'bg-[#0E1322]/80 border-white/[0.08] hover:border-purple-500/40 hover:shadow-2xl hover:shadow-purple-950/50'
                  : 'bg-white border-slate-200 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/5'
              }`}
            >
              <div>
                <div className='w-14 h-14 rounded-2xl bg-purple-600/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 shadow-xs'>
                  <FileText className='w-6 h-6' />
                </div>
                <h3
                  className={`text-xl font-bold mb-3 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  AI Experience Extractor
                </h3>
                <p
                  className={`text-sm leading-relaxed mb-6 ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  Ubah deskripsi aktivitas harian, kepanitiaan, proyek organisasi, magang, dan sertifikasi menjadi daftar skill tervalidasi secara instan.
                </p>
              </div>

              <Link
                href='/register'
                className='inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 group-hover:translate-x-1 transition-all cursor-pointer'
              >
                <span>Pelajari cara ekstraksi</span>
                <ArrowRight className='w-3.5 h-3.5' />
              </Link>
            </div>

            {/* Card 2: Skill Graph & Gap Analysis */}
            <div
              className={`group rounded-3xl p-8 border transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between ${
                isDark
                  ? 'bg-[#0E1322]/80 border-white/[0.08] hover:border-purple-500/40 hover:shadow-2xl hover:shadow-purple-950/50'
                  : 'bg-white border-slate-200 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/5'
              }`}
            >
              <div>
                <div className='w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-xs'>
                  <PieChart className='w-6 h-6' />
                </div>
                <h3
                  className={`text-xl font-bold mb-3 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  Skill Graph & Gap Analysis
                </h3>
                <p
                  className={`text-sm leading-relaxed mb-6 ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  Visualisasikan peta kompetensimu dalam bentuk grafik profesional dan dapatkan saran jelas mengenai skill yang perlu ditingkatkan selanjutnya.
                </p>
              </div>

              <Link
                href='/register'
                className='inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 group-hover:translate-x-1 transition-all cursor-pointer'
              >
                <span>Lihat contoh skoring</span>
                <ArrowRight className='w-3.5 h-3.5' />
              </Link>
            </div>

            {/* Card 3: Smart Opportunity Matching */}
            <div
              className={`group rounded-3xl p-8 border transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between ${
                isDark
                  ? 'bg-[#0E1322]/80 border-white/[0.08] hover:border-purple-500/40 hover:shadow-2xl hover:shadow-purple-950/50'
                  : 'bg-white border-slate-200 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/5'
              }`}
            >
              <div>
                <div className='w-14 h-14 rounded-2xl bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-violet-600 group-hover:text-white transition-all duration-300 shadow-xs'>
                  <Briefcase className='w-6 h-6' />
                </div>
                <h3
                  className={`text-xl font-bold mb-3 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  Smart Opportunity Matching
                </h3>
                <p
                  className={`text-sm leading-relaxed mb-6 ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  Cocokkan otomatis dengan lowongan magang, kerja penuh waktu, atau proyek lepas yang paling sesuai berdasarkan validasi gabungan skill kamu.
                </p>
              </div>

              <Link
                href='/register'
                className='inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 group-hover:translate-x-1 transition-all cursor-pointer'
              >
                <span>Eksplorasi lowongan mitra</span>
                <ArrowRight className='w-3.5 h-3.5' />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. HOW IT WORKS SECTION (Bagaimana Growvia Bekerja Untuk Masa Depanmu?)
      ========================================================================= */}
      <section id='how-it-works' className='py-20 sm:py-28 relative overflow-hidden'>
        <div className='max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center'>
            {/* Left Steps Column (6 Cols) */}
            <div className='lg:col-span-6'>
              <div
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide mb-4 border ${
                  isDark
                    ? 'bg-purple-950/40 border-purple-500/30 text-purple-300'
                    : 'bg-purple-50 border-purple-200 text-purple-700'
                }`}
              >
                <span>LANGKAH MUDAH</span>
              </div>
              <h2
                className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-5 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Bagaimana Growvia Bekerja Untuk Masa Depanmu?
              </h2>
              <p
                className={`text-base sm:text-lg leading-relaxed mb-10 ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                Tidak perlu bingung menulis CV dari nol. Sistem cerdas kami merangkum perjalananmu menjadi profil bernilai tinggi di mata industri teknologi.
              </p>

              {/* Numbered Steps List */}
              <div className='space-y-6'>
                {/* Step 1 */}
                <div className='flex items-start gap-4'>
                  <div className='w-9 h-9 rounded-full bg-purple-600 text-white font-bold text-sm flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-purple-600/30'>
                    1
                  </div>
                  <div>
                    <h4 className={`text-base font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Unggah Portofolio & Cerita Pengalaman
                    </h4>
                    <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Cukup masukkan aktivitas harian, dokumen laporan, atau ketik langsung dengan bantuan AI.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className='flex items-start gap-4'>
                  <div className='w-9 h-9 rounded-full bg-purple-600 text-white font-bold text-sm flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-purple-600/30'>
                    2
                  </div>
                  <div>
                    <h4 className={`text-base font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Biarkan AI Memetakan Potensimu
                    </h4>
                    <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Algoritme kami menganalisis ratusan indikator kompetensi, tingkat relevansi, dan rekomendasi langkah belajar.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className='flex items-start gap-4'>
                  <div className='w-9 h-9 rounded-full bg-purple-600 text-white font-bold text-sm flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-purple-600/30'>
                    3
                  </div>
                  <div>
                    <h4 className={`text-base font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Dapatkan Peluang Karier Sesuai Sasaran
                    </h4>
                    <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Terima rekomendasi pekerjaan spesifik dengan skor kecocokan di atas 90% secara otomatis.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Interactive Candidate Profile Mockup (6 Cols) */}
            <div className='lg:col-span-6 relative'>
              {/* Backlit Glow Halo Behind Card */}
              <div className='absolute -inset-3 rounded-3xl bg-gradient-to-r from-purple-600/30 via-indigo-600/20 to-purple-600/30 blur-2xl -z-10' />
              <div
                className={`rounded-3xl border p-6 sm:p-8 backdrop-blur-xl shadow-2xl transition-all ${
                  isDark
                    ? 'bg-[#101526]/90 border-white/[0.08] shadow-purple-950/40'
                    : 'bg-white border-slate-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.06)]'
                }`}
              >
                {/* Candidate Header */}
                <div className='flex items-center justify-between pb-6 border-b border-white/[0.08] mb-6'>
                  <div className='flex items-center gap-3.5'>
                    <div className='w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 text-white font-bold text-sm flex items-center justify-center shadow-md shadow-purple-600/30'>
                      AD
                    </div>
                    <div>
                      <h4 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Aditya Pratama
                      </h4>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Frontend Developer & UI Specialist
                      </p>
                    </div>
                  </div>

                  <div className='px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'>
                    Match Score: 94%
                  </div>
                </div>

                {/* Sub Cards Grid */}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6'>
                  <div
                    className={`p-4 rounded-2xl border ${
                      isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-slate-50 border-slate-200/60'
                    }`}
                  >
                    <span className={`text-[11px] font-medium block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Top Extracted Skill
                    </span>
                    <span className={`text-sm font-bold block ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
                      Full-stack React & TypeScript
                    </span>
                  </div>

                  <div
                    className={`p-4 rounded-2xl border ${
                      isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-slate-50 border-slate-200/60'
                    }`}
                  >
                    <span className={`text-[11px] font-medium block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Recommended Pathway
                    </span>
                    <span className={`text-sm font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Associate Frontend Eng. (PT FinTech)
                    </span>
                    <span className='text-[10px] text-emerald-400 font-semibold block mt-0.5'>
                      Estimated Gap: 1 Skill (Next.js)
                    </span>
                  </div>
                </div>

                {/* AI Insight Box with Action */}
                <div
                  className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
                    isDark
                      ? 'bg-purple-950/30 border-purple-500/20'
                      : 'bg-purple-50 border-purple-200/70'
                  }`}
                >
                  <div className='flex items-start gap-2.5'>
                    <Sparkles className='w-4 h-4 text-purple-400 shrink-0 mt-0.5' />
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      "Skill gap kamu berkurang drastis berkat 2 aktivitas riset UI dan migrasi komponen Tailwind."
                    </p>
                  </div>
                  <button
                    type='button'
                    className='shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 shadow-sm transition-all cursor-pointer'
                  >
                    Terapkan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. TESTIMONIALS SECTION (Cerita Sukses Bersama Growvia)
      ========================================================================= */}
      <section id='testimonials' className='py-20 sm:py-28 relative'>
        <div className='max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8'>
          {/* Section Header */}
          <div className='text-center max-w-2xl mx-auto mb-16'>
            <div
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide mb-4 border ${
                isDark
                  ? 'bg-purple-950/40 border-purple-500/30 text-purple-300'
                  : 'bg-purple-50 border-purple-200 text-purple-700'
              }`}
            >
              <span>Ulasan Pengguna</span>
            </div>
            <h2
              className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Cerita Sukses Bersama Growvia
            </h2>
            <p
              className={`text-base leading-relaxed ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              Dengarkan bagaimana kawan-kawan mahasiswa dan fresh graduate menggapai karier impian mereka.
            </p>
          </div>

          {/* 3 Testimonials Grid */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8'>
            {/* Review 1 */}
            <div
              className={`rounded-3xl p-8 border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${
                isDark
                  ? 'bg-[#0E1322]/80 border-white/[0.08] shadow-lg shadow-black/20'
                  : 'bg-white border-slate-200 shadow-xs hover:shadow-md'
              }`}
            >
              <div>
                {/* 5 Stars */}
                <div className='flex items-center gap-1 text-amber-400 mb-5'>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className='w-4 h-4 fill-current' />
                  ))}
                </div>
                <p
                  className={`text-sm leading-relaxed mb-6 italic ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  "Saya awalnya bingung memasukkan pengalaman BEM dan panitia kampus ke CV. Lewat Growvia, semuanya terkonversi jadi skill Product Management yang terukur dan meyakinkan recruiter!"
                </p>
              </div>

              <div className='flex items-center gap-3 pt-4 border-t border-white/[0.06]'>
                <div className='w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 text-white font-bold text-xs flex items-center justify-center'>
                  RA
                </div>
                <div>
                  <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Rizky Ananda
                  </h4>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Assoc. Product Manager
                  </p>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div
              className={`rounded-3xl p-8 border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${
                isDark
                  ? 'bg-[#0E1322]/80 border-white/[0.08] shadow-lg shadow-black/20'
                  : 'bg-white border-slate-200 shadow-xs hover:shadow-md'
              }`}
            >
              <div>
                <div className='flex items-center gap-1 text-amber-400 mb-5'>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className='w-4 h-4 fill-current' />
                  ))}
                </div>
                <p
                  className={`text-sm leading-relaxed mb-6 italic ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  "Fitur Career Gap Matching benar-benar game changer! Dari situ saya tahu persis materi apa yang harus saya pelajari untuk lolos magang di unicorn impian saya."
                </p>
              </div>

              <div className='flex items-center gap-3 pt-4 border-t border-white/[0.06]'>
                <div className='w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white font-bold text-xs flex items-center justify-center'>
                  SP
                </div>
                <div>
                  <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Siti Pramuditha
                  </h4>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Frontend Engineer Intern
                  </p>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div
              className={`rounded-3xl p-8 border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${
                isDark
                  ? 'bg-[#0E1322]/80 border-white/[0.08] shadow-lg shadow-black/20'
                  : 'bg-white border-slate-200 shadow-xs hover:shadow-md'
              }`}
            >
              <div>
                <div className='flex items-center gap-1 text-amber-400 mb-5'>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className='w-4 h-4 fill-current' />
                  ))}
                </div>
                <p
                  className={`text-sm leading-relaxed mb-6 italic ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  "Sebagai fresh graduate non-IT, AI Skill Analysis Growvia membantuku validasi project bootcamperku hingga dapat offer kerja pertama dalam waktu 3 minggu."
                </p>
              </div>

              <div className='flex items-center gap-3 pt-4 border-t border-white/[0.06]'>
                <div className='w-10 h-10 rounded-full bg-gradient-to-tr from-pink-600 to-purple-500 text-white font-bold text-xs flex items-center justify-center'>
                  BW
                </div>
                <div>
                  <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Bagus Wicaksono
                  </h4>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    UI/UX Designer
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. BIG CTA BANNER (Siap Mengubah Pengalamanmu Menjadi Karier Impian?)
      ========================================================================= */}
      <section id='cta' className='py-16 sm:py-24 relative overflow-hidden'>
        <div className='max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='relative rounded-3xl bg-gradient-to-br from-[#4C1D95] via-[#5B21B6] to-[#4338CA] p-8 sm:p-14 lg:p-20 text-center text-white overflow-hidden shadow-2xl shadow-purple-950/60'>
            {/* Background Decorative Circles */}
            <div className='absolute -top-24 -left-24 w-96 h-96 rounded-full bg-purple-400/20 blur-3xl pointer-events-none' />
            <div className='absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-indigo-400/20 blur-3xl pointer-events-none' />

            {/* Glowing Icon Top Badge */}
            <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 shadow-inner'>
              <Sparkles className='w-6 h-6 text-purple-200 animate-pulse' />
            </div>

            {/* CTA Heading */}
            <h2 className='text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight max-w-2xl mx-auto mb-4 leading-tight'>
              Siap Mengubah Pengalamanmu Menjadi Karier Impian?
            </h2>

            {/* CTA Subtitle */}
            <p className='text-base sm:text-lg text-purple-100 max-w-xl mx-auto mb-10 leading-relaxed opacity-90'>
              Daftar sekarang tanpa biaya dan biarkan Growvia mengekstraksi potensi terbesarmu dalam hitungan detik.
            </p>

            {/* Buttons */}
            <div className='flex flex-wrap items-center justify-center gap-4 mb-8'>
              <Link
                href='/register'
                className='px-8 py-3.5 rounded-full text-sm font-bold bg-white text-purple-950 hover:bg-slate-100 shadow-xl shadow-black/20 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer'
              >
                Mulai Gratis Sekarang
              </Link>
              <button
                type='button'
                onClick={() => scrollToSection('how-it-works')}
                className='px-7 py-3.5 rounded-full text-sm font-medium border border-white/25 hover:border-white/50 bg-white/[0.08] hover:bg-white/[0.15] text-white transition-all cursor-pointer'
              >
                Jadwalkan Demo Tim
              </button>
            </div>

            {/* Footnote */}
            <div className='text-xs text-purple-200/80 font-medium tracking-wide'>
              Tanpa kartu kredit • Akses instan • 100% didukung AI
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. FOOTER
      ========================================================================= */}
      <footer
        className={`pt-16 pb-12 border-t transition-colors ${
          isDark
            ? 'bg-[#06080F] border-white/[0.08] text-slate-400'
            : 'bg-white border-slate-200 text-slate-600'
        }`}
      >
        <div className='max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8'>
          {/* Main Footer Links Columns */}
          <div className='grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/[0.06]'>
            {/* Brand Col (5 cols) */}
            <div className='md:col-span-5 flex flex-col items-start'>
              <Link href='/' className='flex items-center gap-2.5 mb-4 group cursor-pointer'>
                <img
                  src='/images/growvia-logo.png'
                  alt='Growvia'
                  className='w-8 h-8 object-contain drop-shadow-sm group-hover:scale-105 transition-transform'
                />
                <span className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Growvia
                </span>
              </Link>
              <p className='text-xs sm:text-sm leading-relaxed max-w-sm mb-6 opacity-80'>
                Platform AI Career Intelligence terdepan di Indonesia. Menjembatani pengalaman kampus ke jenjang profesional.
              </p>
            </div>

            {/* Col 1: Produk (2 cols) */}
            <div className='md:col-span-2'>
              <h5 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                PRODUK
              </h5>
              <ul className='space-y-2.5 text-xs sm:text-sm'>
                <li>
                  <Link href='/register' className='hover:text-purple-400 transition-colors'>
                    Skill Extractor
                  </Link>
                </li>
                <li>
                  <Link href='/register' className='hover:text-purple-400 transition-colors'>
                    Career Graph
                  </Link>
                </li>
                <li>
                  <Link href='/register' className='hover:text-purple-400 transition-colors'>
                    Opportunity Match
                  </Link>
                </li>
                <li>
                  <Link href='/register' className='hover:text-purple-400 transition-colors'>
                    Integrasi Portofolio
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 2: Perusahaan (2 cols) */}
            <div className='md:col-span-2'>
              <h5 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                PERUSAHAAN
              </h5>
              <ul className='space-y-2.5 text-xs sm:text-sm'>
                <li>
                  <button onClick={() => scrollToSection('how-it-works')} className='hover:text-purple-400 transition-colors text-left'>
                    Tentang Kami
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('how-it-works')} className='hover:text-purple-400 transition-colors text-left'>
                    Karier di Growvia
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('testimonials')} className='hover:text-purple-400 transition-colors text-left'>
                    Panduan Komunitas
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('cta')} className='hover:text-purple-400 transition-colors text-left'>
                    Kontak Tim
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Privasi & Syarat (3 cols) */}
            <div className='md:col-span-3'>
              <h5 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                PRIVASI & SYARAT
              </h5>
              <ul className='space-y-2.5 text-xs sm:text-sm'>
                <li>
                  <a href='#' className='hover:text-purple-400 transition-colors'>
                    Kebijakan Privasi
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-purple-400 transition-colors'>
                    Syarat Ketentuan
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-purple-400 transition-colors'>
                    Keamanan Data
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright & Social Links */}
          <div className='pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs opacity-75'>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 rounded-full bg-purple-500' />
              <span>Growvia Platform. © 2026 All Rights Reserved.</span>
            </div>

            <div className='flex items-center gap-6'>
              <a href='https://linkedin.com' target='_blank' rel='noreferrer' className='hover:text-purple-400 transition-colors'>
                LinkedIn
              </a>
              <a href='https://twitter.com' target='_blank' rel='noreferrer' className='hover:text-purple-400 transition-colors'>
                Twitter / X
              </a>
              <a href='https://instagram.com' target='_blank' rel='noreferrer' className='hover:text-purple-400 transition-colors'>
                Instagram
              </a>
              <a href='https://discord.com' target='_blank' rel='noreferrer' className='hover:text-purple-400 transition-colors'>
                Discord Community
              </a>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </div>
  )
}
