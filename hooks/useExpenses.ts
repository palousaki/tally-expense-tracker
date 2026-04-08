'use client'

import { useEffect, useCallback } from 'react'
import { useExpenseStore } from '@/store/useExpenseStore'

export function useExpenses() {
  const { expenses, selectedMonth, setExpenses, addExpense, updateExpense, deleteExpense } =
    useExpenseStore()

  const fetchExpenses = useCallback(async () => {
    const { month, year } = useExpenseStore.getState().selectedMonth
    const res = await fetch(`/api/expenses?month=${month}&year=${year}`)
    const data = await res.json()
    setExpenses(data)
  }, [setExpenses])

  useEffect(() => {
    fetchExpenses()
  }, [fetchExpenses, selectedMonth.month, selectedMonth.year])

  return { expenses, fetchExpenses, addExpense, updateExpense, deleteExpense }
}
