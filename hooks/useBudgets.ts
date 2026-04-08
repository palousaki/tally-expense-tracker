'use client'

import { useEffect, useCallback } from 'react'
import { useExpenseStore } from '@/store/useExpenseStore'

export function useBudgets() {
  const { budgets, selectedMonth, setBudgets } = useExpenseStore()

  const fetchBudgets = useCallback(async () => {
    const { month, year } = useExpenseStore.getState().selectedMonth
    const res = await fetch(`/api/budgets?month=${month}&year=${year}`)
    const data = await res.json()
    setBudgets(data)
  }, [setBudgets])

  useEffect(() => {
    fetchBudgets()
  }, [fetchBudgets, selectedMonth.month, selectedMonth.year])

  return { budgets, fetchBudgets }
}
