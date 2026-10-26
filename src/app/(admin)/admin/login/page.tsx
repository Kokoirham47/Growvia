'use client'

import React, { useState, useEffect } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import {
  ArrowLeft,
  ArrowRight,
  Sun,
  Moon,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  ShieldCheck,
  Lock
} from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()

  // Theme state synced with document & cookie
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const isDarkMode =
        document.documentElement.classList.contains('dark') ||
        document.documentElement.getAttribute('data-theme') === 'dark' ||
        document.documentElement.getAttribute('data-mui-color-scheme') === 'dark'

      setIsDark(isDarkMode)
    }
  }, [])

  const handleToggleTheme = () => {
    const nextDark = !isDark

    setIsDark(nextDark)

    if (typeof document !== 'undefined') {
      const modeStr = nextDark ? 'dark' : 'light'

      if (nextDark) {
        document.documentElement.classList.add('dark')
        document.documentElement.setAttribute('data-theme', 'dark')
        document.documentElement.setAttribute('data-mui-color-scheme', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        document.documentElement.setAttribute('data-theme', 'light')
        document.documentElement.setAttribute('data-mui-color-scheme', 'light')
      }

      document.cookie = `settings={"mode":"${modeStr}"}; path=/; max-age=31536000`
    }
  }

  // Form states
  const [email, setEmail] = useState('admin@growvia.id')
  const [password, setPassword] = useState('AdminGrowvia2026!')
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)

  // Validation & interaction states
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password) {
      setError('Email dan password admin wajib diisi')

      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.message || 'Kredensial admin tidak valid')
        setLoading(false)

        return
      }

      setIsSuccess(true)
      setTimeout(() => {
        router.push('/admin/dashboard')
        router.refresh()
      }, 700)
    } catch (err) {
      console.error('Admin Login Error:', err)
      setError('Terjadi kendala koneksi ke server. Silakan coba lagi.')
      setLoading(false)
    }
  }

  return (
    <div
      className={`min-h-screen font-poppins flex flex-col justify-between selection:bg-[#2563EB] selection:text-white relative overflow-x-hidden transition-colors duration-200 ${
        isDark ? 'bg-[#0B0F19] text-[#F8FAFC]' : 'bg-[#F5F6F8] text-[#1E293B]'
      }`}
    >
      {/* Background ambient lighting */}
      <div
        className={`absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none -z-10 transition-opacity duration-300 ${
          isDark ? 'bg-blue-600/10' : 'bg-blue-200/40'
        }`}
        aria-hidden='true'
      />
      <div
        className={`absolute top-[30%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none -z-10 transition-opacity duration-300 ${
          isDark ? 'bg-purple-600/10' : 'bg-purple-200/30'
        }`}
        aria-hidden='true'
      />

      {/* TOP FLOATING CONTROLS (Kembali & Mode Toggle) */}
      <div className='w-full max-w-[1280px] mx-auto px-4 sm:px-8 pt-6 sm:pt-8 flex items-center justify-between z-20'>
        {/* Tombol Kembali ke Landing Page */}
        <Link
          href='/'
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all shadow-xs border ${
            isDark
              ? 'bg-[#111827]/90 border-[#1F2937] text-slate-300 hover:text-white hover:bg-[#1F2937]'
              : 'bg-white/90 border-slate-200 text-[#475569] hover:text-[#1E293B] hover:bg-white'
          }`}
        >
          <ArrowLeft className='w-4 h-4' />
          <span>Kembali ke Beranda</span>
        </Link>

        {/* Theme Toggle Switch */}
        <button
          type='button'
          onClick={handleToggleTheme}
          aria-label={isDark ? 'Beralih ke Light mode' : 'Beralih ke Dark mode'}
          title={isDark ? 'Mode Gelap (Klik untuk Light Mode)' : 'Mode Terang (Klik untuk Dark Mode)'}
          className={`relative inline-flex h-9 w-[68px] shrink-0 cursor-pointer items-center rounded-full p-1 border transition-colors duration-300 ease-in-out shadow-xs ${
            isDark ? 'bg-[#111827] border-[#1F2937]' : 'bg-white border-slate-200'
          }`}
        >
          <div className='absolute inset-0 flex items-center justify-between px-2 pointer-events-none'>
            <Sun className={`w-3.5 h-3.5 transition-opacity duration-200 ${isDark ? 'opacity-30 text-slate-400' : 'opacity-80 text-amber-500'}`} />
            <Moon className={`w-3.5 h-3.5 transition-opacity duration-200 ${isDark ? 'opacity-80 text-blue-400' : 'opacity-30 text-slate-400'}`} />
          </div>

          <span
            className={`pointer-events-none flex h-7 w-7 items-center justify-center rounded-full shadow-md transition-transform duration-300 ease-in-out ${
              isDark
                ? 'translate-x-[32px] bg-[#1E293B] text-blue-400 border border-slate-700'
                : 'translate-x-0 bg-white text-amber-500 border border-slate-100 shadow-sm'
            }`}
          >
            {isDark ? <Moon className='w-3.5 h-3.5 fill-current' /> : <Sun className='w-3.5 h-3.5 fill-current' />}
          </span>
        </button>
      </div>

      {/* MAIN CONTAINER */}
      <main className='flex-1 flex flex-col items-center justify-center px-4 py-6 sm:py-10'>
        {/* Success Alert Banner if successfully logged in */}
        {isSuccess && (
          <div
            className={`w-full max-w-[480px] mb-5 p-4 border rounded-2xl flex items-center gap-3 animate-fade-in shadow-sm ${
              isDark
                ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}
          >
            <div className='w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0'>
              <Check className='w-4 h-4 stroke-[2.5]' />
            </div>
            <div className='text-xs sm:text-sm'>
              <p className='font-semibold'>Autentikasi Admin Berhasil!</p>
              <p className={isDark ? 'text-emerald-400' : 'text-emerald-700'}>
                Mengarahkan ke Dashboard Admin Growvia...
              </p>
            </div>
          </div>
        )}

        {/* LOGIN CARD (480px wide matching user login) */}
        <section
          className={`w-full max-w-[480px] rounded-[24px] p-6 sm:p-[40px] border transition-all duration-200 ${
            isDark
              ? 'bg-[#111827] border-[#1F2937] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)]'
              : 'bg-white border-[#EDF2F7] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05),0_8px_10px_-6px_rgba(0,0,0,0.03)]'
          }`}
          aria-labelledby='admin-login-heading'
        >
          {/* Card Top: Logo + Badge + Heading + Subtitle */}
          <div className='flex flex-col items-center text-center mb-7'>
            {/* Growvia Brand Logo + Admin Pill */}
            <div className='flex items-center gap-3 mb-4 group'>
              <img
                src='/images/growvia-logo.png'
                alt='Growvia'
                className='w-10 h-10 object-contain drop-shadow-md group-hover:scale-105 transition-transform'
              />
              <div className='flex items-center gap-2'>
                <span
                  className={`text-2xl font-bold tracking-tight transition-colors ${
                    isDark ? 'text-white' : 'text-[#0F2864]'
                  }`}
                >
                  Growvia
                </span>
                <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/25 text-[11px] font-bold tracking-wide uppercase'>
                  <ShieldCheck className='w-3.5 h-3.5 text-blue-600 dark:text-blue-400' />
                  <span>Admin</span>
                </span>
              </div>
            </div>

            {/* H2 Title */}
            <h2
              id='admin-login-heading'
              className={`text-[24px] sm:text-[26px] font-bold tracking-tight leading-tight mb-1.5 ${
                isDark ? 'text-white' : 'text-[#0F2864]'
              }`}
            >
              Masuk ke Admin Portal
            </h2>

            {/* Sub-text */}
            <p className={`text-[13.5px] sm:text-[14px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
              Akses konsol manajemen master data & sistem Growvia.
            </p>
          </div>

          {/* Alert Error */}
          {error && (
            <div className='p-3.5 mb-4 rounded-xl border text-xs font-medium bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300 flex items-center gap-2.5 animate-fadeIn'>
              <AlertCircle className='w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400' />
              <span>{error}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          <form onSubmit={handleSubmit} noValidate className='space-y-4'>
            {/* 1. Alamat Email Admin */}
            <div>
              <label
                htmlFor='admin-email'
                className={`block text-[13px] font-medium mb-1.5 ${
                  isDark ? 'text-slate-200' : 'text-[#334155]'
                }`}
              >
                Alamat Email Admin
              </label>
              <div className='relative'>
                <input
                  id='admin-email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  placeholder='admin@growvia.id'
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value)
                    if (error) setError(null)
                  }}
                  className={`w-full h-[44px] px-3.5 text-[14px] rounded-[12px] transition-all outline-none border ${
                    isDark
                      ? 'bg-[#0B0F19] border-[#1F2937] text-white placeholder:text-slate-500 hover:border-[#374151] focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/20'
                      : 'bg-white border-[#DCE3EF] text-[#1E293B] placeholder:text-[#94A3B8] hover:border-[#CBD5E1] focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/15'
                  }`}
                />
              </div>
            </div>

            {/* 2. Password (with eye toggle) */}
            <div>
              <div className='flex items-center justify-between mb-1.5'>
                <label
                  htmlFor='admin-password'
                  className={`block text-[13px] font-medium ${
                    isDark ? 'text-slate-200' : 'text-[#334155]'
                  }`}
                >
                  Kata Sandi Admin
                </label>
              </div>
              <div className='relative'>
                <input
                  id='admin-password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  autoComplete='current-password'
                  placeholder='Masukkan kata sandi akun admin'
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value)
                    if (error) setError(null)
                  }}
                  className={`w-full h-[44px] pl-3.5 pr-11 text-[14px] rounded-[12px] transition-all outline-none border ${
                    isDark
                      ? 'bg-[#0B0F19] border-[#1F2937] text-white placeholder:text-slate-500 hover:border-[#374151] focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/20'
                      : 'bg-white border-[#DCE3EF] text-[#1E293B] placeholder:text-[#94A3B8] hover:border-[#CBD5E1] focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/15'
                  }`}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(prev => !prev)}
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  aria-pressed={showPassword}
                  className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-transparent border-none cursor-pointer transition-colors ${
                    isDark ? 'text-slate-400 hover:text-slate-200' : 'text-[#64748B] hover:text-[#1E293B]'
                  }`}
                >
                  {showPassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                </button>
              </div>
            </div>

            {/* Checkbox: Ingat Sesi Admin */}
            <div className='pt-0.5'>
              <label className='flex items-center gap-2.5 cursor-pointer select-none group'>
                <div className='relative flex items-center justify-center'>
                  <input
                    id='rememberMe'
                    type='checkbox'
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className='sr-only peer'
                  />
                  <div
                    className={`w-[18px] h-[18px] rounded-[5px] border transition-all flex items-center justify-center ${
                      rememberMe
                        ? 'bg-[#2563EB] border-[#2563EB]'
                        : isDark
                        ? 'border-[#374151] bg-[#0B0F19] group-hover:border-slate-400'
                        : 'border-[#CBD5E1] bg-white group-hover:border-[#94A3B8]'
                    }`}
                  >
                    {rememberMe && <Check className='w-3 h-3 text-white stroke-[3]' />}
                  </div>
                </div>
                <span className={`text-[13px] font-normal ${isDark ? 'text-slate-300' : 'text-[#475569]'}`}>
                  Ingat saya
                </span>
              </label>
            </div>

            {/* Primary Button: Masuk ke Admin Console */}
            <div className='pt-2'>
              <button
                type='submit'
                disabled={loading}
                className='w-full h-[44px] bg-[#2563EB] hover:bg-[#1D4ED8] dark:hover:bg-[#3B82F6] active:bg-[#1E40AF] text-white font-medium text-[14.5px] rounded-[12px] transition-all flex items-center justify-center gap-2 shadow-sm shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-md hover:shadow-blue-500/30'
              >
                {loading ? (
                  <>
                    <svg className='animate-spin h-4 w-4 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                      <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                      <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z' />
                    </svg>
                    <span>Memverifikasi Akses Admin...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Panel Admin</span>
                    <ArrowRight className='w-4 h-4' />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Seed credentials info helper */}
          <div
            className={`mt-6 p-3.5 rounded-xl border text-[11.5px] space-y-1 transition-colors ${
              isDark
                ? 'bg-[#0B0F19]/80 border-[#1F2937] text-slate-400'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <div className='flex items-center gap-1.5 font-semibold text-purple-600 dark:text-purple-400'>
              <Lock className='w-3.5 h-3.5' />
              <span>Kredensial Default Evaluasi / Juri:</span>
            </div>
            <p className='font-mono text-[11px] text-slate-700 dark:text-slate-300'>
              Email: <span className='font-bold text-blue-600 dark:text-blue-400'>admin@growvia.id</span>
            </p>
            <p className='font-mono text-[11px] text-slate-700 dark:text-slate-300'>
              Password: <span className='font-bold text-blue-600 dark:text-blue-400'>AdminGrowvia2026!</span>
            </p>
          </div>
        </section>

        {/* Security / System Badges */}
        <div className='mt-8 flex flex-wrap items-center justify-center gap-3 text-[12px] sm:text-[13px] text-slate-500 dark:text-slate-400'>
          <div className='flex items-center gap-1.5'>
            <ShieldCheck className='w-4 h-4 text-blue-600 dark:text-blue-400' />
            <span>Enkripsi Sesi HTTP-Only 8 Jam</span>
          </div>

          <span className={`hidden sm:inline ${isDark ? 'text-slate-600' : 'text-[#CBD5E1]'}`}>•</span>

          <div className='flex items-center gap-1.5'>
            <Lock className='w-3.5 h-3.5 text-blue-600 dark:text-blue-400' />
            <span>Autentikasi Terisolasi Admin Subsystem</span>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer
        className={`w-full border-t py-4 px-4 sm:px-8 transition-colors duration-200 ${
          isDark
            ? 'bg-[#0B0F19]/80 border-[#1F2937] text-slate-500'
            : 'bg-white/60 border-[#EAEEF4] text-[#94A3B8]'
        }`}
      >
        <div className='max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px]'>
          <p>© 2026 Growvia. Konsol Administrasi & Manajemen Data Master.</p>
          <div className='flex items-center gap-6'>
            <Link href='/' className={`transition-colors ${isDark ? 'hover:text-slate-300' : 'hover:text-[#64748B]'}`}>
              Beranda Utama
            </Link>
            <Link href='/help' className={`transition-colors ${isDark ? 'hover:text-slate-300' : 'hover:text-[#64748B]'}`}>
              Pusat Bantuan
            </Link>
            <Link href='/privacy' className={`transition-colors ${isDark ? 'hover:text-slate-300' : 'hover:text-[#64748B]'}`}>
              Kebijakan Privasi
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
