'use client'

import React, { useState, useEffect } from 'react'
import {
  X,
  Sparkles,
  AlertCircle,
  Loader2,
  Calendar,
  Building2,
  Briefcase,
  Link as LinkIcon,
  CheckCircle2,
  Users,
  Laptop,
  FolderGit2,
  Trophy,
  Bookmark
} from 'lucide-react'
import {
  ExperienceItem,
  EXPERIENCE_TYPE_CONFIG
} from './experienceUtils'

interface ExperienceFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (savedExp: ExperienceItem, isEdit: boolean) => void
  initialData?: ExperienceItem | null
}

const TYPE_OPTIONS = [
  { value: 'organisation', label: 'Organisasi', icon: Users },
  { value: 'committee', label: 'Kepanitiaan', icon: Calendar },
  { value: 'internship', label: 'Magang', icon: Laptop },
  { value: 'freelance', label: 'Freelance', icon: Briefcase },
  { value: 'project', label: 'Proyek Mandiri', icon: FolderGit2 },
  { value: 'competition', label: 'Kompetisi', icon: Trophy },
  { value: 'other', label: 'Lainnya', icon: Bookmark }
]

export default function ExperienceFormModal({
  isOpen,
  onClose,
  onSuccess,
  initialData
}: ExperienceFormModalProps) {
  const isEdit = Boolean(initialData)

  const [title, setTitle] = useState('')
  const [type, setType] = useState('organisation')
  const [role, setRole] = useState('')
  const [institutionName, setInstitutionName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isOngoing, setIsOngoing] = useState(false)
  const [description, setDescription] = useState('')
  const [proofUrl, setProofUrl] = useState('')

  const [loading, setLoading] = useState(false)
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  // Reset or Populate form on open/change
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title || '')
        setType(initialData.type || 'organisation')
        setRole(initialData.role || '')
        setInstitutionName(initialData.institutionName === '-' ? '' : initialData.institutionName || '')
        
        // Format YYYY-MM-DD
        if (initialData.startDate) {
          const d = new Date(initialData.startDate)
          if (!isNaN(d.getTime())) {
            setStartDate(d.toISOString().split('T')[0])
          }
        } else {
          setStartDate('')
        }

        if (initialData.endDate) {
          const d = new Date(initialData.endDate)
          if (!isNaN(d.getTime())) {
            setEndDate(d.toISOString().split('T')[0])
          }
        } else {
          setEndDate('')
        }

        setIsOngoing(Boolean(initialData.isOngoing))
        setDescription(initialData.description || '')
        setProofUrl(initialData.proofUrl || '')
      } else {
        // Reset defaults
        setTitle('')
        setType('organisation')
        setRole('')
        setInstitutionName('')
        setStartDate('')
        setEndDate('')
        setIsOngoing(false)
        setDescription('')
        setProofUrl('')
      }
      setGeneralError(null)
      setFieldErrors({})
    }
  }, [isOpen, initialData])

  if (!isOpen) return null

  // Validate on client
  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!title.trim() || title.trim().length < 3) {
      errors.title = 'Judul pengalaman minimal 3 karakter'
    } else if (title.trim().length > 150) {
      errors.title = 'Judul pengalaman maksimal 150 karakter'
    }

    if (!role.trim() || role.trim().length < 2) {
      errors.role = 'Peran/posisi minimal 2 karakter'
    }

    if (!startDate) {
      errors.startDate = 'Tanggal mulai wajib diisi'
    }

    if (!isOngoing && endDate && startDate) {
      if (new Date(endDate) < new Date(startDate)) {
        errors.endDate = 'Tanggal selesai tidak boleh lebih awal dari tanggal mulai'
      }
    }

    if (!description.trim() || description.trim().length < 50) {
      errors.description = `Deskripsi minimal 50 karakter (saat ini ${description.trim().length} karakter). Tulis lebih detail untuk AI skill extraction.`
    } else if (description.trim().length > 1000) {
      errors.description = 'Deskripsi maksimal 1000 karakter'
    }

    if (proofUrl.trim()) {
      try {
        new URL(proofUrl.trim())
      } catch {
        errors.proofUrl = 'Tautan bukti harus berupa URL yang valid (diawali http:// atau https://)'
      }
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGeneralError(null)

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const payload = {
        title: title.trim(),
        type,
        role: role.trim(),
        institutionName: institutionName.trim() || '-',
        startDate,
        endDate: isOngoing ? null : endDate || null,
        isOngoing,
        description: description.trim(),
        proofUrl: proofUrl.trim() || null
      }

      const url = isEdit
        ? `/api/experiences/${initialData!.id}`
        : '/api/experiences'
      const method = isEdit ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        if (data.errors && typeof data.errors === 'object') {
          const mapped: Record<string, string> = {}
          for (const [key, val] of Object.entries(data.errors)) {
            mapped[key] = Array.isArray(val) ? (val as string[])[0] : String(val)
          }
          setFieldErrors(mapped)
        }
        setGeneralError(data.message || 'Gagal menyimpan pengalaman. Silakan periksa kembali form.')
        return
      }

      onSuccess(data.data, isEdit)
      onClose()
    } catch (err: any) {
      console.error('Error saving experience:', err)
      setGeneralError('Terjadi kesalahan jaringan atau server. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const charCount = description.trim().length

  return (
    <div className='fixed inset-0 z-[1400] flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-hidden'>
      <div className='relative w-full max-w-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] my-auto animate-in zoom-in-95 duration-200'>
        {/* Modal Header (Pinned) */}
        <div className='flex items-center justify-between px-6 py-4.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 backdrop-blur-xs shrink-0'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200/60 dark:border-blue-900/60 shrink-0'>
              <Sparkles className='w-5 h-5' />
            </div>
            <div>
              <h2 className='text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug'>
                {isEdit ? 'Edit Pengalaman' : 'Tambah Pengalaman Baru'}
              </h2>
              <p className='text-xs text-slate-500 dark:text-slate-400'>
                {isEdit
                  ? 'Perbarui detail rekam jejak aktivitas atau organisasi Anda.'
                  : 'Dokumentasikan aktivitas Anda agar AI dapat mengekstrak skill secara otomatis.'}
              </p>
            </div>
          </div>
          <button
            type='button'
            onClick={onClose}
            className='p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Modal Form Body (Scrollable with custom-scrollbar) */}
        <form
          id='experience-form'
          onSubmit={handleSubmit}
          className='flex-1 overflow-y-auto px-6 py-5 space-y-5 custom-scrollbar'
        >
          {/* General Error Banner */}
          {generalError && (
            <div className='p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-3 text-rose-700 dark:text-rose-300 text-sm'>
              <AlertCircle className='w-5 h-5 shrink-0 mt-0.5' />
              <span>{generalError}</span>
            </div>
          )}

          {/* Judul Pengalaman */}
          <div>
            <label className='block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider'>
              Judul Pengalaman <span className='text-rose-500'>*</span>
            </label>
            <input
              type='text'
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder='Contoh: Ketua BEM Fakultas 2026'
              className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-white ${
                fieldErrors.title
                  ? 'border-rose-400 dark:border-rose-600 focus:border-rose-500'
                  : 'border-slate-200 dark:border-slate-700 focus:border-blue-500'
              }`}
            />
            {fieldErrors.title && (
              <p className='text-xs text-rose-500 mt-1 font-medium'>
                {fieldErrors.title}
              </p>
            )}
          </div>

          {/* Tipe Pengalaman (Grid Selection) */}
          <div>
            <label className='block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider'>
              Tipe Pengalaman <span className='text-rose-500'>*</span>
            </label>
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-2'>
              {TYPE_OPTIONS.map(opt => {
                const isSelected = type === opt.value
                const Icon = opt.icon
                return (
                  <button
                    key={opt.value}
                    type='button'
                    onClick={() => setType(opt.value)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 shadow-sm ring-1 ring-blue-500'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <Icon className='w-4 h-4 shrink-0' />
                    <span className='truncate'>{opt.label}</span>
                  </button>
                )
              })}
            </div>
            {fieldErrors.type && (
              <p className='text-xs text-rose-500 mt-1 font-medium'>
                {fieldErrors.type}
              </p>
            )}
          </div>

          {/* Peran & Nama Institusi (2 Kolom) */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <label className='block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider'>
                Peran / Posisi <span className='text-rose-500'>*</span>
              </label>
              <div className='relative'>
                <Briefcase className='w-4 h-4 text-slate-400 absolute left-3.5 top-3' />
                <input
                  type='text'
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  placeholder='Contoh: Project Lead / UI Designer'
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-white ${
                    fieldErrors.role
                      ? 'border-rose-400 dark:border-rose-600 focus:border-rose-500'
                      : 'border-slate-200 dark:border-slate-700 focus:border-blue-500'
                  }`}
                />
              </div>
              {fieldErrors.role && (
                <p className='text-xs text-rose-500 mt-1 font-medium'>
                  {fieldErrors.role}
                </p>
              )}
            </div>

            <div>
              <label className='block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider'>
                Nama Institusi / Organisasi
              </label>
              <div className='relative'>
                <Building2 className='w-4 h-4 text-slate-400 absolute left-3.5 top-3' />
                <input
                  type='text'
                  value={institutionName}
                  onChange={e => setInstitutionName(e.target.value)}
                  placeholder='Contoh: BEM Fakultas / PT Telkom'
                  className='w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-white'
                />
              </div>
            </div>
          </div>

          {/* Periode Tanggal & Ongoing Checkbox */}
          <div className='space-y-2.5'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div>
                <label className='block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider'>
                  Tanggal Mulai <span className='text-rose-500'>*</span>
                </label>
                <input
                  type='date'
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-white ${
                    fieldErrors.startDate
                      ? 'border-rose-400 dark:border-rose-600 focus:border-rose-500'
                      : 'border-slate-200 dark:border-slate-700 focus:border-blue-500'
                  }`}
                />
                {fieldErrors.startDate && (
                  <p className='text-xs text-rose-500 mt-1 font-medium'>
                    {fieldErrors.startDate}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider'>
                  Tanggal Selesai
                </label>
                <input
                  type='date'
                  value={endDate}
                  disabled={isOngoing}
                  onChange={e => setEndDate(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-white disabled:opacity-40 disabled:cursor-not-allowed ${
                    fieldErrors.endDate
                      ? 'border-rose-400 dark:border-rose-600 focus:border-rose-500'
                      : 'border-slate-200 dark:border-slate-700 focus:border-blue-500'
                  }`}
                />
                {fieldErrors.endDate && (
                  <p className='text-xs text-rose-500 mt-1 font-medium'>
                    {fieldErrors.endDate}
                  </p>
                )}
              </div>
            </div>

            {/* Checkbox Sedang Berlangsung */}
            <label className='inline-flex items-center gap-2.5 cursor-pointer select-none pt-1'>
              <input
                type='checkbox'
                checked={isOngoing}
                onChange={e => {
                  setIsOngoing(e.target.checked)
                  if (e.target.checked) {
                    setEndDate('')
                  }
                }}
                className='w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20'
              />
              <span className='text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300'>
                Aktivitas ini masih aktif / sedang berlangsung saat ini
              </span>
            </label>
          </div>

          {/* Deskripsi (Min 50, Max 1000) */}
          <div>
            <div className='flex items-center justify-between mb-1.5'>
              <label className='block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider'>
                Deskripsi Pengalaman <span className='text-rose-500'>*</span>
              </label>
              <span
                className={`text-xs font-semibold ${
                  charCount < 50
                    ? 'text-amber-500 dark:text-amber-400'
                    : charCount > 1000
                    ? 'text-rose-500'
                    : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {charCount} / 1000 karakter
                {charCount < 50 && ` (kurang ${50 - charCount} karakter)`}
              </span>
            </div>

            <textarea
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder='Jelaskan tanggung jawab utama, inisiatif yang diambil, alat/metode yang digunakan, serta capaian nyata selama pengalaman ini berlangsung...'
              className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-white leading-relaxed ${
                fieldErrors.description
                  ? 'border-rose-400 dark:border-rose-600 focus:border-rose-500'
                  : 'border-slate-200 dark:border-slate-700 focus:border-blue-500'
              }`}
            />
            {fieldErrors.description && (
              <p className='text-xs text-rose-500 mt-1 font-medium'>
                {fieldErrors.description}
              </p>
            )}

            {/* AI Prompting Guidance Box */}
            <div className='mt-2 p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 text-xs text-blue-800 dark:text-blue-300 flex items-start gap-2'>
              <Sparkles className='w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5' />
              <span>
                <strong>Tips AI:</strong> Deskripsi berkualitas tinggi membantu AI
                mengekstrak skill dengan akurat. Cantumkan kata kerja aksi (misal:{' '}
                <em>merancang</em>, <em>mengelola</em>, <em>mengembangkan</em>) dan
                tools yang dipakai.
              </span>
            </div>
          </div>

          {/* Tautan Bukti (URL) */}
          <div>
            <label className='block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider'>
              Tautan Bukti Pendukung (Opsional)
            </label>
            <div className='relative'>
              <LinkIcon className='w-4 h-4 text-slate-400 absolute left-3.5 top-3' />
              <input
                type='url'
                value={proofUrl}
                onChange={e => setProofUrl(e.target.value)}
                placeholder='https://drive.google.com/... atau GitHub / sertifikat'
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-white ${
                  fieldErrors.proofUrl
                    ? 'border-rose-400 dark:border-rose-600 focus:border-rose-500'
                    : 'border-slate-200 dark:border-slate-700 focus:border-blue-500'
                }`}
              />
            </div>
            {fieldErrors.proofUrl && (
              <p className='text-xs text-rose-500 mt-1 font-medium'>
                {fieldErrors.proofUrl}
              </p>
            )}
            <p className='text-[11px] text-slate-400 dark:text-slate-500 mt-1'>
              Sertakan link portofolio, sertifikat penghargaan, atau foto dokumentasi.
            </p>
          </div>

        </form>

        {/* Modal Footer (Pinned Actions) */}
        <div className='px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-xs shrink-0 flex items-center justify-end gap-3'>
          <button
            type='button'
            onClick={onClose}
            disabled={loading}
            className='px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50'
          >
            Batal
          </button>
          <button
            type='submit'
            form='experience-form'
            disabled={loading}
            className='inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? (
              <>
                <Loader2 className='w-4 h-4 animate-spin' />
                <span>{isEdit ? 'Menyimpan...' : 'Menambahkan...'}</span>
              </>
            ) : (
              <>
                <CheckCircle2 className='w-4 h-4' />
                <span>{isEdit ? 'Simpan Perubahan' : 'Simpan Pengalaman'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
