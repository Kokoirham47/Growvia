'use client'

import React, { useState } from 'react'

import {
  X,
  Copy,
  Check,
  Share2,
  MessageCircle
} from 'lucide-react'

interface SharePortfolioModalProps {
  isOpen: boolean
  onClose: () => void
  slug: string
  userName: string
}

export default function SharePortfolioModal({
  isOpen,
  onClose,
  slug,
  userName
}: SharePortfolioModalProps) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://growvia.app'
  const publicUrl = `${origin}/u/${slug}`

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const shareText = `Halo! Lihat portofolio digital terverifikasi berbasis bukti nyata milik ${userName} di Growvia: ${publicUrl}`
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicUrl)}`

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200'>
      <div className='bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200'>
        {/* Header */}
        <div className='p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between'>
          <div className='flex items-center gap-2.5'>
            <div className='w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-200/60 dark:border-blue-800'>
              <Share2 className='w-4 h-4' />
            </div>
            <div className='flex flex-col'>
              <h3 className='text-base font-bold text-slate-900 dark:text-white'>
                Bagikan Portofolio
              </h3>
              <span className='text-xs text-slate-400'>
                Akses publik siap dilihat oleh recruiter
              </span>
            </div>
          </div>

          <button
            type='button'
            onClick={onClose}
            className='p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Body */}
        <div className='p-5 sm:p-6 space-y-5'>
          {/* URL Copy Bar */}
          <div className='space-y-1.5'>
            <label className='text-xs font-semibold text-slate-700 dark:text-slate-300'>
              Tautan Publik Portofolio
            </label>
            <div className='flex items-center gap-2'>
              <input
                type='text'
                readOnly
                value={publicUrl}
                className='flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none select-all font-mono'
              />
              <button
                type='button'
                onClick={handleCopy}
                className='shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all cursor-pointer'
              >
                {copied ? <Check className='w-4 h-4' /> : <Copy className='w-4 h-4' />}
                <span>{copied ? 'Tersalin!' : 'Salin'}</span>
              </button>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className='space-y-2'>
            <span className='text-xs font-semibold text-slate-700 dark:text-slate-300'>
              Kirim Cepat ke Media Sosial
            </span>
            <div className='grid grid-cols-2 gap-2.5'>
              <a
                href={whatsappUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] dark:text-[#25D366] border border-[#25D366]/30 font-semibold text-xs transition-colors'
              >
                <MessageCircle className='w-4 h-4' />
                <span>WhatsApp</span>
              </a>

              <a
                href={linkedinUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 text-[#0A66C2] dark:text-[#70B5F9] border border-[#0A66C2]/30 font-semibold text-xs transition-colors'
              >
                <svg className='w-4 h-4 fill-current' viewBox='0 0 24 24'>
                  <path d='M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z' />
                </svg>
                <span>LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Recruiter Note */}
          <div className='p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/80 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed'>
            💡 Tautan ini dapat disalin ke dalam surat lamaran (cover letter), resume PDF, maupun bio LinkedIn kamu. Recruiter dapat melihat seluruh bukti pengalaman tanpa perlu registrasi akun.
          </div>
        </div>

        {/* Footer */}
        <div className='p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end'>
          <button
            type='button'
            onClick={onClose}
            className='px-4 py-2 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer'
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  )
}
