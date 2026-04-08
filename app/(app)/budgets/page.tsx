import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { BudgetsClient } from './BudgetsClient'

export default async function BudgetsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()
  const start = new Date(year, month - 1, 1)
  const end = new Date(year, month, 1)

  const [categories, budgets, expenses] = await Promise.all([
    prisma.category.findMany({
      where: { userId: user.id },
      orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
    }),
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

  const budgetsWithSpent = budgets.map((b) => ({
    ...b,
    spent: spentMap[b.categoryId] ?? 0,
  }))

  return (
    <BudgetsClient
      initialCategories={JSON.parse(JSON.stringify(categories))}
      initialBudgets={JSON.parse(JSON.stringify(budgetsWithSpent))}
      spentMap={spentMap}
      month={month}
      year={year}
    />
  )
}
