import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categorySlug = searchParams.get('category')
    const query = searchParams.get('q')
    const status = searchParams.get('status') || 'PUBLISHED'
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const page = parseInt(searchParams.get('page') || '1', 10)

    const where: any = {}

    if (status !== 'ALL') {
      where.status = status
    }

    if (categorySlug) {
      where.categories = {
        some: {
          category: {
            slug: categorySlug,
          },
        },
      }
    }

    if (query) {
      where.OR = [
        { title: { contains: query } },
        { excerpt: { contains: query } },
        { body: { contains: query } },
      ]
    }

    const [total, articles] = await Promise.all([
      db.article.count({ where }),
      db.article.findMany({
        where,
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { publishedAt: 'desc' },
        include: {
          author: { select: { id: true, name: true, email: true } },
          categories: { include: { category: true } },
          tags: { include: { tag: true } },
          _count: { select: { comments: true } },
        },
      }),
    ])

    return NextResponse.json({
      articles,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || (user.role !== 'ADMIN' && user.role !== 'EDITOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await request.json()
    const { title, slug, excerpt, content, featuredImageUrl, featuredImageAlt, status, categoryIds } = body

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    const generatedSlug = (slug || title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')

    const article = await db.article.create({
      data: {
        title,
        slug: `${generatedSlug}-${Date.now().toString().slice(-4)}`,
        excerpt: excerpt || title,
        body: content,
        featuredImageUrl,
        featuredImageAlt: featuredImageAlt || title,
        status: status || 'PUBLISHED',
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
        authorId: user.id,
        metaTitle: `${title} | Disability Digest`,
        metaDescription: excerpt || title,
      },
    })

    if (categoryIds && Array.isArray(categoryIds)) {
      for (const catId of categoryIds) {
        await db.articleCategory.create({
          data: {
            articleId: article.id,
            categoryId: catId,
          },
        })
      }
    }

    return NextResponse.json({ success: true, article })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
