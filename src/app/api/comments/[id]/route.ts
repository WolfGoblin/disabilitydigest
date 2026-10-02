import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user || (user.role !== 'ADMIN' && user.role !== 'EDITOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { status } = await request.json()

    if (!['APPROVED', 'PENDING', 'REJECTED', 'SPAM'].includes(status)) {
      return NextResponse.json({ error: 'Invalid moderation status' }, { status: 400 })
    }

    const comment = await db.comment.update({
      where: { id: params.id },
      data: { status },
    })

    return NextResponse.json({ success: true, comment })
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

    await db.comment.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
