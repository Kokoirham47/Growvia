// React Imports
import type { SVGAttributes } from 'react'

const Logo = (props: SVGAttributes<SVGElement>) => {
  return (
    <svg
      width='1em'
      height='1em'
      viewBox='0 0 32 32'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <rect width='32' height='32' rx='8' fill='#1E3A8A' />
      {/* Growvia leaf / compass sprout mark */}
      <path
        d='M16 7C16 7 11 11.5 11 17C11 19.8 13.2 22 16 22C18.8 22 21 19.8 21 17C21 11.5 16 7 16 7Z'
        fill='#3B82F6'
      />
      <path
        d='M16 11C16 11 18.5 13.5 20.5 16C21.8 17.6 22.5 19.5 22 21.5C20.5 20.8 18.5 19.5 17 17.5L16 16V25'
        stroke='#FFFFFF'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <circle cx='16' cy='16' r='2' fill='#FFFFFF' />
    </svg>
  )
}

export default Logo
