'use client'

import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
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
  Sparkles,
  Target,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  Mail
} from 'lucide-react'
import { useSettings } from '@core/hooks/useSettings'
import { useAuth } from '@/contexts/AuthContext'

interface FormErrors {
  fullName?: string
  email?: string
  password?: string
  confirmPassword?: string
  terms?: string
}

export default function Register() {
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
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)

  // Visibility toggles
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { register } = useAuth()

  // Validation & status states
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [verificationInfo, setVerificationInfo] = useState<{
    email: string
    verificationUrl?: string
    token?: string
  } | null>(null)

  // Mark field as touched on blur
  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    validateField(field)
  }

  // Validate single field (PRD F01.1: Real-time validation, min 8 chars, 1 uppercase, 1 number)
  const validateField = (field: string) => {
    const newErrors = { ...errors }

    if (field === 'fullName') {
      if (!fullName.trim()) {
        newErrors.fullName = 'Nama lengkap wajib diisi'
      } else if (fullName.trim().length < 2) {
        newErrors.fullName = 'Nama minimal 2 karakter'
      } else {
        delete newErrors.fullName
      }
    }

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
      } else if (password.length < 8) {
        newErrors.password = 'Password minimal 8 karakter'
      } else if (!/[A-Z]/.test(password)) {
        newErrors.password = 'Password harus mengandung minimal 1 huruf besar'
      } else if (!/[0-9]/.test(password)) {
        newErrors.password = 'Password harus mengandung minimal 1 angka'
      } else {
        delete newErrors.password
      }

      // Check confirm password match if it has value
      if (confirmPassword && password !== confirmPassword) {
        newErrors.confirmPassword = 'Konfirmasi password tidak cocok'
      } else if (confirmPassword && password === confirmPassword) {
        delete newErrors.confirmPassword
      }
    }

    if (field === 'confirmPassword') {
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Ketik ulang password untuk konfirmasi'
      } else if (confirmPassword !== password) {
        newErrors.confirmPassword = 'Konfirmasi password tidak cocok'
      } else {
        delete newErrors.confirmPassword
      }
    }

    if (field === 'terms') {
      if (!agreeTerms) {
        newErrors.terms = 'Anda harus menyetujui Syarat & Ketentuan serta Kebijakan Privasi'
      } else {
        delete newErrors.terms
      }
    }

    setErrors(newErrors)
  }

  // Validate all fields on submit
  const validateAll = (): boolean => {
    const currentErrors: FormErrors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!fullName.trim()) {
      currentErrors.fullName = 'Nama lengkap wajib diisi'
    } else if (fullName.trim().length < 2) {
      currentErrors.fullName = 'Nama minimal 2 karakter'
    }

    if (!email.trim()) {
      currentErrors.email = 'Alamat email wajib diisi'
    } else if (!emailRegex.test(email.trim())) {
      currentErrors.email = 'Format email tidak valid (contoh: nama@email.com)'
    }

    if (!password) {
      currentErrors.password = 'Password wajib diisi'
    } else if (password.length < 8) {
      currentErrors.password = 'Password minimal 8 karakter'
    } else if (!/[A-Z]/.test(password)) {
      currentErrors.password = 'Password harus mengandung minimal 1 huruf besar'
    } else if (!/[0-9]/.test(password)) {
      currentErrors.password = 'Password harus mengandung minimal 1 angka'
    }

    if (!confirmPassword) {
      currentErrors.confirmPassword = 'Ketik ulang password untuk konfirmasi'
    } else if (confirmPassword !== password) {
      currentErrors.confirmPassword = 'Konfirmasi password tidak cocok'
    }

    if (!agreeTerms) {
      currentErrors.terms = 'Anda harus menyetujui Syarat & Ketentuan serta Kebijakan Privasi'
    }

    setErrors(currentErrors)
    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
      terms: true
    })

    return Object.keys(currentErrors).length === 0
  }

  // Submit handler calling real register API
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateAll()) {
      return
    }

    setIsLoading(true)

    try {
      const res = await register({
        name: fullName.trim(),
        email: email.trim(),
        password
      })

      if (!res.success) {
        setErrors(prev => ({
          ...prev,
          email: res.error || 'Pendaftaran gagal. Silakan coba kembali.'
        }))
        return
      }

      setIsSuccess(true)
      setVerificationInfo({
        email: email.trim(),
        verificationUrl: res.verificationUrl,
        token: res.token
      })
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Terjadi kesalahan saat pendaftaran'
      setErrors(prev => ({ ...prev, email: errorMessage }))
    } finally {
      setIsLoading(false)
    }
  }

  // Google OAuth handler
  const handleGoogleSignIn = async () => {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      if (!supabaseUrl) {
        alert('Supabase URL belum dikonfigurasi di environment.')
        return
      }
      const callbackUrl = `${window.location.origin}/api/auth/callback`
      window.location.href = `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(callbackUrl)}`
    } catch (e) {
      console.error(e)
    }
  }

  const hasMinLength = password.length >= 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)

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

      {/* TOP FLOATING CONTROLS (Kembali & Mode Toggle) */}
      <div className='w-full max-w-[1280px] mx-auto px-4 sm:px-8 pt-6 sm:pt-8 flex items-center justify-between z-20'>
        {/* Tombol Kembali */}
        <Link
          href='/'
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all shadow-xs border ${
            isDark
              ? 'bg-[#111827]/90 border-[#1F2937] text-slate-300 hover:text-white hover:bg-[#1F2937]'
              : 'bg-white/90 border-slate-200 text-[#475569] hover:text-[#1E293B] hover:bg-white'
          }`}
        >
          <ArrowLeft className='w-4 h-4' />
          <span>Kembali</span>
        </Link>

        {/* Theme Toggle Switch (Sun / Moon Switch) */}
        <button
          type='button'
          onClick={handleToggleTheme}
          aria-label={isDark ? 'Beralih ke Light mode' : 'Beralih ke Dark mode'}
          title={isDark ? 'Mode Gelap (Klik untuk Light Mode)' : 'Mode Terang (Klik untuk Dark Mode)'}
          className={`relative inline-flex h-9 w-[68px] shrink-0 cursor-pointer items-center rounded-full p-1 border transition-colors duration-300 ease-in-out shadow-xs ${
            isDark
              ? 'bg-[#111827] border-[#1F2937]'
              : 'bg-white border-slate-200'
          }`}
        >
          {/* Inner Icons (Sun on Left, Moon on Right) */}
          <div className='absolute inset-0 flex items-center justify-between px-2 pointer-events-none'>
            <Sun className={`w-3.5 h-3.5 transition-opacity duration-200 ${isDark ? 'opacity-30 text-slate-400' : 'opacity-80 text-amber-500'}`} />
            <Moon className={`w-3.5 h-3.5 transition-opacity duration-200 ${isDark ? 'opacity-80 text-blue-400' : 'opacity-30 text-slate-400'}`} />
          </div>

          {/* Sliding Knob with Active Icon */}
          <span
            className={`pointer-events-none flex h-7 w-7 items-center justify-center rounded-full shadow-md transition-transform duration-300 ease-in-out ${
              isDark
                ? 'translate-x-[32px] bg-[#1E293B] text-blue-400 border border-slate-700'
                : 'translate-x-0 bg-white text-amber-500 border border-slate-100 shadow-sm'
            }`}
          >
            {isDark ? <Moon className='w-3.5 h-3.5' /> : <Sun className='w-3.5 h-3.5' />}
          </span>
        </button>
      </div>

      {/* MAIN CONTAINER */}
      <main className='flex-1 flex flex-col items-center justify-center px-4 py-6 sm:py-10'>
        {/* Success Alert Banner if successfully registered */}
        {isSuccess && (
          <div
            className={`w-full max-w-[480px] mb-5 p-4 border rounded-2xl flex items-center gap-3 animate-fade-in shadow-sm ${
              isDark
                ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}
          >
            <div className='w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0'>
              <Check className='w-4 h-4 stroke-[2.5]' />
            </div>
            <div className='text-xs sm:text-sm'>
              <p className='font-semibold'>Pendaftaran Berhasil!</p>
              <p className={isDark ? 'text-emerald-400' : 'text-emerald-700'}>
                Akun Growvia Anda siap digunakan. Mengalihkan ke halaman onboarding...
              </p>
            </div>
          </div>
        )}

        {/* REGISTRATION CARD (480px wide, p-40px, rounded-24px) */}
        <section
          className={`w-full max-w-[480px] rounded-[24px] p-6 sm:p-[40px] border transition-all duration-200 ${
            isDark
              ? 'bg-[#111827] border-[#1F2937] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)]'
              : 'bg-white border-[#EDF2F7] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05),0_8px_10px_-6px_rgba(0,0,0,0.03)]'
          }`}
          aria-labelledby='form-heading'
        >
          {/* Card Top: Logo + Badge + Heading + Subtitle */}
          <div className='flex flex-col items-center text-center mb-7'>
            {/* Growvia Badge Logo */}
            <div className='inline-flex items-center gap-2 bg-[#0F2864] text-white px-3.5 py-2 rounded-xl shadow-xs mb-3 hover:scale-105 transition-transform'>
              <svg width='19' height='19' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
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
              <span className='font-bold text-[14px] tracking-tight'>Growvia.</span>
            </div>

            {/* H2 Title */}
            <h2
              id='form-heading'
              className={`text-[24px] sm:text-[26px] font-bold tracking-tight leading-tight mb-1.5 ${
                isDark ? 'text-white' : 'text-[#0F2864]'
              }`}
            >
              Buat Akun Baru
            </h2>

            {/* Sub-text */}
            <p className={`text-[13.5px] sm:text-[14px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
              Mulai perjalanan kariermu hari ini.
            </p>
          </div>

          {isSuccess && verificationInfo ? (
            <div className='space-y-5 text-center py-2 animate-fadeIn'>
              <div className='w-16 h-16 rounded-2xl mx-auto flex items-center justify-center bg-emerald-500/10 text-emerald-500'>
                <CheckCircle2 className='w-8 h-8' />
              </div>

              <div>
                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-[#0F2864]'}`}>
                  Pendaftaran Berhasil!
                </h3>
                <p className={`text-sm mt-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
                  Email verifikasi telah dikirimkan ke <strong className={isDark ? 'text-white' : 'text-slate-800'}>{verificationInfo.email}</strong>.
                </p>
              </div>

              <div
                className={`p-4 rounded-xl border text-xs text-left leading-relaxed ${
                  isDark
                    ? 'bg-[#1F2937]/50 border-slate-800 text-slate-300'
                    : 'bg-blue-50/70 border-blue-100 text-slate-700'
                }`}
              >
                <p className='font-semibold mb-1 text-blue-600 dark:text-blue-400 flex items-center gap-1.5'>
                  <Mail className='w-4 h-4' />
                  <span>Langkah Selanjutnya:</span>
                </p>
                Sesuai kebijakan keamanan akun Growvia (PRD F01.2), silakan klik tautan verifikasi pada inbox email Anda (berlaku selama 24 jam) untuk mengaktifkan akun sebelum masuk.
              </div>

              <div className='space-y-2.5 pt-2'>
                {verificationInfo.verificationUrl && (
                  <Link
                    href={verificationInfo.verificationUrl}
                    className='w-full h-11 flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium rounded-xl transition-colors text-sm shadow-md'
                  >
                    <span>Buka Halaman Verifikasi Email</span>
                    <ArrowRight className='w-4 h-4' />
                  </Link>
                )}

                <Link
                  href='/login'
                  className={`w-full h-11 flex items-center justify-center gap-2 border font-medium rounded-xl transition-colors text-sm ${
                    isDark
                      ? 'border-slate-700 text-slate-200 hover:bg-slate-800'
                      : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>Ke Halaman Login</span>
                </Link>
              </div>
            </div>
          ) : (
            <>
              {errors.email && !touched.email && (
                <div className='p-3.5 mb-4 rounded-xl border text-xs font-medium bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300 flex items-center gap-2'>
                  <AlertCircle className='w-4 h-4 shrink-0' />
                  <span>{errors.email}</span>
                </div>
              )}

              {/* REGISTRATION FORM */}
              <form onSubmit={handleSubmit} noValidate className='space-y-4'>
            {/* 1. Nama Lengkap */}
            <div>
              <label
                htmlFor='fullName'
                className={`block text-[13px] font-medium mb-1.5 ${
                  isDark ? 'text-slate-200' : 'text-[#334155]'
                }`}
              >
                Nama Lengkap
              </label>
              <div className='relative'>
                <input
                  id='fullName'
                  name='fullName'
                  type='text'
                  autoComplete='name'
                  placeholder='Contoh: Koko Irham'
                  value={fullName}
                  onChange={e => {
                    setFullName(e.target.value)
                    if (touched.fullName) validateField('fullName')
                  }}
                  onBlur={() => handleBlur('fullName')}
                  aria-invalid={!!errors.fullName}
                  aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                  className={`w-full h-[44px] px-3.5 text-[14px] rounded-[12px] transition-all outline-none border ${
                    errors.fullName && touched.fullName
                      ? 'border-[#DC2626] ring-4 ring-[#DC2626]/10 dark:border-[#EF4444] dark:ring-[#EF4444]/20'
                      : isDark
                      ? 'bg-[#0B0F19] border-[#1F2937] text-white placeholder:text-slate-500 hover:border-[#374151] focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/20'
                      : 'bg-white border-[#DCE3EF] text-[#1E293B] placeholder:text-[#94A3B8] hover:border-[#CBD5E1] focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/15'
                  }`}
                />
              </div>
              {errors.fullName && touched.fullName && (
                <p id='fullName-error' className='text-[12px] text-[#DC2626] dark:text-[#EF4444] mt-1.5 flex items-center gap-1 font-normal'>
                  <AlertCircle className='w-3.5 h-3.5 shrink-0' />
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* 2. Alamat Email */}
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
                  <AlertCircle className='w-3.5 h-3.5 shrink-0' />
                  {errors.email}
                </p>
              )}
            </div>

            {/* 3. Password (with eye toggle) */}
            <div>
              <label
                htmlFor='password'
                className={`block text-[13px] font-medium mb-1.5 ${
                  isDark ? 'text-slate-200' : 'text-[#334155]'
                }`}
              >
                Password
              </label>
              <div className='relative'>
                <input
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  autoComplete='new-password'
                  placeholder='Minimal 8 karakter'
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
                  className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-transparent border-none cursor-pointer transition-colors ${
                    isDark ? 'text-slate-400 hover:text-slate-200' : 'text-[#64748B] hover:text-[#1E293B]'
                  }`}
                >
                  {showPassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                </button>
              </div>
              {errors.password && touched.password && (
                <p id='password-error' className='text-[12px] text-[#DC2626] dark:text-[#EF4444] mt-1.5 flex items-center gap-1 font-normal'>
                  <AlertCircle className='w-3.5 h-3.5 shrink-0' />
                  {errors.password}
                </p>
              )}

              {/* Real-time Password Criteria Checklist (PRD F01.1) */}
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-1.5 pt-1.5'>
                <div
                  className={`flex items-center gap-1.5 text-[11px] transition-colors ${
                    hasMinLength ? 'text-emerald-500 font-medium' : isDark ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  <Check className={`w-3 h-3 ${hasMinLength ? 'opacity-100' : 'opacity-40'}`} />
                  <span>Min. 8 karakter</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 text-[11px] transition-colors ${
                    hasUppercase ? 'text-emerald-500 font-medium' : isDark ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  <Check className={`w-3 h-3 ${hasUppercase ? 'opacity-100' : 'opacity-40'}`} />
                  <span>1 Huruf besar</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 text-[11px] transition-colors ${
                    hasNumber ? 'text-emerald-500 font-medium' : isDark ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  <Check className={`w-3 h-3 ${hasNumber ? 'opacity-100' : 'opacity-40'}`} />
                  <span>1 Angka</span>
                </div>
              </div>
            </div>

            {/* 4. Konfirmasi Password (with eye toggle) */}
            <div>
              <label
                htmlFor='confirmPassword'
                className={`block text-[13px] font-medium mb-1.5 ${
                  isDark ? 'text-slate-200' : 'text-[#334155]'
                }`}
              >
                Konfirmasi Password
              </label>
              <div className='relative'>
                <input
                  id='confirmPassword'
                  name='confirmPassword'
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete='new-password'
                  placeholder='Ketik ulang password'
                  value={confirmPassword}
                  onChange={e => {
                    setConfirmPassword(e.target.value)
                    if (touched.confirmPassword) validateField('confirmPassword')
                  }}
                  onBlur={() => handleBlur('confirmPassword')}
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
                  className={`w-full h-[44px] pl-3.5 pr-11 text-[14px] rounded-[12px] transition-all outline-none border ${
                    errors.confirmPassword && touched.confirmPassword
                      ? 'border-[#DC2626] ring-4 ring-[#DC2626]/10 dark:border-[#EF4444] dark:ring-[#EF4444]/20'
                      : isDark
                      ? 'bg-[#0B0F19] border-[#1F2937] text-white placeholder:text-slate-500 hover:border-[#374151] focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/20'
                      : 'bg-white border-[#DCE3EF] text-[#1E293B] placeholder:text-[#94A3B8] hover:border-[#CBD5E1] focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/15'
                  }`}
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(prev => !prev)}
                  aria-label={showConfirmPassword ? 'Sembunyikan konfirmasi password' : 'Tampilkan konfirmasi password'}
                  aria-pressed={showConfirmPassword}
                  className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-transparent border-none cursor-pointer transition-colors ${
                    isDark ? 'text-slate-400 hover:text-slate-200' : 'text-[#64748B] hover:text-[#1E293B]'
                  }`}
                >
                  {showConfirmPassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                </button>
              </div>
              {errors.confirmPassword && touched.confirmPassword && (
                <p id='confirmPassword-error' className='text-[12px] text-[#DC2626] dark:text-[#EF4444] mt-1.5 flex items-center gap-1 font-normal'>
                  <AlertCircle className='w-3.5 h-3.5 shrink-0' />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Checkbox Persetujuan */}
            <div className='pt-1'>
              <label className='flex items-start gap-2.5 cursor-pointer select-none group'>
                <div className='relative flex items-center justify-center mt-0.5'>
                  <input
                    id='terms'
                    type='checkbox'
                    checked={agreeTerms}
                    onChange={e => {
                      setAgreeTerms(e.target.checked)
                      if (touched.terms) {
                        setErrors(prev => ({
                          ...prev,
                          terms: e.target.checked
                            ? undefined
                            : 'Anda harus menyetujui Syarat & Ketentuan serta Kebijakan Privasi'
                        }))
                      }
                    }}
                    onBlur={() => handleBlur('terms')}
                    className='sr-only peer'
                  />
                  <div
                    className={`w-[18px] h-[18px] rounded-[5px] border transition-all flex items-center justify-center ${
                      agreeTerms
                        ? 'bg-[#2563EB] border-[#2563EB]'
                        : errors.terms && touched.terms
                        ? 'border-[#DC2626] dark:border-[#EF4444] bg-red-50 dark:bg-red-950/40'
                        : isDark
                        ? 'border-[#374151] bg-[#0B0F19] group-hover:border-slate-400'
                        : 'border-[#CBD5E1] bg-white group-hover:border-[#94A3B8]'
                    }`}
                  >
                    {agreeTerms && <Check className='w-3 h-3 text-white stroke-[3.5]' />}
                  </div>
                </div>
                <span className={`text-[12.5px] leading-snug ${isDark ? 'text-slate-300' : 'text-[#475569]'}`}>
                  Saya menyetujui{' '}
                  <Link href='/terms' className='text-[#2563EB] dark:text-[#60A5FA] hover:underline font-medium'>
                    Syarat & Ketentuan
                  </Link>{' '}
                  serta{' '}
                  <Link href='/privacy' className='text-[#2563EB] dark:text-[#60A5FA] hover:underline font-medium'>
                    Kebijakan Privasi
                  </Link>{' '}
                  Growvia.
                </span>
              </label>
              {errors.terms && touched.terms && (
                <p className='text-[12px] text-[#DC2626] dark:text-[#EF4444] mt-1.5 flex items-center gap-1 font-normal'>
                  <AlertCircle className='w-3.5 h-3.5 shrink-0' />
                  {errors.terms}
                </p>
              )}
            </div>

            {/* Primary Button: Buat Akun */}
            <div className='pt-1.5'>
              <button
                type='submit'
                disabled={isLoading}
                className='w-full h-[44px] bg-[#2563EB] hover:bg-[#1D4ED8] dark:hover:bg-[#3B82F6] active:bg-[#1E40AF] text-white font-medium text-[14.5px] rounded-[12px] transition-all flex items-center justify-center gap-2 shadow-sm shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-md hover:shadow-blue-500/30'
              >
                {isLoading ? (
                  <>
                    <Loader2 className='w-4 h-4 animate-spin' />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <span>Buat Akun</span>
                    <ArrowRight className='w-4 h-4' />
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
            <span>Daftar dengan Google</span>
          </button>

              {/* Already have an account? Sign in link */}
              <div className={`text-center mt-6 text-[13.5px] ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
                <span>Sudah punya akun? </span>
                <Link
                  href='/login'
                  className='text-[#2563EB] dark:text-[#60A5FA] hover:underline font-semibold transition-colors'
                >
                  Masuk
                </Link>
              </div>
            </>
          )}
        </section>

        {/* TRUST HIGHLIGHTS BELOW CARD */}
        <div
          className={`mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[12.5px] text-center max-w-[650px] ${
            isDark ? 'text-slate-400' : 'text-[#64748B]'
          }`}
        >
          <div className='flex items-center gap-1.5'>
            <Sparkles className='w-4 h-4 text-emerald-500' />
            <span>Pemetaan Skill Berbasis AI</span>
          </div>

          <span className={`hidden sm:inline ${isDark ? 'text-slate-600' : 'text-[#CBD5E1]'}`}>•</span>

          <div className='flex items-center gap-1.5'>
            <Target className='w-4 h-4 text-blue-600' />
            <span>Rekomendasi Karier Terarah</span>
          </div>

          <span className={`hidden sm:inline ${isDark ? 'text-slate-600' : 'text-[#CBD5E1]'}`}>•</span>

          <div className='flex items-center gap-1.5'>
            <ShieldCheck className='w-4 h-4 text-blue-600' />
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
    </div>
  )
}
