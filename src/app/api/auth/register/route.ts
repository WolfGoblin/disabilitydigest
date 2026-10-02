import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword, signToken } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    const existing = await db.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Account with this email already exists' }, { status: 400 })
    }

    const passwordHash = await hashPassword(password)

    const user = await db.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: 'READER',
        status: 'ACTIVE',
        emailVerified: true,
      },
    })

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    })

    response.cookies.set('dd_auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return response
  } catch (error: any) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
