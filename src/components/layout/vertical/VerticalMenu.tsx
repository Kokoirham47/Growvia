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
  Compass,
  User,
  Settings
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
  const { isBreakpointReached, transitionDuration } = verticalNavOptions
  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    <div className='flex flex-col justify-between bs-full font-poppins'>
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
              Karier &amp; Gap
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

          <MenuSection label='PENGATURAN & AKUN'>
            <MenuItem href='/profile' icon={<User className='w-5 h-5' />}>
              Profil Saya
            </MenuItem>
            <MenuItem href='/settings' icon={<Settings className='w-5 h-5' />}>
              Pengaturan
            </MenuItem>
          </MenuSection>
        </Menu>
      </ScrollWrapper>
    </div>
  )
}

export default VerticalMenu
