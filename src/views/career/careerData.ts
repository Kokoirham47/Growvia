import { CareerTargetProfile, LearningResourceItem } from '@/types/career'

export const CAREER_TARGETS: Record<string, CareerTargetProfile> = {
  'associate-product-designer': {
    id: 'associate-product-designer',
    title: 'Associate Product Designer',
    companyType: 'Tech Industry',
    level: 'Junior / Fresh Graduate Tier 1',
    readinessScore: 78,
    readinessStatus: 'Ready',
    readinessBadgeColor: '#16A34A',
    verifiedJobsCount: 140,
    lastUpdated: 'Update 2 hari lalu',
    salaryRange: 'Rp 9.000.000 – Rp 15.000.000',
    summary: 'Merancang pengalaman pengguna (UX), user research, dan antarmuka visual (UI) untuk aplikasi web & mobile digital produk.',
    competentCount: 9,
    totalSkillsCount: 12,
    developCount: 2,
    missingCount: 1,
    aiInsight:
      'Nabila, kamu punya fondasi UI Design & Research yang sangat solid dari magang Telkom. Untuk bersaing kuat di role Associate Product Designer di tech unicorn/startup, kuasai Design Tokens dan Data Analytics dasar.',
    highlightedKeywords: ['Design Tokens', 'Data Analytics dasar'],
    strongSkills: [
      {
        id: 'figma',
        name: 'Figma & Auto-layout',
        status: 'strong',
        score: 95,
        evidenceCount: 2,
        evidenceSource: 'Terverifikasi dari 2 proyek portofolio',
        category: 'Hard Skill',
        description: 'Mahir merancang komponen modular, auto-layout kompleks, variant properties, dan prototyping interaktif responsif.',
        atsKeywords: ['Figma Auto-layout', 'Design Systems', 'Variants', 'Interactive Prototyping']
      },
      {
        id: 'user-research',
        name: 'User Research & Testing',
        status: 'strong',
        score: 85,
        evidenceCount: 1,
        evidenceSource: 'Terverifikasi Telkom Indonesia',
        category: 'Hard Skill',
        description: 'Penyusunan research plan, usability testing (UT), in-depth interview, analisis thematic synthesis, dan persona creation.',
        atsKeywords: ['Usability Testing', 'User Interview', 'Persona', 'Synthesis']
      },
      {
        id: 'wireframing',
        name: 'Wireframing & Prototyping',
        status: 'strong',
        score: 90,
        evidenceCount: 3,
        evidenceSource: 'Skala Interaksi Mikro Handal',
        category: 'Hard Skill',
        description: 'Pembuatan wireframe low-fidelity hingga high-fidelity interactive prototype dengan micro-interaction yang presisi.',
        atsKeywords: ['Wireframing', 'Hi-Fi Prototyping', 'Micro-interactions', 'Information Architecture']
      },
      {
        id: 'cross-comm',
        name: 'Cross-functional Comm.',
        status: 'strong',
        score: 88,
        evidenceCount: 2,
        evidenceSource: 'Diskusi desain lintas tim Developer & PM',
        category: 'Soft Skill',
        description: 'Mampu menjembatani diskusi desain dengan tim Developer dan Product Manager secara efektif.',
        atsKeywords: ['Cross-functional Collaboration', 'Design Handoff', 'Dev-Sync']
      }
    ],
    developSkills: [
      {
        id: 'design-tokens',
        name: 'Design System & Tokens',
        status: 'develop',
        score: 45,
        evidenceCount: 1,
        evidenceSource: 'Butuh bukti implementasi token CSS/JSON',
        category: 'Hard Skill',
        description: 'Mapping variable token untuk warna, typography, elevation, dan spacing yang sinkron dengan kode front-end (CSS/JSON).',
        atsKeywords: ['Design Tokens', 'Figma Tokens Plugin', 'CSS Variables', 'Style Dictionary']
      },
      {
        id: 'agile-scrum',
        name: 'Agile / Scrum Methodology',
        status: 'develop',
        score: 70,
        evidenceCount: 1,
        evidenceSource: 'Sprint Planning dan retrospeksi mingguan',
        category: 'Soft Skill',
        description: 'Familiar dengan alur kerja Sprint Planning, daily standup, backlog refinement, dan retrospeksi mingguan.',
        atsKeywords: ['Agile UX', 'Scrum Sprint', 'Backlog Grooming', 'Jira']
      }
    ],
    missingSkills: [
      {
        id: 'product-analytics',
        name: 'Product Analytics (Mixpanel / GA4)',
        status: 'missing',
        score: 20,
        evidenceCount: 0,
        evidenceSource: 'Belum ada bukti portofolio / eksperimen A/B',
        category: 'Hard Skill',
        priority: 'high',
        description: 'Pelacakan funnel konversi, tracking event perilaku pengguna di Mixpanel/Google Analytics 4, dan evaluasi hasil A/B testing.',
        atsKeywords: ['Mixpanel', 'Google Analytics 4', 'Funnel Tracking', 'A/B Testing']
      }
    ],
    detailedMatrix: [
      {
        category: 'Hard Skills Industri',
        description: 'Kompetensi teknis utama yang disaring oleh Hiring Manager',
        skillsCountLabel: '5 Skill Dievaluasi',
        skills: [
          {
            id: 'figma-det',
            name: 'Figma & Auto-layout',
            status: 'strong',
            score: 95,
            evidenceNote: 'Terverifikasi dari 2 proyek portofolio',
            actionType: 'qualified',
            actionLabel: 'Kualifikasi Tercapai'
          },
          {
            id: 'research-det',
            name: 'User Research & Testing',
            status: 'strong',
            score: 85,
            evidenceNote: 'Terverifikasi Telkom Indonesia',
            actionType: 'qualified',
            actionLabel: 'Kualifikasi Tercapai'
          },
          {
            id: 'proto-det',
            name: 'Wireframing & Prototyping',
            status: 'strong',
            score: 90,
            evidenceNote: 'Skala Interaksi Mikro Handal',
            actionType: 'qualified',
            actionLabel: 'Kualifikasi Tercapai'
          },
          {
            id: 'tokens-det',
            name: 'Design System & Tokens',
            status: 'develop',
            score: 45,
            evidenceNote: 'Butuh bukti implementasi token CSS/JSON',
            actionType: 'recommend',
            actionLabel: 'Lihat Rekomendasi Belajar'
          },
          {
            id: 'analytics-det',
            name: 'Product Analytics (Mixpanel / GA4)',
            status: 'missing',
            score: 20,
            evidenceNote: 'Belum ada bukti portofolio / eksperimen A/B',
            actionType: 'intro_module',
            actionLabel: 'Ambil Modul Pengantar'
          }
        ]
      }
    ],
    softSkills: [
      {
        id: 'soft-1',
        name: 'Cross-functional Comm.',
        badge: 'Strong',
        badgeType: 'strong',
        description: 'Mampu menjembatani diskusi desain dengan tim Developer.',
        score: 88
      },
      {
        id: 'soft-2',
        name: 'Agile / Scrum Methodology',
        badge: 'Intermediate',
        badgeType: 'intermediate',
        description: 'Familiar dengan Sprint Planning dan retrospeksi mingguan.',
        score: 70
      },
      {
        id: 'soft-3',
        name: 'Presentation & Pitching',
        badge: 'Strong',
        badgeType: 'strong',
        description: 'Percaya diri mempresentasikan data temuan riset ke user.',
        score: 85
      }
    ],
    growthRoadmap: [
      {
        step: 1,
        title: 'Selesaikan Mini Course Design Tokens',
        estDays: 'Est. 3 Hari',
        description: 'Pelajari mapping token warna, typography, dan spacing di Figma Tokens plugin yang sinkron dengan GitHub developer.',
        footerLabel: 'Modul 4 Jam',
        gainLabel: '+9% Kesiapan',
        type: 'course'
      },
      {
        step: 2,
        title: 'Update Studi Kasus Portofolio',
        estDays: 'Est. 5 Hari',
        description: 'Tambahkan metrik bisnis nyata pada proyek magang Telkom (misal: rasio konversi pendaftaran naik 24% pasca-redesign).',
        footerLabel: 'Panduan Portofolio AI',
        gainLabel: '+5% Kesiapan',
        type: 'portfolio'
      },
      {
        step: 3,
        title: 'Kirim Lamaran ke 5 Partner Startup',
        estDays: 'Target Akhir',
        description: 'Gunakan fitur Fast-Track Apply Growvia untuk lowongan dengan rekomendasi kecocokan auto-match 85%+.',
        footerLabel: 'Ekosistem Lowongan',
        gainLabel: 'Siap Kerja 100%',
        type: 'application'
      }
    ]
  },
  'ai-engineer': {
    id: 'ai-engineer',
    title: 'AI Engineer',
    companyType: 'Tech Industry',
    level: 'Junior / Fresh Graduate Tier 1',
    readinessScore: 68,
    readinessStatus: 'Developing',
    readinessBadgeColor: '#F59E0B',
    verifiedJobsCount: 140,
    lastUpdated: 'Update 2 hari lalu',
    salaryRange: 'Rp 12.000.000 – Rp 19.500.000',
    summary: 'Membangun, melatih, dan mendeploy model kecerdasan buatan (Machine Learning / Deep Learning / LLM) ke arsitektur produksi yang handal dan skalabel.',
    competentCount: 4,
    totalSkillsCount: 10,
    developCount: 3,
    missingCount: 3,
    aiInsight:
      'Nabila, kamu punya fondasi Python, Problem Solving, & Git yang sangat solid dari portofolio riset dan akademik. Untuk bersaing kuat di role AI Engineer di Tech Industry, prioritaskan Model Deployment (FastAPI, Docker) dan MLOps serta perkuat Machine Learning & SQL.',
    highlightedKeywords: ['Model Deployment', 'MLOps'],
    strongSkills: [
      { id: 'python', name: 'Python', status: 'strong', score: 95, evidenceCount: 4, category: 'Hard Skill', description: 'Penguasaan OOP, data structures, algoritma numerik, dan skrip modular.' },
      { id: 'problem-solving', name: 'Problem Solving', status: 'strong', score: 92, evidenceCount: 3, category: 'Soft Skill', description: 'Kemampuan membedah problem statement kompleks menjadi tahapan komputasi.' },
      { id: 'communication', name: 'Communication', status: 'strong', score: 88, evidenceCount: 3, category: 'Soft Skill', description: 'Mampu menjelaskan konsep teknis AI dan metrik evaluasi model ke non-teknis.' },
      { id: 'git', name: 'Git', status: 'strong', score: 90, evidenceCount: 5, category: 'Tools & Cloud', description: 'Mahir dalam version control, branching strategy Git Flow, dan pull request review.' }
    ],
    developSkills: [
      { id: 'machine-learning', name: 'Machine Learning', status: 'develop', score: 65, evidenceCount: 2, category: 'Hard Skill', description: 'Memahami teori regresi, klasifikasi, clustering, dan tuning hyperparameter PyTorch/Scikit.' },
      { id: 'data-processing', name: 'Data Processing', status: 'develop', score: 62, evidenceCount: 2, category: 'Hard Skill', description: 'Pembersihan data mentah, feature engineering, penanganan missing values.' },
      { id: 'sql', name: 'SQL', status: 'develop', score: 58, evidenceCount: 1, category: 'Hard Skill', description: 'Query DDL/DML, Window Functions, dan optimasi query analitik.' }
    ],
    missingSkills: [
      { id: 'model-deployment', name: 'Model Deployment', status: 'missing', score: 25, priority: 'high', category: 'Hard Skill', description: 'Membungkus model terlatih ke dalam microservice FastAPI / Docker.' },
      { id: 'cloud-computing', name: 'Cloud Computing', status: 'missing', score: 28, priority: 'high', category: 'Tools & Cloud', description: 'Infrastruktur GCP / AWS untuk komputasi GPU dan cloud storage.' },
      { id: 'mlops', name: 'MLOps', status: 'missing', score: 20, priority: 'high', category: 'Tools & Cloud', description: 'Tracking eksperimen model (MLflow/W&B) dan CI/CD for ML.' }
    ],
    detailedMatrix: [
      {
        category: 'Hard Skills Industri',
        description: 'Kompetensi teknis utama yang disaring oleh Hiring Manager',
        skillsCountLabel: '5 Skill Dievaluasi',
        skills: [
          { id: 'py-det', name: 'Python & Algoritma Komputasi', status: 'strong', score: 95, evidenceNote: 'Terverifikasi dari 4 proyek portofolio', actionType: 'qualified', actionLabel: 'Kualifikasi Tercapai' },
          { id: 'ml-det', name: 'Machine Learning (PyTorch / Scikit)', status: 'develop', score: 65, evidenceNote: 'Butuh bukti implementasi model training', actionType: 'recommend', actionLabel: 'Lihat Rekomendasi Belajar' },
          { id: 'sql-det', name: 'Data Processing & SQL Relasional', status: 'develop', score: 58, evidenceNote: 'Perlu latihan query analitik dan CTEs', actionType: 'recommend', actionLabel: 'Lihat Rekomendasi Belajar' },
          { id: 'deploy-det', name: 'Model Deployment (FastAPI / Docker)', status: 'missing', score: 25, evidenceNote: 'Belum ada bukti proyek model serving', actionType: 'intro_module', actionLabel: 'Ambil Modul Pengantar' },
          { id: 'mlops-det', name: 'MLOps & CI/CD Pipeline', status: 'missing', score: 20, evidenceNote: 'Wajib dipelajari untuk lolos ATS scanner level Junior', actionType: 'intro_module', actionLabel: 'Ambil Modul Pengantar' }
        ]
      }
    ],
    softSkills: [
      { id: 'soft-ai-1', name: 'Problem Solving & Logic', badge: 'Strong', badgeType: 'strong', description: 'Kemampuan analisis komputasional dan deduksi logis terstruktur.', score: 92 },
      { id: 'soft-ai-2', name: 'Git & Agile Teamwork', badge: 'Strong', badgeType: 'strong', description: 'Familiar dengan Git Flow, PR code reviews, dan daily standups.', score: 90 },
      { id: 'soft-ai-3', name: 'Tech Communication', badge: 'Strong', badgeType: 'strong', description: 'Presentasi temuan model AI secara persuasif ke stakeholder.', score: 88 }
    ],
    growthRoadmap: [
      {
        step: 1,
        title: 'Selesaikan Mini Course Model Deployment & FastAPI',
        estDays: 'Est. 5 Hari',
        description: 'Pelajari cara membungkus model scikit/PyTorch ke dalam FastAPI endpoint dan buat container Docker lokal.',
        footerLabel: 'Modul 6 Jam',
        gainLabel: '+12% Kesiapan',
        type: 'course'
      },
      {
        step: 2,
        title: 'Update Studi Kasus Portofolio dengan Tracking MLOps',
        estDays: 'Est. 7 Hari',
        description: 'Tambahkan metrik model accuracy, tracking latency, dan logging otomatis menggunakan MLflow pada repo GitHub kamu.',
        footerLabel: 'Panduan Portofolio AI',
        gainLabel: '+8% Kesiapan',
        type: 'portfolio'
      },
      {
        step: 3,
        title: 'Kirim Lamaran ke 5 Partner Tech Startup',
        estDays: 'Target Akhir',
        description: 'Gunakan fitur Fast-Track Apply Growvia untuk lowongan AI Engineer dengan kecocokan rekomendasi auto-match 85%+.',
        footerLabel: 'Ekosistem Lowongan',
        gainLabel: 'Siap Kerja 92%+',
        type: 'application'
      }
    ]
  }
}

export const RECOMMENDED_LEARNING_RESOURCES: LearningResourceItem[] = [
  {
    id: 'res-1',
    title: 'Figma Tokens & Design System Architecture',
    type: 'Video Lab',
    provider: 'Growvia Academy x Design Systems Indonesia',
    duration: '4 Jam • 10 Video Lab',
    targetSkill: 'Design System & Tokens',
    difficulty: 'Intermediate',
    rating: 4.9,
    reviewsCount: 382,
    isFree: true,
    description: 'Panduan praktis mapping token warna, typography, dan spacing di Figma Tokens plugin yang sinkron dengan GitHub developer.',
    url: '#'
  },
  {
    id: 'res-2',
    title: 'Product Analytics Fundamental: Mixpanel & Google Analytics 4',
    type: 'Hands-on Project',
    provider: 'Growvia Lab x Product School ID',
    duration: '5 Jam • 4 Lab Hands-on',
    targetSkill: 'Product Analytics',
    difficulty: 'Intermediate',
    rating: 4.8,
    reviewsCount: 290,
    isFree: true,
    description: 'Pelajari tracking funnel konversi, user retention cohort, dan evaluasi dampak fitur redesign menggunakan metrik nyata.',
    url: '#'
  },
  {
    id: 'res-3',
    title: 'FastAPI & Docker: Model Deployment untuk AI Engineer',
    type: 'Video Lab',
    provider: 'Growvia Academy x Dicoding',
    duration: '4 Jam • 12 Video Lab',
    targetSkill: 'Model Deployment',
    difficulty: 'Beginner',
    rating: 4.9,
    reviewsCount: 342,
    isFree: true,
    description: 'Panduan step-by-step membuat REST API menggunakan FastAPI, validasi data dengan Pydantic, dan containerization Docker.',
    url: '#'
  },
  {
    id: 'res-4',
    title: 'MLOps Fundamentals: Continuous Training & GitHub Actions',
    type: 'Hands-on Project',
    provider: 'Growvia Lab x Google Developer Group',
    duration: '5 Jam • 4 Lab Hands-on',
    targetSkill: 'MLOps',
    difficulty: 'Intermediate',
    rating: 4.8,
    reviewsCount: 218,
    isFree: true,
    description: 'Pelajari konsep MLOps modern: versioning dataset, tracking eksperimen MLflow, dan deployment otomatis dengan CI/CD pipeline.',
    url: '#'
  },
  {
    id: 'res-5',
    title: 'Advanced User Research Synthesis & Usability Metrics',
    type: 'Industry Workshop',
    provider: 'UX Indonesia Association',
    duration: '3.5 Jam • Live Interactive',
    targetSkill: 'User Research',
    difficulty: 'Advanced',
    rating: 4.9,
    reviewsCount: 415,
    isFree: true,
    description: 'Kuasai System Usability Scale (SUS), Single Ease Question (SEQ), dan menyusun laporan eksekutif dampak UX ke tim C-level.',
    url: '#'
  }
]
