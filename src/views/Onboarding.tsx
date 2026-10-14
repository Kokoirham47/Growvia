'use client'

import { useState, useEffect } from 'react'
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
  Compass
} from 'lucide-react'
import { useSettings } from '@core/hooks/useSettings'

interface EducationOption {
  id: string
  name: string
}

interface MajorOption {
  id: string
  name: string
}

const UNIVERSITIES: EducationOption[] = [
  { id: 'ui', name: 'Universitas Indonesia' },
  { id: 'itb', name: 'Institut Teknologi Bandung' },
  { id: 'ugm', name: 'Universitas Gadjah Mada' },
  { id: 'its', name: 'Institut Teknologi Sepuluh Nopember' },
  { id: 'unpad', name: 'Universitas Padjadjaran' },
  { id: 'undip', name: 'Universitas Diponegoro' },
  { id: 'ub', name: 'Universitas Brawijaya' },
  { id: 'unair', name: 'Universitas Airlangga' },
  { id: 'uin-jkt', name: 'UIN Syarif Hidayatullah Jakarta' },
  { id: 'binus', name: 'Bina Nusantara University' },
  { id: 'telkom', name: 'Telkom University' }
]

const MAJORS: MajorOption[] = [
  { id: 'si', name: 'Sistem Informasi' },
  { id: 'ti', name: 'Teknik Informatika / Ilmu Komputer' },
  { id: 'te', name: 'Teknik Elektro' },
  { id: 'mn', name: 'Manajemen / Bisnis' },
  { id: 'ak', name: 'Akuntansi / Keuangan' },
  { id: 'dkv', name: 'Desain Komunikasi Visual' },
  { id: 'ilkom', name: 'Ilmu Komunikasi' },
  { id: 'psikologi', name: 'Psikologi' }
]

const GRADUATION_YEARS = ['2024', '2025 (Tahun ini)', '2026', '2027', '2028', '2029+']

interface CareerField {
  id: string
  name: string
}

const CAREER_FIELDS: CareerField[] = [
  { id: 'pm', name: 'Product Management' },
  { id: 'uiux', name: 'UI/UX Design' },
  { id: 'se', name: 'Software Engineering' },
  { id: 'data', name: 'Data & AI' },
  { id: 'marketing', name: 'Marketing' },
  { id: 'finance', name: 'Finance' },
  { id: 'bizdev', name: 'Business Dev' },
  { id: 'hr', name: 'Human Resources' },
  { id: 'content', name: 'Content & Creative' },
  { id: 'operations', name: 'Operations' }
]

export default function Onboarding() {
  const router = useRouter()
  const { settings, updateSettings } = useSettings()

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

  // Onboarding Step: 1 = Profil Dasar, 2 = Minat Karier
  const [currentStep, setCurrentStep] = useState<1 | 2>(1)

  // Step 1 Form States
  const [fullName, setFullName] = useState('Nabila Safitri')
  const [institution, setInstitution] = useState('Universitas Indonesia')
  const [major, setMajor] = useState('Sistem Informasi')
  const [graduationYear, setGraduationYear] = useState('2025 (Tahun ini)')

  // Step 2 Form States (Career Interests, max 3)
  const [selectedCareers, setSelectedCareers] = useState<string[]>(['uiux', 'data'])

  const toggleCareer = (careerId: string) => {
    if (selectedCareers.includes(careerId)) {
      setSelectedCareers(prev => prev.filter(id => id !== careerId))
    } else {
      if (selectedCareers.length < 3) {
        setSelectedCareers(prev => [...prev, careerId])
      }
    }
  }

  // Handle Navigation
  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1)
    } else {
      router.push('/register')
    }
  }

  const handleNextStep = () => {
    if (currentStep === 1) {
      setCurrentStep(2)
    } else {
      // Selesai onboarding, arahkan ke dashboard
      router.push('/home')
    }
  }

  const handleSkip = () => {
    router.push('/home')
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
          className={`w-full max-w-[500px] rounded-[24px] p-6 sm:p-[38px] border transition-all duration-200 ${
            isDark
              ? 'bg-[#111827] border-[#1F2937] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)]'
              : 'bg-white border-[#EDF2F7] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05),0_8px_10px_-6px_rgba(0,0,0,0.03)]'
          }`}
          aria-labelledby='onboarding-heading'
        >
          {/* STEP PROGRESS INDICATOR */}
          <div className='flex items-center justify-center mb-6'>
            <div className='flex items-center w-full max-w-[280px]'>
              {/* Step 1 Circle */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                  currentStep >= 1
                    ? 'bg-[#2563EB] text-white'
                    : isDark
                    ? 'bg-slate-800 text-slate-400'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                1
              </div>

              {/* Progress Line 1-2 */}
              <div className='flex-1 h-0.5 mx-2 bg-slate-200 dark:bg-slate-800 relative overflow-hidden'>
                <div
                  className={`h-full bg-[#2563EB] transition-all duration-300 ${
                    currentStep >= 2 ? 'w-full' : 'w-0'
                  }`}
                />
              </div>

              {/* Step 2 Circle */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                  currentStep >= 2
                    ? 'bg-[#2563EB] text-white'
                    : isDark
                    ? 'bg-slate-800 text-slate-400'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                2
              </div>

              {/* Progress Line 2-3 */}
              <div className='flex-1 h-0.5 mx-2 bg-slate-200 dark:bg-slate-800 relative overflow-hidden'>
                <div className='h-full bg-[#2563EB] transition-all duration-300 w-0' />
              </div>

              {/* Step 3 Circle (Dashboard/Next) */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                  isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-400'
                }`}
              >
                3
              </div>
            </div>
          </div>

          {/* STEP 1: PROFIL DASAR */}
          {currentStep === 1 && (
            <div>
              {/* Badge: Step 1 dari 3 • Profil Dasar */}
              <div className='text-center mb-3'>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11.5px] font-medium ${
                    isDark
                      ? 'bg-blue-950/40 text-blue-400'
                      : 'bg-blue-50 text-[#2563EB]'
                  }`}
                >
                  <span className='w-1.5 h-1.5 rounded-full bg-[#2563EB]' />
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
                  <span>Hei, kenalan dulu yuk!</span>
                  <span>👋</span>
                </h1>
                <p className={`text-[13px] sm:text-[13.5px] leading-relaxed max-w-[420px] mx-auto ${
                  isDark ? 'text-slate-400' : 'text-[#64748B]'
                }`}>
                  Kami butuh beberapa info untuk mulai memetakan tolok ukur dan perjalanan kariermu.
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
                      Terverifikasi
                    </span>
                  </div>
                  <div className='relative'>
                    <input
                      id='fullName'
                      type='text'
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className={`w-full h-[44px] px-3.5 pr-10 text-[14px] rounded-[12px] transition-all outline-none border ${
                        isDark
                          ? 'bg-[#0B0F19] border-[#1F2937] text-white hover:border-[#374151] focus:border-[#3B82F6]'
                          : 'bg-white border-[#DCE3EF] text-[#1E293B] hover:border-[#CBD5E1] focus:border-[#2563EB]'
                      }`}
                    />
                    <div className='absolute right-3.5 top-1/2 -translate-y-1/2 text-[#10B981]'>
                      <CheckCircle2 className='w-4 h-4' />
                    </div>
                  </div>
                </div>

                {/* 2. Institusi Pendidikan */}
                <div>
                  <label
                    htmlFor='institution'
                    className={`block text-[13px] font-medium mb-1.5 ${
                      isDark ? 'text-slate-200' : 'text-[#334155]'
                    }`}
                  >
                    Institusi Pendidikan
                  </label>
                  <div className='relative'>
                    <div className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400'>
                      <GraduationCap className='w-4 h-4' />
                    </div>
                    <select
                      id='institution'
                      value={institution}
                      onChange={e => setInstitution(e.target.value)}
                      className={`w-full h-[44px] pl-10 pr-9 text-[14px] rounded-[12px] transition-all outline-none border appearance-none cursor-pointer ${
                        isDark
                          ? 'bg-[#0B0F19] border-[#1F2937] text-white hover:border-[#374151] focus:border-[#3B82F6]'
                          : 'bg-white border-[#DCE3EF] text-[#1E293B] hover:border-[#CBD5E1] focus:border-[#2563EB]'
                      }`}
                    >
                      {UNIVERSITIES.map(u => (
                        <option key={u.id} value={u.name} className={isDark ? 'bg-[#111827]' : 'bg-white'}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                    <div className='absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400'>
                      <ChevronDown className='w-4 h-4' />
                    </div>
                  </div>
                </div>

                {/* 3. Jurusan / Program Studi */}
                <div>
                  <label
                    htmlFor='major'
                    className={`block text-[13px] font-medium mb-1.5 ${
                      isDark ? 'text-slate-200' : 'text-[#334155]'
                    }`}
                  >
                    Jurusan / Program Studi
                  </label>
                  <div className='relative'>
                    <div className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400'>
                      <BookOpen className='w-4 h-4' />
                    </div>
                    <select
                      id='major'
                      value={major}
                      onChange={e => setMajor(e.target.value)}
                      className={`w-full h-[44px] pl-10 pr-9 text-[14px] rounded-[12px] transition-all outline-none border appearance-none cursor-pointer ${
                        isDark
                          ? 'bg-[#0B0F19] border-[#1F2937] text-white hover:border-[#374151] focus:border-[#3B82F6]'
                          : 'bg-white border-[#DCE3EF] text-[#1E293B] hover:border-[#CBD5E1] focus:border-[#2563EB]'
                      }`}
                    >
                      {MAJORS.map(m => (
                        <option key={m.id} value={m.name} className={isDark ? 'bg-[#111827]' : 'bg-white'}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                    <div className='absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400'>
                      <ChevronDown className='w-4 h-4' />
                    </div>
                  </div>
                </div>

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
                  className={`p-3 rounded-xl border flex items-start gap-2.5 text-[12px] leading-relaxed transition-colors ${
                    isDark
                      ? 'bg-blue-950/20 border-blue-900/40 text-blue-300'
                      : 'bg-[#EFF6FF] border-[#DBEAFE] text-[#1E40AF]'
                  }`}
                >
                  <Sparkles className='w-4 h-4 shrink-0 mt-0.5 text-blue-500' />
                  <span>
                    Data ini membantu AI kami menyesuaikan tolok ukur magang & kualifikasi fresh graduate yang paling akurat dengan kurikulum kampusmu.
                  </span>
                </div>

                {/* Submit Step 1 Button */}
                <div className='pt-2'>
                  <button
                    type='button'
                    onClick={handleNextStep}
                    className='w-full h-[44px] bg-[#2563EB] hover:bg-[#1D4ED8] dark:hover:bg-[#3B82F6] active:bg-[#1E40AF] text-white font-medium text-[14px] rounded-[12px] transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer'
                  >
                    <span>Lanjut ke Minat Karier</span>
                    <ArrowRight className='w-4 h-4' />
                  </button>
                </div>

                {/* Data Privacy Note below button */}
                <div className='text-center pt-1'>
                  <span className={`text-[11.5px] inline-flex items-center gap-1.5 ${isDark ? 'text-slate-500' : 'text-[#94A3B8]'}`}>
                    <Lock className='w-3 h-3' />
                    Informasimu dienkripsi & hanya dipakai untuk kalibrasi karier.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: MINAT KARIER */}
          {currentStep === 2 && (
            <div>
              {/* Badge: Step 2 dari 3 • Pilihan Minat Karier */}
              <div className='text-center mb-3'>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11.5px] font-medium ${
                    isDark
                      ? 'bg-blue-950/40 text-blue-400'
                      : 'bg-blue-50 text-[#2563EB]'
                  }`}
                >
                  <span className='w-1.5 h-1.5 rounded-full bg-[#2563EB]' />
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
                <p className={`text-[13px] sm:text-[13.5px] leading-relaxed max-w-[420px] mx-auto ${
                  isDark ? 'text-slate-400' : 'text-[#64748B]'
                }`}>
                  Pilih 1–3 bidang. Ini akan membantu Growvia memetakan kurikulum belajar dan rekomendasi karier yang tepat.
                </p>
              </div>

              {/* Counter Pill */}
              <div className='flex items-center justify-between mb-3 text-[12px]'>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-medium ${
                  selectedCareers.length > 0
                    ? 'bg-blue-50 text-[#2563EB] dark:bg-blue-950/40 dark:text-blue-300'
                    : isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  <Compass className='w-3.5 h-3.5' />
                  {selectedCareers.length} dari 3 dipilih
                </span>
                <span className={`text-[11.5px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Maksimal 3 preferensi utama
                </span>
              </div>

              {/* Career Option Chips (Grid 3 cols) */}
              <div className='grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-5'>
                {CAREER_FIELDS.map(career => {
                  const isSelected = selectedCareers.includes(career.id)
                  return (
                    <button
                      key={career.id}
                      type='button'
                      onClick={() => toggleCareer(career.id)}
                      className={`h-[42px] px-3 rounded-[12px] text-[13px] font-medium transition-all flex items-center justify-center gap-1.5 border cursor-pointer ${
                        isSelected
                          ? 'bg-[#EFF6FF] border-[#2563EB] text-[#2563EB] font-semibold dark:bg-blue-950/50 dark:border-blue-500 dark:text-blue-300 ring-2 ring-blue-500/10'
                          : isDark
                          ? 'bg-[#0B0F19] border-[#1F2937] text-slate-300 hover:border-slate-700 hover:bg-[#111827]'
                          : 'bg-white border-[#E2E8F0] text-[#334155] hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      {isSelected && <Check className='w-3.5 h-3.5' />}
                      <span>{career.name}</span>
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
                    Rekomendasi AI Sesuai Profil
                  </strong>
                  Berdasarkan program studi dan minat awalmu, pilihan terpopuler alumni serupa adalah <strong>UI/UX Design</strong> & <strong>Data & AI</strong>.
                </div>
              </div>

              {/* Action Buttons: Lewati & Lanjut */}
              <div className='flex items-center justify-between gap-3 pt-1'>
                <button
                  type='button'
                  onClick={handleSkip}
                  className={`text-[13px] font-medium transition-colors px-2 py-1.5 cursor-pointer ${
                    isDark ? 'text-slate-400 hover:text-white' : 'text-[#64748B] hover:text-[#1E293B]'
                  }`}
                >
                  Lewati untuk sekarang
                </button>
                <button
                  type='button'
                  onClick={handleNextStep}
                  disabled={selectedCareers.length === 0}
                  className='h-[44px] px-6 bg-[#2563EB] hover:bg-[#1D4ED8] dark:hover:bg-[#3B82F6] active:bg-[#1E40AF] text-white font-medium text-[14px] rounded-[12px] transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed'
                >
                  <span>Lanjut</span>
                  <ArrowRight className='w-4 h-4' />
                </button>
              </div>
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
