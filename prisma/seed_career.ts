import { PrismaClient, SkillCategory, RoleSkillImportance, SkillLevel, LearningResourceType, Difficulty, ContentSource } from '@prisma/client'

const prisma = new PrismaClient()

async function seedCareerData() {
  console.log('🌱 Seeding Career Roles & Learning Resources in Supabase...')

  // 1. Ensure all relevant skills exist in master skills table
  const skillsToEnsure: { name: string; category: SkillCategory; normalizedName: string }[] = [
    // Product Design Skills
    { name: 'Figma & Auto-layout', category: 'hard_skill', normalizedName: 'figma' },
    { name: 'User Research & Testing', category: 'hard_skill', normalizedName: 'user-research' },
    { name: 'Wireframing & Prototyping', category: 'hard_skill', normalizedName: 'wireframing' },
    { name: 'Design System & Tokens', category: 'hard_skill', normalizedName: 'design-tokens' },
    { name: 'Product Analytics (Mixpanel / GA4)', category: 'hard_skill', normalizedName: 'product-analytics' },
    { name: 'Cross-functional Comm.', category: 'soft_skill', normalizedName: 'cross-comm' },
    { name: 'Agile / Scrum Methodology', category: 'soft_skill', normalizedName: 'agile-scrum' },

    // AI & ML Skills
    { name: 'Python', category: 'technical', normalizedName: 'python' },
    { name: 'Machine Learning', category: 'technical', normalizedName: 'machine-learning' },
    { name: 'Data Processing & SQL', category: 'technical', normalizedName: 'sql' },
    { name: 'Model Deployment (FastAPI / Docker)', category: 'technical', normalizedName: 'model-deployment' },
    { name: 'MLOps & CI/CD Pipeline', category: 'technical', normalizedName: 'mlops' },
    { name: 'Cloud Computing (GCP/AWS)', category: 'technical', normalizedName: 'cloud-computing' },
    { name: 'Problem Solving & Logic', category: 'soft_skill', normalizedName: 'problem-solving' },

    // Frontend Skills
    { name: 'React.js', category: 'technical', normalizedName: 'react' },
    { name: 'Next.js & SSR', category: 'technical', normalizedName: 'nextjs' },
    { name: 'TypeScript', category: 'technical', normalizedName: 'typescript' },
    { name: 'Tailwind CSS & Component UI', category: 'hard_skill', normalizedName: 'tailwind' },

    // Product Management Skills
    { name: 'Product Discovery & Strategy', category: 'hard_skill', normalizedName: 'product-discovery' },
    { name: 'Stakeholder Management', category: 'leadership', normalizedName: 'stakeholder-management' },
    { name: 'Quantitative & Market Analytics', category: 'hard_skill', normalizedName: 'market-analytics' }
  ]

  const skillMap: Record<string, string> = {}

  for (const s of skillsToEnsure) {
    const upserted = await prisma.skill.upsert({
      where: { name: s.name },
      update: { category: s.category, normalizedName: s.normalizedName },
      create: s
    })
    skillMap[s.name] = upserted.id
  }
  console.log(`✅ ${skillsToEnsure.length} Skills ensured in Supabase.`)

  // 2. Seed Career Roles
  const roles = [
    {
      name: 'Associate Product Designer',
      slug: 'associate-product-designer',
      industry: 'Tech & Digital Products',
      description: 'Merancang pengalaman pengguna (UX), user research, dan antarmuka visual (UI) untuk aplikasi web & mobile digital produk.',
      skills: [
        { name: 'Figma & Auto-layout', importance: RoleSkillImportance.required, minLevel: SkillLevel.advanced },
        { name: 'User Research & Testing', importance: RoleSkillImportance.required, minLevel: SkillLevel.advanced },
        { name: 'Wireframing & Prototyping', importance: RoleSkillImportance.required, minLevel: SkillLevel.advanced },
        { name: 'Cross-functional Comm.', importance: RoleSkillImportance.required, minLevel: SkillLevel.intermediate },
        { name: 'Design System & Tokens', importance: RoleSkillImportance.important, minLevel: SkillLevel.intermediate },
        { name: 'Agile / Scrum Methodology', importance: RoleSkillImportance.important, minLevel: SkillLevel.intermediate },
        { name: 'Product Analytics (Mixpanel / GA4)', importance: RoleSkillImportance.important, minLevel: SkillLevel.intermediate }
      ]
    },
    {
      name: 'AI & Machine Learning Engineer',
      slug: 'ai-engineer',
      industry: 'Artificial Intelligence & Big Data',
      description: 'Membangun, melatih, dan mendeploy model kecerdasan buatan (Machine Learning / Deep Learning / LLM) ke arsitektur produksi yang handal dan skalabel.',
      skills: [
        { name: 'Python', importance: RoleSkillImportance.required, minLevel: SkillLevel.advanced },
        { name: 'Machine Learning', importance: RoleSkillImportance.required, minLevel: SkillLevel.advanced },
        { name: 'Data Processing & SQL', importance: RoleSkillImportance.required, minLevel: SkillLevel.intermediate },
        { name: 'Model Deployment (FastAPI / Docker)', importance: RoleSkillImportance.required, minLevel: SkillLevel.intermediate },
        { name: 'MLOps & CI/CD Pipeline', importance: RoleSkillImportance.important, minLevel: SkillLevel.intermediate },
        { name: 'Cloud Computing (GCP/AWS)', importance: RoleSkillImportance.important, minLevel: SkillLevel.intermediate },
        { name: 'Problem Solving & Logic', importance: RoleSkillImportance.required, minLevel: SkillLevel.advanced }
      ]
    },
    {
      name: 'Frontend Web Engineer',
      slug: 'frontend-engineer',
      industry: 'Software Engineering & SaaS',
      description: 'Mengembangkan antarmuka web modern, interaktif, responsif, dan performan tinggi dengan ekosistem React, Next.js, dan TypeScript.',
      skills: [
        { name: 'React.js', importance: RoleSkillImportance.required, minLevel: SkillLevel.advanced },
        { name: 'Next.js & SSR', importance: RoleSkillImportance.required, minLevel: SkillLevel.advanced },
        { name: 'TypeScript', importance: RoleSkillImportance.required, minLevel: SkillLevel.advanced },
        { name: 'Tailwind CSS & Component UI', importance: RoleSkillImportance.required, minLevel: SkillLevel.intermediate },
        { name: 'Wireframing & Prototyping', importance: RoleSkillImportance.important, minLevel: SkillLevel.intermediate },
        { name: 'Agile / Scrum Methodology', importance: RoleSkillImportance.important, minLevel: SkillLevel.intermediate }
      ]
    },
    {
      name: 'Associate Product Manager',
      slug: 'product-manager',
      industry: 'Tech Management & Digital Growth',
      description: 'Memimpin visi produk digital, roadmap prioritisasi sprint, dan penyelarasan lintas tim bisnis, teknik, dan desain.',
      skills: [
        { name: 'Product Discovery & Strategy', importance: RoleSkillImportance.required, minLevel: SkillLevel.advanced },
        { name: 'Stakeholder Management', importance: RoleSkillImportance.required, minLevel: SkillLevel.advanced },
        { name: 'Quantitative & Market Analytics', importance: RoleSkillImportance.required, minLevel: SkillLevel.intermediate },
        { name: 'Product Analytics (Mixpanel / GA4)', importance: RoleSkillImportance.required, minLevel: SkillLevel.intermediate },
        { name: 'Agile / Scrum Methodology', importance: RoleSkillImportance.required, minLevel: SkillLevel.intermediate },
        { name: 'User Research & Testing', importance: RoleSkillImportance.important, minLevel: SkillLevel.intermediate }
      ]
    }
  ]

  for (const r of roles) {
    const role = await prisma.careerRole.upsert({
      where: { slug: r.slug },
      update: {
        name: r.name,
        industry: r.industry,
        description: r.description
      },
      create: {
        name: r.name,
        slug: r.slug,
        industry: r.industry,
        description: r.description
      }
    })

    for (const rs of r.skills) {
      const sId = skillMap[rs.name]
      if (sId) {
        await prisma.careerRoleSkill.upsert({
          where: {
            careerRoleId_skillId: {
              careerRoleId: role.id,
              skillId: sId
            }
          },
          update: {
            importance: rs.importance,
            minLevel: rs.minLevel
          },
          create: {
            careerRoleId: role.id,
            skillId: sId,
            importance: rs.importance,
            minLevel: rs.minLevel
          }
        })
      }
    }
  }
  console.log(`✅ ${roles.length} Career Roles seeded in Supabase.`)

  // 3. Seed Learning Resources in Supabase
  const resources = [
    {
      title: 'Figma Tokens & Design System Architecture',
      platform: 'Growvia Academy x Design Systems Indonesia',
      url: 'https://growvia.app/learning/design-tokens-mastery',
      type: LearningResourceType.video,
      difficulty: Difficulty.intermediate,
      durationMinutes: 240,
      rating: 4.9,
      skillName: 'Design System & Tokens'
    },
    {
      title: 'Product Analytics Fundamental: Mixpanel & Google Analytics 4',
      platform: 'Growvia Lab x Product School ID',
      url: 'https://growvia.app/learning/product-analytics-hands-on',
      type: LearningResourceType.course,
      difficulty: Difficulty.intermediate,
      durationMinutes: 300,
      rating: 4.8,
      skillName: 'Product Analytics (Mixpanel / GA4)'
    },
    {
      title: 'FastAPI & Docker: Model Deployment untuk AI Engineer',
      platform: 'Growvia Academy x Dicoding',
      url: 'https://growvia.app/learning/fastapi-docker-deployment',
      type: LearningResourceType.video,
      difficulty: Difficulty.beginner,
      durationMinutes: 240,
      rating: 4.9,
      skillName: 'Model Deployment (FastAPI / Docker)'
    },
    {
      title: 'MLOps Fundamentals: Continuous Training & GitHub Actions',
      platform: 'Growvia Lab x Google Developer Group',
      url: 'https://growvia.app/learning/mlops-continuous-delivery',
      type: LearningResourceType.bootcamp,
      difficulty: Difficulty.intermediate,
      durationMinutes: 300,
      rating: 4.8,
      skillName: 'MLOps & CI/CD Pipeline'
    },
    {
      title: 'Advanced User Research Synthesis & Usability Metrics',
      platform: 'UX Indonesia Association',
      url: 'https://growvia.app/learning/advanced-user-research-synthesis',
      type: LearningResourceType.bootcamp,
      difficulty: Difficulty.advanced,
      durationMinutes: 210,
      rating: 4.9,
      skillName: 'User Research & Testing'
    },
    {
      title: 'Modern React 19 & Next.js App Router Mastery',
      platform: 'Growvia Tech Lab',
      url: 'https://growvia.app/learning/nextjs-app-router-deep-dive',
      type: LearningResourceType.course,
      difficulty: Difficulty.advanced,
      durationMinutes: 360,
      rating: 4.9,
      skillName: 'Next.js & SSR'
    }
  ]

  for (const res of resources) {
    const existing = await prisma.learningResource.findFirst({
      where: { title: res.title }
    })

    const lr = existing || await prisma.learningResource.create({
      data: {
        title: res.title,
        platform: res.platform,
        url: res.url,
        type: res.type,
        difficulty: res.difficulty,
        durationMinutes: res.durationMinutes,
        rating: res.rating,
        source: ContentSource.admin
      }
    })

    const sId = skillMap[res.skillName]
    if (sId) {
      await prisma.resourceSkillTag.upsert({
        where: {
          learningResourceId_skillId: {
            learningResourceId: lr.id,
            skillId: sId
          }
        },
        update: {},
        create: {
          learningResourceId: lr.id,
          skillId: sId
        }
      })
    }
  }
  console.log(`✅ ${resources.length} Learning Resources seeded in Supabase.`)
  console.log('🎉 Career data seeding completed!')
}

seedCareerData()
  .catch(e => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
