'use client'

import React, { useRef, useState } from 'react'

import { useRouter } from 'next/navigation'
import Image from 'next/image'

import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import {
  User,
  Settings,
  Globe,
  LogOut,
  ChevronRight,
  Camera,
  RefreshCw,
  HelpCircle
} from 'lucide-react'

import { useAuth } from '@/contexts/AuthContext'

export default function UserDropdown() {
  const [open, setOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const anchorRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const { user, profile, logout, refreshUser } = useAuth()

  const quickAvatarInputRef = useRef<HTMLInputElement>(null)
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)

  const handleQuickUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) return

    try {
      setIsUploadingPhoto(true)

      const formData = new FormData()

      formData.append('file', file)

      const res = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData
      })

      if (res.ok) {
        await refreshUser()
      }
    } catch (err) {
      console.error('Error uploading avatar:', err)
    } finally {
      setIsUploadingPhoto(false)

      if (quickAvatarInputRef.current) {
        quickAvatarInputRef.current.value = ''
      }
    }
  }

  const handleToggle = () => {
    setOpen(prev => !prev)
  }

  const handleClose = (event?: MouseEvent | TouchEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event?.target as HTMLElement)) {
      return
    }

    setOpen(false)
  }

  const handleNavigate = (url: string) => {
    setOpen(false)
    router.push(url)
  }

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await logout()
      setOpen(false)
    } catch (err) {
      console.error('Logout error:', err)
      router.push('/login')
    } finally {
      setIsLoggingOut(false)
    }
  }



  // Fallback user display data
  const userName = user?.name || 'Mahasiswa Growvia'
  const userEmail = user?.email || 'user@growvia.id'
  const userHeadline = profile?.headline || profile?.institution || 'Mahasiswa & Talenta Muda'
  const avatarUrl = user?.avatarUrl

  const initials = userName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase() || 'G'

  const portfolioLink = profile?.portfolioSlug
    ? `/u/${profile.portfolioSlug}`
    : '/portfolio'

  return (
    <div className='relative'>
      {/* Trigger Button in Navbar */}
      <div
        ref={anchorRef}
        onClick={handleToggle}
        className='flex items-center gap-2.5 p-1 rounded-2xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all group'
        role='button'
        tabIndex={0}
        aria-haspopup='true'
        aria-expanded={open}
      >
        {/* Avatar with Status Ring */}
        <div className='relative shrink-0'>
          {avatarUrl ? (
            <div className='w-9 h-9 sm:w-10 sm:h-10 rounded-2xl overflow-hidden ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-blue-500/70 transition-all shadow-xs relative'>
              <Image
                src={avatarUrl}
                alt={userName}
                fill
                unoptimized
                className='object-cover'
              />
            </div>
          ) : (
            <div className='w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-blue-500/70 transition-all shadow-xs'>
              {initials}
            </div>
          )}

          {/* Active Status Dot */}
          <span className='absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 shadow-2xs' />
        </div>

        {/* Text Details (Desktop View) */}
        <div className='hidden sm:flex flex-col text-left max-w-[150px]'>
          <span className='font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 leading-tight truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
            {userName}
          </span>
          <span className='text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 leading-none mt-0.5 truncate'>
            {userHeadline}
          </span>
        </div>
      </div>

      {/* Dropdown Overlay Menu */}
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement='bottom-end'
        transition
        disablePortal={false}
        className='z-[9999]'
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 10]
            }
          }
        ]}
      >
        {({ TransitionProps, placement }) => (
          <Fade
            {...TransitionProps}
            timeout={200}
            style={{
              transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top'
            }}
          >
            <Paper className='!bg-transparent !shadow-none'>
              <ClickAwayListener onClickAway={handleClose}>
                <div className='w-[290px] sm:w-[320px] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl p-2.5 flex flex-col gap-1.5 backdrop-blur-xl animate-in zoom-in-95 duration-150'>
                  {/* Top Card: User Profile Header */}
                  <div className='p-3.5 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 dark:from-slate-850 dark:to-slate-800/60 border border-slate-100 dark:border-slate-750 flex items-center gap-3'>
                    <input
                      ref={quickAvatarInputRef}
                      type='file'
                      accept='image/jpeg,image/png,image/webp,image/jpg'
                      className='hidden'
                      onChange={handleQuickUpload}
                    />

                    <div
                      onClick={() => quickAvatarInputRef.current?.click()}
                      className='relative shrink-0 group/avatar cursor-pointer'
                      title='Klik untuk mengganti foto profil dari perangkat'
                    >
                      {avatarUrl ? (
                        <div className='w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-white dark:ring-slate-700 shadow-md relative bg-slate-100 dark:bg-slate-800'>
                          <Image
                            src={avatarUrl}
                            alt={userName}
                            fill
                            unoptimized
                            className='object-cover group-hover/avatar:scale-105 transition-transform'
                          />
                          <div className='absolute inset-0 bg-slate-900/50 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center text-white transition-opacity'>
                            <Camera className='w-4 h-4' />
                          </div>
                        </div>
                      ) : (
                        <div className='w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 text-white font-extrabold text-base flex items-center justify-center ring-2 ring-white dark:ring-slate-700 shadow-md relative overflow-hidden'>
                          {initials}
                          <div className='absolute inset-0 bg-slate-900/50 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center text-white transition-opacity'>
                            <Camera className='w-4 h-4' />
                          </div>
                        </div>
                      )}

                      {isUploadingPhoto ? (
                        <span className='absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs'>
                          <RefreshCw className='w-3 h-3 animate-spin' />
                        </span>
                      ) : (
                        <span
                          className='absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-600 group-hover/avatar:bg-blue-700 text-white flex items-center justify-center shadow-xs border border-white dark:border-slate-900 transition-colors'
                          title='Ganti foto'
                        >
                          <Camera className='w-2.5 h-2.5' />
                        </span>
                      )}
                    </div>

                    <div className='flex flex-col min-w-0 flex-1'>
                      <div className='flex items-center gap-1.5'>
                        <h4 className='font-bold text-sm text-slate-900 dark:text-white truncate leading-tight'>
                          {userName}
                        </h4>
                      </div>
                      <span className='text-xs text-slate-500 dark:text-white truncate mt-0.5'>
                        {userEmail}
                      </span>
                      <div className='mt-1 inline-flex items-center gap-1 self-start px-2 py-0.5 rounded-full bg-blue-100/70 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 text-[10px] font-semibold border border-blue-200/60 dark:border-blue-800/60'>
                        <span className='truncate'>{profile?.portfolioPublished ? 'Portofolio Live' : 'Aktif'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className='h-px bg-slate-100 dark:bg-slate-800 my-0.5' />

                  {/* Menu Item 1: Edit Profile */}
                  <button
                    type='button'
                    onClick={() => handleNavigate('/profile')}
                    className='w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/70 text-left transition-colors cursor-pointer group'
                  >
                    <div className='flex items-center gap-3'>
                      <div className='w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/50 group-hover:scale-105 transition-transform'>
                        <User className='w-4 h-4' />
                      </div>
                      <div className='flex flex-col'>
                        <span className='text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
                          Edit Profil
                        </span>
                        <span className='text-[10px] text-slate-400 dark:text-slate-500'>
                          Nama, headline, kampus, dan avatar
                        </span>
                      </div>
                    </div>
                    <ChevronRight className='w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all' />
                  </button>

                  {/* Menu Item 2: Account Settings */}
                  <button
                    type='button'
                    onClick={() => handleNavigate('/settings')}
                    className='w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/70 text-left transition-colors cursor-pointer group'
                  >
                    <div className='flex items-center gap-3'>
                      <div className='w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-900/50 group-hover:scale-105 transition-transform'>
                        <Settings className='w-4 h-4' />
                      </div>
                      <div className='flex flex-col'>
                        <span className='text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors'>
                          Pengaturan Akun
                        </span>
                        <span className='text-[10px] text-slate-400 dark:text-slate-500'>
                          Password, privasi & zona bahaya
                        </span>
                      </div>
                    </div>
                    <ChevronRight className='w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all' />
                  </button>

                  {/* Menu Item 3: Public Portfolio */}
                  <button
                    type='button'
                    onClick={() => handleNavigate(portfolioLink)}
                    className='w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/70 text-left transition-colors cursor-pointer group'
                  >
                    <div className='flex items-center gap-3'>
                      <div className='w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-900/50 group-hover:scale-105 transition-transform'>
                        <Globe className='w-4 h-4' />
                      </div>
                      <div className='flex flex-col'>
                        <span className='text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors'>
                          Portofolio Publik
                        </span>
                        <span className='text-[10px] text-slate-400 dark:text-slate-500 truncate max-w-[170px]'>
                          {profile?.portfolioSlug ? `/u/${profile.portfolioSlug}` : 'Buka editor portofolio'}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className='w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all' />
                  </button>

                  {/* Menu Item 4: About & App Guide */}
                  <button
                    type='button'
                    onClick={() => handleNavigate('/about')}
                    className='w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/70 text-left transition-colors cursor-pointer group'
                  >
                    <div className='flex items-center gap-3'>
                      <div className='w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 border border-sky-100 dark:border-sky-900/50 group-hover:scale-105 transition-transform'>
                        <HelpCircle className='w-4 h-4' />
                      </div>
                      <div className='flex flex-col'>
                        <span className='text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors'>
                          Tentang & Panduan
                        </span>
                        <span className='text-[10px] text-slate-400 dark:text-slate-500'>
                          Mengenal Growvia & panduan penggunaan
                        </span>
                      </div>
                    </div>
                    <ChevronRight className='w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-sky-500 group-hover:translate-x-0.5 transition-all' />
                  </button>

                  {/* Divider */}
                  <div className='h-px bg-slate-100 dark:bg-slate-800 my-1' />

                  {/* Logout Button */}
                  <button
                    type='button'
                    disabled={isLoggingOut}
                    onClick={handleLogout}
                    className='w-full flex items-center justify-center gap-2 p-2.5 rounded-2xl bg-rose-50/80 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 font-bold text-xs transition-colors cursor-pointer border border-rose-200/50 dark:border-rose-900/40 disabled:opacity-50'
                  >
                    <LogOut className='w-4 h-4' />
                    <span>{isLoggingOut ? 'Sedang Keluar...' : 'Keluar dari Akun'}</span>
                  </button>
                </div>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </div>
  )
}
