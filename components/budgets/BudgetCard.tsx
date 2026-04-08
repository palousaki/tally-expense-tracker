'use client'

import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { getCategoryColor } from '@/lib/categories'
import { cn, formatCurrency } from '@/lib/utils'
import type { BudgetWithCategory, CategoryWithColor } from '@/types'

interface BudgetCardProps {
  budget?: BudgetWithCategory
  category: CategoryWithColor
  spent: number
  month: number
  year: number
  onSaved: (budget: BudgetWithCategory) => void
}

export function BudgetCard({ budget, category, spent, month, year, onSaved }: BudgetCardProps) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(String(budget?.amount ?? ''))
  const [saving, setSaving] = useState(false)

  const color = getCategoryColor(category.colorKey)
  const pct = budget ? (spent / budget.amount) * 100 : 0
  const overBudget = budget ? spent > budget.amount : false

  async function handleSave() {
    const amount = parseFloat(value)
    if (!amount || amount <= 0) return
    setSaving(true)
    const res = await fetch('/api/budgets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categoryId: category.id, amount, month, year }),
    })
    const saved = await res.json()
    onSaved({ ...saved, spent })
    setEditing(false)
    setSaving(false)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0', color.bg)}>
          <span className="text-base">{category.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{category.name}</p>
          {budget ? (
            <p className="text-xs text-gray-400">
              {formatCurrency(spent)} of {formatCurrency(budget.amount)}
            </p>
          ) : (
            <p className="text-xs text-gray-400">No budget set</p>
          )}
        </div>
        {overBudget && (
          <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-medium flex-shrink-0">
            Over
          </span>
        )}
      </div>

      {budget && (
        <div className="mb-3">
          <ProgressBar value={pct} barClass={color.bar} overBudget={overBudget} />
          <p className={cn('text-xs mt-1', overBudget ? 'text-red-500' : 'text-gray-400')}>
            {overBudget
              ? `${formatCurrency(spent - budget.amount)} over budget`
              : `${formatCurrency(budget.amount - spent)} remaining`}
          </p>
        </div>
      )}

      {editing ? (
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center border border-gray-200 rounded-xl overflow-hidden">
            <span className="pl-3 text-gray-400 text-sm">€</span>
            <input
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0.01"
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="flex-1 px-2 py-2 text-sm outline-none tabular-nums"
              placeholder="0.00"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="p-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 disabled:opacity-50"
          >
            <Check size={16} />
          </button>
          <button
            onClick={() => { setEditing(false); setValue(String(budget?.amount ?? '')) }}
            className="p-2 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => { setValue(String(budget?.amount ?? '')); setEditing(true) }}
          className={cn(
            'w-full py-1.5 rounded-xl text-xs font-medium border transition-colors',
            budget
              ? 'border-gray-200 text-gray-500 hover:bg-gray-50'
              : `${color.bg} ${color.text} ${color.border} hover:opacity-90`
          )}
        >
          {budget ? 'Edit budget' : 'Set budget'}
        </button>
      )}
    </div>
  )
}
