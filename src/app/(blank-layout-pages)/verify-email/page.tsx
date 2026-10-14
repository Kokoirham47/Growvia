'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Mail,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  ArrowLeft,
  Sun,
  Moon
} from 'lucide-react'
import { useSettings } from '@core/hooks/useSettings'

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tokenFromUrl = searchParams.get('token')

  const { settings, updateSettings } = useSettings()
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

  const isDark =
    settings.mode === 'dark' || (settings.mode === 'system' && systemIsDark)

  const handleToggleTheme = () => {
    updateSettings({ mode: isDark ? 'light' : 'dark' })
  }

  // States
  const [isVerifying, setIsVerifying] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [resendEmail, setResendEmail] = useState('')
  const [isResending, setIsResending] = useState(false)
  const [resendSuccessMsg, setResendSuccessMsg] = useState<string | null>(null)
  const [cooldown, setCooldown] = useState(0)

  // Countdown timer for resend cooldown (60s as per PRD F01.2)
  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => {
      setCooldown(prev => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  // Automatically verify if token exists in URL
  useEffect(() => {
    if (!tokenFromUrl) return

    const verifyToken = async () => {
      setIsVerifying(true)
      setErrorMessage(null)
      try {
        const res = await fetch(`/api/auth/verify-email?token=${encodeURIComponent(tokenFromUrl)}`)
        const data = await res.json()

        if (res.ok && data.success) {
          setIsSuccess(true)
          // Redirect to login after 2.5 seconds as per PRD F01.2
          setTimeout(() => {
            router.push('/login?verified=true')
          }, 2500)
        } else {
          setErrorMessage(data.message || 'Token verifikasi tidak valid atau telah kedaluwarsa (24 jam).')
        }
      } catch (err: unknown) {
        setErrorMessage('Gagal menghubungi server untuk verifikasi email.')
      } finally {
        setIsVerifying(false)
      }
    }

    verifyToken()
  }, [tokenFromUrl, router])

  // Resend verification email handler
  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resendEmail.trim() || cooldown > 0) return

    setIsResending(true)
    setResendSuccessMsg(null)
    setErrorMessage(null)

    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'resend', email: resendEmail.trim() })
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setResendSuccessMsg('Email verifikasi baru berhasil dikirim! Silakan periksa inbox Anda.')
        setCooldown(60) // Enforce 60-second cooldown
      } else {
        setErrorMessage(data.message || 'Gagal mengirim ulang email verifikasi.')
      }
    } catch {
      setErrorMessage('Terjadi gangguan jaringan saat meminta email baru.')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div
      className={`min-h-screen font-poppins flex flex-col justify-between selection:bg-[#2563EB] selection:text-white relative overflow-x-hidden transition-colors duration-200 ${
        isDark ? 'bg-[#0B0F19] text-[#F8FAFC]' : 'bg-[#F5F6F8] text-[#1E293B]'
      }`}
    >
      {/* Top Floating Controls */}
      <div className='w-full max-w-[1280px] mx-auto px-4 sm:px-8 pt-6 sm:pt-8 flex items-center justify-between z-20'>
        <Link
          href='/login'
          className={`inline-flex items-center gap-2 text-[14px] font-medium transition-colors ${
            isDark ? 'text-slate-300 hover:text-white' : 'text-[#475569] hover:text-[#0F172A]'
          }`}
        >
          <ArrowLeft className='w-4 h-4' />
          <span>Kembali ke Login</span>
        </Link>

        <button
          type='button'
          onClick={handleToggleTheme}
          aria-label='Toggle theme'
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            isDark
              ? 'bg-[#1E293B] text-amber-400 hover:bg-[#334155]'
              : 'bg-white text-slate-700 hover:bg-slate-100 shadow-sm border border-slate-200'
          }`}
        >
          {isDark ? <Sun className='w-5 h-5' /> : <Moon className='w-5 h-5' />}
        </button>
      </div>

      {/* Main Container */}
      <div className='w-full max-w-[460px] mx-auto px-4 py-8 z-10'>
        <div
          className={`p-6 sm:p-8 rounded-[24px] border shadow-xl backdrop-blur-xl ${
            isDark
              ? 'bg-[#111827]/80 border-[#1F2937] shadow-black/40'
              : 'bg-white/95 border-[#E2E8F0] shadow-blue-500/5'
          }`}
        >
          {/* Header Icon */}
          <div className='text-center mb-6'>
            <div
              className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4 transition-transform duration-300 ${
                isSuccess
                  ? 'bg-emerald-500/10 text-emerald-500 scale-110'
                  : errorMessage
                  ? 'bg-rose-500/10 text-rose-500'
                  : isVerifying
                  ? 'bg-blue-500/10 text-blue-500'
                  : isDark
                  ? 'bg-blue-950/60 text-blue-400'
                  : 'bg-blue-50 text-[#2563EB]'
              }`}
            >
              {isSuccess ? (
                <CheckCircle2 className='w-8 h-8' />
              ) : errorMessage ? (
                <AlertCircle className='w-8 h-8' />
              ) : isVerifying ? (
                <RefreshCw className='w-8 h-8 animate-spin' />
              ) : (
                <Mail className='w-8 h-8' />
              )}
            </div>

            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
              {isSuccess
                ? 'Email Terverifikasi!'
                : isVerifying
                ? 'Memverifikasi Akun...'
                : errorMessage
                ? 'Verifikasi Gagal'
                : 'Verifikasi Email'}
            </h1>

            <p className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
              {isSuccess
                ? 'Akun Growvia Anda kini telah aktif. Mengalihkan ke halaman login...'
                : isVerifying
                ? 'Mohon tunggu sejenak selagi kami memvalidasi token verifikasi Anda.'
                : errorMessage
                ? errorMessage
                : 'Silakan periksa kotak masuk email Anda dan klik tautan verifikasi.'}
            </p>
          </div>

          {/* SUCCESS STATE */}
          {isSuccess && (
            <div className='space-y-4'>
              <div
                className={`p-4 rounded-xl border text-sm text-center ${
                  isDark
                    ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                }`}
              >
                Pendaftaran Anda telah lengkap. Anda sekarang dapat masuk ke akun Growvia.
              </div>
              <Link
                href='/login'
                className='w-full h-11 flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium rounded-xl transition-colors text-sm shadow-md'
              >
                <span>Masuk Sekarang</span>
                <ArrowRight className='w-4 h-4' />
              </Link>
            </div>
          )}

          {/* VERIFYING LOADING STATE */}
          {isVerifying && (
            <div className='flex flex-col items-center justify-center py-6 gap-3'>
              <div className='w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin' />
              <p className='text-xs text-slate-500'>Memproses data token...</p>
            </div>
          )}

          {/* RESEND FORM (if token expired, error, or no token provided) */}
          {!isSuccess && !isVerifying && (
            <div className='space-y-5 pt-2'>
              {resendSuccessMsg && (
                <div
                  className={`p-3.5 rounded-xl border text-xs font-medium ${
                    isDark
                      ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  }`}
                >
                  {resendSuccessMsg}
                </div>
              )}

              <div
                className={`p-4 rounded-xl border text-xs leading-relaxed ${
                  isDark
                    ? 'bg-[#1F2937]/50 border-slate-800 text-slate-300'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <div className='flex items-center gap-2 font-semibold mb-1 text-slate-800 dark:text-slate-200'>
                  <Clock className='w-4 h-4 text-amber-500' />
                  <span>Ketentuan Token Verifikasi:</span>
                </div>
                Token verifikasi aktif selama <strong>24 jam</strong>. Anda dapat meminta pengiriman ulang dengan interval <strong>60 detik</strong>.
              </div>

              <form onSubmit={handleResend} className='space-y-3.5'>
                <div>
                  <label
                    htmlFor='resendEmail'
                    className={`block text-xs font-medium mb-1.5 ${
                      isDark ? 'text-slate-300' : 'text-[#334155]'
                    }`}
                  >
                    Kirim Ulang ke Email:
                  </label>
                  <input
                    id='resendEmail'
                    type='email'
                    required
                    placeholder='nama@email.com'
                    value={resendEmail}
                    onChange={e => setResendEmail(e.target.value)}
                    className={`w-full h-11 px-3.5 text-sm rounded-xl outline-none border transition-all ${
                      isDark
                        ? 'bg-[#0B0F19] border-[#1F2937] text-white placeholder:text-slate-500 focus:border-[#3B82F6]'
                        : 'bg-white border-[#DCE3EF] text-[#1E293B] placeholder:text-[#94A3B8] focus:border-[#2563EB]'
                    }`}
                  />
                </div>

                <button
                  type='submit'
                  disabled={isResending || cooldown > 0}
                  className={`w-full h-11 flex items-center justify-center gap-2 font-medium text-sm rounded-xl transition-all ${
                    cooldown > 0
                      ? 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400 cursor-not-allowed'
                      : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-md'
                  }`}
                >
                  {isResending ? (
                    <RefreshCw className='w-4 h-4 animate-spin' />
                  ) : cooldown > 0 ? (
                    <>
                      <Clock className='w-4 h-4' />
                      <span>Kirim Ulang ({cooldown}s)</span>
                    </>
                  ) : (
                    <>
                      <Mail className='w-4 h-4' />
                      <span>Kirim Ulang Email Verifikasi</span>
                    </>
                  )}
                </button>
              </form>

              <div className='pt-2 text-center'>
                <Link
                  href='/login'
                  className={`text-xs font-medium hover:underline ${
                    isDark ? 'text-blue-400' : 'text-[#2563EB]'
                  }`}
                >
                  Sudah verifikasi? Kembali ke Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer copyright */}
      <div className='w-full py-6 text-center text-xs text-slate-400'>
        © {new Date().getFullYear()} Growvia — AI-Powered Career Platform.
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className='min-h-screen flex items-center justify-center'>Memuat...</div>}>
      <VerifyEmailContent />
    </Suspense>
  )
}
