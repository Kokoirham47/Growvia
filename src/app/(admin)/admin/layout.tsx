'use client'

import React, { useState, useEffect } from 'react'

import { usePathname } from 'next/navigation'

import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopbar from '@/components/admin/AdminTopbar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [adminData, setAdminData] = useState<{ name: string; email: string } | null>(null)

  useEffect(() => {
    if (!isLoginPage) {
      fetch('/api/admin/auth/me')
        .then(res => res.json())
        .then(res => {
          if (res.success && res.data) {
            setAdminData({ name: res.data.name, email: res.data.email })
          }
        })
        .catch(() => {})
    }
  }, [isLoginPage])

  // Login page has its own standalone full-screen layout
  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <div className='min-h-screen bg-slate-50 dark:bg-[#070A13] text-slate-900 dark:text-slate-100 transition-colors'>
      {/* Sidebar for Desktop & Mobile Drawer */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        adminName={adminData?.name || 'Super Admin'}
        adminEmail={adminData?.email || 'admin@growvia.id'}
      />

      {/* Main Content Area */}
      <div className='lg:pl-72 flex flex-col min-h-screen'>
        {/* Sticky Topbar */}
        <AdminTopbar
          onToggleSidebar={() => setSidebarOpen(prev => !prev)}
          adminName={adminData?.name || 'Super Admin'}
        />

        {/* Dynamic Page Content */}
        <main className='flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto'>
          {children}
        </main>
      </div>
    </div>
  )
}
