import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'

export const AUTH_COOKIE_NAME = 'growvia_token'

const JWT_SECRET = new TextEncoder().encode(
  process.env.SUPABASE_JWT_SECRET || process.env.JWT_SECRET || 'growvia-secret-super-secure-key-2026'
)

export interface UserJwtPayload {
  userId: string
  email: string
  name?: string
  role?: string
  [key: string]: unknown
}

/**
 * Hash password string using bcryptjs
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

/**
 * Compare plain text password against bcrypt hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Create a signed JWT token
 */
export async function createJwtToken(
  payload: UserJwtPayload,
  expiresIn = '7d'
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET)
}

/**
 * Verify and decode a JWT token
 */
export async function verifyJwtToken<T = UserJwtPayload>(token: string): Promise<T | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as T
  } catch {
    return null
  }
}

/**
 * Get current authenticated user session from Next.js server cookie
 */
export async function getServerSession(): Promise<UserJwtPayload | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value

    if (!token) return null
    return await verifyJwtToken<UserJwtPayload>(token)
  } catch {
    return null
  }
}

/**
 * Helper to get authenticated user ID across server components and route handlers
 */
export async function getAuthUserId(request?: NextRequest): Promise<string | null> {
  const headerUserId = request?.headers.get('x-user-id')

  if (headerUserId) return headerUserId

  const session = await getServerSession()

  if (session?.userId) return session.userId

  return null
}
