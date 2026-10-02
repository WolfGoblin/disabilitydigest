import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { db } from './db'

const JWT_SECRET = process.env.JWT_SECRET || 'disability-digest-secret-key-2026-secure'

export interface TokenPayload {
  userId: string
  email: string
  role: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload
  } catch (error) {
    return null
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('dd_auth_token')?.value
    if (!token) return null

    const payload = verifyToken(token)
    if (!payload) return null

    const user = await db.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        facebookId: true,
        emailVerified: true,
        createdAt: true,
      },
    })

    if (!user || user.status === 'BANNED') return null
    return user
  } catch (error) {
    return null
  }
}
