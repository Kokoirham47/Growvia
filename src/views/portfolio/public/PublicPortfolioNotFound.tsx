'use client'

import React from 'react'

import Link from 'next/link'
import Image from 'next/image'

import { Lock, SearchX, ArrowLeft, Sparkles } from 'lucide-react'

interface PublicPortfolioNotFoundProps {
  isPrivate?: boolean
  userName?: string
  slug?: string
}

export default function PublicPortfolioNotFound({
  isPrivate = false,
  userName,
  slug
}: PublicPortfolioNotFoundProps) {
  return (
    <div className='min-h-screen w-full flex flex-col justify-between bg-slate-50 dark:bg-slate-950 font-["Poppins",sans-serif]'>
      {/* Top Bar */}
      <header className='p-6 flex items-center justify-between max-w-5xl mx-auto w-full'>
        <Link href='/' className='flex items-center gap-2.5'>
          <div className='relative w-8 h-8 rounded-xl overflow-hidden'>
            <Image
              src='/images/logo-growvia.png'
              alt='Growvia'
              fill
              className='object-contain'
              sizes='32px'
            />
          </div>
          <span className='font-extrabold text-base text-slate-900 dark:text-white'>
            Growvia<span className='text-blue-600'>.</span>
          </span>
        </Link>

        <Link
          href='/login'
          className='text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline'
        >
          Masuk ke Dashboard
        </Link>
      </header>

      {/* Main Card */}
      <main className='flex-1 flex items-center justify-center p-4'>
        <div className='max-w-md w-full p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl text-center space-y-5 animate-in zoom-in-95 duration-200'>
          <div className='w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto shadow-xs'>
            {isPrivate ? <Lock className='w-8 h-8' /> : <SearchX className='w-8 h-8' />}
          </div>

          <div className='space-y-1.5'>
            <h1 className='text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight'>
              {isPrivate
                ? `Portofolio ${userName ? userName + ' ' : ''}Sedang Privat`
                : 'Portofolio Tidak Ditemukan'}
            </h1>
            <p className='text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed'>
              {isPrivate
                ? 'Pemilik portofolio telah mengatur halaman ini dalam mode privat atau draf sehingga tidak dapat diakses untuk publik saat ini.'
                : `Halaman dengan tautan "/u/${slug || '...'}" tidak terdaftar di sistem Growvia. Pastikan penulisan URL sudah benar.`}
            </p>
          </div>

          <div className='pt-2 flex flex-col gap-2.5'>
            <Link
              href='/'
              className='inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors'
            >
              <ArrowLeft className='w-4 h-4' />
              <span>Kembali ke Beranda Growvia</span>
            </Link>

            <Link
              href='/register'
              className='inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
            >
              <Sparkles className='w-3.5 h-3.5 text-blue-600' />
              <span>Buat Portofolio Kamu Sendiri di Growvia</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className='py-6 text-center text-xs text-slate-400'>
        © 2026 Growvia. AI-Powered Career Platform for Talents.
      </footer>
    </div>
  )
}
