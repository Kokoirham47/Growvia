'use client'

import React, { useState, useEffect, useCallback } from 'react'

import {
  Search,
  Plus,
  Layers,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  X
} from 'lucide-react'

import SafeDeleteModal from '@/components/admin/SafeDeleteModal'

type SkillCategory = 'hard_skill' | 'soft_skill' | 'technical' | 'leadership'

interface SkillItem {
  id: string
  name: string
  category: SkillCategory
  normalizedName: string | null
  createdAt: string
  _count: {
    userSkills: number
    careerRoleSkills: number
    resourceSkillTags: number
    opportunitySkillTags: number
  }
}

const categoryLabels: Record<SkillCategory, { label: string; color: string }> = {
  hard_skill: {
    label: 'Hard Skill',
    color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
  },
  soft_skill: {
    label: 'Soft Skill',
    color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
  },
  technical: {
    label: 'Technical',
    color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
  },
  leadership: {
    label: 'Leadership',
    color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
  }
}

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<SkillItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Modal Form States
  const [modalOpen, setModalOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null)
  const [formName, setFormName] = useState('')
  const [formCategory, setFormCategory] = useState<SkillCategory>('technical')
  const [formNormalized, setFormNormalized] = useState('')
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // Safe Delete States
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [skillToDelete, setSkillToDelete] = useState<SkillItem | null>(null)
  const [deleteWarning, setDeleteWarning] = useState<string | null>(null)
  const [deleteBlocked, setDeleteBlocked] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Feedback Notification
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ message, type })
    setTimeout(() => setFeedback(null), 4000)
  }

  const fetchSkills = useCallback(async () => {
    setLoading(true)

    try {
      const params = new URLSearchParams()

      if (search.trim()) params.set('search', search.trim())
      if (selectedCategory !== 'all') params.set('category', selectedCategory)
      params.set('limit', '100')

      const res = await fetch(`/api/admin/skills?${params.toString()}`)
      const json = await res.json()

      if (json.success && json.data) {
        setSkills(json.data.data)
      }
    } catch (err) {
      console.error('Fetch skills error:', err)
      showNotification('Gagal memuat data skill', 'error')
    } finally {
      setLoading(false)
    }
  }, [search, selectedCategory])

  useEffect(() => {
    fetchSkills()
  }, [fetchSkills])

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingSkill(null)
    setFormName('')
    setFormCategory('technical')
    setFormNormalized('')
    setFormError(null)
    setModalOpen(true)
  }

  // Open Edit Modal
  const handleOpenEdit = (skill: SkillItem) => {
    setEditingSkill(skill)
    setFormName(skill.name)
    setFormCategory(skill.category)
    setFormNormalized(skill.normalizedName || '')
    setFormError(null)
    setModalOpen(true)
  }

  // Handle Form Name Change with auto-slug
  const handleNameChange = (val: string) => {
    setFormName(val)

    if (!editingSkill) {
      const generated = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

      setFormNormalized(generated)
    }
  }

  // Save Add/Edit
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setFormLoading(true)

    try {
      const url = editingSkill ? `/api/admin/skills/${editingSkill.id}` : '/api/admin/skills'
      const method = editingSkill ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          category: formCategory,
          normalizedName: formNormalized
        })
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setFormError(data.message || 'Gagal menyimpan master skill')
        setFormLoading(false)
        
return
      }

      setModalOpen(false)
      showNotification(
        editingSkill ? 'Skill berhasil diperbarui' : 'Skill baru berhasil ditambahkan'
      )
      fetchSkills()
    } catch (err) {
      console.error('Save skill error:', err)
      setFormError('Terjadi kesalahan jaringan')
    } finally {
      setFormLoading(false)
    }
  }

  // Prepare Delete
  const handlePrepareDelete = (skill: SkillItem) => {
    setSkillToDelete(skill)
    const count = skill._count

    const totalDeps =
      count.userSkills + count.careerRoleSkills + count.resourceSkillTags + count.opportunitySkillTags

    if (totalDeps > 0) {
      setDeleteBlocked(true)
      const reasons: string[] = []

      if (count.userSkills > 0) reasons.push(`${count.userSkills} profil pengguna`)
      if (count.careerRoleSkills > 0) reasons.push(`${count.careerRoleSkills} peran karier`)
      if (count.resourceSkillTags > 0) reasons.push(`${count.resourceSkillTags} materi belajar`)
      if (count.opportunitySkillTags > 0) reasons.push(`${count.opportunitySkillTags} lowongan kerja`)
      setDeleteWarning(
        `Skill ini sedang digunakan oleh: ${reasons.join(', ')}. Sistem mencegah penghapusan untuk melindungi konsistensi data.`
      )
    } else {
      setDeleteBlocked(false)
      setDeleteWarning(null)
    }

    setDeleteModalOpen(true)
  }

  // Execute Delete
  const handleExecuteDelete = async () => {
    if (!skillToDelete) return
    setDeleteLoading(true)

    try {
      const res = await fetch(`/api/admin/skills/${skillToDelete.id}`, {
        method: 'DELETE'
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        setDeleteWarning(json.message || 'Gagal menghapus skill')
        setDeleteBlocked(true)
        setDeleteLoading(false)
        
return
      }

      setDeleteModalOpen(false)
      showNotification(`Skill "${skillToDelete.name}" berhasil dihapus`)
      fetchSkills()
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
            Katalog Taksonomi Skill
          </h2>
          <p className='text-xs text-slate-500 dark:text-slate-400'>
            Total {skills.length} keahlian terdaftar sebagai rujukan analitik AI
          </p>
        </div>

        <div className='flex items-center gap-3'>
          <button
            onClick={() => fetchSkills()}
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
            <span>Tambah Skill Baru</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className='p-4 rounded-2xl bg-white dark:bg-[#0F1424] border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4'>
        {/* Search */}
        <div className='relative w-full md:w-80'>
          <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400'>
            <Search className='w-4 h-4' />
          </div>
          <input
            type='text'
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder='Cari nama atau slug skill...'
            className='w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all'
          />
        </div>

        {/* Category Tabs */}
        <div className='flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0'>
          {[
            { id: 'all', label: 'Semua Kategori' },
            { id: 'technical', label: 'Technical' },
            { id: 'hard_skill', label: 'Hard Skill' },
            { id: 'soft_skill', label: 'Soft Skill' },
            { id: 'leadership', label: 'Leadership' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === tab.id
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
                <th className='py-3.5 px-4 sm:px-6'>Nama Skill</th>
                <th className='py-3.5 px-4'>Kategori</th>
                <th className='py-3.5 px-4'>Normalized Slug</th>
                <th className='py-3.5 px-4 text-center'>Dependensi Sistem</th>
                <th className='py-3.5 px-4 sm:px-6 text-right'>Aksi</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100 dark:divide-slate-800/60'>
              {loading ? (
                <tr>
                  <td colSpan={5} className='py-12 text-center text-slate-400'>
                    <RefreshCw className='w-6 h-6 animate-spin mx-auto mb-2 text-purple-500' />
                    <span>Memuat master skill...</span>
                  </td>
                </tr>
              ) : skills.length === 0 ? (
                <tr>
                  <td colSpan={5} className='py-12 text-center text-slate-400'>
                    <Layers className='w-8 h-8 mx-auto mb-2 opacity-40' />
                    <p className='font-semibold text-slate-700 dark:text-slate-300'>
                      Tidak ada skill ditemukan
                    </p>
                    <p className='text-[11px]'>Coba ganti kata kunci pencarian atau filter kategori</p>
                  </td>
                </tr>
              ) : (
                skills.map(skill => {
                  const catConfig = categoryLabels[skill.category] || {
                    label: skill.category,
                    color: 'bg-slate-100 text-slate-700 border-slate-200'
                  }

                  const totalDeps =
                    skill._count.userSkills +
                    skill._count.careerRoleSkills +
                    skill._count.resourceSkillTags +
                    skill._count.opportunitySkillTags

                  return (
                    <tr
                      key={skill.id}
                      className='hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors'
                    >
                      <td className='py-3.5 px-4 sm:px-6 font-bold text-slate-900 dark:text-white'>
                        {skill.name}
                      </td>

                      <td className='py-3.5 px-4'>
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold border ${catConfig.color}`}
                        >
                          {catConfig.label}
                        </span>
                      </td>

                      <td className='py-3.5 px-4'>
                        <code className='text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-mono'>
                          {skill.normalizedName || '-'}
                        </code>
                      </td>

                      <td className='py-3.5 px-4 text-center'>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            totalDeps > 0
                              ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                          }`}
                          title={`User: ${skill._count.userSkills}, Role: ${skill._count.careerRoleSkills}, Resource: ${skill._count.resourceSkillTags}, Opp: ${skill._count.opportunitySkillTags}`}
                        >
                          {totalDeps} Relasi
                        </span>
                      </td>

                      <td className='py-3.5 px-4 sm:px-6 text-right space-x-1.5'>
                        <button
                          onClick={() => handleOpenEdit(skill)}
                          className='p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors cursor-pointer'
                          title='Edit Skill'
                        >
                          <Edit2 className='w-4 h-4' />
                        </button>
                        <button
                          onClick={() => handlePrepareDelete(skill)}
                          className='p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer'
                          title='Hapus Skill'
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
          <div className='relative w-full max-w-md rounded-2xl bg-white dark:bg-[#121829] border border-slate-200 dark:border-slate-800 p-6 shadow-2xl'>
            <div className='flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800'>
              <h3 className='text-sm font-bold text-slate-900 dark:text-white'>
                {editingSkill ? 'Perbarui Master Skill' : 'Tambah Skill Baru'}
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
              <div>
                <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                  Nama Skill *
                </label>
                <input
                  type='text'
                  required
                  value={formName}
                  onChange={e => handleNameChange(e.target.value)}
                  placeholder='Contoh: PyTorch Deep Learning'
                  className='w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500'
                />
              </div>

              <div>
                <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                  Kategori Taksonomi *
                </label>
                <select
                  value={formCategory}
                  onChange={e => setFormCategory(e.target.value as SkillCategory)}
                  className='w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 cursor-pointer'
                >
                  <option value='technical'>Technical (Programming, Framework, Dev Tools)</option>
                  <option value='hard_skill'>Hard Skill (Metodologi, Analisis, Domain Spesifik)</option>
                  <option value='soft_skill'>Soft Skill (Komunikasi, Problem Solving, Adaptabilitas)</option>
                  <option value='leadership'>Leadership (Manajemen Tim, Stakeholder Management)</option>
                </select>
              </div>

              <div>
                <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                  Normalized Slug (Otomatis)
                </label>
                <input
                  type='text'
                  value={formNormalized}
                  onChange={e => setFormNormalized(e.target.value)}
                  placeholder='pytorch-deep-learning'
                  className='w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-purple-500'
                />
                <p className='text-[10px] text-slate-400 mt-1'>
                  Digunakan untuk normalisasi ekstraksi AI tanpa spasi/simbol
                </p>
              </div>

              <div className='flex items-center justify-end gap-2.5 pt-3'>
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
                  {formLoading ? 'Menyimpan...' : 'Simpan Data'}
                </button>
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
        title='Hapus Master Skill'
        itemName={skillToDelete?.name || ''}
        warningMessage={deleteWarning}
        isBlocked={deleteBlocked}
        loading={deleteLoading}
      />
    </div>
  )
}
