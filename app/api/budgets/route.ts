import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const month = parseInt(searchParams.get('month') ?? String(new Date().getMonth() + 1))
  const year = parseInt(searchParams.get('year') ?? String(new Date().getFullYear()))

  const start = new Date(year, month - 1, 1)
  const end = new Date(year, month, 1)

  const [budgets, expenses] = await Promise.all([
    prisma.budget.findMany({
      where: { userId: user.id, month, year },
      include: { category: true },
    }),
    prisma.expense.groupBy({
      by: ['categoryId'],
      where: { userId: user.id, date: { gte: start, lt: end } },
      _sum: { amount: true },
    }),
  ])

  const spentMap = Object.fromEntries(
    expenses.map((e) => [e.categoryId, e._sum.amount ?? 0])
  )

  const result = budgets.map((b) => ({
    ...b,
    spent: spentMap[b.categoryId] ?? 0,
  }))

  return NextResponse.json(result)
}

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { categoryId, amount, month, year } = body

  if (!categoryId || !amount || !month || !year) {
    return NextResponse.json({ error: 'categoryId, amount, month, year are required' }, { status: 400 })
  }

  const budget = await prisma.budget.upsert({
    where: { userId_categoryId_month_year: { userId: user.id, categoryId, month, year } },
    update: { amount: parseFloat(amount) },
    create: { userId: user.id, categoryId, amount: parseFloat(amount), month, year },
    include: { category: true },
  })

  return NextResponse.json(budget, { status: 201 })
}
