'use client'

import React, { useState } from 'react'
import { X, Plus, Sparkles, Check } from 'lucide-react'
import { SkillItem, SkillCategoryType, SkillLevelType } from '@/types/skills'

interface AddSkillModalProps {
  isOpen: boolean
  onClose: () => void
  onAddSkill: (newSkill: Omit<SkillItem, 'id'>) => void
}

export default function AddSkillModal({ isOpen, onClose, onAddSkill }: AddSkillModalProps) {
  const [name, setName] = useState('')
  const [subCategory, setSubCategory] = useState('')
  const [category, setCategory] = useState<SkillCategoryType>('hard_skill')
  const [level, setLevel] = useState<SkillLevelType>('intermediate')
  const [score, setScore] = useState<number>(75)
  const [evidenceCount, setEvidenceCount] = useState<number>(2)
  const [evidenceTagsInput, setEvidenceTagsInput] = useState('Proyek Kuliah, Magang')
  const [isAiExtracted, setIsAiExtracted] = useState<boolean>(true)
  const [description, setDescription] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const tags = evidenceTagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)

    onAddSkill({
      name: name.trim(),
      subCategory: subCategory.trim() || undefined,
      category,
      level,
      score,
      evidenceCount: Math.max(1, evidenceCount),
      evidenceTags: tags.length > 0 ? tags : ['Pengalaman Mandiri'],
      source: isAiExtracted ? 'ai_extracted' : 'manual',
      aiConfidence: isAiExtracted ? 0.92 : undefined,
      isAiVerified: isAiExtracted,
      description: description.trim() || undefined
    })

    // Reset & close
    setName('')
    setSubCategory('')
    setDescription('')
    onClose()
  }

  return (
    <div className='fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200'>
      <div className='bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col gap-5 max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800'>
          <div className='flex items-center gap-2.5'>
            <div className='w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-[#2563EB]'>
              <Plus className='w-5 h-5' />
            </div>
            <div>
              <h3 className='font-bold text-lg text-slate-900 dark:text-white tracking-tight'>
                Tambah Skill Baru
              </h3>
              <p className='text-xs text-slate-500'>
                Dokumentasikan kompetensi terverifikasi ke profil kariermu
              </p>
            </div>
          </div>

          <button
            type='button'
            onClick={onClose}
            className='p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className='flex flex-col gap-4 text-xs sm:text-sm'>
          {/* Skill Name */}
          <div>
            <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1'>
              Nama Skill *
            </label>
            <input
              type='text'
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder='contoh: Data Analytics, Figma Systems, Public Speaking'
              className='w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
            />
          </div>

          {/* Subcategory */}
          <div>
            <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1'>
              Fokus / Sub-domain
            </label>
            <input
              type='text'
              value={subCategory}
              onChange={e => setSubCategory(e.target.value)}
              placeholder='contoh: SQL & Tableau, Information Architecture'
              className='w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
              Kategori Skill
            </label>
            <div className='grid grid-cols-2 gap-2'>
              {[
                { key: 'hard_skill', label: 'Hard Skill' },
                { key: 'soft_skill', label: 'Soft Skill' },
                { key: 'technical', label: 'Technical' },
                { key: 'leadership', label: 'Leadership' }
              ].map(cat => (
                <button
                  key={cat.key}
                  type='button'
                  onClick={() => setCategory(cat.key as SkillCategoryType)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    category === cat.key
                      ? 'bg-blue-50 dark:bg-blue-950/50 border-[#2563EB] text-[#2563EB]'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Level and Score */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3.5'>
            <div>
              <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1'>
                Tingkat Kemahiran
              </label>
              <select
                value={level}
                onChange={e => setLevel(e.target.value as SkillLevelType)}
                className='w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
              >
                <option value='beginner'>Beginner (Pemula)</option>
                <option value='intermediate'>Intermediate (Menengah)</option>
                <option value='advanced'>Advanced (Tingkat Lanjut)</option>
                <option value='expert'>Expert (Ahli)</option>
              </select>
            </div>

            <div>
              <div className='flex justify-between font-semibold text-slate-700 dark:text-slate-300 mb-1'>
                <span>Skor Kekuatan</span>
                <span className='text-[#2563EB]'>{score}%</span>
              </div>
              <input
                type='range'
                min='10'
                max='100'
                step='5'
                value={score}
                onChange={e => setScore(Number(e.target.value))}
                className='w-full accent-blue-600 mt-2 cursor-pointer'
              />
            </div>
          </div>

          {/* Evidence Tags */}
          <div>
            <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1'>
              Sumber Pengalaman (dipisahkan koma)
            </label>
            <input
              type='text'
              value={evidenceTagsInput}
              onChange={e => setEvidenceTagsInput(e.target.value)}
              placeholder='contoh: BEM, Magang Fintech, PKM'
              className='w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
            />
          </div>

          {/* AI Extraction Switch */}
          <div className='flex items-center justify-between p-3 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50'>
            <div className='flex items-center gap-2'>
              <Sparkles className='w-4 h-4 text-[#6366F1]' />
              <div>
                <div className='font-semibold text-xs text-indigo-950 dark:text-indigo-200'>
                  Verifikasi via Growvia AI
                </div>
                <div className='text-[11px] text-slate-500'>
                  Sematkan tanda verifikasi kecerdasan buatan
                </div>
              </div>
            </div>
            <input
              type='checkbox'
              checked={isAiExtracted}
              onChange={e => setIsAiExtracted(e.target.checked)}
              className='w-4 h-4 accent-indigo-600 cursor-pointer rounded'
            />
          </div>

          {/* Actions */}
          <div className='flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 mt-2'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 cursor-pointer'
            >
              Batal
            </button>
            <button
              type='submit'
              className='px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-semibold shadow-sm hover:shadow active:scale-[0.98] transition-all cursor-pointer'
            >
              Simpan Skill
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
