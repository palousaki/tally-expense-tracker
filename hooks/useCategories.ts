'use client'

import { useEffect } from 'react'
import { useExpenseStore } from '@/store/useExpenseStore'

export function useCategories() {
  const { categories, setCategories } = useExpenseStore()

  useEffect(() => {
    if (categories.length > 0) return
    fetch('/api/categories')
      .then((r) => r.json())
      .then(setCategories)
      .catch(console.error)
  }, [categories.length, setCategories])

  return categories
}
