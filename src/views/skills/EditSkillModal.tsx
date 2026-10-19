'use client'

import React, { useState, useEffect } from 'react'
import { X, Pencil, Sparkles, Trash2 } from 'lucide-react'
import { SkillItem, SkillLevelType } from '@/types/skills'

interface EditSkillModalProps {
  isOpen: boolean
  skill: SkillItem | null
  onClose: () => void
  onUpdateSkill: (updatedSkill: SkillItem) => void
  onDeleteSkill?: (skillId: string) => void
}

export default function EditSkillModal({
  isOpen,
  skill,
  onClose,
  onUpdateSkill,
  onDeleteSkill
}: EditSkillModalProps) {
  const [level, setLevel] = useState<SkillLevelType>('intermediate')
  const [score, setScore] = useState<number>(75)
  const [subCategory, setSubCategory] = useState('')
  const [evidenceTagsInput, setEvidenceTagsInput] = useState('')

  useEffect(() => {
    if (skill) {
      setLevel(skill.level)
      setScore(skill.score)
      setSubCategory(skill.subCategory || '')
      setEvidenceTagsInput(skill.evidenceTags ? skill.evidenceTags.join(', ') : '')
    }
  }, [skill])

  if (!isOpen || !skill) return null

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()

    const tags = evidenceTagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)

    onUpdateSkill({
      ...skill,
      level,
      score,
      subCategory: subCategory.trim() || undefined,
      evidenceTags: tags
    })

    onClose()
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200'>
      <div className='bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col gap-5'>
        {/* Header */}
        <div className='flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800'>
          <div className='flex items-center gap-2.5'>
            <div className='w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-[#2563EB]'>
              <Pencil className='w-4 h-4' />
            </div>
            <div>
              <h3 className='font-bold text-lg text-slate-900 dark:text-white tracking-tight'>
                Edit Skill: {skill.name}
              </h3>
              <p className='text-xs text-slate-500'>Perbarui tingkat kemahiran dan portofolio</p>
            </div>
          </div>

          <button
            type='button'
            onClick={onClose}
            className='p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className='flex flex-col gap-4 text-xs sm:text-sm'>
          {/* Subcategory */}
          <div>
            <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1'>
              Fokus / Sub-domain
            </label>
            <input
              type='text'
              value={subCategory}
              onChange={e => setSubCategory(e.target.value)}
              placeholder='contoh: Strategic & Team Steering'
              className='w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
            />
          </div>

          {/* Level */}
          <div>
            <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1'>
              Level Kemahiran
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

          {/* Score Slider */}
          <div>
            <div className='flex justify-between font-semibold text-slate-700 dark:text-slate-300 mb-1'>
              <span>Kekuatan Kemahiran</span>
              <span className='text-[#2563EB] font-bold'>{score}%</span>
            </div>
            <input
              type='range'
              min='10'
              max='100'
              step='1'
              value={score}
              onChange={e => setScore(Number(e.target.value))}
              className='w-full accent-blue-600 mt-2 cursor-pointer'
            />
          </div>

          {/* Evidence Tags */}
          <div>
            <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1'>
              Tag Bukti Pengalaman
            </label>
            <input
              type='text'
              value={evidenceTagsInput}
              onChange={e => setEvidenceTagsInput(e.target.value)}
              placeholder='contoh: BEM, Magang, Proyek Lab'
              className='w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
            />
          </div>

          {/* Buttons */}
          <div className='flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 mt-2'>
            {onDeleteSkill ? (
              <button
                type='button'
                onClick={() => {
                  if (confirm(`Hapus skill ${skill.name}?`)) {
                    onDeleteSkill(skill.id)
                    onClose()
                  }
                }}
                className='inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold cursor-pointer'
              >
                <Trash2 className='w-4 h-4' />
                <span>Hapus</span>
              </button>
            ) : (
              <div />
            )}

            <div className='flex items-center gap-2'>
              <button
                type='button'
                onClick={onClose}
                className='px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 cursor-pointer'
              >
                Batal
              </button>
              <button
                type='submit'
                className='px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-semibold shadow-sm hover:shadow active:scale-[0.98] transition-all cursor-pointer'
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
