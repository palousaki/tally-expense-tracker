'use client'

import { useState } from 'react'
import { Copy } from 'lucide-react'
import { BudgetCard } from '@/components/budgets/BudgetCard'
import type { BudgetWithCategory, CategoryWithColor } from '@/types'

interface BudgetsClientProps {
  initialCategories: CategoryWithColor[]
  initialBudgets: BudgetWithCategory[]
  spentMap: Record<string, number>
  month: number
  year: number
}

export function BudgetsClient({
  initialCategories,
  initialBudgets,
  spentMap,
  month,
  year,
}: BudgetsClientProps) {
  const [budgets, setBudgets] = useState<BudgetWithCategory[]>(initialBudgets)
  const [copying, setCopying] = useState(false)

  const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' })

  function handleSaved(updated: BudgetWithCategory) {
    setBudgets((prev) => {
      const exists = prev.find((b) => b.id === updated.id)
      if (exists) return prev.map((b) => (b.id === updated.id ? updated : b))
      return [...prev, updated]
    })
  }

  async function copyLastMonth() {
    setCopying(true)
    const prevMonth = month === 1 ? 12 : month - 1
    const prevYear = month === 1 ? year - 1 : year
    const res = await fetch(`/api/budgets?month=${prevMonth}&year=${prevYear}`)
    const lastMonth: BudgetWithCategory[] = await res.json()

    if (lastMonth.length === 0) {
      alert('No budgets found for last month.')
      setCopying(false)
      return
    }

    const copies = await Promise.all(
      lastMonth.map((b) =>
        fetch('/api/budgets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ categoryId: b.categoryId, amount: b.amount, month, year }),
        }).then((r) => r.json())
      )
    )

    setBudgets(copies.map((b) => ({ ...b, spent: spentMap[b.categoryId] ?? 0 })))
    setCopying(false)
  }

  return (
    <>
      <div className="px-4 pt-5 pb-2 md:px-6 md:pt-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Budgets</h1>
          <p className="text-sm text-gray-400">{monthName} {year}</p>
        </div>
        <button
          onClick={copyLastMonth}
          disabled={copying}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          <Copy size={14} />
          Copy last month
        </button>
      </div>

      <div className="px-4 md:px-6 mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 pb-6">
        {initialCategories.map((cat) => {
          const budget = budgets.find((b) => b.categoryId === cat.id)
          return (
            <BudgetCard
              key={cat.id}
              budget={budget}
              category={cat}
              spent={spentMap[cat.id] ?? 0}
              month={month}
              year={year}
              onSaved={handleSaved}
            />
          )
        })}
      </div>
    </>
  )
}
