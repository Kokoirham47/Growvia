export type SkillGapStatus = 'strong' | 'develop' | 'missing'

export interface SkillChipItem {
  id: string
  name: string
  status: SkillGapStatus
  score: number // 0-100
  evidenceCount?: number
  evidenceSource?: string
  priority?: 'high' | 'medium' | 'low'
  category?: 'Hard Skill' | 'Soft Skill' | 'Tools & Cloud'
  description?: string
  atsKeywords?: string[]
}

export interface SoftSkillCardItem {
  id: string
  name: string
  badge: string
  badgeType: 'strong' | 'intermediate' | 'develop'
  description: string
  score: number
}

export interface CareerTargetProfile {
  id: string
  title: string
  companyType: string
  level: string
  readinessScore: number
  readinessStatus: 'Ready' | 'Developing' | 'Foundational'
  readinessBadgeColor: string
  verifiedJobsCount: number
  lastUpdated: string
  salaryRange: string
  summary: string
  aiInsight: string
  highlightedKeywords?: string[]
  competentCount?: number
  totalSkillsCount?: number
  developCount?: number
  missingCount?: number
  strongSkills: SkillChipItem[]
  developSkills: SkillChipItem[]
  missingSkills: SkillChipItem[]
  detailedMatrix: {
    category: string
    description: string
    skillsCountLabel?: string
    skills: {
      id: string
      name: string
      status: SkillGapStatus
      score: number
      evidenceNote: string
      actionType: 'qualified' | 'recommend' | 'intro_module'
      actionLabel: string
    }[]
  }[]
  softSkills?: SoftSkillCardItem[]
  growthRoadmap: {
    step: number
    title: string
    estDays: string
    description: string
    footerLabel: string
    gainLabel: string
    type: 'course' | 'portfolio' | 'application'
    actionType?: 'learning_modal' | 'portfolio' | 'opportunities'
    actionUrl?: string
    targetSkill?: string
  }[]
}

export interface LearningResourceItem {
  id: string
  title: string
  type: 'Video Lab' | 'Hands-on Project' | 'Industry Workshop' | 'Interactive Sandbox' | 'Certification Guide'
  provider: string
  duration: string
  targetSkill: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  rating: number
  reviewsCount: number
  isFree: boolean
  description: string
  url: string
}
