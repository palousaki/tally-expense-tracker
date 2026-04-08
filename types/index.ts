export type { User, Category, Expense, Budget } from '@prisma/client'

export interface CategoryWithColor {
  id: string
  userId: string
  name: string
  icon: string
  colorKey: string
  isDefault: boolean
}

export interface ExpenseWithCategory {
  id: string
  userId: string
  categoryId: string
  category: CategoryWithColor
  amount: number
  note: string | null
  date: Date | string
  createdAt: Date | string
}

export interface BudgetWithCategory {
  id: string
  userId: string
  categoryId: string
  category: CategoryWithColor
  amount: number
  month: number
  year: number
  spent?: number
}
