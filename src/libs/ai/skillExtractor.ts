import { getGeminiModel } from './gemini'
import { SkillCategory } from '@prisma/client'

export interface ExtractedSkillResult {
  name: string
  category: SkillCategory
  confidence: number // 0 - 100
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  reasoning: string
  metricTag?: string
}

export interface SkillExtractionInput {
  title?: string
  role?: string
  institutionName?: string
  description: string
}

/**
 * Fallback / Heuristic Mock Engine
 * Digunakan jika AI_MOCK_MODE=true atau saat provider API AI mengalami kendala rate limit / kuota.
 * Menghasilkan skill realistis berbasis kata kunci narasi (0 token terpakai).
 */
export function extractSkillsHeuristic(input: SkillExtractionInput): ExtractedSkillResult[] {
  const text = `${input.title || ''} ${input.role || ''} ${input.description || ''}`.toLowerCase()
  const results: ExtractedSkillResult[] = []

  // Helper matcher
  const has = (...keywords: string[]) => keywords.some(k => text.includes(k.toLowerCase()))

  // Metric extraction regex (angka %, jumlah orang, rupiah, waktu)
  const metricPercent = input.description.match(/(\d+[\.,]?\d*)\s*%/)?.[0]
  const metricTeam = input.description.match(/(?:tim|anggota|staf|orang)\s*(?:beranggotakan)?\s*(\d+)/i)?.[0] || input.description.match(/(\d+)\s*(?:orang|anggota|staf)/i)?.[0]
  const metricMoney = input.description.match(/(?:rp\.?|idr)\s*([\d\.,]+(?:\s*(?:juta|miliar|ribu|k|jt))?)/i)?.[0]
  const metricReq = input.description.match(/(\d+[\.,]?\d*)\s*(?:req|rps|tps|transaksi)/i)?.[0]

  // Leadership & Team Management
  if (has('pimpin', 'memimpin', 'ketua', 'koordinator', 'lead', 'manage', 'kelola tim', 'kepala', 'project manager', 'panitia')) {
    results.push({
      name: 'Cross-Functional Leadership',
      category: 'leadership',
      confidence: 88,
      level: 'advanced',
      reasoning: 'Terdeteksi peran tanggung jawab kepemimpinan dan koordinasi anggota dalam pelaksanaan kegiatan.',
      metricTag: metricTeam ? `Tim ${metricTeam.replace(/[^0-9]/g, '')} Orang` : 'Manajemen Tim'
    })
  }

  // User Research & Usability
  if (has('ui', 'ux', 'user research', 'usability', 'figma', 'design', 'desain', 'prototipe', 'wireframe', 'alur registrasi', 'tampilan')) {
    results.push({
      name: 'User Research & Usability',
      category: 'technical',
      confidence: 82,
      level: 'intermediate',
      reasoning: 'Merancang arsitektur interaksi pengguna dan mengoptimalkan kegunaan aplikasi.',
      metricTag: metricPercent ? `Bukti Metrik ${metricPercent}` : 'Optimalisasi UX'
    })
  }

  // Data-Driven UX / Analytics
  if (has('analisis', 'analytics', 'data', 'metrik', 'rate', 'checkout', 'konversi', 'ab test', 'tracking', 'meningkat', '%')) {
    results.push({
      name: 'Data-Driven Decision Making',
      category: 'hard_skill',
      confidence: 79,
      level: 'intermediate',
      reasoning: 'Mengevaluasi hasil kinerja berbasis metrik kuantitatif dan analisis data terukur.',
      metricTag: metricPercent ? `Peningkatan ${metricPercent}` : 'Analisis Metrik'
    })
  }

  // Software Engineering / Technical
  if (has('react', 'next.js', 'frontend', 'backend', 'node', 'express', 'postgresql', 'sql', 'database', 'api', 'code', 'coding', 'programming', 'bug', 'git', 'fullstack')) {
    results.push({
      name: has('react', 'frontend') ? 'Frontend Web Development' : 'Backend API Architecture',
      category: 'technical',
      confidence: 89,
      level: 'intermediate',
      reasoning: 'Pengembangan arsitektur perangkat lunak dengan teknologi komputasi modern.',
      metricTag: metricReq || 'Pengembangan Sistem'
    })
  }

  // Budgeting & Finance
  if (has('anggaran', 'dana', 'sponsor', 'keuangan', 'budget', 'biaya', 'rp', 'juta')) {
    results.push({
      name: 'Project Budgeting & Sponsorship',
      category: 'hard_skill',
      confidence: 85,
      level: 'intermediate',
      reasoning: 'Mengelola alokasi keuangan proyek dan negosiasi pendanaan dengan pemangku kepentingan.',
      metricTag: metricMoney || 'Manajemen Anggaran'
    })
  }

  // Event & Stakeholder Management
  if (has('event', 'acara', 'konferensi', 'seminar', 'peserta', 'kepanitiaan', 'humas', 'logistik', 'publik')) {
    results.push({
      name: 'Stakeholder & Event Coordination',
      category: 'leadership',
      confidence: 84,
      level: 'intermediate',
      reasoning: 'Mengkoordinasikan kebutuhan operasional acara berskala dan mengelola ekspektasi audiens.',
      metricTag: 'Manajemen Event'
    })
  }

  // Public Speaking & Communication
  if (has('presentasi', 'bicara', 'komunikasi', 'mc', 'moderator', 'public speaking', 'present', 'pitch')) {
    results.push({
      name: 'Public Speaking & Communication',
      category: 'soft_skill',
      confidence: 86,
      level: 'advanced',
      reasoning: 'Menyampaikan pesan dan presentasi gagasan kepada audiens secara artikulatif.',
      metricTag: 'Komunikasi Publik'
    })
  }

  // Problem Solving / Critical Thinking (Universal Soft Skill Fallback)
  if (results.length < 3) {
    results.push({
      name: 'Critical Problem Solving',
      category: 'soft_skill',
      confidence: 76,
      level: 'intermediate',
      reasoning: 'Mampu membedah tantangan aktivitas menjadi langkah-langkah solusi konkret terencana.',
      metricTag: 'Penyelesaian Masalah'
    })
  }

  // Collaboration & Teamwork
  if (results.length < 3) {
    results.push({
      name: 'Teamwork & Collaboration',
      category: 'soft_skill',
      confidence: 81,
      level: 'intermediate',
      reasoning: 'Berkolaborasi secara aktif dalam tim untuk mencapai target program kerja.',
      metricTag: 'Kerja Sama Tim'
    })
  }

  return results.slice(0, 5)
}

/**
 * Memanggil Groq Cloud REST API (OpenAI-Compatible)
 * Llama 3.1 8B Instant - Sangat Cepat & Free Tier
 */
async function extractWithGroq(input: SkillExtractionInput, groqApiKey: string): Promise<ExtractedSkillResult[]> {
  const prompt = `Anda adalah sistem AI ekstraksi skill profesional untuk platform Growvia.
Analisis deskripsi pengalaman berikut dan ekstrak minimal 3 keahlian kompetensi konkret terukur.

Informasi Aktivitas:
Judul: ${input.title || '-'}
Peran: ${input.role || '-'}
Institusi: ${input.institutionName || '-'}
Deskripsi:
"${input.description}"

Instruksi Format:
Keluarkan HANYA JSON array murni tanpa markdown/penjelasan pembuka/penutup.
Schema setiap elemen:
{
  "name": "Nama Skill Standar (misal: User Research & Usability, React.js Development, Cross-Functional Leadership)",
  "category": "hard_skill" | "soft_skill" | "technical" | "leadership",
  "confidence": angka 40-98,
  "level": "beginner" | "intermediate" | "advanced",
  "reasoning": "Alasan singkat mengapa skill ini terbukti di narasi (1 kalimat)",
  "metricTag": "Konteks angka/metrik terdeteksi dari teks jika ada, atau string kosong"
}`

  // Sanitize Groq API key jika ada duplikasi prefix gskgsk_
  const sanitizedGroqKey = groqApiKey.startsWith('gskgsk_')
    ? groqApiKey.replace('gskgsk_', 'gsk_')
    : groqApiKey

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${sanitizedGroqKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'qwen/qwen3.8-27b',
      messages: [
        { role: 'system', content: 'Anda adalah asisten AI ekstraktor skill profesional yang hanya mengeluarkan format JSON array valid tanpa teks pengantar atau markdown.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.1
    })
  })

  if (!response.ok) {
    throw new Error(`Groq API returned error status: ${response.status}`)
  }

  const json = await response.json()
  const content = json.choices?.[0]?.message?.content?.trim() || ''

  // Bersihkan markdown codeblock jika ada
  const cleanContent = content
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()

  // Parse JSON
  const parsed = JSON.parse(cleanContent)
  const skillsArray = Array.isArray(parsed) ? parsed : (parsed.skills || parsed.data || [])

  return normalizeSkillsOutput(skillsArray)
}

/**
 * Memanggil Google Gemini API (gemini-3.8-flash / gemini-flash-latest)
 */
async function extractWithGemini(input: SkillExtractionInput): Promise<ExtractedSkillResult[]> {
  const model = getGeminiModel('gemini-3.8-flash')

  const prompt = `Anda adalah sistem AI ekstraksi skill profesional untuk platform Growvia.
Analisis deskripsi pengalaman berikut dan ekstrak minimal 3 sampai 5 keahlian kompetensi konkret terukur.

Informasi Aktivitas:
Judul: ${input.title || '-'}
Peran: ${input.role || '-'}
Institusi: ${input.institutionName || '-'}
Deskripsi:
"${input.description}"

Instruksi Output:
Keluarkan HANYA format JSON valid tanpa tanda kutip markdown (\`\`\`json).
Contoh format:
[
  {
    "name": "Cross-Functional Leadership",
    "category": "leadership",
    "confidence": 88,
    "level": "advanced",
    "reasoning": "Memimpin koordinasi tim anggota untuk menyelesaikan proyek.",
    "metricTag": "Tim 5 Orang"
  }
]

Kategori yang valid: "hard_skill", "soft_skill", "technical", "leadership".
Level yang valid: "beginner", "intermediate", "advanced", "expert".`

  const result = await model.generateContent(prompt)
  const responseText = result.response.text()

  // Bersihkan markdown codeblock jika model menyertakannya
  const cleanJsonText = responseText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()

  const parsed = JSON.parse(cleanJsonText)
  const skillsArray = Array.isArray(parsed) ? parsed : (parsed.skills || parsed.data || [])

  return normalizeSkillsOutput(skillsArray)
}

/**
 * Normalisasi dan validasi tipe kategori skill
 */
function normalizeSkillsOutput(rawList: any[]): ExtractedSkillResult[] {
  const validCategories: SkillCategory[] = ['hard_skill', 'soft_skill', 'technical', 'leadership']

  return rawList.map((item: any, idx: number) => {
    let cat = String(item.category || '').toLowerCase()
    if (!validCategories.includes(cat as SkillCategory)) {
      if (cat.includes('lead') || cat.includes('manag')) cat = 'leadership'
      else if (cat.includes('tech') || cat.includes('code') || cat.includes('dev')) cat = 'technical'
      else if (cat.includes('soft') || cat.includes('comm')) cat = 'soft_skill'
      else cat = 'hard_skill'
    }

    const conf = Math.max(40, Math.min(99, Number(item.confidence) || (80 + (idx % 15))))
    const level = ['beginner', 'intermediate', 'advanced', 'expert'].includes(item.level)
      ? item.level
      : (conf > 85 ? 'advanced' : 'intermediate')

    return {
      name: String(item.name || `Kompetensi #${idx + 1}`).trim(),
      category: cat as SkillCategory,
      confidence: conf,
      level: level as 'beginner' | 'intermediate' | 'advanced' | 'expert',
      reasoning: String(item.reasoning || 'Diekstrak dari konteks narasi aktivitas pengalaman.').trim(),
      metricTag: item.metricTag ? String(item.metricTag).trim() : undefined
    }
  })
}

/**
 * Entrypoint Utama Ekstraksi AI 3-Tier Fallback:
 * Tier 0: Mock Mode (jika AI_MOCK_MODE=true)
 * Tier 1: Gemini 1.5 Flash
 * Tier 2: Groq Llama 3 (Failover jika Gemini error/limit)
 * Tier 3: Heuristic NLP Fallback (Menjamin 0 crash di hadapan juri)
 */
export async function extractSkillsFromExperience(
  input: SkillExtractionInput
): Promise<{ skills: ExtractedSkillResult[]; source: 'gemini' | 'groq' | 'heuristic_mock' }> {
  // 1. Cek mode mock eksplisit
  if (process.env.AI_MOCK_MODE === 'true') {
    return {
      skills: extractSkillsHeuristic(input),
      source: 'heuristic_mock'
    }
  }

  // 2. Coba Gemini 1.5 Flash (Tier 1)
  const geminiKey = process.env.GEMINI_API_KEY
  if (geminiKey && geminiKey !== 'your_gemini_api_key_here') {
    try {
      const skills = await extractWithGemini(input)
      if (skills && skills.length > 0) {
        return { skills, source: 'gemini' }
      }
    } catch (err: any) {
      console.warn('⚠️ Gemini API extraction failed, attempting failover to Groq:', err?.message || err)
    }
  }

  // 3. Coba Groq Llama 3 (Tier 2 - Failover)
  const groqKey = process.env.GROQ_API_KEY
  if (groqKey && groqKey !== 'your_groq_api_key_here') {
    try {
      const skills = await extractWithGroq(input, groqKey)
      if (skills && skills.length > 0) {
        return { skills, source: 'groq' }
      }
    } catch (err: any) {
      console.warn('⚠️ Groq API extraction failed, falling back to heuristic mock:', err?.message || err)
    }
  }

  // 4. Fallback ke Heuristic Rule-Based Mock (Tier 3)
  return {
    skills: extractSkillsHeuristic(input),
    source: 'heuristic_mock'
  }
}
