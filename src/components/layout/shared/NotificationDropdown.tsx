'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'

import { useRouter } from 'next/navigation'

import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Tooltip from '@mui/material/Tooltip'
import Badge from '@mui/material/Badge'
import IconButton from '@mui/material/IconButton'
import {
  Bell,
  CheckCheck,
  Briefcase,
  Sparkles,
  GraduationCap,
  Globe,
  BellOff,
  ChevronRight,
  ExternalLink,
  Clock,
  Loader2
} from 'lucide-react'

export interface NotificationItem {
  id: string
  userId: string
  type: 'skill_update' | 'learning_reminder' | 'career_opportunity' | 'portfolio_view' | string
  title: string
  body: string
  actionUrl?: string | null
  isRead: boolean
  readAt?: string | null
  createdAt: string
}

function formatRelativeTime(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    const now = new Date()
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffSec < 60) return 'Baru saja'

    const diffMin = Math.floor(diffSec / 60)

    if (diffMin < 60) return `${diffMin} menit lalu`

    const diffHours = Math.floor(diffMin / 60)

    if (diffHours < 24) return `${diffHours} jam lalu`

    const diffDays = Math.floor(diffHours / 24)

    if (diffDays < 7) return `${diffDays} hari lalu`

    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
  } catch {
    return 'Baru saja'
  }
}

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [unreadCount, setUnreadCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const anchorRef = useRef<HTMLButtonElement>(null)
  const router = useRouter()

  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true)

      const res = await fetch('/api/notifications', {
        headers: { 'Cache-Control': 'no-cache' }
      })

      if (res.ok) {
        const json = await res.json()

        if (json.success && json.data) {
          setNotifications(json.data.notifications || [])
          setUnreadCount(json.data.unreadCount || 0)
        }
      }
    } catch (err) {
      console.error('Error fetching notifications:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const handleToggle = () => {
    setOpen(prev => !prev)
  }

  const handleClose = (event?: MouseEvent | TouchEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event?.target as HTMLElement)) {
      return
    }

    setOpen(false)
  }

  const handleMarkAllAsRead = async () => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllAsRead: true })
      })

      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
        setUnreadCount(0)
      }
    } catch (err) {
      console.error('Error marking all notifications read:', err)
    }
  }

  const handleClickItem = async (item: NotificationItem) => {
    if (!item.isRead) {
      try {
        fetch('/api/notifications', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: item.id })
        })

        setNotifications(prev =>
          prev.map(n => (n.id === item.id ? { ...n, isRead: true } : n))
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      } catch (err) {
        console.error('Error marking single notification read:', err)
      }
    }

    setOpen(false)

    if (item.actionUrl) {
      router.push(item.actionUrl)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'career_opportunity':
        return (
          <div className='w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/60 shadow-2xs'>
            <Briefcase className='w-4 h-4' />
          </div>
        )
      case 'skill_update':
        return (
          <div className='w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-900/60 shadow-2xs'>
            <Sparkles className='w-4 h-4' />
          </div>
        )
      case 'learning_reminder':
        return (
          <div className='w-9 h-9 rounded-2xl bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-100 dark:border-amber-900/60 shadow-2xs'>
            <GraduationCap className='w-4 h-4' />
          </div>
        )
      case 'portfolio_view':
      default:
        return (
          <div className='w-9 h-9 rounded-2xl bg-purple-50 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-100 dark:border-purple-900/60 shadow-2xs'>
            <Globe className='w-4 h-4' />
          </div>
        )
    }
  }

  return (
    <div className='relative'>
      {/* Trigger Bell Button */}
      <Tooltip title={unreadCount > 0 ? `Notifikasi (${unreadCount} belum dibaca)` : 'Notifikasi'}>
        <IconButton
          ref={anchorRef}
          size='small'
          onClick={handleToggle}
          aria-haspopup='true'
          aria-expanded={open}
          className={`w-9 h-9 rounded-xl border transition-all cursor-pointer shadow-xs ${
            open
              ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500/20'
              : 'border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Badge
            variant={unreadCount > 0 ? 'standard' : 'dot'}
            badgeContent={unreadCount > 0 ? (unreadCount > 9 ? '9+' : unreadCount) : undefined}
            color='error'
            invisible={unreadCount === 0}
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                fontSize: '10px',
                fontWeight: 700,
                minWidth: unreadCount > 0 ? '16px' : '8px',
                height: unreadCount > 0 ? '16px' : '8px',
                padding: '0 4px',
                boxShadow: '0 0 0 2px var(--mui-palette-background-paper)'
              }
            }}
          >
            <Bell className='w-4.5 h-4.5' />
          </Badge>
        </IconButton>
      </Tooltip>

      {/* Popper Overlay Card */}
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
                <div className='w-[320px] sm:w-[380px] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl p-2.5 flex flex-col gap-1.5 backdrop-blur-xl animate-in zoom-in-95 duration-150'>
                  {/* Top Header Card */}
                  <div className='p-3 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-850 dark:to-slate-800/50 border border-slate-100 dark:border-slate-750 flex items-center justify-between gap-3'>
                    <div className='flex items-center gap-2'>
                      <div className='w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs'>
                        <Bell className='w-3.5 h-3.5' />
                      </div>
                      <h4 className='font-bold text-sm text-slate-900 dark:text-white leading-tight'>
                        Notifikasi
                      </h4>
                      {unreadCount > 0 ? (
                        <span className='px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60'>
                          {unreadCount} Baru
                        </span>
                      ) : (
                        <span className='px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'>
                          Terbaca
                        </span>
                      )}
                    </div>

                    {unreadCount > 0 && (
                      <button
                        type='button'
                        onClick={handleMarkAllAsRead}
                        className='inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline cursor-pointer transition-colors'
                      >
                        <CheckCheck className='w-3.5 h-3.5' />
                        <span>Tandai dibaca</span>
                      </button>
                    )}
                  </div>

                  {/* Notification List Scrollable Container */}
                  <div className='max-h-[380px] overflow-y-auto space-y-1.5 pr-0.5 py-1'>
                    {isLoading && notifications.length === 0 ? (
                      <div className='flex flex-col items-center justify-center p-8 text-center'>
                        <Loader2 className='w-6 h-6 text-blue-600 animate-spin mb-2' />
                        <span className='text-xs text-slate-400'>Memuat notifikasi...</span>
                      </div>
                    ) : notifications.length > 0 ? (
                      notifications.map(item => (
                        <div
                          key={item.id}
                          onClick={() => handleClickItem(item)}
                          className={`flex items-start gap-3 p-3 rounded-2xl transition-all cursor-pointer group text-left ${
                            !item.isRead
                              ? 'bg-blue-50/60 dark:bg-blue-950/25 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-blue-100/70 dark:border-blue-900/50'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800/70 border border-transparent'
                          }`}
                        >
                          {getNotificationIcon(item.type)}

                          <div className='flex flex-col flex-1 min-w-0'>
                            <div className='flex items-center justify-between gap-2'>
                              <h5
                                className={`text-xs leading-tight line-clamp-1 ${
                                  !item.isRead
                                    ? 'font-bold text-slate-900 dark:text-white'
                                    : 'font-semibold text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                {item.title}
                              </h5>
                              {!item.isRead && (
                                <span className='w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 shrink-0 shadow-xs' />
                              )}
                            </div>

                            <p className='text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed'>
                              {item.body}
                            </p>

                            <div className='flex items-center justify-between pt-1.5 mt-0.5 text-[10px] text-slate-400 dark:text-slate-500'>
                              <div className='flex items-center gap-1'>
                                <Clock className='w-3 h-3' />
                                <span>{formatRelativeTime(item.createdAt)}</span>
                              </div>

                              {item.actionUrl && (
                                <span className='inline-flex items-center gap-0.5 font-bold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity'>
                                  <span>Buka</span>
                                  <ChevronRight className='w-3 h-3' />
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className='flex flex-col items-center justify-center p-8 text-center'>
                        <div className='w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3'>
                          <BellOff className='w-6 h-6' />
                        </div>
                        <span className='font-bold text-xs text-slate-800 dark:text-slate-200'>
                          Belum Ada Notifikasi
                        </span>
                        <span className='text-[11px] text-slate-400 dark:text-slate-500 mt-1 max-w-[220px]'>
                          Aktivitas skill terverifikasi dan peluang karier terbaru Anda akan muncul di sini.
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Footer Actions */}
                  <div className='pt-1 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between px-2 text-xs'>
                    <button
                      type='button'
                      onClick={() => {
                        setOpen(false)
                        router.push('/opportunities')
                      }}
                      className='inline-flex items-center gap-1.5 py-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer'
                    >
                      <Briefcase className='w-3.5 h-3.5' />
                      <span>Eksplorasi Karier</span>
                    </button>

                    <button
                      type='button'
                      onClick={() => {
                        setOpen(false)
                        router.push('/skills')
                      }}
                      className='inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer'
                    >
                      <span>Lihat Skill</span>
                      <ExternalLink className='w-3 h-3' />
                    </button>
                  </div>
                </div>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </div>
  )
}
