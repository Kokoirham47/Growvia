'use client'

import React, { useState, useEffect, useCallback } from 'react'

import Link from 'next/link'

import {
  Search,
  Plus,
  Briefcase,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  X,
  Layers,
  ArrowRight
} from 'lucide-react'

import SafeDeleteModal from '@/components/admin/SafeDeleteModal'

interface CareerRoleItem {
  id: string
  name: string
  slug: string
  industry: string | null
  description: string | null
  createdAt: string
  _count: {
    roleSkills: number
    userTargets: number
  }
}

export default function AdminCareerRolesPage() {
  const [roles, setRoles] = useState<CareerRoleItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  // Modal Form States
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<CareerRoleItem | null>(null)
  const [formName, setFormName] = useState('')
  const [formSlug, setFormSlug] = useState('')
  const [formIndustry, setFormIndustry] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // Safe Delete States
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState<CareerRoleItem | null>(null)
  const [deleteWarning, setDeleteWarning] = useState<string | null>(null)
  const [deleteBlocked, setDeleteBlocked] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Feedback Notification
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ message, type })
    setTimeout(() => setFeedback(null), 4000)
  }

  const fetchRoles = useCallback(async () => {
    setLoading(true)

    try {
      const params = new URLSearchParams()

      if (search.trim()) params.set('search', search.trim())

      const res = await fetch(`/api/admin/career-roles?${params.toString()}`)
      const json = await res.json()

      if (json.success && json.data) {
        setRoles(json.data.data)
      }
    } catch (err) {
      console.error('Fetch career roles error:', err)
      showNotification('Gagal memuat peran karier', 'error')
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    fetchRoles()
  }, [fetchRoles])

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingRole(null)
    setFormName('')
    setFormSlug('')
    setFormIndustry('')
    setFormDescription('')
    setFormError(null)
    setModalOpen(true)
  }

  // Open Edit Modal
  const handleOpenEdit = (role: CareerRoleItem) => {
    setEditingRole(role)
    setFormName(role.name)
    setFormSlug(role.slug)
    setFormIndustry(role.industry || '')
    setFormDescription(role.description || '')
    setFormError(null)
    setModalOpen(true)
  }

  // Handle Form Name Change with auto-slug
  const handleNameChange = (val: string) => {
    setFormName(val)

    if (!editingRole) {
      const generated = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

      setFormSlug(generated)
    }
  }

  // Save Add/Edit
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setFormLoading(true)

    try {
      const url = editingRole ? `/api/admin/career-roles/${editingRole.id}` : '/api/admin/career-roles'
      const method = editingRole ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          slug: formSlug,
          industry: formIndustry,
          description: formDescription
        })
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setFormError(data.message || 'Gagal menyimpan peran karier')
        setFormLoading(false)
        
return
      }

      setModalOpen(false)
      showNotification(
        editingRole ? 'Peran karier berhasil diperbarui' : 'Peran karier baru berhasil ditambahkan'
      )
      fetchRoles()
    } catch (err) {
      console.error('Save role error:', err)
      setFormError('Terjadi kesalahan jaringan')
    } finally {
      setFormLoading(false)
    }
  }

  // Prepare Delete
  const handlePrepareDelete = (role: CareerRoleItem) => {
    setRoleToDelete(role)

    if (role._count.userTargets > 0) {
      setDeleteBlocked(true)
      setDeleteWarning(
        `Peran ini sedang dipilih sebagai target karier aktif oleh ${role._count.userTargets} pengguna. Sistem mencegah penghapusan untuk melindungi konsistensi data.`
      )
    } else {
      setDeleteBlocked(false)
      setDeleteWarning(
        role._count.roleSkills > 0
          ? `Peran ini memiliki ${role._count.roleSkills} pemetaan keahlian yang akan ikut terhapus otomatis.`
          : null
      )
    }

    setDeleteModalOpen(true)
  }

  // Execute Delete
  const handleExecuteDelete = async () => {
    if (!roleToDelete) return
    setDeleteLoading(true)

    try {
      const res = await fetch(`/api/admin/career-roles/${roleToDelete.id}`, {
        method: 'DELETE'
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        setDeleteWarning(json.message || 'Gagal menghapus peran karier')
        setDeleteBlocked(true)
        setDeleteLoading(false)
        
return
      }

      setDeleteModalOpen(false)
      showNotification(`Peran "${roleToDelete.name}" berhasil dihapus`)
      fetchRoles()
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
            Katalog Peran Karier & Paths
          </h2>
          <p className='text-xs text-slate-500 dark:text-slate-400'>
            Total {roles.length} jalur karier rujukan untuk analisis gap dan readiness score
          </p>
        </div>

        <div className='flex items-center gap-3'>
          <button
            onClick={() => fetchRoles()}
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
            <span>Tambah Peran Karier</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className='p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-none flex items-center justify-between'>
        <div className='relative w-full sm:w-96'>
          <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400'>
            <Search className='w-4 h-4' />
          </div>
          <input
            type='text'
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder='Cari peran karier atau industri...'
            className='w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all'
          />
        </div>
      </div>

      {/* Table Content */}
      <div className='overflow-hidden rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-none'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left border-collapse text-xs'>
            <thead>
              <tr className='border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]'>
                <th className='py-3.5 px-4 sm:px-6'>Nama Peran Karier</th>
                <th className='py-3.5 px-4'>Industri</th>
                <th className='py-3.5 px-4 text-center'>Required Skills</th>
                <th className='py-3.5 px-4 text-center'>Pengguna Aktif</th>
                <th className='py-3.5 px-4 sm:px-6 text-right'>Aksi</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100 dark:divide-slate-800/60'>
              {loading ? (
                <tr>
                  <td colSpan={5} className='py-12 text-center text-slate-400'>
                    <RefreshCw className='w-6 h-6 animate-spin mx-auto mb-2 text-blue-500' />
                    <span>Memuat peran karier...</span>
                  </td>
                </tr>
              ) : roles.length === 0 ? (
                <tr>
                  <td colSpan={5} className='py-12 text-center text-slate-400'>
                    <Briefcase className='w-8 h-8 mx-auto mb-2 opacity-40' />
                    <p className='font-semibold text-slate-700 dark:text-slate-300'>
                      Belum ada peran karier
                    </p>
                    <p className='text-[11px]'>Tambahkan peran baru menggunakan tombol di atas</p>
                  </td>
                </tr>
              ) : (
                roles.map(role => (
                  <tr
                    key={role.id}
                    className='hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors'
                  >
                    <td className='py-3.5 px-4 sm:px-6'>
                      <div className='font-bold text-slate-900 dark:text-white'>
                        {role.name}
                      </div>
                      <div className='text-[11px] text-slate-400 font-mono'>
                        slug: {role.slug}
                      </div>
                    </td>

                    <td className='py-3.5 px-4'>
                      <span className='px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'>
                        {role.industry || 'Umum / Cross-Industry'}
                      </span>
                    </td>

                    <td className='py-3.5 px-4 text-center'>
                      <Link
                        href={`/admin/career-roles/${role.id}/skills`}
                        className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30 transition-colors'
                        title='Kelola pemetaan skill peran ini'
                      >
                        <Layers className='w-3.5 h-3.5' />
                        <span>{role._count.roleSkills} Skills Dipersyaratkan</span>
                        <ArrowRight className='w-3 h-3' />
                      </Link>
                    </td>

                    <td className='py-3.5 px-4 text-center'>
                      <span className='inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'>
                        {role._count.userTargets} Pengguna
                      </span>
                    </td>

                    <td className='py-3.5 px-4 sm:px-6 text-right whitespace-nowrap'>
                      <div className='inline-flex items-center justify-end gap-1'>
                        <Link
                          href={`/admin/career-roles/${role.id}/skills`}
                          className='p-1.5 rounded-lg bg-transparent text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/80 dark:hover:bg-indigo-950/40 transition-colors inline-flex items-center justify-center'
                          title='Atur Required Skills'
                        >
                          <Layers className='w-4 h-4' />
                        </Link>
                        <button
                          onClick={() => handleOpenEdit(role)}
                          className='p-1.5 rounded-lg bg-transparent text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/80 dark:hover:bg-blue-950/40 transition-colors cursor-pointer'
                          title='Edit Peran'
                        >
                          <Edit2 className='w-4 h-4' />
                        </button>
                        <button
                          onClick={() => handlePrepareDelete(role)}
                          className='p-1.5 rounded-lg bg-transparent text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50/80 dark:hover:bg-rose-950/40 transition-colors cursor-pointer'
                          title='Hapus Peran'
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
          <div className='relative w-full max-w-md rounded-2xl bg-white dark:bg-[#121829] border border-slate-200 dark:border-slate-800 p-6 shadow-2xl'>
            <div className='flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800'>
              <h3 className='text-sm font-bold text-slate-900 dark:text-white'>
                {editingRole ? 'Perbarui Peran Karier' : 'Tambah Peran Karier Baru'}
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
                  Nama Peran Karier *
                </label>
                <input
                  type='text'
                  required
                  value={formName}
                  onChange={e => handleNameChange(e.target.value)}
                  placeholder='Contoh: Senior Fullstack Engineer'
                  className='w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500'
                />
              </div>

              <div>
                <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                  Slug URL (Otomatis)
                </label>
                <input
                  type='text'
                  value={formSlug}
                  onChange={e => setFormSlug(e.target.value)}
                  placeholder='senior-fullstack-engineer'
                  className='w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-purple-500'
                />
              </div>

              <div>
                <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                  Industri / Sektor
                </label>
                <input
                  type='text'
                  value={formIndustry}
                  onChange={e => setFormIndustry(e.target.value)}
                  placeholder='Contoh: FinTech, SaaS, Healthcare'
                  className='w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500'
                />
              </div>

              <div>
                <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                  Deskripsi Peran
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  placeholder='Deskripsi tanggung jawab dan fokus kerja...'
                  className='w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 resize-none'
                />
              </div>

              <div className='flex items-center justify-end gap-2.5 pt-3'>
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
        title='Hapus Peran Karier'
        itemName={roleToDelete?.name || ''}
        warningMessage={deleteWarning}
        isBlocked={deleteBlocked}
        loading={deleteLoading}
      />
    </div>
  )
}
