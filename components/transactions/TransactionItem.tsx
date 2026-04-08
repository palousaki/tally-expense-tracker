'use client'

import { useState } from 'react'
import { Trash2, Pencil } from 'lucide-react'
import { getCategoryColor } from '@/lib/categories'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import type { ExpenseWithCategory } from '@/types'

interface TransactionItemProps {
  expense: ExpenseWithCategory
  onDelete: (id: string) => void
  onEdit: (expense: ExpenseWithCategory) => void
}

export function TransactionItem({ expense, onDelete, onEdit }: TransactionItemProps) {
  const [confirming, setConfirming] = useState(false)
  const color = getCategoryColor(expense.category.colorKey)

  async function handleDelete() {
    if (!confirming) { setConfirming(true); return }
    await fetch(`/api/expenses/${expense.id}`, { method: 'DELETE' })
    onDelete(expense.id)
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3.5 group">
      <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0', color.bg)}>
        <span className="text-base">{expense.category.icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {expense.note || expense.category.name}
        </p>
        <p className="text-xs text-gray-400">{expense.category.name} · {formatDate(expense.date)}</p>
      </div>
      <p className="text-sm font-semibold tabular-nums text-gray-900 flex-shrink-0 mr-2">
        -{formatCurrency(expense.amount)}
      </p>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button
          onClick={() => onEdit(expense)}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={handleDelete}
          className={cn(
            'p-1.5 rounded-lg text-gray-400 transition-colors',
            confirming ? 'bg-red-50 text-red-600 opacity-100' : 'hover:bg-gray-100 hover:text-red-500'
          )}
          title={confirming ? 'Click again to confirm' : 'Delete'}
          onBlur={() => setConfirming(false)}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}
