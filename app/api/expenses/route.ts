import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const month = searchParams.get('month') ? parseInt(searchParams.get('month')!) : null
  const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : null
  const categoryId = searchParams.get('categoryId')
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20
  const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0

  const where: Record<string, unknown> = { userId: user.id }

  if (month && year) {
    const start = new Date(year, month - 1, 1)
    const end = new Date(year, month, 1)
    where.date = { gte: start, lt: end }
  }

  if (categoryId) where.categoryId = categoryId

  const expenses = await prisma.expense.findMany({
    where,
    include: { category: true },
    orderBy: { date: 'desc' },
    take: limit,
    skip: offset,
  })

  return NextResponse.json(expenses)
}

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { amount, categoryId, date, note } = body

  if (!amount || amount <= 0) {
    return NextResponse.json({ error: 'Amount must be greater than 0' }, { status: 400 })
  }
  if (!categoryId) {
    return NextResponse.json({ error: 'Category is required' }, { status: 400 })
  }

  const expense = await prisma.expense.create({
    data: {
      userId: user.id,
      categoryId,
      amount: parseFloat(amount),
      note: note ?? null,
      date: date ? new Date(date) : new Date(),
    },
    include: { category: true },
  })

  return NextResponse.json(expense, { status: 201 })
}
