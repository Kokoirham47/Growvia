'use client'

import React, { useState, useEffect, useRef } from 'react'

import {
  Sparkles,
  RotateCcw,
  CheckCircle2,
  X,
  FileText,
  Check,
  HelpCircle,
  Mic,
  MicOff,
  AlertCircle
} from 'lucide-react'

import { HiCodeBracket, HiPaintBrush, HiChartBar, HiPresentationChartLine } from 'react-icons/hi2'

interface ExtractedSkill {
  id: string
  name: string
  category?: string
  metricBadge: string
  metricColor: 'green' | 'indigo' | 'blue' | 'purple'
  level: string
  confidence: number
  reasoning?: string
}

interface AiSmartExtractorPreviewProps {
  onConfirmSkills?: (count: number) => void
  onOpenLiveAiModal?: (text: string) => void
}

interface QuickPrompt {
  label: string
  icon: React.ComponentType<{ className?: string }>
  iconColor: string
  text: string
}

const QUICK_PROMPTS: QuickPrompt[] = [
  {
    label: 'Coding & Tech',
    icon: HiCodeBracket,
    iconColor: 'text-purple-600 dark:text-purple-400',
    text: 'Hari ini saya membangun arsitektur autentikasi JWT di Next.js 15 dan integrasi database PostgreSQL dengan Prisma ORM untuk 5 endpoint REST API.'
  },
  {
    label: 'Desain UI/UX',
    icon: HiPaintBrush,
    iconColor: 'text-purple-600 dark:text-purple-400',
    text: 'Menyelesaikan perancangan user flow dan wireframe high-fidelity aplikasi mobile finance di Figma serta melakukan usability testing dengan 6 user.'
  },
  {
    label: 'Analisis Data',
    icon: HiChartBar,
    iconColor: 'text-purple-600 dark:text-purple-400',
    text: 'Membersihkan dan menganalisis 15.000 baris data penjualan menggunakan Python Pandas, lalu membuat visualisasi korelasi konversi di Tableau.'
  },
  {
    label: 'Pitching & Soft Skill',
    icon: HiPresentationChartLine,
    iconColor: 'text-purple-600 dark:text-purple-400',
    text: 'Mempresentasikan pitch deck solusi smart campus di hadapan 4 dewan juri dan memimpin sesi tanya jawab teknis selama 20 menit.'
  }
]

export default function AiSmartExtractorPreview({ onConfirmSkills }: AiSmartExtractorPreviewProps) {
  // Input state - STARTS EMPTY as requested by user
  const [inputText, setInputText] = useState('')
  const [skills, setSkills] = useState<ExtractedSkill[]>([])
  const [jobId, setJobId] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [showDocModal, setShowDocModal] = useState(false)

  // Speech-to-Text State
  const [isListening, setIsListening] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(true)
  const [speechInterim, setSpeechInterim] = useState('')
  const recognitionRef = useRef<any>(null)

  // Check SpeechRecognition support on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

      if (!SpeechRecognition) {
        setSpeechSupported(false)
      }
    }
  }, [])

  // Start or Stop Speech Recognition
  const toggleListening = () => {
    if (!speechSupported) {
      setErrorMsg(
        'Browser Anda belum mendukung Speech-to-Text. Silakan gunakan Google Chrome, Edge, atau ketik secara manual.'
      )

      return
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }

      setIsListening(false)
      setSpeechInterim('')

      return
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

      const recognition = new SpeechRecognition()

      recognition.lang = 'id-ID' // Bahasa Indonesia
      recognition.continuous = true
      recognition.interimResults = true

      recognition.onstart = () => {
        setIsListening(true)
        setErrorMsg(null)
      }

      recognition.onresult = (event: any) => {
        let interimText = ''
        let finalText = ''

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalText += event.results[i][0].transcript + ' '
          } else {
            interimText += event.results[i][0].transcript
          }
        }

        if (finalText) {
          setInputText(prev => {
            const trimmed = prev.trim()

            return trimmed ? `${trimmed} ${finalText.trim()}` : finalText.trim()
          })
          setConfirmed(false)
        }

        setSpeechInterim(interimText)
      }

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error)

        if (event.error === 'not-allowed') {
          setErrorMsg('Izin akses mikrofon ditolak. Silakan izinkan akses mikrofon di pengaturan browser Anda.')
        } else if (event.error !== 'no-speech') {
          setErrorMsg(`Error suara: ${event.error}`)
        }

        setIsListening(false)
        setSpeechInterim('')
      }

      recognition.onend = () => {
        setIsListening(false)
        setSpeechInterim('')
      }

      recognitionRef.current = recognition
      recognition.start()
    } catch (err: any) {
      console.error('Speech recognition init error:', err)
      setErrorMsg('Gagal mengaktifkan mikrofon. Pastikan mikrofon terpasang dan diizinkan.')
      setIsListening(false)
    }
  }

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch {}
      }
    }
  }, [])

  // Live Extraction with AI via backend API
  const handleAnalyzeWithAi = async () => {
    const textToAnalyze = inputText.trim()

    if (!textToAnalyze || textToAnalyze.length < 15) {
      setErrorMsg('Tulis atau rekam narasi minimal 15 karakter agar AI dapat mengekstrak skill secara akurat.')

      return
    }

    setIsAnalyzing(true)
    setErrorMsg(null)
    setConfirmed(false)

    // Stop microphone if currently listening
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch {}

      setIsListening(false)
    }

    try {
      const res = await fetch('/api/ai/analyze-experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customText: textToAnalyze })
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Gagal menganalisis narasi dengan AI')
      }

      const receivedJobId = json.data?.jobId || json.data?.job?.id
      const suggestions = json.data?.suggestions || []

      setJobId(receivedJobId)

      // Map to UI items
      const mappedSkills: ExtractedSkill[] = suggestions.map((s: any, idx: number) => {
        const colors: Array<'green' | 'indigo' | 'blue' | 'purple'> = ['green', 'indigo', 'blue', 'purple']
        const color = colors[idx % colors.length]

        return {
          id: s.id,
          name: s.suggestedName,
          category: s.suggestedCategory,
          metricBadge:
            s.suggestedCategory === 'leadership'
              ? 'Kepemimpinan'
              : s.suggestedCategory === 'technical'
                ? 'Teknis Praktis'
                : 'Kompetensi Relevan',
          metricColor: color,
          level: 'Pemula (+35% Skor)',
          confidence: Math.round(s.confidenceScore),
          reasoning: s.reasoning || undefined
        }
      })

      setSkills(mappedSkills)
    } catch (err: any) {
      console.error('AI Extraction error:', err)
      setErrorMsg(err.message || 'Terjadi kesalahan saat memproses ekstraksi AI. Silakan coba lagi.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Remove individual skill
  const handleRemoveSkill = (id: string) => {
    setSkills(prev => prev.filter(s => s.id !== id))
  }

  // Confirm and directly save to Skill Matrix
  const handleConfirmToSkillMatrix = async () => {
    if (skills.length === 0) return

    if (!jobId) {
      // Fallback if no jobId (e.g. manual entry without API response)
      setConfirmed(true)
      if (onConfirmSkills) onConfirmSkills(skills.length)

      return
    }

    setIsSaving(true)
    setErrorMsg(null)

    try {
      const reviews = skills.map(skill => ({
        suggestionId: skill.id,
        action: 'accept',
        finalName: skill.name,
        level: 'beginner'
      }))

      const res = await fetch(`/api/ai/suggestions/${jobId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviews })
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Gagal menyimpan skill ke Skill Matrix')
      }

      setConfirmed(true)

      if (onConfirmSkills) {
        onConfirmSkills(skills.length)
      }
    } catch (err: any) {
      console.error('Save to skill matrix error:', err)
      setErrorMsg(err.message || 'Gagal menyimpan ke Skill Matrix.')
    } finally {
      setIsSaving(false)
    }
  }

  // Clear all
  const handleReset = () => {
    setInputText('')
    setSkills([])
    setJobId(null)
    setConfirmed(false)
    setErrorMsg(null)
    setSpeechInterim('')

    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch {}

      setIsListening(false)
    }
  }

  return (
    <div
      className='relative rounded-3xl font-poppins bg-gradient-to-br from-[#F5F8FF] via-[#EEF4FE] to-[#F8FAFF] dark:from-[#0B1528] dark:via-[#0F1C36] dark:to-[#0A101D] border-2 border-blue-300/80 dark:border-blue-600/50 p-5 sm:p-7 shadow-lg shadow-blue-500/[0.08] dark:shadow-blue-500/[0.04] overflow-hidden transition-all ring-1 ring-blue-500/20'
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Decorative Glow Orbs */}
      <div className='absolute -right-16 -top-16 w-72 h-72 bg-gradient-to-br from-blue-400/20 via-indigo-500/20 to-transparent rounded-full blur-3xl pointer-events-none' />
      <div className='absolute -left-16 -bottom-16 w-72 h-72 bg-gradient-to-tr from-indigo-500/15 via-blue-500/15 to-transparent rounded-full blur-3xl pointer-events-none' />

      {/* Header Banner */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-blue-200/60 dark:border-slate-800/80 relative z-10'>
        <div className='flex items-start gap-4'>
          <div className='w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/30 mt-0.5 border border-white/20'>
            <Sparkles className='w-6 h-6 text-white animate-pulse' />
          </div>
          <div>
            <div className='flex items-center gap-2.5 flex-wrap'>
              <h2 className='text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight'>
                AI Skill Booster & Catat Aktivitas
              </h2>
            </div>
            <p className='text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed'>
              Baru selesai coding, latihan, atau projek harian? Ceritakan lewat tulisan atau suara langsung di sini. AI
              akan mengekstrak kompetensi terukur dan menambah persentase di Skill Matrix kamu!
            </p>
          </div>
        </div>

        {/* Top Right Quick Controls */}
        <div className='flex items-center gap-2 shrink-0 self-start sm:self-center'>
          {inputText && (
            <button
              type='button'
              onClick={handleReset}
              className='inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:text-rose-600 hover:border-rose-300 dark:hover:border-rose-800 shadow-2xs transition-all cursor-pointer'
            >
              <RotateCcw className='w-3.5 h-3.5' />
              <span>Reset</span>
            </button>
          )}

          <button
            type='button'
            onClick={() => setShowDocModal(!showDocModal)}
            className='inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white shadow-2xs transition-all cursor-pointer'
          >
            <HelpCircle className='w-3.5 h-3.5 text-slate-400' />
            <span>Cara Kerja AI</span>
          </button>
        </div>
      </div>

      {/* Info Pipeline Modal/Drawer if opened */}
      {showDocModal && (
        <div className='mt-4 p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-blue-200 dark:border-blue-900/60 text-xs text-slate-700 dark:text-slate-300 space-y-2 animate-in fade-in duration-200 shadow-xs'>
          <div className='flex items-center justify-between'>
            <span className='font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5'>
              <span>Arsitektur AI Skill Booster</span>
            </span>
            <button
              type='button'
              onClick={() => setShowDocModal(false)}
              className='text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer'
            >
              <X className='w-3.5 h-3.5' />
            </button>
          </div>
          <p className='text-[11px] text-slate-500 dark:text-slate-400'>
            Fitur ini dirancang untuk aktivitas informal, coding harian, atau projek mandiri cepat tanpa perlu mengisi
            form kepanitiaan/sertifikat yang rumit. Skill yang dikonfirmasi langsung menaikkan skor dan persentase di
            Skill Matrix Anda.
          </p>
        </div>
      )}

      {/* Error Alert if any */}
      {errorMsg && (
        <div className='mt-4 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-xs font-medium text-rose-700 dark:text-rose-300 flex items-start gap-2.5 animate-in fade-in'>
          <AlertCircle className='w-4 h-4 text-rose-500 shrink-0 mt-0.5' />
          <div className='flex-1'>{errorMsg}</div>
          <button
            type='button'
            onClick={() => setErrorMsg(null)}
            className='text-rose-400 hover:text-rose-600 dark:hover:text-rose-200 p-1 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors cursor-pointer'
          >
            <X className='w-3.5 h-3.5' />
          </button>
        </div>
      )}

      {/* Main 2-Column Grid (Left: Narasi + Voice, Right: Hasil Ekstraksi) */}
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-5 mt-6'>
        {/* LEFT COLUMN: Input Narasi Aktivitas Harian */}
        <div className='lg:col-span-5 flex flex-col justify-between rounded-2xl bg-white/95 dark:bg-[#0B132B]/95 backdrop-blur-xs border border-blue-200/80 dark:border-slate-800 p-5 shadow-sm'>
          <div>
            <div className='flex items-center justify-between pb-3'>
              <span className='inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider'>
                <FileText className='w-4 h-4 text-blue-600 dark:text-blue-400' />
                <span>Narasi Aktivitas Harian</span>
              </span>
              <span
                className={`text-xs font-semibold ${inputText.length >= 20 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-400 dark:text-slate-500'}`}
              >
                {inputText.trim().length} Karakter
              </span>
            </div>

            {/* Editable narrative text + speech live indicator */}
            <div
              className={`relative rounded-xl bg-[#F8FAFC] dark:bg-slate-900/60 border p-4 transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 ${
                isListening
                  ? 'border-red-400 dark:border-red-600 ring-2 ring-red-400/20'
                  : 'border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <textarea
                rows={5}
                value={inputText}
                onChange={e => {
                  setInputText(e.target.value)
                  setConfirmed(false)
                }}
                className='w-full bg-transparent text-sm text-slate-800 dark:text-slate-200 leading-relaxed outline-none resize-none placeholder:text-slate-400 dark:placeholder:text-slate-600 custom-scrollbar font-medium'
                placeholder='Ketik atau rekam suara aktivitas coding, tugas, atau projek harianmu di sini... (contoh: "Hari ini saya baru selesai slicing landing page pakai Tailwind CSS dan menambahkan animasi scroll Framer Motion")'
              />

              {/* Interim voice speech feedback */}
              {isListening && speechInterim && (
                <div className='mt-2 p-2 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 text-xs italic text-red-600 dark:text-red-400 animate-pulse'>
                  &ldquo;{speechInterim}...&rdquo;
                </div>
              )}

              {/* Listening Banner */}
              {isListening && (
                <div className='flex items-center justify-between mt-2 pt-2 border-t border-red-100 dark:border-red-900/40 text-xs text-red-600 dark:text-red-400 font-semibold'>
                  <span className='flex items-center gap-1.5'>
                    <span className='w-2 h-2 rounded-full bg-red-500 animate-ping' />
                    <span>Mendengarkan suara Anda... (Bicaralah secara leluasa)</span>
                  </span>
                  <button
                    type='button'
                    onClick={toggleListening}
                    className='text-[11px] underline hover:text-red-700 cursor-pointer font-medium'
                  >
                    Selesai
                  </button>
                </div>
              )}
            </div>

            {/* Quick Inspiration Pills */}
            <div className='mt-3 space-y-1.5'>
              <div className='flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400'>
                <span>Pilih contoh cepat untuk dicoba:</span>
              </div>
              <div className='flex flex-wrap gap-1.5'>
                {QUICK_PROMPTS.map((prompt, idx) => {
                  const Icon = prompt.icon

                  return (
                    <button
                      key={idx}
                      type='button'
                      onClick={() => {
                        setInputText(prompt.text)
                        setConfirmed(false)
                      }}
                      className='inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold bg-white dark:bg-slate-800 hover:bg-blue-50/80 hover:text-blue-600 dark:hover:bg-blue-950/60 dark:hover:text-blue-400 text-slate-700 dark:text-slate-200 transition-all border border-slate-200/80 dark:border-slate-700/80 shadow-2xs hover:border-blue-300 dark:hover:border-blue-700 hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
                    >
                      <Icon className={`w-3.5 h-3.5 ${prompt.iconColor} shrink-0`} />
                      <span>{prompt.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Left Footer: Voice Button & Analyze with AI */}
          <div className='flex items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-4'>
            {/* Speech to text toggle */}
            <button
              type='button'
              onClick={toggleListening}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isListening
                  ? 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-500/25 animate-pulse'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
              }`}
              title={isListening ? 'Klik untuk berhenti merekam' : 'Mulai bicara dengan mikrofon'}
            >
              {isListening ? (
                <>
                  <MicOff className='w-3.5 h-3.5' />
                  <span>Stop Rekam</span>
                </>
              ) : (
                <>
                  <Mic className='w-3.5 h-3.5 text-blue-600 dark:text-blue-400' />
                  <span>Bicara (Suara)</span>
                </>
              )}
            </button>

            {/* AI Analyze Action */}
            <button
              type='button'
              onClick={handleAnalyzeWithAi}
              disabled={isAnalyzing || !inputText.trim() || inputText.trim().length < 15}
              className='inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 shadow-md shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0'
            >
              <Sparkles className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? 'Memproses dengan AI...' : 'Ekstrak Skill dengan AI'}</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Hasil Ekstraksi AI & Simpan ke Skill Matrix */}
        <div className='lg:col-span-7 flex flex-col justify-between rounded-2xl bg-white/95 dark:bg-[#0B132B]/95 backdrop-blur-xs border border-blue-200/80 dark:border-slate-800 p-5 shadow-sm'>
          <div>
            <div className='flex items-center justify-between pb-3'>
              <span className='inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider'>
                <Sparkles className='w-4 h-4 text-purple-500' />
                <span>Hasil Ekstraksi AI ({skills.length} Ditemukan)</span>
              </span>
              <span className='text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1'>
                <CheckCircle2 className='w-3.5 h-3.5' />
                <span>Model AI Aktif</span>
              </span>
            </div>

            {/* State Handling: Loading vs Empty vs Results */}
            {isAnalyzing ? (
              <div className='space-y-3 py-6'>
                <div className='p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 animate-pulse space-y-2'>
                  <div className='flex items-center justify-between'>
                    <div className='w-1/3 h-4 bg-slate-200 dark:bg-slate-800 rounded' />
                    <div className='w-16 h-2 bg-slate-200 dark:bg-slate-800 rounded' />
                  </div>
                  <div className='w-3/4 h-3 bg-slate-100 dark:bg-slate-850 rounded' />
                </div>
                <div className='p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 animate-pulse space-y-2'>
                  <div className='flex items-center justify-between'>
                    <div className='w-1/2 h-4 bg-slate-200 dark:bg-slate-800 rounded' />
                    <div className='w-16 h-2 bg-slate-200 dark:bg-slate-800 rounded' />
                  </div>
                  <div className='w-2/3 h-3 bg-slate-100 dark:bg-slate-850 rounded' />
                </div>
                <div className='p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 animate-pulse space-y-2'>
                  <div className='flex items-center justify-between'>
                    <div className='w-1/3 h-4 bg-slate-200 dark:bg-slate-800 rounded' />
                    <div className='w-16 h-2 bg-slate-200 dark:bg-slate-800 rounded' />
                  </div>
                  <div className='w-1/2 h-3 bg-slate-100 dark:bg-slate-850 rounded' />
                </div>
                <p className='text-center text-xs text-slate-500 animate-pulse pt-2'>
                  AI sedang menganalisis narasi aktivitas harianmu...
                </p>
              </div>
            ) : skills.length === 0 ? (
              <div className='py-12 px-6 text-center rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-blue-100 dark:border-slate-800 mt-2 space-y-3.5'>
                <div className='w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500/10 via-indigo-500/10 to-violet-500/10 dark:from-blue-500/20 dark:via-indigo-500/20 dark:to-violet-500/20 border border-blue-200/80 dark:border-blue-800/80 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center shadow-xs'>
                  <Sparkles className='w-7 h-7 text-blue-600 dark:text-blue-400 animate-pulse' />
                </div>
                <div>
                  <h4 className='text-sm font-bold text-slate-900 dark:text-white'>Siap Mengekstrak Skill Otomatis</h4>
                  <p className='text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed'>
                    Ketik atau rekam suara aktivitas harianmu di sisi kiri, lalu klik{' '}
                    <span className='font-semibold text-blue-600 dark:text-blue-400'>
                      &ldquo;Ekstrak Skill dengan AI&rdquo;
                    </span>{' '}
                    untuk melihat rekomendasi skill dan bukti relevannya di sini.
                  </p>
                </div>
              </div>
            ) : (
              <div className='space-y-2.5 mt-1 max-h-[290px] overflow-y-auto custom-scrollbar pr-1'>
                {skills.map(skill => {
                  const isGreen = skill.metricColor === 'green'
                  const isIndigo = skill.metricColor === 'indigo'

                  const badgeClass = isGreen
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-900/60'
                    : isIndigo
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-900/60'
                      : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-900/60'

                  const barColor = isGreen ? 'bg-emerald-500' : 'bg-blue-600'

                  return (
                    <div
                      key={skill.id}
                      className='p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-center justify-between gap-3'
                    >
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-2 flex-wrap'>
                          <h4 className='text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate'>
                            {skill.name}
                          </h4>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badgeClass}`}
                          >
                            • {skill.metricBadge}
                          </span>
                        </div>

                        {skill.reasoning && (
                          <p className='text-[11px] text-slate-600 dark:text-slate-300 mt-1 line-clamp-1 italic'>
                            &ldquo;{skill.reasoning}&rdquo;
                          </p>
                        )}

                        <p className='text-[11px] text-slate-500 dark:text-slate-400 mt-0.5'>
                          Tingkat Awal:{' '}
                          <span className='font-semibold text-slate-700 dark:text-slate-300'>{skill.level}</span> ·
                          Validitas Bukti AI:{' '}
                          <span className='font-bold text-emerald-600 dark:text-emerald-400'>{skill.confidence}%</span>
                        </p>
                      </div>

                      {/* Right: Confidence Bar & Dismiss Button */}
                      <div className='flex items-center gap-3 shrink-0'>
                        <div className='w-16 sm:w-20 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden'>
                          <div
                            className={`${barColor} h-full rounded-full transition-all duration-500`}
                            style={{ width: `${skill.confidence}%` }}
                          />
                        </div>

                        <button
                          type='button'
                          onClick={() => handleRemoveSkill(skill.id)}
                          title='Hapus rekomendasi skill ini'
                          className='p-1 text-slate-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer'
                        >
                          <X className='w-4 h-4' />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Right Footer: Controls & Confirm CTA */}
          <div className='pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-4 space-y-3'>
            {skills.length > 0 && (
              <div className='flex items-center justify-between text-xs'>
                <span className='text-slate-500 dark:text-slate-400'>
                  {skills.length} kompetensi terdeteksi siap disimpan
                </span>
                <button
                  type='button'
                  onClick={() => setSkills([])}
                  className='font-semibold text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer'
                >
                  Hapus Semua
                </button>
              </div>
            )}

            <button
              type='button'
              onClick={handleConfirmToSkillMatrix}
              disabled={skills.length === 0 || isSaving}
              className={`w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white transition-all shadow-md active:scale-[0.99] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                confirmed
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-500/25'
                  : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 shadow-blue-500/25'
              }`}
            >
              {isSaving ? (
                <>
                  <Sparkles className='w-4 h-4 animate-spin' />
                  <span>Menyimpan ke Skill Matrix...</span>
                </>
              ) : confirmed ? (
                <>
                  <Check className='w-4 h-4' />
                  <span>{skills.length} Skill Berhasil Dimasukkan ke Matrix!</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className='w-4 h-4' />
                  <span>Konfirmasi & Masukkan ke Skill Matrix</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
