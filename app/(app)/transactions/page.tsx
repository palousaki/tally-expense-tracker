import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { TransactionsClient } from './TransactionsClient'

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: { categoryId?: string }
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()
  const start = new Date(year, month - 1, 1)
  const end = new Date(year, month, 1)

  const [categories, expenses] = await Promise.all([
    prisma.category.findMany({
      where: { userId: user.id },
      orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
    }),
    prisma.expense.findMany({
      where: { userId: user.id, date: { gte: start, lt: end } },
      include: { category: true },
      orderBy: { date: 'desc' },
    }),
  ])

  return (
    <TransactionsClient
      initialExpenses={JSON.parse(JSON.stringify(expenses))}
      initialCategories={JSON.parse(JSON.stringify(categories))}
      initialMonth={month}
      initialYear={year}
      initialCategoryFilter={searchParams.categoryId ?? null}
    />
  )
}
