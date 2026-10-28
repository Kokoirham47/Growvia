'use client'

import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'

import Link from 'next/link'

import {
  ArrowLeft,
  Sun,
  Moon,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react'

import { useSettings } from '@core/hooks/useSettings'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/libs/supabase/client'

interface FormErrors {
  fullName?: string
  email?: string
  password?: string
  confirmPassword?: string
  terms?: string
}

export default function Register() {
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
      const supabase = createClient()

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`
        }
      })

      if (error) {
        console.error('Google Sign In Error:', error)
        alert('Gagal memulai login Google: ' + error.message)
      }
    } catch (e) {
      console.error('Google Sign In Exception:', e)
    }
  }

  const hasMinLength = password.length >= 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)

  return (
    <div
      className={`landing-page ${isDark ? 'dark' : ''} min-h-screen font-poppins flex flex-col justify-between selection:bg-[#2563EB] selection:text-white bg-[#F5F6F8] dark:bg-[#0B0F19] text-[var(--lp-text)] transition-colors duration-200`}
    >
      {/* TOP FLOATING CONTROLS (Kembali & Mode Toggle) */}
      <div className='w-full max-w-[1280px] mx-auto px-4 sm:px-8 pt-6 sm:pt-8 flex items-center justify-between z-20'>
        {/* Tombol Kembali */}
        <Link
          href='/'
          className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[13px] font-medium border border-[var(--lp-border)] bg-[var(--lp-card)] text-[var(--lp-text-sec)] hover:text-[var(--lp-text)] hover:border-[var(--lp-border-strong)] transition-all shadow-xs'
        >
          <ArrowLeft className='w-4 h-4' />
          <span>Kembali</span>
        </Link>

        {/* Circular Theme Toggle Button */}
        <button
          type='button'
          onClick={handleToggleTheme}
          aria-label={isDark ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
          title={isDark ? 'Mode Terang' : 'Mode Gelap'}
          className='w-10 h-10 rounded-full border border-[var(--lp-border)] bg-[var(--lp-card)] text-[var(--lp-text-sec)] hover:text-[var(--lp-text)] hover:border-[var(--lp-border-strong)] flex items-center justify-center transition-colors cursor-pointer shadow-xs'
        >
          {isDark ? <Sun className='w-4 h-4' /> : <Moon className='w-4 h-4' />}
        </button>
      </div>

      {/* MAIN CONTAINER */}
      <main className='flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12'>
        {/* REGISTRATION CARD */}
        <section
          className='w-full max-w-[480px] rounded-3xl p-6 sm:p-10 border border-[var(--lp-border)] bg-[var(--lp-card)] shadow-xl shadow-slate-200/50 dark:shadow-none transition-all'
          aria-labelledby='form-heading'
        >
          {/* Card Top: Logo + Title + Subtitle */}
          <div className='flex flex-col items-center text-center mb-7'>
            <Link href='/' className='inline-flex items-center gap-2.5 mb-3 group'>
              <img
                src='/images/growvia-logo.png'
                alt='Growvia'
                className='w-8 h-8 rounded-lg object-contain'
              />
              <span className='font-bold text-[19px] tracking-tight text-[var(--lp-heading)]'>
                Growvia
              </span>
            </Link>

            <h1
              id='form-heading'
              className='text-[24px] sm:text-[26px] font-bold tracking-tight text-[var(--lp-heading)] mb-1.5'
            >
              Buat Akun Baru
            </h1>

            <p className='text-[13.5px] text-[var(--lp-text-sec)] leading-relaxed'>
              Mulai perjalanan kariermu hari ini.
            </p>
          </div>

          {isSuccess && verificationInfo ? (
            <div className='space-y-5 text-center py-2 animate-fadeIn'>
              <div className='w-14 h-14 rounded-full mx-auto flex items-center justify-center bg-emerald-500/10 text-emerald-500'>
                <CheckCircle2 className='w-7 h-7' />
              </div>

              <div>
                <h2 className='text-xl font-bold text-[var(--lp-heading)]'>
                  Pendaftaran Berhasil
                </h2>
                <p className='text-sm mt-2 leading-relaxed text-[var(--lp-text-sec)]'>
                  Email verifikasi telah dikirimkan ke{' '}
                  <strong className='text-[var(--lp-text)]'>{verificationInfo.email}</strong>.
                </p>
              </div>

              <div className='p-4 rounded-2xl border border-[var(--lp-border)] bg-[var(--lp-panel)] text-xs text-left leading-relaxed text-[var(--lp-text-sec)]'>
                <p className='font-semibold mb-1 text-[var(--lp-accent)]'>
                  Langkah Selanjutnya:
                </p>
                Sesuai kebijakan keamanan akun Growvia, silakan klik tautan verifikasi pada inbox email Anda (berlaku selama 24 jam) untuk mengaktifkan akun sebelum masuk.
              </div>

              <div className='space-y-2.5 pt-2'>
                {verificationInfo.verificationUrl && (
                  <Link
                    href={verificationInfo.verificationUrl}
                    className='w-full h-11 flex items-center justify-center gap-2 bg-[var(--lp-btn)] hover:brightness-105 active:scale-[0.99] text-white font-medium rounded-full transition-all text-sm shadow-xs'
                  >
                    <span>Buka Halaman Verifikasi Email</span>
                  </Link>
                )}

                <Link
                  href='/login'
                  className='w-full h-11 flex items-center justify-center gap-2 border border-[var(--lp-border)] text-[var(--lp-text)] font-medium rounded-full hover:bg-[var(--lp-panel)] transition-all text-sm'
                >
                  <span>Ke Halaman Login</span>
                </Link>
              </div>
            </div>
          ) : (
            <>
              {errors.email && !touched.email && (
                <div className='p-3.5 mb-4 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 text-xs font-medium flex items-center gap-2 animate-fadeIn'>
                  <AlertCircle className='w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400' />
                  <span>{errors.email}</span>
                </div>
              )}

              {/* REGISTRATION FORM */}
              <form onSubmit={handleSubmit} noValidate className='space-y-4'>
                {/* 1. Nama Lengkap */}
                <div>
                  <label
                    htmlFor='fullName'
                    className='block text-[13px] font-medium mb-1.5 text-[var(--lp-text)]'
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
                      className={`w-full h-11 px-3.5 text-sm rounded-xl transition-all outline-hidden border ${
                        errors.fullName && touched.fullName
                          ? 'border-rose-500 ring-2 ring-rose-500/10 dark:border-rose-500 dark:ring-rose-500/20'
                          : 'border-[var(--lp-border)] bg-[var(--lp-page)] text-[var(--lp-text)] placeholder:text-[var(--lp-text-muted)] focus:border-[var(--lp-accent)] focus:ring-2 focus:ring-[var(--lp-accent-soft)]'
                      }`}
                    />
                  </div>
                  {errors.fullName && touched.fullName && (
                    <p id='fullName-error' className='text-xs text-rose-600 dark:text-rose-400 mt-1.5 flex items-center gap-1 font-normal'>
                      <AlertCircle className='w-3.5 h-3.5 shrink-0' />
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* 2. Alamat Email */}
                <div>
                  <label
                    htmlFor='email'
                    className='block text-[13px] font-medium mb-1.5 text-[var(--lp-text)]'
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
                      className={`w-full h-11 px-3.5 text-sm rounded-xl transition-all outline-hidden border ${
                        errors.email && touched.email
                          ? 'border-rose-500 ring-2 ring-rose-500/10 dark:border-rose-500 dark:ring-rose-500/20'
                          : 'border-[var(--lp-border)] bg-[var(--lp-page)] text-[var(--lp-text)] placeholder:text-[var(--lp-text-muted)] focus:border-[var(--lp-accent)] focus:ring-2 focus:ring-[var(--lp-accent-soft)]'
                      }`}
                    />
                  </div>
                  {errors.email && touched.email && (
                    <p id='email-error' className='text-xs text-rose-600 dark:text-rose-400 mt-1.5 flex items-center gap-1 font-normal'>
                      <AlertCircle className='w-3.5 h-3.5 shrink-0' />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* 3. Password (with eye toggle) */}
                <div>
                  <label
                    htmlFor='password'
                    className='block text-[13px] font-medium mb-1.5 text-[var(--lp-text)]'
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
                      className={`w-full h-11 pl-3.5 pr-11 text-sm rounded-xl transition-all outline-hidden border ${
                        errors.password && touched.password
                          ? 'border-rose-500 ring-2 ring-rose-500/10 dark:border-rose-500 dark:ring-rose-500/20'
                          : 'border-[var(--lp-border)] bg-[var(--lp-page)] text-[var(--lp-text)] placeholder:text-[var(--lp-text-muted)] focus:border-[var(--lp-accent)] focus:ring-2 focus:ring-[var(--lp-accent-soft)]'
                      }`}
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(prev => !prev)}
                      aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                      aria-pressed={showPassword}
                      className='absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[var(--lp-text-muted)] hover:text-[var(--lp-text)] transition-colors cursor-pointer bg-transparent border-0 outline-hidden'
                    >
                      {showPassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                    </button>
                  </div>
                  {errors.password && touched.password && (
                    <p id='password-error' className='text-xs text-rose-600 dark:text-rose-400 mt-1.5 flex items-center gap-1 font-normal'>
                      <AlertCircle className='w-3.5 h-3.5 shrink-0' />
                      {errors.password}
                    </p>
                  )}

                  {/* Real-time Password Criteria Checklist */}
                  <div className='grid grid-cols-1 sm:grid-cols-3 gap-1.5 pt-2'>
                    <div
                      className={`flex items-center gap-1.5 text-[11px] transition-colors ${
                        hasMinLength ? 'text-emerald-500 font-medium' : 'text-[var(--lp-text-muted)]'
                      }`}
                    >
                      <Check className={`w-3 h-3 ${hasMinLength ? 'opacity-100' : 'opacity-40'}`} />
                      <span>Min. 8 karakter</span>
                    </div>
                    <div
                      className={`flex items-center gap-1.5 text-[11px] transition-colors ${
                        hasUppercase ? 'text-emerald-500 font-medium' : 'text-[var(--lp-text-muted)]'
                      }`}
                    >
                      <Check className={`w-3 h-3 ${hasUppercase ? 'opacity-100' : 'opacity-40'}`} />
                      <span>1 Huruf besar</span>
                    </div>
                    <div
                      className={`flex items-center gap-1.5 text-[11px] transition-colors ${
                        hasNumber ? 'text-emerald-500 font-medium' : 'text-[var(--lp-text-muted)]'
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
                    className='block text-[13px] font-medium mb-1.5 text-[var(--lp-text)]'
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
                      className={`w-full h-11 pl-3.5 pr-11 text-sm rounded-xl transition-all outline-hidden border ${
                        errors.confirmPassword && touched.confirmPassword
                          ? 'border-rose-500 ring-2 ring-rose-500/10 dark:border-rose-500 dark:ring-rose-500/20'
                          : 'border-[var(--lp-border)] bg-[var(--lp-page)] text-[var(--lp-text)] placeholder:text-[var(--lp-text-muted)] focus:border-[var(--lp-accent)] focus:ring-2 focus:ring-[var(--lp-accent-soft)]'
                      }`}
                    />
                    <button
                      type='button'
                      onClick={() => setShowConfirmPassword(prev => !prev)}
                      aria-label={showConfirmPassword ? 'Sembunyikan konfirmasi password' : 'Tampilkan konfirmasi password'}
                      aria-pressed={showConfirmPassword}
                      className='absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[var(--lp-text-muted)] hover:text-[var(--lp-text)] transition-colors cursor-pointer bg-transparent border-0 outline-hidden'
                    >
                      {showConfirmPassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                    </button>
                  </div>
                  {errors.confirmPassword && touched.confirmPassword && (
                    <p id='confirmPassword-error' className='text-xs text-rose-600 dark:text-rose-400 mt-1.5 flex items-center gap-1 font-normal'>
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
                        className={`w-[18px] h-[18px] rounded-md border transition-all flex items-center justify-center ${
                          agreeTerms
                            ? 'bg-[var(--lp-accent)] border-[var(--lp-accent)] text-white'
                            : errors.terms && touched.terms
                            ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40'
                            : 'border-[var(--lp-border-strong)] bg-[var(--lp-page)] group-hover:border-[var(--lp-accent)]'
                        }`}
                      >
                        {agreeTerms && <Check className='w-3 h-3 stroke-[3]' />}
                      </div>
                    </div>
                    <span className='text-[12.5px] leading-snug text-[var(--lp-text-sec)]'>
                      Saya menyetujui{' '}
                      <Link href='/terms' className='text-[var(--lp-link)] hover:underline font-medium'>
                        Syarat & Ketentuan
                      </Link>{' '}
                      serta{' '}
                      <Link href='/privacy' className='text-[var(--lp-link)] hover:underline font-medium'>
                        Kebijakan Privasi
                      </Link>{' '}
                      Growvia.
                    </span>
                  </label>
                  {errors.terms && touched.terms && (
                    <p className='text-xs text-rose-600 dark:text-rose-400 mt-1.5 flex items-center gap-1 font-normal'>
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
                    className='w-full h-11 bg-[var(--lp-btn)] hover:brightness-105 active:scale-[0.99] text-white font-medium text-sm rounded-full transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer'
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className='w-4 h-4 animate-spin' />
                        <span>Memproses...</span>
                      </>
                    ) : (
                      <span>Buat Akun</span>
                    )}
                  </button>
                </div>
              </form>

              {/* Divider with "ATAU" */}
              <div className='relative my-5'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-[var(--lp-border)]' />
                </div>
                <div className='relative flex justify-center text-[11.5px] uppercase'>
                  <span className='px-3 font-medium tracking-wider bg-[var(--lp-card)] text-[var(--lp-text-muted)]'>
                    ATAU
                  </span>
                </div>
              </div>

              {/* Google Button */}
              <button
                type='button'
                onClick={handleGoogleSignIn}
                className='w-full h-11 font-medium text-sm rounded-full transition-all flex items-center justify-center gap-2.5 border border-[var(--lp-border)] bg-[var(--lp-card)] text-[var(--lp-text)] hover:bg-[var(--lp-panel)] hover:border-[var(--lp-border-strong)] cursor-pointer shadow-xs'
              >
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
              <div className='text-center mt-6 text-[13.5px] text-[var(--lp-text-sec)]'>
                <span>Sudah punya akun? </span>
                <Link
                  href='/login'
                  className='text-[var(--lp-link)] hover:underline font-semibold transition-colors'
                >
                  Masuk
                </Link>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  )
}
