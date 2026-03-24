import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { ADMIN_CONFIG, validateSession } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAdminRoute = pathname.startsWith('/admin')
  if (!isAdminRoute) return NextResponse.next()

  const isLogin = pathname === '/admin/login'
  const token = request.cookies.get(ADMIN_CONFIG.cookieName)?.value
  const session = validateSession(token)

  if (isAdminRoute && !isLogin && !session) {
    const redirectUrl = new URL('/admin/login', request.url)
    redirectUrl.searchParams.set('redirectedFrom', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  if (isLogin && session) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
