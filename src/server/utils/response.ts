import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export type ApiResponse<T = unknown> = {
  success: boolean
  message?: string
  data?: T
  errors?: unknown
}

/**
 * Standardized Success Response for Next.js Route Handlers
 */
export function apiSuccess<T>(data?: T, message = 'Success', status = 200) {
  return NextResponse.json<ApiResponse<T>>(
    {
      success: true,
      message,
      data
    },
    { status }
  )
}

/**
 * Standardized Error Response for Next.js Route Handlers
 */
export function apiError(message = 'An unexpected error occurred', status = 500, errors?: unknown) {
  // Automatically format Zod validation errors
  if (errors instanceof ZodError) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: 'Validasi form gagal',
        errors: errors.flatten().fieldErrors
      },
      { status: 400 }
    )
  }

  return NextResponse.json<ApiResponse>(
    {
      success: false,
      message,
      errors
    },
    { status }
  )
}
