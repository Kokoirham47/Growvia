'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
  Sun,
  Moon,
  Check,
  CheckCircle2,
  GraduationCap,
  BookOpen,
  Calendar,
  ChevronDown,
  Sparkles,
  Lock,
  Compass,
  Briefcase,
  Code2,
  Palette,
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  PenTool,
  Settings,
  Plus,
  Building2,
  Clock,
  FileText,
  AlertCircle,
  Loader2,
  Layers
} from 'lucide-react'
import { useSettings } from '@core/hooks/useSettings'
import { useAuth } from '@/contexts/AuthContext'
import SearchableSelect, { SelectOption } from '@/components/ui/SearchableSelect'
import { INDONESIAN_UNIVERSITIES, INDONESIAN_MAJORS } from '@/data/indonesianEducation'

const GRADUATION_YEARS = [
  '2023',
  '2024',
  '2025 (Tahun ini)',
  '2026',
  '2027',
  '2028',
  '2029+'
]

interface DbCareerField {
  id: string
  name: string
  slug: string
  icon?: string | null
}

const FALLBACK_CAREER_FIELDS: DbCareerField[] = [
  { id: '1', name: 'UI/UX & Product Design', slug: 'ui-ux-design', icon: 'palette' },
  { id: '2', name: 'Software Engineering', slug: 'software-engineering', icon: 'code' },
  { id: '3', name: 'Product Management', slug: 'product-management', icon: 'briefcase' },
  { id: '4', name: 'Data Science & AI', slug: 'data-science-ai', icon: 'chart-bar' },
  { id: '5', name: 'Digital Marketing & Growth', slug: 'digital-marketing', icon: 'trending-up' },
  { id: '6', name: 'Finance & Business', slug: 'finance-business', icon: 'dollar-sign' },
  { id: '7', name: 'Human Resources & People', slug: 'human-resources', icon: 'users' },
  { id: '8', name: 'Content & Creative Writing', slug: 'content-creative', icon: 'feather' },
  { id: '9', name: 'Operations & Strategy', slug: 'operations-strategy', icon: 'settings' }
]

export default function Onboarding() {
  const router = useRouter()
  const { settings, updateSettings } = useSettings()
  const { user, profile, refreshUser } = useAuth()

  // Memoized options for searchable selects
  const universityOptions: SelectOption[] = useMemo(() => {
    return INDONESIAN_UNIVERSITIES.map(u => ({
      id: u.id,
      label: u.name,
      subtext: `${u.shortName ? u.shortName + ' • ' : ''}${u.city || ''}`,
      badge: u.type
    }))
  }, [])

  const majorOptions: SelectOption[] = useMemo(() => {
    return INDONESIAN_MAJORS.map(m => ({
      id: m.id,
      label: m.name,
      badge: m.facultyGroup
    }))
  }, [])

  // Theme support
  const [systemIsDark, setSystemIsDark] = useState(false)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      setSystemIsDark(mediaQuery.matches)
      const handler = (e: MediaQueryListEvent) => setSystemIsDark(e.matches)
      mediaQuery.addEventListener('change', handler)
      return () => mediaQuery.removeEventListener('change', handler)
    }
  }, [])

  const isDark = settings.mode === 'dark' || (settings.mode === 'system' && systemIsDark)

  // Stepper state: 1 = Basic Profile, 2 = Career Interest, 3 = First Experience Prompt
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Step 1: Basic Profile States
  const [fullName, setFullName] = useState('')
  const [selectedInstitution, setSelectedInstitution] = useState('Universitas Indonesia')
  const [selectedMajor, setSelectedMajor] = useState('Sistem Informasi')
  const [graduationYear, setGraduationYear] = useState('2026')

  // Step 2: Career Interests States
  const [careerFields, setCareerFields] = useState<DbCareerField[]>(FALLBACK_CAREER_FIELDS)
  const [selectedCareerIds, setSelectedCareerIds] = useState<string[]>([])

  // Step 3: Experience Form States
  const [showExperienceForm, setShowExperienceForm] = useState(false)
  const [experienceData, setExperienceData] = useState({
    title: '',
    type: 'organisation',
    role: '',
    institutionName: '',
    startDate: '',
    endDate: '',
    isOngoing: false,
    description: ''
  })

  // Pre-fill user data once auth loads
  useEffect(() => {
    if (user?.name && !fullName) {
      setFullName(user.name)
    }
    if (profile?.institution) {
      setSelectedInstitution(profile.institution)
    }
    if (profile?.major) {
      setSelectedMajor(profile.major)
    }
    if (profile?.graduationYear) {
      setGraduationYear(String(profile.graduationYear))
    }
  }, [user, profile, fullName])

  // Fetch career fields from database
  useEffect(() => {
    const fetchCareerFields = async () => {
      try {
        const res = await fetch('/api/career-fields')
        if (res.ok) {
          const json = await res.json()
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            setCareerFields(json.data)
          }
        }
      } catch (err) {
        console.error('Failed to load career fields:', err)
      }
    }

    const checkExistingStatus = async () => {
      try {
        const res = await fetch('/api/onboarding/status')
        if (res.ok) {
          const json = await res.json()
          if (json.success && json.data) {
            if (Array.isArray(json.data.interests) && json.data.interests.length > 0) {
              setSelectedCareerIds(json.data.interests.map((ci: DbCareerField) => ci.id))
            }
          }
        }
      } catch (err) {
        console.error('Failed to load onboarding status:', err)
      }
    }

    fetchCareerFields()
    checkExistingStatus()
  }, [])

  // Toggle selection for Career Interests (Max 3)
  const toggleCareer = (careerId: string) => {
    setErrorMessage(null)
    if (selectedCareerIds.includes(careerId)) {
      setSelectedCareerIds(prev => prev.filter(id => id !== careerId))
    } else {
      if (selectedCareerIds.length >= 3) {
        setErrorMessage('Kamu hanya dapat memilih maksimal 3 bidang karier utama.')
        return
      }
      setSelectedCareerIds(prev => [...prev, careerId])
    }
  }

  // Handle Back in Stepper
  const handleBack = () => {
    setErrorMessage(null)
    if (currentStep === 3) {
      if (showExperienceForm) {
        setShowExperienceForm(false)
      } else {
        setCurrentStep(2)
      }
    } else if (currentStep === 2) {
      setCurrentStep(1)
    } else {
      router.push('/login')
    }
  }

  // Submit Step 1: Basic Profile
  const handleSaveStep1 = async () => {
    setErrorMessage(null)

    if (!fullName.trim()) {
      setErrorMessage('Nama lengkap tidak boleh kosong.')
      return
    }

    if (!selectedInstitution.trim()) {
      setErrorMessage('Silakan pilih atau ketik nama institusi pendidikan Anda.')
      return
    }

    if (!selectedMajor.trim()) {
      setErrorMessage('Silakan pilih atau ketik jurusan/program studi Anda.')
      return
    }

    const gradYearNum = parseInt(graduationYear.replace(/\D/g, ''), 10) || 2026

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/onboarding/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName.trim(),
          institution: selectedInstitution.trim(),
          major: selectedMajor.trim(),
          graduationYear: gradYearNum
        })
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        setErrorMessage(data.message || 'Gagal menyimpan profil dasar. Silakan coba lagi.')
        return
      }

      await refreshUser()
      setCurrentStep(2)
    } catch {
      setErrorMessage('Terjadi gangguan jaringan saat menyimpan profil.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Submit Step 2: Career Interests
  const handleSaveStep2 = async () => {
    setErrorMessage(null)

    if (selectedCareerIds.length === 0) {
      setErrorMessage('Pilih minimal 1 bidang karier atau klik "Lewati untuk sekarang".')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/onboarding/interests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          careerFieldIds: selectedCareerIds
        })
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        setErrorMessage(data.message || 'Gagal menyimpan pilihan bidang karier.')
        return
      }

      await refreshUser()
      setCurrentStep(3)
    } catch {
      setErrorMessage('Terjadi gangguan jaringan saat menyimpan bidang minat karier.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Skip Step 2 -> advance to Step 3
  const handleSkipStep2 = () => {
    setErrorMessage(null)
    setCurrentStep(3)
  }

  // Submit Step 3: Optional First Experience
  const handleSaveFirstExperience = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!experienceData.title.trim()) {
      setErrorMessage('Judul pengalaman wajib diisi.')
      return
    }
    if (!experienceData.role.trim()) {
      setErrorMessage('Peran / posisi wajib diisi.')
      return
    }
    if (!experienceData.institutionName.trim()) {
      setErrorMessage('Nama organisasi / institusi wajib diisi.')
      return
    }
    if (!experienceData.startDate) {
      setErrorMessage('Tanggal / bulan mulai wajib ditentukan.')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/onboarding/experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: experienceData.title.trim(),
          type: experienceData.type,
          role: experienceData.role.trim(),
          institutionName: experienceData.institutionName.trim(),
          startDate: experienceData.startDate,
          endDate: experienceData.isOngoing ? null : experienceData.endDate || null,
          isOngoing: experienceData.isOngoing,
          description: experienceData.description.trim() || undefined
        })
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        setErrorMessage(data.message || 'Gagal menyimpan pengalaman.')
        return
      }

      await refreshUser()
      // Selesai onboarding, langsung ke Dashboard
      router.push('/home')
    } catch {
      setErrorMessage('Terjadi gangguan jaringan saat menyimpan pengalaman.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Finish Onboarding without adding experience (Option B in PRD F02.3)
  const handleFinishWithoutExperience = async () => {
    setIsSubmitting(true)
    await refreshUser()
    router.push('/home')
  }

  // Render icon for career field
  const renderCareerIcon = (slug: string) => {
    switch (slug) {
      case 'ui-ux-design':
        return <Palette className='w-4 h-4' />
      case 'software-engineering':
        return <Code2 className='w-4 h-4' />
      case 'product-management':
        return <Briefcase className='w-4 h-4' />
      case 'data-science-ai':
        return <BarChart3 className='w-4 h-4' />
      case 'digital-marketing':
        return <TrendingUp className='w-4 h-4' />
      case 'finance-business':
        return <DollarSign className='w-4 h-4' />
      case 'human-resources':
        return <Users className='w-4 h-4' />
      case 'content-creative':
        return <PenTool className='w-4 h-4' />
      case 'operations-strategy':
        return <Settings className='w-4 h-4' />
      default:
        return <Layers className='w-4 h-4' />
    }
  }

  return (
    <div
      className={`min-h-screen font-poppins flex flex-col justify-between selection:bg-[#2563EB] selection:text-white relative overflow-x-hidden transition-colors duration-200 ${
        isDark ? 'bg-[#0B0F19] text-[#F8FAFC]' : 'bg-[#F5F6F8] text-[#1E293B]'
      }`}
    >
      {/* Background ambient lighting */}
      <div
        className={`absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none -z-10 transition-opacity duration-300 ${
          isDark ? 'bg-blue-600/10' : 'bg-blue-200/40'
        }`}
        aria-hidden='true'
      />
      <div
        className={`absolute top-[30%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none -z-10 transition-opacity duration-300 ${
          isDark ? 'bg-indigo-600/10' : 'bg-indigo-200/30'
        }`}
        aria-hidden='true'
      />

      {/* TOP FLOATING CONTROLS (Kembali & Mode Toggle) */}
      <div className='w-full max-w-[1280px] mx-auto px-4 sm:px-8 pt-6 sm:pt-8 flex items-center justify-between z-20'>
        {/* Tombol Kembali */}
        <button
          type='button'
          onClick={handleBack}
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all shadow-xs border cursor-pointer ${
            isDark
              ? 'bg-[#111827]/90 border-[#1F2937] text-slate-300 hover:text-white hover:bg-[#1F2937]'
              : 'bg-white/90 border-slate-200 text-[#475569] hover:text-[#1E293B] hover:bg-white'
          }`}
        >
          <ArrowLeft className='w-4 h-4' />
          <span>Kembali</span>
        </button>

        {/* Theme Toggle Switch (Sun / Moon Switch) */}
        <button
          type='button'
          onClick={() => updateSettings({ mode: isDark ? 'light' : 'dark' })}
          aria-label={isDark ? 'Beralih ke Light mode' : 'Beralih ke Dark mode'}
          title={isDark ? 'Mode Gelap (Klik untuk Light Mode)' : 'Mode Terang (Klik untuk Dark Mode)'}
          className={`relative inline-flex h-9 w-[68px] shrink-0 cursor-pointer items-center rounded-full p-1 border transition-colors duration-300 ease-in-out shadow-xs ${
            isDark
              ? 'bg-[#111827] border-[#1F2937]'
              : 'bg-white border-slate-200'
          }`}
        >
          {/* Inner Icons (Sun on Left, Moon on Right) */}
          <div className='absolute inset-0 flex items-center justify-between px-2 pointer-events-none'>
            <Sun className={`w-3.5 h-3.5 transition-opacity duration-200 ${isDark ? 'opacity-30 text-slate-400' : 'opacity-80 text-amber-500'}`} />
            <Moon className={`w-3.5 h-3.5 transition-opacity duration-200 ${isDark ? 'opacity-80 text-blue-400' : 'opacity-30 text-slate-400'}`} />
          </div>

          {/* Sliding Knob with Active Icon */}
          <span
            className={`pointer-events-none flex h-7 w-7 items-center justify-center rounded-full shadow-md transition-transform duration-300 ease-in-out ${
              isDark
                ? 'translate-x-[32px] bg-[#1E293B] text-blue-400 border border-slate-700'
                : 'translate-x-0 bg-white text-amber-500 border border-slate-100 shadow-sm'
            }`}
          >
            {isDark ? <Moon className='w-3.5 h-3.5 fill-current' /> : <Sun className='w-3.5 h-3.5 fill-current' />}
          </span>
        </button>
      </div>

      {/* MAIN CONTAINER */}
      <main className='flex-1 flex flex-col items-center justify-center px-4 py-6 sm:py-10'>
        {/* ONBOARDING CARD */}
        <section
          className={`w-full max-w-[540px] rounded-[24px] p-6 sm:p-[38px] border transition-all duration-200 shadow-xl ${
            isDark
              ? 'bg-[#111827]/90 border-[#1F2937] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)]'
              : 'bg-white/95 border-[#EDF2F7] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05),0_8px_10px_-6px_rgba(0,0,0,0.03)]'
          }`}
          aria-labelledby='onboarding-heading'
        >
          {/* STEP PROGRESS INDICATOR (3 STEPS) */}
          <div className='flex items-center justify-center mb-6'>
            <div className='flex items-center w-full max-w-[320px]'>
              {/* Step 1 Circle */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all shadow-xs ${
                  currentStep >= 1
                    ? 'bg-[#2563EB] text-white'
                    : isDark
                    ? 'bg-slate-800 text-slate-400'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {currentStep > 1 ? <Check className='w-4 h-4 stroke-[3]' /> : '1'}
              </div>

              {/* Progress Line 1-2 */}
              <div className='flex-1 h-1 mx-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden'>
                <div
                  className={`h-full bg-[#2563EB] transition-all duration-300 ${
                    currentStep >= 2 ? 'w-full' : 'w-0'
                  }`}
                />
              </div>

              {/* Step 2 Circle */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all shadow-xs ${
                  currentStep >= 2
                    ? 'bg-[#2563EB] text-white'
                    : isDark
                    ? 'bg-slate-800 text-slate-400'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {currentStep > 2 ? <Check className='w-4 h-4 stroke-[3]' /> : '2'}
              </div>

              {/* Progress Line 2-3 */}
              <div className='flex-1 h-1 mx-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden'>
                <div
                  className={`h-full bg-[#2563EB] transition-all duration-300 ${
                    currentStep >= 3 ? 'w-full' : 'w-0'
                  }`}
                />
              </div>

              {/* Step 3 Circle */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all shadow-xs ${
                  currentStep === 3
                    ? 'bg-[#2563EB] text-white'
                    : isDark
                    ? 'bg-slate-800 text-slate-400'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                3
              </div>
            </div>
          </div>

          {/* ERROR ALERT BANNER */}
          {errorMessage && (
            <div className='p-3.5 mb-5 rounded-xl border text-xs font-medium bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300 flex items-center gap-2 animate-fadeIn'>
              <AlertCircle className='w-4 h-4 shrink-0' />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 1: PROFIL DASAR (F02.1)                                  */}
          {/* ============================================================ */}
          {currentStep === 1 && (
            <div className='animate-fadeIn'>
              {/* Badge: Step 1 dari 3 • Profil Dasar */}
              <div className='text-center mb-3'>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium ${
                    isDark
                      ? 'bg-blue-950/40 text-blue-400'
                      : 'bg-blue-50 text-[#2563EB]'
                  }`}
                >
                  <span className='w-2 h-2 rounded-full bg-[#2563EB]' />
                  Step 1 dari 3 • Profil Dasar
                </span>
              </div>

              {/* Title & Description */}
              <div className='text-center mb-6'>
                <h1
                  id='onboarding-heading'
                  className={`text-[23px] sm:text-[25px] font-bold tracking-tight mb-1.5 flex items-center justify-center gap-2 ${
                    isDark ? 'text-white' : 'text-[#0F2864]'
                  }`}
                >
                  <span>Hai, kenalan dulu yuk!</span>
                  <span>👋</span>
                </h1>
                <p className={`text-[13px] sm:text-[13.5px] leading-relaxed max-w-[440px] mx-auto ${
                  isDark ? 'text-slate-400' : 'text-[#64748B]'
                }`}>
                  Lengkapi data akademikmu untuk mulai memetakan tolok ukur kompetensi dan kurikulum karier Growvia.
                </p>
              </div>

              {/* Form Fields */}
              <div className='space-y-4'>
                {/* 1. Nama Lengkap */}
                <div>
                  <div className='flex items-center justify-between mb-1.5'>
                    <label
                      htmlFor='fullName'
                      className={`text-[13px] font-medium ${
                        isDark ? 'text-slate-200' : 'text-[#334155]'
                      }`}
                    >
                      Nama Lengkap
                    </label>
                    <span className='inline-flex items-center gap-1 text-[11.5px] text-[#10B981] font-medium'>
                      <CheckCircle2 className='w-3.5 h-3.5' />
                      Data Akun Terverifikasi
                    </span>
                  </div>
                  <div className='relative'>
                    <input
                      id='fullName'
                      type='text'
                      value={fullName}
                      placeholder='Masukkan nama lengkapmu'
                      onChange={e => setFullName(e.target.value)}
                      className={`w-full h-[44px] px-3.5 pr-10 text-[14px] rounded-[12px] transition-all outline-none border ${
                        isDark
                          ? 'bg-[#0B0F19] border-[#1F2937] text-white hover:border-[#374151] focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/20'
                          : 'bg-white border-[#DCE3EF] text-[#1E293B] hover:border-[#CBD5E1] focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/15'
                      }`}
                    />
                    <div className='absolute right-3.5 top-1/2 -translate-y-1/2 text-[#10B981]'>
                      <CheckCircle2 className='w-4 h-4' />
                    </div>
                  </div>
                </div>

                {/* 2. Institusi Pendidikan / Universitas (Searchable Combobox) */}
                <SearchableSelect
                  id='institution'
                  label='Institusi Pendidikan / Perguruan Tinggi'
                  placeholder='Cari kampus (contoh: UI, ITB, UIN, BINUS, Telkom...)'
                  value={selectedInstitution}
                  onChange={setSelectedInstitution}
                  options={universityOptions}
                  icon={<GraduationCap className='w-4 h-4' />}
                  isDark={isDark}
                  allowCustom={true}
                  required={true}
                />

                {/* 3. Jurusan / Program Studi (Searchable Combobox) */}
                <SearchableSelect
                  id='major'
                  label='Jurusan / Program Studi'
                  placeholder='Cari prodi (contoh: Sistem Informasi, DKV, Bisnis...)'
                  value={selectedMajor}
                  onChange={setSelectedMajor}
                  options={majorOptions}
                  icon={<BookOpen className='w-4 h-4' />}
                  isDark={isDark}
                  allowCustom={true}
                  required={true}
                />

                {/* 4. Tahun Kelulusan */}
                <div>
                  <label
                    htmlFor='graduationYear'
                    className={`block text-[13px] font-medium mb-1.5 ${
                      isDark ? 'text-slate-200' : 'text-[#334155]'
                    }`}
                  >
                    Tahun Kelulusan (Estimasi)
                  </label>
                  <div className='relative'>
                    <div className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400'>
                      <Calendar className='w-4 h-4' />
                    </div>
                    <select
                      id='graduationYear'
                      value={graduationYear}
                      onChange={e => setGraduationYear(e.target.value)}
                      className={`w-full h-[44px] pl-10 pr-9 text-[14px] rounded-[12px] transition-all outline-none border appearance-none cursor-pointer ${
                        isDark
                          ? 'bg-[#0B0F19] border-[#1F2937] text-white hover:border-[#374151] focus:border-[#3B82F6]'
                          : 'bg-white border-[#DCE3EF] text-[#1E293B] hover:border-[#CBD5E1] focus:border-[#2563EB]'
                      }`}
                    >
                      {GRADUATION_YEARS.map(year => (
                        <option key={year} value={year} className={isDark ? 'bg-[#111827]' : 'bg-white'}>
                          {year}
                        </option>
                      ))}
                    </select>
                    <div className='absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400'>
                      <ChevronDown className='w-4 h-4' />
                    </div>
                  </div>
                </div>

                {/* AI Privacy & Helper Banner */}
                <div
                  className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-[12px] leading-relaxed transition-colors ${
                    isDark
                      ? 'bg-blue-950/20 border-blue-900/40 text-blue-300'
                      : 'bg-[#EFF6FF] border-[#DBEAFE] text-[#1E40AF]'
                  }`}
                >
                  <Sparkles className='w-4 h-4 shrink-0 mt-0.5 text-blue-500' />
                  <span>
                    Data ini membantu AI Growvia menyesuaikan tolok ukur kesiapan kerja dan rekomendasi magang yang selaras dengan kurikulum kampusmu.
                  </span>
                </div>

                {/* Submit Step 1 Button */}
                <div className='pt-2'>
                  <button
                    type='button'
                    onClick={handleSaveStep1}
                    disabled={isSubmitting}
                    className='w-full h-[44px] bg-[#2563EB] hover:bg-[#1D4ED8] dark:hover:bg-[#3B82F6] active:bg-[#1E40AF] text-white font-medium text-[14.5px] rounded-[12px] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed'
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className='w-4 h-4 animate-spin' />
                        <span>Menyimpan Profil...</span>
                      </>
                    ) : (
                      <>
                        <span>Lanjut ke Minat Karier</span>
                        <ArrowRight className='w-4 h-4' />
                      </>
                    )}
                  </button>
                </div>

                {/* Data Privacy Note below button */}
                <div className='text-center pt-1'>
                  <span className={`text-[11.5px] inline-flex items-center gap-1.5 ${isDark ? 'text-slate-500' : 'text-[#94A3B8]'}`}>
                    <Lock className='w-3 h-3' />
                    Data aman dan dilindungi enkripsi standar industri Growvia.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 2: MINAT KARIER (F02.2)                                  */}
          {/* ============================================================ */}
          {currentStep === 2 && (
            <div className='animate-fadeIn'>
              {/* Badge: Step 2 dari 3 • Pilihan Minat Karier */}
              <div className='text-center mb-3'>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium ${
                    isDark
                      ? 'bg-blue-950/40 text-blue-400'
                      : 'bg-blue-50 text-[#2563EB]'
                  }`}
                >
                  <span className='w-2 h-2 rounded-full bg-[#2563EB]' />
                  Step 2 dari 3 • Pilihan Minat Karier
                </span>
              </div>

              {/* Title & Description */}
              <div className='text-center mb-5'>
                <h1
                  id='onboarding-heading'
                  className={`text-[23px] sm:text-[25px] font-bold tracking-tight mb-1.5 ${
                    isDark ? 'text-white' : 'text-[#0F2864]'
                  }`}
                >
                  Bidang apa yang paling kamu minati?
                </h1>
                <p className={`text-[13px] sm:text-[13.5px] leading-relaxed max-w-[440px] mx-auto ${
                  isDark ? 'text-slate-400' : 'text-[#64748B]'
                }`}>
                  Pilih <strong>1 hingga 3 bidang karier</strong>. Ini membantu Growvia merancang kurikulum skill gap dan peluang magang yang terarah.
                </p>
              </div>

              {/* Counter Pill */}
              <div className='flex items-center justify-between mb-3 text-[12px]'>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium ${
                  selectedCareerIds.length > 0
                    ? 'bg-blue-50 text-[#2563EB] dark:bg-blue-950/40 dark:text-blue-300'
                    : isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  <Compass className='w-3.5 h-3.5' />
                  {selectedCareerIds.length} dari 3 dipilih
                </span>
                <span className={`text-[11.5px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Maksimal 3 preferensi utama
                </span>
              </div>

              {/* Career Option Chips (Grid 2 cols mobile, 3 cols tablet/desktop) */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5 max-h-[300px] overflow-y-auto pr-1'>
                {careerFields.map(career => {
                  const isSelected = selectedCareerIds.includes(career.id)
                  return (
                    <button
                      key={career.id}
                      type='button'
                      onClick={() => toggleCareer(career.id)}
                      className={`min-h-[46px] px-3.5 py-2.5 rounded-[12px] text-[13px] font-medium transition-all flex items-center justify-between gap-2 border text-left cursor-pointer ${
                        isSelected
                          ? 'bg-[#EFF6FF] border-[#2563EB] text-[#2563EB] font-semibold dark:bg-blue-950/50 dark:border-blue-500 dark:text-blue-300 ring-2 ring-blue-500/10'
                          : isDark
                          ? 'bg-[#0B0F19] border-[#1F2937] text-slate-300 hover:border-slate-700 hover:bg-[#111827]'
                          : 'bg-white border-[#E2E8F0] text-[#334155] hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className='flex items-center gap-2.5 truncate'>
                        <span className={`shrink-0 ${isSelected ? 'text-[#2563EB] dark:text-blue-400' : 'text-slate-400'}`}>
                          {renderCareerIcon(career.slug)}
                        </span>
                        <span className='truncate'>{career.name}</span>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                          isSelected
                            ? 'bg-[#2563EB] border-[#2563EB] text-white'
                            : isDark
                            ? 'border-slate-700'
                            : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <Check className='w-3 h-3 stroke-[3]' />}
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* AI Recommendation Box */}
              <div
                className={`p-3.5 rounded-xl border mb-6 flex items-start gap-2.5 text-[12px] leading-relaxed transition-colors ${
                  isDark
                    ? 'bg-blue-950/20 border-blue-900/40 text-blue-300'
                    : 'bg-[#EFF6FF] border-[#DBEAFE] text-[#1E40AF]'
                }`}
              >
                <div className='p-1 rounded-md bg-blue-100 text-[#2563EB] dark:bg-blue-900/60 dark:text-blue-300 shrink-0 mt-0.5'>
                  <Sparkles className='w-4 h-4' />
                </div>
                <div>
                  <strong className='font-semibold block mb-0.5 text-[#1E3A8A] dark:text-blue-200'>
                    Saran Berdasarkan Program Studi
                  </strong>
                  Mahasiswa jurusan <strong>{selectedMajor || 'terkait'}</strong> umumnya memilih kombinasi <strong>Software Engineering</strong>, <strong>UI/UX Design</strong>, atau <strong>Product Management</strong>.
                </div>
              </div>

              {/* Action Buttons: Lewati & Lanjut */}
              <div className='flex items-center justify-between gap-3 pt-1'>
                <button
                  type='button'
                  onClick={handleSkipStep2}
                  className={`text-[13px] font-medium transition-colors px-2 py-1.5 cursor-pointer ${
                    isDark ? 'text-slate-400 hover:text-white' : 'text-[#64748B] hover:text-[#1E293B]'
                  }`}
                >
                  Lewati untuk sekarang
                </button>
                <button
                  type='button'
                  onClick={handleSaveStep2}
                  disabled={isSubmitting || selectedCareerIds.length === 0}
                  className='h-[44px] px-6 bg-[#2563EB] hover:bg-[#1D4ED8] dark:hover:bg-[#3B82F6] active:bg-[#1E40AF] text-white font-medium text-[14px] rounded-[12px] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className='w-4 h-4 animate-spin' />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <span>Lanjut</span>
                      <ArrowRight className='w-4 h-4' />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 3: FIRST EXPERIENCE PROMPT (F02.3)                        */}
          {/* ============================================================ */}
          {currentStep === 3 && (
            <div className='animate-fadeIn'>
              {/* Badge: Step 3 dari 3 • Pengalaman Pertama */}
              <div className='text-center mb-3'>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium ${
                    isDark
                      ? 'bg-blue-950/40 text-blue-400'
                      : 'bg-blue-50 text-[#2563EB]'
                  }`}
                >
                  <span className='w-2 h-2 rounded-full bg-[#2563EB]' />
                  Step 3 dari 3 • Pengalaman Pertama (Opsional)
                </span>
              </div>

              {!showExperienceForm ? (
                /* Prompt Card: Option A or Option B */
                <div>
                  <div className='text-center mb-6'>
                    <div className='w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-3.5 bg-blue-500/10 text-[#2563EB] dark:bg-blue-950/60 dark:text-blue-400'>
                      <Briefcase className='w-7 h-7' />
                    </div>
                    <h1
                      id='onboarding-heading'
                      className={`text-[23px] sm:text-[25px] font-bold tracking-tight mb-2 ${
                        isDark ? 'text-white' : 'text-[#0F2864]'
                      }`}
                    >
                      Punya pengalaman yang ingin kamu tambahkan sekarang?
                    </h1>
                    <p className={`text-[13.5px] leading-relaxed max-w-[440px] mx-auto ${
                      isDark ? 'text-slate-400' : 'text-[#64748B]'
                    }`}>
                      Bisa berupa <strong>organisasi kampus</strong>, <strong>kepanitiaan</strong>, <strong>magang</strong>, <strong>proyek kelas</strong>, maupun <strong>freelance</strong>.
                    </p>
                  </div>

                  {/* Highlights Card */}
                  <div
                    className={`p-4 rounded-xl border mb-6 space-y-2.5 text-[12.5px] leading-relaxed ${
                      isDark
                        ? 'bg-slate-900/40 border-slate-800 text-slate-300'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className='flex items-center gap-2 font-semibold text-[#2563EB] dark:text-blue-400'>
                      <Sparkles className='w-4 h-4' />
                      <span>Mengapa menambah pengalaman di awal?</span>
                    </div>
                    <p>
                      AI Growvia dapat langsung mengekstraksi hard skill dan soft skill dari riwayatmu, menyusun tolok ukur readiness score, dan menyarankan materi belajar yang relevan.
                    </p>
                  </div>

                  {/* Call to Actions (Option A & Option B) */}
                  <div className='space-y-3'>
                    <button
                      type='button'
                      onClick={() => setShowExperienceForm(true)}
                      className='w-full h-[46px] bg-[#2563EB] hover:bg-[#1D4ED8] dark:hover:bg-[#3B82F6] active:bg-[#1E40AF] text-white font-medium text-[14.5px] rounded-[12px] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer'
                    >
                      <Plus className='w-4 h-4' />
                      <span>Ya, Tambah Pengalaman Sekarang</span>
                    </button>

                    <button
                      type='button'
                      onClick={handleFinishWithoutExperience}
                      disabled={isSubmitting}
                      className={`w-full h-[44px] border font-medium text-[14px] rounded-[12px] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        isDark
                          ? 'border-slate-800 text-slate-300 hover:bg-slate-800'
                          : 'border-slate-200 text-[#475569] hover:bg-slate-100'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className='w-4 h-4 animate-spin' />
                          <span>Mempersiapkan Dashboard...</span>
                        </>
                      ) : (
                        <>
                          <span>Nanti Saja, Masuk ke Dashboard</span>
                          <ArrowRight className='w-4 h-4' />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                /* Quick Experience Input Form */
                <form onSubmit={handleSaveFirstExperience} className='space-y-3.5'>
                  <div className='text-center mb-4'>
                    <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#0F2864]'}`}>
                      Input Pengalaman Pertama
                    </h2>
                    <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
                      Kamu dapat melengkapi dan mengunggah portofolio bukti kapan saja nanti di menu Experience.
                    </p>
                  </div>

                  {/* 1. Judul Pengalaman */}
                  <div>
                    <label className={`block text-[12.5px] font-medium mb-1 ${isDark ? 'text-slate-200' : 'text-[#334155]'}`}>
                      Judul Pengalaman <span className='text-rose-500'>*</span>
                    </label>
                    <input
                      type='text'
                      required
                      placeholder='Contoh: Ketua Tim Lomba 2025'
                      value={experienceData.title}
                      onChange={e => setExperienceData(prev => ({ ...prev, title: e.target.value }))}
                      className={`w-full h-[40px] px-3 text-[13.5px] rounded-[10px] outline-none border transition-all ${
                        isDark
                          ? 'bg-[#0B0F19] border-[#1F2937] text-white focus:border-[#3B82F6]'
                          : 'bg-white border-[#DCE3EF] text-[#1E293B] focus:border-[#2563EB]'
                      }`}
                    />
                  </div>

                  {/* 2. Tipe & Peran (2 Kolom) */}
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                    <div>
                      <label className={`block text-[12.5px] font-medium mb-1 ${isDark ? 'text-slate-200' : 'text-[#334155]'}`}>
                        Tipe Pengalaman <span className='text-rose-500'>*</span>
                      </label>
                      <select
                        value={experienceData.type}
                        onChange={e => setExperienceData(prev => ({ ...prev, type: e.target.value }))}
                        className={`w-full h-[40px] px-3 text-[13.5px] rounded-[10px] outline-none border cursor-pointer ${
                          isDark
                            ? 'bg-[#0B0F19] border-[#1F2937] text-white focus:border-[#3B82F6]'
                            : 'bg-white border-[#DCE3EF] text-[#1E293B] focus:border-[#2563EB]'
                        }`}
                      >
                        <option value='organisation'>Organisasi</option>
                        <option value='committee'>Kepanitiaan</option>
                        <option value='internship'>Magang (Internship)</option>
                        <option value='project'>Proyek Mandiri / Kelas</option>
                        <option value='competition'>Kompetisi / Lomba</option>
                        <option value='freelance'>Freelance</option>
                        <option value='other'>Lainnya</option>
                      </select>
                    </div>

                    <div>
                      <label className={`block text-[12.5px] font-medium mb-1 ${isDark ? 'text-slate-200' : 'text-[#334155]'}`}>
                        Peran / Posisi <span className='text-rose-500'>*</span>
                      </label>
                      <input
                        type='text'
                        required
                        placeholder='Contoh: Project Lead / Staff'
                        value={experienceData.role}
                        onChange={e => setExperienceData(prev => ({ ...prev, role: e.target.value }))}
                        className={`w-full h-[40px] px-3 text-[13.5px] rounded-[10px] outline-none border transition-all ${
                          isDark
                            ? 'bg-[#0B0F19] border-[#1F2937] text-white focus:border-[#3B82F6]'
                            : 'bg-white border-[#DCE3EF] text-[#1E293B] focus:border-[#2563EB]'
                        }`}
                      />
                    </div>
                  </div>

                  {/* 3. Nama Institusi / Perusahaan / Organisasi */}
                  <div>
                    <label className={`block text-[12.5px] font-medium mb-1 ${isDark ? 'text-slate-200' : 'text-[#334155]'}`}>
                      Organisasi / Perusahaan / Lembaga <span className='text-rose-500'>*</span>
                    </label>
                    <div className='relative'>
                      <div className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400'>
                        <Building2 className='w-4 h-4' />
                      </div>
                      <input
                        type='text'
                        required
                        placeholder='Contoh: BEM Fakultas / PT Digital Sejahtera'
                        value={experienceData.institutionName}
                        onChange={e => setExperienceData(prev => ({ ...prev, institutionName: e.target.value }))}
                        className={`w-full h-[40px] pl-9 pr-3 text-[13.5px] rounded-[10px] outline-none border transition-all ${
                          isDark
                            ? 'bg-[#0B0F19] border-[#1F2937] text-white focus:border-[#3B82F6]'
                            : 'bg-white border-[#DCE3EF] text-[#1E293B] focus:border-[#2563EB]'
                        }`}
                      />
                    </div>
                  </div>

                  {/* 4. Periode (Mulai & Selesai) */}
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                    <div>
                      <label className={`block text-[12.5px] font-medium mb-1 ${isDark ? 'text-slate-200' : 'text-[#334155]'}`}>
                        Tanggal Mulai <span className='text-rose-500'>*</span>
                      </label>
                      <input
                        type='date'
                        required
                        value={experienceData.startDate}
                        onChange={e => setExperienceData(prev => ({ ...prev, startDate: e.target.value }))}
                        className={`w-full h-[40px] px-3 text-[13px] rounded-[10px] outline-none border cursor-pointer ${
                          isDark
                            ? 'bg-[#0B0F19] border-[#1F2937] text-white focus:border-[#3B82F6]'
                            : 'bg-white border-[#DCE3EF] text-[#1E293B] focus:border-[#2563EB]'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-[12.5px] font-medium mb-1 ${isDark ? 'text-slate-200' : 'text-[#334155]'}`}>
                        Tanggal Selesai
                      </label>
                      <input
                        type='date'
                        disabled={experienceData.isOngoing}
                        value={experienceData.endDate}
                        onChange={e => setExperienceData(prev => ({ ...prev, endDate: e.target.value }))}
                        className={`w-full h-[40px] px-3 text-[13px] rounded-[10px] outline-none border cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                          isDark
                            ? 'bg-[#0B0F19] border-[#1F2937] text-white focus:border-[#3B82F6]'
                            : 'bg-white border-[#DCE3EF] text-[#1E293B] focus:border-[#2563EB]'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Checkbox Masih Berlangsung */}
                  <div className='flex items-center gap-2'>
                    <input
                      id='isOngoing'
                      type='checkbox'
                      checked={experienceData.isOngoing}
                      onChange={e => setExperienceData(prev => ({ ...prev, isOngoing: e.target.checked }))}
                      className='rounded text-blue-600 cursor-pointer'
                    />
                    <label htmlFor='isOngoing' className={`text-xs cursor-pointer select-none ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      Masih berlangsung saat ini
                    </label>
                  </div>

                  {/* 5. Deskripsi Singkat */}
                  <div>
                    <label className={`block text-[12.5px] font-medium mb-1 ${isDark ? 'text-slate-200' : 'text-[#334155]'}`}>
                      Deskripsi Aktivitas & Pencapaian (Opsional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder='Ceritakan secara ringkas tugas dan hasil yang kamu capai...'
                      value={experienceData.description}
                      onChange={e => setExperienceData(prev => ({ ...prev, description: e.target.value }))}
                      className={`w-full p-2.5 text-[13px] rounded-[10px] outline-none border transition-all resize-none ${
                        isDark
                          ? 'bg-[#0B0F19] border-[#1F2937] text-white focus:border-[#3B82F6]'
                          : 'bg-white border-[#DCE3EF] text-[#1E293B] focus:border-[#2563EB]'
                      }`}
                    />
                  </div>

                  {/* Form Action Buttons */}
                  <div className='flex items-center gap-3 pt-2'>
                    <button
                      type='button'
                      onClick={() => setShowExperienceForm(false)}
                      className={`flex-1 h-[42px] border rounded-[10px] text-[13px] font-medium transition-colors ${
                        isDark
                          ? 'border-slate-800 text-slate-300 hover:bg-slate-800'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Batal
                    </button>
                    <button
                      type='submit'
                      disabled={isSubmitting}
                      className='flex-1 h-[42px] bg-[#2563EB] hover:bg-[#1D4ED8] dark:hover:bg-[#3B82F6] active:bg-[#1E40AF] text-white font-medium text-[13.5px] rounded-[10px] transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-60 cursor-pointer'
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className='w-4 h-4 animate-spin' />
                          <span>Menyimpan...</span>
                        </>
                      ) : (
                        <>
                          <span>Simpan & Masuk Dashboard</span>
                          <ArrowRight className='w-3.5 h-3.5' />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </section>
      </main>

      {/* FOOTER */}
      <footer
        className={`w-full py-4 px-4 sm:px-8 transition-colors duration-200 text-xs ${
          isDark ? 'text-slate-500' : 'text-[#94A3B8]'
        }`}
      >
        <div className='max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3'>
          <p>© 2025 Growvia. Ubah pengalamanmu jadi peluang karier.</p>
          <div className='flex items-center gap-6'>
            <Link href='/help' className={`transition-colors ${isDark ? 'hover:text-slate-300' : 'hover:text-[#64748B]'}`}>
              Bantuan
            </Link>
            <Link href='/privacy' className={`transition-colors ${isDark ? 'hover:text-slate-300' : 'hover:text-[#64748B]'}`}>
              Kebijakan Privasi
            </Link>
            <Link href='/terms' className={`transition-colors ${isDark ? 'hover:text-slate-300' : 'hover:text-[#64748B]'}`}>
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
