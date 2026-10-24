'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { Search, Bell } from 'lucide-react'

// Component Imports
import NavToggle from './NavToggle'
import ModeDropdown from '@components/layout/shared/ModeDropdown'

const NavbarContent = () => {
  const [searchValue, setSearchValue] = useState('')

  return (
    <div className='flex items-center justify-between gap-3 sm:gap-4 is-full py-2'>
      {/* Left: Mobile Nav Toggle + Search Bar */}
      <div className='flex items-center gap-3 flex-1 max-is-[540px]'>
        <NavToggle />

        {/* Global Search Bar */}
        <div className='relative flex items-center is-full'>
          <div className='absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-slate-400'>
            <Search className='w-4 h-4' />
          </div>
          <input
            type='text'
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            placeholder='Cari skill, peran karier, atau pengalaman...'
            className='bg-[#F8FAFC] dark:bg-slate-900/60 border border-[#E2E8F0] dark:border-slate-800 text-slate-800 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block is-full ps-10 pe-4 py-2 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-900 outline-none'
          />
        </div>
      </div>

      {/* Right: Mode Toggle, Notifications & User Profile */}
      <div className='flex items-center gap-2 sm:gap-3'>
        {/* Dark / Light Mode Toggle Button */}
        <ModeDropdown />

        {/* Notification Bell */}
        <Tooltip title='Notifikasi (1 Belum dibaca)'>
          <IconButton
            size='small'
            className='w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-xs'
          >
            <Badge
              variant='dot'
              color='error'
              overlap='circular'
              sx={{
                '& .MuiBadge-badge': {
                  backgroundColor: '#EF4444',
                  boxShadow: '0 0 0 2px var(--mui-palette-background-paper)'
                }
              }}
            >
              <Bell className='w-4.5 h-4.5' />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* User Info & Avatar */}
        <div className='flex items-center gap-2.5 cursor-pointer pl-1 py-1 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors'>
          <Avatar
            src='/images/avatars/nabila.jpg'
            alt='Nabila Saftri'
            sx={{
              width: 38,
              height: 38,
              border: '1.5px solid var(--mui-palette-divider)'
            }}
          />
          <div className='hidden sm:flex flex-col text-left'>
            <span className='font-semibold text-xs sm:text-sm text-[#1E293B] dark:text-white leading-snug'>
              Nabila Saftri
            </span>
            <span className='text-[10px] sm:text-[11px] text-[#64748B] dark:text-slate-400 leading-none mt-0.5 font-normal'>
              Fresh Graduate • UI/UX & Product
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NavbarContent
