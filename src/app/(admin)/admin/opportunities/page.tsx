'use client'

import React, { useState, useEffect, useCallback } from 'react'

import {
  Search,
  Plus,
  Sparkles,
  ExternalLink,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  X,
  Calendar,
  MapPin,
  Building,
  Check
} from 'lucide-react'

import SafeDeleteModal from '@/components/admin/SafeDeleteModal'

type OpportunityType = 'internship' | 'part_time' | 'full_time' | 'freelance' | 'competition'

interface OpportunityItem {
  id: string
  title: string
  company: string
  location: string | null
  sourceUrl: string | null
  type: OpportunityType
  description: string | null
  deadline: string | null
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
  }
}

interface MasterSkillOption {
  id: string
  name: string
  category: string
}

const typeLabels: Record<OpportunityType, { label: string; color: string }> = {
  internship: { label: 'Internship (Magang)', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' },
  full_time: { label: 'Full Time', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
  part_time: { label: 'Part Time', color: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20' },
  freelance: { label: 'Freelance / Proyek', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
  competition: { label: 'Kompetisi', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' }
}

export default function AdminOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([])
  const [masterSkills, setMasterSkills] = useState<MasterSkillOption[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')

  // Modal Form States
  const [modalOpen, setModalOpen] = useState(false)
  const [editingOpp, setEditingOpp] = useState<OpportunityItem | null>(null)
  const [formTitle, setFormTitle] = useState('')
  const [formCompany, setFormCompany] = useState('')
  const [formLocation, setFormLocation] = useState('')
  const [formUrl, setFormUrl] = useState('')
  const [formType, setFormType] = useState<OpportunityType>('internship')
  const [formDeadline, setFormDeadline] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formSkillIds, setFormSkillIds] = useState<string[]>([])
  const [formIsActive, setFormIsActive] = useState(true)
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // Safe Delete States
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [oppToDelete, setOppToDelete] = useState<OpportunityItem | null>(null)
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

      const [resOpps, resSkills] = await Promise.all([
        fetch(`/api/admin/opportunities?${params.toString()}`),
        fetch('/api/admin/skills?limit=200')
      ])

      const jsonOpps = await resOpps.json()
      const jsonSkills = await resSkills.json()

      if (jsonOpps.success && jsonOpps.data) {
        setOpportunities(jsonOpps.data.data)
      }

      if (jsonSkills.success && jsonSkills.data) {
        setMasterSkills(jsonSkills.data.data)
      }
    } catch (err) {
      console.error('Fetch error:', err)
      showNotification('Gagal memuat lowongan karier', 'error')
    } finally {
      setLoading(false)
    }
  }, [search, selectedType])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingOpp(null)
    setFormTitle('')
    setFormCompany('')
    setFormLocation('Jakarta (Hybrid)')
    setFormUrl('')
    setFormType('internship')
    setFormDeadline('')
    setFormDescription('')
    setFormSkillIds([])
    setFormIsActive(true)
    setFormError(null)
    setModalOpen(true)
  }

  // Open Edit Modal
  const handleOpenEdit = (item: OpportunityItem) => {
    setEditingOpp(item)
    setFormTitle(item.title)
    setFormCompany(item.company)
    setFormLocation(item.location || '')
    setFormUrl(item.sourceUrl || '')
    setFormType(item.type)
    setFormDeadline(item.deadline ? item.deadline.slice(0, 10) : '')
    setFormDescription(item.description || '')
    setFormSkillIds(item.skillTags.map(st => st.skill.id))
    setFormIsActive(item.isActive)
    setFormError(null)
    setModalOpen(true)
  }

  // Toggle Skill Tag
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
    setFormLoading(true)

    try {
      const url = editingOpp
        ? `/api/admin/opportunities/${editingOpp.id}`
        : '/api/admin/opportunities'

      const method = editingOpp ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formTitle,
          company: formCompany,
          location: formLocation,
          sourceUrl: formUrl,
          type: formType,
          deadline: formDeadline || null,
          description: formDescription,
          skillIds: formSkillIds,
          isActive: formIsActive
        })
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setFormError(data.message || 'Gagal menyimpan lowongan karier')
        setFormLoading(false)
        
return
      }

      setModalOpen(false)
      showNotification(
        editingOpp ? 'Lowongan berhasil diperbarui' : 'Lowongan baru berhasil ditambahkan'
      )
      fetchData()
    } catch (err) {
      console.error('Save opportunity error:', err)
      setFormError('Terjadi kesalahan jaringan')
    } finally {
      setFormLoading(false)
    }
  }

  // Toggle Status
  const handleToggleStatus = async (item: OpportunityItem) => {
    try {
      const res = await fetch(`/api/admin/opportunities/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: item.title,
          company: item.company,
          isActive: !item.isActive
        })
      })

      if (res.ok) {
        showNotification(
          `Status lowongan "${item.title}" diubah menjadi ${!item.isActive ? 'Aktif' : 'Nonaktif'}`
        )
        fetchData()
      }
    } catch (err) {
      console.error('Toggle status error:', err)
    }
  }

  // Prepare Delete
  const handlePrepareDelete = (item: OpportunityItem) => {
    setOppToDelete(item)

    if (item._count.savedByUsers > 0) {
      setDeleteWarning(
        `Lowongan ini disimpan oleh ${item._count.savedByUsers} pengguna. Penghapusan akan menonaktifkan status (soft-delete) untuk melindungi data pengguna.`
      )
    } else {
      setDeleteWarning(null)
    }

    setDeleteModalOpen(true)
  }

  // Execute Delete
  const handleExecuteDelete = async () => {
    if (!oppToDelete) return
    setDeleteLoading(true)

    try {
      const res = await fetch(`/api/admin/opportunities/${oppToDelete.id}`, {
        method: 'DELETE'
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        setDeleteWarning(json.message || 'Gagal menghapus lowongan')
        setDeleteLoading(false)
        
return
      }

      setDeleteModalOpen(false)
      showNotification(json.message || 'Lowongan berhasil dihapus')
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
            Katalog Peluang Karier & Magang
          </h2>
          <p className='text-xs text-slate-500 dark:text-slate-400'>
            Total {opportunities.length} lowongan aktif untuk dicocokkan dengan portofolio pengguna
          </p>
        </div>

        <div className='flex items-center gap-3'>
          <button
            onClick={() => fetchData()}
            className='p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
            title='Muat Ulang'
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleOpenAdd}
            className='px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 shadow-md shadow-purple-900/30 transition-all flex items-center gap-2 cursor-pointer'
          >
            <Plus className='w-4 h-4' />
            <span>Tambah Lowongan Baru</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className='p-4 rounded-2xl bg-white dark:bg-[#0F1424] border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4'>
        <div className='relative w-full md:w-80'>
          <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400'>
            <Search className='w-4 h-4' />
          </div>
          <input
            type='text'
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder='Cari posisi, perusahaan, lokasi...'
            className='w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all'
          />
        </div>

        {/* Type Tabs */}
        <div className='flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0'>
          {[
            { id: 'all', label: 'Semua Tipe' },
            { id: 'internship', label: 'Internship' },
            { id: 'full_time', label: 'Full Time' },
            { id: 'part_time', label: 'Part Time' },
            { id: 'freelance', label: 'Freelance' },
            { id: 'competition', label: 'Kompetisi' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedType === tab.id
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table Content */}
      <div className='overflow-hidden rounded-2xl bg-white dark:bg-[#0F1424] border border-slate-200/80 dark:border-slate-800/80 shadow-xs'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left border-collapse text-xs'>
            <thead>
              <tr className='border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]'>
                <th className='py-3.5 px-4 sm:px-6'>Posisi & Perusahaan</th>
                <th className='py-3.5 px-4'>Tipe & Lokasi</th>
                <th className='py-3.5 px-4'>Kualifikasi Skill Tags</th>
                <th className='py-3.5 px-4'>Deadline Lamaran</th>
                <th className='py-3.5 px-4 text-center'>Status Tayang</th>
                <th className='py-3.5 px-4 sm:px-6 text-right'>Aksi</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100 dark:divide-slate-800/60'>
              {loading ? (
                <tr>
                  <td colSpan={6} className='py-12 text-center text-slate-400'>
                    <RefreshCw className='w-6 h-6 animate-spin mx-auto mb-2 text-purple-500' />
                    <span>Memuat peluang karier...</span>
                  </td>
                </tr>
              ) : opportunities.length === 0 ? (
                <tr>
                  <td colSpan={6} className='py-12 text-center text-slate-400'>
                    <Sparkles className='w-8 h-8 mx-auto mb-2 opacity-40' />
                    <p className='font-semibold text-slate-700 dark:text-slate-300'>
                      Belum ada lowongan karier ditemukan
                    </p>
                    <p className='text-[11px]'>Tambahkan lowongan baru dengan tombol di atas</p>
                  </td>
                </tr>
              ) : (
                opportunities.map(item => {
                  const typeConfig = typeLabels[item.type] || typeLabels.internship
                  const isExpired = item.deadline ? new Date(item.deadline) < new Date() : false

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors ${
                        !item.isActive || isExpired
                          ? 'opacity-60 bg-slate-50/30 dark:bg-slate-900/20'
                          : ''
                      }`}
                    >
                      <td className='py-3.5 px-4 sm:px-6'>
                        <div className='font-bold text-slate-900 dark:text-white flex items-center gap-1.5'>
                          <span>{item.title}</span>
                          {item.sourceUrl && (
                            <a
                              href={item.sourceUrl}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-slate-400 hover:text-purple-600 transition-colors'
                            >
                              <ExternalLink className='w-3 h-3' />
                            </a>
                          )}
                        </div>
                        <div className='text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1'>
                          <Building className='w-3 h-3' />
                          <span>{item.company}</span>
                        </div>
                      </td>

                      <td className='py-3.5 px-4'>
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold border ${typeConfig.color}`}
                        >
                          {typeConfig.label}
                        </span>
                        <div className='text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1'>
                          <MapPin className='w-3 h-3' />
                          <span>{item.location || 'Remote / Fleksibel'}</span>
                        </div>
                      </td>

                      <td className='py-3.5 px-4'>
                        <div className='flex flex-wrap gap-1 max-w-xs'>
                          {item.skillTags.map(tag => (
                            <span
                              key={tag.id}
                              className='px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-700 dark:text-purple-300 text-[10px] font-semibold border border-purple-500/20'
                            >
                              {tag.skill.name}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className='py-3.5 px-4'>
                        {item.deadline ? (
                          <div className='space-y-0.5'>
                            <div className='flex items-center gap-1 text-[11px] font-medium text-slate-700 dark:text-slate-300'>
                              <Calendar className='w-3 h-3 text-slate-400' />
                              <span>{new Date(item.deadline).toLocaleDateString('id-ID')}</span>
                            </div>
                            {isExpired && (
                              <span className='inline-block text-[10px] font-bold text-rose-500'>
                                ● Telah Lewat (Expired)
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className='text-slate-400 text-[11px]'>Tanpa batas</span>
                        )}
                      </td>

                      <td className='py-3.5 px-4 text-center'>
                        <button
                          onClick={() => handleToggleStatus(item)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${
                            item.isActive && !isExpired
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700 hover:bg-slate-300'
                          }`}
                          title='Beralih status aktif/nonaktif'
                        >
                          {item.isActive && !isExpired ? (
                            <>
                              <span className='w-1.5 h-1.5 rounded-full bg-emerald-500' />
                              <span>Aktif</span>
                            </>
                          ) : (
                            <>
                              <span className='w-1.5 h-1.5 rounded-full bg-slate-400' />
                              <span>{isExpired ? 'Expired' : 'Nonaktif'}</span>
                            </>
                          )}
                        </button>
                      </td>

                      <td className='py-3.5 px-4 sm:px-6 text-right space-x-1.5'>
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className='p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors cursor-pointer'
                          title='Edit Lowongan'
                        >
                          <Edit2 className='w-4 h-4' />
                        </button>
                        <button
                          onClick={() => handlePrepareDelete(item)}
                          className='p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer'
                          title='Hapus Lowongan'
                        >
                          <Trash2 className='w-4 h-4' />
                        </button>
                      </td>
                    </tr>
                  )
                })
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
                {editingOpp ? 'Perbarui Lowongan Karier' : 'Tambah Lowongan Karier Baru'}
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
                    Posisi / Judul Lowongan *
                  </label>
                  <input
                    type='text'
                    required
                    value={formTitle}
                    onChange={e => setFormTitle(e.target.value)}
                    placeholder='Contoh: Product Design Intern'
                    className='w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500'
                  />
                </div>

                <div>
                  <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                    Perusahaan / Organisasi *
                  </label>
                  <input
                    type='text'
                    required
                    value={formCompany}
                    onChange={e => setFormCompany(e.target.value)}
                    placeholder='Contoh: GoTo Group, Telkom Indonesia'
                    className='w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500'
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                <div>
                  <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                    Tipe Pekerjaan
                  </label>
                  <select
                    value={formType}
                    onChange={e => setFormType(e.target.value as OpportunityType)}
                    className='w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500'
                  >
                    <option value='internship'>Internship (Magang)</option>
                    <option value='full_time'>Full Time</option>
                    <option value='part_time'>Part Time</option>
                    <option value='freelance'>Freelance</option>
                    <option value='competition'>Kompetisi</option>
                  </select>
                </div>

                <div>
                  <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                    Lokasi
                  </label>
                  <input
                    type='text'
                    value={formLocation}
                    onChange={e => setFormLocation(e.target.value)}
                    placeholder='Jakarta / Remote'
                    className='w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500'
                  />
                </div>

                <div>
                  <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                    Batas Akhir (Deadline)
                  </label>
                  <input
                    type='date'
                    value={formDeadline}
                    onChange={e => setFormDeadline(e.target.value)}
                    className='w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500'
                  />
                </div>
              </div>

              <div>
                <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                  URL Sumber / Pendaftaran Lowongan
                </label>
                <input
                  type='url'
                  value={formUrl}
                  onChange={e => setFormUrl(e.target.value)}
                  placeholder='https://career.goto.com/jobs/...'
                  className='w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 font-mono text-[11px]'
                />
              </div>

              {/* Skill Tags Multi-Select */}
              <div>
                <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                  Kualifikasi Skill yang Dibutuhkan
                </label>
                <div className='p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 max-h-36 overflow-y-auto space-y-1.5'>
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
                              ? 'bg-purple-600 text-white border-purple-500 shadow-xs'
                              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-purple-400'
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
                  Dipilih: {formSkillIds.length} skill kualifikasi
                </p>
              </div>

              <div>
                <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                  Deskripsi & Persyaratan
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  placeholder='Ringkasan kualifikasi, tanggung jawab, dan link pendaftaran...'
                  className='w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 resize-none'
                />
              </div>

              <div className='flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800'>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={formIsActive}
                    onChange={e => setFormIsActive(e.target.checked)}
                    className='rounded text-purple-600 focus:ring-purple-500'
                  />
                  <span className='font-semibold text-slate-700 dark:text-slate-300 text-xs'>
                    Lowongan Aktif (Dapat ditemukan oleh pencari kerja)
                  </span>
                </label>

                <div className='flex items-center gap-2.5'>
                  <button
                    type='button'
                    onClick={() => setModalOpen(false)}
                    disabled={formLoading}
                    className='px-4 py-2 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  >
                    Batal
                  </button>
                  <button
                    type='submit'
                    disabled={formLoading}
                    className='px-4 py-2 rounded-xl font-semibold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-900/30 disabled:opacity-50'
                  >
                    {formLoading ? 'Menyimpan...' : 'Simpan Lowongan'}
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
        title='Hapus Lowongan Karier'
        itemName={oppToDelete?.title || ''}
        warningMessage={deleteWarning}
        loading={deleteLoading}
      />
    </div>
  )
}
