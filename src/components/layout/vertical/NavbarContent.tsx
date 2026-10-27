'use client'

// Component Imports
import NavToggle from './NavToggle'
import ModeDropdown from '@components/layout/shared/ModeDropdown'
import UserDropdown from '@components/layout/shared/UserDropdown'
import NotificationDropdown from '@components/layout/shared/NotificationDropdown'
import NavbarSearch from '@components/layout/shared/NavbarSearch'

const NavbarContent = () => {
  return (
    <div className='flex items-center justify-between gap-3 sm:gap-4 is-full py-2'>
      {/* Left: Mobile Nav Toggle + Search Bar */}
      <div className='flex items-center gap-3 flex-1 max-is-[540px]'>
        <NavToggle />
        <NavbarSearch />
      </div>

      {/* Right: Mode Toggle, Notifications & User Profile */}
      <div className='flex items-center gap-2 sm:gap-3'>
        {/* Dark / Light Mode Toggle Button */}
        <ModeDropdown />

        {/* Interactive Notification Bell Dropdown Overlay */}
        <NotificationDropdown />

        {/* Interactive User Profile Dropdown Overlay */}
        <UserDropdown />
      </div>
    </div>
  )
}

export default NavbarContent
