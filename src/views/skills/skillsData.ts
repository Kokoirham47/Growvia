import type { SkillItem, SkillCategorySummary, SkillMapNode, SkillMapEdge, EvidenceDetail } from '@/types/skills'

export const INITIAL_SKILLS: SkillItem[] = [
  {
    id: 'skill-1',
    name: 'Leadership',
    subCategory: 'Strategic & Team Steering',
    category: 'leadership',
    level: 'advanced',
    score: 90,
    evidenceCount: 3,
    evidenceTags: ['BEM', 'Magang', 'Proyek Lab'],
    source: 'ai_extracted',
    aiConfidence: 0.94,
    isAiVerified: true,
    description: 'Kemampuan mengarahkan visi tim, mengorganisir koordinasi lintas divisi, dan mengambil keputusan berbasis konsensus.'
  },
  {
    id: 'skill-2',
    name: 'Event Planning & Ops',
    subCategory: 'Execution & Logistics',
    category: 'soft_skill',
    level: 'advanced',
    score: 88,
    evidenceCount: 2,
    evidenceTags: ['Festival Kampus', 'Konferensi'],
    source: 'ai_extracted',
    aiConfidence: 0.91,
    isAiVerified: true,
    description: 'Manajemen alur acara berskala 1000+ peserta, timeline eksekusi, perizinan vendor, dan mitigasi risiko operasional.'
  },
  {
    id: 'skill-3',
    name: 'Project Management',
    subCategory: 'Agile & Scrum Delivery',
    category: 'soft_skill',
    level: 'intermediate',
    score: 78,
    evidenceCount: 2,
    evidenceTags: ['Inkubator Startup', 'PKM'],
    source: 'ai_extracted',
    aiConfidence: 0.88,
    isAiVerified: true,
    description: 'Perencanaan sprint, tracking progress menggunakan Kanban/Jira, koordinasi deliverable, dan retrospeksi tim.'
  },
  {
    id: 'skill-4',
    name: 'UI/UX Design',
    subCategory: 'Figma, Design Systems',
    category: 'hard_skill',
    level: 'advanced',
    score: 92,
    evidenceCount: 3,
    evidenceTags: ['Fintech Intern', 'Freelance', 'App'],
    source: 'ai_extracted',
    aiConfidence: 0.96,
    isAiVerified: true,
    description: 'Perancangan design token, auto-layout komponen interaktif tingkat lanjut, usability testing, dan user journey mapping.'
  },
  {
    id: 'skill-5',
    name: 'Public Speaking',
    subCategory: 'Pitching & Keynote Delivery',
    category: 'soft_skill',
    level: 'intermediate',
    score: 70,
    evidenceCount: 2,
    evidenceTags: ['Master of Ceremony', 'Debate'],
    source: 'manual',
    isAiVerified: false,
    description: 'Penyampaian presentasi persuasif di hadapan panel juri dan audiens terbuka dengan artikulasi jelas dan runtut.'
  },
  {
    id: 'skill-6',
    name: 'Budgeting & Finance',
    subCategory: 'Cost Planning & P&L',
    category: 'soft_skill',
    level: 'beginner',
    score: 55,
    evidenceCount: 1,
    evidenceTags: ['Bendahara Himpunan'],
    source: 'ai_extracted',
    aiConfidence: 0.82,
    isAiVerified: true,
    description: 'Penyusunan anggaran rencana operasional, pencatatan cash flow kegiatan, dan pelaporan pertanggungjawaban dana.'
  },
  {
    id: 'skill-7',
    name: 'Usability Testing',
    subCategory: 'Research & User Feedback',
    category: 'hard_skill',
    level: 'advanced',
    score: 85,
    evidenceCount: 2,
    evidenceTags: ['Fintech Intern', 'Lab UI'],
    source: 'ai_extracted',
    aiConfidence: 0.9,
    isAiVerified: true,
    description: 'Penyusunan test script, pemandu sesi uji coba prototype kualitatif (think-aloud), dan pemetaan System Usability Scale (SUS).'
  },
  {
    id: 'skill-8',
    name: 'Wireframing & Prototyping',
    subCategory: 'Information Architecture',
    category: 'hard_skill',
    level: 'advanced',
    score: 91,
    evidenceCount: 3,
    evidenceTags: ['Freelance', 'Fintech Intern', 'PKM'],
    source: 'ai_extracted',
    aiConfidence: 0.95,
    isAiVerified: true,
    description: 'Pembuatan sketsa lo-fi hingga prototype hi-fi interaktif dengan micro-interactions dan conditional logic di Figma.'
  },
  {
    id: 'skill-9',
    name: 'React.js',
    subCategory: 'Frontend Component Dev',
    category: 'technical',
    level: 'intermediate',
    score: 75,
    evidenceCount: 2,
    evidenceTags: ['Web Proyek Lab', 'Startup PKM'],
    source: 'ai_extracted',
    aiConfidence: 0.89,
    isAiVerified: true,
    description: 'Pengembangan komponen UI modular berbasis React hooks, state management, dan integrasi Tailwind CSS responsive.'
  },
  {
    id: 'skill-10',
    name: 'TypeScript & REST APIs',
    subCategory: 'Clean Architecture',
    category: 'technical',
    level: 'intermediate',
    score: 68,
    evidenceCount: 2,
    evidenceTags: ['Web Proyek Lab', 'Hackathon'],
    source: 'ai_extracted',
    aiConfidence: 0.84,
    isAiVerified: true,
    description: 'Implementasi type-safety strict, schema validation dengan Zod, dan integrasi RESTful endpoint async.'
  },
  {
    id: 'skill-11',
    name: 'Stakeholder Management',
    subCategory: 'Cross-functional Alignment',
    category: 'soft_skill',
    level: 'intermediate',
    score: 74,
    evidenceCount: 2,
    evidenceTags: ['BEM', 'Magang'],
    source: 'ai_extracted',
    aiConfidence: 0.87,
    isAiVerified: true,
    description: 'Menjembatani komunikasi antara tim teknis, desainer, dan pemangku kepentingan bisnis untuk penyelarasan ekspektasi.'
  },
  {
    id: 'skill-12',
    name: 'Creative Problem Solving',
    subCategory: 'Design Thinking & Ideation',
    category: 'soft_skill',
    level: 'advanced',
    score: 86,
    evidenceCount: 3,
    evidenceTags: ['PKM', 'BEM', 'Hackathon'],
    source: 'ai_extracted',
    aiConfidence: 0.92,
    isAiVerified: true,
    description: 'Penerapan framework Double Diamond dalam merumuskan solusi inovatif untuk masalah pengguna yang kompleks.'
  }
]

export const CATEGORY_SUMMARIES: SkillCategorySummary[] = [
  {
    category: 'soft_skill',
    label: 'Soft Skills',
    count: 6,
    percentage: 50,
    color: '#2563EB',
    bgLight: '#EFF6FF',
    iconName: 'Users'
  },
  {
    category: 'hard_skill',
    label: 'Hard Skills',
    count: 3,
    percentage: 25,
    color: '#6366F1',
    bgLight: '#EEF2FF',
    iconName: 'Target'
  },
  {
    category: 'technical',
    label: 'Technical',
    count: 2,
    percentage: 17,
    color: '#10B981',
    bgLight: '#ECFDF5',
    iconName: 'Code'
  },
  {
    category: 'leadership',
    label: 'Leadership',
    count: 1,
    percentage: 8,
    color: '#F59E0B',
    bgLight: '#FEF3C7',
    iconName: 'Trophy'
  }
]

// Skill Map Graph data for the desktop full-width node graph
// Colors:
// - blue: Hard Skill
// - indigo: AI Detected
// - green: Strong (Score >= 85)
// - orange: Develop (Score < 85)
export const SKILL_MAP_NODES: SkillMapNode[] = [
  {
    id: 'skill-1',
    name: 'Leadership',
    category: 'leadership',
    colorType: 'green', // Strong
    level: 'advanced',
    score: 90,
    evidenceCount: 3,
    evidenceTags: ['BEM', 'Magang', 'Proyek Lab'],
    x: 350,
    y: 160
  },
  {
    id: 'skill-2',
    name: 'Event Planning & Ops',
    category: 'soft_skill',
    colorType: 'green', // Strong
    level: 'advanced',
    score: 88,
    evidenceCount: 2,
    evidenceTags: ['Festival Kampus', 'Konferensi'],
    x: 180,
    y: 220
  },
  {
    id: 'skill-3',
    name: 'Project Management',
    category: 'soft_skill',
    colorType: 'orange', // Develop
    level: 'intermediate',
    score: 78,
    evidenceCount: 2,
    evidenceTags: ['Inkubator Startup', 'PKM'],
    x: 480,
    y: 240
  },
  {
    id: 'skill-4',
    name: 'UI/UX Design',
    category: 'hard_skill',
    colorType: 'blue', // Hard Skill
    level: 'advanced',
    score: 92,
    evidenceCount: 3,
    evidenceTags: ['Fintech Intern', 'Freelance', 'App'],
    x: 650,
    y: 180
  },
  {
    id: 'skill-5',
    name: 'Public Speaking',
    category: 'soft_skill',
    colorType: 'orange', // Develop
    level: 'intermediate',
    score: 70,
    evidenceCount: 2,
    evidenceTags: ['Master of Ceremony', 'Debate'],
    x: 220,
    y: 350
  },
  {
    id: 'skill-6',
    name: 'Budgeting & Finance',
    category: 'soft_skill',
    colorType: 'indigo', // AI detected
    level: 'beginner',
    score: 55,
    evidenceCount: 1,
    evidenceTags: ['Bendahara Himpunan'],
    x: 340,
    y: 420
  },
  {
    id: 'skill-7',
    name: 'Usability Testing',
    category: 'hard_skill',
    colorType: 'blue', // Hard Skill
    level: 'advanced',
    score: 85,
    evidenceCount: 2,
    evidenceTags: ['Fintech Intern', 'Lab UI'],
    x: 800,
    y: 140
  },
  {
    id: 'skill-8',
    name: 'Wireframing & Prototyping',
    category: 'hard_skill',
    colorType: 'blue', // Hard Skill
    level: 'advanced',
    score: 91,
    evidenceCount: 3,
    evidenceTags: ['Freelance', 'Fintech Intern', 'PKM'],
    x: 770,
    y: 280
  },
  {
    id: 'skill-9',
    name: 'React.js',
    category: 'technical',
    colorType: 'indigo', // AI detected
    level: 'intermediate',
    score: 75,
    evidenceCount: 2,
    evidenceTags: ['Web Proyek Lab', 'Startup PKM'],
    x: 630,
    y: 360
  },
  {
    id: 'skill-10',
    name: 'TypeScript & REST APIs',
    category: 'technical',
    colorType: 'orange', // Develop
    level: 'intermediate',
    score: 68,
    evidenceCount: 2,
    evidenceTags: ['Web Proyek Lab', 'Hackathon'],
    x: 780,
    y: 410
  },
  {
    id: 'skill-11',
    name: 'Stakeholder Management',
    category: 'soft_skill',
    colorType: 'orange', // Develop
    level: 'intermediate',
    score: 74,
    evidenceCount: 2,
    evidenceTags: ['BEM', 'Magang'],
    x: 480,
    y: 380
  },
  {
    id: 'skill-12',
    name: 'Creative Problem Solving',
    category: 'soft_skill',
    colorType: 'green', // Strong
    level: 'advanced',
    score: 86,
    evidenceCount: 3,
    evidenceTags: ['PKM', 'BEM', 'Hackathon'],
    x: 520,
    y: 90
  }
]

export const SKILL_MAP_EDGES: SkillMapEdge[] = [
  { source: 'skill-1', target: 'skill-2', relation: 'Koordinasi Operasional' },
  { source: 'skill-1', target: 'skill-3', relation: 'Penyelarasan Tim' },
  { source: 'skill-1', target: 'skill-11', relation: 'Hubungan Stakeholder' },
  { source: 'skill-1', target: 'skill-12', relation: 'Resolusi Isu Strategis' },
  { source: 'skill-2', target: 'skill-6', relation: 'Alokasi Budget Event' },
  { source: 'skill-2', target: 'skill-5', relation: 'Protokoler & MC' },
  { source: 'skill-3', target: 'skill-11', relation: 'Sprint & Status Update' },
  { source: 'skill-3', target: 'skill-4', relation: 'Product Delivery' },
  { source: 'skill-3', target: 'skill-12', relation: 'Iterasi Solusi' },
  { source: 'skill-4', target: 'skill-8', relation: 'Lo-Fi ke Hi-Fi Prototype' },
  { source: 'skill-4', target: 'skill-7', relation: 'Validasi Pengguna' },
  { source: 'skill-4', target: 'skill-9', relation: 'Handoff Desain ke Kode' },
  { source: 'skill-4', target: 'skill-12', relation: 'Design Thinking Empathy' },
  { source: 'skill-8', target: 'skill-7', relation: 'Feedback Loop Usability' },
  { source: 'skill-9', target: 'skill-10', relation: 'Frontend Architecture' },
  { source: 'skill-5', target: 'skill-11', relation: 'Presentasi Progres' }
]

export const EVIDENCE_DETAILS: EvidenceDetail[] = [
  {
    id: 'ev-1',
    skillId: 'skill-1',
    skillName: 'Leadership',
    experienceTitle: 'Kepala Divisi Pengembangan Sumber Daya Manusia',
    experienceRole: 'Head of People Development',
    institutionName: 'Badan Eksekutif Mahasiswa (BEM) Fakultas',
    period: 'Jan 2024 - Des 2024',
    type: 'Organisasi',
    impactNote: 'Memimpin 18 staf inti dalam menyusun 5 program pelatihan kepemimpinan mahasiswa dengan 96% tingkat kepuasan peserta.',
    proofUrl: 'https://drive.google.com/growvia-evidence-bem.pdf',
    aiExtracted: true
  },
  {
    id: 'ev-2',
    skillId: 'skill-1',
    skillName: 'Leadership',
    experienceTitle: 'Associate Product Intern',
    experienceRole: 'Product & Design Intern',
    institutionName: 'PT FinTech Nusantara Digital',
    period: 'Jun 2024 - Agu 2024',
    type: 'Magang',
    impactNote: 'Mengkoordinir tim lintas divisi (2 engineer, 1 QA) dalam perilisan fitur onboarding instan.',
    proofUrl: 'https://growvia.app/certificate-fintech.pdf',
    aiExtracted: true
  },
  {
    id: 'ev-3',
    skillId: 'skill-4',
    skillName: 'UI/UX Design',
    experienceTitle: 'Associate Product Intern',
    experienceRole: 'Product & Design Intern',
    institutionName: 'PT FinTech Nusantara Digital',
    period: 'Jun 2024 - Agu 2024',
    type: 'Magang',
    impactNote: 'Meredesain funnel registrasi e-wallet dan menghasilkan peningkatan conversion rate pengguna sebesar 18.4%.',
    proofUrl: 'https://figma.com/@portfolio-fintech-case',
    aiExtracted: true
  },
  {
    id: 'ev-4',
    skillId: 'skill-4',
    skillName: 'UI/UX Design',
    experienceTitle: 'Freelance UI/UX Consultant',
    experienceRole: 'Lead Product Designer',
    institutionName: 'EduSmart EdTech Indonesia',
    period: 'Sep 2024 - Sekarang',
    type: 'Freelance',
    impactNote: 'Membangun design system lengkap 80+ komponen dengan token warna dan tipografi multi-platform.',
    proofUrl: 'https://figma.com/@portfolio-edusmart',
    aiExtracted: true
  },
  {
    id: 'ev-5',
    skillId: 'skill-2',
    skillName: 'Event Planning & Ops',
    experienceTitle: 'Ketua Pelaksana Festival Kreatif Mahasiswa',
    experienceRole: 'Project Director',
    institutionName: 'Universitas Indonesia',
    period: 'Okt 2023 - Nov 2023',
    type: 'Kepanitiaan',
    impactNote: 'Mengelola anggaran 85 juta rupiah dan 45 panitia untuk menyelenggarakan expo seni dengan 2.400 pengunjung.',
    proofUrl: 'https://festival-kreatif-ui.com/archive',
    aiExtracted: true
  },
  {
    id: 'ev-6',
    skillId: 'skill-3',
    skillName: 'Project Management',
    experienceTitle: 'Ketua Tim Program Kreativitas Mahasiswa (PKM)',
    experienceRole: 'Team Lead',
    institutionName: 'Kemdikbudristek Dikti',
    period: 'Feb 2024 - Agu 2024',
    type: 'Proyek',
    impactNote: 'Memimpin proyek inovasi sistem pertanian pintar IoT yang lolos pendanaan nasional dan seleksi PIMNAS 37.',
    proofUrl: 'https://simbelmawa.kemdikbud.go.id/pkm-growvia',
    aiExtracted: true
  }
]
