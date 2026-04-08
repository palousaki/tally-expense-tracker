import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { DEFAULT_CATEGORIES } from '@/lib/categories'
import { DashboardClient } from './DashboardClient'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()
  const start = new Date(year, month - 1, 1)
  const end = new Date(year, month, 1)

  // Upsert the Prisma user record in case signup setup was skipped
  let dbUser = await prisma.user.findUnique({ where: { id: user.id } })
  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        id: user.id,
        email: user.email!,
        name: (user.user_metadata?.name as string) ?? null,
        avatar_url: (user.user_metadata?.avatar_url as string) ?? null,
        categories: {
          create: DEFAULT_CATEGORIES.map((cat) => ({ ...cat, isDefault: true })),
        },
      },
    })
  }

  const [categories, expenses, budgets] = await Promise.all([
    prisma.category.findMany({
      where: { userId: user.id },
      orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
    }),
    prisma.expense.findMany({
      where: { userId: user.id, date: { gte: start, lt: end } },
      include: { category: true },
      orderBy: { date: 'desc' },
    }),
    prisma.budget.findMany({
      where: { userId: user.id, month, year },
      include: { category: true },
    }),
  ])

  const spentByCategory = expenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.categoryId] = (acc[e.categoryId] ?? 0) + e.amount
    return acc
  }, {})

  const budgetsWithSpent = budgets.map((b) => ({
    ...b,
    spent: spentByCategory[b.categoryId] ?? 0,
  }))

  return (
    <DashboardClient
      userName={dbUser.name ?? user.email ?? null}
      avatarUrl={dbUser.avatar_url ?? null}
      initialExpenses={JSON.parse(JSON.stringify(expenses))}
      initialCategories={JSON.parse(JSON.stringify(categories))}
      initialBudgets={JSON.parse(JSON.stringify(budgetsWithSpent))}
      month={month}
      year={year}
    />
  )
}
