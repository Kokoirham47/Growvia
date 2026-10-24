import { PrismaClient, OpportunityType, ContentSource, OpportunitySkillImportance } from '@prisma/client'

const prisma = new PrismaClient()

interface OpportunitySeed {
  title: string
  company: string
  location: string
  sourceUrl: string
  type: OpportunityType
  description: string
  postedAt: Date
  deadline: Date
  skillNames: { name: string; importance: OpportunitySkillImportance }[]
}

const OPPORTUNITIES_DATA: OpportunitySeed[] = [
  {
    title: 'Junior Product Designer (UI/UX)',
    company: 'Tokopedia & GoTo Group',
    location: 'Jakarta Selatan (Hybrid)',
    sourceUrl: 'https://careers.tokopedia.com',
    type: OpportunityType.full_time,
    description: 'Bertanggung jawab dalam merancang antarmuka produk digital, eksplorasi design system, dan kolaborasi dengan product manager serta tim engineering.',
    postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    skillNames: [
      { name: 'Figma & Auto-layout', importance: OpportunitySkillImportance.required },
      { name: 'Wireframing & Prototyping', importance: OpportunitySkillImportance.required },
      { name: 'Design System & Tokens', importance: OpportunitySkillImportance.required },
      { name: 'User Research & Testing', importance: OpportunitySkillImportance.preferred }
    ]
  },
  {
    title: 'AI & Machine Learning Engineer Intern',
    company: 'Traveloka R&D Lab',
    location: 'Tangerang (Onsite)',
    sourceUrl: 'https://www.traveloka.com/en-id/careers',
    type: OpportunityType.internship,
    description: 'Mengembangkan model inferensi ML, pipeline feature engineering, serta integrasi endpoint REST API dengan latency rendah.',
    postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    skillNames: [
      { name: 'Python', importance: OpportunitySkillImportance.required },
      { name: 'Machine Learning', importance: OpportunitySkillImportance.required },
      { name: 'Data Processing & SQL', importance: OpportunitySkillImportance.required },
      { name: 'Model Deployment (FastAPI / Docker)', importance: OpportunitySkillImportance.preferred }
    ]
  },
  {
    title: 'Associate Product Manager',
    company: 'Blibli eCommerce',
    location: 'Jakarta Pusat (Hybrid)',
    sourceUrl: 'https://careers.blibli.com',
    type: OpportunityType.full_time,
    description: 'Memimpin product discovery, membuat PRD komprehensif, menganalisis funnel conversion via Mixpanel, dan sprint planning bersama engineering team.',
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    skillNames: [
      { name: 'Product Discovery & Strategy', importance: OpportunitySkillImportance.required },
      { name: 'Product Analytics (Mixpanel / GA4)', importance: OpportunitySkillImportance.required },
      { name: 'Agile / Scrum Methodology', importance: OpportunitySkillImportance.required },
      { name: 'Stakeholder Management', importance: OpportunitySkillImportance.preferred }
    ]
  },
  {
    title: 'Frontend Web Engineer (React/Next.js)',
    company: 'Stockbit & Bibit.id',
    location: 'Jakarta Selatan (Remote Friendly)',
    sourceUrl: 'https://careers.stockbit.com',
    type: OpportunityType.full_time,
    description: 'Membangun antarmuka web performa tinggi dengan Next.js App Router, TypeScript, dan Tailwind CSS untuk jutaan investor ritel Indonesia.',
    postedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    skillNames: [
      { name: 'React.js', importance: OpportunitySkillImportance.required },
      { name: 'Next.js & SSR', importance: OpportunitySkillImportance.required },
      { name: 'TypeScript', importance: OpportunitySkillImportance.required },
      { name: 'Tailwind CSS & Component UI', importance: OpportunitySkillImportance.required }
    ]
  }
]

async function seedOpportunities() {
  console.log('💼 Seeding Career Opportunities in Supabase...')

  const existingSkills = await prisma.skill.findMany()
  const skillMap: Record<string, string> = {}
  for (const s of existingSkills) {
    skillMap[s.name.toLowerCase().trim()] = s.id
  }

  for (const opp of OPPORTUNITIES_DATA) {
    const existing = await prisma.careerOpportunity.findFirst({
      where: { title: opp.title, company: opp.company }
    })

    const record = existing
      ? await prisma.careerOpportunity.update({
          where: { id: existing.id },
          data: {
            location: opp.location,
            sourceUrl: opp.sourceUrl,
            type: opp.type,
            description: opp.description,
            postedAt: opp.postedAt,
            deadline: opp.deadline,
            isActive: true,
            source: ContentSource.admin
          }
        })
      : await prisma.careerOpportunity.create({
          data: {
            title: opp.title,
            company: opp.company,
            location: opp.location,
            sourceUrl: opp.sourceUrl,
            type: opp.type,
            description: opp.description,
            postedAt: opp.postedAt,
            deadline: opp.deadline,
            isActive: true,
            source: ContentSource.admin
          }
        })

    for (const tag of opp.skillNames) {
      const sId = skillMap[tag.name.toLowerCase().trim()]
      if (sId) {
        await prisma.opportunitySkillTag.upsert({
          where: {
            careerOpportunityId_skillId: {
              careerOpportunityId: record.id,
              skillId: sId
            }
          },
          update: { importance: tag.importance },
          create: {
            careerOpportunityId: record.id,
            skillId: sId,
            importance: tag.importance
          }
        })
      } else {
        console.warn(`⚠️ Skill not found: ${tag.name}`)
      }
    }
  }

  const count = await prisma.careerOpportunity.count()
  console.log(`✅ Career Opportunities seeded! Total in Supabase: ${count}`)
}

seedOpportunities()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
