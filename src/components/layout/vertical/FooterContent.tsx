'use client'

// Next Imports
import Link from 'next/link'

// Third-party Imports
import classnames from 'classnames'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

const FooterContent = () => {
  const { isBreakpointReached } = useVerticalNav()

  return (
    <div
      className={classnames(verticalLayoutClasses.footerContent, 'flex items-center justify-between flex-wrap gap-4 text-xs text-slate-500 py-3')}
    >
      <p className='flex items-center gap-1.5'>
        <span>© {new Date().getFullYear()}</span>
        <strong className='font-semibold text-slate-700'>Growvia</strong>
        <span>— Turn Experience Into Opportunity.</span>
      </p>
      {!isBreakpointReached && (
        <div className='flex items-center gap-5 text-xs text-slate-500'>
          <Link href='#' className='hover:text-blue-600 transition-colors'>
            Pusat Bantuan
          </Link>
          <Link href='#' className='hover:text-blue-600 transition-colors'>
            Kebijakan Privasi
          </Link>
          <Link href='#' className='hover:text-blue-600 transition-colors'>
            Syarat & Ketentuan
          </Link>
        </div>
      )}
    </div>
  )
}

export default FooterContent
