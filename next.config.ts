import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  basePath: process.env.BASEPATH,
  compress: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      }
    ]
  },
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@mui/material',
      '@mui/lab',
      'react-icons',
      'classnames'
    ]
  }
}

export default nextConfig
