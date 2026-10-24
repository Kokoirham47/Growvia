import { z } from 'zod'

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Nama lengkap minimal 2 karakter')
    .max(100, 'Nama lengkap maksimal 100 karakter'),
  email: z
    .string()
    .trim()
    .email('Format email tidak valid'),
  password: z
    .string()
    .min(8, 'Password minimal 8 karakter')
    .regex(/[A-Z]/, 'Password harus mengandung minimal 1 huruf besar')
    .regex(/[0-9]/, 'Password harus mengandung minimal 1 angka')
})

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Format email tidak valid'),
  password: z
    .string()
    .min(1, 'Password wajib diisi'),
  rememberMe: z.boolean().optional().default(false)
})

export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Token verifikasi tidak boleh kosong')
})

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Format email tidak valid')
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token reset tidak boleh kosong'),
  newPassword: z
    .string()
    .min(8, 'Password baru minimal 8 karakter')
    .regex(/[A-Z]/, 'Password harus mengandung minimal 1 huruf besar')
    .regex(/[0-9]/, 'Password harus mengandung minimal 1 angka')
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
