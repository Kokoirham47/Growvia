'use client'

import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import {
  ArrowLeft,
  Sun,
  Moon,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  X,
  Loader2
} from 'lucide-react'

import type { SystemMode } from '@core/types'
import { useSettings } from '@core/hooks/useSettings'
import { useAuth } from '@/contexts/AuthContext'

interface FormErrors {
  email?: string
  password?: string
  general?: string
}

interface LoginProps {
  mode?: SystemMode
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  const { login } = useAuth()

  // Validation & interaction states
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [unverifiedData, setUnverifiedData] = useState<{ email: string } | null>(null)
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
  const [forgotPasswordStatus, setForgotPasswordStatus] = useState<string | null>(null)
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null)

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

  // Submit handler calling real auth API
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateAll()) {
      return
    }

    setIsLoading(true)
    setErrors(prev => ({ ...prev, general: undefined }))
    setUnverifiedData(null)

    try {
      const res = await login({
        email: email.trim(),
        password,
        rememberMe
      })

      if (!res.success) {
        if (res.isUnverified) {
          setUnverifiedData({ email: email.trim() })
          
return
        }


        // PRD F01.3: "Email atau password salah (jangan sebutkan mana yang salah)"
        setErrors({
          general: 'Email atau password yang Anda masukkan salah. Silakan coba lagi.'
        })
        
return
      }

      setIsSuccess(true)

      // Redirect dinamis sesuai kelengkapan profile (ke /onboarding jika belum, ke /home jika sudah)
      setTimeout(() => {
        router.push(res.redirectTo || '/home')
      }, 800)
    } catch {
      setErrors({
        general: 'Email atau password yang Anda masukkan salah. Silakan coba lagi.'
      })
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

  // Handle forgot password request
  const handleForgotPasswordSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!forgotPasswordEmail.trim()) return

    setForgotPasswordStatus(null)
    setDevResetUrl(null)

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotPasswordEmail.trim() })
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setForgotPasswordStatus(data.message || 'Instruksi reset password telah dikirim ke email Anda.')

        if (data.data?.resetUrl) {
          setDevResetUrl(data.data.resetUrl)
        }
      } else {
        setForgotPasswordStatus(data.message || 'Gagal memproses permintaan reset password.')
      }
    } catch {
      setForgotPasswordStatus('Terjadi kesalahan koneksi saat meminta reset password.')
    }
  }

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
        {/* Success Alert Banner */}
        {isSuccess && (
          <div className='w-full max-w-[460px] mb-5 p-4 border border-emerald-500/20 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 rounded-2xl flex items-center gap-3 animate-fade-in shadow-xs'>
            <div className='w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0'>
              <Check className='w-4 h-4 stroke-[2.5]' />
            </div>
            <div className='text-xs sm:text-sm'>
              <p className='font-semibold'>Berhasil Masuk</p>
              <p className='text-emerald-700 dark:text-emerald-400'>
                Selamat datang kembali! Mengalihkan ke dashboard...
              </p>
            </div>
          </div>
        )}

        {/* LOGIN CARD */}
        <section
          className='w-full max-w-[460px] rounded-3xl p-6 sm:p-10 border border-[var(--lp-border)] bg-[var(--lp-card)] shadow-xl shadow-slate-200/50 dark:shadow-none transition-all'
          aria-labelledby='login-heading'
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
              id='login-heading'
              className='text-[24px] sm:text-[26px] font-bold tracking-tight text-[var(--lp-heading)] mb-1.5'
            >
              Masuk ke Akun
            </h1>

            <p className='text-[13.5px] text-[var(--lp-text-sec)] leading-relaxed'>
              Selamat datang kembali! Lanjutkan perjalanan kariermu.
            </p>
          </div>

          {/* Alert General Error */}
          {errors.general && (
            <div className='p-3.5 mb-4 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 text-xs font-medium flex items-center gap-2.5 animate-fadeIn'>
              <AlertCircle className='w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400' />
              <span>{errors.general}</span>
            </div>
          )}

          {/* Alert Unverified Account */}
          {unverifiedData && (
            <div className='p-3.5 mb-4 rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-medium space-y-2 animate-fadeIn'>
              <div className='flex items-start gap-2.5'>
                <AlertCircle className='w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400' />
                <p>Akun Anda belum diverifikasi. Silakan periksa inbox email atau kirim ulang verifikasi.</p>
              </div>
              <div className='pt-1'>
                <Link
                  href={`/verify-email?email=${encodeURIComponent(unverifiedData.email)}`}
                  className='inline-flex items-center gap-1.5 font-semibold text-[var(--lp-link)] hover:underline'
                >
                  <span>Buka Halaman Verifikasi Email</span>
                </Link>
              </div>
            </div>
          )}

          {/* LOGIN FORM */}
          <form onSubmit={handleSubmit} noValidate className='space-y-4'>
            {/* 1. Alamat Email */}
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
                    if (errors.general) setErrors(prev => ({ ...prev, general: undefined }))
                    if (touched.email) validateField('email')
                  }}
                  onBlur={() => handleBlur('email')}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className={`w-full h-11 px-3.5 text-sm rounded-xl transition-all outline-hidden border ${
                    !errors.general && errors.email && touched.email
                      ? 'border-rose-500 ring-2 ring-rose-500/10 dark:border-rose-500 dark:ring-rose-500/20'
                      : 'border-[var(--lp-border)] bg-[var(--lp-page)] text-[var(--lp-text)] placeholder:text-[var(--lp-text-muted)] focus:border-[var(--lp-accent)] focus:ring-2 focus:ring-[var(--lp-accent-soft)]'
                  }`}
                />
              </div>
              {!errors.general && errors.email && touched.email && (
                <p id='email-error' className='text-xs text-rose-600 dark:text-rose-400 mt-1.5 flex items-center gap-1 font-normal'>
                  <AlertCircle className='w-3 h-3' />
                  {errors.email}
                </p>
              )}
            </div>

            {/* 2. Password (with eye toggle) */}
            <div>
              <div className='flex items-center justify-between mb-1.5'>
                <label
                  htmlFor='password'
                  className='block text-[13px] font-medium text-[var(--lp-text)]'
                >
                  Password
                </label>
                <button
                  type='button'
                  onClick={() => setShowForgotPasswordModal(true)}
                  className='text-[12.5px] text-[var(--lp-link)] hover:underline transition-colors font-medium cursor-pointer'
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
                    if (errors.general) setErrors(prev => ({ ...prev, general: undefined }))
                    if (touched.password) validateField('password')
                  }}
                  onBlur={() => handleBlur('password')}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  className={`w-full h-11 pl-3.5 pr-11 text-sm rounded-xl transition-all outline-hidden border ${
                    !errors.general && errors.password && touched.password
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
              {!errors.general && errors.password && touched.password && (
                <p id='password-error' className='text-xs text-rose-600 dark:text-rose-400 mt-1.5 flex items-center gap-1 font-normal'>
                  <AlertCircle className='w-3 h-3' />
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
                    className={`w-[18px] h-[18px] rounded-md border transition-all flex items-center justify-center ${
                      rememberMe
                        ? 'bg-[var(--lp-accent)] border-[var(--lp-accent)] text-white'
                        : 'border-[var(--lp-border-strong)] bg-[var(--lp-page)] group-hover:border-[var(--lp-accent)]'
                    }`}
                  >
                    {rememberMe && <Check className='w-3 h-3 stroke-[3]' />}
                  </div>
                </div>
                <span className='text-[13px] text-[var(--lp-text-sec)]'>
                  Ingat saya di perangkat ini
                </span>
              </label>
            </div>

            {/* Primary Button: Masuk ke Akun */}
            <div className='pt-2'>
              <button
                type='submit'
                disabled={isLoading}
                className='w-full h-11 bg-[var(--lp-btn)] hover:brightness-105 active:scale-[0.99] text-white font-medium text-sm rounded-full transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer'
              >
                {isLoading ? (
                  <>
                    <Loader2 className='w-4 h-4 animate-spin' />
                    <span>Memproses Masuk...</span>
                  </>
                ) : (
                  <span>Masuk ke Akun</span>
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
            <span>Masuk dengan Google</span>
          </button>

          {/* New to Growvia? Register link */}
          <div className='text-center mt-6 text-[13.5px] text-[var(--lp-text-sec)]'>
            <span>Belum punya akun? </span>
            <Link
              href='/register'
              className='text-[var(--lp-link)] hover:underline font-semibold transition-colors'
            >
              Daftar Sekarang
            </Link>
          </div>
        </section>
      </main>

      {/* FORGOT PASSWORD MODAL */}
      {showForgotPasswordModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in'>
          <div className='rounded-3xl max-w-[420px] w-full p-6 sm:p-8 shadow-2xl border border-[var(--lp-border)] bg-[var(--lp-card)] relative'>
            <button
              onClick={() => {
                setShowForgotPasswordModal(false)
                setForgotPasswordStatus(null)
              }}
              className='absolute top-5 right-5 text-[var(--lp-text-muted)] hover:text-[var(--lp-text)] transition-colors cursor-pointer'
              aria-label='Tutup'
            >
              <X className='w-5 h-5' />
            </button>

            <div className='text-center mb-6'>
              <h2 className='text-xl font-bold text-[var(--lp-heading)] mb-1.5'>
                Lupa Password?
              </h2>
              <p className='text-[13px] text-[var(--lp-text-sec)] leading-relaxed'>
                Masukkan email Anda untuk menerima instruksi pemulihan kata sandi.
              </p>
            </div>

            {forgotPasswordStatus ? (
              <div className='space-y-3.5'>
                <div className='p-3.5 border border-emerald-500/20 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs text-center font-medium'>
                  {forgotPasswordStatus}
                </div>
                {devResetUrl && (
                  <div className='p-3 rounded-xl border border-[var(--lp-border)] bg-[var(--lp-panel)] text-xs text-center'>
                    <Link
                      href={devResetUrl}
                      className='text-[var(--lp-link)] font-semibold hover:underline inline-flex items-center gap-1.5'
                    >
                      <span>Buka Tautan Reset Password</span>
                    </Link>
                  </div>
                )}
                <button
                  type='button'
                  onClick={() => {
                    setShowForgotPasswordModal(false)
                    setForgotPasswordStatus(null)
                    setDevResetUrl(null)
                  }}
                  className='w-full h-11 border border-[var(--lp-border)] text-xs font-medium rounded-full hover:bg-[var(--lp-panel)] transition-colors cursor-pointer text-[var(--lp-text)]'
                >
                  Tutup
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className='space-y-4'>
                <div>
                  <label
                    htmlFor='forgotEmail'
                    className='block text-xs font-medium mb-1.5 text-[var(--lp-text)]'
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
                    className='w-full h-11 px-3.5 text-sm rounded-xl outline-hidden border border-[var(--lp-border)] bg-[var(--lp-page)] text-[var(--lp-text)] placeholder:text-[var(--lp-text-muted)] focus:border-[var(--lp-accent)] focus:ring-2 focus:ring-[var(--lp-accent-soft)] transition-all'
                  />
                </div>
                <button
                  type='submit'
                  className='w-full h-11 bg-[var(--lp-btn)] hover:brightness-105 active:scale-[0.99] text-white font-medium text-sm rounded-full transition-all shadow-xs cursor-pointer'
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
