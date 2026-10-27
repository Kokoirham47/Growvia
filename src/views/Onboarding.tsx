'use client'

import { useState, useEffect } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import {
  ArrowLeft,
  Sun,
  Moon,
  Check,
  ChevronDown
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
      className={`landing-page ${isDark ? 'dark' : ''} min-h-screen font-poppins flex flex-col justify-between selection:bg-[#2563EB] selection:text-white bg-white dark:bg-[#0B0F19] text-[var(--lp-text)] transition-colors duration-200`}
    >
      {/* TOP FLOATING CONTROLS (Kembali & Mode Toggle) */}
      <div className='w-full max-w-[1280px] mx-auto px-4 sm:px-8 pt-6 sm:pt-8 flex items-center justify-between z-20'>
        {/* Tombol Kembali */}
        <button
          type='button'
          onClick={handleBack}
          className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[13px] font-medium border border-[var(--lp-border)] bg-[var(--lp-card)] text-[var(--lp-text-sec)] hover:text-[var(--lp-text)] hover:border-[var(--lp-border-strong)] transition-all shadow-xs cursor-pointer'
        >
          <ArrowLeft className='w-4 h-4' />
          <span>Kembali</span>
        </button>

        {/* Circular Theme Toggle Button */}
        <button
          type='button'
          onClick={() => updateSettings({ mode: isDark ? 'light' : 'dark' })}
          aria-label={isDark ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
          title={isDark ? 'Mode Terang' : 'Mode Gelap'}
          className='w-10 h-10 rounded-full border border-[var(--lp-border)] bg-[var(--lp-card)] text-[var(--lp-text-sec)] hover:text-[var(--lp-text)] hover:border-[var(--lp-border-strong)] flex items-center justify-center transition-colors cursor-pointer shadow-xs'
        >
          {isDark ? <Sun className='w-4 h-4' /> : <Moon className='w-4 h-4' />}
        </button>
      </div>

      {/* MAIN CONTAINER */}
      <main className='flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12'>
        {/* ONBOARDING CARD */}
        <section
          className='w-full max-w-[500px] rounded-3xl p-6 sm:p-10 border border-[var(--lp-border)] bg-[var(--lp-card)] shadow-[var(--lp-shadow-card)] transition-all'
          aria-labelledby='onboarding-heading'
        >
          {/* Logo & Brand */}
          <div className='flex justify-center mb-6'>
            <Link href='/' className='inline-flex items-center gap-2.5 group'>
              <img
                src='/images/growvia-logo.png'
                alt='Growvia'
                className='w-8 h-8 rounded-lg object-contain'
              />
              <span className='font-bold text-[19px] tracking-tight text-[var(--lp-heading)]'>
                Growvia
              </span>
            </Link>
          </div>

          {/* STEP PROGRESS INDICATOR */}
          <div className='flex items-center justify-center mb-6'>
            <div className='flex items-center w-full max-w-[200px]'>
              {/* Step 1 Circle */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                  currentStep >= 1
                    ? 'bg-[var(--lp-btn)] text-white shadow-xs'
                    : 'bg-[var(--lp-panel)] border border-[var(--lp-border)] text-[var(--lp-text-muted)]'
                }`}
              >
                1
              </div>

              {/* Progress Line 1-2 */}
              <div className='flex-1 h-0.5 mx-2 bg-[var(--lp-border)] relative overflow-hidden rounded-full'>
                <div
                  className={`h-full bg-[var(--lp-btn)] transition-all duration-300 ${
                    currentStep >= 2 ? 'w-full' : 'w-0'
                  }`}
                />
              </div>

              {/* Step 2 Circle */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                  currentStep >= 2
                    ? 'bg-[var(--lp-btn)] text-white shadow-xs'
                    : 'bg-[var(--lp-panel)] border border-[var(--lp-border)] text-[var(--lp-text-muted)]'
                }`}
              >
                2
              </div>
            </div>
          </div>

          {/* STEP 1: PROFIL DASAR */}
          {currentStep === 1 && (
            <div>
              {/* Badge: Step 1 dari 2 • Profil Dasar */}
              <div className='text-center mb-3'>
                <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[var(--lp-accent-soft)] text-[var(--lp-accent)]'>
                  <span className='w-1.5 h-1.5 rounded-full bg-[var(--lp-accent)]' />
                  Langkah 1 dari 2 • Profil Dasar
                </span>
              </div>

              {/* Title & Description */}
              <div className='text-center mb-6'>
                <h1
                  id='onboarding-heading'
                  className='text-[23px] sm:text-[25px] font-bold tracking-tight text-[var(--lp-heading)] mb-1.5'
                >
                  Kenalan dulu, yuk!
                </h1>
                <p className='text-[13.5px] text-[var(--lp-text-sec)] leading-relaxed max-w-[420px] mx-auto'>
                  Kami butuh beberapa info untuk mulai memetakan tolok ukur dan perjalanan kariermu.
                </p>
              </div>

              {/* Form Fields */}
              <div className='space-y-4'>
                {/* 1. Nama Lengkap */}
                <div>
                  <label
                    htmlFor='fullName'
                    className='block text-[13px] font-medium mb-1.5 text-[var(--lp-text)]'
                  >
                    Nama Lengkap
                  </label>
                  <input
                    id='fullName'
                    type='text'
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className='w-full h-11 px-3.5 text-sm rounded-xl transition-all outline-hidden border border-[var(--lp-border)] bg-[var(--lp-page)] text-[var(--lp-text)] focus:border-[var(--lp-accent)] focus:ring-2 focus:ring-[var(--lp-accent-soft)]'
                  />
                </div>

                {/* 2. Institusi Pendidikan */}
                <div>
                  <label
                    htmlFor='institution'
                    className='block text-[13px] font-medium mb-1.5 text-[var(--lp-text)]'
                  >
                    Institusi Pendidikan
                  </label>
                  <div className='relative'>
                    <select
                      id='institution'
                      value={institution}
                      onChange={e => setInstitution(e.target.value)}
                      className='w-full h-11 px-3.5 pr-10 text-sm rounded-xl transition-all outline-hidden border border-[var(--lp-border)] bg-[var(--lp-page)] text-[var(--lp-text)] focus:border-[var(--lp-accent)] focus:ring-2 focus:ring-[var(--lp-accent-soft)] appearance-none cursor-pointer'
                    >
                      {UNIVERSITIES.map(u => (
                        <option key={u.id} value={u.name} className={isDark ? 'bg-[#1E293B] text-white' : 'bg-white text-slate-800'}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                    <div className='absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--lp-text-muted)]'>
                      <ChevronDown className='w-4 h-4' />
                    </div>
                  </div>
                </div>

                {/* 3. Jurusan / Program Studi */}
                <div>
                  <label
                    htmlFor='major'
                    className='block text-[13px] font-medium mb-1.5 text-[var(--lp-text)]'
                  >
                    Jurusan / Program Studi
                  </label>
                  <div className='relative'>
                    <select
                      id='major'
                      value={major}
                      onChange={e => setMajor(e.target.value)}
                      className='w-full h-11 px-3.5 pr-10 text-sm rounded-xl transition-all outline-hidden border border-[var(--lp-border)] bg-[var(--lp-page)] text-[var(--lp-text)] focus:border-[var(--lp-accent)] focus:ring-2 focus:ring-[var(--lp-accent-soft)] appearance-none cursor-pointer'
                    >
                      {MAJORS.map(m => (
                        <option key={m.id} value={m.name} className={isDark ? 'bg-[#1E293B] text-white' : 'bg-white text-slate-800'}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                    <div className='absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--lp-text-muted)]'>
                      <ChevronDown className='w-4 h-4' />
                    </div>
                  </div>
                </div>

                {/* 4. Tahun Kelulusan */}
                <div>
                  <label
                    htmlFor='graduationYear'
                    className='block text-[13px] font-medium mb-1.5 text-[var(--lp-text)]'
                  >
                    Tahun Kelulusan (Estimasi)
                  </label>
                  <div className='relative'>
                    <select
                      id='graduationYear'
                      value={graduationYear}
                      onChange={e => setGraduationYear(e.target.value)}
                      className='w-full h-11 px-3.5 pr-10 text-sm rounded-xl transition-all outline-hidden border border-[var(--lp-border)] bg-[var(--lp-page)] text-[var(--lp-text)] focus:border-[var(--lp-accent)] focus:ring-2 focus:ring-[var(--lp-accent-soft)] appearance-none cursor-pointer'
                    >
                      {GRADUATION_YEARS.map(year => (
                        <option key={year} value={year} className={isDark ? 'bg-[#1E293B] text-white' : 'bg-white text-slate-800'}>
                          {year}
                        </option>
                      ))}
                    </select>
                    <div className='absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--lp-text-muted)]'>
                      <ChevronDown className='w-4 h-4' />
                    </div>
                  </div>
                </div>

                {/* Helper Banner */}
                <div className='p-3.5 rounded-2xl border border-[var(--lp-border)] bg-[var(--lp-panel)] text-xs text-[var(--lp-text-sec)] leading-relaxed'>
                  Data ini membantu sistem menyesuaikan tolok ukur magang & kualifikasi fresh graduate yang paling akurat dengan profil kampusmu.
                </div>

                {/* Submit Step 1 Button */}
                <div className='pt-2'>
                  <button
                    type='button'
                    onClick={handleNextStep}
                    className='w-full h-11 bg-[var(--lp-btn)] hover:brightness-105 active:scale-[0.99] text-white font-medium text-sm rounded-full transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer'
                  >
                    <span>Lanjut ke Minat Karier</span>
                  </button>
                </div>

                {/* Data Privacy Note below button */}
                <div className='text-center pt-1'>
                  <span className='text-[11.5px] text-[var(--lp-text-muted)]'>
                    Informasimu dienkripsi & hanya dipakai untuk kalibrasi karier.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: MINAT KARIER */}
          {currentStep === 2 && (
            <div>
              {/* Badge: Step 2 dari 2 • Pilihan Minat Karier */}
              <div className='text-center mb-3'>
                <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[var(--lp-accent-soft)] text-[var(--lp-accent)]'>
                  <span className='w-1.5 h-1.5 rounded-full bg-[var(--lp-accent)]' />
                  Langkah 2 dari 2 • Pilihan Minat Karier
                </span>
              </div>

              {/* Title & Description */}
              <div className='text-center mb-5'>
                <h1
                  id='onboarding-heading'
                  className='text-[23px] sm:text-[25px] font-bold tracking-tight text-[var(--lp-heading)] mb-1.5'
                >
                  Bidang apa yang paling kamu minati?
                </h1>
                <p className='text-[13.5px] text-[var(--lp-text-sec)] leading-relaxed max-w-[420px] mx-auto'>
                  Pilih 1–3 bidang untuk membantu Growvia memetakan rekomendasi karier yang tepat.
                </p>
              </div>

              {/* Counter Pill */}
              <div className='flex items-center justify-between mb-3 text-xs'>
                <span className='inline-flex items-center px-2.5 py-0.5 rounded-full font-medium bg-[var(--lp-accent-soft)] text-[var(--lp-accent)]'>
                  {selectedCareers.length} dari 3 dipilih
                </span>
                <span className='text-[11.5px] text-[var(--lp-text-muted)]'>
                  Maksimal 3 preferensi
                </span>
              </div>

              {/* Career Option Chips */}
              <div className='grid grid-cols-2 sm:grid-cols-3 gap-2 mb-5'>
                {CAREER_FIELDS.map(career => {
                  const isSelected = selectedCareers.includes(career.id)

                  
return (
                    <button
                      key={career.id}
                      type='button'
                      onClick={() => toggleCareer(career.id)}
                      className={`h-10 px-3 rounded-full text-xs font-medium transition-all flex items-center justify-center gap-1.5 border cursor-pointer ${
                        isSelected
                          ? 'bg-[var(--lp-accent-soft)] border-[var(--lp-accent)] text-[var(--lp-accent)] font-semibold shadow-2xs'
                          : 'bg-[var(--lp-card)] border-[var(--lp-border)] text-[var(--lp-text)] hover:border-[var(--lp-border-strong)] hover:bg-[var(--lp-panel)]'
                      }`}
                    >
                      {isSelected && <Check className='w-3 h-3 stroke-[2.5]' />}
                      <span>{career.name}</span>
                    </button>
                  )
                })}
              </div>

              {/* Recommendation Box */}
              <div className='p-4 rounded-2xl border border-[var(--lp-border)] bg-[var(--lp-panel)] mb-6 text-xs text-[var(--lp-text-sec)] leading-relaxed'>
                <strong className='font-semibold block mb-1 text-[var(--lp-heading)]'>
                  Rekomendasi Sesuai Profil
                </strong>
                Berdasarkan program studi dan minat awalmu, pilihan terpopuler alumni serupa adalah <strong className='text-[var(--lp-text)]'>UI/UX Design</strong> & <strong className='text-[var(--lp-text)]'>Data & AI</strong>.
              </div>

              {/* Action Buttons: Lewati & Lanjut */}
              <div className='flex items-center justify-between gap-3 pt-1'>
                <button
                  type='button'
                  onClick={handleSkip}
                  className='text-[13px] font-medium text-[var(--lp-text-sec)] hover:text-[var(--lp-text)] transition-colors px-2 py-1.5 cursor-pointer'
                >
                  Lewati untuk sekarang
                </button>
                <button
                  type='button'
                  onClick={handleNextStep}
                  disabled={selectedCareers.length === 0}
                  className='h-11 px-7 bg-[var(--lp-btn)] hover:brightness-105 active:scale-[0.99] text-white font-medium text-sm rounded-full transition-all shadow-xs cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed'
                >
                  <span>Selesai</span>
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
