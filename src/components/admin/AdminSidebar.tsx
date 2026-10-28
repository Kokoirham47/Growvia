'use client'

import React from 'react'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import {
  LayoutDashboard,
  Layers,
  Briefcase,
  GraduationCap,
  Sparkles,
  LogOut,
  ShieldCheck,
  ExternalLink,
  X
} from 'lucide-react'

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
  adminName?: string
  adminEmail?: string
}

const navItems = [
  {
    name: 'Overview',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    badge: 'Live'
  },
  {
    name: 'Skill Taxonomy',
    href: '/admin/skills',
    icon: Layers,
    description: 'Master data keahlian'
  },
  {
    name: 'Career Paths',
    href: '/admin/career-roles',
    icon: Briefcase,
    description: 'Peran karier & required skills'
  },
  {
    name: 'Learning Resources',
    href: '/admin/learning-resources',
    icon: GraduationCap,
    description: 'Katalog kursus & materi'
  },
  {
    name: 'Career Opportunities',
    href: '/admin/opportunities',
    icon: Sparkles,
    description: 'Lowongan & magang'
  }
]

export default function AdminSidebar({
  isOpen,
  onClose,
  adminName = 'Super Admin',
  adminEmail = 'admin@growvia.id'
}: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' })
      router.push('/admin/login')
      router.refresh()
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className='fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity'
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0F1424] text-slate-200 border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className='p-5 border-b border-slate-800/80 flex items-center justify-between'>
          <Link href='/admin/dashboard' className='flex items-center gap-3 group'>
            <img
              src='/images/growvia-logo.png'
              alt='Growvia Logo'
              className='w-8 h-8 object-contain shrink-0 group-hover:scale-105 transition-transform'
            />
            <div>
              <div className='flex items-center gap-2'>
                <span className='font-bold text-lg tracking-tight text-white'>Growvia</span>
                <span className='text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30'>
                  Admin
                </span>
              </div>
            </div>
          </Link>

          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className='lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Navigation Menu */}
        <div className='flex-1 overflow-y-auto px-3.5 py-5 space-y-1.5'>
          <div className='px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase'>
            Master Management
          </div>

          {navItems.map(item => {
            const Icon = item.icon

            const isActive =
              pathname === item.href ||
              (item.href !== '/admin/dashboard' && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#2563EB] text-white shadow-md shadow-blue-600/30 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className='flex items-center gap-3'>
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                    }`}
                  />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span className='text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/25'>
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}

          <div className='pt-6 px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase'>
            Quick Links
          </div>

          <Link
            href='/'
            target='_blank'
            className='flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/40 transition-colors'
          >
            <span>Preview Landing Page</span>
            <ExternalLink className='w-3.5 h-3.5' />
          </Link>
          <Link
            href='/home'
            target='_blank'
            className='flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/40 transition-colors'
          >
            <span>User Dashboard</span>
            <ExternalLink className='w-3.5 h-3.5' />
          </Link>
        </div>

        {/* Admin Footer & Profile */}
        <div className='p-3.5 border-t border-slate-800/80 bg-slate-900/60'>
          <div className='flex items-center justify-between gap-3 p-2 rounded-xl bg-slate-800/40 border border-slate-700/50'>
            <div className='flex items-center gap-2.5 min-w-0'>
              <div className='w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 font-bold text-xs shadow'>
                <ShieldCheck className='w-4 h-4' />
              </div>
              <div className='min-w-0'>
                <p className='text-xs font-semibold text-white truncate'>{adminName}</p>
                <p className='text-[11px] text-slate-400 truncate'>{adminEmail}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title='Logout Admin'
              className='p-1.5 rounded-lg bg-transparent text-slate-400 hover:text-rose-400 hover:bg-rose-500/15 transition-colors cursor-pointer shrink-0'
            >
              <LogOut className='w-4 h-4' />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
