'use client'

import { useState, useEffect, useRef } from 'react'
import { Modal } from '@/components/ui/Modal'
import { getCategoryColor } from '@/lib/categories'
import { cn } from '@/lib/utils'
import { useExpenseStore } from '@/store/useExpenseStore'
import type { CategoryWithColor, ExpenseWithCategory } from '@/types'

interface AddExpenseModalProps {
  open: boolean
  onClose: () => void
  categories: CategoryWithColor[]
}

export function AddExpenseModal({ open, onClose, categories }: AddExpenseModalProps) {
  const addExpense = useExpenseStore((s) => s.addExpense)

  const [amount, setAmount] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('')
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const amountRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setAmount('')
      setSelectedCategoryId(categories[0]?.id ?? '')
      setDate(new Date().toISOString().split('T')[0])
      setNote('')
      setError(null)
      setTimeout(() => amountRef.current?.focus(), 100)
    }
  }, [open, categories])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const parsedAmount = parseFloat(amount)
    if (!parsedAmount || parsedAmount <= 0) {
      setError('Amount must be greater than 0')
      return
    }
    if (!selectedCategoryId) {
      setError('Please select a category')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parsedAmount,
          categoryId: selectedCategoryId,
          date,
          note: note || null,
        }),
      })

      if (!res.ok) throw new Error('Failed to save expense')

      const expense: ExpenseWithCategory = await res.json()
      addExpense(expense)
      onClose()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Add expense">
      <form onSubmit={handleSubmit} className="px-4 pb-6 space-y-5 md:px-6 md:pb-8">
        {/* Amount */}
        <div className="text-center pt-2">
          <div className="inline-flex items-center gap-1 border-b-2 border-gray-200 focus-within:border-gray-900 transition-colors pb-1">
            <span className="text-3xl font-light text-gray-400">€</span>
            <input
              ref={amountRef}
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              value={amount}
              onChange={(e) => {
                const v = e.target.value
                if (v === '' || /^\d*\.?\d{0,2}$/.test(v)) setAmount(v)
              }}
              className="text-4xl font-bold text-gray-900 w-36 text-center bg-transparent border-none outline-none tabular-nums placeholder:text-gray-200 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Category</p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((cat) => {
              const color = getCategoryColor(cat.colorKey)
              const active = selectedCategoryId === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={cn(
                    'flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all',
                    active
                      ? `${color.bg} ${color.text} ${color.border}`
                      : 'bg-gray-50 text-gray-600 border-gray-100'
                  )}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        {/* Note */}
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">Note (optional)</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Supermarket run"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 placeholder:text-gray-300"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Saving…' : 'Add expense'}
        </button>
      </form>
    </Modal>
  )
}
