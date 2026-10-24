import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const AUTH_COOKIE_NAME = 'growvia_token'
const JWT_SECRET = new TextEncoder().encode(
  process.env.SUPABASE_JWT_SECRET || process.env.JWT_SECRET || 'growvia-secret-super-secure-key-2026'
)

// Public pages that do not require authentication
const PUBLIC_PATHS = [
  '/',
  '/login',
  '/register',
  '/verify-email',
  '/forgot-password',
  '/reset-password',
  '/_next',
  '/favicon.ico',
  '/images'
]

async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Bypass static files, Next.js internal routes, dan public asset
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/assets') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value
  const session = token ? await verifyToken(token) : null
  const isAuthenticated = Boolean(session)

  // 2. Bypass public auth API endpoints, master data career-fields & health check
  if (pathname.startsWith('/api/auth/') || pathname === '/api/career-fields' || pathname === '/api/health') {
    return NextResponse.next()
  }

  // 3. Lindungi API endpoints selain /api/auth/
  if (pathname.startsWith('/api/')) {
    if (!isAuthenticated) {
      return NextResponse.json(
        {
          success: false,
          message: 'Sesi Anda tidak valid atau telah berakhir. Silakan login kembali.',
          code: 'UNAUTHORIZED'
        },
        { status: 401 }
      )
    }

    // Teruskan userId via header untuk memudahkan route handler
    const requestHeaders = new Headers(request.headers)
    if (session?.userId) {
      requestHeaders.set('x-user-id', String(session.userId))
      requestHeaders.set('x-user-email', String(session.email || ''))
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders
      }
    })
  }

  // 4. Halaman Auth Publik (login, register, forgot-password, dsb.)
  const isAuthPage =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password'

  if (isAuthPage) {
    // Jika user sudah login, redirect langsung ke /home
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/home', request.url))
    }
    return NextResponse.next()
  }

  // Halaman publik lainnya (landing page '/', verifikasi email, atau portofolio publik /u/)
  if (pathname === '/' || pathname === '/verify-email' || pathname.startsWith('/u/')) {
    const res = NextResponse.next()
    if (pathname === '/') {
      res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
      res.headers.set('Pragma', 'no-cache')
      res.headers.set('Expires', '0')
    }
    return res
  }

  // 5. Halaman Dashboard & Fitur Terproteksi (/home, /onboarding, /experience, /skills, dll.)
  if (!isAuthenticated) {
    const loginUrl = new URL('/login', request.url)
    // Simpan return url agar bisa redirect kembali setelah login
    if (pathname !== '/' && pathname !== '/home') {
      loginUrl.searchParams.set('callbackUrl', pathname)
    }
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)'
  ]
}
