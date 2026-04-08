import { create } from 'zustand'
import type { ExpenseWithCategory, CategoryWithColor, BudgetWithCategory } from '@/types'

interface ExpenseStore {
  expenses: ExpenseWithCategory[]
  categories: CategoryWithColor[]
  budgets: BudgetWithCategory[]
  selectedMonth: { month: number; year: number }

  setExpenses: (expenses: ExpenseWithCategory[]) => void
  addExpense: (expense: ExpenseWithCategory) => void
  updateExpense: (id: string, data: Partial<ExpenseWithCategory>) => void
  deleteExpense: (id: string) => void

  setCategories: (categories: CategoryWithColor[]) => void
  setBudgets: (budgets: BudgetWithCategory[]) => void
  setSelectedMonth: (month: number, year: number) => void
}

export const useExpenseStore = create<ExpenseStore>((set) => ({
  expenses: [],
  categories: [],
  budgets: [],
  selectedMonth: {
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  },

  setExpenses: (expenses) => set({ expenses }),
  addExpense: (expense) =>
    set((state) => ({ expenses: [expense, ...state.expenses] })),
  updateExpense: (id, data) =>
    set((state) => ({
      expenses: state.expenses.map((e) => (e.id === id ? { ...e, ...data } : e)),
    })),
  deleteExpense: (id) =>
    set((state) => ({ expenses: state.expenses.filter((e) => e.id !== id) })),

  setCategories: (categories) => set({ categories }),
  setBudgets: (budgets) => set({ budgets }),
  setSelectedMonth: (month, year) => set({ selectedMonth: { month, year } }),
}))
