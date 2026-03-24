import { NextResponse } from 'next/server'
import * as z from 'zod'

import { isAdminEmail, ADMIN_CONFIG } from '@/lib/auth'
import { createSessionToken, verifyPassword } from '@/lib/auth-server'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = loginSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const { email, password } = parsed.data

    if (!isAdminEmail(email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const valid = verifyPassword(password)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = createSessionToken()

    const response = NextResponse.json({ success: true })
    response.cookies.set({
      name: ADMIN_CONFIG.cookieName,
      value: token,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error('Login error', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
