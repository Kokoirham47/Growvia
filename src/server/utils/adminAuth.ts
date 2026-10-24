import { cookies } from 'next/headers'

import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'

export const ADMIN_COOKIE_NAME = 'growvia_admin_token'

const JWT_SECRET = new TextEncoder().encode(
  process.env.SUPABASE_JWT_SECRET || process.env.JWT_SECRET || 'growvia-secret-super-secure-key-2026'
)

export interface AdminJwtPayload {
  adminId: string
  email: string
  name: string
  role: 'admin'
  [key: string]: unknown
}

/**
 * Hash password string using bcryptjs
 */
export async function hashAdminPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)

  
return bcrypt.hash(password, salt)
}

/**
 * Compare plain text password against bcrypt hash
 */
export async function compareAdminPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Create a signed admin JWT token with 8-hour expiry
 */
export async function createAdminToken(
  payload: Omit<AdminJwtPayload, 'role'>,
  expiresIn = '8h'
): Promise<string> {
  return new SignJWT({ ...payload, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET)
}

/**
 * Verify and decode an admin JWT token
 */
export async function verifyAdminToken(token: string): Promise<AdminJwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)

    if (payload.role !== 'admin') return null
    
return payload as unknown as AdminJwtPayload
  } catch {
    return null
  }
}

/**
 * Get current authenticated admin session from server cookies
 */
export async function getAdminServerSession(): Promise<AdminJwtPayload | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value

    if (!token) return null
    
return await verifyAdminToken(token)
  } catch {
    return null
  }
}
