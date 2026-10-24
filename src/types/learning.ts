export type LearningCategory = 'semua' | 'course' | 'artikel' | 'video' | 'bootcamp'

export type DifficultyLevel = 'all' | 'Beginner' | 'Intermediate' | 'Advanced'

export type SortOption = 'match' | 'rating' | 'duration'

export interface SyllabusModule {
  moduleNumber: number
  title: string
  duration: string
  topics: string[]
}

export interface LearningCardItem {
  id: string
  title: string
  category: 'course' | 'artikel' | 'video' | 'bootcamp'
  skillTag: string
  platform: string
  duration: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  rating: number
  reviewsCount?: string
  description: string
  matchPercent: number
  url: string
  isFeatured?: boolean
  reasonAI?: string
  instructor?: string
  enrolledCount?: string
  syllabus?: SyllabusModule[]
  portfolioProjectsCount?: number
  hasCertificate?: boolean
}
