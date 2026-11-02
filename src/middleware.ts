import { NextRequest, NextResponse } from 'next/server'
import { AUTH_COOKIE, authToken } from '@/lib/auth'

export async function middleware(req: NextRequest) {
  if (req.cookies.get(AUTH_COOKIE)?.value === (await authToken())) return NextResponse.next()
  return NextResponse.redirect(new URL('/login', req.url))
}

// Everything except the login page, its API route and Next.js static files.
export const config = {
  matcher: ['/((?!login|api/login|_next/static|_next/image|favicon.ico).*)'],
}
