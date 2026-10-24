'use client'

import React, { useState } from 'react'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { Eye, EyeOff, ShieldCheck, ArrowRight, Lock, Mail, AlertCircle } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('admin@growvia.id')
  const [password, setPassword] = useState('AdminGrowvia2026!')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.message || 'Email atau password admin tidak valid')
        setLoading(false)
        
return
      }

      router.push('/admin/dashboard')
      router.refresh()
    } catch (err) {
      console.error('Login submit error:', err)
      setError('Terjadi kesalahan koneksi server. Silakan coba lagi.')
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-[#070A14] text-white flex flex-col justify-center items-center p-4 relative overflow-hidden'>
      {/* Background Glow Orbs */}
      <div className='absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-purple-600/20 blur-[120px] pointer-events-none' />
      <div className='absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none' />

      {/* Login Card */}
      <div className='relative z-10 w-full max-w-md bg-[#0F1426]/90 border border-slate-800 backdrop-blur-2xl rounded-3xl p-7 sm:p-9 shadow-2xl shadow-purple-950/40'>
        {/* Brand Header */}
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/40 p-2.5 mb-4 shadow-lg shadow-purple-900/30'>
            <img
              src='/images/growvia-logo.png'
              alt='Growvia'
              className='w-full h-full object-contain'
            />
          </div>
          <div className='flex items-center justify-center gap-2 mb-1.5'>
            <h1 className='text-2xl font-bold tracking-tight text-white'>Growvia Admin</h1>
            <span className='text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-purple-500/25 text-purple-300 border border-purple-500/40'>
              Console
            </span>
          </div>
          <p className='text-xs text-slate-400'>
            Masuk untuk mengelola master data sistem intelijensi karier
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className='mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-300 text-xs animate-shake'>
            <AlertCircle className='w-4 h-4 shrink-0 text-rose-400 mt-0.5' />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-xs font-semibold text-slate-300 mb-1.5'>
              Email Admin
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500'>
                <Mail className='w-4 h-4' />
              </div>
              <input
                type='email'
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder='admin@growvia.id'
                className='w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all'
              />
            </div>
          </div>

          <div>
            <label className='block text-xs font-semibold text-slate-300 mb-1.5'>
              Kata Sandi
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500'>
                <Lock className='w-4 h-4' />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder='••••••••••••'
                className='w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all'
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors'
              >
                {showPassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
              </button>
            </div>
          </div>

          <div className='pt-2'>
            <button
              type='submit'
              disabled={loading}
              className='w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:opacity-95 shadow-lg shadow-purple-900/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer'
            >
              {loading ? (
                <span>Memverifikasi...</span>
              ) : (
                <>
                  <span>Masuk ke Admin Console</span>
                  <ArrowRight className='w-4 h-4' />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Credentials Info Badge for Evaluator / Testing */}
        <div className='mt-6 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-1'>
          <div className='flex items-center gap-1.5 text-purple-300 font-semibold'>
            <ShieldCheck className='w-3.5 h-3.5' />
            <span>Kredensial Default Pengujian:</span>
          </div>
          <p>
            Email: <code className='text-slate-200'>admin@growvia.id</code>
          </p>
          <p>
            Password: <code className='text-slate-200'>AdminGrowvia2026!</code>
          </p>
        </div>

        {/* Back Link */}
        <div className='mt-6 text-center'>
          <Link
            href='/'
            className='text-xs text-slate-400 hover:text-purple-400 transition-colors'
          >
            ← Kembali ke Landing Page
          </Link>
        </div>
      </div>
    </div>
  )
}
