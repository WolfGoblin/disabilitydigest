import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { comparePassword, signToken } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const user = await db.user.findUnique({ where: { email } })

    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    if (user.status === 'BANNED') {
      return NextResponse.json({ error: 'Account has been suspended' }, { status: 403 })
    }

    const validPassword = await comparePassword(password, user.passwordHash)
    if (!validPassword) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

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
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (error: any) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}
