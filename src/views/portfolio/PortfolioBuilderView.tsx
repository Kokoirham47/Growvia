'use client'

import React, { useState, useEffect, useCallback } from 'react'

import {
  Sparkles,
  CheckCircle2,
  Loader2,
  Eye,
  Settings
} from 'lucide-react'

import type {
  PublicPortfolioData,
  PortfolioTheme,
  PortfolioSectionVisibility,
  PortfolioPreviewResponse
} from '@/types/portfolio'
import PortfolioEditorPanel from './PortfolioEditorPanel'
import PortfolioLivePreviewFrame from './PortfolioLivePreviewFrame'
import SharePortfolioModal from './SharePortfolioModal'

export default function PortfolioBuilderView() {
  const [data, setData] = useState<PublicPortfolioData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Mobile Tab Switcher ('editor' | 'preview')
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor')

  // Controlled states for builder settings
  const [isPublished, setIsPublished] = useState<boolean>(false)
  const [slug, setSlug] = useState<string>('')
  const [headline, setHeadline] = useState<string>('')
  const [bio, setBio] = useState<string>('')
  const [selectedTheme, setSelectedTheme] = useState<PortfolioTheme>('royal-blue')

  const [sections, setSections] = useState<PortfolioSectionVisibility>({
    work: true,
    projects: true,
    organisations: true,
    competitions: true,
    skills: true,
    education: true
  })

  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false)

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev))
    }, 3500)
  }, [])

  // 1. Fetch initial portfolio preview data
  const fetchPreviewData = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/portfolio/preview')
      const json: PortfolioPreviewResponse = await res.json()

      if (!res.ok || !json.success || !json.data) {
        throw new Error(json.message || 'Gagal memuat data portofolio')
      }

      const pData = json.data

      setData(pData)

      // Initialize form fields
      setIsPublished(Boolean(pData.profile.portfolioPublished))
      setSlug(pData.profile.portfolioSlug || '')
      setHeadline(pData.profile.headline || '')
      setBio(pData.profile.bio || '')
      if (pData.theme) setSelectedTheme(pData.theme)
      if (pData.sections) setSections(pData.sections)
    } catch (err: any) {
      console.error('Error fetching portfolio preview:', err)
      showToast('❌ Gagal memuat data portofolio. Coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    fetchPreviewData()
  }, [fetchPreviewData])

  // 2. Toggle Section Visibility
  const handleSectionToggle = (key: keyof PortfolioSectionVisibility) => {
    setSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  // Handle direct avatar upload change
  const handleAvatarChange = (newUrl: string | null) => {
    setData(prev => {
      if (!prev) return prev

      return {
        ...prev,
        user: {
          ...prev.user,
          avatarUrl: newUrl
        }
      }
    })
    showToast(newUrl ? 'Foto profil berhasil diperbarui!' : 'Foto profil berhasil dihapus.')
  }

  // 3. Save Settings to Backend
  const handleSave = async (overridePublish?: boolean) => {
    try {
      setIsSaving(true)
      const targetPublish = overridePublish !== undefined ? overridePublish : isPublished

      const res = await fetch('/api/portfolio/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          portfolioPublished: targetPublish,
          portfolioSlug: slug,
          headline,
          bio,
          theme: selectedTheme,
          sections
        })
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Gagal menyimpan pengaturan')
      }

      if (overridePublish !== undefined) {
        setIsPublished(overridePublish)
      }

      // Update local state copy
      if (data) {
        setData({
          ...data,
          profile: {
            ...data.profile,
            portfolioPublished: targetPublish,
            portfolioSlug: json.data?.portfolioSlug || slug,
            headline,
            bio
          }
        })
      }

      showToast(json.message || 'Pengaturan portofolio berhasil disimpan!')
    } catch (err: any) {
      console.error('Error saving portfolio:', err)
      showToast(`❌ ${err.message || 'Terjadi kesalahan saat menyimpan pengaturan.'}`)
    } finally {
      setIsSaving(false)
    }
  }

  // Handler for toggle publish switch
  const handleTogglePublish = (val: boolean) => {
    setIsPublished(val)
    handleSave(val)
  }

  if (isLoading || !data) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[500px] w-full gap-3 font-["Poppins",sans-serif]'>
        <div className='w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center animate-spin'>
          <Loader2 className='w-6 h-6' />
        </div>
        <span className='text-sm font-semibold text-slate-500 dark:text-slate-400'>
          Mengompilasi data portofolio digital berbasis bukti...
        </span>
      </div>
    )
  }

  // Live preview data object
  const previewData: PublicPortfolioData = {
    ...data,
    profile: {
      ...data.profile,
      headline,
      bio,
      portfolioSlug: slug,
      portfolioPublished: isPublished
    }
  }

  return (
    <div
      style={{ fontFamily: "'Poppins', sans-serif" }}
      className='flex flex-col gap-6 w-full max-w-[1500px] mx-auto pb-16 font-["Poppins",sans-serif]'
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className='fixed bottom-6 right-6 z-[9999] animate-in fade-in slide-in-from-bottom-4 duration-300'>
          <div className='flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700 text-xs sm:text-sm font-medium'>
            <div className='w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0'>
              <CheckCircle2 className='w-3.5 h-3.5 stroke-[2.8]' />
            </div>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1'>
        <div className='flex flex-col gap-1.5'>
          <div className='flex flex-wrap items-center gap-2'>
            <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/70 dark:border-blue-800/60 shadow-2xs'>
              <Sparkles className='w-3.5 h-3.5 text-blue-600 dark:text-blue-400' />
              <span>Auto-populated Portfolio Engine</span>
            </div>

            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                isPublished
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-emerald-500' : 'bg-amber-500'}`}
              />
              <span>{isPublished ? 'Publik Aktif' : 'Draf Privat'}</span>
            </div>
          </div>

          <h1 className='text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight'>
            Portofolio AI & Bukti Nyata
          </h1>

          <p className='text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed'>
            Portofolio kamu terisi secara otomatis dari profil, rekam jejak pengalaman, dan bukti keahlian yang terverifikasi di Growvia.
          </p>
        </div>

        {/* Mobile View Switcher Tab (only visible on mobile) */}
        <div className='flex lg:hidden items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 self-stretch sm:self-auto'>
          <button
            type='button'
            onClick={() => setMobileTab('editor')}
            className={`flex-1 inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
              mobileTab === 'editor'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500'
            }`}
          >
            <Settings className='w-4 h-4' />
            <span>Pengaturan</span>
          </button>

          <button
            type='button'
            onClick={() => setMobileTab('preview')}
            className={`flex-1 inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
              mobileTab === 'preview'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500'
            }`}
          >
            <Eye className='w-4 h-4' />
            <span>Live Preview</span>
          </button>
        </div>
      </div>

      {/* Split-View Grid Container */}
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 items-start'>
        {/* Left Column: Editor Controls (5 cols) */}
        <div
          className={`lg:col-span-5 w-full ${
            mobileTab === 'preview' ? 'hidden lg:block' : 'block'
          }`}
        >
          <PortfolioEditorPanel
            isPublished={isPublished}
            onTogglePublish={handleTogglePublish}
            slug={slug}
            onSlugChange={setSlug}
            avatarUrl={data.user.avatarUrl}
            userName={data.user.name}
            onAvatarChange={handleAvatarChange}
            headline={headline}
            onHeadlineChange={setHeadline}
            bio={bio}
            onBioChange={setBio}
            selectedTheme={selectedTheme}
            onThemeChange={setSelectedTheme}
            sections={sections}
            onSectionToggle={handleSectionToggle}
            onSave={() => handleSave()}
            isSaving={isSaving}
            onOpenShare={() => setIsShareModalOpen(true)}
          />
        </div>

        {/* Right Column: Live Preview Interactive Frame (7 cols) */}
        <div
          className={`lg:col-span-7 w-full sticky top-24 h-[calc(100vh-140px)] min-h-[650px] ${
            mobileTab === 'editor' ? 'hidden lg:block' : 'block'
          }`}
        >
          <PortfolioLivePreviewFrame
            data={previewData}
            theme={selectedTheme}
            sections={sections}
            slug={slug}
          />
        </div>
      </div>

      {/* Share Modal */}
      <SharePortfolioModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        slug={slug}
        userName={data.user.name}
      />
    </div>
  )
}
