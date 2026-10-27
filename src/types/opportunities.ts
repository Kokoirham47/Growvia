export type OpportunityType =
  | 'internship'
  | 'part_time'
  | 'full_time'
  | 'freelance'
  | 'competition'

export type OpportunitySkillImportance = 'required' | 'preferred'

export interface OpportunitySkillItem {
  id: string
  name: string
  category: string
  importance: OpportunitySkillImportance
}

export interface OpportunityItem {
  id: string
  title: string
  company: string
  location: string | null
  type: OpportunityType
  sourceUrl: string | null
  description: string | null
  deadline: string | null
  postedAt: string | null
  isActive: boolean
  matchScore: number
  isSaved: boolean
  isCareerTargetMatch?: boolean
  matchedSkills: OpportunitySkillItem[]
  missingSkills: OpportunitySkillItem[]
  allSkills: OpportunitySkillItem[]
}

export interface OpportunitiesResponse {
  success: boolean
  message?: string
  data: OpportunityItem[]
  meta: {
    total: number
    userSkillsCount: number
    averageMatchScore: number
    userTargetRole: string | null
  }
}

export interface OpportunitiesFilterState {
  search: string
  type: OpportunityType | 'all'
  quickFilter: 'all' | 'career_target'
  location: string
  sort: 'match_desc' | 'deadline_asc' | 'newest'
}
