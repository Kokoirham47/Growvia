import bcrypt from 'bcryptjs'
import { prisma } from '../src/libs/prisma'

async function seedDemoUser() {
  console.log('🌱 Menyiapkan akun demo testing lengkap dengan progress & pengalaman...')

  const email = 'demo@growvia.id'
  const plainPassword = 'Password123!'
  const hashedPassword = await bcrypt.hash(plainPassword, 10)

  // 1. Upsert User
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash: hashedPassword,
      name: 'Budi Pratama (Growvia Demo)',
      status: 'active',
      emailVerifiedAt: new Date(),
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
    },
    create: {
      email,
      name: 'Budi Pratama (Growvia Demo)',
      passwordHash: hashedPassword,
      status: 'active',
      emailVerifiedAt: new Date(),
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
    }
  })

  console.log(`✅ User berhasil dibuat/diperbarui: ${user.email} (${user.id})`)

  // 2. Upsert Profile
  await prisma.profile.upsert({
    where: { userId: user.id },
    update: {
      institution: 'Universitas Indonesia',
      major: 'Ilmu Komputer & Sistem Informasi',
      graduationYear: 2026,
      headline: 'Frontend Web Engineer & Digital Product Enthusiast',
      bio: 'Mahasiswa tingkat akhir dengan spesialisasi React.js, Next.js, dan modern Web Platform. Aktif mengeksplorasi kecerdasan buatan (AI) serta optimasi performa aplikasi web skala enterprise.',
      portfolioSlug: 'budi-pratama-demo',
      portfolioPublished: true
    },
    create: {
      userId: user.id,
      institution: 'Universitas Indonesia',
      major: 'Ilmu Komputer & Sistem Informasi',
      graduationYear: 2026,
      headline: 'Frontend Web Engineer & Digital Product Enthusiast',
      bio: 'Mahasiswa tingkat akhir dengan spesialisasi React.js, Next.js, dan modern Web Platform. Aktif mengeksplorasi kecerdasan buatan (AI) serta optimasi performa aplikasi web skala enterprise.',
      portfolioSlug: 'budi-pratama-demo',
      portfolioPublished: true
    }
  })
  console.log('✅ Profil pengguna diperbarui.')

  // 3. Bersihkan data pengalaman, skill, dan target lama untuk demo user agar fresh & konsisten
  await prisma.skillEvidence.deleteMany({
    where: { userSkill: { userId: user.id } }
  })
  await prisma.userSkill.deleteMany({ where: { userId: user.id } })
  await prisma.experience.deleteMany({ where: { userId: user.id } })
  await prisma.skillGapResult.deleteMany({
    where: { careerTarget: { userId: user.id } }
  })
  await prisma.userCareerTarget.deleteMany({ where: { userId: user.id } })
  await prisma.userSavedOpportunity.deleteMany({ where: { userId: user.id } })
  await prisma.userSavedResource.deleteMany({ where: { userId: user.id } })
  await prisma.notification.deleteMany({ where: { userId: user.id } })

  // 4. Tambahkan 4 Pengalaman Nyata & Berbobot
  const exp1 = await prisma.experience.create({
    data: {
      userId: user.id,
      title: 'Frontend Web Developer Intern',
      role: 'Frontend Engineering Intern',
      institutionName: 'PT GoTo Gojek Tokopedia Tbk',
      type: 'internship',
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-12-01'),
      isOngoing: false,
      description: 'Mengembangkan komponen antarmuka web performa tinggi untuk Merchant Web Dashboard dengan React, Next.js, TypeScript, dan Tailwind CSS. Berhasil mengurangi First Contentful Paint sebesar 28% dan berkolaborasi dalam sprint Scrum dua mingguan bersama tim lintas divisi.'
    }
  })

  const exp2 = await prisma.experience.create({
    data: {
      userId: user.id,
      title: 'Growvia - AI-Powered Career Platform',
      role: 'Lead Frontend Engineer & Architect',
      institutionName: 'Independent Capstone Project',
      type: 'project',
      startDate: new Date('2026-01-10'),
      isOngoing: true,
      description: 'Merancang arsitektur frontend web modern dengan Next.js App Router, Tailwind CSS, shadcn/ui tokens, dan Prisma ORM terhubung ke PostgreSQL. Mengintegrasikan algoritma pencocokan kompetensi dan rekomendasi modul belajar cerdas.'
    }
  })

  const exp3 = await prisma.experience.create({
    data: {
      userId: user.id,
      title: 'Kepala Departemen Riset & Teknologi',
      role: 'Head of Research and Technology',
      institutionName: 'BEM Fasilkom Universitas Indonesia',
      type: 'organisation',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2025-01-31'),
      isOngoing: false,
      description: 'Memimpin tim engineering yang terdiri dari 14 developer dalam merilis portal layanan akademik internal kampus. Menyelenggarakan bootcamp coding internal dan memfasilitasi mentoring teknis untuk 120+ mahasiswa baru.'
    }
  })

  const exp4 = await prisma.experience.create({
    data: {
      userId: user.id,
      title: 'Juara 1 Web Innovation Hackathon 2025',
      role: 'Full-Stack Developer & Pitcher',
      institutionName: 'Kementerian Komunikasi dan Digital RI (Komdigi)',
      type: 'competition',
      startDate: new Date('2025-09-01'),
      endDate: new Date('2025-09-15'),
      isOngoing: false,
      description: 'Membangun prototipe aplikasi analitik karier mahasiswa berbasis AI dalam kompetisi hackathon nasional berdurasi 48 jam. Meraih predikat Best Technical Architecture dan Best Presentation.'
    }
  })
  console.log('✅ 4 Pengalaman (Magang, Proyek, Organisasi, Kompetisi) berhasil ditambahkan.')

  // 5. Hubungkan Skill & Evidences
  // Ambil skills dari database
  const allDbSkills = await prisma.skill.findMany()
  const skillMap = new Map(allDbSkills.map(s => [s.name.toLowerCase(), s.id]))

  // Helper cari skill id berdasarkan kemiripan nama
  const findSkillId = (query: string): string | null => {
    const q = query.toLowerCase()
    if (skillMap.has(q)) return skillMap.get(q)!
    for (const [name, id] of skillMap.entries()) {
      if (name.includes(q)) return id
    }
    return null
  }

  const skillsToSeed = [
    { query: 'React.js', level: 'advanced', score: 88, source: 'ai_extracted', conf: 0.96, expId: exp1.id, note: 'Digunakan dalam merchant web dashboard di GoTo.' },
    { query: 'TypeScript', level: 'advanced', score: 85, source: 'ai_extracted', conf: 0.94, expId: exp1.id, note: 'Penerapan strict typing di seluruh basis kode GoTo dan Growvia.' },
    { query: 'Next.js & SSR', level: 'advanced', score: 86, source: 'ai_extracted', conf: 0.95, expId: exp2.id, note: 'Membangun platform Growvia dengan App Router dan SSR.' },
    { query: 'Tailwind CSS & Component UI', level: 'expert', score: 92, source: 'ai_extracted', conf: 0.98, expId: exp2.id, note: 'Pembuatan design system modular dan dark mode tokens.' },
    { query: 'PostgreSQL', level: 'intermediate', score: 75, source: 'manual', conf: 0.88, expId: exp2.id, note: 'Perancangan skema relasional di Supabase.' },
    { query: 'Prisma ORM', level: 'advanced', score: 82, source: 'ai_extracted', conf: 0.92, expId: exp2.id, note: 'Query relational, seeder, dan relasi multi-table.' },
    { query: 'Data Processing & SQL', level: 'intermediate', score: 72, source: 'manual', conf: 0.85, expId: exp2.id, note: 'Query PostgreSQL dan aggregasi data analitik.' },
    { query: 'Problem Solving & Logic', level: 'advanced', score: 88, source: 'ai_extracted', conf: 0.93, expId: exp4.id, note: 'Juara 1 Hackathon nasional 48 jam.' },
    { query: 'Cross-functional Comm.', level: 'advanced', score: 84, source: 'ai_extracted', conf: 0.90, expId: exp1.id, note: 'Koordinasi lintas tim PM, UX Designer, dan QA di GoTo.' },
    { query: 'Team Leadership', level: 'advanced', score: 86, source: 'manual', conf: 0.92, expId: exp3.id, note: 'Memimpin 14 orang developer di BEM Fasilkom UI.' },
    { query: 'Wireframing', level: 'intermediate', score: 74, source: 'ai_extracted', conf: 0.85, expId: exp2.id, note: 'Merancang low-fidelity wireframe alur Growvia.' },
    { query: 'Figma Systems', level: 'intermediate', score: 76, source: 'manual', conf: 0.87, expId: exp2.id, note: 'Desain mockup dan prototipe interaktif.' },
    { query: 'Figma & Auto-layout', level: 'intermediate', score: 76, source: 'manual', conf: 0.87, expId: exp2.id, note: 'Desain komponen auto-layout.' },
    { query: 'Python', level: 'intermediate', score: 70, source: 'manual', conf: 0.82, expId: exp4.id, note: 'Scripting data preprocessing pada proyek hackathon.' }
  ]

  let addedSkillsCount = 0
  const processedSkillIds = new Set<string>()

  for (const s of skillsToSeed) {
    const sId = findSkillId(s.query)
    if (sId && !processedSkillIds.has(sId)) {
      processedSkillIds.add(sId)
      const userSkill = await prisma.userSkill.create({
        data: {
          userId: user.id,
          skillId: sId,
          level: s.level as any,
          score: s.score,
          source: s.source as any,
          aiConfidence: s.conf
        }
      })

      if (s.expId) {
        await prisma.skillEvidence.create({
          data: {
            userSkillId: userSkill.id,
            experienceId: s.expId,
            note: s.note
          }
        })
      }
      addedSkillsCount++
    }
  }
  console.log(`✅ ${addedSkillsCount} Skill terverifikasi berhasil dihubungkan ke profil dan bukti pengalaman.`)

  // 6. Hubungkan Target Karier: Frontend Web Engineer
  const frontendRole = await prisma.careerRole.findFirst({
    where: { slug: 'frontend-engineer' }
  })

  const targetRole = frontendRole || (await prisma.careerRole.findFirst())

  if (targetRole) {
    const careerTarget = await prisma.userCareerTarget.create({
      data: {
        userId: user.id,
        careerRoleId: targetRole.id,
        isActive: true,
        readinessScore: 84,
        lastAnalyzedAt: new Date()
      }
    })

    // Masukkan data Skill Gap Result yang realistis
    const reactId = findSkillId('React')
    const tsId = findSkillId('TypeScript')
    const nextId = findSkillId('Next.js')
    const tailwindId = findSkillId('Tailwind CSS')
    const dataProcId = findSkillId('Data Processing')
    const deployId = findSkillId('Deployment') || findSkillId('FastAPI')

    if (reactId) {
      await prisma.skillGapResult.create({
        data: {
          userCareerTargetId: careerTarget.id,
          skillId: reactId,
          gapCategory: 'strong',
          userScore: 88,
          requiredScore: 80,
          gapScore: 0
        }
      })
    }

    if (tsId) {
      await prisma.skillGapResult.create({
        data: {
          userCareerTargetId: careerTarget.id,
          skillId: tsId,
          gapCategory: 'strong',
          userScore: 85,
          requiredScore: 75,
          gapScore: 0
        }
      })
    }

    if (nextId) {
      await prisma.skillGapResult.create({
        data: {
          userCareerTargetId: careerTarget.id,
          skillId: nextId,
          gapCategory: 'strong',
          userScore: 86,
          requiredScore: 75,
          gapScore: 0
        }
      })
    }

    if (tailwindId) {
      await prisma.skillGapResult.create({
        data: {
          userCareerTargetId: careerTarget.id,
          skillId: tailwindId,
          gapCategory: 'strong',
          userScore: 92,
          requiredScore: 70,
          gapScore: 0
        }
      })
    }

    if (dataProcId) {
      await prisma.skillGapResult.create({
        data: {
          userCareerTargetId: careerTarget.id,
          skillId: dataProcId,
          gapCategory: 'develop',
          userScore: 65,
          requiredScore: 75,
          gapScore: 10
        }
      })
    }

    if (deployId) {
      await prisma.skillGapResult.create({
        data: {
          userCareerTargetId: careerTarget.id,
          skillId: deployId,
          gapCategory: 'missing',
          userScore: 0,
          requiredScore: 65,
          gapScore: 65
        }
      })
    }
    console.log(`✅ Target karier "${targetRole.name}" (Readiness Score 84%) dan Skill Gap Result berhasil dipetakan.`)
  }

  // 7. Simpan beberapa Lowongan (Bookmarks Peluang Karier)
  const opps = await prisma.careerOpportunity.findMany({ take: 3 })
  for (const opp of opps.slice(0, 2)) {
    await prisma.userSavedOpportunity.create({
      data: {
        userId: user.id,
        careerOpportunityId: opp.id,
        skillMatchScore: 85
      }
    })
  }
  console.log(`✅ 2 Lowongan karier berhasil di-bookmark sebagai daftar tersimpan.`)

  // 8. Simpan beberapa Modul Belajar (Bookmarks Rekomendasi Belajar)
  const resources = await prisma.learningResource.findMany({ take: 2 })
  for (const res of resources) {
    await prisma.userSavedResource.create({
      data: {
        userId: user.id,
        learningResourceId: res.id,
        isCompleted: false
      }
    })
  }
  console.log(`✅ 2 Modul belajar berhasil di-bookmark.`)

  // 9. Tambahkan Notifikasi Sambutan & Update
  await prisma.notification.createMany({
    data: [
      {
        userId: user.id,
        type: 'career_opportunity',
        title: 'Lowongan Cocok: Frontend Web Engineer di Stockbit & Bibit',
        body: 'Profil skill kamu memiliki kecocokan tinggi (92%) untuk lowongan Frontend Web Engineer.',
        actionUrl: '/opportunities',
        isRead: false
      },
      {
        userId: user.id,
        type: 'skill_update',
        title: 'Portofolio Skill Terverifikasi',
        body: '12 skill teknis dan soft skill kamu telah berhasil divalidasi berdasarkan bukti pengalaman nyata.',
        actionUrl: '/skills',
        isRead: true,
        readAt: new Date()
      },
      {
        userId: user.id,
        type: 'learning_reminder',
        title: 'Tingkatkan Kesiapan Karier ke 90%+',
        body: 'Pelajari modul DevOps dan Containerization untuk menutup kesenjangan kompetensi terakhirmu.',
        actionUrl: '/learning',
        isRead: true,
        readAt: new Date()
      }
    ]
  })
  console.log('✅ 3 Notifikasi interaktif berhasil ditambahkan.')

  console.log('\n======================================================')
  console.log('🎉 AKUN DEMO TESTING BERHASIL DIBUAT DENGAN DATA LENGKAP!')
  console.log('📧 Email   : demo@growvia.id')
  console.log('🔑 Password: Password123!')
  console.log('👤 Nama    : Budi Pratama (Growvia Demo)')
  console.log('🎯 Target  : Frontend Web Engineer (84% Kesiapan)')
  console.log('💼 Exp     : 4 Pengalaman (GoTo, Growvia, BEM UI, Hackathon Komdigi)')
  console.log('🧠 Skills  : 12 Skill Terverifikasi lengkap dengan bukti')
  console.log('⭐ Saved   : Peluang Karier & Modul Belajar Tersimpan')
  console.log('======================================================\n')
}

seedDemoUser()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
