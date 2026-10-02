import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const adminUser = await getCurrentUser()
    if (!adminUser || adminUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { role, status } = await request.json()

    const updated = await db.user.update({
      where: { id: params.id },
      data: {
        role: role || undefined,
        status: status || undefined,
      },
    })

    return NextResponse.json({ success: true, user: updated })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
