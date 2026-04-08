import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { StatsClient } from './StatsClient'

export default async function StatsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()

  // Current month expenses (for pie chart)
  const start = new Date(year, month - 1, 1)
  const end = new Date(year, month, 1)

  // Last 6 months totals (for bar chart)
  const sixMonthsAgo = new Date(year, month - 7, 1)

  const [currentExpenses, monthlyTotals] = await Promise.all([
    prisma.expense.findMany({
      where: { userId: user.id, date: { gte: start, lt: end } },
      include: { category: true },
      orderBy: { date: 'desc' },
    }),
    prisma.expense.groupBy({
      by: ['date'],
      where: { userId: user.id, date: { gte: sixMonthsAgo, lt: end } },
      _sum: { amount: true },
    }),
  ])

  // Aggregate monthly totals
  const monthMap: Record<string, number> = {}
  for (const row of monthlyTotals) {
    const d = new Date(row.date)
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`
    monthMap[key] = (monthMap[key] ?? 0) + (row._sum.amount ?? 0)
  }

  const barData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(year, month - 1 - (5 - i), 1)
    const m = d.getMonth() + 1
    const y = d.getFullYear()
    const key = `${y}-${m}`
    return {
      month: d.toLocaleString('default', { month: 'short' }),
      total: monthMap[key] ?? 0,
      isCurrent: m === month && y === year,
    }
  })

  return (
    <StatsClient
      initialExpenses={JSON.parse(JSON.stringify(currentExpenses))}
      barData={barData}
      month={month}
      year={year}
    />
  )
}
