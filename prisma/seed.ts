import { PrismaClient, SkillCategory } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database with initial Growvia master data...')

  // 1. Seed Career Fields
  const careerFields = [
    { name: 'UI/UX & Product Design', slug: 'ui-ux-design', icon: 'palette' },
    { name: 'Software Engineering', slug: 'software-engineering', icon: 'code' },
    { name: 'Product Management', slug: 'product-management', icon: 'briefcase' },
    { name: 'Data Science & AI', slug: 'data-science-ai', icon: 'chart-bar' },
    { name: 'Digital Marketing & Growth', slug: 'digital-marketing', icon: 'trending-up' },
    { name: 'Finance & Business', slug: 'finance-business', icon: 'dollar-sign' },
    { name: 'Human Resources & People', slug: 'human-resources', icon: 'users' },
    { name: 'Content & Creative Writing', slug: 'content-creative', icon: 'feather' },
    { name: 'Operations & Strategy', slug: 'operations-strategy', icon: 'settings' }
  ]

  for (const field of careerFields) {
    await prisma.careerField.upsert({
      where: { slug: field.slug },
      update: {},
      create: field
    })
  }
  console.log('✅ Career fields seeded.')

  // 2. Seed Master Skills
  const initialSkills: { name: string; category: SkillCategory; normalizedName: string }[] = [
    // Hard Skills
    { name: 'Wireframing', category: 'hard_skill', normalizedName: 'wireframing' },
    { name: 'Figma Systems', category: 'hard_skill', normalizedName: 'figma-systems' },
    { name: 'Usability Testing', category: 'hard_skill', normalizedName: 'usability-testing' },
    { name: 'Design System Tokens', category: 'hard_skill', normalizedName: 'design-system-tokens' },
    { name: 'Quantitative Analytics', category: 'hard_skill', normalizedName: 'quantitative-analytics' },
    { name: 'Product Discovery', category: 'hard_skill', normalizedName: 'product-discovery' },
    { name: 'User Interview', category: 'hard_skill', normalizedName: 'user-interview' },
    { name: 'React.js', category: 'technical', normalizedName: 'react' },
    { name: 'Next.js', category: 'technical', normalizedName: 'nextjs' },
    { name: 'TypeScript', category: 'technical', normalizedName: 'typescript' },
    { name: 'PostgreSQL', category: 'technical', normalizedName: 'postgresql' },
    { name: 'Prisma ORM', category: 'technical', normalizedName: 'prisma' },

    // Soft Skills / Leadership
    { name: 'Team Leadership', category: 'leadership', normalizedName: 'team-leadership' },
    { name: 'Stakeholder Management', category: 'leadership', normalizedName: 'stakeholder-management' },
    { name: 'Content Strategy', category: 'soft_skill', normalizedName: 'content-strategy' },
    { name: 'Problem Solving', category: 'soft_skill', normalizedName: 'problem-solving' },
    { name: 'Communication', category: 'soft_skill', normalizedName: 'communication' }
  ]

  for (const skill of initialSkills) {
    await prisma.skill.upsert({
      where: { name: skill.name },
      update: {},
      create: skill
    })
  }
  console.log('✅ Initial skills seeded.')

  // 3. Seed Career Role Target
  const designerRole = await prisma.careerRole.upsert({
    where: { slug: 'associate-product-designer' },
    update: {},
    create: {
      name: 'Associate Product Designer',
      slug: 'associate-product-designer',
      industry: 'FinTech & SaaS EdTech',
      description: 'Mendesain antarmuka dan alur pengguna yang intuitif berbasis data dan user research.'
    }
  })

  // Map required skills to Associate Product Designer
  const requiredSkillNames = [
    'Wireframing',
    'Figma Systems',
    'Usability Testing',
    'Design System Tokens',
    'Quantitative Analytics'
  ]

  for (const sName of requiredSkillNames) {
    const s = await prisma.skill.findUnique({ where: { name: sName } })
    if (s) {
      await prisma.careerRoleSkill.upsert({
        where: {
          careerRoleId_skillId: {
            careerRoleId: designerRole.id,
            skillId: s.id
          }
        },
        update: {},
        create: {
          careerRoleId: designerRole.id,
          skillId: s.id,
          importance: 'required',
          minLevel: 'intermediate'
        }
      })
    }
  }
  console.log('✅ Associate Product Designer role and skills seeded.')

  console.log('🎉 Seeding completed successfully!')
}

main()
  .catch(e => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
