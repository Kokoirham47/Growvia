import {
  PrismaClient,
  OpportunityType,
  OpportunitySkillImportance,
  SkillCategory
} from '@prisma/client'

const prisma = new PrismaClient()

interface SeedOpportunityItem {
  title: string
  company: string
  location: string
  sourceUrl: string
  type: OpportunityType
  deadline: Date
  description: string
  requiredSkills: string[]
  preferredSkills: string[]
}

const OPPORTUNITIES_DATA: SeedOpportunityItem[] = [
  {
    title: 'Associate Product Designer Intern',
    company: 'GoTo (Gojek Tokopedia)',
    location: 'Jakarta Selatan (Hybrid)',
    sourceUrl: 'https://careers.goto.com/jobs/associate-product-designer-intern',
    type: OpportunityType.internship,
    deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000), // ~35 days from now
    description:
      'Bergabunglah bersama tim Consumer Experience GoTo untuk merancang antarmuka produk mobile & web jutaan pengguna harian. Anda akan terlibat dalam riset pengguna, wireframing, dan implementasi design system skala besar bersama para senior designer & engineers.',
    requiredSkills: [
      'Figma & Auto-layout',
      'Wireframing & Prototyping',
      'User Research & Testing'
    ],
    preferredSkills: [
      'Design System & Tokens',
      'Agile / Scrum Methodology'
    ]
  },
  {
    title: 'Junior Frontend Engineer',
    company: 'Traveloka',
    location: 'Tangerang / BSD (Hybrid)',
    sourceUrl: 'https://www.traveloka.com/en-id/careers/junior-frontend-engineer',
    type: OpportunityType.full_time,
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    description:
      'Membangun antarmuka platform reservasi travel dan finansial Traveloka yang ultra-responsif, aksesibel, dan berkinerja tinggi menggunakan stack modern React, TypeScript, dan Next.js dengan arsitektur micro-frontend teruji.',
    requiredSkills: [
      'React.js',
      'TypeScript',
      'Next.js & SSR'
    ],
    preferredSkills: [
      'Tailwind CSS & Component UI',
      'Problem Solving & Logic'
    ]
  },
  {
    title: 'BCA IT Trainee - Software Engineering',
    company: 'Bank Central Asia (BCA)',
    location: 'Jakarta Barat (On-site)',
    sourceUrl: 'https://karir.bca.co.id/peluang-karir/it-trainee',
    type: OpportunityType.full_time,
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    description:
      'Program akselerasi talenta teknologi Bank Central Asia selama 12 bulan dengan bimbingan intensif arsitektur perbankan mission-critical, high-concurrency transaction, data processing, dan pengembangan software modern berstandar industri.',
    requiredSkills: [
      'Problem Solving & Logic',
      'Data Processing & SQL',
      'TypeScript'
    ],
    preferredSkills: [
      'Agile / Scrum Methodology',
      'Cross-functional Comm.'
    ]
  },
  {
    title: 'QA Engineer & Test Automation Specialist',
    company: 'Shopee Indonesia',
    location: 'Jakarta Pusat (Hybrid)',
    sourceUrl: 'https://careers.shopee.co.id/job-detail/qa-engineer-specialist',
    type: OpportunityType.full_time,
    deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
    description:
      'Memastikan keandalan fungsional, performa beban, dan keamanan ekosistem e-commerce Shopee melalui automated testing pipelines, integration tests, dan kolaborasi erat bersama tim software engineering regional.',
    requiredSkills: [
      'Problem Solving & Logic',
      'Python',
      'Data Processing & SQL'
    ],
    preferredSkills: [
      'Agile / Scrum Methodology'
    ]
  },
  {
    title: 'Tech Curriculum Mentor & AI Associate',
    company: 'Dicoding Indonesia',
    location: 'Remote (Seluruh Indonesia)',
    sourceUrl: 'https://www.dicoding.com/careers/tech-mentor-ai',
    type: OpportunityType.part_time,
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    description:
      'Membimbing ribuan siswa akademi teknologi nasional dalam memahami pemrograman, algoritma kecerdasan buatan (Machine Learning), serta mereview kode submission proyek portofolio siswa dengan standar industri global.',
    requiredSkills: [
      'Python',
      'Machine Learning',
      'Problem Solving & Logic'
    ],
    preferredSkills: [
      'Cross-functional Comm.'
    ]
  },
  {
    title: 'UI/UX Research & Interaction Intern',
    company: 'Blibli',
    location: 'Jakarta Barat (Hybrid)',
    sourceUrl: 'https://careers.blibli.com/jobs/ui-ux-research-intern',
    type: OpportunityType.internship,
    deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
    description:
      'Eksplorasi usability testing mendalam, pengujian prototipe checkout e-commerce, dan wawancara pengguna bersama tim Riset Desain Blibli untuk mengoptimalkan kepuasan pelanggan omnichannel retail.',
    requiredSkills: [
      'User Research & Testing',
      'Wireframing & Prototyping'
    ],
    preferredSkills: [
      'Figma & Auto-layout',
      'Product Discovery & Strategy'
    ]
  },
  {
    title: 'Junior Machine Learning Engineer',
    company: 'Astra Digital',
    location: 'Jakarta Utara (Hybrid)',
    sourceUrl: 'https://astradigital.id/career/junior-ml-engineer',
    type: OpportunityType.full_time,
    deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
    description:
      'Mengembangkan dan mendeploy model predictive analytics, computer vision, dan natural language processing untuk mendigitalisasi rantai pasok dan ekosistem mobilitas grup Astra di seluruh Indonesia.',
    requiredSkills: [
      'Python',
      'Machine Learning',
      'Data Processing & SQL'
    ],
    preferredSkills: [
      'Model Deployment (FastAPI / Docker)',
      'MLOps & CI/CD Pipeline'
    ]
  },
  {
    title: 'Bangkit 2026 Tech Cohort Capstone Challenge',
    company: 'Google Bangkit Academy',
    location: 'Remote / Jakarta (Hybrid)',
    sourceUrl: 'https://grow.google/intl/id_id/bangkit/',
    type: OpportunityType.competition,
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    description:
      'Kompetisi proyek capstone berskala nasional yang didukung Kemendikbudristek dan Google. Peserta ditantang membangun solusi digital berkelanjutan bernilai sosial tinggi dengan pendanaan inkubasi jutaan rupiah.',
    requiredSkills: [
      'Problem Solving & Logic',
      'Cross-functional Comm.'
    ],
    preferredSkills: [
      'Machine Learning',
      'React.js',
      'Agile / Scrum Methodology'
    ]
  },
  {
    title: 'Data Analytics & Business Intelligence Intern',
    company: 'Kredivo Group',
    location: 'Jakarta Selatan (Hybrid)',
    sourceUrl: 'https://kredivo.com/careers/data-analytics-intern',
    type: OpportunityType.internship,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    description:
      'Menganalisis pola transaksi finansial, cohort pengguna, dan visualisasi dashboard performa produk lending menggunakan SQL dan Python untuk mendukung keputusan strategis tim bisnis dan manajemen risiko.',
    requiredSkills: [
      'Data Processing & SQL',
      'Python',
      'Problem Solving & Logic'
    ],
    preferredSkills: [
      'Quantitative & Market Analytics'
    ]
  },
  {
    title: 'Digital Innovation & Prototyping Specialist',
    company: 'Telkom Indonesia (Amoeba)',
    location: 'Bandung / Remote',
    sourceUrl: 'https://amoeba.id/careers/digital-prototyping',
    type: OpportunityType.freelance,
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    description:
      'Membantu inkubator startup internal Telkom Indonesia dalam memvalidasi ide produk digital baru, merancang MVP kilat, user interface prototipe interaktif, dan validasi market product-fit.',
    requiredSkills: [
      'React.js',
      'Figma & Auto-layout'
    ],
    preferredSkills: [
      'Product Discovery & Strategy',
      'Stakeholder Management'
    ]
  }
]

async function seedOpportunities() {
  console.log('🌱 Memulai proses seeding data Career Opportunities...')

  // 1. Pastikan semua skill yang direferensikan sudah terdaftar di tabel master skills
  const allReferencedSkillNames = Array.from(
    new Set(OPPORTUNITIES_DATA.flatMap(o => [...o.requiredSkills, ...o.preferredSkills]))
  )

  const skillMap: Record<string, string> = {}

  for (const skillName of allReferencedSkillNames) {
    let skill = await prisma.skill.findUnique({
      where: { name: skillName }
    })

    if (!skill) {
      skill = await prisma.skill.create({
        data: {
          name: skillName,
          category: SkillCategory.technical,
          normalizedName: skillName.toLowerCase().replace(/[^a-z0-9]/g, '-')
        }
      })
    }

    skillMap[skillName] = skill.id
  }

  console.log(`✅ ${Object.keys(skillMap).length} master skills telah dipetakan.`)

  // 2. Insert atau Upsert setiap opportunity
  let insertedCount = 0

  for (const item of OPPORTUNITIES_DATA) {
    const existing = await prisma.careerOpportunity.findFirst({
      where: {
        title: item.title,
        company: item.company
      }
    })

    let oppId: string

    if (existing) {
      const updated = await prisma.careerOpportunity.update({
        where: { id: existing.id },
        data: {
          location: item.location,
          sourceUrl: item.sourceUrl,
          type: item.type,
          deadline: item.deadline,
          description: item.description,
          isActive: true
        }
      })
      oppId = updated.id
    } else {
      const created = await prisma.careerOpportunity.create({
        data: {
          title: item.title,
          company: item.company,
          location: item.location,
          sourceUrl: item.sourceUrl,
          type: item.type,
          deadline: item.deadline,
          description: item.description,
          isActive: true,
          postedAt: new Date(Date.now() - Math.floor(Math.random() * 5 + 1) * 24 * 60 * 60 * 1000)
        }
      })
      oppId = created.id
      insertedCount++
    }

    // Hapus tags lama agar terupdate bersih
    await prisma.opportunitySkillTag.deleteMany({
      where: { careerOpportunityId: oppId }
    })

    // Hubungkan Required Skills
    for (const sName of item.requiredSkills) {
      const skillId = skillMap[sName]
      if (skillId) {
        await prisma.opportunitySkillTag.create({
          data: {
            careerOpportunityId: oppId,
            skillId,
            importance: OpportunitySkillImportance.required
          }
        })
      }
    }

    // Hubungkan Preferred Skills
    for (const sName of item.preferredSkills) {
      const skillId = skillMap[sName]
      if (skillId) {
        await prisma.opportunitySkillTag.create({
          data: {
            careerOpportunityId: oppId,
            skillId,
            importance: OpportunitySkillImportance.preferred
          }
        })
      }
    }
  }

  console.log(`🎉 Berhasil memproses ${OPPORTUNITIES_DATA.length} Career Opportunities (Baru dibuat: ${insertedCount}).`)
}

seedOpportunities()
  .catch(err => {
    console.error('❌ Gagal melakukan seeding peluang karier:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
