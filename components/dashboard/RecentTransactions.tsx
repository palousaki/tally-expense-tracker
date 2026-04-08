'use client'

import Link from 'next/link'
import { getCategoryColor } from '@/lib/categories'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import type { ExpenseWithCategory } from '@/types'

interface RecentTransactionsProps {
  expenses: ExpenseWithCategory[]
  className?: string
}

export function RecentTransactions({ expenses, className }: RecentTransactionsProps) {
  const recent = expenses.slice(0, 5)

  return (
    <div className={cn('mx-4 mt-4', className)}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-900">Recent</h2>
        <Link href="/transactions" className="text-xs text-gray-500 hover:text-gray-700">
          See all
        </Link>
      </div>

      {recent.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
          <p className="text-gray-500 text-sm">No transactions yet</p>
          <p className="text-gray-400 text-xs mt-1">Tap + to add your first expense</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
          {recent.map((expense) => {
            const color = getCategoryColor(expense.category.colorKey)
            return (
              <div key={expense.id} className="flex items-center gap-3 px-4 py-3.5">
                <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0', color.bg)}>
                  <span className="text-base">{expense.category.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {expense.note || expense.category.name}
                  </p>
                  <p className="text-xs text-gray-400">{formatDate(expense.date)}</p>
                </div>
                <p className="text-sm font-semibold tabular-nums text-gray-900 flex-shrink-0">
                  -{formatCurrency(expense.amount)}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
