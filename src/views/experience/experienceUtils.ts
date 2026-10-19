import React from 'react'
import {
  Users,
  Calendar,
  Briefcase,
  Laptop,
  FolderGit2,
  Trophy,
  Bookmark,
  LucideIcon
} from 'lucide-react'

export interface SkillEvidenceItem {
  id: string
  userSkillId: string
  note?: string | null
  userSkill: {
    skill: {
      id: string
      name: string
      category: string
    }
  }
}

export interface AiAnalysisJobItem {
  id: string
  status: 'queued' | 'processing' | 'completed' | 'failed'
  createdAt: string
  completedAt?: string | null
}

export interface ExperienceItem {
  id: string
  userId: string
  title: string
  type: 'organisation' | 'committee' | 'internship' | 'freelance' | 'project' | 'competition' | 'other'
  role: string
  institutionName: string
  startDate: string
  endDate: string | null
  isOngoing: boolean
  description: string | null
  proofUrl: string | null
  createdAt: string
  updatedAt: string
  skillEvidences?: SkillEvidenceItem[]
  aiAnalysisJobs?: AiAnalysisJobItem[]
}

export interface ExperienceStats {
  total: number
  ongoing: number
  skillsExtracted: number
  typeBreakdown: Record<string, number>
}

export interface TypeConfig {
  label: string
  icon: LucideIcon
  colorClass: string
  bgClass: string
  borderClass: string
  badgeClass: string
}

export const EXPERIENCE_TYPE_CONFIG: Record<string, TypeConfig> = {
  organisation: {
    label: 'Organisasi',
    icon: Users,
    colorClass: 'text-blue-600 dark:text-blue-400',
    bgClass: 'bg-blue-50 dark:bg-blue-950/40',
    borderClass: 'border-blue-200 dark:border-blue-800',
    badgeClass: 'bg-blue-100/70 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
  },
  committee: {
    label: 'Kepanitiaan',
    icon: Calendar,
    colorClass: 'text-purple-600 dark:text-purple-400',
    bgClass: 'bg-purple-50 dark:bg-purple-950/40',
    borderClass: 'border-purple-200 dark:border-purple-800',
    badgeClass: 'bg-purple-100/70 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
  },
  internship: {
    label: 'Magang',
    icon: Laptop,
    colorClass: 'text-emerald-600 dark:text-emerald-400',
    bgClass: 'bg-emerald-50 dark:bg-emerald-950/40',
    borderClass: 'border-emerald-200 dark:border-emerald-800',
    badgeClass: 'bg-emerald-100/70 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
  },
  freelance: {
    label: 'Freelance',
    icon: Briefcase,
    colorClass: 'text-cyan-600 dark:text-cyan-400',
    bgClass: 'bg-cyan-50 dark:bg-cyan-950/40',
    borderClass: 'border-cyan-200 dark:border-cyan-800',
    badgeClass: 'bg-cyan-100/70 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300'
  },
  project: {
    label: 'Proyek',
    icon: FolderGit2,
    colorClass: 'text-amber-600 dark:text-amber-400',
    bgClass: 'bg-amber-50 dark:bg-amber-950/40',
    borderClass: 'border-amber-200 dark:border-amber-800',
    badgeClass: 'bg-amber-100/70 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
  },
  competition: {
    label: 'Kompetisi',
    icon: Trophy,
    colorClass: 'text-rose-600 dark:text-rose-400',
    bgClass: 'bg-rose-50 dark:bg-rose-950/40',
    borderClass: 'border-rose-200 dark:border-rose-800',
    badgeClass: 'bg-rose-100/70 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
  },
  other: {
    label: 'Lainnya',
    icon: Bookmark,
    colorClass: 'text-slate-600 dark:text-slate-400',
    bgClass: 'bg-slate-50 dark:bg-slate-800/50',
    borderClass: 'border-slate-200 dark:border-slate-700',
    badgeClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
  }
}

const INDO_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
]

export function formatMonthYear(dateString: string | null | undefined): string {
  if (!dateString) return ''
  const d = new Date(dateString)
  if (isNaN(d.getTime())) return dateString
  return `${INDO_MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

export function formatExperiencePeriod(
  startDateStr: string,
  endDateStr: string | null,
  isOngoing: boolean
): string {
  const start = formatMonthYear(startDateStr)

  if (isOngoing) {
    return `${start} - Sekarang • Sedang Berlangsung`
  }

  if (!endDateStr) {
    return start
  }

  const end = formatMonthYear(endDateStr)

  // Hitung durasi bulan
  const dStart = new Date(startDateStr)
  const dEnd = new Date(endDateStr)
  if (!isNaN(dStart.getTime()) && !isNaN(dEnd.getTime())) {
    const diffMonths =
      (dEnd.getFullYear() - dStart.getFullYear()) * 12 +
      (dEnd.getMonth() - dStart.getMonth()) + 1

    if (diffMonths > 0) {
      if (diffMonths >= 12) {
        const years = Math.floor(diffMonths / 12)
        const remMonths = diffMonths % 12
        const yearStr = `${years} thn`
        const monthStr = remMonths > 0 ? ` ${remMonths} bln` : ''
        return `${start} - ${end} • ${yearStr}${monthStr}`
      }
      return `${start} - ${end} • ${diffMonths} bln`
    }
  }

  return `${start} - ${end}`
}
