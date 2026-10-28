import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { jwtVerify } from 'jose'

const AUTH_COOKIE_NAME = 'growvia_token'
const ADMIN_COOKIE_NAME = 'growvia_admin_token'

const JWT_SECRET = new TextEncoder().encode(
  process.env.SUPABASE_JWT_SECRET || process.env.JWT_SECRET || 'growvia-secret-super-secure-key-2026'
)


async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)

    
return payload
  } catch {
    return null
  }
}

async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)

    if (payload.role !== 'admin') return null
    
return payload
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 0. Auto-forward Supabase OAuth code jika terlempar ke root (/) atau (/login) karena fallback Site URL
  const code = request.nextUrl.searchParams.get('code')

  if (code && (pathname === '/' || pathname === '/login' || pathname === '/register')) {
    const callbackUrl = new URL('/api/auth/callback', request.url)

    callbackUrl.search = request.nextUrl.search

    return NextResponse.redirect(callbackUrl)
  }

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

  // =========================================================================
  // ADMIN SUBSYSTEM PIPELINE (/admin/* & /api/admin/*)
  // =========================================================================
  const adminToken = request.cookies.get(ADMIN_COOKIE_NAME)?.value
  const adminSession = adminToken ? await verifyAdminToken(adminToken) : null
  const isAdminAuthenticated = Boolean(adminSession)

  // A. Admin API Endpoints
  if (pathname.startsWith('/api/admin/')) {
    // Bypass public admin login endpoint
    if (pathname === '/api/admin/auth/login') {
      return NextResponse.next()
    }

    if (!isAdminAuthenticated) {
      return NextResponse.json(
        {
          success: false,
          message: 'Sesi admin tidak valid atau telah berakhir. Silakan login kembali.',
          code: 'UNAUTHORIZED_ADMIN'
        },
        { status: 401 }
      )
    }

    const requestHeaders = new Headers(request.headers)

    if (adminSession?.adminId) {
      requestHeaders.set('x-admin-id', String(adminSession.adminId))
      requestHeaders.set('x-admin-email', String(adminSession.email || ''))
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders
      }
    })
  }

  // B. Admin UI Pages
  if (pathname.startsWith('/admin')) {
    const isAdminLoginPage = pathname === '/admin/login'

    // Jika sudah login admin dan membuka /admin/login, alihkan langsung ke dashboard admin
    if (isAdminLoginPage) {
      if (isAdminAuthenticated) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
      }

      
return NextResponse.next()
    }

    // Jika belum login admin dan membuka halaman /admin/* terproteksi
    if (!isAdminAuthenticated) {
      const adminLoginUrl = new URL('/admin/login', request.url)

      
return NextResponse.redirect(adminLoginUrl)
    }

    return NextResponse.next()
  }

  // =========================================================================
  // REGULAR USER PIPELINE
  // =========================================================================
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value
  const session = token ? await verifyToken(token) : null
  const isAuthenticated = Boolean(session)

  // 2. Bypass public auth API endpoints, master data career-fields, dashboard summary & health check
  if (
    pathname.startsWith('/api/auth/') ||
    pathname.startsWith('/api/dashboard') ||
    pathname === '/api/career-fields' ||
    pathname === '/api/health'
  ) {
    if (session?.userId) {
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-id', String(session.userId))
      requestHeaders.set('x-user-email', String(session.email || ''))
      return NextResponse.next({
        request: {
          headers: requestHeaders
        }
      })
    }
    return NextResponse.next()
  }

  // 3. Lindungi API endpoints selain /api/auth/ dan /api/dashboard
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

  // 5. Halaman Dashboard & Fitur Terproteksi (/home, /dashboard, /onboarding, /experience, /skills, dll.)
  if (!isAuthenticated) {
    // Di mode development, izinkan akses langsung ke /home dan /dashboard
    if (pathname === '/home' || pathname === '/dashboard' || pathname === '/') {
      return NextResponse.next()
    }

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
