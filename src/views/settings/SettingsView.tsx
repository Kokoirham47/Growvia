'use client'

import React, { useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import {
  Settings,
  Shield,
  KeyRound,
  Eye,
  EyeOff,
  Globe,
  Lock,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  X
} from 'lucide-react'

import { useAuth } from '@/contexts/AuthContext'

export default function SettingsView() {
  const router = useRouter()
  const { profile, refreshUser, logout } = useAuth()

  // Tab State
  const [activeTab, setActiveTab] = useState<'security' | 'privacy' | 'danger'>('security')

  // Password Form States
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  // Privacy States
  const [isPublished, setIsPublished] = useState(Boolean(profile?.portfolioPublished))
  const [isUpdatingPrivacy, setIsUpdatingPrivacy] = useState(false)

  // Delete Account Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteConfirmPhrase, setDeleteConfirmPhrase] = useState('')
  const [deletePassword, setDeletePassword] = useState('')
  const [showDeletePassword, setShowDeletePassword] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)

  // Feedback Notification Toast
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev))
    }, 4500)
  }

  // 1. Handle Update Password
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      showToast('error', 'Konfirmasi password baru tidak cocok.')
      
return
    }

    if (newPassword.length < 8) {
      showToast('error', 'Password baru minimal 8 karakter.')
      
return
    }

    const hasUppercase = /[A-Z]/.test(newPassword)
    const hasNumber = /[0-9]/.test(newPassword)

    if (!hasUppercase || !hasNumber) {
      showToast('error', 'Password baru harus memiliki minimal 1 huruf kapital dan 1 angka.')
      
return
    }

    try {
      setIsUpdatingPassword(true)

      const res = await fetch('/api/account/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword
        })
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Gagal mengubah password')
      }

      showToast('success', 'Kata sandi Anda berhasil diperbarui!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      console.error('Password update error:', err)
      showToast('error', err.message || 'Terjadi kesalahan saat memperbarui kata sandi.')
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  // 2. Handle Toggle Portfolio Privacy
  const handleTogglePrivacy = async () => {
    const nextVal = !isPublished

    try {
      setIsUpdatingPrivacy(true)

      const res = await fetch('/api/account/privacy', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portfolioPublished: nextVal })
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Gagal mengubah privasi')
      }

      setIsPublished(nextVal)
      await refreshUser()
      showToast('success', json.message || 'Pengaturan privasi portofolio berhasil diperbarui.')
    } catch (err: any) {
      console.error('Privacy update error:', err)
      showToast('error', err.message || 'Terjadi kesalahan saat mengubah privasi.')
    } finally {
      setIsUpdatingPrivacy(false)
    }
  }

  // 3. Handle Soft Delete Account
  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault()

    if (deleteConfirmPhrase !== 'HAPUS AKUN SAYA') {
      showToast('error', 'Kalimat konfirmasi belum sesuai. Ketik "HAPUS AKUN SAYA".')
      
return
    }

    if (!deletePassword) {
      showToast('error', 'Masukkan kata sandi Anda untuk konfirmasi.')
      
return
    }

    try {
      setIsDeletingAccount(true)

      const res = await fetch('/api/account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          confirmPhrase: deleteConfirmPhrase,
          password: deletePassword
        })
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Gagal menonaktifkan akun')
      }

      showToast('success', 'Akun berhasil dinonaktifkan. Mengalihkan ke halaman awal...')
      setTimeout(() => {
        logout()
        router.push('/login')
      }, 1500)
    } catch (err: any) {
      console.error('Account deletion error:', err)
      showToast('error', err.message || 'Terjadi kesalahan saat menonaktifkan akun.')
    } finally {
      setIsDeletingAccount(false)
    }
  }

  return (
    <div className='flex flex-col gap-6 max-w-4xl mx-auto pb-12 w-full'>
      {/* Toast Alert */}
      {toast && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between gap-3 shadow-lg border animate-in fade-in slide-in-from-top-3 duration-200 ${
            toast.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
              : 'bg-rose-50 dark:bg-rose-950/80 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
          }`}
        >
          <div className='flex items-center gap-2.5 text-xs sm:text-sm font-semibold'>
            {toast.type === 'success' ? (
              <CheckCircle2 className='w-4 h-4 text-emerald-600 shrink-0' />
            ) : (
              <AlertCircle className='w-4 h-4 text-rose-600 shrink-0' />
            )}
            <span>{toast.message}</span>
          </div>
          <button
            type='button'
            onClick={() => setToast(null)}
            className='text-xs font-bold opacity-70 hover:opacity-100 cursor-pointer'
          >
            ✕
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className='flex flex-col gap-1 border-b border-slate-200/80 dark:border-slate-800 pb-5'>
        <div className='flex items-center gap-2'>
          <div className='w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-900'>
            <Settings className='w-4 h-4' />
          </div>
          <h1 className='text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight'>
            Pengaturan Akun & Keamanan
          </h1>
        </div>
        <p className='text-xs sm:text-sm text-slate-500 dark:text-slate-400'>
          Kelola kredensial kata sandi, pengaturan visibilitas privasi portofolio, dan kontrol keamanan akun Anda.
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className='flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-2 overflow-x-auto no-scrollbar'>
        <button
          type='button'
          onClick={() => setActiveTab('security')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'security'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
          }`}
        >
          <Shield className='w-4 h-4' />
          <span>Keamanan & Password</span>
        </button>

        <button
          type='button'
          onClick={() => setActiveTab('privacy')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'privacy'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
          }`}
        >
          <Globe className='w-4 h-4' />
          <span>Privasi Portofolio</span>
        </button>

        <button
          type='button'
          onClick={() => setActiveTab('danger')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'danger'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 border border-rose-200/80 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40'
          }`}
        >
          <AlertTriangle className='w-4 h-4' />
          <span>Hapus Akun</span>
        </button>
      </div>

      {/* Tab 1: Security & Password */}
      {activeTab === 'security' && (
        <div className='p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6 animate-in fade-in duration-150'>
          <div className='flex flex-col gap-1 border-b border-slate-100 dark:border-slate-800 pb-4'>
            <div className='flex items-center gap-2'>
              <KeyRound className='w-4 h-4 text-indigo-600 dark:text-indigo-400' />
              <h2 className='text-sm sm:text-base font-bold text-slate-900 dark:text-white'>
                Perbarui Kata Sandi Akun
              </h2>
            </div>
            <p className='text-xs text-slate-500 dark:text-slate-400'>
              Pastikan kata sandi baru Anda unik, sulit ditebak, dan minimal 8 karakter dengan kombinasi huruf besar dan angka.
            </p>
          </div>

          <form onSubmit={handleUpdatePassword} className='flex flex-col gap-4 max-w-lg'>
            {/* Password Saat Ini */}
            <div className='flex flex-col gap-1.5'>
              <label className='text-xs font-bold text-slate-700 dark:text-slate-300'>
                Kata Sandi Saat Ini <span className='text-rose-500'>*</span>
              </label>
              <div className='relative'>
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder='Masukkan kata sandi lama Anda'
                  className='w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 pe-10 transition-all'
                />
                <button
                  type='button'
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className='absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer'
                >
                  {showCurrentPassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                </button>
              </div>
            </div>

            {/* Password Baru */}
            <div className='flex flex-col gap-1.5'>
              <label className='text-xs font-bold text-slate-700 dark:text-slate-300'>
                Kata Sandi Baru <span className='text-rose-500'>*</span>
              </label>
              <div className='relative'>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder='Minimal 8 karakter'
                  className='w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 pe-10 transition-all'
                />
                <button
                  type='button'
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className='absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer'
                >
                  {showNewPassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                </button>
              </div>
              <span className='text-[10px] text-slate-400 dark:text-slate-500'>
                Wajib mengandung minimal 1 huruf besar dan 1 angka.
              </span>
            </div>

            {/* Konfirmasi Password Baru */}
            <div className='flex flex-col gap-1.5'>
              <label className='text-xs font-bold text-slate-700 dark:text-slate-300'>
                Konfirmasi Kata Sandi Baru <span className='text-rose-500'>*</span>
              </label>
              <div className='relative'>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder='Ulangi kata sandi baru'
                  className='w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 pe-10 transition-all'
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer'
                >
                  {showConfirmPassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                </button>
              </div>
            </div>

            <div className='pt-2'>
              <button
                type='submit'
                disabled={isUpdatingPassword}
                className='inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer disabled:opacity-60'
              >
                {isUpdatingPassword ? (
                  <>
                    <RefreshCw className='w-3.5 h-3.5 animate-spin' />
                    <span>Memperbarui...</span>
                  </>
                ) : (
                  <span>Simpan Kata Sandi Baru</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Privacy Settings */}
      {activeTab === 'privacy' && (
        <div className='p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6 animate-in fade-in duration-150'>
          <div className='flex flex-col gap-1 border-b border-slate-100 dark:border-slate-800 pb-4'>
            <div className='flex items-center gap-2'>
              <Globe className='w-4 h-4 text-emerald-600 dark:text-emerald-400' />
              <h2 className='text-sm sm:text-base font-bold text-slate-900 dark:text-white'>
                Kontrol Visibilitas Portofolio Publik
              </h2>
            </div>
            <p className='text-xs text-slate-500 dark:text-slate-400'>
              Atur apakah halaman portofolio digital Anda dapat dilihat oleh publik dan recruiter melalui tautan eksternal.
            </p>
          </div>

          <div className='p-5 rounded-2xl bg-slate-50 dark:bg-slate-850/70 border border-slate-200/80 dark:border-slate-750 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
            <div className='flex items-start gap-3.5'>
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                  isPublished
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                    : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                }`}
              >
                {isPublished ? <Globe className='w-5 h-5' /> : <Lock className='w-5 h-5' />}
              </div>

              <div className='flex flex-col'>
                <div className='flex items-center gap-2'>
                  <span className='text-sm font-bold text-slate-900 dark:text-white'>
                    {isPublished ? 'Portofolio Publik Aktif' : 'Portofolio Bersifat Privat'}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isPublished
                        ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
                        : 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300'
                    }`}
                  >
                    {isPublished ? 'Publik' : 'Privat'}
                  </span>
                </div>
                <p className='text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed max-w-md'>
                  {isPublished
                    ? 'Recruiter dan publik dapat mengakses halaman portofolio Anda secara langsung tanpa perlu login.'
                    : 'Halaman portofolio dinonaktifkan sementara dan mengembalikan status privat.'}
                </p>
              </div>
            </div>

            <button
              type='button'
              disabled={isUpdatingPrivacy}
              onClick={handleTogglePrivacy}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 disabled:opacity-50 ${
                isPublished
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
              }`}
            >
              {isUpdatingPrivacy ? (
                <span className='inline-flex items-center gap-1.5'>
                  <RefreshCw className='w-3 h-3 animate-spin' />
                  <span>Menyimpan...</span>
                </span>
              ) : isPublished ? (
                'Ubah Jadi Privat'
              ) : (
                'Aktifkan Publik'
              )}
            </button>
          </div>

          <div className='flex items-center justify-between p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/60 text-xs text-blue-700 dark:text-blue-300'>
            <span>
              Ingin mengatur seksi apa saja yang tampil atau mengubah slug custom portofolio Anda?
            </span>
            <Link
              href='/portfolio'
              className='inline-flex items-center gap-1 font-bold underline hover:opacity-80 shrink-0 ml-2'
            >
              <span>Buka Editor Portofolio</span>
              <ExternalLink className='w-3 h-3' />
            </Link>
          </div>
        </div>
      )}

      {/* Tab 3: Danger Zone */}
      {activeTab === 'danger' && (
        <div className='p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-rose-200/80 dark:border-rose-900/60 shadow-2xs space-y-6 animate-in fade-in duration-150'>
          <div className='flex flex-col gap-1 border-b border-rose-100 dark:border-rose-950 pb-4'>
            <div className='flex items-center gap-2'>
              <AlertTriangle className='w-4 h-4 text-rose-600 dark:text-rose-400' />
              <h2 className='text-sm sm:text-base font-bold text-rose-900 dark:text-rose-200'>
                Hapus Akun
              </h2>
            </div>
            <p className='text-xs text-slate-500 dark:text-slate-400'>
              Tindakan di bawah ini berdampak serius terhadap data akun, riwayat pengalaman, dan bukti keahlian Anda.
            </p>
          </div>

          <div className='p-4 sm:p-5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
            <div className='flex flex-col gap-1'>
              <h3 className='text-sm font-bold text-rose-800 dark:text-rose-300'>
                Hapus & Nonaktifkan Akun
              </h3>
              <p className='text-xs text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed'>
                Akun Anda akan dinonaktifkan secara langsung.
              </p>
            </div>

            <button
              type='button'
              onClick={() => setIsDeleteModalOpen(true)}
              className='inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer shrink-0'
            >
              <Trash2 className='w-3.5 h-3.5' />
              <span>Hapus Akun Saya</span>
            </button>
          </div>
        </div>
      )}

      {/* Two-step Account Deletion Modal */}
      {isDeleteModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150'>
          <div className='bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl border border-rose-200 dark:border-rose-900 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150'>
            {/* Header */}
            <div className='p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-rose-50/80 dark:bg-rose-950/40'>
              <div className='flex items-center gap-2.5 text-rose-700 dark:text-rose-300'>
                <AlertTriangle className='w-5 h-5 text-rose-600 shrink-0' />
                <h3 className='font-bold text-sm sm:text-base'>Konfirmasi Penghapusan Akun</h3>
              </div>
              <button
                type='button'
                onClick={() => setIsDeleteModalOpen(false)}
                className='text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer'
              >
                <X className='w-5 h-5' />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleDeleteAccount} className='p-5 sm:p-6 flex flex-col gap-4'>
              <p className='text-xs text-slate-600 dark:text-slate-400 leading-relaxed'>
                Tindakan ini tidak dapat dibatalkan. Sesi Anda akan dihanguskan dan akun dinonaktifkan. Silakan selesaikan 2 langkah verifikasi berikut:
              </p>

              {/* Step 1: Confirmation Phrase */}
              <div className='flex flex-col gap-1.5'>
                <label className='text-xs font-bold text-slate-700 dark:text-slate-300'>
                  Langkah 1: Ketik <span className='text-rose-600 font-mono'>HAPUS AKUN SAYA</span>
                </label>
                <input
                  type='text'
                  required
                  value={deleteConfirmPhrase}
                  onChange={e => setDeleteConfirmPhrase(e.target.value)}
                  placeholder='Ketik persis kalimat di atas'
                  className='w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-mono'
                />
              </div>

              {/* Step 2: Account Password */}
              <div className='flex flex-col gap-1.5'>
                <label className='text-xs font-bold text-slate-700 dark:text-slate-300'>
                  Langkah 2: Masukkan Kata Sandi Akun
                </label>
                <div className='relative'>
                  <input
                    type={showDeletePassword ? 'text' : 'password'}
                    required
                    value={deletePassword}
                    onChange={e => setDeletePassword(e.target.value)}
                    placeholder='Kata sandi Anda'
                    className='w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 pe-10'
                  />
                  <button
                    type='button'
                    onClick={() => setShowDeletePassword(!showDeletePassword)}
                    className='absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer'
                  >
                    {showDeletePassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                  </button>
                </div>
              </div>

              {/* Modal Actions */}
              <div className='flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800'>
                <button
                  type='button'
                  onClick={() => setIsDeleteModalOpen(false)}
                  className='px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer'
                >
                  Batal
                </button>
                <button
                  type='submit'
                  disabled={isDeletingAccount || deleteConfirmPhrase !== 'HAPUS AKUN SAYA' || !deletePassword}
                  className='inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-40'
                >
                  {isDeletingAccount ? (
                    <>
                      <RefreshCw className='w-3.5 h-3.5 animate-spin' />
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <span>Ya, Hapus Akun Sekarang</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
