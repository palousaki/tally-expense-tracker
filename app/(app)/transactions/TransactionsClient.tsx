'use client'

import { useState, useMemo } from 'react'
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { TransactionItem } from '@/components/transactions/TransactionItem'
import { EditExpenseModal } from '@/components/transactions/EditExpenseModal'
import { AddExpenseModal } from '@/components/transactions/AddExpenseModal'
import { getCategoryColor } from '@/lib/categories'
import { cn } from '@/lib/utils'
import { useExpenseStore } from '@/store/useExpenseStore'
import type { ExpenseWithCategory, CategoryWithColor } from '@/types'

interface TransactionsClientProps {
  initialExpenses: ExpenseWithCategory[]
  initialCategories: CategoryWithColor[]
  initialMonth: number
  initialYear: number
  initialCategoryFilter: string | null
}

type SortOption = 'newest' | 'oldest' | 'highest'

export function TransactionsClient({
  initialExpenses,
  initialCategories,
  initialMonth,
  initialYear,
  initialCategoryFilter,
}: TransactionsClientProps) {
  const { expenses, categories, setExpenses, setCategories, addExpense, updateExpense, deleteExpense } =
    useExpenseStore()

  const displayExpenses = expenses.length > 0 ? expenses : initialExpenses
  const displayCategories = categories.length > 0 ? categories : initialCategories

  const [month, setMonth] = useState(initialMonth)
  const [year, setYear] = useState(initialYear)
  const [categoryFilter, setCategoryFilter] = useState<string | null>(initialCategoryFilter)
  const [sort, setSort] = useState<SortOption>('newest')
  const [editingExpense, setEditingExpense] = useState<ExpenseWithCategory | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [loadingMonth, setLoadingMonth] = useState(false)

  async function changeMonth(delta: number) {
    let newMonth = month + delta
    let newYear = year
    if (newMonth > 12) { newMonth = 1; newYear++ }
    if (newMonth < 1) { newMonth = 12; newYear-- }

    setLoadingMonth(true)
    const res = await fetch(`/api/expenses?month=${newMonth}&year=${newYear}`)
    const data = await res.json()
    setExpenses(data)
    setMonth(newMonth)
    setYear(newYear)
    setLoadingMonth(false)
  }

  const filtered = useMemo(() => {
    let list = [...displayExpenses]
    if (categoryFilter) list = list.filter((e) => e.categoryId === categoryFilter)
    if (sort === 'newest') list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    if (sort === 'oldest') list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    if (sort === 'highest') list.sort((a, b) => b.amount - a.amount)
    return list
  }, [displayExpenses, categoryFilter, sort])

  const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' })

  return (
    <>
      <div className="px-4 pt-5 pb-2 md:px-6 md:pt-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Transactions</h1>
        <button
          onClick={() => setAddOpen(true)}
          className="w-9 h-9 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Month picker */}
      <div className="px-4 md:px-6 mb-3 flex items-center gap-2">
        <button onClick={() => changeMonth(-1)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
          <ChevronLeft size={18} />
        </button>
        <span className="text-sm font-medium text-gray-900 min-w-[100px] text-center">
          {monthName} {year}
        </span>
        <button onClick={() => changeMonth(1)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Category filter pills */}
      <div className="px-4 md:px-6 mb-3 flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setCategoryFilter(null)}
          className={cn(
            'flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium border transition-all',
            !categoryFilter ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200'
          )}
        >
          All
        </button>
        {displayCategories.map((cat) => {
          const color = getCategoryColor(cat.colorKey)
          const active = categoryFilter === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(active ? null : cat.id)}
              className={cn(
                'flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all',
                active ? `${color.bg} ${color.text} ${color.border}` : 'bg-white text-gray-600 border-gray-200'
              )}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          )
        })}
      </div>

      {/* Sort */}
      <div className="px-4 md:px-6 mb-4 flex gap-2">
        {(['newest', 'oldest', 'highest'] as SortOption[]).map((opt) => (
          <button
            key={opt}
            onClick={() => setSort(opt)}
            className={cn(
              'px-3 py-1 rounded-lg text-xs font-medium border transition-all capitalize',
              sort === opt ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-200'
            )}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* List */}
      {loadingMonth ? (
        <div className="mx-4 md:mx-6 bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400 text-sm">
          Loading…
        </div>
      ) : filtered.length === 0 ? (
        <div className="mx-4 md:mx-6 bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <p className="text-3xl mb-2">🧾</p>
          <p className="text-gray-500 text-sm">No transactions found</p>
        </div>
      ) : (
        <div className="mx-4 md:mx-6 bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
          {filtered.map((expense) => (
            <TransactionItem
              key={expense.id}
              expense={expense}
              onDelete={deleteExpense}
              onEdit={setEditingExpense}
            />
          ))}
        </div>
      )}

      <EditExpenseModal
        expense={editingExpense}
        open={!!editingExpense}
        onClose={() => setEditingExpense(null)}
        categories={displayCategories}
        onSaved={(updated) => {
          updateExpense(updated.id, updated)
          setEditingExpense(null)
        }}
      />

      <AddExpenseModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        categories={displayCategories}
      />

      {/* FAB */}
      <button
        onClick={() => setAddOpen(true)}
        className="fixed bottom-20 right-4 z-30 md:bottom-6 md:right-6 w-14 h-14 bg-gray-900 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-800 active:scale-95 transition-all md:hidden"
        aria-label="Add expense"
      >
        <Plus size={24} />
      </button>
    </>
  )
}
