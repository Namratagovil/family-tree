import { NextRequest, NextResponse } from 'next/server'
import { APP_PASSWORD, AUTH_COOKIE, authToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const form = await req.formData()
  if (!APP_PASSWORD || form.get('password') !== APP_PASSWORD) {
    return NextResponse.redirect(new URL('/login?error=1', req.url), 303)
  }
  const res = NextResponse.redirect(new URL('/', req.url), 303)
  res.cookies.set(AUTH_COOKIE, await authToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })
  return res
}
