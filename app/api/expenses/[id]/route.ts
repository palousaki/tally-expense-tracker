import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { amount, categoryId, date, note } = body

  const expense = await prisma.expense.updateMany({
    where: { id: params.id, userId: user.id },
    data: {
      ...(amount !== undefined && { amount: parseFloat(amount) }),
      ...(categoryId !== undefined && { categoryId }),
      ...(date !== undefined && { date: new Date(date) }),
      ...(note !== undefined && { note }),
    },
  })

  if (expense.count === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const updated = await prisma.expense.findUnique({
    where: { id: params.id },
    include: { category: true },
  })

  return NextResponse.json(updated)
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const deleted = await prisma.expense.deleteMany({
    where: { id: params.id, userId: user.id },
  })

  if (deleted.count === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
