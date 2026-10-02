import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const users = await db.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        facebookId: true,
        createdAt: true,
        _count: { select: { comments: true, articles: true } },
      },
    })

    return NextResponse.json({ users })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
