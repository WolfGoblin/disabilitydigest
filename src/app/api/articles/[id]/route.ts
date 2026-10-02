import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const article = await db.article.findUnique({
      where: { id: params.id },
      include: {
        author: { select: { id: true, name: true, email: true } },
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
      },
    })

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    return NextResponse.json({ article })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user || (user.role !== 'ADMIN' && user.role !== 'EDITOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await request.json()
    const { title, excerpt, content, featuredImageUrl, featuredImageAlt, status, categoryIds } = body

    const article = await db.article.update({
      where: { id: params.id },
      data: {
        title,
        excerpt,
        body: content,
        featuredImageUrl,
        featuredImageAlt,
        status,
        publishedAt: status === 'PUBLISHED' ? new Date() : undefined,
      },
    })

    if (categoryIds && Array.isArray(categoryIds)) {
      await db.articleCategory.deleteMany({ where: { articleId: params.id } })
      for (const catId of categoryIds) {
        await db.articleCategory.create({
          data: { articleId: params.id, categoryId: catId },
        })
      }
    }

    return NextResponse.json({ success: true, article })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await db.article.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
