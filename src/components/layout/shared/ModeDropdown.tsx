'use client'

// React Imports
import { useRef, useState } from 'react'

// MUI Imports
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'

// Type Imports
import type { Mode } from '@core/types'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
import { Sun, Moon, Laptop, Check } from 'lucide-react'

const ModeDropdown = () => {
  // States
  const [open, setOpen] = useState(false)
  const [tooltipOpen, setTooltipOpen] = useState(false)

  // Refs
  const anchorRef = useRef<HTMLButtonElement>(null)

  // Hooks
  const { settings, updateSettings } = useSettings()

  const handleClose = () => {
    setOpen(false)
    setTooltipOpen(false)
  }

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  const handleModeSwitch = (mode: Mode) => {
    handleClose()

    if (settings.mode !== mode) {
      updateSettings({ mode })
    }
  }

  const renderModeIcon = () => {
    if (settings.mode === 'system') {
      return <Laptop className='w-4.5 h-4.5 text-blue-500' />
    } else if (settings.mode === 'dark') {
      return <Moon className='w-4.5 h-4.5 text-amber-400' />
    } else {
      return <Sun className='w-4.5 h-4.5 text-amber-500' />
    }
  }

  const currentModeLabel =
    settings.mode === 'dark'
      ? 'Tema Gelap (Dark)'
      : settings.mode === 'light'
      ? 'Tema Terang (Light)'
      : 'Ikuti Sistem'

  return (
    <>
      <Tooltip
        title={`Ganti Tema: ${currentModeLabel}`}
        onOpen={() => setTooltipOpen(true)}
        onClose={() => setTooltipOpen(false)}
        open={open ? false : tooltipOpen}
        slotProps={{ popper: { className: 'capitalize' } }}
      >
        <IconButton
          ref={anchorRef}
          onClick={handleToggle}
          size='small'
          className='w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-xs'
          aria-label='Toggle color mode'
        >
          {renderModeIcon()}
        </IconButton>
      </Tooltip>
      <Popper
        open={open}
        transition
        disablePortal
        placement='bottom-end'
        anchorEl={anchorRef.current}
        className='min-w-[170px] mt-2 z-50'
      >
        {({ TransitionProps, placement }) => (
          <Fade
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top' }}
          >
            <Paper className='rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-xl p-1.5'>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList onKeyDown={handleClose} className='py-0 space-y-0.5'>
                  <MenuItem
                    className={`flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      settings.mode === 'light'
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                    onClick={() => handleModeSwitch('light')}
                  >
                    <div className='flex items-center gap-2.5'>
                      <Sun className='w-4 h-4 text-amber-500' />
                      <span>Terang (Light)</span>
                    </div>
                    {settings.mode === 'light' && <Check className='w-3.5 h-3.5' />}
                  </MenuItem>

                  <MenuItem
                    className={`flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      settings.mode === 'dark'
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                    onClick={() => handleModeSwitch('dark')}
                  >
                    <div className='flex items-center gap-2.5'>
                      <Moon className='w-4 h-4 text-amber-400' />
                      <span>Gelap (Dark)</span>
                    </div>
                    {settings.mode === 'dark' && <Check className='w-3.5 h-3.5' />}
                  </MenuItem>

                  <MenuItem
                    className={`flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      settings.mode === 'system'
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                    onClick={() => handleModeSwitch('system')}
                  >
                    <div className='flex items-center gap-2.5'>
                      <Laptop className='w-4 h-4 text-blue-500' />
                      <span>Sistem</span>
                    </div>
                    {settings.mode === 'system' && <Check className='w-3.5 h-3.5' />}
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  )
}

export default ModeDropdown
