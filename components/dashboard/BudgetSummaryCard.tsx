'use client'

import { ProgressBar } from '@/components/ui/ProgressBar'
import { formatCurrency, cn } from '@/lib/utils'
import type { BudgetWithCategory } from '@/types'
import type { ExpenseWithCategory } from '@/types'

interface BudgetSummaryCardProps {
  expenses: ExpenseWithCategory[]
  budgets: BudgetWithCategory[]
  month: number
  year: number
  className?: string
}

export function BudgetSummaryCard({ expenses, budgets, month, year, className }: BudgetSummaryCardProps) {
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0)
  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0)
  const pct = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0
  const overBudget = totalSpent > totalBudget && totalBudget > 0

  const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' })

  return (
    <div className={cn('mx-4 rounded-2xl bg-gray-900 text-white p-5', className)}>
      <div className="flex items-center justify-between mb-1">
        <p className="text-gray-400 text-sm">{monthName} {year}</p>
        {overBudget && (
          <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-medium">
            Over budget
          </span>
        )}
      </div>
      <p className="text-3xl font-bold tabular-nums">{formatCurrency(totalSpent)}</p>
      {totalBudget > 0 && (
        <p className="text-gray-400 text-sm mt-0.5">of {formatCurrency(totalBudget)} budget</p>
      )}

      {totalBudget > 0 && (
        <div className="mt-4">
          <ProgressBar
            value={pct}
            barClass="bg-white"
            overBudget={overBudget}
            className="bg-gray-700"
          />
          <p className="text-gray-400 text-xs mt-1.5">
            {overBudget
              ? `${formatCurrency(totalSpent - totalBudget)} over`
              : `${formatCurrency(totalBudget - totalSpent)} remaining`}
          </p>
        </div>
      )}

      {totalBudget === 0 && (
        <p className="text-gray-500 text-sm mt-3">No budgets set for this month</p>
      )}
    </div>
  )
}
