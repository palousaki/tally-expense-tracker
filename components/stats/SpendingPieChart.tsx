'use client'

import { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector } from 'recharts'
import { getCategoryColor } from '@/lib/categories'
import { formatCurrency } from '@/lib/utils'
import type { ExpenseWithCategory } from '@/types'

interface SpendingPieChartProps {
  expenses: ExpenseWithCategory[]
}

export function SpendingPieChart({ expenses }: SpendingPieChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const byCategory = expenses.reduce<Record<string, { name: string; icon: string; colorKey: string; value: number }>>((acc, e) => {
    const id = e.categoryId
    if (!acc[id]) acc[id] = { name: e.category.name, icon: e.category.icon, colorKey: e.category.colorKey, value: 0 }
    acc[id].value += e.amount
    return acc
  }, {})

  const data = Object.values(byCategory).sort((a, b) => b.value - a.value)
  const total = data.reduce((s, d) => s + d.value, 0)

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-4xl mb-3">📊</p>
        <p className="text-gray-500 text-sm">No expenses this month</p>
      </div>
    )
  }

  const renderActiveShape = (props: {
    cx: number; cy: number; innerRadius: number; outerRadius: number
    startAngle: number; endAngle: number; fill: string
  }) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props
    return (
      <g>
        <Sector cx={cx} cy={cy} innerRadius={innerRadius - 4} outerRadius={outerRadius + 6}
          startAngle={startAngle} endAngle={endAngle} fill={fill} />
      </g>
    )
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            dataKey="value"
            activeIndex={activeIndex ?? undefined}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            activeShape={renderActiveShape as any}
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={getCategoryColor(entry.colorKey).hex} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
            contentStyle={{ borderRadius: '12px', border: '1px solid #f0f0f0', fontSize: '13px' }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="space-y-2 mt-2">
        {data.map((entry, i) => {
          const color = getCategoryColor(entry.colorKey)
          const pct = ((entry.value / total) * 100).toFixed(1)
          return (
            <div
              key={i}
              className="flex items-center gap-2.5 cursor-pointer"
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color.hex }} />
              <span className="text-sm text-gray-600 flex-1">{entry.icon} {entry.name}</span>
              <span className="text-xs text-gray-400">{pct}%</span>
              <span className="text-sm font-medium tabular-nums text-gray-900">{formatCurrency(entry.value)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
