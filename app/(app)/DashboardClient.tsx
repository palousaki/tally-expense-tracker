'use client'

import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { TopBar } from '@/components/layout/TopBar'
import { BudgetSummaryCard } from '@/components/dashboard/BudgetSummaryCard'
import { CategoryBreakdown } from '@/components/dashboard/CategoryBreakdown'
import { RecentTransactions } from '@/components/dashboard/RecentTransactions'
import { AddExpenseModal } from '@/components/transactions/AddExpenseModal'
import { useExpenseStore } from '@/store/useExpenseStore'
import type { ExpenseWithCategory, CategoryWithColor, BudgetWithCategory } from '@/types'

interface DashboardClientProps {
  userName: string | null
  avatarUrl: string | null
  initialExpenses: ExpenseWithCategory[]
  initialCategories: CategoryWithColor[]
  initialBudgets: BudgetWithCategory[]
  month: number
  year: number
}

export function DashboardClient({
  userName,
  avatarUrl,
  initialExpenses,
  initialCategories,
  initialBudgets,
  month,
  year,
}: DashboardClientProps) {
  const { expenses, categories, budgets, setExpenses, setCategories, setBudgets } =
    useExpenseStore()
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    setExpenses(initialExpenses)
    setCategories(initialCategories)
    setBudgets(initialBudgets)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const displayExpenses = expenses.length > 0 ? expenses : initialExpenses
  const displayCategories = categories.length > 0 ? categories : initialCategories
  const displayBudgets = budgets.length > 0 ? budgets : initialBudgets

  return (
    <>
      <TopBar showGreeting userName={userName} avatarUrl={avatarUrl} />

      {/* Mobile: single column. Desktop: 2-column grid */}
      <div className="md:grid md:grid-cols-2 md:gap-6 md:px-6 md:pb-6 md:items-start">

        {/* Left column */}
        <div className="md:space-y-4">
          <BudgetSummaryCard
            expenses={displayExpenses}
            budgets={displayBudgets}
            month={month}
            year={year}
            className="md:mx-0 md:mt-0"
          />
          <div className="mt-4 mx-4 md:mt-0 md:mx-0">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">By category</h2>
          </div>
          <CategoryBreakdown
            expenses={displayExpenses}
            className="md:mx-0 md:mt-0"
          />
        </div>

        {/* Right column */}
        <div>
          <RecentTransactions
            expenses={displayExpenses}
            className="md:mx-0 md:mt-0"
          />
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => setModalOpen(true)}
        className="fixed bottom-20 right-4 z-30 md:bottom-6 md:right-6 w-14 h-14 bg-gray-900 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-800 active:scale-95 transition-all"
        aria-label="Add expense"
      >
        <Plus size={24} />
      </button>

      <AddExpenseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        categories={displayCategories}
      />
    </>
  )
}
