'use client'

import React, { useState, useEffect, useCallback } from 'react'

import {
  Search,
  Plus,
  GraduationCap,
  ExternalLink,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  X,
  Star,
  Clock,
  Check
} from 'lucide-react'

import SafeDeleteModal from '@/components/admin/SafeDeleteModal'

type ResourceType = 'course' | 'article' | 'video' | 'bootcamp' | 'book'
type Difficulty = 'beginner' | 'intermediate' | 'advanced'

interface ResourceItem {
  id: string
  title: string
  platform: string
  url: string
  type: ResourceType
  difficulty: Difficulty
  durationMinutes: number | null
  rating: number | null
  description: string | null
  isActive: boolean
  skillTags: Array<{
    id: string
    skill: {
      id: string
      name: string
      category: string
    }
  }>
  _count: {
    savedByUsers: number
    recommendations: number
  }
}

interface MasterSkillOption {
  id: string
  name: string
  category: string
}

export default function AdminLearningResourcesPage() {
  const [resources, setResources] = useState<ResourceItem[]>([])
  const [masterSkills, setMasterSkills] = useState<MasterSkillOption[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')

  // Modal Form States
  const [modalOpen, setModalOpen] = useState(false)
  const [editingResource, setEditingResource] = useState<ResourceItem | null>(null)
  const [formTitle, setFormTitle] = useState('')
  const [formPlatform, setFormPlatform] = useState('')
  const [formUrl, setFormUrl] = useState('')
  const [formType, setFormType] = useState<ResourceType>('course')
  const [formDifficulty, setFormDifficulty] = useState<Difficulty>('beginner')
  const [formDuration, setFormDuration] = useState('')
  const [formRating, setFormRating] = useState('4.8')
  const [formDescription, setFormDescription] = useState('')
  const [formSkillIds, setFormSkillIds] = useState<string[]>([])
  const [formIsActive, setFormIsActive] = useState(true)
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // Safe Delete States
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [resourceToDelete, setResourceToDelete] = useState<ResourceItem | null>(null)
  const [deleteWarning, setDeleteWarning] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Feedback Notification
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ message, type })
    setTimeout(() => setFeedback(null), 4000)
  }

  const fetchData = useCallback(async () => {
    setLoading(true)

    try {
      const params = new URLSearchParams()

      if (search.trim()) params.set('search', search.trim())
      if (selectedType !== 'all') params.set('type', selectedType)

      const [resResources, resSkills] = await Promise.all([
        fetch(`/api/admin/learning-resources?${params.toString()}`),
        fetch('/api/admin/skills?limit=200')
      ])

      const jsonResources = await resResources.json()
      const jsonSkills = await resSkills.json()

      if (jsonResources.success && jsonResources.data) {
        setResources(jsonResources.data.data)
      }

      if (jsonSkills.success && jsonSkills.data) {
        setMasterSkills(jsonSkills.data.data)
      }
    } catch (err) {
      console.error('Fetch error:', err)
      showNotification('Gagal memuat materi belajar', 'error')
    } finally {
      setLoading(false)
    }
  }, [search, selectedType])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingResource(null)
    setFormTitle('')
    setFormPlatform('')
    setFormUrl('')
    setFormType('course')
    setFormDifficulty('beginner')
    setFormDuration('120')
    setFormRating('4.8')
    setFormDescription('')
    setFormSkillIds([])
    setFormIsActive(true)
    setFormError(null)
    setModalOpen(true)
  }

  // Open Edit Modal
  const handleOpenEdit = (item: ResourceItem) => {
    setEditingResource(item)
    setFormTitle(item.title)
    setFormPlatform(item.platform)
    setFormUrl(item.url)
    setFormType(item.type)
    setFormDifficulty(item.difficulty)
    setFormDuration(item.durationMinutes ? String(item.durationMinutes) : '')
    setFormRating(item.rating ? String(item.rating) : '')
    setFormDescription(item.description || '')
    setFormSkillIds(item.skillTags.map(st => st.skill.id))
    setFormIsActive(item.isActive)
    setFormError(null)
    setModalOpen(true)
  }

  // Toggle Skill Tag Selection
  const handleToggleSkill = (skillId: string) => {
    if (formSkillIds.includes(skillId)) {
      setFormSkillIds(formSkillIds.filter(id => id !== skillId))
    } else {
      setFormSkillIds([...formSkillIds, skillId])
    }
  }

  // Save Add/Edit
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (formSkillIds.length === 0) {
      setFormError('Wajib memilih minimal 1 tag skill untuk materi belajar ini')
      
return
    }

    setFormLoading(true)

    try {
      const url = editingResource
        ? `/api/admin/learning-resources/${editingResource.id}`
        : '/api/admin/learning-resources'

      const method = editingResource ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formTitle,
          platform: formPlatform,
          url: formUrl,
          type: formType,
          difficulty: formDifficulty,
          durationMinutes: formDuration ? parseInt(formDuration, 10) : null,
          rating: formRating ? parseFloat(formRating) : null,
          description: formDescription,
          skillIds: formSkillIds,
          isActive: formIsActive
        })
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setFormError(data.message || 'Gagal menyimpan materi belajar')
        setFormLoading(false)
        
return
      }

      setModalOpen(false)
      showNotification(
        editingResource ? 'Materi belajar berhasil diperbarui' : 'Materi belajar berhasil ditambahkan'
      )
      fetchData()
    } catch (err) {
      console.error('Save resource error:', err)
      setFormError('Terjadi kesalahan jaringan')
    } finally {
      setFormLoading(false)
    }
  }

  // Toggle Quick Status (Active / Inactive)
  const handleToggleStatus = async (item: ResourceItem) => {
    try {
      const res = await fetch(`/api/admin/learning-resources/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: item.title,
          platform: item.platform,
          url: item.url,
          isActive: !item.isActive
        })
      })

      if (res.ok) {
        showNotification(
          `Status materi "${item.title}" diubah menjadi ${!item.isActive ? 'Aktif' : 'Nonaktif'}`
        )
        fetchData()
      }
    } catch (err) {
      console.error('Toggle status error:', err)
    }
  }

  // Prepare Delete
  const handlePrepareDelete = (item: ResourceItem) => {
    setResourceToDelete(item)

    if (item._count.savedByUsers > 0) {
      setDeleteWarning(
        `Materi ini telah disimpan/di-bookmark oleh ${item._count.savedByUsers} pengguna. Penghapusan akan menonaktifkan status materi (soft-delete) agar tidak merusak data pengguna.`
      )
    } else {
      setDeleteWarning(null)
    }

    setDeleteModalOpen(true)
  }

  // Execute Delete
  const handleExecuteDelete = async () => {
    if (!resourceToDelete) return
    setDeleteLoading(true)

    try {
      const res = await fetch(`/api/admin/learning-resources/${resourceToDelete.id}`, {
        method: 'DELETE'
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        setDeleteWarning(json.message || 'Gagal menghapus materi belajar')
        setDeleteLoading(false)
        
return
      }

      setDeleteModalOpen(false)
      showNotification(json.message || 'Materi berhasil dihapus')
      fetchData()
    } catch (err) {
      console.error('Delete error:', err)
      setDeleteWarning('Terjadi kesalahan saat menghapus data')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className='space-y-6 animate-fade-in'>
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl text-xs font-semibold shadow-xl flex items-center gap-2 border animate-bounce-in ${
            feedback.type === 'success'
              ? 'bg-emerald-600 text-white border-emerald-500'
              : 'bg-rose-600 text-white border-rose-500'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className='w-4 h-4' />
          ) : (
            <AlertCircle className='w-4 h-4' />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Header Actions */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h2 className='text-lg font-bold text-slate-900 dark:text-white'>
            Katalog Rekomendasi Materi Belajar
          </h2>
          <p className='text-xs text-slate-500 dark:text-slate-400'>
            Total {resources.length} materi belajar rujukan untuk menutup skill gap pengguna
          </p>
        </div>

        <div className='flex items-center gap-3'>
          <button
            onClick={() => fetchData()}
            className='h-10 w-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all flex items-center justify-center cursor-pointer shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] dark:shadow-none shrink-0'
            title='Muat Ulang'
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleOpenAdd}
            className='px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-[#2563EB] hover:bg-blue-600 active:bg-blue-700 shadow-sm shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer'
          >
            <Plus className='w-4 h-4' />
            <span>Tambah Materi Belajar</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className='p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-none flex flex-col md:flex-row items-center justify-between gap-4'>
        <div className='relative w-full md:w-80'>
          <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400'>
            <Search className='w-4 h-4' />
          </div>
          <input
            type='text'
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder='Cari judul materi, platform...'
            className='w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all'
          />
        </div>

        {/* Type Tabs */}
        <div className='flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0'>
          {[
            { id: 'all', label: 'Semua Tipe' },
            { id: 'course', label: 'Online Course' },
            { id: 'bootcamp', label: 'Bootcamp' },
            { id: 'video', label: 'Video Tutorial' },
            { id: 'article', label: 'Article / Guide' },
            { id: 'book', label: 'Book' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedType === tab.id
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table Content */}
      <div className='overflow-hidden rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-none'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left border-collapse text-xs'>
            <thead>
              <tr className='border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]'>
                <th className='py-3.5 px-4 sm:px-6'>Materi & Platform</th>
                <th className='py-3.5 px-4'>Tipe & Tingkat</th>
                <th className='py-3.5 px-4'>Terkait Skill Tags</th>
                <th className='py-3.5 px-4'>Rating & Durasi</th>
                <th className='py-3.5 px-4 text-center'>Status Rekomendasi</th>
                <th className='py-3.5 px-4 sm:px-6 text-right'>Aksi</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100 dark:divide-slate-800/60'>
              {loading ? (
                <tr>
                  <td colSpan={6} className='py-12 text-center text-slate-400'>
                    <RefreshCw className='w-6 h-6 animate-spin mx-auto mb-2 text-blue-500' />
                    <span>Memuat materi belajar...</span>
                  </td>
                </tr>
              ) : resources.length === 0 ? (
                <tr>
                  <td colSpan={6} className='py-12 text-center text-slate-400'>
                    <GraduationCap className='w-8 h-8 mx-auto mb-2 opacity-40' />
                    <p className='font-semibold text-slate-700 dark:text-slate-300'>
                      Belum ada materi belajar ditemukan
                    </p>
                    <p className='text-[11px]'>Tambahkan materi baru dengan tombol di atas</p>
                  </td>
                </tr>
              ) : (
                resources.map(item => (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors ${
                      !item.isActive ? 'opacity-60 bg-slate-50/30 dark:bg-slate-900/20' : ''
                    }`}
                  >
                    <td className='py-3.5 px-4 sm:px-6'>
                      <div className='font-bold text-slate-900 dark:text-white flex items-center gap-1.5'>
                        <span>{item.title}</span>
                        {item.url && (
                          <a
                            href={item.url}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
                          >
                            <ExternalLink className='w-3 h-3' />
                          </a>
                        )}
                      </div>
                      <div className='text-[11px] text-slate-500 dark:text-slate-400 font-medium'>
                        {item.platform}
                      </div>
                    </td>

                    <td className='py-3.5 px-4'>
                      <div className='capitalize font-semibold text-slate-800 dark:text-slate-200'>
                        {item.type}
                      </div>
                      <span className='capitalize text-[11px] text-slate-400'>
                        {item.difficulty}
                      </span>
                    </td>

                    <td className='py-3.5 px-4'>
                      <div className='flex flex-wrap gap-1 max-w-xs'>
                        {item.skillTags.map(tag => (
                          <span
                            key={tag.id}
                            className='px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 text-[10px] font-semibold border border-blue-500/20'
                          >
                            {tag.skill.name}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className='py-3.5 px-4'>
                      <div className='flex items-center gap-1 text-amber-500 font-semibold'>
                        <Star className='w-3 h-3 fill-current' />
                        <span>{item.rating ? item.rating.toFixed(1) : '-'}</span>
                      </div>
                      <div className='flex items-center gap-1 text-[11px] text-slate-400'>
                        <Clock className='w-3 h-3' />
                        <span>{item.durationMinutes ? `${item.durationMinutes} mnt` : 'Fleksibel'}</span>
                      </div>
                    </td>

                    <td className='py-3.5 px-4 text-center'>
                      <button
                        onClick={() => handleToggleStatus(item)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${
                          item.isActive
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                        title='Klik untuk beralih status aktif/nonaktif'
                      >
                        {item.isActive ? (
                          <>
                            <span className='w-1.5 h-1.5 rounded-full bg-emerald-500' />
                            <span>Aktif</span>
                          </>
                        ) : (
                          <>
                            <span className='w-1.5 h-1.5 rounded-full bg-slate-400' />
                            <span>Nonaktif</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className='py-3.5 px-4 sm:px-6 text-right whitespace-nowrap'>
                      <div className='inline-flex items-center justify-end gap-1'>
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className='p-1.5 rounded-lg bg-transparent text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/80 dark:hover:bg-blue-950/40 transition-colors cursor-pointer'
                          title='Edit Materi'
                        >
                          <Edit2 className='w-4 h-4' />
                        </button>
                        <button
                          onClick={() => handlePrepareDelete(item)}
                          className='p-1.5 rounded-lg bg-transparent text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50/80 dark:hover:bg-rose-950/40 transition-colors cursor-pointer'
                          title='Hapus Materi'
                        >
                          <Trash2 className='w-4 h-4' />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in'>
          <div className='relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-[#121829] border border-slate-200 dark:border-slate-800 p-6 shadow-2xl'>
            <div className='flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800'>
              <h3 className='text-sm font-bold text-slate-900 dark:text-white'>
                {editingResource ? 'Perbarui Materi Belajar' : 'Tambah Materi Belajar Baru'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className='p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white'
              >
                <X className='w-4 h-4' />
              </button>
            </div>

            {formError && (
              <div className='mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-start gap-2'>
                <AlertCircle className='w-4 h-4 shrink-0 mt-0.5' />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSave} className='space-y-4 text-xs'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                    Judul Materi Belajar *
                  </label>
                  <input
                    type='text'
                    required
                    value={formTitle}
                    onChange={e => setFormTitle(e.target.value)}
                    placeholder='Contoh: Complete Figma to React Masterclass'
                    className='w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500'
                  />
                </div>

                <div>
                  <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                    Platform Penyedia *
                  </label>
                  <input
                    type='text'
                    required
                    value={formPlatform}
                    onChange={e => setFormPlatform(e.target.value)}
                    placeholder='Contoh: Coursera, Udemy, Dicoding'
                    className='w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500'
                  />
                </div>
              </div>

              <div>
                <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                  URL Tautan Materi *
                </label>
                <input
                  type='url'
                  required
                  value={formUrl}
                  onChange={e => setFormUrl(e.target.value)}
                  placeholder='https://www.coursera.org/learn/...'
                  className='w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 font-mono text-[11px]'
                />
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                <div>
                  <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                    Tipe Format
                  </label>
                  <select
                    value={formType}
                    onChange={e => setFormType(e.target.value as ResourceType)}
                    className='w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500'
                  >
                    <option value='course'>Online Course</option>
                    <option value='bootcamp'>Bootcamp</option>
                    <option value='video'>Video Tutorial</option>
                    <option value='article'>Article / Guide</option>
                    <option value='book'>Book</option>
                  </select>
                </div>

                <div>
                  <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                    Tingkat Kesulitan
                  </label>
                  <select
                    value={formDifficulty}
                    onChange={e => setFormDifficulty(e.target.value as Difficulty)}
                    className='w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500'
                  >
                    <option value='beginner'>Beginner</option>
                    <option value='intermediate'>Intermediate</option>
                    <option value='advanced'>Advanced</option>
                  </select>
                </div>

                <div>
                  <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                    Durasi (Menit)
                  </label>
                  <input
                    type='number'
                    min='0'
                    value={formDuration}
                    onChange={e => setFormDuration(e.target.value)}
                    placeholder='Contoh: 180'
                    className='w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500'
                  />
                </div>
              </div>

              {/* Skill Tags Multi-Select Selector */}
              <div>
                <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                  Pilih Skill Tags Terkait (Minimal 1) *
                </label>
                <div className='p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 max-h-40 overflow-y-auto space-y-1.5'>
                  <div className='flex flex-wrap gap-1.5'>
                    {masterSkills.map(s => {
                      const isSelected = formSkillIds.includes(s.id)

                      
return (
                        <button
                          key={s.id}
                          type='button'
                          onClick={() => handleToggleSkill(s.id)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                            isSelected
                              ? 'bg-[#2563EB] text-white border-blue-500 shadow-xs'
                              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                          }`}
                        >
                          {isSelected && <Check className='w-3 h-3' />}
                          <span>{s.name}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
                <p className='text-[10px] text-slate-400 mt-1'>
                  Dipilih: {formSkillIds.length} skill
                </p>
              </div>

              <div>
                <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                  Deskripsi Singkat
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  placeholder='Ulasan singkat materi dan silabus...'
                  className='w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 resize-none'
                />
              </div>

              <div className='flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800'>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={formIsActive}
                    onChange={e => setFormIsActive(e.target.checked)}
                    className='rounded text-blue-600 focus:ring-blue-500'
                  />
                  <span className='font-semibold text-slate-700 dark:text-slate-300 text-xs'>
                    Materi Aktif (Muncul di rekomendasi user)
                  </span>
                </label>

                <div className='flex items-center gap-2.5'>
                  <button
                    type='button'
                    onClick={() => setModalOpen(false)}
                    disabled={formLoading}
                    className='px-4 py-2 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 bg-transparent transition-colors cursor-pointer'
                  >
                    Batal
                  </button>
                  <button
                    type='submit'
                    disabled={formLoading}
                    className='px-4 py-2 rounded-xl font-semibold text-white bg-[#2563EB] hover:bg-blue-600 shadow-sm shadow-blue-500/20 disabled:opacity-50 transition-all cursor-pointer'
                  >
                    {formLoading ? 'Menyimpan...' : 'Simpan Materi'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Safe Delete Modal */}
      <SafeDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleExecuteDelete}
        title='Hapus Materi Belajar'
        itemName={resourceToDelete?.title || ''}
        warningMessage={deleteWarning}
        loading={deleteLoading}
      />
    </div>
  )
}
