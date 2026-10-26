import { NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { decodeJwt } from 'jose'
import { prisma } from '@/libs/prisma'
import { createJwtToken, AUTH_COOKIE_NAME } from '@/server/utils/auth'
import { apiSuccess, apiError } from '@/server/utils/response'

interface SupabaseJwtPayload {
  email?: string
  sub?: string
  user_metadata?: {
    full_name?: string
    name?: string
    avatar_url?: string
    picture?: string
    [key: string]: unknown
  }
  [key: string]: unknown
}

// 1. GET Handler: Menyajikan halaman jembatan (bridge) untuk membaca hash fragment (#access_token=...) dari Supabase OAuth
export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')

  // Jika flow menggunakan PKCE query param (?code=...)
  if (code) {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (supabaseUrl && anonKey) {
        const tokenRes = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=pkce`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: anonKey
          },
          body: JSON.stringify({
            auth_code: code,
            code_verifier: ''
          })
        })

        if (tokenRes.ok) {
          const tokenData = await tokenRes.json()
          if (tokenData.access_token) {
            // Proses token langsung dan redirect
            return await handleUserSession(tokenData.access_token, req)
          }
        }
      }
    } catch (err) {
      console.error('Error exchanging PKCE code:', err)
    }
  }

  // Jika flow menggunakan Implicit Grant dengan URL hash (#access_token=...)
  // Browser TIDAK mengirimkan hash fragment ke server, jadi kita kirimkan landing page
  // dengan JavaScript kecil untuk membaca hash dan mem-POST token ke endpoint ini
  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Menyelesaikan Masuk | Growvia</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #0B0F19;
      color: #F8FAFC;
    }
    .card {
      background: rgba(17, 24, 39, 0.85);
      border: 1px solid #1F2937;
      padding: 36px 32px;
      border-radius: 24px;
      text-align: center;
      max-width: 420px;
      width: 90%;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid rgba(59, 130, 246, 0.2);
      border-top-color: #3B82F6;
      border-radius: 50%;
      animation: spin 0.9s linear infinite;
      margin: 0 auto 20px;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    h2 { font-size: 20px; font-weight: 700; margin-bottom: 8px; color: #FFFFFF; }
    p { font-size: 13.5px; color: #94A3B8; line-height: 1.5; }
    .error { color: #EF4444; margin-top: 16px; font-size: 13px; display: none; }
  </style>
</head>
<body>
  <div class="card">
    <div class="spinner"></div>
    <h2>Menghubungkan Akun Google...</h2>
    <p>Mohon tunggu sejenak, kami sedang memverifikasi identitas Anda dengan sistem Growvia.</p>
    <div id="error-msg" class="error"></div>
  </div>

  <script>
    (async function() {
      try {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');

        if (!accessToken) {
          // Cek apakah ada query param access_token biasa
          const urlParams = new URLSearchParams(window.location.search);
          const queryToken = urlParams.get('access_token');
          if (!queryToken) {
            document.getElementById('error-msg').innerText = 'Token autentikasi tidak ditemukan. Mengalihkan ke login...';
            document.getElementById('error-msg').style.display = 'block';
            setTimeout(() => { window.location.replace('/login'); }, 2500);
            return;
          }
        }

        const token = accessToken || new URLSearchParams(window.location.search).get('access_token');

        const res = await fetch('/api/auth/callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken: token })
        });

        const data = await res.json();

        if (res.ok && data.success) {
          window.location.replace(data.data.redirectTo || '/home');
        } else {
          document.getElementById('error-msg').innerText = data.message || 'Gagal menyinkronkan akun Google Anda.';
          document.getElementById('error-msg').style.display = 'block';
          setTimeout(() => { window.location.replace('/login'); }, 3000);
        }
      } catch (e) {
        document.getElementById('error-msg').innerText = 'Terjadi kesalahan saat memproses data akun.';
        document.getElementById('error-msg').style.display = 'block';
        setTimeout(() => { window.location.replace('/login'); }, 3000);
      }
    })();
  </script>
</body>
</html>`

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8'
    }
  })
}

// 2. POST Handler: Memproses accessToken dari Supabase, sync user ke Prisma, buat session & set cookie
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const accessToken = body.accessToken

    if (!accessToken) {
      return apiError('Token OAuth diperlukan', 400)
    }

    return await handleUserSession(accessToken, req)
  } catch (err) {
    console.error('Error on POST /api/auth/callback:', err)
    return apiError('Gagal memproses sesi OAuth Google', 500, err)
  }
}

// Helper untuk sync user & set HTTP-only cookie
async function handleUserSession(accessToken: string, req: Request) {
  // Decode JWT payload dari Supabase
  let payload: SupabaseJwtPayload
  try {
    payload = decodeJwt(accessToken) as SupabaseJwtPayload
  } catch {
    return apiError('Token Google tidak valid', 400)
  }

  const email = payload.email?.toLowerCase().trim()
  if (!email) {
    return apiError('Email tidak ditemukan pada identitas Google', 400)
  }

  const name =
    payload.user_metadata?.full_name ||
    payload.user_metadata?.name ||
    email.split('@')[0]

  const avatarUrl =
    payload.user_metadata?.avatar_url ||
    payload.user_metadata?.picture ||
    null

  // 1. Cari atau buat user di database Prisma (PostgreSQL Supabase)
  let user = await prisma.user.findUnique({
    where: { email },
    include: { profile: true }
  })

  if (!user) {
    // User baru dari Google OAuth: otomatis active & emailVerified
    user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: '', // Akun OAuth tidak memakai password lokal
        avatarUrl,
        status: 'active',
        emailVerifiedAt: new Date()
      },
      include: { profile: true }
    })
  } else {
    // User lama: update avatar jika ada & pastikan status active
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        avatarUrl: avatarUrl || user.avatarUrl,
        status: user.status === 'unverified' ? 'active' : user.status,
        emailVerifiedAt: user.emailVerifiedAt || new Date()
      },
      include: { profile: true }
    })
  }

  // 2. Tentukan tujuan redirect: Onboarding jika profil belum lengkap, Dashboard jika sudah
  const isProfileComplete = Boolean(user.profile?.institution && user.profile?.major)
  const redirectTo = isProfileComplete ? '/home' : '/onboarding'

  // 3. Buat JWT session Growvia (30 hari)
  const sessionDurationDays = 30
  const expiresInStr = `${sessionDurationDays}d`
  const expiresAt = new Date(Date.now() + sessionDurationDays * 24 * 60 * 60 * 1000)

  const jwtToken = await createJwtToken(
    {
      userId: user.id,
      email: user.email,
      name: user.name
    },
    expiresInStr
  )

  // 4. Catat sesi ke database
  const refreshToken = crypto.randomBytes(40).toString('hex')
  const userAgent = req.headers.get('user-agent') || 'Google OAuth Device'

  await prisma.session.create({
    data: {
      userId: user.id,
      refreshToken,
      deviceInfo: userAgent.slice(0, 255),
      expiresAt
    }
  }).catch(e => console.warn('Warning creating session in DB:', e))

  // 5. Response & set HTTP-only cookie
  const response = apiSuccess(
    {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        status: user.status
      },
      token: jwtToken,
      redirectTo,
      isProfileComplete
    },
    'Berhasil masuk dengan akun Google.'
  )

  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: jwtToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt
  })

  return response
}
