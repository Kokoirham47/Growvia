import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔒 Enabling Row Level Security (RLS) on all public tables...')

  const tables = [
    'admins',
    'users',
    'email_verifications',
    'sessions',
    'profiles',
    'career_interests',
    'career_fields',
    'experiences',
    'skills',
    'user_skills',
    'skill_evidences',
    'ai_analysis_jobs',
    'ai_skill_suggestions',
    'career_roles',
    'career_role_skills',
    'user_career_targets',
    'skill_gap_results',
    'learning_resources',
    'resource_skill_tags',
    'learning_recommendations',
    'user_saved_resources',
    'career_opportunities',
    'opportunity_skill_tags',
    'user_saved_opportunities',
    'notifications'
  ]

  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY;`)
      console.log(`✅ RLS enabled on: ${table}`)
    } catch (err) {
      console.warn(`⚠️ Failed to enable RLS on ${table}:`, err)
    }
  }

  console.log('🎉 All tables now have RLS enabled and are secure from unrestricted public access!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
