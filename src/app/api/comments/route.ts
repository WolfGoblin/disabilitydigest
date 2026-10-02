import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const articleId = searchParams.get('articleId')
    const status = searchParams.get('status') || 'APPROVED'

    const where: any = {}
    if (articleId) where.articleId = articleId
    if (status !== 'ALL') where.status = status

    const comments = await db.comment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true, facebookId: true } },
        article: { select: { id: true, title: true, slug: true } },
      },
    })

    return NextResponse.json({ comments })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'You must be logged in to comment' }, { status: 401 })
    }

    if (user.status === 'MUTED' || user.status === 'BANNED') {
      return NextResponse.json({ error: 'Your account is restricted from posting comments' }, { status: 403 })
    }

    const { articleId, body } = await request.json()

    if (!articleId || !body || !body.trim()) {
      return NextResponse.json({ error: 'Article ID and comment text are required' }, { status: 400 })
    }

    const comment = await db.comment.create({
      data: {
        articleId,
        userId: user.id,
        body: body.trim(),
        status: 'APPROVED', // Default auto-approve for logged in users
      },
      include: {
        user: { select: { id: true, name: true, email: true, facebookId: true } },
      },
    })

    return NextResponse.json({ success: true, comment })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
