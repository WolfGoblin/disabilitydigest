import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { signToken } from '@/lib/auth'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const redirect = searchParams.get('redirect') || '/'

  // Facebook OAuth mock flow for development & demo validation
  const mockFbId = `fb_${Date.now().toString().slice(-8)}`
  const mockName = `Facebook Reader ${mockFbId.slice(-4)}`
  const mockEmail = `reader.${mockFbId}@facebook-oauth.dev`

  let user = await db.user.findFirst({
    where: { OR: [{ facebookId: mockFbId }, { email: mockEmail }] },
  })

  if (!user) {
    user = await db.user.create({
      data: {
        name: mockName,
        email: mockEmail,
        facebookId: mockFbId,
        role: 'READER',
        status: 'ACTIVE',
        emailVerified: true,
      },
    })
  }

  const token = signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  })

  const response = NextResponse.redirect(new URL(redirect, request.url))

  response.cookies.set('dd_auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  return response
}
