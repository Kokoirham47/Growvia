'use client'

import React from 'react'

import Link from 'next/link'

import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight } from 'lucide-react'

interface AdminStatCardProps {
  title: string
  value: number | string
  subtitle: string
  icon: LucideIcon
  href: string
  gradient: string
  color: string
}

export default function AdminStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  href,
  gradient,
  color
}: AdminStatCardProps) {
  return (
    <div className='relative overflow-hidden rounded-2xl bg-white dark:bg-[#0F1424] border border-slate-200/80 dark:border-slate-800/80 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 group'>
      {/* Background Accent Glow */}
      <div
        className={`absolute -top-12 -right-12 w-32 h-32 rounded-full ${gradient} opacity-10 dark:opacity-20 blur-2xl group-hover:scale-125 transition-transform duration-500`}
      />

      <div className='flex items-start justify-between mb-4'>
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} bg-opacity-10 dark:bg-opacity-20 border border-current/20 shadow-xs group-hover:scale-105 transition-transform`}
        >
          <Icon className='w-6 h-6' />
        </div>

        <Link
          href={href}
          className='p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors'
          title='Kelola Data'
        >
          <ArrowUpRight className='w-4 h-4' />
        </Link>
      </div>

      <div className='space-y-1'>
        <p className='text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
          {title}
        </p>
        <h3 className='text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight'>
          {value}
        </h3>
        <p className='text-xs text-slate-500 dark:text-slate-400'>
          {subtitle}
        </p>
      </div>
    </div>
  )
}
