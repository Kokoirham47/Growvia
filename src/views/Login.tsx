'use client'

import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { SystemMode } from '@core/types'
import { useSettings } from '@core/hooks/useSettings'

interface FormErrors {
  email?: string
  password?: string
  general?: string
}

interface LoginProps {
  mode?: SystemMode
}

export default function Login({ mode: _mode }: LoginProps) {
  const router = useRouter()
  const { settings, updateSettings } = useSettings()

  // Track system preference for dark mode
  const [systemIsDark, setSystemIsDark] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      setSystemIsDark(mediaQuery.matches)

      const handler = (e: MediaQueryListEvent) => setSystemIsDark(e.matches)
      mediaQuery.addEventListener('change', handler)
      return () => mediaQuery.removeEventListener('change', handler)
    }
  }, [])

  // Current active mode (dark or light)
  const isDark =
    settings.mode === 'dark' || (settings.mode === 'system' && systemIsDark)

  // Toggle theme handler
  const handleToggleTheme = () => {
    const nextMode = isDark ? 'light' : 'dark'
    updateSettings({ mode: nextMode })
  }

  // Form states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Validation & interaction states
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
  const [forgotPasswordStatus, setForgotPasswordStatus] = useState<string | null>(null)

  // Mark field as touched on blur
  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    validateField(field)
  }

  // Validate single field
  const validateField = (field: string) => {
    const newErrors = { ...errors }

    if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!email.trim()) {
        newErrors.email = 'Alamat email wajib diisi'
      } else if (!emailRegex.test(email.trim())) {
        newErrors.email = 'Format email tidak valid (contoh: nama@email.com)'
      } else {
        delete newErrors.email
      }
    }

    if (field === 'password') {
      if (!password) {
        newErrors.password = 'Password wajib diisi'
      } else if (password.length < 6) {
        newErrors.password = 'Password minimal 6 karakter'
      } else {
        delete newErrors.password
      }
    }

    setErrors(newErrors)
  }

  // Validate all fields on submit
  const validateAll = (): boolean => {
    const currentErrors: FormErrors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!email.trim()) {
      currentErrors.email = 'Alamat email wajib diisi'
    } else if (!emailRegex.test(email.trim())) {
      currentErrors.email = 'Format email tidak valid (contoh: nama@email.com)'
    }

    if (!password) {
      currentErrors.password = 'Password wajib diisi'
    } else if (password.length < 6) {
      currentErrors.password = 'Password minimal 6 karakter'
    }

    setErrors(currentErrors)
    setTouched({
      email: true,
      password: true
    })

    return Object.keys(currentErrors).length === 0
  }

  // Submit handler (ready for Supabase)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateAll()) {
      return
    }

    setIsLoading(true)
    setErrors(prev => ({ ...prev, general: undefined }))

    try {
      /*
       * =======================================================================
       * PANDUAN INTEGRASI SUPABASE (UNTUK DIGUNAKAN NANTI):
       * =======================================================================
       * 1. Hubungkan Supabase client:
       *    import { supabase } from '@/lib/supabaseClient'
       *
       * 2. Autentikasi Sign In dengan Email & Password:
       *    const { data, error } = await supabase.auth.signInWithPassword({
       *      email: email.trim(),
       *      password: password,
       *    })
       *
       *    if (error) {
       *      throw new Error(error.message)
       *    }
       *
       *    // Jika login berhasil, redirect ke dashboard / home:
       *    router.push('/home')
       * =======================================================================
       */

      // Simulasi proses sign in
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsSuccess(true)

      // Redirect ke dashboard/home
      setTimeout(() => {
        router.push('/home')
      }, 1200)
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Email atau password yang Anda masukkan salah. Silakan coba lagi.'
      setErrors(prev => ({ ...prev, general: errorMessage }))
    } finally {
      setIsLoading(false)
    }
  }

  // Google OAuth handler (ready for Supabase)
  const handleGoogleSignIn = async () => {
    /*
     * =======================================================================
     * PANDUAN GOOGLE SIGN IN SUPABASE:
     * =======================================================================
     * const { data, error } = await supabase.auth.signInWithOAuth({
     *   provider: 'google',
     *   options: {
     *     redirectTo: `${window.location.origin}/auth/callback`
     *   }
     * })
     * =======================================================================
     */
    alert('Integrasi Supabase Google OAuth login siap disambungkan!')
  }

  // Handle forgot password request
  const handleForgotPasswordSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!forgotPasswordEmail.trim()) return

    /*
     * =======================================================================
     * PANDUAN RESET PASSWORD SUPABASE:
     * =======================================================================
     * const { error } = await supabase.auth.resetPasswordForEmail(forgotPasswordEmail, {
     *   redirectTo: `${window.location.origin}/reset-password`,
     * })
     * =======================================================================
     */
    setForgotPasswordStatus('Tautan pemulihan password telah dikirim ke email Anda.')
    setTimeout(() => {
      setShowForgotPasswordModal(false)
      setForgotPasswordStatus(null)
      setForgotPasswordEmail('')
    }, 2500)
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
          isDark ? 'bg-indigo-600/10' : 'bg-indigo-200/30'
        }`}
        aria-hidden='true'
      />

      {/* TOP NAVIGATION BAR */}
      <header
        className={`w-full border-b sticky top-0 z-20 backdrop-blur-md transition-colors duration-200 ${
          isDark ? 'bg-[#111827]/80 border-[#1F2937]' : 'bg-white/80 border-[#EAEEF4]'
        }`}
      >
        <div className='max-w-[1280px] mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between'>
          {/* Brand Logo Left */}
          <Link href='/' className='flex items-center gap-2.5 transition-transform hover:opacity-90'>
            <div className='bg-[#1E3A8A] text-white px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm'>
              <svg width='18' height='18' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M12 2L3 7V17L12 22L21 17V7L12 2Z'
                  stroke='white'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M12 12L12 22'
                  stroke='white'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M12 12L20.5 7.5'
                  stroke='white'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M12 12L3.5 7.5'
                  stroke='white'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
              <span className='font-bold text-[13px] tracking-wide'>Growvia.</span>
            </div>
            <span
              className={`font-bold text-[18px] tracking-tight hidden sm:inline ${
                isDark ? 'text-white' : 'text-[#1E3A8A]'
              }`}
            >
              Growvia
            </span>
          </Link>

          {/* Stepper Breadcrumb / Navigation Center */}
          <nav aria-label='Progress' className='hidden md:flex items-center gap-6 text-[13.5px] font-medium'>
            <span className='text-[#2563EB] dark:text-[#60A5FA] font-semibold border-b-2 border-[#2563EB] dark:border-[#60A5FA] pb-0.5 flex items-center gap-1.5'>
              <span className='w-1.5 h-1.5 rounded-full bg-[#2563EB] dark:bg-[#60A5FA]' />
              Masuk Akun
            </span>
            <Link
              href='/register'
              className={`transition-colors flex items-center gap-1.5 ${
                isDark ? 'text-slate-400 hover:text-slate-200' : 'text-[#94A3B8] hover:text-[#64748B]'
              }`}
            >
              Registrasi Baru
            </Link>
          </nav>

          {/* Right Action: Theme Toggle + Ke Beranda + Avatar */}
          <div className='flex items-center gap-3 sm:gap-4'>
            {/* Theme Toggle Button */}
            <button
              type='button'
              onClick={handleToggleTheme}
              aria-label={isDark ? 'Ganti ke Light Mode' : 'Ganti ke Dark Mode'}
              title={isDark ? 'Ganti ke Light Mode' : 'Ganti ke Dark Mode'}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                isDark
                  ? 'bg-[#1F2937] text-amber-300 hover:bg-[#374151]'
                  : 'bg-[#F1F5F9] text-slate-700 hover:bg-[#E2E8F0]'
              }`}
            >
              {isDark ? (
                // Sun Icon for Dark Mode
                <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                  <circle cx='12' cy='12' r='4' />
                  <path d='M12 2v2' />
                  <path d='M12 20v2' />
                  <path d='m4.93 4.93 1.41 1.41' />
                  <path d='m17.66 17.66 1.41 1.41' />
                  <path d='M2 12h2' />
                  <path d='M20 12h2' />
                  <path d='m6.34 17.66-1.41 1.41' />
                  <path d='m19.07 4.93-1.41 1.41' />
                </svg>
              ) : (
                // Moon Icon for Light Mode
                <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                  <path d='M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z' />
                </svg>
              )}
            </button>

            {/* Link Ke Beranda */}
            <Link
              href='/home'
              className={`text-[13.5px] font-medium transition-colors flex items-center gap-1.5 ${
                isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-[#64748B] hover:text-[#1E3A8A]'
              }`}
            >
              <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                <path d='M19 12H5' />
                <path d='M12 19l-7-7 7-7' />
              </svg>
              <span className='hidden sm:inline'>Ke Beranda</span>
            </Link>

            {/* Avatar Circle */}
            <div
              className={`w-8 h-8 rounded-full text-white flex items-center justify-center shadow-sm cursor-pointer transition-colors ${
                isDark ? 'bg-[#2563EB] hover:bg-[#3B82F6]' : 'bg-[#1E3A8A] hover:bg-[#1E293B]'
              }`}
              title='Akun'
            >
              <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' />
                <circle cx='12' cy='7' r='4' />
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className='flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12'>
        {/* Success Alert Banner if successfully logged in */}
        {isSuccess && (
          <div
            className={`w-full max-w-[480px] mb-5 p-4 border rounded-2xl flex items-center gap-3 animate-fade-in shadow-sm ${
              isDark
                ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}
          >
            <div className='w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0'>
              <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
                <polyline points='20 6 9 17 4 12' />
              </svg>
            </div>
            <div className='text-xs sm:text-sm'>
              <p className='font-semibold'>Berhasil Masuk!</p>
              <p className={isDark ? 'text-emerald-400' : 'text-emerald-700'}>
                Selamat datang kembali. Mengalihkan ke halaman dashboard...
              </p>
            </div>
          </div>
        )}

        {/* General Error Banner */}
        {errors.general && (
          <div
            className={`w-full max-w-[480px] mb-5 p-4 border rounded-2xl flex items-center gap-3 shadow-sm ${
              isDark
                ? 'bg-red-950/40 border-red-800 text-red-300'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className='w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center flex-shrink-0'>
              <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                <circle cx='12' cy='12' r='10' />
                <line x1='12' y1='8' x2='12' y2='12' />
                <line x1='12' y1='16' x2='12.01' y2='16' />
              </svg>
            </div>
            <p className='text-xs sm:text-sm font-medium'>{errors.general}</p>
          </div>
        )}

        {/* LOGIN CARD (480px wide, p-40px, rounded-20px) */}
        <section
          className={`w-full max-w-[480px] rounded-[20px] p-6 sm:p-[40px] border transition-all duration-200 ${
            isDark
              ? 'bg-[#111827] border-[#1F2937] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)]'
              : 'bg-white border-[#EDF2F7] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05),0_8px_10px_-6px_rgba(0,0,0,0.03)]'
          }`}
          aria-labelledby='login-heading'
        >
          {/* Card Top: Logo + Badge + Heading + Subtitle */}
          <div className='flex flex-col items-center text-center mb-7'>
            {/* Growvia Badge Logo */}
            <div className='inline-flex items-center gap-1.5 bg-[#1E3A8A] text-white px-3 py-1.5 rounded-xl shadow-sm mb-3.5 hover:scale-105 transition-transform'>
              <svg width='18' height='18' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M12 2L3 7V17L12 22L21 17V7L12 2Z'
                  stroke='white'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M12 12L12 22'
                  stroke='white'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M12 12L20.5 7.5'
                  stroke='white'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M12 12L3.5 7.5'
                  stroke='white'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
              <span className='font-bold text-[13.5px] tracking-wide'>Growvia.</span>
            </div>

            {/* Pill: Akses Karier AI */}
            <div
              className={`inline-flex items-center gap-1.5 border px-3 py-1 rounded-full text-[12px] font-medium mb-3 transition-colors ${
                isDark
                  ? 'bg-blue-950/40 border-blue-800/60 text-blue-300'
                  : 'bg-[#EFF6FF] border-[#DBEAFE] text-[#2563EB]'
              }`}
            >
              <svg width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                <path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' />
                <polyline points='9 12 11 14 15 10' />
              </svg>
              <span>Platform Karier Berbasis AI</span>
            </div>

            {/* H2 Title */}
            <h2
              id='login-heading'
              className={`text-[24px] sm:text-[26px] font-bold tracking-tight leading-tight mb-1.5 ${
                isDark ? 'text-white' : 'text-[#1E3A8A]'
              }`}
            >
              Masuk ke Akun
            </h2>

            {/* Sub-text */}
            <p className={`text-[13.5px] sm:text-[14px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
              Selamat datang kembali! Lanjutkan perjalanan kariermu.
            </p>
          </div>

          {/* LOGIN FORM */}
          <form onSubmit={handleSubmit} noValidate className='space-y-4'>
            {/* 1. Alamat Email */}
            <div>
              <label
                htmlFor='email'
                className={`block text-[13px] font-medium mb-1.5 ${
                  isDark ? 'text-slate-200' : 'text-[#334155]'
                }`}
              >
                Alamat Email
              </label>
              <div className='relative'>
                <input
                  id='email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  placeholder='nama@email.com'
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value)
                    if (touched.email) validateField('email')
                  }}
                  onBlur={() => handleBlur('email')}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className={`w-full h-[44px] px-3.5 text-[14px] rounded-[12px] transition-all outline-none border ${
                    errors.email && touched.email
                      ? 'border-[#DC2626] ring-4 ring-[#DC2626]/10 dark:border-[#EF4444] dark:ring-[#EF4444]/20'
                      : isDark
                      ? 'bg-[#0B0F19] border-[#1F2937] text-white placeholder:text-slate-500 hover:border-[#374151] focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/20'
                      : 'bg-white border-[#DCE3EF] text-[#1E293B] placeholder:text-[#94A3B8] hover:border-[#CBD5E1] focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/15'
                  }`}
                />
              </div>
              {errors.email && touched.email && (
                <p id='email-error' className='text-[12px] text-[#DC2626] dark:text-[#EF4444] mt-1.5 flex items-center gap-1 font-normal'>
                  <svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                    <circle cx='12' cy='12' r='10' />
                    <line x1='12' y1='8' x2='12' y2='12' />
                    <line x1='12' y1='16' x2='12.01' y2='16' />
                  </svg>
                  {errors.email}
                </p>
              )}
            </div>

            {/* 2. Password (with eye toggle) */}
            <div>
              <div className='flex items-center justify-between mb-1.5'>
                <label
                  htmlFor='password'
                  className={`block text-[13px] font-medium ${
                    isDark ? 'text-slate-200' : 'text-[#334155]'
                  }`}
                >
                  Password
                </label>
                <button
                  type='button'
                  onClick={() => setShowForgotPasswordModal(true)}
                  className='text-[12.5px] text-[#2563EB] dark:text-[#60A5FA] hover:underline transition-colors font-medium'
                >
                  Lupa Password?
                </button>
              </div>
              <div className='relative'>
                <input
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  autoComplete='current-password'
                  placeholder='Masukkan password akun'
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value)
                    if (touched.password) validateField('password')
                  }}
                  onBlur={() => handleBlur('password')}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  className={`w-full h-[44px] pl-3.5 pr-11 text-[14px] rounded-[12px] transition-all outline-none border ${
                    errors.password && touched.password
                      ? 'border-[#DC2626] ring-4 ring-[#DC2626]/10 dark:border-[#EF4444] dark:ring-[#EF4444]/20'
                      : isDark
                      ? 'bg-[#0B0F19] border-[#1F2937] text-white placeholder:text-slate-500 hover:border-[#374151] focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/20'
                      : 'bg-white border-[#DCE3EF] text-[#1E293B] placeholder:text-[#94A3B8] hover:border-[#CBD5E1] focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/15'
                  }`}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(prev => !prev)}
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  aria-pressed={showPassword}
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 p-1 transition-colors ${
                    isDark ? 'text-slate-500 hover:text-slate-300' : 'text-[#94A3B8] hover:text-[#475569]'
                  }`}
                >
                  {showPassword ? (
                    <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                      <path d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24' />
                      <line x1='1' y1='1' x2='23' y2='23' />
                    </svg>
                  ) : (
                    <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                      <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' />
                      <circle cx='12' cy='12' r='3' />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && touched.password && (
                <p id='password-error' className='text-[12px] text-[#DC2626] dark:text-[#EF4444] mt-1.5 flex items-center gap-1 font-normal'>
                  <svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                    <circle cx='12' cy='12' r='10' />
                    <line x1='12' y1='8' x2='12' y2='12' />
                    <line x1='12' y1='16' x2='12.01' y2='16' />
                  </svg>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Checkbox: Ingat Saya */}
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
                    {rememberMe && (
                      <svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='3.5' strokeLinecap='round' strokeLinejoin='round'>
                        <polyline points='20 6 9 17 4 12' />
                      </svg>
                    )}
                  </div>
                </div>
                <span className={`text-[13px] font-normal ${isDark ? 'text-slate-300' : 'text-[#475569]'}`}>
                  Ingat saya di perangkat ini
                </span>
              </label>
            </div>

            {/* Primary Button: Masuk ke Akun */}
            <div className='pt-2'>
              <button
                type='submit'
                disabled={isLoading}
                className='w-full h-[44px] bg-[#2563EB] hover:bg-[#1D4ED8] dark:hover:bg-[#3B82F6] active:bg-[#1E40AF] text-white font-medium text-[14.5px] rounded-[12px] transition-all flex items-center justify-center gap-2 shadow-sm shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-md hover:shadow-blue-500/30'
              >
                {isLoading ? (
                  <>
                    <svg className='animate-spin h-4 w-4 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                      <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                      <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z' />
                    </svg>
                    <span>Memproses Masuk...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Akun</span>
                    <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.2' strokeLinecap='round' strokeLinejoin='round'>
                      <line x1='5' y1='12' x2='19' y2='12' />
                      <polyline points='12 5 19 12 12 19' />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Divider with "ATAU" */}
          <div className='relative my-5'>
            <div className='absolute inset-0 flex items-center'>
              <div className={`w-full border-t ${isDark ? 'border-[#1F2937]' : 'border-[#E2E8F0]'}`} />
            </div>
            <div className='relative flex justify-center text-[12px] uppercase'>
              <span
                className={`px-3 font-medium tracking-wider ${
                  isDark ? 'bg-[#111827] text-slate-500' : 'bg-white text-[#94A3B8]'
                }`}
              >
                ATAU
              </span>
            </div>
          </div>

          {/* Google Button */}
          <button
            type='button'
            onClick={handleGoogleSignIn}
            className={`w-full h-[44px] font-medium text-[14px] rounded-[12px] transition-all flex items-center justify-center gap-2.5 shadow-sm border ${
              isDark
                ? 'bg-[#0B0F19] border-[#1F2937] text-slate-200 hover:bg-[#1F2937] hover:border-[#374151]'
                : 'bg-white border-[#DCE3EF] text-[#334155] hover:bg-[#F8FAFC] hover:border-[#CBD5E1]'
            }`}
          >
            {/* Google G multicolored Logo */}
            <svg width='18' height='18' viewBox='0 0 24 24'>
              <path
                fill='#4285F4'
                d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
              />
              <path
                fill='#34A853'
                d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
              />
              <path
                fill='#FBBC05'
                d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z'
              />
              <path
                fill='#EA4335'
                d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z'
              />
            </svg>
            <span>Masuk dengan Google</span>
          </button>

          {/* New to Growvia? Register link */}
          <div className={`text-center mt-6 text-[13.5px] ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
            <span>Belum punya akun? </span>
            <Link
              href='/register'
              className='text-[#2563EB] dark:text-[#60A5FA] hover:underline font-semibold transition-colors'
            >
              Daftar Sekarang
            </Link>
          </div>
        </section>

        {/* TRUST HIGHLIGHTS BELOW CARD */}
        <div
          className={`mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[12.5px] text-center max-w-[650px] ${
            isDark ? 'text-slate-400' : 'text-[#64748B]'
          }`}
        >
          <div className='flex items-center gap-1.5'>
            <svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='#10B981' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
              <path d='M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83' />
            </svg>
            <span>Pemetaan Skill Berbasis AI</span>
          </div>

          <span className={`hidden sm:inline ${isDark ? 'text-slate-600' : 'text-[#CBD5E1]'}`}>•</span>

          <div className='flex items-center gap-1.5'>
            <svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='#2563EB' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
              <circle cx='12' cy='12' r='10' />
              <circle cx='12' cy='12' r='6' />
              <circle cx='12' cy='12' r='2' />
            </svg>
            <span>Rekomendasi Karier Terarah</span>
          </div>

          <span className={`hidden sm:inline ${isDark ? 'text-slate-600' : 'text-[#CBD5E1]'}`}>•</span>

          <div className='flex items-center gap-1.5'>
            <svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='#2563EB' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
              <rect x='3' y='11' width='18' height='11' rx='2' ry='2' />
              <path d='M7 11V7a5 5 0 0 1 10 0v4' />
            </svg>
            <span>Privasi Data Mahasiswa Terjaga</span>
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
          <p>© 2025 Growvia. Ubah pengalamanmu jadi peluang karier.</p>
          <div className='flex items-center gap-6'>
            <Link href='/help' className={`transition-colors ${isDark ? 'hover:text-slate-300' : 'hover:text-[#64748B]'}`}>
              Bantuan
            </Link>
            <Link href='/privacy' className={`transition-colors ${isDark ? 'hover:text-slate-300' : 'hover:text-[#64748B]'}`}>
              Kebijakan Privasi
            </Link>
            <Link href='/terms' className={`transition-colors ${isDark ? 'hover:text-slate-300' : 'hover:text-[#64748B]'}`}>
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </footer>

      {/* FORGOT PASSWORD MODAL */}
      {showForgotPasswordModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in'>
          <div
            className={`rounded-[20px] max-w-[420px] w-full p-6 sm:p-8 shadow-2xl border relative ${
              isDark ? 'bg-[#111827] border-[#1F2937]' : 'bg-white border-slate-100'
            }`}
          >
            <button
              onClick={() => {
                setShowForgotPasswordModal(false)
                setForgotPasswordStatus(null)
              }}
              className={`absolute top-5 right-5 transition-colors ${
                isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'
              }`}
              aria-label='Tutup'
            >
              <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                <line x1='18' y1='6' x2='6' y2='18' />
                <line x1='6' y1='6' x2='18' y2='18' />
              </svg>
            </button>

            <div className='text-center mb-5'>
              <div
                className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center mb-3 ${
                  isDark ? 'bg-blue-950/60 text-blue-400' : 'bg-blue-50 text-[#2563EB]'
                }`}
              >
                <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                  <rect x='3' y='11' width='18' height='11' rx='2' ry='2' />
                  <path d='M7 11V7a5 5 0 0 1 10 0v4' />
                </svg>
              </div>
              <h3 className={`text-[18px] font-bold ${isDark ? 'text-white' : 'text-[#1E3A8A]'}`}>
                Lupa Password?
              </h3>
              <p className={`text-[13px] mt-1 ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
                Masukkan email Anda untuk menerima instruksi pemulihan kata sandi.
              </p>
            </div>

            {forgotPasswordStatus ? (
              <div
                className={`p-3 border rounded-xl text-xs text-center font-medium ${
                  isDark
                    ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                }`}
              >
                {forgotPasswordStatus}
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className='space-y-4'>
                <div>
                  <label
                    htmlFor='forgotEmail'
                    className={`block text-xs font-medium mb-1 ${
                      isDark ? 'text-slate-200' : 'text-[#334155]'
                    }`}
                  >
                    Alamat Email
                  </label>
                  <input
                    id='forgotEmail'
                    type='email'
                    required
                    placeholder='nama@email.com'
                    value={forgotPasswordEmail}
                    onChange={e => setForgotPasswordEmail(e.target.value)}
                    className={`w-full h-[44px] px-3.5 text-[14px] rounded-[12px] outline-none border transition-all ${
                      isDark
                        ? 'bg-[#0B0F19] border-[#1F2937] text-white placeholder:text-slate-500 focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/20'
                        : 'bg-white border-[#DCE3EF] text-[#1E293B] placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/15'
                    }`}
                  />
                </div>
                <button
                  type='submit'
                  className='w-full h-[44px] bg-[#2563EB] hover:bg-[#1D4ED8] dark:hover:bg-[#3B82F6] text-white font-medium text-[14px] rounded-[12px] transition-all'
                >
                  Kirim Tautan Reset
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
