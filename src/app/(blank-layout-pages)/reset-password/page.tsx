'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sun,
  Moon,
  Check
} from 'lucide-react'
import { useSettings } from '@core/hooks/useSettings'

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

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

  // Form states
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Password criteria
  const hasMinLength = newPassword.length >= 8
  const hasUppercase = /[A-Z]/.test(newPassword)
  const hasNumber = /[0-9]/.test(newPassword)
  const isMatch = newPassword.length > 0 && newPassword === confirmPassword
  const isFormValid = hasMinLength && hasUppercase && hasNumber && isMatch

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) {
      setErrorMessage('Token reset password tidak ditemukan pada tautan.')
      return
    }

    if (!isFormValid) {
      setErrorMessage('Harap penuhi semua kriteria password yang ditentukan.')
      return
    }

    setIsLoading(true)
    setErrorMessage(null)

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setIsSuccess(true)
        setTimeout(() => {
          router.push('/login?resetSuccess=true')
        }, 2500)
      } else {
        setErrorMessage(data.message || 'Gagal mengatur ulang password. Tautan mungkin telah kedaluwarsa.')
      }
    } catch {
      setErrorMessage('Terjadi gangguan jaringan saat memproses reset password.')
    } finally {
      setIsLoading(false)
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
          <div className='text-center mb-6'>
            <div
              className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-3.5 ${
                isSuccess
                  ? 'bg-emerald-500/10 text-emerald-500'
                  : isDark
                  ? 'bg-blue-950/60 text-blue-400'
                  : 'bg-blue-50 text-[#2563EB]'
              }`}
            >
              {isSuccess ? <CheckCircle2 className='w-7 h-7' /> : <KeyRound className='w-7 h-7' />}
            </div>

            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
              {isSuccess ? 'Password Berhasil Diubah!' : 'Atur Ulang Kata Sandi'}
            </h1>
            <p className={`text-sm mt-1.5 ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
              {isSuccess
                ? 'Silakan masuk menggunakan password baru Anda. Mengalihkan...'
                : 'Buat password baru yang aman untuk akun Growvia Anda.'}
            </p>
          </div>

          {errorMessage && (
            <div className='p-3.5 mb-4 rounded-xl border text-xs font-medium bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300 flex items-center gap-2'>
              <AlertCircle className='w-4 h-4 shrink-0' />
              <span>{errorMessage}</span>
            </div>
          )}

          {isSuccess ? (
            <div className='space-y-4 pt-2'>
              <Link
                href='/login'
                className='w-full h-11 flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium rounded-xl transition-colors text-sm shadow-md'
              >
                <span>Masuk Sekarang</span>
                <ArrowRight className='w-4 h-4' />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className='space-y-4'>
              {/* Password Baru */}
              <div>
                <label
                  htmlFor='newPassword'
                  className={`block text-xs font-medium mb-1.5 ${
                    isDark ? 'text-slate-300' : 'text-[#334155]'
                  }`}
                >
                  Password Baru
                </label>
                <div className='relative'>
                  <input
                    id='newPassword'
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder='Minimal 8 karakter'
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className={`w-full h-[44px] pl-3.5 pr-11 text-[14px] rounded-[12px] outline-none border transition-all ${
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

              {/* Konfirmasi Password */}
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
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder='Ulangi password baru'
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className={`w-full h-[44px] pl-3.5 pr-11 text-[14px] rounded-[12px] outline-none border transition-all ${
                      isDark
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
              </div>

              {/* Password Checklist Criteria */}
              <div
                className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                  isDark ? 'bg-[#0B0F19]/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className={`flex items-center gap-2 ${hasMinLength ? 'text-emerald-500 font-medium' : isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  <Check className={`w-3.5 h-3.5 ${hasMinLength ? 'opacity-100' : 'opacity-40'}`} />
                  <span>Minimal 8 karakter</span>
                </div>
                <div className={`flex items-center gap-2 ${hasUppercase ? 'text-emerald-500 font-medium' : isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  <Check className={`w-3.5 h-3.5 ${hasUppercase ? 'opacity-100' : 'opacity-40'}`} />
                  <span>Minimal 1 huruf kapital (A-Z)</span>
                </div>
                <div className={`flex items-center gap-2 ${hasNumber ? 'text-emerald-500 font-medium' : isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  <Check className={`w-3.5 h-3.5 ${hasNumber ? 'opacity-100' : 'opacity-40'}`} />
                  <span>Minimal 1 angka (0-9)</span>
                </div>
                <div className={`flex items-center gap-2 ${isMatch ? 'text-emerald-500 font-medium' : isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  <Check className={`w-3.5 h-3.5 ${isMatch ? 'opacity-100' : 'opacity-40'}`} />
                  <span>Password konfirmasi cocok</span>
                </div>
              </div>

              <div className='pt-2'>
                <button
                  type='submit'
                  disabled={isLoading || !isFormValid}
                  className='w-full h-[44px] bg-[#2563EB] hover:bg-[#1D4ED8] dark:hover:bg-[#3B82F6] active:bg-[#1E40AF] text-white font-medium text-[14.5px] rounded-[12px] transition-all flex items-center justify-center gap-2 shadow-sm shadow-blue-500/20 disabled:opacity-50 disabled:bg-[#2563EB] disabled:cursor-not-allowed hover:shadow-md hover:shadow-blue-500/30'
                >
                  {isLoading ? 'Memperbarui...' : 'Simpan Password Baru'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className='w-full py-6 text-center text-xs text-slate-400'>
        © {new Date().getFullYear()} Growvia — AI-Powered Career Platform.
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className='min-h-screen flex items-center justify-center'>Memuat...</div>}>
      <ResetPasswordContent />
    </Suspense>
  )
}
