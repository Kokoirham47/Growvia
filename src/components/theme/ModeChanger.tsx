// React Imports
import { useEffect } from 'react'

// MUI Imports
import { useColorScheme } from '@mui/material/styles'

// Third-party Imports
import { useMedia } from 'react-use'

// Type Imports
import type { SystemMode } from '@core/types'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'

const ModeChanger = ({ systemMode }: { systemMode: SystemMode }) => {
  // Hooks
  const { setMode } = useColorScheme()
  const { settings } = useSettings()
  const isDark = useMedia('(prefers-color-scheme: dark)', systemMode === 'dark')

  useEffect(() => {
    if (settings.mode) {
      const activeMode = settings.mode === 'system' ? (isDark ? 'dark' : 'light') : settings.mode
      setMode(activeMode)

      if (typeof document !== 'undefined') {
        if (activeMode === 'dark') {
          document.documentElement.classList.add('dark')
          document.documentElement.setAttribute('data-theme', 'dark')
          document.documentElement.setAttribute('data-mui-color-scheme', 'dark')
        } else {
          document.documentElement.classList.remove('dark')
          document.documentElement.setAttribute('data-theme', 'light')
          document.documentElement.setAttribute('data-mui-color-scheme', 'light')
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.mode, isDark])

  return null
}

export default ModeChanger
