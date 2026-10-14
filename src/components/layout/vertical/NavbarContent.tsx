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

const NavbarContent = () => {
  const [searchValue, setSearchValue] = useState('')

  return (
    <div className='flex items-center justify-between gap-4 is-full py-2'>
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
            className='bg-[#F8FAFC] border border-[#E2E8F0] text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block is-full ps-10 pe-4 py-2 transition-all placeholder:text-slate-400 focus:bg-white outline-none'
          />
        </div>
      </div>

      {/* Right: Notifications & User Profile */}
      <div className='flex items-center gap-4'>
        {/* Notification Bell */}
        <Tooltip title='Notifikasi (1 Belum dibaca)'>
          <IconButton size='small' className='text-slate-600 hover:text-slate-900 hover:bg-slate-100'>
            <Badge
              variant='dot'
              color='error'
              overlap='circular'
              sx={{
                '& .MuiBadge-badge': {
                  backgroundColor: '#EF4444',
                  boxShadow: '0 0 0 2px #fff'
                }
              }}
            >
              <Bell className='w-5 h-5 text-slate-600' />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* User Info & Avatar */}
        <div className='flex items-center gap-3 cursor-pointer pl-1 py-1 rounded-xl hover:bg-slate-50 transition-colors'>
          <Avatar
            src='/images/avatars/nabila.jpg'
            alt='Nabila Saftri'
            sx={{ width: 40, height: 40, border: '1.5px solid #E2E8F0' }}
          />
          <div className='hidden sm:flex flex-col text-left'>
            <span className='font-semibold text-sm text-[#1E293B] leading-snug'>
              Nabila Saftri
            </span>
            <span className='text-[11px] text-[#64748B] leading-none mt-0.5 font-normal'>
              Fresh Graduate • UI/UX & Product
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NavbarContent
