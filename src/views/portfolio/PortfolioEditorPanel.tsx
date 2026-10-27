'use client'

import React, { useRef, useState } from 'react'

import Image from 'next/image'

import {
  Globe,
  Lock,
  ExternalLink,
  Share2,
  Save,
  Palette,
  Eye,
  Sparkles,
  Camera,
  UploadCloud,
  Trash2,
  RefreshCw
} from 'lucide-react'

import { useAuth } from '@/contexts/AuthContext'
import type {
  PortfolioTheme,
  PortfolioSectionVisibility
} from '@/types/portfolio'

interface PortfolioEditorPanelProps {
  isPublished: boolean
  onTogglePublish: (val: boolean) => void
  slug: string
  onSlugChange: (val: string) => void
  avatarUrl?: string | null
  userName?: string
  onAvatarChange?: (val: string | null) => void
  headline: string
  onHeadlineChange: (val: string) => void
  bio: string
  onBioChange: (val: string) => void
  selectedTheme: PortfolioTheme
  onThemeChange: (theme: PortfolioTheme) => void
  sections: PortfolioSectionVisibility
  onSectionToggle: (key: keyof PortfolioSectionVisibility) => void
  onSave: () => void
  isSaving: boolean
  onOpenShare: () => void
}

export default function PortfolioEditorPanel({
  isPublished,
  onTogglePublish,
  slug,
  onSlugChange,
  avatarUrl,
  userName,
  onAvatarChange,
  headline,
  onHeadlineChange,
  bio,
  onBioChange,
  selectedTheme,
  onThemeChange,
  sections,
  onSectionToggle,
  onSave,
  isSaving,
  onOpenShare
}: PortfolioEditorPanelProps) {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://growvia.app'
  const publicUrl = `${origin}/u/${slug}`

  const { refreshUser } = useAuth()
  const avatarFileInputRef = useRef<HTMLInputElement>(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [avatarError, setAvatarError] = useState<string | null>(null)

  const handleUploadAvatarFile = async (file: File) => {
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']

    if (!validMimes.includes(file.type)) {
      setAvatarError('Format tidak didukung. Gunakan JPG, PNG, atau WebP.')

      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setAvatarError('Ukuran file maksimal 5MB.')

      return
    }

    try {
      setIsUploadingAvatar(true)
      setAvatarError(null)

      const formData = new FormData()

      formData.append('file', file)

      const res = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Gagal mengunggah foto profil')
      }

      onAvatarChange?.(json.data.avatarUrl)
      await refreshUser()
    } catch (err: any) {
      setAvatarError(err.message || 'Gagal mengunggah foto')
    } finally {
      setIsUploadingAvatar(false)

      if (avatarFileInputRef.current) {
        avatarFileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveAvatarPhoto = async () => {
    try {
      setIsUploadingAvatar(true)
      setAvatarError(null)

      const res = await fetch('/api/profile/avatar', {
        method: 'DELETE'
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Gagal menghapus foto profil')
      }

      onAvatarChange?.(null)
      await refreshUser()
    } catch (err: any) {
      setAvatarError(err.message || 'Gagal menghapus foto')
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  const initials = (userName || 'G')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()

  const themes: { key: PortfolioTheme; label: string; bg: string; dot: string }[] = [
    { key: 'royal-blue', label: 'Royal Blue', bg: 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30', dot: 'bg-blue-600' },
    { key: 'sleek-slate', label: 'Sleek Slate', bg: 'border-slate-800 bg-slate-50 dark:bg-slate-800/40', dot: 'bg-slate-800 dark:bg-slate-200' },
    { key: 'emerald-modern', label: 'Emerald Modern', bg: 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30', dot: 'bg-emerald-600' }
  ]

  return (
    <div className='flex flex-col gap-5 w-full'>
      {/* 1. Status Publikasi Card */}
      <div className='p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4'>
        <div className='flex items-center justify-between gap-3'>
          <div className='flex items-center gap-2.5'>
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
                <span className='text-sm font-bold text-slate-900 dark:text-white leading-tight'>
                  {isPublished ? 'Portofolio Publik Aktif' : 'Status: Draf Privat'}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isPublished
                      ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
                      : 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300'
                  }`}
                >
                  {isPublished ? 'Live' : 'Privat'}
                </span>
              </div>
              <span className='text-xs text-slate-500 dark:text-slate-400 mt-0.5'>
                {isPublished
                  ? 'Recruiter dapat mengakses tautan portofolio kamu.'
                  : 'Hanya kamu yang dapat melihat pratinjau ini.'}
              </span>
            </div>
          </div>

          {/* Toggle Switch */}
          <label className='relative inline-flex items-center cursor-pointer shrink-0'>
            <input
              type='checkbox'
              checked={isPublished}
              onChange={e => onTogglePublish(e.target.checked)}
              className='sr-only peer'
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>

        {/* Slug Customizer Input */}
        <div className='space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80'>
          <label className='text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between'>
            <span>Kustomisasi Tautan URL Publik</span>
            <span className='text-[10px] font-normal text-slate-400'>
              Hanya huruf kecil, angka, dan tanda hubung
            </span>
          </label>

          <div className='flex items-center rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-500 transition-all'>
            <span className='px-3 py-2 text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 select-none'>
              /u/
            </span>
            <input
              type='text'
              value={slug}
              onChange={e => onSlugChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              placeholder='nama-kamu'
              className='flex-1 px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white bg-transparent focus:outline-none font-mono'
            />
          </div>

          <div className='flex items-center justify-between pt-1 text-[11px] text-slate-500 dark:text-slate-400'>
            <span className='truncate font-mono text-[10px] sm:text-[11px]'>{publicUrl}</span>
            {isPublished && (
              <a
                href={`/u/${slug}`}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 hover:underline shrink-0'
              >
                <span>Buka</span>
                <ExternalLink className='w-3 h-3' />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* 2. Foto Profil Portofolio Card */}
      <div className='p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3.5'>
        <div className='flex items-center gap-2'>
          <Camera className='w-4 h-4 text-blue-600 dark:text-blue-400' />
          <h3 className='text-sm font-bold text-slate-900 dark:text-white'>
            Foto Profil Portofolio
          </h3>
        </div>

        <input
          ref={avatarFileInputRef}
          type='file'
          accept='image/jpeg,image/png,image/webp,image/jpg'
          className='hidden'
          onChange={e => {
            if (e.target.files && e.target.files[0]) {
              handleUploadAvatarFile(e.target.files[0])
            }
          }}
        />

        <div className='flex items-center gap-4'>
          {/* Avatar Preview */}
          <div
            onClick={() => avatarFileInputRef.current?.click()}
            className='relative shrink-0 group cursor-pointer'
            title='Klik untuk memilih foto dari perangkat'
          >
            {avatarUrl ? (
              <div className='w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-blue-500/30 shadow-md relative bg-slate-100 dark:bg-slate-800'>
                <Image
                  src={avatarUrl}
                  alt={userName || 'Avatar'}
                  fill
                  unoptimized
                  className='object-cover group-hover:scale-105 transition-transform'
                />
                <div className='absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity'>
                  <Camera className='w-4 h-4' />
                </div>
              </div>
            ) : (
              <div className='w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 text-white font-extrabold text-lg flex items-center justify-center ring-2 ring-blue-500/30 shadow-md relative overflow-hidden group'>
                <span>{initials}</span>
                <div className='absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity'>
                  <Camera className='w-4 h-4' />
                </div>
              </div>
            )}

            {isUploadingAvatar ? (
              <span className='absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs'>
                <RefreshCw className='w-3 h-3 animate-spin' />
              </span>
            ) : (
              <span
                className='absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-600 group-hover:bg-blue-700 text-white border border-white dark:border-slate-900 flex items-center justify-center shadow-xs transition-colors'
                title='Ganti foto'
              >
                <Camera className='w-2.5 h-2.5' />
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className='flex flex-col gap-1.5 flex-1 min-w-0'>
            <div className='flex flex-wrap items-center gap-2'>
              <button
                type='button'
                disabled={isUploadingAvatar}
                onClick={() => avatarFileInputRef.current?.click()}
                className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs disabled:opacity-60'
              >
                <UploadCloud className='w-3.5 h-3.5' />
                <span>Pilih Foto dari Perangkat</span>
              </button>

              {avatarUrl && (
                <button
                  type='button'
                  disabled={isUploadingAvatar}
                  onClick={handleRemoveAvatarPhoto}
                  className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 text-slate-600 hover:text-rose-600 dark:text-slate-300 dark:hover:text-rose-400 text-xs font-semibold border border-slate-200/80 dark:border-slate-700 transition-colors cursor-pointer disabled:opacity-60'
                >
                  <Trash2 className='w-3.5 h-3.5' />
                  <span>Hapus</span>
                </button>
              )}
            </div>

            <span className='text-[10px] text-slate-400 dark:text-slate-500'>
              Unggah langsung dari file perangkat (JPG, PNG, WebP maks. 5MB)
            </span>

            {avatarError && (
              <span className='text-[11px] text-rose-500 font-medium'>
                {avatarError}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 3. Headline & Bio Card */}
      <div className='p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4'>
        <div className='flex items-center gap-2'>
          <Sparkles className='w-4 h-4 text-blue-600 dark:text-blue-400' />
          <h3 className='text-sm font-bold text-slate-900 dark:text-white'>
            Headline & Ringkasan Profil
          </h3>
        </div>

        <div className='space-y-1.5'>
          <label className='text-xs font-semibold text-slate-700 dark:text-slate-300'>
            Headline Profesional
          </label>
          <input
            type='text'
            value={headline}
            onChange={e => onHeadlineChange(e.target.value)}
            placeholder='Contoh: Frontend Web Engineer & Digital Product Enthusiast'
            className='w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all'
          />
        </div>

        <div className='space-y-1.5'>
          <label className='text-xs font-semibold text-slate-700 dark:text-slate-300'>
            Bio / Ringkasan Diri Singkat
          </label>
          <textarea
            rows={3}
            value={bio}
            onChange={e => onBioChange(e.target.value)}
            placeholder='Tuliskan narasi singkat mengenai keahlian, minat karier, dan pencapaian kamu...'
            className='w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all resize-none'
          />
        </div>
      </div>

      {/* 3. Pilihan Tema Visual */}
      <div className='p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3.5'>
        <div className='flex items-center gap-2'>
          <Palette className='w-4 h-4 text-blue-600 dark:text-blue-400' />
          <h3 className='text-sm font-bold text-slate-900 dark:text-white'>
            Pilihan Tema Visual Portofolio
          </h3>
        </div>

        <div className='grid grid-cols-3 gap-2.5'>
          {themes.map(t => {
            const isSelected = selectedTheme === t.key

            
return (
              <button
                key={t.key}
                type='button'
                onClick={() => onThemeChange(t.key)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? `${t.bg} shadow-xs ring-2 ring-blue-500/40`
                    : 'border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className={`w-5 h-5 rounded-full ${t.dot} mb-1.5 shadow-xs`} />
                <span className='text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight'>
                  {t.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 4. Visibilitas Seksi Portofolio */}
      <div className='p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3.5'>
        <div className='flex items-center gap-2'>
          <Eye className='w-4 h-4 text-blue-600 dark:text-blue-400' />
          <h3 className='text-sm font-bold text-slate-900 dark:text-white'>
            Visibilitas Seksi Portofolio
          </h3>
        </div>

        <div className='space-y-2.5'>
          {[
            { key: 'skills' as const, label: 'Keahlian Berbasis Bukti (Skills & Evidence)' },
            { key: 'work' as const, label: 'Pengalaman Magang & Kerja' },
            { key: 'projects' as const, label: 'Proyek Portofolio Mandiri' },
            { key: 'organisations' as const, label: 'Rekam Jejak Organisasi' },
            { key: 'competitions' as const, label: 'Prestasi & Kompetisi Hackathon' }
          ].map(sec => (
            <label
              key={sec.key}
              className='flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors'
            >
              <span className='text-xs font-semibold text-slate-700 dark:text-slate-300'>
                {sec.label}
              </span>
              <input
                type='checkbox'
                checked={sections[sec.key]}
                onChange={() => onSectionToggle(sec.key)}
                className='w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer'
              />
            </label>
          ))}
        </div>
      </div>

      {/* 5. Action Buttons Footer */}
      <div className='flex items-center gap-3 pt-1'>
        <button
          type='button'
          onClick={onSave}
          disabled={isSaving}
          className='flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50'
        >
          <Save className='w-4 h-4' />
          <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
        </button>

        <button
          type='button'
          onClick={onOpenShare}
          className='inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm transition-colors cursor-pointer shrink-0'
        >
          <Share2 className='w-4 h-4' />
          <span>Bagikan</span>
        </button>
      </div>
    </div>
  )
}
