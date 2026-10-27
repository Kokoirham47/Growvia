'use client'

import React from 'react'

import { Sparkles } from 'lucide-react'

interface AIBadgeProps {
  confidence?: number | null
  size?: 'sm' | 'md'
  showIcon?: boolean
  className?: string
}

export default function AIBadge({
  confidence,
  size = 'sm',
  showIcon = true,
  className = ''
}: AIBadgeProps) {
  const isHigh = confidence && confidence >= 75
  const isMedium = confidence && confidence >= 40 && confidence < 75
  const isLow = confidence && confidence < 40

  let colorClasses = 'bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-900/60'

  if (isHigh) {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-900/60'
  } else if (isMedium) {
    colorClasses = 'bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-900/60'
  } else if (isLow) {
    colorClasses = 'bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-900/60'
  }

  const sizeClasses = size === 'sm'
    ? 'text-[10px] px-2 py-0.5 gap-1'
    : 'text-xs px-2.5 py-1 gap-1.5'

  return (
    <span
      className={`inline-flex items-center font-bold rounded-full border shadow-2xs tracking-wide shrink-0 ${colorClasses} ${sizeClasses} ${className}`}
    >
      {showIcon && (
        <Sparkles className={size === 'sm' ? 'w-3 h-3 shrink-0' : 'w-3.5 h-3.5 shrink-0'} />
      )}
      <span>AI Verified{confidence ? ` ${Math.round(confidence)}%` : ''}</span>
    </span>
  )
}
