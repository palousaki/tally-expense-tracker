'use client'

import { useRouter } from 'next/navigation'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { getCategoryColor } from '@/lib/categories'
import { formatCurrency, cn } from '@/lib/utils'
import type { ExpenseWithCategory } from '@/types'

interface CategoryBreakdownProps {
  expenses: ExpenseWithCategory[]
  className?: string
}

export function CategoryBreakdown({ expenses, className }: CategoryBreakdownProps) {
  const router = useRouter()

  // Aggregate by category
  const byCategory = expenses.reduce<
    Record<string, { name: string; icon: string; colorKey: string; total: number; categoryId: string }>
  >((acc, e) => {
    const id = e.categoryId
    if (!acc[id]) {
      acc[id] = {
        categoryId: id,
        name: e.category.name,
        icon: e.category.icon,
        colorKey: e.category.colorKey,
        total: 0,
      }
    }
    acc[id].total += e.amount
    return acc
  }, {})

  const sorted = Object.values(byCategory).sort((a, b) => b.total - a.total)
  const maxTotal = sorted[0]?.total ?? 1

  if (sorted.length === 0) {
    return (
      <div className={cn('mx-4 mt-4 p-6 bg-white rounded-2xl border border-gray-100 text-center', className)}>
        <p className="text-3xl mb-2">🧾</p>
        <p className="text-gray-500 text-sm">No expenses this month</p>
      </div>
    )
  }

  return (
    <div className={cn('mx-4 mt-4 bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50', className)}>
      {sorted.map((cat) => {
        const color = getCategoryColor(cat.colorKey)
        const pct = (cat.total / maxTotal) * 100
        return (
          <button
            key={cat.categoryId}
            onClick={() => router.push(`/transactions?categoryId=${cat.categoryId}`)}
            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors text-left"
          >
            <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0', color.bg)}>
              <span className="text-base">{cat.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{cat.name}</p>
              <ProgressBar value={pct} barClass={color.bar} className="mt-1" />
            </div>
            <p className="text-sm font-semibold tabular-nums text-gray-900 flex-shrink-0">
              {formatCurrency(cat.total)}
            </p>
          </button>
        )
      })}
    </div>
  )
}
