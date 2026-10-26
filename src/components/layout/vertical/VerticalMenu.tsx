'use client'

// MUI Imports
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'
import {
  ChevronRight,
  Circle,
  LayoutGrid,
  Briefcase,
  Network,
  TrendingUp,
  GraduationCap,
  Sparkles,
  Compass
} from 'lucide-react'

// Type Imports
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import { Menu, MenuItem, MenuSection } from '@menu/vertical-menu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

type Props = {
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <ChevronRight className='w-4 h-4' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ scrollMenu }: Props) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()

  // Vars
  const { isBreakpointReached, transitionDuration, isCollapsed, isHovered } = verticalNavOptions
  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    <div className='flex flex-col justify-between bs-full'>
      <ScrollWrapper
        {...(isBreakpointReached
          ? {
              className: 'bs-full overflow-y-auto overflow-x-hidden',
              onScroll: container => scrollMenu(container, false)
            }
          : {
              options: { wheelPropagation: false, suppressScrollX: true },
              onScrollY: container => scrollMenu(container, true)
            })}
      >
        <Menu
          popoutMenuOffset={{ mainAxis: 23 }}
          menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
          renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
          renderExpandedMenuItemIcon={{ icon: <Circle className='w-2 h-2 fill-current' /> }}
          menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
        >
          <MenuSection label='NAVIGASI UTAMA'>
            <MenuItem href='/home' icon={<LayoutGrid className='w-5 h-5' />}>
              Dashboard
            </MenuItem>
            <MenuItem href='/experience' icon={<Briefcase className='w-5 h-5' />}>
              Pengalaman
            </MenuItem>
            <MenuItem href='/skills' icon={<Network className='w-5 h-5' />}>
              Skill Matrix
            </MenuItem>
            <MenuItem href='/career' icon={<TrendingUp className='w-5 h-5' />}>
              Karier & Gap
            </MenuItem>
            <MenuItem href='/learning' icon={<GraduationCap className='w-5 h-5' />}>
              Rekomendasi Belajar
            </MenuItem>
            <MenuItem href='/opportunities' icon={<Compass className='w-5 h-5' />}>
              Peluang Karier
            </MenuItem>
            <MenuItem href='/portfolio' icon={<Sparkles className='w-5 h-5' />}>
              Portofolio AI
            </MenuItem>
          </MenuSection>
        </Menu>
      </ScrollWrapper>

      {/* AI Readiness Sidebar Widget */}
      {!(isCollapsed && !isHovered) && (
        <div className='p-4 pb-6'>
          <div className='p-3.5 rounded-2xl bg-[#F0F5FF] dark:bg-blue-950/40 border border-[#DBEAFE] dark:border-blue-900/50 transition-all hover:shadow-sm'>
            <div className='flex items-center gap-2'>
              <div className='w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0'>
                <Sparkles className='w-3.5 h-3.5' />
              </div>
              <span className='font-bold text-xs text-[#1E3A8A] dark:text-blue-300'>AI Readiness</span>
            </div>
            <p className='text-[11px] text-[#64748B] dark:text-slate-400 mt-1.5 leading-snug font-normal'>
              Profil siap kerja mencapai 78% berdasarkan target UI/UX.
            </p>
            <div className='mt-2.5 w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden'>
              <div className='bg-[#2563EB] h-full rounded-full' style={{ width: '78%' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VerticalMenu
