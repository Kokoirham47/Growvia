'use client'

import React, { useState, useEffect, useCallback } from 'react'

import { useParams } from 'next/navigation'
import Link from 'next/link'

import {
  ArrowLeft,
  Plus,
  Layers,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  X,
  Target
} from 'lucide-react'

type RoleSkillImportance = 'required' | 'important' | 'nice_to_have'
type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert'

interface RoleSkillItem {
  id: string
  careerRoleId: string
  skillId: string
  importance: RoleSkillImportance
  minLevel: SkillLevel
  skill: {
    id: string
    name: string
    category: string
    normalizedName: string | null
  }
}

interface MasterSkillOption {
  id: string
  name: string
  category: string
}

const importanceBadges: Record<RoleSkillImportance, { label: string; color: string }> = {
  required: {
    label: 'Required (Wajib)',
    color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 font-bold'
  },
  important: {
    label: 'Important (Penting)',
    color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 font-semibold'
  },
  nice_to_have: {
    label: 'Nice to Have',
    color: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
  }
}

const levelBadges: Record<SkillLevel, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: 'text-sky-500' },
  intermediate: { label: 'Intermediate', color: 'text-emerald-500' },
  advanced: { label: 'Advanced', color: 'text-purple-500' },
  expert: { label: 'Expert', color: 'text-amber-500' }
}

export default function AdminRoleSkillsPage() {
  const params = useParams()
  const roleId = params?.id as string

  const [roleInfo, setRoleInfo] = useState<{
    id: string
    name: string
    slug: string
    industry: string | null
    description: string | null
  } | null>(null)

  const [skills, setSkills] = useState<RoleSkillItem[]>([])
  const [masterSkills, setMasterSkills] = useState<MasterSkillOption[]>([])
  const [loading, setLoading] = useState(true)

  // Modal States
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<RoleSkillItem | null>(null)
  const [selectedSkillId, setSelectedSkillId] = useState('')
  const [importance, setImportance] = useState<RoleSkillImportance>('required')
  const [minLevel, setMinLevel] = useState<SkillLevel>('intermediate')
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // Feedback Notification
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ message, type })
    setTimeout(() => setFeedback(null), 4000)
  }

  // Load Role Skills & Master Skills
  const fetchData = useCallback(async () => {
    if (!roleId) return
    setLoading(true)

    try {
      const [resRoleSkills, resMasterSkills] = await Promise.all([
        fetch(`/api/admin/career-roles/${roleId}/skills`),
        fetch('/api/admin/skills?limit=200')
      ])

      const jsonRoleSkills = await resRoleSkills.json()
      const jsonMasterSkills = await resMasterSkills.json()

      if (jsonRoleSkills.success && jsonRoleSkills.data) {
        setRoleInfo(jsonRoleSkills.data.role)
        setSkills(jsonRoleSkills.data.skills)
      }

      if (jsonMasterSkills.success && jsonMasterSkills.data) {
        setMasterSkills(jsonMasterSkills.data.data)
      }
    } catch (err) {
      console.error('Fetch error:', err)
      showNotification('Gagal memuat data required skills', 'error')
    } finally {
      setLoading(false)
    }
  }, [roleId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingItem(null)
    setSelectedSkillId(masterSkills[0]?.id || '')
    setImportance('required')
    setMinLevel('intermediate')
    setFormError(null)
    setModalOpen(true)
  }

  // Open Edit Modal
  const handleOpenEdit = (item: RoleSkillItem) => {
    setEditingItem(item)
    setSelectedSkillId(item.skillId)
    setImportance(item.importance)
    setMinLevel(item.minLevel)
    setFormError(null)
    setModalOpen(true)
  }

  // Save Mapping
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setFormLoading(true)

    try {
      const url = editingItem
        ? `/api/admin/career-roles/${roleId}/skills/${editingItem.skillId}`
        : `/api/admin/career-roles/${roleId}/skills`

      const method = editingItem ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skillId: selectedSkillId,
          importance,
          minLevel
        })
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setFormError(data.message || 'Gagal menyimpan mapping keahlian')
        setFormLoading(false)
        
return
      }

      setModalOpen(false)
      showNotification(
        editingItem ? 'Persyaratan skill berhasil diubah' : 'Skill baru berhasil dipetakan'
      )
      fetchData()
    } catch (err) {
      console.error('Save role skill error:', err)
      setFormError('Terjadi kesalahan jaringan')
    } finally {
      setFormLoading(false)
    }
  }

  // Remove Mapping
  const handleRemove = async (skillId: string, skillName: string) => {
    if (!confirm(`Hapus pemetaan "${skillName}" dari peran ini?`)) return

    try {
      const res = await fetch(`/api/admin/career-roles/${roleId}/skills/${skillId}`, {
        method: 'DELETE'
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        showNotification(data.message || 'Gagal menghapus skill dari peran', 'error')
        
return
      }

      showNotification(`Skill "${skillName}" berhasil dihapus dari peran ini`)
      fetchData()
    } catch (err) {
      console.error('Delete role skill error:', err)
      showNotification('Gagal mencabut skill', 'error')
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

      {/* Breadcrumb Back Link */}
      <div>
        <Link
          href='/admin/career-roles'
          className='inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline'
        >
          <ArrowLeft className='w-4 h-4' />
          <span>Kembali ke Daftar Peran Karier</span>
        </Link>
      </div>

      {/* Role Header Banner */}
      <div className='rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-none flex flex-col md:flex-row md:items-center justify-between gap-6'>
        <div className='space-y-1.5'>
          <div className='inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold'>
            <span>{roleInfo?.industry || 'Umum'}</span>
          </div>
          <h2 className='text-xl sm:text-2xl font-bold text-slate-900 dark:text-white'>
            {roleInfo?.name || 'Memuat...'}
          </h2>
          <p className='text-xs text-slate-500 dark:text-slate-400 max-w-2xl'>
            {roleInfo?.description || 'Tidak ada deskripsi peran.'}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className='px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-[#2563EB] hover:bg-blue-600 active:bg-blue-700 shadow-sm shadow-blue-500/20 transition-all flex items-center gap-2 shrink-0 cursor-pointer'
        >
          <Plus className='w-4 h-4' />
          <span>Petakan Skill Baru</span>
        </button>
      </div>

      {/* Skills Table */}
      <div className='overflow-hidden rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-none'>
        <div className='p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between'>
          <h3 className='text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
            Daftar Keahlian yang Dipersyaratkan ({skills.length})
          </h3>
          <button
            onClick={fetchData}
            className='p-1.5 rounded-lg bg-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer'
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full text-left border-collapse text-xs'>
            <thead>
              <tr className='border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]'>
                <th className='py-3.5 px-4 sm:px-6'>Keahlian (Skill)</th>
                <th className='py-3.5 px-4'>Kategori</th>
                <th className='py-3.5 px-4'>Tingkat Kepentingan (Importance)</th>
                <th className='py-3.5 px-4'>Tingkat Minimum (Min Level)</th>
                <th className='py-3.5 px-4 sm:px-6 text-right'>Aksi</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100 dark:divide-slate-800/60'>
              {loading ? (
                <tr>
                  <td colSpan={5} className='py-12 text-center text-slate-400'>
                    <RefreshCw className='w-6 h-6 animate-spin mx-auto mb-2 text-blue-500' />
                    <span>Memuat pemetaan skill...</span>
                  </td>
                </tr>
              ) : skills.length === 0 ? (
                <tr>
                  <td colSpan={5} className='py-12 text-center text-slate-400'>
                    <Layers className='w-8 h-8 mx-auto mb-2 opacity-40' />
                    <p className='font-semibold text-slate-700 dark:text-slate-300'>
                      Belum ada skill yang dipetakan untuk peran ini
                    </p>
                    <p className='text-[11px]'>Klik &quot;Petakan Skill Baru&quot; untuk menambahkan kualifikasi</p>
                  </td>
                </tr>
              ) : (
                skills.map(item => {
                  const impConfig = importanceBadges[item.importance] || importanceBadges.required
                  const lvlConfig = levelBadges[item.minLevel] || levelBadges.intermediate

                  return (
                    <tr
                      key={item.id}
                      className='hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors'
                    >
                      <td className='py-3.5 px-4 sm:px-6 font-bold text-slate-900 dark:text-white'>
                        {item.skill.name}
                      </td>

                      <td className='py-3.5 px-4 capitalize text-slate-500 dark:text-slate-400'>
                        {item.skill.category.replace('_', ' ')}
                      </td>

                      <td className='py-3.5 px-4'>
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[11px] border ${impConfig.color}`}
                        >
                          {impConfig.label}
                        </span>
                      </td>

                      <td className='py-3.5 px-4 font-semibold'>
                        <span className={`inline-flex items-center gap-1.5 ${lvlConfig.color}`}>
                          <Target className='w-3.5 h-3.5' />
                          <span className='capitalize'>{item.minLevel}</span>
                        </span>
                      </td>

                      <td className='py-3.5 px-4 sm:px-6 text-right whitespace-nowrap'>
                        <div className='inline-flex items-center justify-end gap-1'>
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className='p-1.5 rounded-lg bg-transparent text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/80 dark:hover:bg-blue-950/40 transition-colors cursor-pointer'
                            title='Ubah Bobot'
                          >
                            <Edit2 className='w-4 h-4' />
                          </button>
                          <button
                            onClick={() => handleRemove(item.skillId, item.skill.name)}
                            className='p-1.5 rounded-lg bg-transparent text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50/80 dark:hover:bg-rose-950/40 transition-colors cursor-pointer'
                            title='Cabut dari Peran'
                          >
                            <Trash2 className='w-4 h-4' />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Mapping Modal */}
      {modalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in'>
          <div className='relative w-full max-w-md rounded-2xl bg-white dark:bg-[#121829] border border-slate-200 dark:border-slate-800 p-6 shadow-2xl'>
            <div className='flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800'>
              <h3 className='text-sm font-bold text-slate-900 dark:text-white'>
                {editingItem ? 'Ubah Persyaratan Skill' : 'Petakan Skill ke Peran Ini'}
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
              {/* Skill Selector */}
              <div>
                <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                  Pilih Keahlian *
                </label>
                {editingItem ? (
                  <div className='px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-800 dark:text-white'>
                    {editingItem.skill.name}
                  </div>
                ) : (
                  <select
                    required
                    value={selectedSkillId}
                    onChange={e => setSelectedSkillId(e.target.value)}
                    className='w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 cursor-pointer'
                  >
                    {masterSkills.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.category.replace('_', ' ')})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Importance */}
              <div>
                <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                  Tingkat Kepentingan (Importance) *
                </label>
                <select
                  value={importance}
                  onChange={e => setImportance(e.target.value as RoleSkillImportance)}
                  className='w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 cursor-pointer'
                >
                  <option value='required'>Required (Wajib Mutlak - Bobot Skor Tertinggi)</option>
                  <option value='important'>Important (Penting - Bobot Skor Sedang)</option>
                  <option value='nice_to_have'>Nice to Have (Pelengkap Nilai Tambah)</option>
                </select>
              </div>

              {/* Minimum Level */}
              <div>
                <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                  Tingkat Kemahiran Minimum (Min Level) *
                </label>
                <select
                  value={minLevel}
                  onChange={e => setMinLevel(e.target.value as SkillLevel)}
                  className='w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 cursor-pointer'
                >
                  <option value='beginner'>Beginner (Dasar / Pemahaman Konsep)</option>
                  <option value='intermediate'>Intermediate (Praktisi Mampu Mandiri)</option>
                  <option value='advanced'>Advanced (Mahir Berpengalaman Luas)</option>
                  <option value='expert'>Expert (Spesialis & Konsultan Utama)</option>
                </select>
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
                  {formLoading ? 'Menyimpan...' : 'Simpan Mapping'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
