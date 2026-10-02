import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  try {
    const media = await db.media.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        uploader: { select: { id: true, name: true, email: true } },
      },
    })
    return NextResponse.json({ media })
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

    const { url, altText, filename } = await request.json()

    if (!url || !altText || !altText.trim()) {
      return NextResponse.json({ error: 'Media URL and mandatory WCAG ALT text are required' }, { status: 400 })
    }

    const item = await db.media.create({
      data: {
        uploaderId: user.id,
        url,
        altText: altText.trim(),
        filename: filename || 'uploaded-image.jpg',
      },
    })

    return NextResponse.json({ success: true, media: item })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
