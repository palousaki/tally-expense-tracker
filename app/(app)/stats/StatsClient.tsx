'use client'

import { useState } from 'react'
import { SpendingPieChart } from '@/components/stats/SpendingPieChart'
import { MonthlyBarChart } from '@/components/stats/MonthlyBarChart'
import { cn } from '@/lib/utils'
import type { ExpenseWithCategory } from '@/types'

interface StatsClientProps {
  initialExpenses: ExpenseWithCategory[]
  barData: { month: string; total: number; isCurrent: boolean }[]
  month: number
  year: number
}

type Tab = 'category' | 'monthly'

export function StatsClient({ initialExpenses, barData, month, year }: StatsClientProps) {
  const [tab, setTab] = useState<Tab>('category')
  const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' })

  return (
    <>
      <div className="px-4 pt-5 pb-2 md:px-6 md:pt-6">
        <h1 className="text-xl font-bold text-gray-900">Stats</h1>
        <p className="text-sm text-gray-400">{monthName} {year}</p>
      </div>

      {/* Segmented control */}
      <div className="px-4 md:px-6 mb-4">
        <div className="inline-flex bg-gray-100 rounded-xl p-1">
          {([['category', 'By category'], ['monthly', 'Monthly trend']] as [Tab, string][]).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setTab(value)}
              className={cn(
                'px-4 py-1.5 rounded-lg text-sm font-medium transition-all',
                tab === value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-4 md:mx-6 bg-white rounded-2xl border border-gray-100 p-4 md:p-6">
        {tab === 'category' ? (
          <SpendingPieChart expenses={initialExpenses} />
        ) : (
          <>
            <p className="text-sm font-medium text-gray-700 mb-4">Last 6 months</p>
            <MonthlyBarChart data={barData} />
          </>
        )}
      </div>
    </>
  )
}
