export type PortfolioTheme = 'royal-blue' | 'sleek-slate' | 'emerald-modern'

export interface PortfolioSectionVisibility {
  work: boolean
  projects: boolean
  organisations: boolean
  competitions: boolean
  skills: boolean
  education: boolean
}

export interface SkillEvidenceItem {
  id: string
  experienceId: string
  experienceTitle: string
  institutionName: string
  note: string | null
}

export interface PortfolioSkillItem {
  id: string
  name: string
  category: 'hard_skill' | 'soft_skill' | 'technical' | 'leadership'
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  score: number
  source: 'ai_extracted' | 'manual'
  aiConfidence?: number | null
  evidences: SkillEvidenceItem[]
}

export interface PortfolioExperienceItem {
  id: string
  title: string
  role: string
  institutionName: string
  type: 'internship' | 'project' | 'organisation' | 'competition' | 'committee' | 'freelance' | 'other'
  startDate: string
  endDate?: string | null
  isOngoing: boolean
  description?: string | null
  proofUrl?: string | null
}

export interface PublicPortfolioData {
  user: {
    id: string
    name: string
    email?: string
    avatarUrl?: string | null
  }
  profile: {
    institution?: string | null
    major?: string | null
    graduationYear?: number | null
    bio?: string | null
    headline?: string | null
    portfolioSlug?: string | null
    portfolioPublished: boolean
  }
  careerTarget?: {
    roleName: string
    readinessScore: number
  } | null
  skills: PortfolioSkillItem[]
  experiences: PortfolioExperienceItem[]
  theme?: PortfolioTheme
  sections?: PortfolioSectionVisibility
}

export interface PortfolioPreviewResponse {
  success: boolean
  message?: string
  data?: PublicPortfolioData
}

export interface PortfolioSettingsPayload {
  portfolioPublished: boolean
  portfolioSlug: string
  headline?: string
  bio?: string
  theme?: PortfolioTheme
  sections?: PortfolioSectionVisibility
}

export interface PortfolioSettingsResponse {
  success: boolean
  message: string
  data?: {
    portfolioSlug: string
    portfolioPublished: boolean
    publicUrl: string
  }
}
