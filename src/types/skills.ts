export type SkillCategoryType = 'soft_skill' | 'hard_skill' | 'technical' | 'leadership'
export type SkillLevelType = 'beginner' | 'intermediate' | 'advanced' | 'expert'
export type SkillSourceType = 'ai_extracted' | 'manual'

export interface SkillItem {
  id: string
  name: string
  category: SkillCategoryType
  subCategory?: string
  level: SkillLevelType
  score: number // 0 - 100
  evidenceCount: number
  evidenceTags: string[]
  source: SkillSourceType
  aiConfidence?: number
  isAiVerified?: boolean
  description?: string
  createdAt?: string
}

export interface SkillCategorySummary {
  category: SkillCategoryType
  label: string
  count: number
  percentage: number
  color: string
  bgLight: string
  iconName: string
}

export interface SkillMapNode {
  id: string
  name: string
  category: SkillCategoryType
  colorType: 'blue' | 'indigo' | 'green' | 'orange' // blue: hard skill, indigo: AI detected, green: strong, orange: develop
  level: SkillLevelType
  score: number
  evidenceCount: number
  evidenceTags: string[]
  x: number
  y: number
  vx?: number
  vy?: number
}

export interface SkillMapEdge {
  source: string
  target: string
  strength?: number
  relation?: string
}

export interface EvidenceDetail {
  id: string
  skillId: string
  skillName: string
  experienceTitle: string
  experienceRole: string
  institutionName: string
  period: string
  type: string
  impactNote: string
  proofUrl?: string
  aiExtracted: boolean
}
